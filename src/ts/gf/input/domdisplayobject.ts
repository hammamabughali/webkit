/// <reference path="../display/container.ts"/>
/// <reference path="../input/domcontainer.ts"/>



module gf.display
{
	export class DomDisplayObject extends gf.display.Container
	{
		protected _domParent: string | gf.input.DomContainer;
		protected _dom: HTMLElement;
		protected _paddingLeft: number;
		protected _paddingRight: number;
		protected _paddingTop: number;
		protected _paddingBottom: number;
		protected _tag: string;
		protected _pointerEventsEnabled: boolean;



		constructor(game: gf.core.Game, parent: string | gf.input.DomContainer, tag?: string)
		{
			super(game);

			this._domParent = parent;

			this._tag = (typeof tag == "string" && tag.length > 0) ? tag : "div";

			this._pointerEventsEnabled = true;

			this.createDom();
			this._dom.style.pointerEvents = "all";

			this.paddingLeft = 0;
			this.paddingRight = 0;
			this.paddingTop = 0;
			this.paddingBottom = 0;

			if (typeof this._domParent != "string")
				(<gf.input.DomContainer>this._domParent).addDomChild(this);
		}



		public addClass(...token: string[]): void
		{
			this._dom.classList.add.apply(this._dom.classList, token);
		}



		public hasClass(token: string): boolean
		{
			return this._dom.classList.contains(token);
		}



		public removeClass(...token: string[]): void
		{
			this._dom.classList.remove.apply(this._dom.classList, token);
		}



		protected createDom(): void
		{
			this._dom = document.createElement(this._tag);
		}



		protected onChange(): void
		{
			if (typeof this._domParent != "string")
				(<gf.input.DomContainer>this._domParent).emit("change");
		}



		public enablePointerEvents(): void
		{
			this._dom.style.pointerEvents = "all";
		}



		public disablePointerEvents(): void
		{
			this._dom.style.pointerEvents = "none";
		}



		public get domParent(): string | gf.input.DomContainer
		{
			return this._domParent;
		}



		public get dom(): HTMLElement
		{
			return this._dom;
		}



		public get tag(): string
		{
			return this._tag;
		}



		public get paddingLeft(): number
		{
			return this._paddingLeft;
		}



		public get tabIndex(): number
		{
			return this._dom.tabIndex;
		}



		public set tabIndex(value: number)
		{
			this._dom.tabIndex = value;
		}



		public set padding(value: number)
		{
			this.paddingLeft = value;
			this.paddingRight = value;
			this.paddingTop = value;
			this.paddingBottom = value;
		}



		public set paddingLeft(value: number)
		{
			this._paddingLeft = value;
			this._dom.style.paddingLeft = String(value) + "px";
			this.setWidth(this.width);
		}



		public get paddingRight(): number
		{
			return this._paddingRight;
		}



		public set paddingRight(value: number)
		{
			this._paddingRight = value;
			this._dom.style.paddingRight = String(value) + "px";
			this.setWidth(this.width);
		}



		public get paddingTop(): number
		{
			return this._paddingTop;
		}



		public set paddingTop(value: number)
		{
			this._paddingTop = value;
			this._dom.style.paddingTop = String(value) + "px";
			this.setHeight(this.height);
		}



		public get paddingBottom(): number
		{
			return this._paddingBottom;
		}



		public set paddingBottom(value: number)
		{
			this._paddingBottom = value;
			this._dom.style.paddingBottom = String(value) + "px";
			this.setHeight(this.height);
		}



		public get x(): number
		{
			return this.position.x;
		}



		public set x(value: number)
		{
			this.setX(value);
		}



		public get y(): number
		{
			return this.position.y;
		}



		public set y(value: number)
		{
			this.setY(value);
		}



		public get width(): number
		{
			return this.getLocalBounds().width;
		}



		public set width(value: number)
		{
			this.setWidth(value);
		}



		public get height(): number
		{
			return this.getLocalBounds().height;
		}



		public set height(value: number)
		{
			this.setHeight(value);
		}



		public validate(): boolean
		{
			return true;
		}



		public updatePosition(): void
		{
			this.setX(this.x);
			this.setY(this.y);
		}



		protected setX(value: number): void
		{
			this.position.x = value;
			if (this.parent)
				this._dom.style.left = String(this.parent.toGlobal(this.position).x) + "px";
		}



		protected setY(value: number): void
		{
			this.position.y = value;
			if (this.parent)
				this._dom.style.top = String(this.parent.toGlobal(this.position).y) + "px";
		}



		protected setWidth(value: number): void
		{
			this._dom.style.width = value > 0 ? String(value) + "px" : "auto";
		}



		protected setHeight(value: number): void
		{
			this._dom.style.height = value > 0 ? String(value) + "px" : "auto";
		}



		public reset(): void
		{
		}
	}
}
