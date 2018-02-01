/// <reference path="../../cuboro/ui/closebutton.ts"/>
/// <reference path="../../cuboro/ui/iconbutton.ts"/>
/// <reference path="../../gf/display/sprite.ts"/>
/// <reference path="../../gf/display/text.ts"/>
/// <reference path="../../gf/ui/button.ts"/>



module cuboro.ui
{
	export class Hint extends gf.display.Container
	{
		public bg: gf.display.Sprite;
		public border: gf.display.Sprite;
		public btClose: cuboro.ui.CloseButton;
		public queue: { title:string, message:string }[];
		public tfMessage: gf.display.Text;
		public tfTitle: gf.display.Text;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.border = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.border.tint = cuboro.COLOR_GREY;
			this.border.x = -1;
			this.border.y = -1;
			this.border.width = 402;
			this.border.height = 52;
			this.addChild(this.border);

			this.bg = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.bg.width = 400;
			this.bg.height = 50;
			this.addChild(this.bg);

			this.queue = [];

			this.addCloseButton();
			this.addTextFields();

			this.visible = false;
		}



		protected addTextFields():void
		{
			this.tfTitle = new gf.display.Text(this.game, "", cuboro.TEXT_STYLE_TITLE_TAB.clone());
			this.tfTitle.style.wordWrap = true;
			this.tfTitle.style.wordWrapWidth = this.btClose.x - cuboro.PADDING * 2;

			this.tfTitle.x = cuboro.PADDING;
			this.tfTitle.y = cuboro.PADDING * 2;

			this.addChild(this.tfTitle);

			this.tfMessage = new gf.display.Text(this.game, "", cuboro.TEXT_STYLE_SMALL.clone());
			this.tfMessage.style.wordWrap = true;
			this.tfMessage.style.wordWrapWidth = this.btClose.x - cuboro.PADDING * 2;

			this.tfMessage.x = cuboro.PADDING;
			this.tfMessage.y = this.tfTitle.bottom + cuboro.PADDING;

			this.addChild(this.tfMessage);
		}



		protected addCloseButton():void
		{
			this.btClose = new cuboro.ui.CloseButton(this.game);
			this.btClose.on(gf.CLICK, this.hide, this);
			this.btClose.x = this.bg.right - this.btClose.width - cuboro.PADDING * 2;
			this.btClose.y = cuboro.PADDING * 2 + 2;

			this.addChild(this.btClose);
		}



		public show(title:string, message:string):void
		{
			if (this.visible)
			{
				this.queue.push({title: title, message: message});
			}
			else
			{
				this.tfTitle.text = title;

				this.tfMessage.text = message;
				this.tfMessage.y = this.tfTitle.bottom + cuboro.PADDING;

				this.bg.height = this.tfMessage.bottom + cuboro.PADDING * 4;
				this.border.height = this.bg.height + 2;

				this.x = (this.game.width - this.bg.width) >> 1;
				this.y = this.game.height;

				TweenMax.to(this, 0.25, {y: this.game.height - this.bg.height + cuboro.PADDING * 2, ease: Back.easeOut});
				this.visible = true;
			}
		}



		public hide():void
		{
			TweenMax.to(this, 0.25,
			{
				y: this.game.height, ease: Back.easeIn, onComplete: () =>
				{
					this.visible = false;
					if (this.queue.length > 0)
					{
						let item: { title:string, message:string } = this.queue.shift();
						this.show(item.title, item.message);
					}
				}
			});
		}



		public onResize():void
		{
			super.onResize();

			this.x = (this.game.width - this.bg.width) >> 1;
			this.y = this.game.height - this.bg.height + cuboro.PADDING * 2;
		}
	}
}
