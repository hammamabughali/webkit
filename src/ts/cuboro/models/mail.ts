/// <reference path="../../kr3m/mail/email2.ts"/>
/// <reference path="../../kr3m/mail/email2config.ts"/>



module cuboro.models
{
	export class Mail
	{
		public sendEcard(
			context:kr3m.net2.Context,
			trackId:number,
			recepienEMail: string,
			recepienName: string,
			sendEmail: string,
			sendName: string,
			sendMessage: string,
			callback: ResultCB<boolean>): void
		{
			context.getLoc((loc) =>
			{
				context.getSyncParseFunc((locParse) =>
				{
					var tokens =
					{
						BODY : loc("EMAIL_ECARD_BODY"),
						SENDERNAME: sendName,
						RECEPIENNAME: recepienName,
						TRACKURL: "../../../track/"+ trackId +".png",
						HREFURL: context.request.getOrigin()+"/track/"+trackId+".png",
						SENDERMESSAGE: sendMessage
					};
					var subject = loc("EMAIL_ECARD_SUBJECT", tokens);
					var body = loc("EMAIL_ECARD_BODY",tokens);
					tokens["BODY"] = body;

					var email = new kr3m.mail.Email2(recepienEMail, subject);
					email.setTemplate("public/templates/email/ecard/default.html", tokens, locParse);

					email.send((status) =>
					{
						if ( status != kr3m.SUCCESS)
								callback(false, status);
						else
							callback(true, status);
					});
				});
			});
		}



		public sendContact(
			context:kr3m.net2.Context,
			senderEmail: string,
			senderName: string,
			message: string,
			callback: ResultCB<boolean>): void
		{
			context.getLoc((loc) =>
			{
				context.getSyncParseFunc((locParse) =>
				{
					//# TODO: in der build live property an info@cuboro.ch
					var tokens = {BODY : message};
					var subject = loc("EMAIL_CONTACT_SUBJECT", tokens);

					var email = new kr3m.mail.Email2(context.config.email.defaultSender, subject);

					email.setTemplate("public/templates/email/ecard/default.html", tokens, locParse);
					email.send((status) =>
					{
						if ( status != kr3m.SUCCESS)
							callback(false, status);
						else
							callback(true, status);
					});
				});
			});
		}


		public sendReportAbuse(
			context:cuboro.Context,
			reporterUser:cuboro.vo.User,
			comment:cuboro.tables.CommentVO,
			callback: ResultCB<boolean>): void
		{
			comment.getUser((commentUser)=>
			{
				if(!commentUser)
					return callback(false, kr3m.ERROR_EMPTY_DATA);

				comment.getTrack((track)=>
				{
					if(!track)
						return callback(false, kr3m.ERROR_EMPTY_DATA);

					context.getLoc((loc) =>
					{
						context.getSyncParseFunc((locParse) =>
						{
							var tokens =
								{
									BODY : loc("EMAIL_REPORT_BODY"),
									BAHNNAME: track.name,
									RPORTERUSERNAME: reporterUser.id,
									COMMENTURL: "",
									COMMENTUSER: commentUser.name,
									COMMENT: comment.comment
								};
							var subject = loc("EMAIL_ECARD_SUBJECT", tokens);
							var body = loc("EMAIL_REPORT_BODY",tokens);
							tokens["BODY"] = body;


							var email = new kr3m.mail.Email2(context.config.email.defaultSender, subject);
							email.setTemplate("public/templates/email/ecard/default.html", tokens, locParse);

							email.send((status) =>
							{
								if ( status != kr3m.SUCCESS)
									callback(false, status);
								else
									callback(true, status);
							});
						});
					});
				}, (error)=>
				{
					callback(false, kr3m.ERROR_DATABASE);
				});
			}, (error)=>
			{
				callback(false, kr3m.ERROR_DATABASE);
			});
		}
	}
}



var mMail = new cuboro.models.Mail();
