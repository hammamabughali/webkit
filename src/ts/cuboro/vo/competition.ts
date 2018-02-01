//# SERVER
/// <reference path="../../cuboro/tables/competitionvo.ts"/>
//# /SERVER



module cuboro.vo
{
	export class Competition
	{
		public id:number;



//# SERVER
		constructor(competition:cuboro.tables.CompetitionVO)
		{
			this.id = competition.id;
		}
//# /SERVER
	}
}
