/// <reference path="../async/delayed.ts"/>
/// <reference path="../html/helper.ts"/>
/// <reference path="../loading/loader2.ts"/>
/// <reference path="../ui/element.ts"/>
/// <reference path="../util/browser.ts"/>



module kr3m.ui
{
	/*
		Die HtmlTemplate-Klasse erlaubt es, in Html-Dateien definierte
		Elemente zu laden und dynamisch anzulegen. Z.B. kann man das
		Layout einer Seite oder eines Screens als Html-Datei speichern,
		laden und anschließend als Child-Element in ein anderes Element
		einhängen.
	*/
	export class HtmlTemplate extends kr3m.ui.Element
	{
		private static cachedTemplates:any = {};

		private delay:kr3m.async.Delayed;
		private helper:kr3m.html.Helper;



		/*
			@param parent Ein kr3m.ui.Element, kr3m.app.Application Objekt
			oder null, an welches dieses HtmlTemplate Objekt angehängt
			werden soll.
			@param templateUrl Die URL des HTML-Dokumentes, in welchem sich
			der Code befindet, der an die Stelle dieses Templateelements
			gesetzt werden soll.
			@param onLoadedCallback Eine Funktion, die ausgeführt wird, sobald
			die HTML-Datei geladen, geparsed und eingesetzt wurde. Alle
			Initialisierungen, die in dem Template passieren sollen, sollten
			in dieser Callback-Funktion geschehen. VORSICHT: Elemente, die
			über bindElement oder replaceElement in der Callback-Funktion
			erstellt werden, sind natürlich noch nicht vorhanden wenn auf
			sie zugegriffen wird, bevor die Callback-Funktion aufgerufen
			wurde.
		*/
		constructor(
			parent:any, templateUrl:string = null,
			onLoadedCallback:() => void = null,
			tag:string = "div", attributes:any = {style:"position:static;"})
		{
			super(parent, null, tag, attributes);
			this.delay = new kr3m.async.Delayed();
			this.helper = new kr3m.html.Helper();
			if (templateUrl)
				this.setTemplate(templateUrl, onLoadedCallback);
		}



		/*
			Mit dieser Funktion kann ein ganzes Paket von
			Templates auf einmal geladen werden, damit die
			einzelnen Templates anschließend nicht jeweils
			einen eigenen HTTP-Request starten müssen.

			Um mehrere Templates zu einem Paket zu schnüren,
			kann das Tool aus kr3m.tools.templatepacker
			verwendet werden.
		*/
		public static loadTemplatePackage(
			packageUrl:string,
			callback:() => void = null):void
		{
			var self = kr3m.ui.HtmlTemplate;
			var loader = kr3m.loading.Loader2.getInstance();
			loader.loadFile(packageUrl, function(response:any)
			{
				if (response)
				{
					for (var i in response)
						self.cachedTemplates[i] = response[i];
				}
				if (callback)
				{
//# IE8
					if (kr3m.util.Browser.isOldBrowser())
					{
						try
						{
							callback();
						}
						catch(ex)
						{
							alert(ex);
						}
					}
					else
					{
//# /IE8
						callback();
//# IE8
					}
//# /IE8
				}
			});
		}



		private getTemplate(
			templateUrl:string,
			callback:(responseText:string) => void):void
		{
			var self = kr3m.ui.HtmlTemplate;
			var templateKey = this.helper.getTemplateKey(templateUrl);
			if (typeof self.cachedTemplates[templateKey] == "string")
			{
				setTimeout(() =>
				{
					//callback leicht verzögert aufrufen, damit der Constructor
					//die Möglichkeit hat, fertig durch zu laufen bevor die
					//onLoad-Methode aufgerufen wird
					callback(self.cachedTemplates[templateKey]);
				}, 1);
			}
			else if (typeof self.cachedTemplates[templateKey] == "undefined")
			{
				self.cachedTemplates[templateKey] = [callback];
				var loader = kr3m.loading.Loader2.getInstance();
				loader.loadFile(templateUrl, (responseText:string) =>
				{
					var pendingCallbacks = self.cachedTemplates[templateKey];
					self.cachedTemplates[templateKey] = responseText;
					for (var i = 0; i < pendingCallbacks.length; ++i)
						pendingCallbacks[i](responseText);
				});
			}
			else
			{
				self.cachedTemplates[templateKey].push(callback);
			}
		}



		/*
			Mit dieser Methode kann die zu Grunde liegende HTML-Datei
			des Templates ausgetauscht werden. Das ist auch die Methode,
			die aufgerufen wird, wenn dem Konstruktor eine Template-URL
			mitgegeben wird.
		*/
		public setTemplate(templateUrl:string, onLoadedCallback:() => void = null):void
		{
			this.delay.reset(true);
			this.getTemplate(templateUrl, (responseText:string) =>
			{
				var html = this.helper.getBody(responseText);

				this.dom.html(html);
				if (onLoadedCallback)
				{
					try
					{
						onLoadedCallback();
					}
					catch(e)
					{
						logError("error in onLoadedCallback for template " + templateUrl);
						logError(e);
					}
				}
				this.delay.execute();
			});
		}



		/*
			Mit dieser Methode kann abgefragt werden, ob das
			Template geladen und die onLoad-Funktion ausgeführt
			wurde (true) oder noch nicht (false).
		*/
		public isSetupComplete():boolean
		{
			return this.delay.isDone();
		}



		/*
			Mit dieser Methode kann sichergestellt werden,
			dass die übergebene Funktion nur aufgerufen wird,
			wenn das Template geladen, geparsed und die
			onLoadedCallback-Methode ausgeführt wurde. Sollte
			hoffentlich ein paar Racing-Conditions beseitigen.

			exclusiveKey und exclusivePriority funktionieren
			genau so wie bei kr3m.async.Delayed.call().
		*/
		public callDelayed(func:() => void, exclusiveKey:string = null, exclusivePriority:number = 0):void
		{
			this.delay.call(func, exclusiveKey, exclusivePriority);
		}



		/*
			Erzeugt aus dem Dom-Element mit der ID domId des Templates
			ein neues Template und speichert es im Cache unter der
			templateUrl ab. Ab dann können weitere HtmlTemplates diese
			templateUrl angeben um Instanzen dieses Templates zu erzeugen.
			Hauptsächlich sinnvoll, wenn man ein Element in der Vorlage
			hat, das man mehrfach darstellen will ohne ein eigenes
			Template dafür zu erstellen, z.B. Knöpfe, Bildvorschauelemente,
			Tabellenzeilen, usw.
		*/
		public createTemplate(domId:string, templateUrl:string):void
		{
			var oldDom = this.dom.find("#" + domId);
			if (oldDom.length != 1)
				return null;

			var dom = oldDom.clone();
			dom.attr("id", null);

			var self = kr3m.ui.HtmlTemplate;
			var templateKey = this.helper.getTemplateKey(templateUrl);
			self.cachedTemplates[templateKey] = dom[0].outerHTML;
		}



		/*
			Hängt an das DOM-Element innerhalb des Templates mit der Id
			buttonId die callback Funktion als onClick Funktion an.

			Falls addBehaviour true ist, wird außerdem ein tabindex-Attribut
			hinzugefügt, falls es nicht bereits vorhanden ist und der Button
			so umgestellt, dass Enter- und Space-Tastendrücke die Callback-
			Funktion ausführen.

			Ist in erster Linie eine Bequemlichkeitsfunktion, damit man keine
			Dom-Element mit bindElement verknüpfen muss nur um eine einzelne
			Click-Funktion an sie anzuhängen.
		*/
		public addClickListener(
			buttonId:string,
			callback:() => void,
			addBehaviour:boolean = true):void
		{
			var dom = this.dom.find("#" + buttonId);
			dom.on("click", callback);
			if (addBehaviour)
			{
				var tabindex = dom.attr("tabindex");
				if (tabindex == undefined)
					dom.attr("tabindex", 0);

				dom.on("keydown", (event:JQueryEventObject) =>
				{
					if (event.key == "Enter" || event.key == " ")
						callback();
				});
			}
		}



		public clearClickListeners(buttonId:string):void
		{
			this.dom.find("#" + buttonId).off("click");
		}
	}
}
