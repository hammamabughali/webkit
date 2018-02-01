/// <reference path="../display/idisplay.ts"/>
/// <reference path="../utils/align.ts"/>
/// <reference path="../utils/aligndata.ts"/>
/// <reference path="../utils/angle.ts"/>
/// <reference path="../utils/scale.ts"/>



module gf.display
{
	export class Text extends PIXI.Text
	{
		public game: gf.core.Game;
		public alignData: gf.utils.AlignData;
		public userData: any;



		constructor(game: gf.core.Game, text?:string, style?: PIXI.TextStyle)
		{
			super(text, style);

			this.game = game;
			this.name = "";
			this.alignData = new gf.utils.AlignData();
			this.userData = {};

			if (text && style)
				this.updateText(true);
		}



		public truncate(maxWidth:number):void
		{
			let text:string = this.text;
			this.text = "...";
			let minWidth:number = this.width;
			if (maxWidth <= minWidth)
			{
				this.text = "...";
				return;
			}
			else if (text)
			{
				this.text = text;
			}

			let length:number = this.text.length;
			while (this.width > maxWidth)
			{
				this.text = this.text.substring(0, length - 2) + "...";
				length--;
			}
		}



		public update(respectDirty?:boolean):void
		{
			this.updateText(respectDirty);
		}



		public hAlign(
			align:string,
			alignTo?: IDisplay | gf.core.Game | number,
			offset:number = 0):void
		{
			gf.utils.Align.hAlign(this, align, alignTo, offset);
		}



		public vAlign(
			align:string,
			alignTo?: IDisplay | gf.core.Game | number,
			offset:number = 0):void
		{
			gf.utils.Align.vAlign(this, align, alignTo, offset);
		}



		public onResize():void
		{
			gf.utils.Align.onResize(this);
		}



		public on(events:string, fn: Function, context?:any): this
		{
			if (!events) return this;
			events.split(" ").forEach((e:string) => super.on(e, fn, context));
			return this;
		}



		public off(events:string, fn: Function, once?:boolean): this
		{
			if (!events) return this;
			events.split(" ").forEach((event:string) => super.off(event, fn, once));
			return this;
		}



		public once(events:string, fn: Function, context?:any): this
		{
			if (!events) return this;
			events.split(" ").forEach((event:string) => super.once(event, fn, context));
			return this;
		}



		public removeAllListeners(events: string): this
		{
			if (!events) return this;
			events.split(" ").forEach((event: PIXI.interaction.InteractionEventTypes) => super.removeAllListeners(event));
			return this;
		}



		public get angle():number
		{
			return gf.utils.Angle.getAngle(this);
		}



		public set angle(value:number)
		{
			gf.utils.Angle.setAngle(this, value);
		}



		public get scaleX():number
		{
			return gf.utils.Scale.getScaleX(this);
		}



		public set scaleX(value:number)
		{
			gf.utils.Scale.setScaleX(this, value);
		}



		public get scaleY():number
		{
			return gf.utils.Scale.getScaleY(this);
		}



		public set scaleY(value:number)
		{
			gf.utils.Scale.setScaleY(this, value);
		}



		public set scaleXY(value:number)
		{
			gf.utils.Scale.setScaleXY(this, value);
		}



		public get left():number
		{
			return gf.utils.Align.left(this);
		}



		public get right():number
		{
			return gf.utils.Align.right(this);
		}



		public get top():number
		{
			return gf.utils.Align.top(this);
		}



		public get bottom():number
		{
			return gf.utils.Align.bottom(this);
		}
	}
}
