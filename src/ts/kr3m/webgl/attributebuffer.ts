/// <reference path="../webgl/buffer.ts"/>



module kr3m.webgl
{
	export class AttributeBuffer extends kr3m.webgl.Buffer
	{
		protected entrySize:number;
		protected changeCount = 0;
		protected drawMode:number;



		constructor(canvas:kr3m.webgl.Canvas)
		{
			super(canvas);
			var gl = this.canvas.getGL();
			this.drawMode = gl.STATIC_DRAW;
		}



		public useInLoc(loc:number):void
		{
			var gl = this.canvas.getGL();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferObj);
			gl.vertexAttribPointer(loc, this.entrySize, gl.FLOAT, false, 0, 0);
		}



		protected updateDrawMode():void
		{
			++this.changeCount;
			if (this.changeCount == 2)
				this.drawMode = this.canvas.getGL().DYNAMIC_DRAW;
		}



		public setVertices(values:number[]):void
		{
			this.updateDrawMode();
			this.entrySize = 3;
			var gl = this.canvas.getGL();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferObj);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), this.drawMode);
		}



		public updateVertices(values:number[], offset:number = 0):void
		{
			this.updateDrawMode();
			this.entrySize = 3;
			var gl = this.canvas.getGL();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferObj);
			gl.bufferSubData(gl.ARRAY_BUFFER, offset, new Float32Array(values));
		}



		public setNormals(values:number[]):void
		{
			this.updateDrawMode();
			this.entrySize = 3;
			var gl = this.canvas.getGL();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferObj);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), this.drawMode);
		}



		public setColors(values:number[]):void
		{
			this.updateDrawMode();
			this.entrySize = 4;
			var gl = this.canvas.getGL();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferObj);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), this.drawMode);
		}



		public setTexels(values:number[]):void
		{
			this.updateDrawMode();
			this.entrySize = 2;
			var gl = this.canvas.getGL();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferObj);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), this.drawMode);
		}



		public setTextureCoords3d(values:number[]):void
		{
			this.updateDrawMode();
			this.entrySize = 3;
			var gl = this.canvas.getGL();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferObj);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), this.drawMode);
		}
	}
}
