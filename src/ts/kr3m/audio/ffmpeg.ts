/// <reference path="../async/criticalsection.ts"/>
/// <reference path="../async/loop.ts"/>
/// <reference path="../lib/childprocess.ts"/>
/// <reference path="../lib/node.ts"/>
/// <reference path="../util/stringex.ts"/>



module kr3m.audio
{
	/*
		Wrapper für die audiorelevanten Funktionalitäten von ffmpeg.
		Video wird von dieser Klasse nicht unterstützt (kommt bei Bedarf
		in einer separaten Klasse).

		ffmpeg-Documentation:
			https://www.ffmpeg.org/ffmpeg.html
			https://www.ffmpeg.org/ffmpeg-filters.html
	*/
	export class FfMpeg
	{
		public static toolPath = "ffmpeg";
		public static chainLengthScriptThreshold = 200;

		private static cs = new kr3m.async.CriticalSection(3);

		private toolPath:string;
		private inputs:string[];
		private channels:string[];
		private filters:string[];



		public static setParallelCount(count:number):void
		{
			FfMpeg.cs.setConcurrentLimit(count);
		}



		constructor(toolPath?:string)
		{
			this.toolPath = toolPath || kr3m.audio.FfMpeg.toolPath;
			this.reset();
		}



		private reset():void
		{
			this.inputs = [];
			this.channels = [];
			this.filters = [];
		}



		public addFile(filePath:string):FfMpeg
		{
			this.inputs.push("-i \"" + filePath + "\"");
			this.channels.push(this.channels.length.toString());
			return this;
		}



		public addSilence(duration:number):FfMpeg
		{
			this.inputs.push("-f lavfi -t " + duration + " -i anullsrc");
			this.channels.push(this.channels.length.toString());
			return this;
		}



		private getChannel():string
		{
			return this.channels[this.channels.length - 1];
		}



		private updateChannel(id:string):void
		{
			this.channels[this.channels.length - 1] = id;
		}



		private addFilter(
			filter:string,
			params?:any,
			inputChannels?:string[]):void
		{
			if (inputChannels)
				filter = "[" + inputChannels.join("][") + "] " + filter;
			else
				filter = "[" + this.getChannel() + "] " + filter;

			params = params ? "=" + kr3m.util.StringEx.joinAssoc(params, ":", "=") : "";
			var filterId = "f" + this.filters.length;
			filter += params + " [" + filterId + "]";
			this.filters.push(filter);
			this.updateChannel(filterId);
		}



		private chainFilter(filter:string, params?:any):void
		{
			params = params ? "=" + kr3m.util.StringEx.joinAssoc(params, ":", "=") : "";
			filter += params;
			var l = this.filters.length - 1;
			this.filters[l] = this.filters[l].replace(/\s*(\[\S*)$/, "," + filter + " $1");
		}



		public fadeIn(duration:number):FfMpeg
		{
			this.addFilter("afade", {t : "in", st : 0, d : duration});
			return this;
		}



		public fadeOut(duration:number):FfMpeg
		{
			//# TODO: NYI fadeOut
			throw new Error("NYI");
		}



		public fadeOutAt(startTime:number, duration:number):FfMpeg
		{
			this.addFilter("afade", {t : "out", st : startTime, d : duration});
			return this;
		}



		public normalize():FfMpeg
		{
			this.addFilter("aformat", {sample_fmts : "fltp", sample_rates : 44100, channel_layouts : "stereo"});
			return this;
		}



		public volume(factor:number):FfMpeg
		{
			this.addFilter("volume", {volume : factor});
			return this;
		}



		public pad():FfMpeg
		{
			this.addFilter("apad");
			return this;
		}



		public padTo(length:number):FfMpeg
		{
			this.addFilter("apad", {whole_len : length * 4096});
			return this;
		}



		public delay(duration:number):FfMpeg
		{
			duration = Math.round(duration * 1000);
			this.addFilter("adelay=" + duration + "|" + duration);
			return this;
		}



		public slice(offset:number, length:number):FfMpeg
		{
			this.addFilter("atrim", {start : offset, duration : length});
			return this;
		}



		private channelsToInputs(channels?:number[]):string[]
		{
			if (!channels)
			{
				channels = [];
				for (var i = 0; i < this.channels.length; ++i)
					channels.push(i);
			}
			var l = this.channels.length;
			var inputs = channels.map((i:number) => this.channels[(i + l) % l]);
			return inputs;
		}



		public mix(channels?:number[]):FfMpeg
		{
			var inputs = this.channelsToInputs(channels);
			if (inputs.length < 2)
				return this;

			this.addFilter("amix", {inputs : inputs.length, dropout_transition : 999999999}, inputs);
			this.chainFilter("volume", {volume : 2});
			return this;
		}



		public concat(channels?:number[]):FfMpeg
		{
			var inputs = this.channelsToInputs(channels);
			if (inputs.length < 2)
				return this;

			// der concat-Filter kann nur zwei inputs auf einmal verbinden
			var params = {v : 0, a : 1};
			this.addFilter("concat", params, inputs.slice(0, 2));
			for (var i = 2; i < inputs.length; ++i)
				this.addFilter("concat", params, [this.getChannel(), inputs[i]]);
			return this;
		}



		public loop(count:number):FfMpeg
		{
			var channelId = this.channels.length - 1;
			var channels:number[] = [];
			for (var i = 0; i < count; ++i)
				channels.push(channelId);
			return this.concat(channels);
		}



		private buildOp(
			outputPath:string,
			callback:(op:string, tempFilePath:string) => void):void
		{
			var op = this.toolPath + " -y";
			if (this.inputs.length > 0)
				op += " " + this.inputs.join(" ");

			var tempFilePath = "";
			if (this.filters.length > 0)
			{
				if (this.channels.length < 2 && this.filters.length < 2)
				{
					this.filters = this.filters.map((filter:string) => filter.replace(/\s*\[\w+\]\s*/g, ""));
					var chain = this.filters.join(" ");
				}
				else
				{
					var l = this.filters.length - 1;
					this.filters[l] = this.filters[l].replace(/\s*\[\S*$/, "");
					var chain = this.filters.join(";");
				}

				op += " -filter_complex \"" + chain + "\"";
			}

			op += " \"" + outputPath + "\"";
			callback(op, tempFilePath);
		}



		public flush(
			outputPath:string,
			callback:(success:boolean) => void):void
		{
			this.buildOp(outputPath, (op:string, tempFilePath:string) =>
			{
				FfMpeg.cs.enter((exit:() => void) =>
				{
					//# DEPRECATED: don't use childProcessLib.exec directly, use kr3m.util.ChildProcess instead
					childProcessLib.exec(op, {maxBuffer : 10 * 1024 * 1024}, (error:Error, stdout:NodeBuffer, stderr:NodeBuffer) =>
					{
						this.reset();
						exit();

						if (tempFilePath)
							fsLib.unlink(tempFilePath);

						if (error)
						{
							logError("ffmpeg failed:");
							logError(op);
							logError(error);
							return callback(false);
						}
						callback(true);
					});
				});
			});
		}



		private static exec(
			op:string,
			callback:(success:boolean) => void):void
		{
			FfMpeg.cs.enter((exit:() => void) =>
			{
				//# DEPRECATED: don't use childProcessLib.exec directly, use kr3m.util.ChildProcess instead
				childProcessLib.exec(op, (error:Error, stdout:NodeBuffer, stderr:NodeBuffer) =>
				{
					exit();
					if (error)
					{
						logError("ffmpeg failed:");
						logError(op);
						logError(error);
						return callback(false);
					}
					callback(true);
				});
			});
		}



		public static convert(
			from:string, to:string,
			callback:(success:boolean) => void):void
		{
			var op = FfMpeg.toolPath + " -y -i \"" + from + "\" -filter_complex aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo \"" + to + "\"";
			kr3m.audio.FfMpeg.exec(op, callback);
		}



		public static saveSilenceFile(
			path:string, duration:number,
			callback:(success:boolean) => void):void
		{
			var op = FfMpeg.toolPath + " -y -t " + duration + " -f lavfi -i anullsrc \"" + path + "\"";
			kr3m.audio.FfMpeg.exec(op, callback);
		}



		/*
			Gibt die Abspieldauer der angegebenen Datei in Sekunden zurück.
		*/
		public static getFileDuration(
			filePath:string,
			callback:(duration:number) => void):void
		{
			var op = FfMpeg.toolPath + " -i \"" + filePath + "\"";
			FfMpeg.cs.enter((exit:() => void) =>
			{
				//# DEPRECATED: don't use childProcessLib.exec directly, use kr3m.util.ChildProcess instead
				childProcessLib.exec(op, (error:Error, stdout:NodeBuffer, stderr:NodeBuffer) =>
				{
					exit();

					if (!stderr)
						return callback(0);

					var matches = stderr.toString().match(/Duration: (\d\d):(\d\d):(\d\d)\.(\d\d)/);
					if (!matches)
						return callback(0);

					var duration = parseInt(matches[1], 10) * 3600;
					duration += parseInt(matches[2], 10) * 60;
					duration += parseInt(matches[3], 10);
					duration += parseInt(matches[4], 10) * 0.01;
					callback(duration);
				});
			});
		}



		/*
			Sortiert die übergebenen Dateien files nach ihrer Länge.

			Das hier sollte vor mix-Aufrufen aufgerufen werden, da
			unterschiedliche ffmpeg-Versionen sich beim mixen an der
			Länge der ersten übergebenen Datei orientieren statt der
			Länge der längsten übergebenen Datei.
		*/
		public static sortFilesByDuration(
			files:string[], callback:(sortedFiles:string[]) => void):void
		{
			var workset:any[] = [];
			kr3m.async.Loop.forEach(files, (file:string, next:() => void) =>
			{
				FfMpeg.getFileDuration(file, (duration:number) =>
				{
					workset.push({name:file, duration:duration});
					next();
				});
			}, () =>
			{
				kr3m.util.Util.sortBy(workset, "duration", false);
				var sortedFiles = kr3m.util.Util.gather(workset, "name");
				callback(sortedFiles);
			});
		}
	}
}
