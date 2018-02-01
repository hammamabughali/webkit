/// <reference path="overlay.ts"/>



module cuboro.overlays
{
	export class Loader extends cuboro.overlays.Overlay
	{
		public static readonly NAME: string = "loader";

		protected animation: gf.display.Container;
		protected animationBg: gf.display.Sprite;
		protected animationContainer: gf.display.Container;
		protected data: any[];
		protected delayedCall: TweenMax;
		protected quads: gf.display.Sprite[];
		protected tf: gf.display.Text;
		protected timeoutId: number;
		protected tween: TweenMax;



		public init(): void
		{
			this.addNoClick();
			this.addDim();

			this.animationContainer = new gf.display.Container(this.game);
			this.animationContainer.hAlign(gf.CENTER);
			this.animationContainer.vAlign(gf.CENTER, this.game, -5);
			this.addChild(this.animationContainer);

			this.animationBg = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.animationBg.width = 100;
			this.animationBg.height = 130;
			this.animationContainer.addChild(this.animationBg);

			this.animation = new gf.display.Container(this.game);
			this.animation.x = 3;
			this.animation.y = 3;
			this.animationContainer.addChild(this.animation);

			this.tf = new gf.display.Text(this.game);
			this.tf.style = cuboro.TEXT_STYLE_SMALL.clone();
			this.tf.text = loc("please_wait");
			this.tf.hAlign(gf.CENTER, 100);
			this.tf.y = this.animationBg.height - this.tf.height - cuboro.PADDING;
			this.animationContainer.addChild(this.tf);

			this.quads = [];

			let quad = this.getQuad();

			let space1: number = quad.width + 2;
			let space2: number = quad.width * 2 + 4;

			this.data = [
				{x: 0, y: 0},
				{x: space1, y: 0},
				{x: space2, y: 0},
				{x: space2, y: space1},
				{x: space2, y: space2},
				{x: space1, y: space2},
				{x: 0, y: space2},
				{x: 0, y: space1},
			];

			for (let i: number = 0; i < 7; ++i)
			{
				quad = this.getQuad();
				quad.x = this.data[i].x;
				quad.y = this.data[i].y;
				this.animation.addChild(quad);
				this.quads.push(quad);
			}

			quad = this.getQuad();
			quad.x = space1;
			quad.y = space1;
			this.animation.addChild(quad);
		}



		protected getQuad(): gf.display.Sprite
		{
			let quad = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			quad.tint = cuboro.COLOR_YELLOW;
			quad.width = 30;
			quad.height = 30;

			return quad;
		}



		protected timeout():void
		{
			const message: cuboro.overlays.Message = this.game.overlays.show(cuboro.overlays.Message.NAME);
			message.text = loc("error_offline");

			this.transitionOut();
		}



		public animateQuad(currentIndex: number): void
		{
			const quad = this.quads[currentIndex];
			const nextIndex: number = ((currentIndex - 1) < 0) ? this.quads.length - 1 : currentIndex - 1;
			const nextPosition: PIXI.Point = this.getNextPosition(quad.x, quad.y);

			this.tween = TweenMax.to(quad, 0.25,
			{
				x: nextPosition.x, y: nextPosition.y
			});
			this.delayedCall = TweenMax.delayedCall(0.1, () =>
			{
				this.animateQuad(nextIndex);
			});
		}



		public getNextPosition(x: number, y: number): PIXI.Point
		{
			let result: PIXI.Point = null;
			this.data.forEach((value: any, index: number) =>
			{
				if (value.x == x && value.y == y)
				{
					if (index + 1 > this.data.length - 1)
					{
						result = new PIXI.Point(this.data[0].x, this.data[0].y);
					}
					else
					{
						result = new PIXI.Point(this.data[index + 1].x, this.data[index + 1].y);
					}
					return true;
				}
			});

			return result;
		}


		public transitionIn(): void
		{
			super.transitionIn();

			if (!this.tween && !this.delayedCall)
			{
				this.animateQuad(6);
			}
			else
			{
				this.tween.resume();
				this.delayedCall.resume();
			}

			window.clearTimeout(this.timeoutId);
			this.timeoutId = window.setTimeout(() => this.timeout(), 15000);
		}



		public transitionOut():void
		{
			super.transitionOut();

			window.clearTimeout(this.timeoutId);
		}



		public transitionOutComplete(): void
		{
			super.transitionOutComplete();

			this.tween.pause();
			this.delayedCall.pause();
		}
	}
}
