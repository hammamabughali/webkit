/// <reference path="../async/flags.ts"/>
/// <reference path="../async/join.ts"/>
/// <reference path="../math/vector3d.ts"/>
/// <reference path="../webgl/attributebuffer.ts"/>
/// <reference path="../webgl/elementbuffer.ts"/>
/// <reference path="../webgl/program.ts"/>



module pogo
{
	export interface MeshOptions
	{
		priority?:number;
	}



	export class Mesh
	{
		protected options:MeshOptions;

		public flags = new kr3m.async.Flags();

		protected attributeBuffers:{[id:string]:kr3m.webgl.AttributeBuffer} = {};
		protected elementBuffer:kr3m.webgl.ElementBuffer;



		constructor(
			protected canvas:Canvas,
			options?:MeshOptions)
		{
			this.options = options || {};
		}



		public setAttributeBuffer(
			name:string,
			buffer:kr3m.webgl.AttributeBuffer):void
		{
			this.attributeBuffers[name] = buffer;
		}



		public getAttributeBuffer(name:string):kr3m.webgl.AttributeBuffer
		{
			return this.attributeBuffers[name];
		}



		public setElementBuffer(buffer:kr3m.webgl.ElementBuffer):void
		{
			this.elementBuffer = buffer;
		}



		public getElementBuffer():kr3m.webgl.ElementBuffer
		{
			return this.elementBuffer;
		}



		public generateNormals(vertices:number[], indices:number[]):number[]
		{
			var vertexNormals:kr3m.math.Vector3d[] = [];
			for (var i = 0; i < vertices.length; i += 3)
				vertexNormals.push(new kr3m.math.Vector3d());

			var va = new kr3m.math.Vector3d();
			var vb = new kr3m.math.Vector3d();
			var vc = new kr3m.math.Vector3d();
			for (var i = 0; i < indices.length; i += 3)
			{
				var a = indices[i];
				var b = indices[i + 1];
				var c = indices[i + 2];
				va.x = vertices[a * 3]; va.y = vertices[a * 3 + 1]; va.z = vertices[a * 3 + 2];
				vb.x = vertices[b * 3]; vb.y = vertices[b * 3 + 1]; vb.z = vertices[b * 3 + 2];
				vc.x = vertices[c * 3]; vc.y = vertices[c * 3 + 1]; vc.z = vertices[c * 3 + 2];
				var vac = vc.minus(va);
				var vab = vb.minus(va);
				var n = vab.cross(vac);
				n.normalize();
				vertexNormals[a].add(n);
				vertexNormals[b].add(n);
				vertexNormals[c].add(n);
			}

			var normals:number[] = [];
			for (var i = 0; i * 3 < vertices.length; ++i)
			{
				vertexNormals[i].normalize();
				normals.push(vertexNormals[i].x);
				normals.push(vertexNormals[i].y);
				normals.push(vertexNormals[i].z);
			}
			return normals;
		}



		public render(program:kr3m.webgl.Program):void
		{
			if (!this.flags.isSet("ready"))
				return;

			for (var i in this.attributeBuffers)
				program.setAttributes(i, this.attributeBuffers[i]);
			this.elementBuffer.draw();
		}
	}
}
