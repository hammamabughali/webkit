module kr3m.math
{
	export class Range
	{
		public min:number;
		public max:number;



		constructor(min:number, max:number)
		{
			this.min = Math.min(min, max);
			this.max = Math.max(min, max);
		}



		public plus(range:Range):Range
		{
			return new Range(this.min + range.min, this.max + range.max);
		}



		public minus(range:Range):Range
		{
			return new Range(this.min - range.max, this.max - range.min);
		}



		public times(range:Range):Range
		{
			return new Range(this.min * range.min, this.max * range.max);
		}



		public divided(range:Range):Range
		{
			return new Range(this.min / range.max, this.max / range.min);
		}
	}
}
