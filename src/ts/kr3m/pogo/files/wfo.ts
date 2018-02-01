/// <reference path="../../pogo/files/meshfile.ts"/>



module pogo.files
{
	export class WFO extends MeshFile
	{
		private rawVertices:number[] = [];
		private rawTexels:number[] = [];
		private offsets:any = {};



		private parseVertex(params:string[]):void
		{
			this.rawVertices.push(parseFloat(params[1]));
			this.rawVertices.push(parseFloat(params[2]));
			this.rawVertices.push(parseFloat(params[3]));
		}



		private parseTexel(params:string[]):void
		{
			this.rawTexels.push(parseFloat(params[1]));
			this.rawTexels.push(1 - parseFloat(params[2]));
		}



		private parseElement(params:string[]):void
		{
			var maxVer = Math.floor(this.rawVertices.length / 3);
			var maxTex = Math.floor(this.rawTexels.length / 2);
			for (var i = 1; i < 4; ++i)
			{
				var indices = params[i].split("/");
				var vi = parseInt(indices[0]) - 1;
				if (vi < 0)
					vi = maxVer + vi + 1;

				var ti = indices.length > 1 ? parseInt(indices[1]) - 1: vi;
				if (ti < 0)
					ti = maxTex + ti + 1;

				var offsetKey = vi + "_" + ti;
				var offset:number = this.offsets[offsetKey];
				if (offset !== undefined)
				{
					this.elementData.push(offset);
					continue;
				}

				var offset = Math.floor(this.vertexData.length / 3);
				this.offsets[offsetKey] = offset;
				this.elementData.push(offset);

				if (vi * 3 + 2 >= this.rawVertices.length)
					throw new Error("invalid vertex offset");

				this.vertexData.push(this.rawVertices[vi * 3], this.rawVertices[vi * 3 + 1], this.rawVertices[vi * 3 + 2]);

				if (ti * 2 + 1 >= this.rawTexels.length)
					throw new Error("invalid texel offset");

				//# FIXME: die aktuelle Implementierung führt zu Sprüngen in Texturen
				this.texelData.push(this.rawTexels[ti * 2], this.rawTexels[ti * 2 + 1]);
			}
		}



		public parse(code:string):void
		{
			this.rawVertices = [];
			this.rawTexels = [];
			this.offsets = {};

			this.vertexData = [];
			this.texelData = [];
			this.elementData = [];

			var funcs =
			{
				v : this.parseVertex.bind(this),
				vt : this.parseTexel.bind(this),
				f : this.parseElement.bind(this)
			};

			var lines = code.split("\n");
			var patWord = /^(\S+)\s/;
			for (var i = 0; i < lines.length; ++i)
			{
				var matches = lines[i].match(patWord);
				if (!matches)
					continue;

				var func = funcs[matches[1]];
				if (!func)
					continue;

				var params = lines[i].replace(/\s+/g, " ").split(" ");
				func(params);
			}
			this.rawVertices = [];
			this.rawTexels = [];
		}
	}
}
