/// <reference path="../ui/element.ts"/>



module kr3m.ui
{
	export class Image extends kr3m.ui.Element
	{
		constructor(parent?:any, src?:string, className?:string, attributes?:any)
		{
			attributes = attributes || {};
			attributes["src"] = src || "";
			if (className)
				attributes["class"] = className;

			super(parent, null, "img", attributes);
		}



		public isLoaded():boolean
		{
			return !!this.dom.get(0).naturalWidth;
		}



		/*
			Gibt die tatsächliche Breite des Bildes (in Pixeln)
			laut Datei zurück, nicht die dargestellte Breite.
		*/
		public getNaturalWidth():number
		{
			return this.dom.get(0).naturalWidth || this.dom.width();
		}



		/*
			Gibt die tatsächliche Höhe des Bildes (in Pixeln)
			laut Datei zurück, nicht die dargestellte Höhe.
		*/
		public getNaturalHeight():number
		{
			return this.dom.get(0).naturalHeight || this.dom.height();
		}



		public setUrl(url:string):void
		{
			this.setAttribute("src", url);
		}



		public getUrl():string
		{
			return this.getAttribute("src");
		}



//# DEPRECATED_1_3_5_6
// einfach this.on("load", ...) benutzen stattdessen
		public setLoadedCallback(callback:() => void):void
		{
			this.off("load");
			this.on("load", callback);
		}
//# /DEPRECATED_1_3_5_6
	}
}
