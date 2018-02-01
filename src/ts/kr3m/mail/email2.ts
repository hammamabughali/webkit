/// <reference path="../async/delayed.ts"/>
/// <reference path="../async/queue.ts"/>
/// <reference path="../cache/files/smart.ts"/>
/// <reference path="../constants.ts"/>
/// <reference path="../html/helper.ts"/>
/// <reference path="../lib/node.ts"/>
/// <reference path="../lib/nodemailer1.ts"/>
/// <reference path="../mail/email2config.ts"/>
/// <reference path="../types.ts"/>
/// <reference path="../util/file.ts"/>



module kr3m.mail
{
	/*
		Convenience-wrapper for sending eMails via nodemailer
	*/
	export class Email2
	{
		private static delay = new kr3m.async.Delayed();
		private static config:kr3m.mail.Email2Config;
		private static transport:any;

		public static TRANSPORT_DIRECT = "direct";
		public static TRANSPORT_SMTP = "smtp";

		private cache = kr3m.cache.files.Smart.getInstance();
		private queue = new kr3m.async.Queue(true);
		private options:NodemailerOptions;
		private knownCids:{[path:string]:number} = {};
		private freeCid = 0;
		private status = kr3m.SUCCESS;



		public static init(config:Email2Config):void
		{
			var self = kr3m.mail.Email2;
			self.config = config;
			switch (config.transport)
			{
				case self.TRANSPORT_DIRECT:
					self.transport = nodemailerLib.createTransport();
					break;

				case self.TRANSPORT_SMTP:
					self.transport = nodemailerLib.createTransport(smtpTransportLib({host : self.config.smtpHost, port : self.config.smtpPort, secure : false, requiresAuth : false, ignoreTLS : true }));
					break;
			}
			this.delay.execute();
		}



		constructor(to:string, subject:string, from?:string)
		{
			this.options =
			{
				from : from,
				to : to,
				subject : subject,
				attachments : []
			};
		}



		public setTextBody(text:string):this
		{
			this.options.text = text;
			return this;
		}



		public setHtmlBody(html:string):this
		{
			this.options.html = html;
			return this;
		}



		public attachFile(
			pathOrUrl:string,
			fileName?:string):number
		{
			fileName = fileName || kr3m.util.File.getFilenameFromPath(pathOrUrl);
			var cid = this.knownCids[pathOrUrl];
			if (cid === undefined)
			{
				cid = this.freeCid++;
				this.knownCids[pathOrUrl] = cid;

				this.queue.unshift((next) =>
				{
					this.cache.getFile(pathOrUrl, (content) =>
					{
						if (!content)
						{
							logError("could not load email attachment", pathOrUrl);
							this.status = kr3m.ERROR_INPUT;
							return next();
						}

						this.options.attachments.push(
						{
							filename : fileName,
							content : content,
							cid : cid.toString()
						});
						next();
					});
				});
			}
			return cid;
		}



		private replaceImages(
			template:string,
			templatePath:string,
			callback:(template:string) => void):void
		{
			template = template.replace(/\<img\b[^\>]*src=["']([^"']*)["']/gi, (match, p1) =>
			{
				if (this.cache.isRemote(templatePath))
					var realPath = kr3m.util.Url.merge(templatePath, p1);
				else
					var realPath = kr3m.util.File.resolvePath(templatePath, p1);

				var fileName = kr3m.util.File.getFilenameFromPath(realPath);
				var cid = this.attachFile(realPath, fileName);
				return match.replace(p1, "cid:" + cid);
			});
			callback(template);
		}



		/*
			Loads a template file from the filesystem or from the
			internet and uses its contents as the html-content of the
			message.
		*/
		public setTemplate(
			templatePathOrUrl:string,
			tokens?:Tokens,
			locParseFunc?:LocFunc):this
		{
			this.queue.push((next) =>
			{
				this.cache.getFile(templatePathOrUrl, (templateBuffer) =>
				{
					if (!templateBuffer)
					{
						logError("error while loading email template from", templatePathOrUrl);
						this.options.html = "error while loading email template";
						this.status = kr3m.ERROR_INPUT;
						return next();
					}
					var template = templateBuffer.toString("utf8");
					var helper = new kr3m.html.Helper();
					template = helper.getBody(template, tokens, null, locParseFunc);
					this.replaceImages(template, templatePathOrUrl, (template) =>
					{
						this.options.html = template;
						next();
					});
				});
			});
			return this;
		}



		public send(
			callback?:StatusCallback):void
		{
			this.queue.push((next) =>
			{
				kr3m.mail.Email2.delay.call(() =>
				{
					if (this.status != kr3m.SUCCESS)
					{
						callback && callback(this.status);
						return next();
					}

					this.options.from = this.options.from || kr3m.mail.Email2.config.defaultSender;
					kr3m.mail.Email2.transport.sendMail(this.options, (err:Error, result:any) =>
					{
						if (err)
						{
							if (!callback)
								logError("email send error:", err);
							else
								callback(kr3m.ERROR_EXTERNAL);
						}
						else
						{
							callback && callback(this.status);
						}
						next();
					});
				});
			});
		}



		public print(
			callback?:StatusCallback):void
		{
			this.queue.push((nextInQueue) =>
			{
				kr3m.mail.Email2.delay.call(() =>
				{
					this.options.from = this.options.from || kr3m.mail.Email2.config.defaultSender;
					debug(this);
					callback && callback(kr3m.SUCCESS);
					nextInQueue();
				});
			});
		}
	}
}
