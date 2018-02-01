/// <reference path="../utils/timer.ts"/>



module gf.display
{
	export class Particles extends gf.display.Container
	{
		protected _data:any;
		protected _duration:any;
		protected _elapsed:number;
		protected _emitterX:number;
		protected _emitterY:number;
		protected _emitter: PIXI.particles.Emitter;
		protected _now:number;
		protected _textures: PIXI.Texture[];
		protected _timer: gf.utils.Timer;

		public onComplete: (particles:gf.display.Particles) => void;



		constructor(game: gf.core.Game)
		{
			super(game);

			this._emitterX = 0;
			this._emitterY = 0;

			this._textures = [];

			this._timer = new gf.utils.Timer(this.game);
		}



		public addData(value:any):void
		{
			this._data = value;
		}



		public addTexture(key:string | PIXI.Texture, frameName:string = null):void
		{
			if (key instanceof PIXI.Texture)
			{
				this._textures.push(key);
			}
			else if (!frameName)
			{
				this._textures.push(PIXI.utils.TextureCache[<string>key]);
			}
			else
			{
				let frameData: gf.utils.FrameData = this.game.cache.getFrameData(<string>key);
				let frame: gf.utils.Frame = frameData.getFrameByName(frameName);
				let texture: PIXI.Texture = new PIXI.Texture(PIXI.utils.TextureCache[<string>key], frame.frame, frame.orig, frame.trim, frame.rotated ? 2 : 0);
				this._textures.push(texture);
			}
		}



		public addEmitter():void
		{
			if (this._textures.length == 0)
			{
					logWarning("Error gf.display.Particles.addEmitter(): no texture(s) added!");
				return;
			}

			if (!this._data)
			{
					logWarning("Error gf.display.Particles.addEmitter(): no data added!");
				return;
			}

			this._emitter = new PIXI.particles.Emitter(this, this._textures, this._data);

			this._duration = 0;
			this._elapsed = Date.now();

			this.game.ticker.add(this.update, this);

			this._emitter.emit = true;
		}



		public addAnimatedEmitter(framerate:number):void
		{
			if (this._textures.length == 0)
			{
					logWarning("Error gf.display.Particles.addEmitter(): no texture(s) added!");
				return;
			}

			if (!this._data)
			{
					logWarning("Error gf.display.Particles.addEmitter(): no data added!");
				return;
			}

			this._emitter = new PIXI.particles.Emitter(this,
				{
					framerate: framerate,
					loop: true,
					textures: this._textures
				}
				, this._data);

			this._emitter.particleConstructor = PIXI.particles.AnimatedParticle;

			this._elapsed = Date.now();

			this.game.ticker.add(this.update, this);

			this._emitter.emit = true;
		}



		protected update():void
		{
			this._now = Date.now();
			let delta:number = (this._now - this._elapsed) * 0.001;
			this._emitter.update(delta);
			this._elapsed = this._now;

			this._duration += delta;

			if (this._duration >= this._emitter.emitterLifetime + this._emitter.maxLifetime)
			{
				this.game.ticker.remove(this.update, this);
				if (this.onComplete) this.onComplete(this);
			}
		}



		protected updatePosition():void
		{
			this._emitter.resetPositionTracking();
			this._emitter.updateOwnerPos(this._emitterX, this._emitterY);
		}



		public get emitterX():number
		{
			return this._emitterX;
		}



		public set emitterX(value:number)
		{
			this._emitterX = value;
			this.updatePosition();
		}



		public get emitterY():number
		{
			return this._emitterY;
		}



		public set emitterY(value:number)
		{
			this._emitterY = value;
			this.updatePosition();
		}



		public get emitter(): PIXI.particles.Emitter
		{
			return this._emitter;
		}
	}
}
