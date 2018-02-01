/// <reference path="../../pogo/frame.ts"/>
/// <reference path="../../pogo/materials/bitmapfont.ts"/>
/// <reference path="../../pogo/meshes/bitmapfont.ts"/>



module pogo.frames
{
	export interface BitmapFontOptions extends pogo.FrameOptions
	{
		fontUrl:string;
		text?:string;
	}



	export class BitmapFont extends pogo.Frame
	{
		protected options:BitmapFontOptions;

		protected mesh:pogo.meshes.BitmapFont;



		constructor(
			parentOrCanvas:pogo.Canvas|pogo.Entity2d,
			options:BitmapFontOptions)
		{
			super(parentOrCanvas, options);
			this.setMesh(new pogo.meshes.BitmapFont(this.canvas, this.options));
			this.setMaterial(new pogo.materials.BitmapFont(this.canvas, this.options));
		}



		public setText(text:string):void
		{
			this.mesh.setText(text);
		}



		public set alignH(value:pogo.TextAlignH)
		{
			this.mesh.alignH = value;
		}



		public get alignH():pogo.TextAlignH
		{
			return this.mesh.alignH;
		}



		public set alignV(value:pogo.TextAlignV)
		{
			this.mesh.alignV = value;
		}



		public get alignV():pogo.TextAlignV
		{
			return this.mesh.alignV;
		}



		public set wordWrap(value:boolean)
		{
			this.mesh.wordWrap = value;
		}



		public get wordWrap():boolean
		{
			return this.mesh.wordWrap;
		}



		public set overflowX(value:boolean)
		{
			this.mesh.overflowX = value;
		}



		public get overflowX():boolean
		{
			return this.mesh.overflowY;
		}



		public set overflowY(value:boolean)
		{
			this.mesh.overflowY = value;
		}



		public get overflowY():boolean
		{
			return this.mesh.overflowY;
		}
	}
}
