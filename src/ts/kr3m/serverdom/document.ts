/// <reference path="../serverdom/htmlelement.ts"/>
/// <reference path="../serverdom/types.ts"/>
/// <reference path="../serverdom/window.ts"/>



//# EXPERIMENTAL

//# CLIENT
//# ERROR: this file must never be compiled into a client side script!
//# /CLIENT
module kr3m.serverdom
{
	/*
		Dummy DOM-Structure to be used on the server side (in node.js) instead of
		client side (Javascript). It should behave exactly as a modern DOM-structure
		in a browser. Using the ui2 module with this module allows to build
		applications that can be run in the browser or simulated on the server
		(and then sent to browser, if necessary).
	*/
	export class Document
	{
		public body:HTMLElement;



		constructor()
		{
			this.body = new HTMLElement("body");
		}



		public createElement(tagName:HtmlTag):HTMLElement
		{
			return new HTMLElement(tagName);
		}
	}
}



document = <any> new kr3m.serverdom.Document();
//# /EXPERIMENTAL
