/// <reference path="../ui/element.ts"/>
/// <reference path="../util/browser.ts"/>



module kr3m.sound
{
	/*
		Allgemeine Klasse zum Abspielen von Sounds. Wird intern von allen
		komplexeren Klassen (z.B. SoundSheet) verwendet.

		Einfach an beliebiger Stelle ein neues Soundobjekt anlegen und dann
		mit Play abspielen.
	*/
	export class Sound
	{
		private static freeId = 0;

		private channels:any[] = [];
		private idleChannelIds:number[] = [];
//# EXPERIMENTAL
		private abortTimes:number[] = [];
//# /EXPERIMENTAL
		private loop:boolean = false;



		/*
			soundUris ist ein Array, dem Urls verschiedener Sounddateien
			übergeben werden müssen. Der Browser sucht sich dann eine der
			Dateien aus, die er abspielen kann. Die verschiedenen URLs sind
			also praktisch der gleiche Sound in unterschiedlichen
			Dateiformaten.

			Mit channels kann angegeben werden, wir oft der Sound
			gleichzeitig abgespielt werden können soll. In der
			Standardeinstellung von 1 kann der Sound nicht abgespielt werden,
			während er gerade läuft. Für Sounds, die überlappend mehrfach
			abgespielt werden sollen, einfach channels erhöhen. Eine höhere
			Zahl senkt aber gleichzeitig auch die Performance, deswegen nicht
			übertreiben.

			Mit parent kann ein optionales kr3m.ui.Element angegeben werden,
			an welches der Sound (und sein DOM-Objekt) angehängt werden soll.
			Wird null als parent übergeben, wird der Sound direkt an das
			body-DOM-Objekt angehängt. Der parent-Wert wird hauptsächlich dafür
			verwendet, dass Browser-Resourcen freigegeben werden, wenn das
			parent-Objekt gelöscht werden sollte und der Sound nicht mehr
			gebraucht wird.
		*/
		public constructor(
			soundUris:string[],
			channels:number = 1,
			parent:kr3m.ui.Element = null)
		{
			if (!this.isAvailable())
				return;

			var parentDom = parent ? parent.dom : $(window.document.body);
			for (var j = 0; j < channels; ++j)
			{
				var id = "audio_" + (kr3m.sound.Sound.freeId++);
				var html = "<audio preload='auto' id='" + id + "'>";
				for (var i = 0; i < soundUris.length; ++i)
					html += "<source src='" + soundUris[i] + "'/>";
				html += "</audio>";
				parentDom.append(html);

				var channel = document.getElementById(id);
				if (!channel)
					return;

				channel.addEventListener("ended", this.onEnded.bind(this, j));
				channel.addEventListener("pause", this.onEnded.bind(this, j));
//# EXPERIMENTAL
				channel.addEventListener("timeupdate", this.onUpdate.bind(this, j), false);
				this.abortTimes.push(0);
//# /EXPERIMENTAL
				this.channels.push(channel);
				this.idleChannelIds.push(j);
			}
		}



		private isAvailable():boolean
		{
			return kr3m.util.Browser.getAvailableAudioSupport() == kr3m.sound.AudioSupport.AUDIO_TAG;
		}



		/*
			Soll der Sound nach dem Ende wieder von vorne
			abgespielt werden (loop = true) oder nicht
			(loop = false).
		*/
		public setLoop(loop:boolean):void
		{
			this.loop = loop;
		}


		public isLooped():boolean
		{
			return this.loop;
		}



		/*
			Setzt alle Wiedergabekanäle auf stumm (muted = true)
			oder auf laut (muted = false).
		*/
		public setMuted(muted:boolean):void
		{
			if (!this.isAvailable())
				return;

			for (var i = 0; i < this.channels.length; ++i)
				this.channels[i].muted = muted;
		}



		/*
			Setzt die Lautstärke aller Wiedergabekanäle auf volume,
			einen Wert zwischen 0 und 1.
		*/
		public setVolume(volume:number):void
		{
			if (!this.isAvailable())
				return;

			if (volume < 0)
				volume = 0;
			else if (volume > 1)
				volume = 1;

			for (var i = 0; i < this.channels.length; ++i)
				this.channels[i].volume = volume;
		}



		private onEnded(channelId:number):void
		{
			if (this.loop)
			{
				this.channels[channelId].play();
			}
			else
			{
				if (!kr3m.util.Util.contains(this.channels, channelId))
					this.idleChannelIds.push(channelId);
			}
		}



//# EXPERIMENTAL
		private onUpdate(channelId:number):void
		{
			var channel = this.channels[channelId];
			if (this.abortTimes[channelId] > 0 && channel.currentTime >= this.abortTimes[channelId])
			{
				this.abortTimes[channelId] = 0;
				//# FIXME: pause() funktioniert nicht zuverlässig
				channel.pause();
				this.onEnded(channelId);
			}
		}
//# /EXPERIMENTAL



		private getFreeChannelId():number
		{
			if (this.channels.length > 0)
			{
				if (this.idleChannelIds.length > 0)
				{
					var id = this.idleChannelIds.shift();
					return id;
				}
			}
			return -1;
		}



		private getFreeChannel():any
		{
			var id = this.getFreeChannelId();
			if (id >= 0)
				return this.channels[id];
			return null;
		}



		/*
			Spielt den Sound in einem seiner freien Channels ab.
		*/
		public play():void
		{
			if (!this.isAvailable())
				return;

			var channel = this.getFreeChannel();
			if (channel)
				channel.play();
		}



//# EXPERIMENTAL
		/*
			Spielt einen Teil des Sounds, beginnend bei offset
			(in Sekunden) mit einer Länge von duration (in Sekunden),
			in einem seiner freien Channels ab.
		*/
		public playPart(offset:number, duration:number):void
		{
			if (!this.isAvailable())
				return;

			var id = this.getFreeChannelId();
			if (id >= 0)
			{
				var channel = this.channels[id];
				channel.currentTime = offset;
				this.abortTimes[id] = offset + duration;
				channel.play();
			}
		}
//# /EXPERIMENTAL
	}
}
