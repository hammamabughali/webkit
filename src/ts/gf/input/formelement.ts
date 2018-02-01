/// <reference path="../display/container.ts"/>
/// <reference path="../input/form.ts"/>



module gf.input
{
	export class FormElement extends gf.display.Container
	{
		private _form: gf.input.Form;
		private _domElement: HTMLElement;
		private _paddingLeft:number;
		private _paddingRight:number;
		private _paddingTop:number;
		private _paddingBottom:number;



		constructor(form: gf.input.Form, tabIndex?:number)
		{
			super(form.game);

			this._form = form;

			this._domElement = this.createDomElement();
			this._domElement.style.position = "absolute";
			this._domElement.style.zIndex = "1";
			this._domElement.style.pointerEvents = "all";

			if (typeof tabIndex == "number")
				this._domElement.tabIndex = tabIndex;

			this.paddingLeft = 0;
			this.paddingRight = 0;
			this.paddingTop = 0;
			this.paddingBottom = 0;
		}



		protected change():void
		{
			this._form.emit("change");
			this.setValid(this.validate());
		}



		public setValid(value:boolean):void
		{
			if (value)
			{
				if (this._domElement.classList.contains("invalid"))
					this._domElement.classList.remove("invalid");
				this._domElement.classList.add("valid");
			}
			else
			{
				if (this._domElement.classList.contains("valid"))
					this._domElement.classList.remove("valid");
				this._domElement.classList.add("invalid");
			}
		}



		protected createDomElement(): HTMLElement
		{
			return document.createElement("div");
		}



		public get form(): gf.input.Form
		{
			return this._form;
		}



		get domElement(): HTMLElement
		{
			return this._domElement;
		}



		public get tabIndex():number
		{
			return this._domElement.tabIndex;
		}



		public set tabIndex(value:number)
		{
			this._domElement.tabIndex = value;
		}



		public get paddingLeft():number
		{
			return this._paddingLeft;
		}



		public set padding(value:number)
		{
			this.paddingLeft = value;
			this.paddingRight = value;
			this.paddingTop = value;
			this.paddingBottom = value;
		}



		public set paddingLeft(value:number)
		{
			this._paddingLeft = value;
			this.domElement.style.paddingLeft = String(value) + "px";
			this.setWidth(this.width);
		}



		public get paddingRight():number
		{
			return this._paddingRight;
		}



		public set paddingRight(value:number)
		{
			this._paddingRight = value;
			this.domElement.style.paddingRight = String(value) + "px";
			this.setWidth(this.width);
		}



		public get paddingTop():number
		{
			return this._paddingTop;
		}



		public set paddingTop(value:number)
		{
			this._paddingTop = value;
			this.domElement.style.paddingTop = String(value) + "px";
			this.setHeight(this.height);
		}



		public get paddingBottom():number
		{
			return this._paddingBottom;
		}



		public set paddingBottom(value:number)
		{
			this._paddingBottom = value;
			this.domElement.style.paddingBottom = String(value) + "px";
			this.setHeight(this.height);
		}



		public get x():number
		{
			return this.position.x;
		}



		public set x(value:number)
		{
			this.setX(value);
		}



		public get y():number
		{
			return this.position.y;
		}



		public set y(value:number)
		{
			this.setY(value);
		}



		public get width():number
		{
			return this.getLocalBounds().width;
		}



		public set width(value:number)
		{
			this.setWidth(value);
		}



		public get height():number
		{
			return this.getLocalBounds().height;
		}



		public set height(value:number)
		{
			this.setHeight(value);
		}



		public validate():boolean
		{
			return true;
		}


		public onResize():void
		{
			super.onResize();
			this.updatePosition();
		}



		public updatePosition():void
		{
			this.setX(this.x);
			this.setY(this.y);
		}



		protected setX(value:number):void
		{
			this.position.x = value;
			if (this.parent)
				this._domElement.style.left = String(this.parent.toGlobal(this.position).x) + "px";
		}



		protected setY(value:number):void
		{
			this.position.y = value;
			if (this.parent)
				this._domElement.style.top = String(this.parent.toGlobal(this.position).y) + "px";
		}



		protected setWidth(value:number):void
		{
			this._domElement.style.width = value > 0 ? String(value) + "px" : "auto";
		}



		protected setHeight(value:number):void
		{
			this._domElement.style.height = value > 0 ? String(value) + "px" : "auto";
		}



		public reset():void
		{
			this.setValid(true);
		}
	}
}
