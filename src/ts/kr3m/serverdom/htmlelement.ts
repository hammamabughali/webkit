/// <reference path="../serverdom/domtokenlist.ts"/>
/// <reference path="../serverdom/types.ts"/>



//# CLIENT
//# ERROR: this file must never be compiled into a client side script!
//# /CLIENT
module kr3m.serverdom
{
	export class HTMLElement
	{
		protected tagName:HtmlTag;
		protected data:string;
		protected attributes:Attributes = {};
		protected parentNode:HTMLElement;
		protected childNodes:HTMLElement[] = [];

		public classList = new DOMTokenList();



		constructor(tagName:HtmlTag)
		{
			this.tagName = tagName;
		}



		public removeChild(child:HTMLElement):HTMLElement
		{
			for (var i = 0; i < this.childNodes.length; ++i)
			{
				if (this.childNodes[i] == child)
				{
					this.childNodes.splice(i, 1);
					child.parentNode = null;
					return;
				}
			}
			throw new Error("Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.");
		}



		public appendChild(child:HTMLElement):HTMLElement
		{
			if (child.parentNode)
				child.parentNode.removeChild(child);

			child.parentNode = this;
			this.childNodes.push(child);
			return child;
		}



		public set outerHTML(html:string)
		{
			//# FIXME: NYI outerHTML
			throw new Error("NYI outerHTML");
		}



		public get outerHTML():string
		{
			var result = "<" + this.tagName;

			var classes = this.classList.value;
			if (classes)
				result += " class='" + classes + "'";

			for (var name in this.attributes)
				result += " " + name + "='" + this.attributes[name] + "'";

			var inner = this.innerHTML;
			if (inner)
				result += ">" + inner + "</" + this.tagName + ">";
			else
				result += "/>";
			return result;
		}



		public set innerHTML(html:string)
		{
			while (this.childNodes.length > 0)
				this.removeChild(this.childNodes[0]);

			this.data = html;
		}



		public get innerHTML():string
		{
			var result = this.data || "";
			for (var i = 0; i < this.childNodes.length; ++i)
				result += this.childNodes[i].outerHTML;
			return result;
		}
	}
}
