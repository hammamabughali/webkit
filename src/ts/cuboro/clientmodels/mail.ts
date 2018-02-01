/// <reference path="../../cuboro/stubs/mail.ts"/>
/// <reference path="../../kr3m/model/eventdispatcher.ts"/>



module cuboro.clientmodels
{
	export class Mail extends kr3m.model.EventDispatcher
	{
		constructor()
		{
			super();
		}


		public sendEcard(trackId:number,recepienEmail:string,
						recepienName:string,
						senderEmail:string,
						senderName:string,
						message:string )
		{
			sMail.sendEcard(trackId, recepienEmail,
				recepienName,
				senderEmail,
				senderName,
				message, (status) =>
			{
				console.log(" status : ", status);
			});
		}
	}
}



var mMail = new cuboro.clientmodels.Mail();
