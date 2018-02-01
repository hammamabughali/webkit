/// <reference path="../types.ts"/>
/// <reference path="../ui2/types.ts"/>
/// <reference path="../util/util.ts"/>

//# SERVER
/// <reference path="../serverdom/document.ts"/>
//# /SERVER



//# EXPERIMENTAL
module kr3m.ui2
{
	export interface ElementOptions
	{
		classes?:string|string[];
		domNode?:HTMLElement;
		hidden?:boolean;
		id?:string;
		name?:string;
		tagName?:string;
		title?:string;
		css?:{[property:string]:string};
	}



	/*
		(Experimentary) successor to the ui module. Provides the same
		functionality but doesn't depend on JQuery and is better
		suited to modern browsers.
	*/
	export class Element
	{
		protected parentElement:Element;
		protected dom:HTMLElement;
		protected children:Element[] = [];
		protected options:ElementOptions;
		protected hidden = false;



		constructor(parentNode:ParentTypes, options?:ElementOptions)
		{
			this.options = options || {};

			if (options)
			{
				if (options.domNode)
					this.dom = options.domNode;
				else if (options.tagName)
					this.dom = document.createElement(options.tagName);

				if (options.classes)
				{
					if (typeof options.classes == "string")
						this.addClass(...options.classes.split(/\s+/));
					else
						this.addClass(...options.classes);
				}

				if (options.css)
					this.setCss(options.css);

				this.initOptionsAttributes("name", "title", "id");
			}

			if (parentNode)
			{
				if (parentNode instanceof Element)
				{
					parentNode.append(this, options && options.hidden);
				}
				else if (typeof parentNode == "string")
				{
					var node = document.getElementById(parentNode);
					if (node)
						node.appendChild(this.dom);
				}
				else
				{
					parentNode.appendChild(this.dom);
				}
			}
		}



		public getDomElement():HTMLElement
		{
			return this.dom;
		}



		protected initOptionsAttributes(...names:string[]):void
		{
			if (!this.options)
				return;

			for (var i = 0; i < names.length; ++i)
			{
				if (this.options[names[i]] !== undefined)
					this.setAttribute(names[i], this.options[names[i]]);
			}
		}



		/*
			Returns the lowest parentElement that is an instance of
			the given class if there is any such parent.
		*/
		public getParentOfClass<T extends Element>(cls:{new(...args:any[]):T}):T
		{
			var temp = this.parentElement;
			while (temp)
			{
				if (temp instanceof cls)
					return temp;

				temp = temp.parentElement;
			}
			return undefined;
		}



		public append(node:Element, hidden = false):void
		{
			node.parentElement = this;
			node.hidden = hidden;
			this.children.push(node);
			if (!hidden)
				this.dom.appendChild(node.dom);
		}



		public insert(node:Element, position:number, hidden = false):void
		{
			var oldChild = this.children[position];
			if (!oldChild)
				return this.append(node);

			node.parentElement = this;
			node.hidden = hidden;
			this.children.splice(position, 0, node);
			if (!hidden)
				this.dom.insertBefore(node.dom, oldChild.dom);
		}



		public insertBefore(node:Element, oldNode:Element, hidden = false):void
		{
			var position = this.children.indexOf(oldNode);
			if (position < 0)
				return this.append(oldNode);

			node.parentElement = this;
			node.hidden = hidden;
			this.children.splice(position, 0, node);
			if (!hidden)
				this.dom.insertBefore(node.dom, oldNode.dom);
		}



		public prepend(node:Element, hidden = false):void
		{
			this.insert(node, 0, hidden);
		}



		public isInFullScreen():boolean
		{
			var fieldNames =
			[
				"fullscreenElement",
				"mozFullScreenElement",
				"webkitFullscreenElement"
			];
			for (var i = 0; i < fieldNames.length; ++i)
			{
				if (document[fieldNames[i]] == this.dom)
					return true;
			}
			return false;
		}



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
			for (var i = 0; i < funcNames.length; ++i)
			{
				var func = this.dom[funcNames[i]];
				if (func)
				{
					func.call(this.dom);
					return true;
				}
			}
			return false;
		}



		public setCss(styles:TextMap):void;
		public setCss(name:string, value:{toString()}):void;

		public setCss():void
		{
			if (arguments.length == 2)
			{
				this.dom.style[arguments[0]] = arguments[1].toString();
			}
			else
			{
				var styles = <{[name:string]:{toString()}}> arguments[0];
				for (var name in styles)
					this.dom.style[name] = styles[name].toString();
			}
		}



		public removeAttribute(name:string):void
		{
			this.dom.removeAttribute(name);
		}



		public getAttribute(name:string):string
		{
			return this.dom.getAttribute(name);
		}



		public setAttribute(name:string, value?:any):void
		{
			if (value === false)
				this.dom.removeAttribute(name);
			else if (value === true)
				this.dom.setAttribute(name, "");
			else
				this.dom.setAttribute(name, value);
		}



		public setAttributes(values:{[name:string]:any}):void
		{
			for (var name in values)
				this.setAttribute(name, values[name]);
		}



		public scrollTo():void
		{
			this.dom.scrollIntoView(true);
		}



		public hide():void
		{
			if (this.hidden)
				return;

			this.hidden = true;

			if (this.parentElement)
			{
				this.parentElement.dom.removeChild(this.dom);
			}
			else
			{
				//# TODO: NYI hide for parent-less elements attached to raw dom-nodes
			}
		}



		public show():void
		{
			if (!this.hidden)
				return;

			this.hidden = false;

			if (this.parentElement)
			{
				var position = this.parentElement.children.indexOf(this) + 1;
				var sibling = this.parentElement.children[position];
				while (sibling && sibling.hidden)
					sibling = this.parentElement.children[++position];

				if (sibling)
					this.parentElement.dom.insertBefore(this.dom, sibling.dom);
				else
					this.parentElement.dom.appendChild(this.dom);
			}
			else
			{
				//# TODO: NYI show for parent-less elements attached to raw dom-nodes
			}
		}



		public removeAllChildren(clearHtml = true):void
		{
			this.children = [];
			if (clearHtml)
				this.dom.innerHTML = "";
		}



		public forEachChild(callback:(child:Element) => void):void
		{
			for (var i = 0; i < this.children.length; ++i)
				callback(this.children[i]);
		}



		public isVisible(recursive = true):boolean
		{
			var node = this.dom;
			while (node)
			{
				if (!node)
					return false;

				if (getComputedStyle(node).display == "none")
					return false;

				if (node == document.body || !recursive)
					return true;

				node = <HTMLElement> node.parentNode;
			}
			return false;
		}



		public addClass(...classNames:string[]):void
		{
			this.dom.classList.add(...classNames);
		}



		public removeClass(...classNames:string[]):void
		{
			this.dom.classList.remove(...classNames);
		}



		public setClass(className:string, isSet:boolean):void
		{
			this.dom.classList.toggle(className, isSet);
		}



		public hasClass(className:string):boolean
		{
			return this.dom.classList.contains(className);
		}



		public toggleClass(className:string):boolean
		{
			return this.dom.classList.toggle(className);
		}



		public setId(id:string):void
		{
			this.dom.id = id;
		}



		public getId():string
		{
			return this.dom.id;
		}



		public focus():void
		{
			this.dom.focus();
		}



		public blur():void
		{
			this.dom.blur();
		}



		public setName(name:string):void
		{
			this.dom.setAttribute("name", name);
		}



		public getName():string
		{
			return this.dom.getAttribute("name");
		}



		public setHtml(html:string):void
		{
			this.removeAllChildren();
			this.dom.innerHTML = html;
		}



		public setText(text:string):void
		{
			this.setHtml(kr3m.util.Util.encodeHtml(text));
		}



		public getHtml():string
		{
			return this.dom.innerHTML;
		}



		public getText():string
		{
			return kr3m.util.Util.encodeHtml(this.getHtml());
		}



		public appendHtml(html:string):void
		{
			this.setHtml(this.getHtml() + html);
		}



		public appendText(text:string):void
		{
			this.setHtml(this.getHtml() + kr3m.util.Util.encodeHtml(text));
		}



		public on(
			eventName:string,
			listener:EventListenerOrEventListenerObject):void
		{
			this.dom.addEventListener(eventName.toLowerCase(), listener, <any> {capture : false, once : false});
		}



		public once(
			eventName:string,
			listener:EventListenerOrEventListenerObject):void
		{
			this.dom.addEventListener(eventName.toLowerCase(), listener, <any> {capture : false, once : true});
		}



		public off(
			eventName:string,
			listener:EventListenerOrEventListenerObject):void
		{
			this.dom.removeEventListener(eventName.toLowerCase(), listener, false);
		}



		public dispatch(eventName:string):void
		{
			var event = new Event(eventName);
			this.dom.dispatchEvent(event);
		}



		public trigger(eventName:string):void
		{
			this.dispatch(eventName);
		}
	}
}
//# /EXPERIMENTAL
