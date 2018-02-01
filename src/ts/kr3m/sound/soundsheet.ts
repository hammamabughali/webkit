/// <reference path="../loading/loader.ts"/>
/// <reference path="../sound/sound.ts"/>
/// <reference path="../util/map.ts"/>



//# EXPERIMENTAL
module kr3m.sound
{
	export class SoundSheet
	{
		private data:any = null;
		private sound:kr3m.sound.Sound = null;
		private namedSamples = new kr3m.util.Map<number>();



		constructor(soundSheetUri:string)
		{
			var loader = kr3m.loading.Loader.getInstance();
			loader.queue(soundSheetUri, (data:any) =>
			{
				this.data = data;
				this.sound = new kr3m.sound.Sound(data.sourceUris, data.channels);
				this.initNamedSamples();
			});
			loader.load();
		}



		private initNamedSamples():void
		{
			for (var i = 0; i < this.data.samples.length; ++i)
			{
				if (typeof this.data.samples[i].name != "undefined")
					this.namedSamples.set(this.data.samples[i].name, i);
			}
		}



		public play(sampleName:string):void
		{
			if (this.sound)
			{
				var id = this.namedSamples.get(sampleName);
				if (id !== null)
				{
					var sample = this.data.samples[id];
					this.sound.playPart(sample.offset, sample.duration);
				}
			}
		}
	}
}
//# /EXPERIMENTAL
