/// <reference path="../images/spritesheetanimation.ts"/>
/// <reference path="../pseudocanvas/sprite.ts"/>
/// <reference path="../util/map.ts"/>



module kr3m.pseudocanvas
{
	export class MovieClip extends kr3m.pseudocanvas.Sprite
	{
		private animations = new kr3m.util.Map<kr3m.images.SpriteSheetAnimation>();
		private currentAnimation:kr3m.images.SpriteSheetAnimation = null;
		private pendingCalls = new kr3m.util.Map<Array<() => void>>();



		constructor(parent, width:number = 100, height:number = 100)
		{
			super(parent, width, height);
		}



		private callDelayed(animName:string, func:() => void):void
		{
			if (this.animations.contains(animName))
			{
				func();
			}
			else
			{
				if (!this.pendingCalls.contains(animName))
					this.pendingCalls.set(animName, []);

				this.pendingCalls.get(animName).push(func);
			}
		}



		public addAnimation(
			animName:string,
			spriteSheetUri:string,
			fps:number = 0):void
		{
			var anim = new kr3m.images.SpriteSheetAnimation(animName, spriteSheetUri, () =>
			{
				if (fps > 0)
					anim.setFps(fps);
				this.animations.set(animName, anim);
				var pending = this.pendingCalls.get(animName);
				if (pending)
				{
					for (var i = 0; i < pending.length; ++i)
						pending[i]();
					this.pendingCalls.unset(animName);
				}
			});
		}



		public addAnimationEventListener(
			animName, listener:(event:string) => void):void
		{
			this.callDelayed(animName, () =>
			{
				this.animations.get(animName).addEventListener(listener);
			});
		}



		public removeAnimationEventListener(
			animName, listener:(event:string) => void):void
		{
			this.callDelayed(animName, () =>
			{
				this.animations.get(animName).removeEventListener(listener);
			});
		}



		public playAnimation(animName:string):void
		{
			this.callDelayed(animName, () =>
			{
				this.currentAnimation = this.animations.get(animName);
				this.currentAnimation.play();
			});
		}



		public onEnterFrame(passedTime:number):void
		{
			if (this.currentAnimation)
				this.currentAnimation.accumulateTime(passedTime);
		}



		public updateStyles():void
		{
			super.updateStyles();
			if (this.currentAnimation)
				this.dom.css(this.currentAnimation.getCss());
		}
	}
}
