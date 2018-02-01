/// <reference path="../../lib/apn.ts"/>
/// <reference path="../../phonegap/pnsenders/pnsender.ts"/>



module kr3m.phonegap.pnsenders
{
	export class ApnSender extends kr3m.phonegap.pnsenders.PNSender
	{
		private certificate:string;
		private key:string;
		private password:string;

		private connection:any = null;
		private feedback:any = null;



		constructor(certificate:string, key:string, password:string)
		{
			super();

			this.certificate = certificate;
			this.key = key;
			this.password = password;
		}



		private startFeedback(options:any):void
		{
			if (this.feedback)
				return;

			options.interval = 1;
			this.feedback = new apnLib.Feedback(options);

			this.feedback.on("feedback", this.onFeedback.bind(this));
			this.feedback.on("feedbackError", this.onFeedbackError.bind(this));
		}



		private onFeedback(data:any[]):void
		{
			if (data.length <= 0)
				return;

			log("--------------------------------------------------");
			log("apn feedback:");
			for (var i = 0; i < data.length; ++i)
			{
				var time = data[i].time;
				var device = data[i].device;
				log("device " + device.toString("hex") + " has been unreachable, since " + time);
			}
			log("--------------------------------------------------");
		}



		private onFeedbackError(error:Error):void
		{
			logError("--------------------------------------------------");
			logError("apn feedback error:");
			logError(error);
			logError("--------------------------------------------------");
		}



		private stopFeedback():void
		{
			if (!this.feedback)
				return;

			this.feedback.cancel();
			this.feedback = null;
		}



		private getConnection(callback:(connection:any) => void):void
		{
			if (this.connection)
				return callback(this.connection);

			var options =
			{
				cert:this.certificate,
				key:this.key,
				passphrase:this.password,
				gateway:"gateway.push.apple.com",
				production:true
			};

			this.connection = new apnLib.Connection(options);
			// this.startFeedback(options);

			this.connection.on("disconnected", () =>
			{
				this.connection = null;
				// this.stopFeedback();
			});

			this.connection.on("error", (error:Error) =>
			{
				this.connection = null;
				// this.stopFeedback();
				logError(error);
				callback(null);
			});

			callback(this.connection);
		}



		public send(
			regIds:string[],
			title:string, message:string,
			callback:(success:boolean) => void = null):void
		{
			if (!this.certificate || !this.key || ! this.password || regIds.length == 0)
			{
				if (callback)
					callback(false);
				return;
			}

//# DEBUG
			log("sending message to apple devices:");
			debug(regIds);
//# /DEBUG

			this.getConnection((connection:any) =>
			{
				if (!connection)
					return callback(false);

				connection.once("completed", () =>
				{
					log("completed");
					if (callback)
						callback(true);
				});

				var note = new apnLib.Notification();
				note.setAlertText(message);
				note.payload = {title:title, message:message};
				note.expiry = Math.floor(Date.now() / 1000) + this.notificationTTL;
				note.badge = 1;
				connection.pushNotification(note, regIds);
			});
		}
	}
}
