/// <reference path="../../pogo/frame.ts"/>
/// <reference path="../../pogo/materials/ui.ts"/>
/// <reference path="../../pogo/meshes/rectangle.ts"/>



module pogo.frames
{
	export interface RectangleOptions extends pogo.FrameOptions
	{
		textureUrl:string;
	}



	export class Rectangle extends pogo.Frame
	{
		protected options:RectangleOptions;
		protected mesh:pogo.meshes.Rectangle;
		protected material:pogo.materials.Ui;



		constructor(
			parentOrCanvas:pogo.Canvas|pogo.Entity2d,
			options:RectangleOptions)
		{
			super(parentOrCanvas, options);
			this.setMesh(new pogo.meshes.Rectangle(this.canvas, this.options));
			this.setMaterial(new pogo.materials.Ui(this.canvas, this.options));
		}



		public setSize(w:number, h:number):void
		{
			super.setSize(w, h);
			this.mesh.setSize(w, h);
		}
	}
}
