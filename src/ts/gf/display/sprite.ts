/// <reference path="../display/idisplay.ts"/>
/// <reference path="../utils/align.ts"/>
/// <reference path="../utils/aligndata.ts"/>
/// <reference path="../utils/angle.ts"/>
/// <reference path="../utils/scale.ts"/>
/// <reference path="../utils/texture.ts"/>



module gf.display
{
	export class Sprite extends PIXI.Sprite implements gf.display.IDisplay
	{
		protected _key: string | PIXI.Texture | PIXI.RenderTexture;
		protected _frameName: string;

		public alignData: gf.utils.AlignData;
		public frame: gf.utils.Frame;
		public game: gf.core.Game;
		public userData: any;



		constructor(game: gf.core.Game, key?: string | PIXI.Texture | PIXI.RenderTexture, frameName?: string)
		{
			super(game.cache.getTexture("__default"));

			this.game = game;
			this.name = "";
			this.alignData = new gf.utils.AlignData();
			this.userData = {};

			this._key = (key) ? key : "__default";
			this._frameName = frameName || "";

			this.updateTexture();
		}



		public updateTexture(): void
		{
			gf.utils.Texture.update(this);
		}



		public updateKeyAndFrameName(key: string, frameName?: string): void
		{
			this._key = key;
			this._frameName = frameName || "";
			this.updateTexture();
		}



		public hAlign(
			align: string,
			alignTo?: IDisplay | gf.core.Game | number,
			offset: number = 0): void
		{
			gf.utils.Align.hAlign(this, align, alignTo, offset);
		}



		public vAlign(
			align: string,
			alignTo?: IDisplay | gf.core.Game | number,
			offset: number = 0): void
		{
			gf.utils.Align.vAlign(this, align, alignTo, offset);
		}



		public onResize(): void
		{
			gf.utils.Align.onResize(this);
		}



		public on(events: string, fn: Function, context?: any): this
		{
			if (!events) return this;
			events.split(" ").forEach((e: string) => super.on(e, fn, context));
			return this;
		}



		public off(events: string, fn: Function, once?: boolean): this
		{
			if (!events) return this;
			events.split(" ").forEach((e: string) => super.off(e, fn, once));
			return this;
		}



		public once(events: string, fn: Function, context?: any): this
		{
			if (!events) return this;
			events.split(" ").forEach((e: string) => super.once(e, fn, context));
			return this;
		}



		public removeAllListeners(events: string): this
		{
			if (!events) return this;
			events.split(" ").forEach((e: PIXI.interaction.InteractionEventTypes) => super.removeAllListeners(e));
			return this;
		}



		public get angle(): number
		{
			return gf.utils.Angle.getAngle(this);
		}



		public set angle(value: number)
		{
			gf.utils.Angle.setAngle(this, value);
		}



		public get scaleX(): number
		{
			return gf.utils.Scale.getScaleX(this);
		}



		public set scaleX(value: number)
		{
			gf.utils.Scale.setScaleX(this, value);
		}



		public get scaleY(): number
		{
			return gf.utils.Scale.getScaleY(this);
		}



		public set scaleY(value: number)
		{
			gf.utils.Scale.setScaleY(this, value);
		}



		public set scaleXY(value: number)
		{
			gf.utils.Scale.setScaleXY(this, value);
		}



		public get left(): number
		{
			return gf.utils.Align.left(this);
		}



		public get right(): number
		{
			return gf.utils.Align.right(this);
		}



		public get top(): number
		{
			return gf.utils.Align.top(this);
		}



		public get bottom(): number
		{
			return gf.utils.Align.bottom(this);
		}



		public get key(): string | PIXI.Texture | PIXI.RenderTexture
		{
			return this._key;
		}



		public set key(value: string | PIXI.Texture | PIXI.RenderTexture)
		{
			this._key = value;
			this.updateTexture();
		}



		public get frameName(): string
		{
			return this._frameName;
		}



		public set frameName(value: string)
		{
			this._frameName = value;
			this.updateTexture();
		}
	}
}
