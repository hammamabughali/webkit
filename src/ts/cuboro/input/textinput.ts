/// <reference path="../../gf/display/sprite.ts"/>
/// <reference path="../../gf/display/text.ts"/>
/// <reference path="../../gf/input/domcontainer.ts"/>
/// <reference path="../../gf/input/textinput.ts"/>



module cuboro.input
{
	export class TextInput extends gf.input.TextInput
	{
		public bg: gf.display.Sprite;
		public border: gf.display.Sprite;
		public tfError: gf.display.Text;
		public tfTitle: gf.display.Text;
		public validation: (value: string) => boolean;



		constructor(game: gf.core.Game, parent: string | gf.input.DomContainer, name: string)
		{
			super(game, parent, name);

			this.fontFamily = cuboro.DEFAULT_FONT;
			this.fontSize = 13;

			this.tfTitle = new gf.display.Text(this.game);
			this.tfTitle.style = cuboro.TEXT_STYLE_SMALL.clone();
			this.tfTitle.x = cuboro.PADDING;
			this.tfTitle.text = "";
			this.addChild(this.tfTitle);

			this.border = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.border.width = 227;
			this.border.height = 27;
			this.border.tint = cuboro.COLOR_GREY;
			this.border.y = this.tfTitle.bottom;
			this.addChild(this.border);

			this.bg = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.bg.width = 225;
			this.bg.height = 25;
			this.bg.x = 1;
			this.bg.y = this.border.y + 1;
			this.addChild(this.bg);

			this.tfError = new gf.display.Text(this.game);
			this.tfError.style = cuboro.TEXT_STYLE_INPUT_ERROR.clone();
			this.tfError.style.wordWrapWidth = this.border.width - cuboro.PADDING * 2;
			this.tfError.text = "";
			this.tfError.x = cuboro.PADDING;
			this.tfError.y = this.border.bottom + 2;
			this.addChild(this.tfError);

			this.paddingLeft = cuboro.PADDING;
			this.paddingRight = cuboro.PADDING;

			this._dom.style.marginTop = "18px";

			this.width = this.bg.width;
			this.height = this.bg.height;
		}



		public onChange(): void
		{
			super.onChange();

			if (this.tfError.visible)
			{
				this.hideError();
			}
		}



		public onInputBlur(): void
		{
			this.validate();

			super.onInputBlur();
		}



		public hideError():void
		{
			this.tfError.text = "";
			this.tfError.visible = false;
			this.border.tint = cuboro.COLOR_GREY;
		}



		public showError(text: string):void
		{
			this.tfError.text = text;
			this.tfError.visible = true;
			this.border.tint = cuboro.COLOR_RED;
		}



		public validate(): boolean
		{
			this._inputDom.value = this.value.trim();

			if (!this.validation) return true;

			return this.validation(this.value);
		}
	}
}
