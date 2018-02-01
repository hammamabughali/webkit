/// <reference path="../display/idisplay.ts"/>
/// <reference path="../utils/align.ts"/>
/// <reference path="../utils/aligndata.ts"/>
/// <reference path="../utils/angle.ts"/>
/// <reference path="../utils/scale.ts"/>



module gf.display
{
	export class AnimatedSprite extends PIXI.extras.AnimatedSprite implements gf.display.IDisplay
	{
		public static readonly COMPLETE: string = "animationComplete";
		public static readonly ENTER_FRAME: string = "animationEnterFrame";
		public static readonly REPEAT: string = "animationRepeat";

		protected _endFrame: number;
		protected _frameData: gf.utils.FrameData;
		protected _frames: gf.utils.Frame[];
		protected _frameNames: string[];
		protected _key: string | PIXI.Texture;
		protected _lastFrame: number;
		protected _startFrame: number;

		public alignData: gf.utils.AlignData;
		public game: gf.core.Game;
		public userData: any;



		/*
			A AnimatedSprite is a simple way to display an animation depicted by a list of textures.
			default loop value is true
				@extends PIXI.extras.AnimatedSprite
			@param {gf.core.Game} game - A reference to the currently running game.
			@param {string} key - This is the image or texture used by the AnimatedSprite during rendering. It is a string which is a reference to the Cache entry.
			@param {string[]} frameNames - This is the image or texture used by the AnimatedSprite during rendering. It is a string which is a reference to the Cache entry.
		*/
		constructor(game: gf.core.Game, key?: string | PIXI.Texture, frameNames?: string[])
		{
			super([game.cache.getTexture("__default")]);

			this.game = game;
			this.name = "";
			this.alignData = new gf.utils.AlignData();

			this.userData = {};

			if (key)
				this.updateTextures(key, frameNames);
		}



		protected update(deltaTime: number): void
		{
			this._currentTime += this.animationSpeed * deltaTime;

			let floor: number = Math.floor(this._currentTime);
			let numFrames: number = this.endFrame - this.startFrame + 1;
			if (floor < this.startFrame)
			{
				if (this.loop)
				{
					this.updateTexture();
				}
				else
				{
					this.gotoAndStop(this.startFrame);
					this.emit(gf.display.AnimatedSprite.COMPLETE);
				}
			}
			else if (this.loop || floor < numFrames)
			{
				this.updateTexture();
			}
			else if (floor >= numFrames)
			{
				this.gotoAndStop(this.endFrame);
				this.emit(gf.display.AnimatedSprite.COMPLETE);
			}

			if (this._lastFrame != this.currentFrame)
			{
				this.emit(gf.display.AnimatedSprite.ENTER_FRAME);
				if (this.loop && this._lastFrame == this.endFrame && this.currentFrame == this.startFrame)
				{
					this.emit(gf.display.AnimatedSprite.REPEAT);
				}

				this._lastFrame = this.currentFrame;
				this.game.renderState = 2;
			}
		}



		public updateTextures(key: string | PIXI.Texture, frameNames?: string[]): void
		{
			this._lastFrame = 0;

			this._key = key;
			this._frameData = this.game.cache.getFrameData(<string>key);

			this._frameNames = frameNames;

			if (!this._frameNames)
			{
				this._frames = this._frameData.getFrames();
			}
			else
			{
				this._frames = [];
				frameNames.forEach((value: string) =>
				{
					this._frames.push(this._frameData.getFrameByName(value));
				});
			}

			let textures: PIXI.Texture[] = [];

			this._frames.forEach((frame: gf.utils.Frame) =>
			{
				textures.push(new PIXI.Texture(PIXI.utils.TextureCache[<string>this._key], frame.frame, frame.orig, frame.trim, frame.rotated ? 2 : 0));
			});

			this.textures = textures;
			this.updateTexture();

			this._startFrame = 0;
			this._endFrame = -1;
		}



		protected updateTexture(): void
		{
			this._texture = this._textures[this.currentFrame];
			this._textureID = -1;

			if (this.onFrameChange)
			{
				this.onFrameChange(this.currentFrame);
			}
		}



		public nextFrame(): number
		{
			if (this.currentFrame == this.totalFrames) return;

			this.gotoAndStop(this.currentFrame + 1);

			return this.currentFrame;
		}



		public prevFrame(): number
		{
			if (this.currentFrame == 0) return;

			this.gotoAndStop(this.currentFrame - 1);

			return this.currentFrame;
		}



		public hAlign(
			align: string,
			alignTo?: IDisplay | gf.core.Game | number,
			offset: number = 0): void
		{
			gf.utils.Align.hAlign(this, align, alignTo, offset);
		}



		public vAlign(
			align: string,
			alignTo?: IDisplay | gf.core.Game | number,
			offset: number = 0): void
		{
			gf.utils.Align.vAlign(this, align, alignTo, offset);
		}



		public onResize(): void
		{
			gf.utils.Align.onResize(this);
		}



		public on(events: string, fn: Function, context?: any): this
		{
			if (!events) return this;
			events.split(" ").forEach((e: string) => super.on(e, fn, context));
			return this;
		}



		public off(events: string, fn: Function, once?: boolean): this
		{
			if (!events) return this;
			events.split(" ").forEach((e: string) => super.off(e, fn, once));
			return this;
		}



		public once(events: string, fn: Function, context?: any): this
		{
			if (!events) return this;
			events.split(" ").forEach((e: string) => super.once(e, fn, context));
			return this;
		}



		public removeAllListeners(events: string): this
		{
			if (!events) return this;
			events.split(" ").forEach((e: PIXI.interaction.InteractionEventTypes) => super.removeAllListeners(e));
			return this;
		}



		public get angle(): number
		{
			return gf.utils.Angle.getAngle(this);
		}



		public set angle(value: number)
		{
			gf.utils.Angle.setAngle(this, value);
		}



		public get scaleX(): number
		{
			return gf.utils.Scale.getScaleX(this);
		}



		public set scaleX(value: number)
		{
			gf.utils.Scale.setScaleX(this, value);
		}



		public get scaleY(): number
		{
			return gf.utils.Scale.getScaleY(this);
		}



		public set scaleY(value: number)
		{
			gf.utils.Scale.setScaleY(this, value);
		}



		public set scaleXY(value: number)
		{
			gf.utils.Scale.setScaleXY(this, value);
		}



		public get left(): number
		{
			return gf.utils.Align.left(this);
		}



		public get right(): number
		{
			return gf.utils.Align.right(this);
		}



		public get top(): number
		{
			return gf.utils.Align.top(this);
		}



		public get bottom(): number
		{
			return gf.utils.Align.bottom(this);
		}



		public get startFrame(): number
		{
			return this._startFrame;
		}



		public set startFrame(value: number)
		{
			this._startFrame = Math.max(0, value);
			if (this.currentFrame < this._startFrame)
			{
				this._currentTime = this._startFrame;
			}
		}



		public get endFrame(): number
		{
			return (this._endFrame > -1) ? this._endFrame : this.totalFrames - 1;
		}



		public set endFrame(value: number)
		{
			this._endFrame = Math.min(this.totalFrames - 1, value);
			if (this._endFrame + 1 == this.totalFrames)
			{
				this._endFrame = -1;
			}

			if (this.currentFrame > this.endFrame)
			{
				this._currentTime = this._startFrame;
			}
		}
	}
}
