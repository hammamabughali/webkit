/// <reference path="../../constants.ts"/>
/// <reference path="../../html/helper.ts"/>
/// <reference path="../../lib/node.ts"/>
/// <reference path="../../net2/handlers/abstract.ts"/>
/// <reference path="../../util/dates.ts"/>
/// <reference path="../../util/stringex.ts"/>
/// <reference path="../../util/util.ts"/>



module kr3m.net2.handlers
{
	/*
		Ein einfacher Handler, der einige technische Informationen
		über den Status des Server zurück gibt. Jede Anwendung sollte
		eine eigene Klasse davon ableiten und um weitere anwendungs-
		spezifische Informationen erweitern.
	*/
	export class Status extends Abstract
	{
		constructor(
			uriPattern:RegExp = /^\/status$/,
			public logFilePath = "server.log")
		{
			super(uriPattern);
		}



		public getUptime():string
		{
			var duration = Math.floor(process.uptime() * 1000);
			return kr3m.util.StringEx.getDurationString(duration);
		}



		protected getLogTail(
			callback:(tail:string, logSize:number) => void):void
		{
			fsLib.readFile(this.logFilePath, {encoding: "utf8"}, (err:Error, content:string) =>
			{
				if (err)
					return callback("", 0);

				var lines = content.split(/\r?\n/);
				var tail = lines.slice(-200).join("\n");
				callback(tail, content.length);
			});
		}



		protected getStatus(
			callback:(status:{[group:string]:{[property:string]:any}}) => void):void
		{
			var status:{[group:string]:{[property:string]:any}} = {};
			status["Server"] = status["Server"] || {};
			status["Server"]["Framework Version"] = kr3m.VERSION;
			status["Server"]["Local Time"] = kr3m.util.Dates.getDateTimeString(new Date(), false);
			status["Server"]["Uptime"] = this.getUptime();
			status["Server"]["CPU Count"] = osLib.cpus().length;
			status["Server"]["CPU Usage"] = kr3m.getCpuUsage().map((usage:number) => (usage * 100).toFixed(2) + "%").join(", ");
			status["Server"]["Process Memory Usage"] = getMemoryUseString();
//# DEBUG
			status["Server"]["Build"] = "Debug";
//# /DEBUG
//# RELEASE
			status["Server"]["Build"] = "Release";
//# /RELEASE
			callback(status);
		}



		protected getStatusHtml(
			callback:(html:string) => void):void
		{
			this.getStatus((status) =>
			{
				this.getLogTail((tail, logSize) =>
				{
					status["Log File"] = status["Log File"] || {};
					status["Log File"]["File Path"] = this.logFilePath;
					status["Log File"]["Total Size"] = kr3m.util.StringEx.getSizeString(logSize);

					var html = "";
					for (var group in status)
					{
						html += "<b>" + group + "</b><br/>\n";
						for (var property in status[group])
							html += property + " : " + status[group][property] + "<br/>\n";
						html += "<br/>\n";
					}

					if (tail)
					{
						var helper = new kr3m.html.Helper();
						html += helper.consoleToHtml(tail);
					}

					callback(html);
				});
			});
		}



		public handle(context:Context):void
		{
			this.checkAuth(context, "Minimal Security Area", "kr3m", "nan", () =>
			{
				this.getStatusHtml((status) =>
				{
					var html = "<!DOCTYPE html><html><head><title>Server Status</title></head><body>" + status + "</body></html>";
					context.response.disableBrowserCaching();
					context.flush(200, html, "text/html; charset=utf-8");
				});
			});
		}
	}
}
