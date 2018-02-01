module gf.core
{
	export class Sounds
	{
		protected _fxMuted:boolean;
		protected _fxWasMuted:boolean;
		protected _musicMuted:boolean;
		protected _musicWasMuted:boolean;
		protected _soundsReloaded:number;
		protected _soundsPlaying: {key:string, frame:string, soundId:number}[];

		public forceFxPlay:boolean;
		public game: gf.core.Game;
		public fx: {key:string, sound: Howl}[];
		public music: {key:string, sound: Howl}[];



		constructor(game: gf.core.Game)
		{
			this.game = game;
			this.forceFxPlay = false;

			this.game.on(gf.BLUR, this.onBlur, this);
			this.game.on(gf.FOCUS, this.onFocus, this);
			this.game.storage.on(gf.DATA, this.onStorage, this);

			this.fx = [];
			this.music = [];

			this._soundsPlaying = [];
		}



		protected onStorage():void
		{
			if (typeof this._fxMuted == "undefined") this._fxMuted = false;

			if (typeof this.game.storage.getItem("fxMuted") == "undefined")
				this.muteFx(this.game.client.config.muteMusicDefault ? true : this._fxMuted);
			else
				this.muteFx(!!this.game.storage.getItem("fxMuted"));

			if (typeof this._musicMuted == "undefined") this._musicMuted = false;

			if (typeof this.game.storage.getItem("musicMuted") == "undefined")
				this.muteMusic(this.game.client.config.muteFxDefault ? true : this._musicMuted);
			else
				this.muteMusic(!!this.game.storage.getItem("musicMuted"));
		}



		protected muteSounds(value:boolean, a: {key:string, sound: Howl}[]):void
		{
			for (let i = 0; i < a.length; ++i)
				a[i].sound.mute(value);
		}



		protected stopSound(key:string, a: {key:string, sound: Howl}[], frame:string = ""):void
		{
			for (let i:number = 0; i < this._soundsPlaying.length; ++i)
			{
				if (this._soundsPlaying[i].key == key && this._soundsPlaying[i].frame == frame)
				{
					gf.core.Sounds.getSound(key, a).stop(this._soundsPlaying[i].soundId);
					this._soundsPlaying.splice(i, 1);
					break;
				}
			}
		}



		public static getSound(key:string, a: {key:string, sound: Howl}[]): Howl
		{
			let sound: Howl;

			for (let i:number = 0; i < a.length; ++i)
			{
				if (a[i].key == key)
				{
					sound = a[i].sound;
					break;
				}
			}

			return sound;
		}



		public static soundAdded(key:string, a: {key:string, sound: Howl}[]):boolean
		{
			let isAdded:boolean = false;

			for (let i:number = 0; i < a.length; ++i)
			{
				if (a[i].key == key)
				{
					isAdded = true;
					break;
				}
			}

			return isAdded;
		}



		public onBlur():void
		{
			this._fxWasMuted = this._fxMuted;
			this._musicWasMuted = this._musicMuted;

			this._fxMuted = true;
			this.muteSounds(true, this.fx);

			this._musicMuted = true;
			this.muteSounds(true, this.music);
		}



		public onFocus():void
		{
			this._fxMuted = this._fxWasMuted;
			this.muteSounds(this._fxWasMuted, this.fx);

			this._musicMuted = this._musicWasMuted;
			this.muteSounds(this._musicWasMuted, this.music);
		}



		/*
			Play an effect sound
				@param key   Key of the effect
			@param frame Frame name of the effect if it's an audiosprite
			@param loop  Wether to loop the effect or not. Default: false
			@param volume    Volume of the sound from 0 to 1. Default: 1
			@returns {Howl}
		*/
		public playFx(key:string, frame:string = "", loop:boolean = false, volume:number = 1): Howl
		{
			let sound: Howl = this.getFx(key, loop, volume);

			if (!sound || (this._fxMuted && !this.forceFxPlay)) return null;

			sound.on("play", (soundId:number) =>
			{
				this._soundsPlaying.push({key: key, frame: frame, soundId: soundId});
				if (this._fxMuted) gf.core.Sounds.getSound(key, this.fx).mute(true, soundId);
			});

			if (frame.length > 0)
				sound.stop().play(frame);
			else
				sound.stop().play();

			return sound;
		}



		/*
			Stop an effect sound
				@param key   Key of the effect
			@param frame Frame name of the effect if it's an audiosprite
		*/
		public stopFx(key:string, frame:string = ""):void
		{
			this.stopSound(key, this.fx, frame);
		}



		/*
			Stop all effect sounds
		*/
		public stopAllFx():void
		{
			for (let i:number = 0; i < this.fx.length; ++i)
			{
				for (let j:number = 0; j < this._soundsPlaying.length; ++j)
				{
					if (this._soundsPlaying[j].key == this.fx[i].key)
					{
						this.stopFx(this._soundsPlaying[j].key, this._soundsPlaying[j].frame);
					}
				}
			}
		}



		/*
			Play a music sound
				@param key Key of the sound
			@param frame Frame if it's a sheet
			@param loop true if should looping
			@param volume Volume of the sound from 0 to 1
			@returns {Howl}
		*/
		public playMusic(
			key:string,
			frame:string = "",
			loop:boolean = false,
			volume:number = 1): Howl
		{
			let sound: Howl = this.getMusic(key, loop, volume);

			if (!sound) return null;

			sound.on("play", (soundId:number) =>
			{
				this._soundsPlaying.push({key: key, frame: frame, soundId: soundId});
				if (this._musicMuted) gf.core.Sounds.getSound(key, this.music).mute(true, soundId);
			});

			if (frame.length > 0) sound.stop().play(frame);
			else sound.stop().play();

			sound.loop(loop);
			sound.volume(volume);

			return sound;
		}



		/*
			Stop a music sound
				@param key   Key of the sound
		*/
		public stopMusic(key:string):void
		{
			this.stopSound(key, this.music);
		}



		/*
			Mute/unmute all effect sounds
				@param value Wether to mute (true) or unmute (false)
			@param storage Wether to save value to storage (true) or not (false)
		*/
		public muteFx(value:boolean, storage:boolean = true):void
		{
			this._fxMuted = value;
			this.muteSounds(value, this.fx);
			if (storage) this.game.storage.setItem("fxMuted", value);
		}


		/*
			Mute/unmute all music sounds
				@param value Wether to mute (true) or unmute (false)
			@param storage Wether to save value to storage (true) or not (false)
		*/
		public muteMusic(value:boolean, storage:boolean = true):void
		{
			this._musicMuted = value;
			this.muteSounds(value, this.music);
			if (storage) this.game.storage.setItem("musicMuted", value);
		}



		/*
			Add a sound (music or effect) to the correct hashmap and decode it.
			This is primarily an internal method used by a loader, although you may call it directly.
				@param key   Key of the sound
			@param soundType Sound type (gf.SOUND_FX or gf.SOUND_MUSIC)
			@param callback  Callback function to call after decoding
			@returns {Howl}
		*/
		public addSound(key:string, soundType:string, callback: () => void): Howl
		{
			let a: {key:string, sound: Howl}[] = (soundType == gf.SOUND_FX) ? this.fx : this.music;

			if (gf.core.Sounds.soundAdded(key, a))
			{
				if (callback) callback();
				return;
			}

			let sound: Howl;
			let json:any = this.game.cache.getSound(key).json;
			let properties: IHowlProperties =
			{
				src: [this.game.cache.getSound(key).url], onload: () =>
				{
					if (callback) callback();
				},
				onloaderror: (soundId:number, error:any) =>
				{
					logWarning("Error loading sound (ID: " + soundId + ", key: " + key + ", url: " + this.game.cache.getSound(key).url + ". " + error);
					if (callback) callback();
				}
			};

			if (json)
			{
				properties.sprite = json.sprite;
			}

			sound = new Howl(properties);

			a.push({key: key, sound: sound});

			return sound;
		}



		public reload(callback?: () => void):void
		{
			this._soundsReloaded = 0;
			let fxKeys:string[] = [];

			this.fx.forEach((value: {key:string, sound: Howl}) =>
			{
				fxKeys.push(value.key);
			});
			this.fx = [];

			fxKeys.forEach((value:string) =>
			{
				this._soundsReloaded++;
				this.addSound(value, "fx", () =>
				{
					this.soundReloaded(callback);
				});
			});

			let musicKeys:string[] = [];

			this.music.forEach((value: {key:string, sound: Howl}) =>
			{
				musicKeys.push(value.key);
			});
			this.music = [];

			musicKeys.forEach((value:string) =>
			{
				this._soundsReloaded++;
				this.addSound(value, "music", () =>
				{
					this.soundReloaded(callback);
				});
			});
		}



		protected soundReloaded(callback: () => void):void
		{
			this._soundsReloaded--;
			if (this._soundsReloaded == 0 && callback) callback();
		}



		public getFx(key:string, loop:boolean = false, volume:number = 1): Howl
		{
			let sound: Howl = gf.core.Sounds.getSound(key, this.fx);
			if (!sound) return null;
			sound.loop(loop);
			sound.volume(volume);
			return sound;
		}



		public getMusic(key:string, loop:boolean = false, volume:number = 1): Howl
		{
			let sound: Howl = gf.core.Sounds.getSound(key, this.music);
			if (!sound) return null;
			sound.loop(loop);
			sound.volume(volume);
			return sound;
		}



		public get isFxMuted():boolean
		{
			return this._fxMuted;
		}



		public get isMusicMuted():boolean
		{
			return this._musicMuted;
		}
	}
}
