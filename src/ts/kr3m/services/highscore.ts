/// <reference path="../util/ajax.ts"/>



module kr3m.services
{
	export class Highscore
	{
		public static TIMEFRAME_ALL:string = "all";
		public static TIMEFRAME_WEEK:string = "week";



		public static getPageCount(callback:(count:number) => void, timeFrame:string = Highscore.TIMEFRAME_ALL):void
		{
			var payload = {timeFrame:timeFrame};
			kr3m.util.Ajax.callService("Highscore.getPageCount", payload, function(response)
			{
				callback(response.payload.count);
			});
		}



		public static getPage(callback:(entries:any) => void, pageId:number, timeFrame:string = Highscore.TIMEFRAME_ALL):void
		{
			var payload = {pageId:pageId, timeFrame:timeFrame};
			kr3m.util.Ajax.callService("Highscore.getPage", payload, function(response)
			{
				callback(response.payload.entries);
			});
		}



		public static setHighscore(callback:(entryId:number) => void, nickname:string, score:number):void
		{
			var payload = {nickname:nickname, score:score};
			kr3m.util.Ajax.callService("Highscore.setHighscore", payload, function(response)
			{
				callback(response.payload.entryId);
			});
		}



		public static getEntryPosition(callback:(page:number, offset:number) => void, entryId:number, timeFrame:string = Highscore.TIMEFRAME_ALL):void
		{
			var payload = {timeFrame:timeFrame, entryId:entryId};
			kr3m.util.Ajax.callService("Highscore.getEntryPosition", payload, function(response)
			{
				callback(response.payload.position.page, response.payload.position.offset);
			});
		}
	}
}
