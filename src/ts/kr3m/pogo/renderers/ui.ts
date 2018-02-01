/// <reference path="../../pogo/frame.ts"/>
/// <reference path="../../pogo/renderers/r2d.ts"/>



module pogo.renderers
{
	export class UI extends pogo.renderers.R2d
	{
		public render(frames:pogo.Frame[]):void
		{
			var gl = this.canvas.getGL();

			gl.disable(gl.DEPTH_TEST);
			gl.enable(gl.BLEND);
			gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

			var matrices:{[id:string]:kr3m.math.Matrix4x4} = {};

			var uP = new kr3m.math.Matrix4x4();
			uP.setViewport(this.canvas.getWidth(), this.canvas.getHeight());
			matrices["uP"] = uP;

			var uV = new kr3m.math.Matrix4x4();
			uV.setIdentity();
			matrices["uV"] = uV;

			var uPV = uP.concated4x4(uV);
			matrices["uPV"] = uPV;

			for (var i = 0; i < frames.length; ++i)
				frames[i].render(matrices);
		}
	}
}
