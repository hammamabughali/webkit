/// <reference path="../serverdom/types.ts"/>



//# CLIENT
//# ERROR: this file must never be compiled into a client side script!
//# /CLIENT
module kr3m.serverdom
{
	/*
		Serverside implementation of class list:
			https://developer.mozilla.org/en/docs/Web/API/Element/classList
			https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList
	*/
	export class DOMTokenList
	{
		private items:string[] = [];



		public get length():number
		{
			return this.items.length;
		}



		public get value():string
		{
			return this.items.join(" ");
		}



		public add(...classNames:string[]):void
		{
			for (var i = 0; i < classNames.length; ++i)
			{
				if (this.items.indexOf(classNames[i]) < 0)
					this.items.push(classNames[i]);
			}
		}



		public remove(...classNames:string[]):void
		{
			for (var i = 0; i < classNames.length; ++i)
			{
				var j = 0;
				while ((j = this.items.indexOf(classNames[i], j)) >= 0)
					this.items.splice(j, 1);
			}
		}



		public item(index:number):string
		{
			return this.items[index];
		}



		public toggle(className:string, force?:boolean):boolean
		{
			if (force !== undefined)
			{
				if (force)
					this.add(className);
				else
					this.remove(className);
				return force;
			}

			var pos = this.items.indexOf(className);
			if (pos < 0)
			{
				this.items.push(className);
				return true;
			}
			else
			{
				this.items.splice(pos, 1);
				return false;
			}
		}



		public contains(className:string):boolean
		{
			return this.items.indexOf(className) >= 0;
		}
	}
}
