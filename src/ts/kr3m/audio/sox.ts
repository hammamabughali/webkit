/// <reference path="../async/loop.ts"/>
/// <reference path="../lib/childprocess.ts"/>
/// <reference path="../lib/node.ts"/>



//# EXPERIMENTAL
module kr3m.audio
{
	export class Sox
	{
		public static toolPath = "sox";

		private toolPath:string;
		private opString:string;
		private fileParams:string[] = [];
		private suffix = "";



		constructor(toolPath?:string)
		{
			this.toolPath = toolPath || kr3m.audio.Sox.toolPath;
			this.opString = this.toolPath;
		}



		private reset():void
		{
			this.opString = this.toolPath;
			this.fileParams = [];
			this.suffix = "";
		}



		public addFile(path:string):Sox
		{
			this.fileParams.push("\"" + path + "\"");
			return this;
		}



		private chainFilter(filter:string):void
		{
			var l = this.fileParams.length - 1;
			if (l < 0)
				this.suffix += " " + filter;
			else
				this.fileParams[l] += " " + filter;
		}



		public delay(duration:number):Sox
		{
			this.chainFilter("-p pad " + duration);
			return this;
		}



		public fadeInOut(duration:number):Sox
		{
			this.chainFilter("fade " + duration + " 0");
			return this;
		}



		public trim(offset:number, duration:number):Sox
		{
			this.chainFilter("trim " + offset + " " + duration);
			return this;
		}



		private escapeFilters(command:string):string
		{
			command = command.replace(/"/g, "\\\"");
			return "\"|sox " + command + "\"";
		}



		public flush(
			outputPath:string,
			callback:(success:boolean) => void):void
		{
			if (this.fileParams.length > 1)
				this.opString += " -m";

			for (var i = 1; i < this.fileParams.length; ++i)
				this.fileParams[i] = this.escapeFilters(this.fileParams[i]);

			this.opString += " " + this.fileParams.join(" ");
			this.opString += " \"" + outputPath + "\"" + this.suffix;
			logDebug(this.opString);
			//# DEPRECATED: don't use childProcessLib.exec directly, use kr3m.util.ChildProcess instead
			childProcessLib.exec(this.opString, (error:Error, stdout:NodeBuffer, stderr:NodeBuffer) =>
			{
				this.reset();
				if (error)
				{
//# DEBUG
					logError("sox failed:");
					logError(this.opString);
					logError(error);
//# /DEBUG
					return callback(false);
				}
				callback(true);
			});
		}
	}
}
//# /EXPERIMENTAL
