/// <reference path="overlay.ts"/>



module cuboro.overlays
{
	export class NewComment extends cuboro.overlays.Overlay
	{
		public static readonly NAME: string = "newComment";

		public btAbort: cuboro.ui.TextButton;
		public btSubmit: cuboro.ui.TextButton;
		public form: gf.input.Form;
		public message: cuboro.input.TextArea;
		public tfInfo: gf.display.Text;
		public trackId: number;



		public init(): void
		{
			super.init();

			this.form = new gf.input.Form(this.game, "newComment");
			this.form.onSubmit = () => this.onSubmit();
			this.addChild(this.form);

			this.tfTitle.text = loc("comment_new_title");

			this.tfInfo = new gf.display.Text(this.game, loc("comment_info"), cuboro.TEXT_STYLE_DEFAULT.clone());
			this.tfInfo.style.fontSize = 13;
			this.tfInfo.style.wordWrap = true;
			this.tfInfo.style.wordWrapWidth = this.bg.width - 44;
			this.tfInfo.y = this.tfTitle.bottom + cuboro.PADDING * 4;
			this.addChild(this.tfInfo);

			this.message = new cuboro.input.TextArea(this.game, this.form, "comment");
			this.message.placeholder = loc("placeholder_comment");
			this.message.tabIndex = 3;
			this.message.tfTitle.text = loc("placeholder_comment");
			this.message.validation = (value: string) => this.messageValidation(value);
			this.message.required = true;
			this.message.setRows(5);
			this.message.y = this.tfInfo.bottom + cuboro.PADDING * 2;
			this.message.maxLength = 500;
			this.form.addChild(this.message);

			const btWidth = (this.bg.width - 44 - cuboro.PADDING * 2) >> 1;

			this.btSubmit = new cuboro.ui.TextButton(this.game, loc("bt_submit"), true);
			this.btSubmit.x = cuboro.PADDING;
			this.btSubmit.y = this.message.bottom + cuboro.PADDING * 2;
			this.btSubmit.on(gf.CLICK, this.onSubmit, this);
			this.btSubmit.setWidth(btWidth);
			this.addChild(this.btSubmit);

			this.btAbort = new cuboro.ui.TextButton(this.game, loc("bt_abort"), false);
			this.btAbort.y = this.btSubmit.y;
			this.btAbort.on(gf.CLICK, this.onClose, this);
			this.btAbort.setWidth(btWidth);
			this.addChild(this.btAbort);

			this.bg.height = this.btAbort.bottom - this.bg.y + cuboro.PADDING * 4;
		}



		protected messageValidation(value: string): boolean
		{
			this.message.hideError();

			let valid = false;

			if (value.length > 0)
				valid = true;
			else
				this.message.showError(loc("error_input_default"));

			return valid;
		}



		protected onSubmit(): void
		{
			if (this.form.validate())
			{
				this.game.overlays.show(cuboro.overlays.Loader.NAME);
				sComment.saveTrackComment(this.trackId, this.message.value, () =>
				{
					this.game.overlays.hide(cuboro.overlays.Loader.NAME);
					this.game.overlays.hide(cuboro.overlays.NewComment.NAME);
				});
			}
		}



		protected onClose(): void
		{
			this.game.overlays.hide(cuboro.overlays.NewComment.NAME);
		}



		public onResize(): void
		{
			super.onResize();

			this.btSubmit.x =
				this.tfInfo.x =
					this.message.x = this.bg.x + 22;

			this.btAbort.x = this.bg.x + (this.bg.width - this.btAbort.width - 22);
		}



		public transitionIn(): void
		{
			super.transitionIn();

			this.form.showDom();
			this.message.value = "";
		}



		public transitionOut(): void
		{
			super.transitionOut();

			this.form.hideDom();
		}
	}
}
