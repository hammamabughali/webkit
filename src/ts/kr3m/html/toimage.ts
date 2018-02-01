/// <reference path="../lib/node.ts"/>
/// <reference path="../types.ts"/>
/// <reference path="../util/childprocess.ts"/>
/// <reference path="../util/log.ts"/>



module kr3m.html
{
	export class ToImage
	{
		private static cs = new kr3m.async.CriticalSection(3);

		private sourceUrl:string;
		private width:number;
		private height:number;



		public setSourceUrl(url:string):this
		{
			this.sourceUrl = encodeURI(url);
			return this;
		}



		public setWidth(width:number):void
		{
			this.width = width;
		}



		public setHeight(height:number):void
		{
			this.height = height;
		}



		public flush(
			filePath:string,
			callback?:SuccessCallback):void
		{
			var args = ["--no-stop-slow-scripts"];
			var opString = "wkhtmltoimage";

			if (this.width)
				args.push("--width", String(this.width));

			if (this.height)
				args.push("--height", String(this.height));

			args.push(this.sourceUrl, filePath);

			logVerbose(opString, ...args);

			var process = new kr3m.util.ChildProcess("wkhtmltoimage", args);
			process.exec((status) =>
			{
//# DEBUG
				if (status != kr3m.SUCCESS)
				{
					logError("ToImage failed:");
					logError(opString);
					logError(process.error);
				}
//# /DEBUG
				callback && callback(!process.error);
			});
		}
	}
}
