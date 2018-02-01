/// <reference path="../util/stringex.ts"/>



module kr3m.util
{
	export class Stopwatch
	{
		private startTime:number;



		constructor()
		{
			this.restart();
		}



		public restart():void
		{
			this.startTime = Date.now();
		}



		public getDuration():number
		{
			var now = Date.now();
			return now - this.startTime;
		}



		public getDurationString():string
		{
			return StringEx.getDurationString(this.getDuration());
		}
	}
}
