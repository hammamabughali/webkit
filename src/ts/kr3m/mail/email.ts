/// <reference path="../lib/node.ts"/>
/// <reference path="../lib/nodemailer0.ts"/>
/// <reference path="../util/file.ts"/>
/// <reference path="../util/htmlhelper.ts"/>
/// <reference path="../util/localization.ts"/>
/// <reference path="../util/map.ts"/>



module kr3m.mail
{
	/*
		Bequemlichkeitsklasse zum Versenden von Emails
		(über nodemailer)

		Es muss einmalig im Programm die initSMTP Methode
		aufgerufen werden um den gewünschten Server aufzufen.
		Anschließend können Instanzen der Klasse angelegt
		werden, befüllt und versandt.
	*/
	//# DEPRECATED: this class is deprecated, please use kr3m.mail.Email2 instead
	export class Email
	{
		private static transportParams:any[] = ["Sendmail", {path:"sendmail", args:["-t"]}];

		public static defaultSender:string = "no-reply@kr3m.com";

		private options:MailComposer;
		private knownCids = new kr3m.util.Map<number>();
		private freeCid = 0;



		constructor(to:string, subject:string, from:string = null)
		{
			from = from || kr3m.mail.Email.defaultSender;
			this.options =
			{
				from : from,
				to : to,
				subject : subject,
				generateTextFromHTML : true,
				attachments:[]
			};
		}



		public setTextBody(text:string):void
		{
			this.options.text = text;
		}



		public setHtmlBody(html:string):void
		{
			this.options.html = html;
		}



		/*
			Hängt eine beliebige Datei als Anhang in die Email.
			path ist der lokale Pfad der Datei im Dateisystem,
			fileName ist ein optionaler Name der Datei in der
			Mail (also praktisch was der Empfänger sieht, wenn
			er den Anhang speichern will). Wird fileName nicht
			angegeben, wird der Originalname der Datei aus path
			verwendet.
		*/
		public attachFile(path:string, fileName:string = null):number
		{
			fileName = fileName || kr3m.util.File.getFilenameFromPath(path);
			var cid = this.knownCids.get(path);
			if (cid === null)
			{
				cid = this.freeCid++;
				this.knownCids.set(path, cid);

//# DEBUG
				fsLib.exists(path, (exists:boolean) =>
				{
					if (!exists)
						logError("attachment file " + path + " not found");
				});
//# /DEBUG

				this.options.attachments.push(
				{
					fileName:fileName,
					filePath:path,
					cid:cid.toString()
				});
			}
			return cid;
		}



		private replaceImages(template:string, templatePath:string):string
		{
			template = template.replace(/\<img [^\>]*src=["']([^"']*)["']/gmi, (match:string, p1?:string) =>
			{
				var realPath = kr3m.util.File.resolvePath(templatePath, p1);
				var fileName = kr3m.util.File.getFilenameFromPath(realPath);
				var cid:number = this.attachFile(realPath, fileName);
				return match.replace(p1, "cid:" + cid);
			});
			return template;
		}



		/*
			Lädt eine Html-Datei von der Festplatte und befüllt den
			Body und die Attachments der Mail anhand des Templates.
		*/
		public setTemplate(
			templatePath:string,
			tokens:any = null,
			languageId:string = kr3m.util.Localization.language):void
		{
			var template = fsLib.readFileSync(templatePath, "utf-8");
			template = kr3m.util.HtmlHelper.getBody(template, true, tokens, true, languageId);
			template = this.replaceImages(template, templatePath);
			this.options.html = template;
		}



		public send(
			callback:(success:boolean) => void = null,
			transportType:string = "Sendmail",
			transportParams:any = {}):void
		{
			var transport = nodemailerLib.createTransport(transportType, transportParams);
			transport.sendMail(this.options, function(error:Error, response:any)
			{
				if (error)
					logError(error);
				transport.close();
				if (callback)
					callback(error == null);
			});
		}
	}
}
