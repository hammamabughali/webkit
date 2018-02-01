/// <reference path="../../pogo/frame.ts"/>
/// <reference path="../../pogo/materials/ui.ts"/>
/// <reference path="../../pogo/meshes/scale9.ts"/>



module pogo.frames
{
	export interface Scale9Options extends pogo.FrameOptions
	{
		textureUrl:string;

		inferPadding?:boolean; // extract padding from png image using bottom row and right column
		padding?:number; // global padding setting
		paddingTop?:number;
		paddingRight?:number;
		paddingBottom?:number;
		paddingLeft?:number;
	}



	export class Scale9 extends pogo.Frame
	{
		protected options:Scale9Options;
		protected mesh:pogo.meshes.Scale9;
		protected material:pogo.materials.Ui;



		constructor(
			parentOrCanvas:pogo.Canvas|pogo.Entity2d,
			options:Scale9Options)
		{
			super(parentOrCanvas, options);

			this.options.paddingTop = this.options.paddingTop || this.options.padding || 0;
			this.options.paddingRight = this.options.paddingRight || this.options.padding || 0;
			this.options.paddingBottom = this.options.paddingBottom || this.options.padding || 0;
			this.options.paddingLeft = this.options.paddingLeft || this.options.padding || 0;

			this.setMesh(new pogo.meshes.Scale9(this.canvas, this.options));
			this.setMaterial(new pogo.materials.Ui(this.canvas, this.options));
		}



		public setSize(w:number, h:number):void
		{
			super.setSize(w, h);
			this.mesh.setSize(w, h);
		}
	}
}
