/// <reference path="../webgl/shader.ts"/>



module kr3m.webgl
{
	export class VertexShader extends kr3m.webgl.Shader
	{
		private attributeTypes:any = {};



		constructor(canvas:kr3m.webgl.Canvas)
		{
			super(canvas, canvas.getGL().VERTEX_SHADER);
		}



		private findAttributes(source:string):void
		{
			this.attributeTypes = {};
			var pat = /attribute\s+(\w+)\s+(\w+)/g;
			var matches:any;
			while (matches = pat.exec(source))
				this.attributeTypes[matches[2]] = matches[1];
		}



		public setSource(source:string):void
		{
			this.findAttributes(source);
			super.setSource(source);
		};
	}
}
