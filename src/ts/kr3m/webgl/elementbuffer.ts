/// <reference path="../webgl/buffer.ts"/>



module kr3m.webgl
{
	export class ElementBuffer extends kr3m.webgl.Buffer
	{
		private count:number;



		public setIndices(values:number[]):void
		{
			var gl = this.canvas.getGL();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferObj);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(values), gl.STATIC_DRAW);
			this.count = values.length;
		}



		public draw():void
		{
			var gl = this.canvas.getGL();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferObj);
			gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
		}
	}
}
