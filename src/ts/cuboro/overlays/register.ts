/// <reference path="../../cuboro/input/textinput.ts"/>
/// <reference path="../../cuboro/overlays/overlay.ts"/>
/// <reference path="../../cuboro/ui/checkbox.ts"/>
/// <reference path="../../gf/input/form.ts"/>



module cuboro.overlays
{
	export class Register extends cuboro.overlays.Overlay
	{
		public static readonly NAME: string = "register";

		public btAlreadyRegistered: cuboro.ui.TextButton;
		public btRegister: cuboro.ui.TextButton;
		public cbShowPassword: cuboro.ui.Checkbox;
		public cbNewsletter: cuboro.ui.Checkbox;
		public email: cuboro.input.TextInput;
		public form: gf.input.Form;
		public password: cuboro.input.TextInput;
		public username: cuboro.input.TextInput;
		public tfError: gf.display.Text;



		protected init(): void
		{
			super.init();

			this.tfTitle.text = loc("register");

			this.form = new gf.input.Form(this.game, "register");
			this.form.onSubmit = () => this.onRegister();
			this.addChild(this.form);

			this.username = new cuboro.input.TextInput(this.game, this.form, "username");
			this.username.maxLength = 20;
			this.username.placeholder = loc("placeholder_username");
			this.username.tabIndex = 1;
			this.username.tfTitle.text = loc("placeholder_username");
			this.username.validation = (value: string) => this.usernameValidation(value);
			this.username.y = this.tfTitle.bottom + cuboro.PADDING * 4;
			this.form.addChild(this.username);

			this.email = new cuboro.input.TextInput(this.game, this.form, "email");
			this.email.maxLength = 100;
			this.email.placeholder = loc("placeholder_email");
			this.email.tabIndex = 2;
			this.email.tfTitle.text = loc("placeholder_email");
			this.email.type = "email";
			this.email.validation = (value: string) => this.emailValidation(value);
			this.email.y = this.username.bottom + cuboro.PADDING * 2;
			this.form.addChild(this.email);

			this.password = new cuboro.input.TextInput(this.game, this.form, "password");
			this.password.maxLength = 50;
			this.password.placeholder = loc("placeholder_password_register");
			this.password.tabIndex = 3;
			this.password.type = "password";
			this.password.validation = (value: string) => this.passwordValidation(value);
			this.password.tfTitle.text = loc("placeholder_password_login");
			this.password.y = this.email.bottom + cuboro.PADDING * 2;
			this.form.addChild(this.password);

			this.cbShowPassword = new cuboro.ui.Checkbox(this.game, loc("bt_show_password"));
			this.cbShowPassword.y = this.password.bottom + cuboro.PADDING;
			this.cbShowPassword.on(gf.CLICK, this.onTogglePassword, this);
			this.addChild(this.cbShowPassword);

			this.cbNewsletter = new cuboro.ui.Checkbox(this.game, loc("bt_newsletter"));
			this.cbNewsletter.y = this.cbShowPassword.bottom + cuboro.PADDING * 2;
			this.cbNewsletter.tfLabel.style.wordWrap = true;
			this.cbNewsletter.tfLabel.style.wordWrapWidth = this.username.width - this.cbNewsletter.tfLabel.x;
			this.addChild(this.cbNewsletter);

			this.btRegister = new cuboro.ui.TextButton(this.game, loc("bt_register"), true);
			this.btRegister.on(gf.CLICK, this.form.submit, this.form);
			this.btRegister.y = this.cbNewsletter.bottom + cuboro.PADDING * 2;
			this.btRegister.setWidth(this.username.width);
			this.addChild(this.btRegister);

			this.btAlreadyRegistered = new cuboro.ui.TextButton(this.game, loc("bt_already_registered"), false);
			this.btAlreadyRegistered.on(gf.CLICK, this.onLogin, this);
			this.btAlreadyRegistered.y = this.btRegister.bottom + cuboro.PADDING;
			this.btAlreadyRegistered.setWidth(this.username.width);
			this.addChild(this.btAlreadyRegistered);

			this.tfError = new gf.display.Text(this.game);
			this.tfError.style = cuboro.TEXT_STYLE_INPUT_ERROR.clone();
			this.tfError.style.align = gf.CENTER;
			this.tfError.style.wordWrapWidth = this.bg.width - 44;
			this.tfError.visible = false;
			this.tfError.y = this.btAlreadyRegistered.bottom + cuboro.PADDING * 2;
			this.addChild(this.tfError);

			this.bg.height = this.btAlreadyRegistered.bottom - this.bg.y + cuboro.PADDING * 4;
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



		protected usernameValidation(value: string): boolean
		{
			this.username.hideError();

			let valid = false;

			if (value.length > 0)
				valid = true;
			else
				this.username.showError(loc("error_input_default"));

			return valid;
		}



		protected onLogin(): void
		{
			this.game.overlays.hide(cuboro.overlays.Register.NAME);
			this.game.overlays.show(cuboro.overlays.Login.NAME);
		}



		protected onRegister(): void
		{
			if (this.form.validate())
			{
				this.game.overlays.show(cuboro.overlays.Loader.NAME);

				casClient.registerEmail(this.username.value, this.email.value, this.password.value, this.cbNewsletter.isChecked, {}, (status: string) =>
				{
					this.game.overlays.hide(cuboro.overlays.Loader.NAME);

					if (status == kr3m.SUCCESS)
					{
						this.game.overlays.hide(cuboro.overlays.Register.NAME);
						this.game.overlays.show(cuboro.overlays.FinishRegister.NAME);
						this.tfError.visible = false;
					}
					else
					{
						this.tfError.text = loc("error_register_failed");
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
			track("Register-Close");
			this.game.overlays.hide(cuboro.overlays.Register.NAME);
		}



		public onResize(): void
		{
			super.onResize();

			this.username.x =
				this.email.x =
					this.password.x =
						this.cbShowPassword.x =
							this.btRegister.x =
								this.btAlreadyRegistered.x =
									this.cbNewsletter.x =
										this.cbShowPassword.x = this.bg.x + 22;

			if (this.tfError.visible)
			{
				this.tfError.x = this.btRegister.x + ((this.btRegister.width - this.tfError.width) >> 1);
				this.bg.height = this.tfError.bottom - this.bg.y + cuboro.PADDING * 4;
			}
			else
			{
				this.bg.height = this.btAlreadyRegistered.bottom - this.bg.y + cuboro.PADDING * 4;
			}
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
