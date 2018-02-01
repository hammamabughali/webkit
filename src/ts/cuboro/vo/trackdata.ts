/// <reference path="evaluationdata.ts"/>



module cuboro.vo
{
	export class TrackData
	{
		public cubes: string[];
		public evaluation: cuboro.vo.EvaluationData = new cuboro.vo.EvaluationData();
		public sets: string[];
	}
}
