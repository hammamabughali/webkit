/// <reference path="../../cuboro/stubs/abstract.ts"/>


module cuboro.stubs
{
	export class Mail extends Abstract
	{
		constructor()
		{
			super();

			this.htmlEscapeStrings = false;
		}

		public sendEcard(
			trackId:number,
			recipienEmail:string,
			recipienName:string,
			senderEmail:string,
			senderName:string,
			message:string,
			callback: ResultCB<boolean>):void
		{
			var params = {trackId:trackId, recipienEmail:recipienEmail, recipienName:recipienName, senderEmail:senderEmail, senderName:senderName, message: message };
			this.callService("Mail.sendEcard", params, response => callback(response.data, response.status));
		}


		public sendContact(
			senderName:string,
			senderEmail:string,
			senderMessage:string,
			callback:ResultCB<boolean>):void
		{
			var params = {senderName:senderName, senderEmail:senderEmail, message:senderMessage};
			this.callService("Mail.sendContact", params, response => callback(response.data , response.status));
		}
	}
}



var sMail = new cuboro.stubs.Mail();
