//# CLIENT
/// <reference path="../app/application.ts"/>
/// <reference path="../async/delayed.ts"/>
/// <reference path="../lib/jquery.ts"/>
/// <reference path="../util/class.ts"/>
/// <reference path="../types.ts"/>



module kr3m.ui
{
	/*
		Diese Klasse stellt das Basiselement aller kr3m.ui Klassen dar.
		Es stellt Methoden zum Anlegen, Anzeigen, Verstecken und vor
		allem zum Verschachteln von Elementen zur Verfügung. Neue
		Elemente werden an bestehende angehängt, indem man das bestehende
		Element als Parent beim Erzeugen eines Elementes angibt.
	*/
	export class Element
	{
		public static VALID:string = "VALID";

		private htmlTag:string;
		private createAttributes:any;
		private scaleFactor:number = 1.0;

		private listeningForTouches = false;
		private touches:any[] = [];

		public parent:any = null;
		public children:kr3m.ui.Element[];
		public dom:JQuery;
		public validatePropagation = true;

		private static NEXT_FREE_ID:number = 1;

		private delayStage = new kr3m.async.Delayed();

		private static registeredVoClasses:{[id:string]:any} = {};
		private autoVoFields:{[id:string]:kr3m.ui.Element};



		public static getFreeId():string
		{
			return "ID_" + kr3m.ui.Element.NEXT_FREE_ID++;
		}



		constructor(parentElement:any = null, domQuery = "", htmlTag = "div", attributes:any = {})
		{
			this.children = [];
			this.htmlTag = htmlTag;
			this.createAttributes = attributes;
			this.dom = domQuery ? $(domQuery) : this.create();

			if (parentElement && parentElement instanceof kr3m.ui.Element)
				parentElement.addChild(this);
			else
				this.parent = parentElement;
		}



		/*
			Mit dieser Methode können Funktionsaufrufe so lange heraus
			gezögert werden, bis sich das Element auf der Stage befindet.
			Wird üblicherweise nur in Konstruktoren verwendet.
		*/
		public callOnStage(callback:Callback):void
		{
			this.delayStage.call(callback);
		}



		public create():any
		{
			var attributesText = "";
			for (var key in this.createAttributes)
				attributesText += " " + key + '="' + this.createAttributes[key] + '"';
			return $('<' + this.htmlTag + attributesText + '></' + this.htmlTag + '>');
		}



		public scrollIntoView(alignWithTop:boolean = true):void
		{
			this.dom[0].scrollIntoView(alignWithTop);
		}



		public scrollToBottom():void
		{
			this.dom.scrollTop(this.dom[0].scrollHeight);
		}



		public getTag():string
		{
			return this.dom.prop("tagName");
		}



		public addClass(className:string):void
		{
			this.dom.addClass(className);
		}



		public removeClass(className:string):void
		{
			this.dom.removeClass(className);
		}



		public hasClass(className:string):boolean
		{
			return this.dom.hasClass(className);
		}



		public getClasses():string[]
		{
			return this.dom.attr("class").split(" ");
		}



		public remove():void
		{
			this.dom.remove();
			this.onRemovedFromStage();
		}



		public detach():void
		{
			this.dom.detach();
			this.onRemovedFromStage();
		}



		public getId():string
		{
			return this.dom.attr("id");
		}



		public setId(id:string):void
		{
			this.dom.attr("id", id);
		}



		public setName(name:string):void
		{
			this.dom.attr("name", name);
		}



		public getName():string
		{
			return this.dom.attr("name");
		}



		public isInFullScreen():boolean
		{
			var domElement = this.dom.get(0);
			var fieldNames =
			[
				"fullscreenElement",
				"mozFullScreenElement",
				"webkitFullscreenElement"
			];
			for (var i = 0; i < fieldNames.length; ++i)
			{
				if (document[fieldNames[i]] == domElement)
					return true;
			}
			return false;
		}



		/*
			Schaltet den Vollbildmodus des Browsers ein (sofern vorhanden)
			und stellt dieses Element vollflächig in diesem dar. Gibt true
			zurück wenn der Vollbildmodus erfolgreich aktiviert wurde und
			false falls nicht.
		*/
		public enterFullscreen():boolean
		{
			var funcNames =
			[
				"requestFullScreen",
				"requestFullscreen",
				"mozRequestFullScreen",
				"mozRequestFullscreen",
				"webkitRequestFullScreen",
				"webkitRequestFullscreen",
				"msRequestFullScreen",
				"msRequestFullscreen"
			];
			var d = this.dom.get(0);
			for (var i = 0; i < funcNames.length; ++i)
			{
				var func = d[funcNames[i]];
				if (func)
				{
					func.call(d);
					return true;
				}
			}
			kr3m.util.Log.logError("fullscreen mode not supported in this browser");
			return false;
		}



		public exitFullscreen():boolean
		{
			var funcNames =
			[
				"exitFullScreen",
				"exitFullscreen",
				"webkitExitFullscreen",
				"webkitExitFullScreen",
				"mozCancelFullscreen",
				"mozCancelFullScreen",
				"msExitFullscreen",
				"msExitFullScreen"
			];
			for (var i = 0; i < funcNames.length; ++i)
			{
				var func = document[funcNames[i]];
				if (func)
				{
					func.call(document);
					return true;
				}
			}
			return false;
		}



		/*
			Versetzt das Element in seinen Ausgangszustand und löscht
			eventuelle Änderungen durch den User oder andere Quellen.

			Diese Methode muss in abgeleiteten Klassen überschrieben
			werden, welche als automatisch erstellte Formularfelder
			dienen können sollen.
		*/
		public resetVoValue():void
		{
			// wird in abgeleiteten Klassen überschrieben
		}



		/*
			Gibt den aktuellen Zustand des Elementes als Wert zurück.
			Was genau das bedeutet, ist von der jeweiligen Element-Klasse
			abhängig.

			Diese Methode muss in abgeleiteten Klassen überschrieben
			werden, welche als automatisch erstellte Formularfelder
			dienen können sollen.
		*/
		public getVoValue():any
		{
			// wird in abgeleiteten Klassen überschrieben
			return null;
		}



		/*
			Setzt den Zustand des Elementes abhängig von value. Was
			genau das bedeutet, ist von der jeweiligen Element-Klasse
			abhängig.

			Diese Methode muss in abgeleiteten Klassen überschrieben
			werden, welche als automatisch erstellte Formularfelder
			dienen können sollen.
		*/
		public setVoValue(value:any):void
		{
			// wird in abgeleiteten Klassen überschrieben
		}



		/*
			Zeigt das Element an wenn es gerade nicht sichtbar ist
			und versteckt es, wenn es gerade sichtbar ist.
		*/
		public toggle():void
		{
			this.setVisible(!this.isVisible());
		}



		public setVisible(visible:boolean):void
		{
			if (visible)
				this.show();
			else
				this.hide();
		}



		public show():void
		{
			this.dom.show();
		}



		public hide():void
		{
			this.dom.hide();
		}



		public isVisible():boolean
		{
			return this.dom.is(":visible");
		}



		public fadeIn():void;
		public fadeIn(duration:number);
		public fadeIn(callback:Callback);
		public fadeIn(duration:number, callback:Callback);

		public fadeIn(
			durationOrCallback?:number | Function,
			callback?:Callback):void
		{
			this.dom.fadeIn(durationOrCallback, callback);
		}



		public fadeOut():void;
		public fadeOut(duration:number);
		public fadeOut(callback:Callback);
		public fadeOut(duration:number, callback:Callback);

		public fadeOut(
			durationOrCallback?:number | Function,
			callback?:Callback):void
		{
			this.dom.fadeOut(durationOrCallback, callback);
		}



		public validate():string
		{
			var result = kr3m.ui.Element.VALID;
			for (var i = 0; i < this.children.length; ++i)
			{
				if (!this.children[i].validatePropagation)
					continue;

				var validState = this.children[i].validate();
				if (validState != kr3m.ui.Element.VALID)
					result = validState;
			}

			return result;
		}



		public isValid():boolean
		{
			return this.validate() == kr3m.ui.Element.VALID;
		}



		public getApp():kr3m.app.Application
		{
			var iter = this.parent;
			while (iter)
			{
				if (iter instanceof kr3m.app.Application)
					return iter;
				else
					iter = iter.parent;
			}
			return null;
		}



		public getTrackingPart():string
		{
			//overwrite in subclasses if relevant for tracking
			return null;
		}



		public getTrackingId():string
		{
			var parts = [];
			var iter = this;
			while (iter)
			{
				if (iter instanceof Element)
				{
					var part = iter.getTrackingPart();
					if (part)
						parts.splice(0,0, part);
				}
				iter = iter.parent;
			}
			return parts.join('/');
		}



		public onAddedToStage():void
		{
			this.delayStage.execute();
		}



		public addChild(child:kr3m.ui.Element):void
		{
			child.parent = this;
			this.children.push(child);
			this.dom.append(child.dom);
			child.onAddedToStage();
		}



		public addChildAt(child:kr3m.ui.Element, index:number):void
		{
			index = Math.min(this.children.length, Math.max(0, index));

			if (index == 0)
				return this.prependChild(child);
			else if (index == this.children.length)
				return this.addChild(child);

			child.parent = this;
			var childAfter = this.children[index];
			this.children.splice(index, 0, child);
			child.dom.insertBefore(childAfter.dom);
			child.onAddedToStage();
		}



		public prependChild(child:kr3m.ui.Element):void
		{
			child.parent = this;
			this.children.unshift(child);
			this.dom.prepend(child.dom);
			child.onAddedToStage();
		}



		public onRemovedFromStage():void
		{
			// nichts machen
		}



		public removeChild(child:kr3m.ui.Element):void
		{
			for (var i = 0; i < this.children.length; ++i)
			{
				if (this.children[i] == child)
				{
					this.children.splice(i, 1);
					child.dom.detach();
					child.onRemovedFromStage();
					child.parent = null;
					return;
				}
			}
		}



		public isChild(child:kr3m.ui.Element):boolean
		{
			for (var i = 0; i < this.children.length; ++i)
				if (this.children[i] == child)
					return true;
			return false;
		}



		public getChildCount():number
		{
			return this.children.length;
		}



		public getChildByPosition(position:number):kr3m.ui.Element
		{
			return this.children[position];
		}



		public getChildrenOfClass(
			cls:any,
			recursive:boolean = false):kr3m.ui.Element[]
		{
			var result:kr3m.ui.Element[] = [];
			for (var i = 0; i < this.children.length; ++i)
			{
				if (this.children[i] instanceof cls)
					result.push(this.children[i]);

				if (recursive)
					result = result.concat(this.children[i].getChildrenOfClass(cls, true));
			}
			return result;
		}



		public removeAllChildren(
			removeHtmlToo:boolean = true):void
		{
			while (this.children.length > 0)
				this.removeChild(this.children[0]);

			if (removeHtmlToo)
				this.dom.empty();
		}



		/*
			Diese Methode wird automatisch aufgerufen, wenn sich
			die Fenstergröße der Anwendung in irgendeiner Art
			ändert. Wenn die Methode überschrieben wird, muss
			auch super.onSize(width, height) aufgerufen werden,
			wenn alle child-Elemente ebenfalls benachrichtigt
			werden sollen.
		*/
		public onSize(width:number, height:number):void
		{
			for (var i = 0; i < this.children.length; ++i)
				this.children[i].onSize(width, height);
		}



		/*
			Diese Methode wird automatisch aufgerufen, wenn sich
			die Orientierung der Anwendung ändert (von Portraitmodus
			auf Landschaftsmodus oder umgekehrt). Wenn die Methode
			überschrieben wird, muss auch
			super.onOrientation(isPortrait) aufgerufen werden,
			wenn alle child-Elemente ebenfalls benachrichtigt
			werden sollen.
		*/
		public onOrientation(isPortrait:boolean):void
		{
			for (var i = 0; i < this.children.length; ++i)
				this.children[i].onOrientation(isPortrait);
		}



		/*
			Skaliert ein Element über CSS-transform-scale.
			Sollte nicht benutzt werden, außer im Notfall!
		*/
		public scale(factor:number):void
		{
			var value, values = {};

			value = "scale(" + factor + "," + factor + ")";
			values["transform"] = value;
			values["-ms-transform"] = value;
			values["-webkit-transform"] = value;

			value = "left top";
			values["transform-origin"] = value;
			values["-ms-transform-origin"] = value;
			values["-webkit-transform-origin"] = value;

			this.dom.css(values);
			this.scaleFactor = factor;
		}



		public animate(...params:any[]):any
		{
			return this.dom.animate.apply(this.dom, params);
		}



		public css(...params:any[]):any
		{
			return this.dom.css.apply(this.dom, params);
		}



		public getTotalScaleFactor():number
		{
			var result = 1;
			var temp = this;
			while (temp && temp instanceof Element)
			{
				result *= temp.scaleFactor;
				temp = temp.parent;
			}
			return result;
		}



		public setAttribute(name:string, value:any):void
		{
			this.dom.attr(name, value);
		}



		public removeAttribute(name:string):void
		{
			this.dom.removeAttr(name);
		}



		public setProperty(name:string, value:boolean):void
		{
			this.dom.prop(name, value);
		}



		public getAttribute(name:string):string
		{
			return this.dom.attr(name);
		}



		public getScrollHeight():number
		{
			return this.dom[0].scrollHeight;
		}



		public getHeight(withMargin = false)
		{
			return this.dom.outerHeight(withMargin);
		}



		public getWidth(withMargin = false)
		{
			return this.dom.outerWidth(withMargin);
		}



		public getWindowHeight()
		{
			return $(window).height();
		}



		public getWindowWidth()
		{
			return $(window).width();
		}



		public setWidth(width:number)
		{
			this.dom.css("width", width);
		}



		public setHeight(height:number)
		{
			this.dom.css("height", height);
		}


		public trigger(event:JQueryEventObject):void;
		public trigger(eventName:string):void;
		public trigger(eventName:string, data:any):void;

		public trigger()
		{
			this.dom.trigger.apply(this.dom, arguments);
		}



		public click():void
		{
			var event = <any>document.createEvent("MouseEvents");
			event.initEvent("click", true, true);
			this.dom.get(0).dispatchEvent(event);
		}



		public on(eventName:string, handler:(eventObject:JQueryEventObject, data?:any) => void):void
		{
			if (kr3m.util.Util.contains(["swipeleft", "swiperight", "swipedown", "swipeup"], eventName))
				this.listenForTouch();
			this.dom.on(eventName, handler);
		}



		public one(eventName:string, handler:(eventObject:JQueryEventObject) => void):void
		{
			if (kr3m.util.Util.contains(["swipeleft", "swiperight", "swipedown", "swipeup"], eventName))
				this.listenForTouch();
			this.dom.one(eventName, handler);
		}



		public off(eventName:string, handler?:(eventObject:JQueryEventObject) => void):void
		{
			this.dom.off(eventName, handler);
		}



//# DEPRECATED_1_4_3_0
		// einfach gleich this.on("click", ...) benutzen
		public addClickHandler(handler:Callback):void
		{
			this.on("click", handler);
		}
//# /DEPRECATED_1_4_3_0



		/*
			Geht schrittweise durch die Parents dieses
			Elementes (also dessen parents und deren
			parents) und gibt das erste zurück, dessen
			Klasse mit der gegebenen übereinstimmt (das
			unterste in der Hierarchie).
		*/
		public getParentOfClass(cls:any):kr3m.ui.Element
		{
			var temp = this.parent;
			while (temp)
			{
				if (temp instanceof cls)
					return temp;
				temp = temp.parent;
			}
			return null;
		}



		/*
			Geht schrittweise durch die Parents dieses
			Elementes (also dessen parents und deren
			parents) und gibt das letzte zurück, dessen
			Klasse mit der gegebenen übereinstimmt (das
			oberste in der Hierarchie).
		*/
		public getRootOfClass(cls:any):kr3m.ui.Element
		{
			var temp = this.parent;
			var root:kr3m.ui.Element = null;
			while (temp)
			{
				if (temp instanceof cls)
					root = temp;
				temp = temp.parent;
			}
			return root;
		}



		/*
			Durchsucht alle Child-Elemente des parent-Elements
			dieses Elementes und gibt das erste zurück, das von
			der gewünschten Klasse ist.
		*/
		public getSiblingOfClass(cls:any):kr3m.ui.Element
		{
			if (!this.parent || !(this.parent instanceof kr3m.ui.Element))
				return null;

			for (var i = 0; i < this.parent.children.length; ++i)
			{
				if (this.parent.children[i] instanceof cls)
					return this.parent.children[i];
			}
			return null;
		}



		public getSiblingsOfClass(cls:any):kr3m.ui.Element[]
		{
			if (!this.parent || !(this.parent instanceof kr3m.ui.Element))
				return null;

			var siblings:kr3m.ui.Element[] = [];
			for (var i = 0; i < this.parent.children.length; ++i)
			{
				if (this.parent.children[i] instanceof cls)
					siblings.push(this.parent.children[i]);
			}
			return siblings;
		}



		/*
			Setzt das Element auf den "eingeschalteten"
			Zustand. Prinzipiell wird nur die CSS-Klasse
			disabled entfernt, in abgeleiteten Klassen
			können aber weitere Auswirkungen dazu kommen.
		*/
		public enable():void
		{
			this.dom.prop("disabled", false);
			this.removeClass("disabled");
		}



		/*
			Setzt das Element auf den "ausgeschalteten"
			Zustand. Prinzipiell wird nur die CSS-Klasse
			disabled hinzugefügt, in abgeleiteten Klassen
			können aber weitere Auswirkungen dazu kommen.
		*/
		public disable():void
		{
			this.dom.prop("disabled", true);
			this.addClass("disabled");
		}



		public setEnabled(enabled:boolean):void
		{
			if (enabled)
				this.enable();
			else
				this.disable();
		}



		public isEnabled():boolean
		{
			return !this.hasClass("disabled");
		}



		public isDisabled():boolean
		{
			return this.hasClass("disabled");
		}



		/*
			Hängt eine Instanz von kr3m.ui.Element (oder einer davon
			abgeleiteten Klasse) an ein bereits existierendes Dom-
			Element.
		*/
		public bindToDom(dom:JQuery, parentElement:kr3m.ui.Element):void
		{
			if (this.parent)
				this.parent.removeChild(this);

			this.dom = dom;
			parentElement.addChild(this);
		}



		/*
			Sucht das DOM-Element mit der Id domId innerhalb des Elementes,
			erstellt ein neues kr3m.ui.Element und verknüpft dieses mit dem
			gefundenden DOM-Element. Die genaue Klasse, die dieses neue
			Element haben soll, wird über elementClass übergeben, muss aber
			von kr3m.ui.Element erben. Alle weiteren Parameter, die
			bindElement erhält, gibt es direkt an den Constructor des neu
			erstellten kr3m.ui.Element Objektes weiter. Der parent Parameter
			des Constructors wird auf das ursprüngliche Element-Objekt gesetzt.
			Zuletzt gibt es das neu erstellte Element zurück, dessen dom
			Attribut das gefundene Dom-Objekt enthält.

			Beispiel: ein Template enthält ein Texteingabefeld mit der ID
			"nameEdit". Wir wollen nun ein kr3m.ui.Editbox Element damit
			verknüpfen, damit wir auf das Feld zugreifen können wie auf alle
			anderen Elemente. Dabei wollen wir das Dom-Objekt selbst nicht
			verändern. Der folgende Aufruf:

				var nameEdit = this.bindElement("nameEdit", kr3m.ui.Editbox, "nameEditBox");

			erstellt ein Objekt der Klasse kr3m.ui.Editbox und erknüpft es
			mit dem existierenden Dom-Objekt. Der parent Construktor des
			neuen Objektes wird implizit auf das HtmlTemplate gesetzt und
			"nameEditBox" wird als Parameter direkt weiter geleitet, wodurch
			es zum className Parameter des kr3m.ui.Editbox Constructors wird.
		*/
		public bindElement(
			domId:string,
			elementClass:any = kr3m.ui.Element,
			...params:any[]):any
		{
			var oldDom = this.dom.find("#" + domId);
			if (oldDom.length != 1)
				return null;

			var htmlParams = oldDom.data("params");
			if (typeof htmlParams != "undefined")
				params = params.concat(eval("[" + htmlParams + "]"));

			params.splice(0, 0, null);
			var newElement = kr3m.util.Class.createInstanceOfClass(elementClass, params);
			newElement.dom = oldDom;
			this.children.push(newElement);
			newElement.parent = this;
			newElement.onAddedToStage();
			return newElement;
		}



		/*
			Sucht das DOM-Element mit der Id domId innerhalb des Elementes
			und ersetzt es durch ein neues kr3m.ui.Element. Die genaue
			Klasse, die dieses neue Element haben soll, wird über
			elementClass übergeben, muss aber von kr3m.ui.Element erben.
			Alle weiteren Parameter, die replaceElement erhält, gibt es
			direkt an den Constructor des neu erstellten kr3m.ui.Element
			Objektes weiter. Der parent Parameter des Constructors wird
			auf das ursürungliche Element-Objekt gesetzt. Zuletzt gibt es
			das neu erstellte Element zurück.

			Beispiel: im Template befindet sich ein Platzhalter-Div mit der
			Id "startButton". Wir wollen diesen Div entfernen und statt
			dessen einen Button einfügen. Das könnte mit folgendem Aufruf
			passieren:

				var startButton = this.replaceElement("startButton", kr3m.ui.Button, "Start", () => {alert("los!");});

			Der Constructor von kr3m.ui.Button erwartet drei Parameter:
			parent, caption und handler. parent wird implizit auf das
			HtmlTemplate-Element gesetzt, caption bekommt "Start" und
			handler die oben gegebene Funktion übergeben.
		*/
		public replaceElement(
			domId:string,
			elementClass:any = kr3m.ui.Element,
			...params:any[]):any
		{
			var oldDom = this.dom.find("#" + domId);
			if (oldDom.length != 1)
				return null;

			var htmlParams = oldDom.data("params");
			if (typeof htmlParams != "undefined")
				params = params.concat(eval("[" + htmlParams + "]"));

			params.splice(0, 0, null);
			var newElement = kr3m.util.Class.createInstanceOfClass(elementClass, params);
			oldDom.replaceWith(newElement.dom);
			newElement.dom.attr("id", domId);

			var oldClassesValue = oldDom.attr("class");
			if (oldClassesValue)
			{
				var oldClasses = oldClassesValue.split(/\s+/);
				for (var i = 0; i < oldClasses.length; ++i)
					newElement.addClass(oldClasses[i]);
			}

			this.children.push(newElement);
			newElement.parent = this;
			newElement.onAddedToStage();
			return newElement;
		}



		/*
			Setzt den Inhalt des Dom-Objektes mit der ID domId innerhalb
			des Html-Codes des Elementes auf text, HTML-Zeichen werden
			dabei escaped.

			Ist in erster Linie eine Bequemlichkeitsfunktion, damit man
			keine Dom-Element mit bindElement verknüpfen muss nur um einen
			einzigen Text im Template zu setzen.
		*/
		public setElementText(domId:string, text:string):void
		{
			var dom = this.dom.find("#" + domId);
			dom.text(text);
		}



		/*
			Setzt den Inhalt des Dom-Objektes mit der ID domId innerhalb
			des Html-Codes des Elementes auf html, HTML-Zeichen werden
			dabei nicht escaped.

			Ist in erster Linie eine Bequemlichkeitsfunktion, damit man
			keine Dom-Element mit bindElement verknüpfen muss nur um einen
			einzigen Text im Template zu setzen.
		*/
		public setElementHtml(domId:string, html:string):void
		{
			var dom = this.dom.find("#" + domId);
			dom.html(html);
		}



		public setElementVisible(domId:string, visible:boolean):void
		{
			var dom = this.dom.find("#" + domId);
			if (visible)
				dom.show();
			else
				dom.hide();
		}



		public setElementAttribute(
			domId:string,
			attribute:string,
			value:string):void
		{
			var dom = this.dom.find("#" + domId);
			dom.attr(attribute, value);
		}



		public setInnerHtml(html:string):void
		{
			this.dom.html(html);
		}



		public getInnerHtml():string
		{
			return this.dom.html();
		}



		public findChildren(selector:string):kr3m.ui.Element[]
		{
			var result:kr3m.ui.Element[] = [];
			for (var i = 0; i < this.children.length; ++i)
			{
				if (this.children[i].dom.is(selector))
					result.push(this.children[i]);
				result = result.concat(this.children[i].findChildren(selector));
			}
			return result;
		}



		public isAttachedTo(element:kr3m.ui.Element):boolean
		{
			var temp = this.parent;
			while (temp)
			{
				if (temp == element)
					return true;
				temp = temp.parent;
			}
			return false;
		}



		/*
			Registriert eine Klasse für die Verwendung als automatisch
			erstelltes Formularfeld. id ist dabei gleichzeitig die id
			des DOM-Objektes im Html-Code als auch der dazugehörige
			Attributsname in verwendeten VOs. doReplace gibt an, ob die
			Klasse beim automatischen Erstellen über replaceElement()
			(true) oder bindElement() (false) erstellt werden soll.
			Die (optionalen) parameters werden beim automatischen
			Erstellen immer an den Konstruktor der Klasse mit übergeben.
		*/
		public static registerVoClass(
			id:string,
			doReplace:boolean,
			elementClass:any,
			...parameters:any[]):void
		{
			var item =
			{
				id:id,
				doReplace:doReplace,
				elementClass:elementClass,
				parameters:parameters
			};
			kr3m.ui.Element.registeredVoClasses[id] = item;
		}



		/*
			Durchsucht den DOM-Baum des Elementes nach Objekten
			mit ID-Attribut und versucht für diese Instanzen
			von Element-Klassen zu erzeugen, in Abhängigkeit von
			den mit registerVoClass() registrierten Klassen.
		*/
		private autoFindVoFields():void
		{
			this.autoVoFields = {};
			var doms = this.dom.find("[id]");
			doms.each((i:any, obj:any) =>
			{
				var id = obj.id;
				var registered = kr3m.ui.Element.registeredVoClasses[id];
				if (!registered)
					return;

				var func = registered.doReplace ? this.replaceElement : this.bindElement;
				var params = [id, registered.elementClass].concat(registered.parameters);
				var field = func.apply(this, params);
				this.autoVoFields[id] = field;
			});
		}



		/*
			Versetzt alle automatisch erstellten Formularfelder
			des Elementes in ihren Ausgangszustand.
		*/
		public autoResetVo():void
		{
			if (!this.autoVoFields)
				this.autoFindVoFields();

			for (var id in this.autoVoFields)
				this.autoVoFields[id].resetVoValue();
		}



		/*
			Befüllt alle automatisch erstellten Formularfelder
			des Elementes mit Werten aus vo. Die Attributsnamen
			aus vo entsprechen dabei den IDs der automatisch
			erstellten Elemente. Alle Attribute, für die kein
			passendes Formularfeld gefunden wird, werden ignoriert.
		*/
		public autoSetVo(vo:any):void
		{
			if (!this.autoVoFields)
				this.autoFindVoFields();

			for (var i in vo)
			{
				if (typeof vo[i] != "function")
				{
					var field = this.autoVoFields[i];
					if (field)
						field.setVoValue(vo[i]);
				}
			}
		}



		/*
			Liest die Werte aller automatisch erstellten Formularfelder
			des Elementes aus und verpackt sie in ein VO, welches dann
			zurück gegeben wird. Die IDs der Formularfelder entsprechen
			den Attributsnamen im erstellten VO.
		*/
		public autoGetVo():any
		{
			if (!this.autoVoFields)
				this.autoFindVoFields();

			var vo:any = {};
			for (var id in this.autoVoFields)
				vo[id] = this.autoVoFields[id].getVoValue();
			return vo;
		}



		public focus():void
		{
			this.dom.focus();
		}



		public blur():void
		{
			this.dom.blur();
		}



		private listenForTouch():void
		{
			if (this.listeningForTouches)
				return;

			this.listeningForTouches = true;

			this.on("touchstart", this.translateTouchEvent.bind(this, this.touchStart.bind(this)));
			this.on("touchmove", this.translateTouchEvent.bind(this, this.touchMove.bind(this)));
			this.on("touchend", this.translateTouchEvent.bind(this, this.touchEnd.bind(this)));
			this.on("touchcancel", this.translateTouchEvent.bind(this, this.touchEnd.bind(this)));
			this.on("touchleave", this.translateTouchEvent.bind(this, this.touchEnd.bind(this)));
		}



		private touchStart(touch:Touch):void
		{
			this.touches.push(
			{
				id : touch.identifier,
				sx : touch.pageX,
				sy : touch.pageY,
				x : touch.pageX,
				y : touch.pageY
			});
		}



		private touchMove(touch:Touch):void
		{
			var myTouch:any = kr3m.util.Util.getBy(this.touches, "id", touch.identifier);
			myTouch.x = touch.pageX;
			myTouch.y = touch.pageY;
		}



		private touchEnd(touch:Touch):void
		{
			var myTouch = kr3m.util.Util.removeBy(this.touches, "id", touch.identifier)[0];
			var dx = touch.pageX - myTouch.sx;
			var dy = touch.pageY - myTouch.sy;
			var dxa = Math.abs(dx);
			var dya = Math.abs(dy);
			var max = Math.max(dxa, dya);
			if (max > 10)
			{
				if (dxa > dya)
					this.trigger(dx > 0 ? "swiperight" : "swipeleft");
				else
					this.trigger(dy > 0 ? "swipedown" : "swipeup");
			}
		}



		private translateTouchEvent(
			handler:(evt:Touch) => void,
			rawEvent:any):void
		{
			var te = <TouchEvent> rawEvent.originalEvent;
			for (var i = 0; i < te.changedTouches.length; ++i)
				handler(te.changedTouches[i]);
		}
	}
}
//# /CLIENT



//# !CLIENT
module kr3m.ui
{
	/*
		Dummy-Element für Server damit manche Klassen auch
		serverseitig verwendet werden können.
	*/
	export class Element
	{
		public dom:any =
		{
			html : (html:string) => {}
		}



		constructor(parent:any = null, domQuery:string = null, htmlTag:string = "div", attributes:any = {})
		{
			// nichts machen
		}
	}
}
//# /!CLIENT
