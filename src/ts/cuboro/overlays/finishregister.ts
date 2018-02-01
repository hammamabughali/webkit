/// <reference path="../../cuboro/input/textinput.ts"/>
/// <reference path="../../cuboro/overlays/overlay.ts"/>
/// <reference path="../../cuboro/ui/checkbox.ts"/>
/// <reference path="../../gf/input/form.ts"/>



module cuboro.overlays
{
	export class FinishRegister extends cuboro.overlays.Overlay
	{
		public static readonly NAME: string = "finishRegister";

		public btResend: cuboro.ui.TextButton;
		public tfResend: gf.display.Text;
		public tfResendTitle: gf.display.Text;
		public tfValidate: gf.display.Text;
		public tfValidateTitle: gf.display.Text;



		protected init(): void
		{
			super.init();

			this.bg.width = 340;
			this.tfTitle.text = loc("finish_register_title");

			this.tfValidateTitle = new gf.display.Text(this.game, loc("finish_register_validate_title"), cuboro.TEXT_STYLE_DEFAULT_HEAVY.clone());
			this.tfValidateTitle.y = this.tfTitle.bottom + cuboro.PADDING * 4;
			this.addChild(this.tfValidateTitle);

			this.tfValidate = new gf.display.Text(this.game, loc("finish_register_validate"), cuboro.TEXT_STYLE_DEFAULT.clone());
			this.tfValidate.style.fontSize = 13;
			this.tfValidate.style.wordWrap = true;
			this.tfValidate.style.wordWrapWidth = this.bg.width - 44;
			this.tfValidate.y = this.tfValidateTitle.bottom + cuboro.PADDING * 2;
			this.addChild(this.tfValidate);

			this.tfResendTitle = new gf.display.Text(this.game, loc("finish_register_resend_title"), cuboro.TEXT_STYLE_DEFAULT_HEAVY.clone());
			this.tfResendTitle.y = this.tfValidate.bottom + cuboro.PADDING * 4;
			this.addChild(this.tfResendTitle);

			this.tfResend = new gf.display.Text(this.game, loc("finish_register_resend"), cuboro.TEXT_STYLE_DEFAULT.clone());
			this.tfResend.style.fontSize = 13;
			this.tfResend.style.wordWrap = true;
			this.tfResend.style.wordWrapWidth = this.bg.width - 44;
			this.tfResend.y = this.tfResendTitle.bottom + cuboro.PADDING * 2;
			this.addChild(this.tfResend);

			this.btResend = new cuboro.ui.TextButton(this.game, loc("bt_resend"), true);
			this.btResend.on(gf.CLICK, this.onResend, this);
			this.btResend.y = this.tfResend.bottom + cuboro.PADDING * 2;
			this.btResend.setWidth(220);
			this.addChild(this.btResend);

			this.bg.height = this.btResend.bottom - this.bg.y + cuboro.PADDING * 4;
		}



		protected onResend(): void
		{
			this.game.overlays.show(cuboro.overlays.Loader.NAME);

			casClient.resendValidationEmail((status: string) =>
			{
				this.game.overlays.hide(cuboro.overlays.Loader.NAME);

				if (status == kr3m.SUCCESS)
				{
					this.game.overlays.hide(cuboro.overlays.FinishRegister.NAME);
				}
			});
		}



		protected onClose(): void
		{
			track("FinishRegister-Close");
			this.game.overlays.hide(cuboro.overlays.FinishRegister.NAME);
		}



		public set email(value: string)
		{
			this.tfValidate.text = loc("finish_register_validate", {email: value});
		}



		public onResize(): void
		{
			super.onResize();

			this.tfValidate.x =
				this.tfValidateTitle.x =
					this.tfResend.x =
						this.tfResendTitle.x = this.bg.x + 22;

			this.btResend.x = this.bg.x + ((this.bg.width - this.btResend.width) >> 1);
		}
	}
}
