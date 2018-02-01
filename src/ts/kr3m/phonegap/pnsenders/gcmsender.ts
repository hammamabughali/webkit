/// <reference path="../../lib/nodegcm.ts"/>
/// <reference path="../../phonegap/pnsenders/pnsender.ts"/>



module kr3m.phonegap.pnsenders
{
	export class GcmSender extends kr3m.phonegap.pnsenders.PNSender
	{
		private apiKey:string;



		constructor(apiKey:string)
		{
			super();
			this.apiKey = apiKey;
		}



		public send(
			regIds:string[],
			title:string, message:string,
			callback:(success:boolean) => void = null):void
		{
			if (!this.apiKey || regIds.length == 0)
			{
				if (callback)
					callback(false);
				return;
			}
//# DEBUG
			log("sending message to android devices:");
			debug(regIds);
//# /DEBUG
			var msg = new gcmLib.Message(
			{
				// collapseKey: "kr3m",
				delayWhileIdle: false,
				timeToLive: this.notificationTTL,
				data:
				{
					title:title,
					message:message
				}
			});

			var sender = new gcmLib.Sender(this.apiKey);
			sender.send(msg, regIds, 4, (err:Error, result:any) =>
			{
				if (err)
				{
					logError(err);
					if (callback)
						callback(false);
					return;
				}
//# DEBUG
				debug(result);
//# /DEBUG
				if (callback)
					callback(result.success > 0);
			});
		}
	}
}
