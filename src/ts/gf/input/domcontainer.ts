/// <reference path="../input/domdisplayobject.ts"/>



module gf.input
{
	export class DomContainer extends gf.display.DomDisplayObject
	{
		protected _dom: HTMLElement;
		protected _domChildren: gf.display.DomDisplayObject[];
		protected _transformScaleX: number;
		protected _transformScaleY: number;
		protected _tag: string;



		constructor(game: gf.core.Game, tag?: string, parent?: string)
		{
			super(game, (typeof parent == "string") ? parent : "kr3m", tag);

			this._tag = (typeof tag == "string" && tag.length > 0) ? tag : "div";

			this._transformScaleX = 1;
			this._transformScaleY = 1;

			this._domChildren = [];
			this.createDom();
		}



		protected createDom(): void
		{
			super.createDom();
			this._dom.setAttribute("style", "1");
		}



		protected setTransformScale(): void
		{
			let opacityStyle: string = this._dom.style.opacity ? this._dom.style.opacity : "1";
			if (typeof opacityStyle != "string") opacityStyle = "1";

			const styleScale: string = "scale(" + this._transformScaleX + "," + this._transformScaleY + ")";

			this._dom.style.opacity = opacityStyle;
			this._dom.style["-webkit-transform"] = styleScale;
			this._dom.style["-ms-transform"] = styleScale;
			this._dom.style["-moz-transform"] = styleScale;
			this._dom.style.transform = styleScale;
			this._dom.style.position = "absolute";
		}



		public addDomChild(child: gf.display.DomDisplayObject): void
		{
			this._dom.appendChild(child.dom);
			this._domChildren.push(child);
		}



		public onResize(): void
		{
			super.onResize();

			this.transformScaleX = parseFloat(this.game.canvas.style.width) / this.game.width;
			this.transformScaleY = parseFloat(this.game.canvas.style.height) / this.game.height;
			this.setTransformScale();

			setTimeout(() =>
			{
				this.updateElementPositions();
			}, 100);

			setTimeout(() =>
			{
				this.updateElementPositions();
			}, 10);
		}



		public get domChildren(): gf.display.DomDisplayObject[]
		{
			return this._domChildren;
		}



		public get transformScaleX(): number
		{
			return this._transformScaleX;
		}



		public set transformScaleX(value: number)
		{
			this._transformScaleX = value;
			this.setTransformScale();
		}



		public get transformScaleY(): number
		{
			return this._transformScaleY;
		}



		public set transformScaleY(value: number)
		{
			this._transformScaleY = value;
			this.setTransformScale();
		}



		public showDom(): void
		{
			this._domChildren.forEach((child: gf.display.DomDisplayObject) =>
			{
				child.reset();
			});
			this.appendToDom();
			this.updateElementPositions();
		}



		public hideDom(): void
		{
			this.removeFromDom();
		}



		public updateElementPositions(): void
		{
			this._domChildren.forEach((child: gf.display.DomDisplayObject) =>
			{
				child.updatePosition();
			});
		}



		public validate(): boolean
		{
			for (let i: number = 0, ic: number = this._domChildren.length; i < ic; i++)
			{
				if (!this._domChildren[i].validate())
					return false;
			}

			return true;
		}



		private appendToDom(): void
		{
			if (!document.getElementById(String(this._domParent)).contains(this._dom))
				document.getElementById(String(this._domParent)).appendChild(this._dom);
		}



		private removeFromDom(): void
		{
			if (document.getElementById(String(this._domParent)).contains(this._dom))
				document.getElementById(String(this._domParent)).removeChild(this._dom);
		}
	}
}
