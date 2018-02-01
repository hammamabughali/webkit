/// <reference path="../../pogo/camera.ts"/>
/// <reference path="../../pogo/renderer.ts"/>



module pogo.renderers
{
	export class R3d extends pogo.Renderer
	{
		protected camera:pogo.Camera;



		constructor(canvas:pogo.Canvas, camera:pogo.Camera)
		{
			super(canvas);
			this.setCamera(camera);
		}



		public setCamera(camera:pogo.Camera):void
		{
			this.camera = camera;
		}
	}
}
