/// <reference path="../../cuboro/models/competition.ts"/>
/// <reference path="../../cuboro/services/abstract.ts"/>
/// <reference path="../../cuboro/vo/competition.ts"/>



module cuboro.services
{
	export class Competition extends Abstract
	{
		public getCurrentlyActive(
			context:cuboro.Context,
			params:any,
			callback:CB<kr3m.services.CallbackResult<cuboro.vo.Competition[]>>):void
		{
			mCompetition.getCurrentlyActive(context, (competitions, status) => callback(new kr3m.services.CallbackResult(status, competitions)));
		}
	}
}
