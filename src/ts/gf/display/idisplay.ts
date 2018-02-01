module gf.display
{
	export interface IDisplay extends PIXI.Container
	{
		alignData:gf.utils.AlignData
		angle:number;
		bottom:number;
		game:gf.core.Game;
		left:number;
		right:number;
		scaleX:number;
		scaleY:number;
		scaleXY:number;
		top:number;

		hAlign(align:string, alignTo:gf.display.IDisplay | gf.core.Game | number, offset:number):void;
		vAlign(align:string, alignTo:gf.display.IDisplay | gf.core.Game | number, offset:number):void;
		onResize():void;
	}
}
