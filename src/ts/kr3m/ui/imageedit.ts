/// <reference path="../math/matrix2x3.ts"/>
/// <reference path="../ui/behaviour/freemove.ts"/>
/// <reference path="../ui/element.ts"/>
/// <reference path="../ui/formbutton.ts"/>
/// <reference path="../ui/image.ts"/>
/// <reference path="../util/browser.ts"/>



module kr3m.ui
{
	export class ImageEdit extends kr3m.ui.Element
	{
		private mask:kr3m.ui.Element;
		private image:kr3m.ui.Image;
		private freeMove:kr3m.ui.behaviour.FreeMove;

//# DEBUG
		private controls:kr3m.ui.Element;
//# /DEBUG

		private maskScale:number;
		private desiredWidth:number;
		private desiredHeight:number;



		constructor(parent, attributes:any = {})
		{
			super(parent, null, "div", attributes);
			this.addClass("imageEdit");
			this.dom.css("width", "100%");

			this.mask = new kr3m.ui.Element(this, null, "div", {"class":"imageEditMask", "style":"overflow:hidden; position:relative;"});
			this.image = new kr3m.ui.Image(this.mask);
			this.image.setLoadedCallback(this.onImageLoaded.bind(this));

			this.freeMove = new kr3m.ui.behaviour.FreeMove(this.mask, this.image);

//# DEBUG
//# !APP
			if (!kr3m.util.Browser.isMobile())
			{
				// Zeug um das Ding auf dem Desktop debuggen zu können
				this.controls = new kr3m.ui.Element(this, null, "div");
				new kr3m.ui.FormButton(this.controls, "Rotate Clockwise", this.freeMove.rotate.bind(this.freeMove, 15));
				new kr3m.ui.FormButton(this.controls, "Rotate Counterclockwise", this.freeMove.rotate.bind(this.freeMove, -15));
				new kr3m.ui.FormButton(this.controls, "Left", this.freeMove.translate.bind(this.freeMove, -10, 0));
				new kr3m.ui.FormButton(this.controls, "Right", this.freeMove.translate.bind(this.freeMove, 10, 0));
				new kr3m.ui.FormButton(this.controls, "Up", this.freeMove.translate.bind(this.freeMove, 0, -10));
				new kr3m.ui.FormButton(this.controls, "Down", this.freeMove.translate.bind(this.freeMove, 0, 10));
				new kr3m.ui.FormButton(this.controls, "Zoom In", this.freeMove.scale.bind(this.freeMove, 1.25));
				new kr3m.ui.FormButton(this.controls, "Zoom Out", this.freeMove.scale.bind(this.freeMove, 0.8));
				new kr3m.ui.FormButton(this.controls, "Reset", this.freeMove.reset.bind(this.freeMove));

				this.setDesiredSize(dl.DRIVER_PROFILE_IMAGE_WIDTH, dl.DRIVER_PROFILE_IMAGE_HEIGHT);
				this.setImageUrl("http://192.168.2.125:8080/images/drivers/tmp/2401.jpg");
			}
//# /!APP
//# /DEBUG
		}



		private adjustMask():void
		{
			if (!this.desiredWidth || !this.desiredHeight)
				return;

			var parentWidth:number = this.dom.parent().width();
			var aspectRatio = this.desiredWidth / this.desiredHeight;
			if (aspectRatio >= 1)
			{
				var adjustedWidth = parentWidth;
				var margin = 0;
			}
			else
			{
				var adjustedWidth = parentWidth * aspectRatio;
				var margin = (parentWidth - adjustedWidth) / 2;
			}
			var adjustedHeight = Math.floor(adjustedWidth / aspectRatio);

			if (adjustedHeight == 0 || adjustedWidth == 0)
				setTimeout(this.adjustMask.bind(this), 100);

			this.maskScale = adjustedWidth / this.desiredWidth;

			this.mask.dom.css(
			{
				width:adjustedWidth,
				height:adjustedHeight,
				margin:"0px " + margin + "px"
			});
		}



		public onAddedToStage():void
		{
			super.onAddedToStage();
			this.adjustMask();
		}



		private onImageLoaded():void
		{
			this.adjustMask();
			this.freeMove.reset();
		}



		public getImageMagickMatrix():number[]
		{
			var scale = new kr3m.math.Matrix2x3();
			scale.setIdentity();
			scale.scale(1 / this.maskScale);
			return scale.concated(this.freeMove.getMatrix()).v;
		}



		public setDesiredSize(width:number, height:number):void
		{
			this.desiredWidth = width;
			this.desiredHeight = height;
			this.adjustMask();
		}



		public setImageUrl(url:string):void
		{
			this.image.setUrl(url);
			this.adjustMask();
		}
	}
}
