/// <reference path="../../cuboro/stubs/abstract.ts"/>
/// <reference path="../../cuboro/vo/competition.ts"/>



module cuboro.stubs
{
	export class Competition extends Abstract
	{
		constructor()
		{
			super();

			this.htmlEscapeStrings = false;
		}



		public getCurrentlyActive(
			callback:ResultCB<cuboro.vo.Competition[]>):void
		{
			var params = {};
			this.callService("Competition.getCurrentlyActive", params, response => callback(response.data, response.status));
		}
	}
}



var sCompetition = new cuboro.stubs.Competition();
