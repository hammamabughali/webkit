module gf.display
{
	export class Graphics extends PIXI.Graphics
	{
		public game: gf.core.Game;
		public alignData: gf.utils.AlignData;
		public userData: any;



		constructor(game: gf.core.Game)
		{
			super();

			this.game = game;
			this.name = "";
			this.alignData = new gf.utils.AlignData();
			this.userData = {};
		}



		public c(): gf.display.Graphics
		{
			this.clear();
			return this;
		}



		public mt(x:number, y:number): gf.display.Graphics
		{
			this.moveTo(x, y);
			return this;
		}



		public lt(x:number, y:number): gf.display.Graphics
		{
			this.lineTo(x, y);
			return this;
		}



		public f(color?:number, alpha?:number): gf.display.Graphics
		{
			this.beginFill(color, alpha);
			return this;
		}



		public ef(): gf.display.Graphics
		{
			this.endFill();
			return this;
		}



		public dc(x:number, y:number, radius:number): gf.display.Graphics
		{
			this.drawCircle(x, y, radius);
			return this;
		}



		public dr(x:number, y:number, width:number, height:number): gf.display.Graphics
		{
			this.drawRect(x, y, width, height);
			return this;
		}



		public rr(
			x:number,
			y:number,
			width:number,
			height:number,
			radius:number): gf.display.Graphics
		{
			this.drawRoundedRect(x, y, width, height, radius);
			return this;
		}



		public ls(lineWidth?:number, color?:number, alpha?:number): gf.display.Graphics
		{
			this.lineStyle(lineWidth, color, alpha);
			return this;
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
			events.split(" ").forEach((e:string) => super.off(e, fn, once));
			return this;
		}



		public once(events:string, fn: Function, context?:any): this
		{
			if (!events) return this;
			events.split(" ").forEach((e:string) => super.once(e, fn, context));
			return this;
		}



		public removeAllListeners(events:string): this
		{
			if (!events) return this;
			events.split(" ").forEach((e: PIXI.interaction.InteractionEventTypes) => super.removeAllListeners(e));
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
