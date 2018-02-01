/// <reference path="../../cuboro/input/textinput.ts"/>
/// <reference path="../../cuboro/overlays/overlay.ts"/>
/// <reference path="../../cuboro/ui/checkbox.ts"/>
/// <reference path="../../gf/input/form.ts"/>



module cuboro.overlays
{
	export class ForgotPassword extends cuboro.overlays.Overlay
	{
		public static readonly NAME: string = "forgotPassword";

		public btLogin: cuboro.ui.TextButton;
		public btRegister: cuboro.ui.TextButton;
		public btRequestPassword: cuboro.ui.TextButton;
		public email: cuboro.input.TextInput;
		public form: gf.input.Form;
		public tfInfo: gf.display.Text;



		protected init(): void
		{
			super.init();

			this.tfTitle.text = loc("forgot_password");

			this.form = new gf.input.Form(this.game, "forgotPassword");
			this.form.onSubmit = () => this.onForgotPassword();
			this.addChild(this.form);

			this.tfInfo = new gf.display.Text(this.game, loc("forgot_password_info"), cuboro.TEXT_STYLE_SMALL.clone());
			this.tfInfo.style.wordWrap = true;
			this.tfInfo.style.wordWrapWidth = 227;
			this.tfInfo.y = this.tfTitle.bottom + cuboro.PADDING * 4;
			this.addChild(this.tfInfo);

			this.email = new cuboro.input.TextInput(this.game, this.form, "email");
			this.email.maxLength = 100;
			this.email.placeholder = loc("placeholder_email");
			this.email.tabIndex = 1;
			this.email.tfTitle.text = loc("placeholder_email");
			this.email.type = "email";
			this.email.validation = (value: string) => this.emailValidation(value);
			this.email.y = this.tfInfo.bottom + cuboro.PADDING * 2;
			this.form.addChild(this.email);

			this.btRequestPassword = new cuboro.ui.TextButton(this.game, loc("bt_request_password"), true);
			this.btRequestPassword.on(gf.CLICK, this.onForgotPassword, this);
			this.btRequestPassword.y = this.email.bottom + cuboro.PADDING * 2;
			this.btRequestPassword.setWidth(this.email.width);
			this.addChild(this.btRequestPassword);

			this.btRegister = new cuboro.ui.TextButton(this.game, loc("bt_register"), false);
			this.btRegister.y = this.btRequestPassword.bottom + cuboro.PADDING * 2;
			this.btRegister.on(gf.CLICK, this.onRegister, this);
			this.btRegister.setWidth(this.email.width);
			this.addChild(this.btRegister);

			this.btLogin = new cuboro.ui.TextButton(this.game, loc("bt_back_to_login"), false);
			this.btLogin.y = this.btRegister.bottom + cuboro.PADDING;
			this.btLogin.on(gf.CLICK, this.onLogin, this);
			this.btLogin.setWidth(this.email.width);
			this.addChild(this.btLogin);

			this.bg.height = this.btLogin.bottom - this.bg.y + cuboro.PADDING * 4;
		}



		protected emailValidation(value: string): boolean
		{
			this.email.tfError.text = "";

			let valid = false;

			if (kr3m.util.Validator.email(value))
				valid = true;
			else
				this.email.tfError.text = loc("error_input_default");

			return valid;
		}



		protected onForgotPassword(): void
		{
			if (this.form.validate())
			{
				this.game.overlays.show(cuboro.overlays.Loader.NAME);

				casClient.sendPasswordRecoverMail(this.email.value, () =>
				{
					this.game.overlays.hide(cuboro.overlays.Loader.NAME);
					this.game.overlays.hide(cuboro.overlays.ForgotPassword.NAME);

					const message:cuboro.overlays.Message = this.game.overlays.show(cuboro.overlays.Message.NAME);
					message.text = loc("forgot_password_send");
				});
			}
		}



		protected onLogin(): void
		{
			this.game.overlays.hide(cuboro.overlays.ForgotPassword.NAME);
			this.game.overlays.show(cuboro.overlays.Login.NAME);
		}



		protected onRegister(): void
		{
			this.game.overlays.hide(cuboro.overlays.ForgotPassword.NAME);
			this.game.overlays.show(cuboro.overlays.Register.NAME);
		}



		protected onClose(): void
		{
			track("ForgotPassword-Close");
			this.game.overlays.hide(cuboro.overlays.ForgotPassword.NAME);
		}



		public onResize(): void
		{
			super.onResize();

			this.email.x =
				this.btLogin.x =
					this.btRegister.x =
						this.btRequestPassword.x =
							this.tfInfo.x = this.bg.x + 22;
		}



		public transitionIn(): void
		{
			super.transitionIn();

			this.form.showDom();
		}



		public transitionOut(): void
		{
			super.transitionOut();

			this.form.hideDom();
		}
	}
}
