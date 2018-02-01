/// <reference path="../ui2/inputtext.ts"/>



module kr3m.ui2
{
	export class InputPassword extends InputText
	{
		constructor(parentNode:ParentTypes, options?:InputTextOptions)
		{
			super(parentNode, options);
			this.setAttribute("type", "password");
		}



		public setReadable(readable:boolean):void
		{
			this.setAttribute("type", readable ? "text" : "password");
		}



		public isReadable():boolean
		{
			return this.getAttribute("type") == "text";
		}



		public toggleReadable():void
		{
			this.setReadable(!this.isReadable());
		}
	}
}
