/// <reference path="maths.ts"/>



module gf.utils
{
	export class Angle
	{
		/*
			Get the rotation of an object in degrees.
			@param value Object to get the rotation of
			@returns {number}
		*/
		public static getAngle(value:gf.display.IDisplay):number
		{
			return gf.utils.Maths.wrapAngle(gf.utils.Maths.radToDeg(value.rotation));
		}


		/*
			Set the rotation of an object in degrees.
			@param display Object to get the rotation of
			@param value Rotation value in degrees
		*/
		public static setAngle(display:gf.display.IDisplay, value:number)
		{
			display.rotation = gf.utils.Maths.degToRad(gf.utils.Maths.wrapAngle(value));
		}
	}
}
