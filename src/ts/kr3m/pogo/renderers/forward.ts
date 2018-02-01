/// <reference path="../../pogo/renderers/r3d.ts"/>



module pogo.renderers
{
	export class Forward extends pogo.renderers.R3d
	{
		constructor(canvas:pogo.Canvas, camera:pogo.Camera)
		{
			super(canvas, camera);
		}



		public render(
			actors:pogo.Actor[],
			lights:pogo.Light[]):void
		{
			var gl = this.canvas.getGL();

			gl.clearDepth(1.0);
			gl.clear(gl.DEPTH_BUFFER_BIT);

			gl.enable(gl.DEPTH_TEST);
			gl.depthFunc(gl.LESS);

			var matrices:{[id:string]:kr3m.math.Matrix4x4} = {};

			var uP = this.camera.getPerspectiveMatrix();
			matrices["uP"] = uP;

			var uV = this.camera.getViewMatrix();
			matrices["uV"] = uV;

			var uPV = uP.concated4x4(uV);
			matrices["uPV"] = uPV;

			for (var i = 0; i < actors.length; ++i)
				actors[i].render(matrices, lights);
		}
	}
}
