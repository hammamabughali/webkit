module gf.utils
{
	export class Scale
	{
		public static getScaleX(value:gf.display.IDisplay):number
		{
			return value.scale.x;
		}



		public static setScaleX(display:gf.display.IDisplay, value:number)
		{
			display.scale.x = value;
		}



		public static getScaleY(value:gf.display.IDisplay):number
		{
			return value.scale.y;
		}



		public static setScaleY(display:gf.display.IDisplay, value:number)
		{
			display.scale.y = value;
		}



		public static setScaleXY(display:gf.display.IDisplay, value:number)
		{
			display.scale.set(value, value);
		}
	}
}
