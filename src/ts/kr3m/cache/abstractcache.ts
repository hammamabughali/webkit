//# PROFILING
//# VERBOSE
/// <reference path="../util/log.ts"/>
//# /VERBOSE
//# /PROFILING



module kr3m.cache
{
	export abstract class AbstractCache<T>
	{
//# PROFILING
		private hitCount = 0;
		private missCount = 0;
//# /PROFILING



		public abstract clear():void;
		public abstract set(key:string, value:T):void;
		public abstract unset(key:string):void;
		public abstract get(key:string):T;
		public abstract contains(key:string):boolean;
		public abstract getSize():number;



//# PROFILING
		protected countHit():void
		{
			++this.hitCount;
//# VERBOSE
			logProfilingLow("Cache hit", this.getHitRatio());
//# /VERBOSE
		}
//# /PROFILING



//# PROFILING
		protected countMiss():void
		{
			++this.missCount;
//# VERBOSE
			logProfiling("Cache miss", this.getHitRatio());
//# /VERBOSE
		}
//# /PROFILING



//# PROFILING
		public getHitRatio():number
		{
			var total = this.hitCount + this.missCount;
			return total > 0 ? this.hitCount / total : 0;
		}
//# /PROFILING



//# PROFILING
		public getMissRatio():number
		{
			var total = this.hitCount + this.missCount;
			return total > 0 ? this.missCount / total : 0;
		}
//# /PROFILING
	}
}
