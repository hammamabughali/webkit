/// <reference path="../../pogo/renderers/r3d.ts"/>



module pogo.renderers
{
	export class Deferred extends pogo.renderers.R3d
	{
		constructor(canvas:pogo.Canvas, camera:pogo.Camera)
		{
			super(canvas, camera);
		}



		public render(actors:pogo.Actor[]):void
		{
			//# TODO: NYI render
		}
	}
}
