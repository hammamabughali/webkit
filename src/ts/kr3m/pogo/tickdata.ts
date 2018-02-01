module pogo
{
	export class TickData
	{
		public delta:number;
		public deltaScaled:number;



		constructor(delta:number, scale:number)
		{
			this.delta = delta;
			this.deltaScaled = delta * scale;
		}
	}
}
