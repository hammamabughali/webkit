/// <reference path="../../cuboro/models/localization.ts"/>
/// <reference path="../../cuboro/tables/competitionstable.ts"/>
/// <reference path="../../cuboro/vo/competition.ts"/>



module cuboro.models
{
	export class Competition
	{
		public getCurrentlyActive(
			context:cuboro.Context,
			callback:(competitions:cuboro.vo.Competition[], status:string) => void):void
		{
			context.need({region : true}, () =>
			{
				var now = new Date();
				var where = db.escape("`regionId` = ? AND `enabled` = 'true' AND `starts` < ? AND `ends` > ?", [context.region.id, now, now]);
				tCompetitions.get(where, (competitions) =>
				{
					var vos = competitions.map(competition => new cuboro.vo.Competition(competition));
					mLoca.locItems(context, vos, () => callback(vos, kr3m.SUCCESS));
				}, () => callback(undefined, kr3m.ERROR_DATABASE));			
			}, () => callback(undefined, kr3m.ERROR_INTERNAL));		
		}
	}
}



var mCompetition = new cuboro.models.Competition();
