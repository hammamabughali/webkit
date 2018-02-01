/// <reference path="../../pogo/texture.ts"/>
/// <reference path="../../pogo/ticked.ts"/>
/// <reference path="../../ui2/video.ts"/>



module pogo.textures
{
	export class Video extends pogo.Texture implements pogo.Ticked
	{
		public video:kr3m.ui2.Video;



		constructor(
			canvas:pogo.Canvas,
			options?:pogo.TextureOptions)
		{
			super(canvas, options);
			this.video = new kr3m.ui2.Video(null, {src : this.options.url, autoplay : true});
			canvas.addTicked(this);
		}



		public update(data:pogo.TickData):void
		{
			this.setImage(this.video.getDomElement());
		}
	}
}
