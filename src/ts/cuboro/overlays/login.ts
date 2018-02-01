/// <reference path="../../cuboro/input/textinput.ts"/>
/// <reference path="../../cuboro/overlays/overlay.ts"/>
/// <reference path="../../cuboro/ui/checkbox.ts"/>
/// <reference path="../../gf/input/form.ts"/>



module cuboro.overlays
{
	export class Login extends cuboro.overlays.Overlay
	{
		public static readonly NAME: string = "login";

		public btForgotPassword: cuboro.ui.TextButton;
		public btRegister: cuboro.ui.TextButton;
		public btLogin: cuboro.ui.TextButton;
		public cbAlwaysLogin: cuboro.ui.Checkbox;
		public cbShowPassword: cuboro.ui.Checkbox;
		public tfTitle: gf.display.Text;
		public form: gf.input.Form;
		public email: cuboro.input.TextInput;
		public password: cuboro.input.TextInput;
		public tfError: gf.display.Text;
		public tfRegister: gf.display.Text;



		protected init(): void
		{
			super.init();

			this.tfTitle.text = loc("login");

			this.form = new gf.input.Form(this.game, "login");
			this.form.onSubmit = () => this.onLogin();
			this.addChild(this.form);

			this.email = new cuboro.input.TextInput(this.game, this.form, "email");
			this.email.maxLength = 100;
			this.email.placeholder = loc("placeholder_email");
			this.email.tabIndex = 1;
			this.email.tfTitle.text = loc("placeholder_email");
			this.email.type = "email";
			this.email.required = true;
			this.email.validation = (value: string) => this.emailValidation(value);
			this.email.y = this.tfTitle.bottom + cuboro.PADDING * 4;
			this.form.addChild(this.email);

			this.password = new cuboro.input.TextInput(this.game, this.form, "password");
			this.password.maxLength = 50;
			this.password.placeholder = loc("placeholder_password_login");
			this.password.tabIndex = 2;
			this.password.type = "password";
			this.password.required = true;
			this.password.tfTitle.text = loc("placeholder_password_login");
			this.password.validation = (value: string) => this.passwordValidation(value);
			this.password.y = this.email.bottom + cuboro.PADDING * 2;
			this.form.addChild(this.password);

			this.cbShowPassword = new cuboro.ui.Checkbox(this.game, loc("bt_show_password"));
			this.cbShowPassword.y = this.password.bottom + cuboro.PADDING;
			this.cbShowPassword.on(gf.CLICK, this.onTogglePassword, this);
			this.addChild(this.cbShowPassword);

			this.cbAlwaysLogin = new cuboro.ui.Checkbox(this.game, loc("bt_always_login"));
			this.cbAlwaysLogin.y = this.cbShowPassword.bottom + cuboro.PADDING;
			this.addChild(this.cbAlwaysLogin);

			this.btLogin = new cuboro.ui.TextButton(this.game, loc("bt_login"), true);
			this.btLogin.on(gf.CLICK, this.form.submit, this.form);
			this.btLogin.x = gf.utils.Align.centerX(this.btLogin, this.width);
			this.btLogin.y = this.cbAlwaysLogin.bottom + cuboro.PADDING;
			this.btLogin.setWidth(this.email.width);
			this.addChild(this.btLogin);

			this.tfError = new gf.display.Text(this.game);
			this.tfError.style = cuboro.TEXT_STYLE_INPUT_ERROR.clone();
			this.tfError.style .align = gf.CENTER;
			this.tfError.style.wordWrapWidth = this.bg.width - 44;
			this.tfError.visible = false;
			this.tfError.y = this.btLogin.bottom + cuboro.PADDING * 2;
			this.addChild(this.tfError);

			this.tfRegister = new gf.display.Text(this.game, loc("login_register"), cuboro.TEXT_STYLE_TITLE_TAB.clone());
			this.tfRegister.style.fontSize = 13;
			this.tfRegister.y = this.btLogin.bottom + cuboro.PADDING * 4;
			this.addChild(this.tfRegister);

			this.btRegister = new cuboro.ui.TextButton(this.game, loc("bt_register"), false);
			this.btRegister.y = this.tfRegister.bottom + cuboro.PADDING;
			this.btRegister.on(gf.CLICK, this.onRegister, this);
			this.btRegister.setWidth(this.email.width);
			this.addChild(this.btRegister);

			this.btForgotPassword = new cuboro.ui.TextButton(this.game, loc("bt_forgot_password"), false);
			this.btForgotPassword.on(gf.CLICK, this.onForgotPassword, this);
			this.btForgotPassword.y = this.btRegister.bottom + cuboro.PADDING * 2;
			this.btForgotPassword.setWidth(this.email.width);
			this.addChild(this.btForgotPassword);

			this.bg.height = this.btForgotPassword.bottom - this.bg.y + cuboro.PADDING * 4;
		}



		protected emailValidation(value: string): boolean
		{
			this.email.hideError();

			let valid = false;

			if (kr3m.util.Validator.email(value))
				valid = true;
			else
				this.email.showError(loc("error_input_default"));

			return valid;
		}



		protected passwordValidation(value: string): boolean
		{
			this.password.hideError();

			let valid = false;

			if (value.length >= 6 && value.length <= 50)
				valid = true;
			else
				this.password.showError(loc("error_password"));

			return valid;
		}



		protected onForgotPassword(): void
		{
			this.game.overlays.hide(cuboro.overlays.Login.NAME);
			this.game.overlays.show(cuboro.overlays.ForgotPassword.NAME);
		}



		protected onRegister(): void
		{
			this.game.overlays.hide(cuboro.overlays.Login.NAME);
			this.game.overlays.show(cuboro.overlays.Register.NAME);
		}



		protected onLogin(): void
		{
			if (this.form.validate())
			{
				this.game.overlays.show(cuboro.overlays.Loader.NAME);

				casClient.loginEmail(this.email.value, this.password.value, (status: string) =>
				{
					this.game.overlays.hide(cuboro.overlays.Loader.NAME);

					if (status == kr3m.SUCCESS)
					{
						this.game.overlays.hide(cuboro.overlays.Login.NAME);
						this.tfError.visible = false;
					}
					else
					{
						this.tfError.text = loc("error_login_failed");
						this.tfError.visible = true;
					}

					this.onResize();
				});
			}
		}



		protected onTogglePassword(): void
		{
			this.password.type = (this.cbShowPassword.isChecked) ? "text" : "password";
		}



		protected onClose(): void
		{
			track("Login-Close");
			this.game.overlays.hide(cuboro.overlays.Login.NAME);
		}



		public onResize(): void
		{
			super.onResize();

			this.email.x =
				this.password.x =
					this.cbShowPassword.x =
						this.btForgotPassword.x =
							this.btLogin.x =
								this.btRegister.x =
									this.cbAlwaysLogin.x = this.bg.x + 22;

			this.tfRegister.x = this.btRegister.x + ((this.btRegister.width - this.tfRegister.width) >> 1);

			if (this.tfError.visible)
			{
				this.tfError.x = this.btRegister.x + ((this.btRegister.width - this.tfError.width) >> 1);
				this.tfRegister.y = this.tfError.bottom + cuboro.PADDING * 4;
			}
			else
			{
				this.tfRegister.y = this.btLogin.bottom + cuboro.PADDING * 4;
			}

			this.btRegister.y = this.tfRegister.bottom + cuboro.PADDING;
			this.btForgotPassword.y = this.btRegister.bottom + cuboro.PADDING * 2;
			this.bg.height = this.btForgotPassword.bottom - this.bg.y + cuboro.PADDING * 4;
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
