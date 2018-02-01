/// <reference path="../math/matrix4x4.ts"/>
/// <reference path="../pogo/entity3d.ts"/>
/// <reference path="../pogo/light.ts"/>
/// <reference path="../pogo/material.ts"/>
/// <reference path="../pogo/mesh.ts"/>



module pogo
{
	export interface ActorOptions extends Entity3dOptions
	{
	}



	export class Actor extends Entity3d
	{
		protected options:ActorOptions;

		protected material:Material;
		protected mesh:Mesh;



		constructor(
			parentOrCanvas:Canvas|Entity3d,
			options?:ActorOptions)
		{
			super(parentOrCanvas, options);
			this.flags.addSetConstraint("ready", ["mesh", "material"], true);
		}



		public setMaterial(material:Material):void
		{
			this.flags.clear("material");
			this.material = material;
			if (this.material)
			{
				this.material.flags.onceSet("ready", () =>
				{
					this.flags.set("material");
					this.touchCanvas();
				});
			}
		}



		public setMesh(mesh:Mesh):void
		{
			this.flags.clear("mesh");
			this.mesh = mesh;
			if (this.mesh)
			{
				this.mesh.flags.onceSet("ready", () =>
				{
					this.flags.set("mesh");
					this.touchCanvas();
				});
			}
		}



		public update(data:TickData):void
		{
			if (this.material)
				this.material.update(data);
			super.update(data);
		}



		public render(
			matrices:{[id:string]:kr3m.math.Matrix4x4},
			lights:Light[]):void
		{
			if (!this.flags.isSet("ready"))
				return;

			var uM = this.getMatrix();
			matrices["uM"] = uM;

			var uPVM = matrices["uPV"].concated4x4(uM);
			matrices["uPVM"] = uPVM;

			var uVM = matrices["uV"].concated4x4(uM);
			matrices["uVM"] = uVM;

			var uN = uVM.getRotationOnlyFast();
			matrices["uN"] = uN;

			var prog = this.material.getProgram();
			prog.setUniformColor("uAmbientLight", this.canvas.ambientLightColor);

			this.material.render(matrices, this.mesh, lights);
		}
	}
}
