module pogo
{
	export class Easing
	{
		public static LINEAR(f:number):number
		{
			return Math.min(Math.max(0, f), 1);
		}



		public static INOUTQUAD(f:number):number
		{
			f = Math.min(Math.max(0, f), 1);
			if (f < 0.5)
				return 2 * f * f;
			--f;
			return 1 - 2 * f * f;
		}
	}
}
