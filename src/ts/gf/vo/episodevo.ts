/// <reference path="itemvo.ts"/>



module gf.vo
{
	export class EpisodeVO extends gf.vo.ItemVO
	{
		/*
			Level IDs
		*/
		public levels:number[];



		public get lastLevel():number
		{
			return this.levels[this.levels.length - 1];
		}
	}
}
