/// <reference path="../../kr3m/util/validator.ts"/>



module cuboro.ui
{
	export class Register extends gf.display.Container
	{
		public btAlreadyRegistered: cuboro.ui.TextButton;
		public btRegister: cuboro.ui.IconButton;
		public cbShowPassword: cuboro.ui.Checkbox;
		public cbNewsletter: cuboro.ui.Checkbox;
		public email: cuboro.input.TextInput;
		public form: gf.input.Form;
		public password: cuboro.input.TextInput;
		public tfError: gf.display.Text;
		public tfTitle: gf.display.Text;
		public username: cuboro.input.TextInput;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.tfTitle = new gf.display.Text(this.game, loc("register"), cuboro.TEXT_STYLE_TITLE_TAB.clone());
			this.tfTitle.y = 30;
			this.addChild(this.tfTitle);

			this.form = new gf.input.Form(this.game, "register");
			this.form.onSubmit = () => this.onRegister();
			this.addChild(this.form);

			this.username = new cuboro.input.TextInput(this.game, this.form, "username");
			this.username.maxLength = 100;
			this.username.placeholder = loc("placeholder_username");
			this.username.tabIndex = 1;
			this.username.validation = (value: string) => this.usernameValidation(value);
			this.username.y = this.tfTitle.bottom + 5;
			this.form.addChild(this.username);

			this.email = new cuboro.input.TextInput(this.game, this.form, "email");
			this.email.maxLength = 100;
			this.email.placeholder = loc("placeholder_email");
			this.email.tabIndex = 1;
			this.email.validation = (value: string) => this.emailValidation(value);
			this.email.y = this.username.bottom + 10;
			this.email.type = "email";
			this.form.addChild(this.email);

			this.password = new cuboro.input.TextInput(this.game, this.form, "password");
			this.password.maxLength = 50;
			this.password.placeholder = loc("placeholder_password_register");
			this.password.tabIndex = 2;
			this.password.type = "password";
			this.password.validation = (value: string) => this.passwordValidation(value);
			this.password.y = this.email.bottom + 10;
			this.form.addChild(this.password);

			this.cbShowPassword = new cuboro.ui.Checkbox(this.game, loc("bt_show_password"));
			this.cbShowPassword.y = this.password.bottom + 5;
			this.cbShowPassword.on(gf.CLICK, this.onTogglePassword, this);
			this.addChild(this.cbShowPassword);

			this.cbNewsletter = new cuboro.ui.Checkbox(this.game, loc("bt_newsletter"));
			this.cbNewsletter.y = this.cbShowPassword.bottom + 10;
			this.addChild(this.cbNewsletter);

			this.tfError = new gf.display.Text(this.game, "", cuboro.TEXT_STYLE_INPUT_ERROR.clone());
			this.tfError.alpha = 0;
			this.tfError.anchor.x = 0.5;
			this.tfError.x = this.width >> 1;
			this.tfError.y = this.cbNewsletter.bottom + 20;
			this.addChild(this.tfError);

			this.btRegister = new cuboro.ui.IconButton(this.game, "register");
			this.btRegister.label = loc("bt_register");
			this.btRegister.on(gf.CLICK, this.form.submit, this.form);
			this.btRegister.x = gf.utils.Align.centerX(this.btRegister, this.width);
			this.btRegister.y = this.tfError.bottom + 10;
			this.addChild(this.btRegister);

			this.btAlreadyRegistered = new cuboro.ui.TextButton(this.game, loc("bt_already_registered"), false);
			this.btAlreadyRegistered.on(gf.CLICK, this.onLogin, this);
			this.btAlreadyRegistered.x = gf.utils.Align.centerX(this.btAlreadyRegistered, this.width);
			this.btAlreadyRegistered.y = this.btRegister.bottom + 20;
			this.addChild(this.btAlreadyRegistered);
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



		protected passwordValidation(value: string): boolean
		{
			this.password.tfError.text = "";

			let valid = false;

			if (value.length >= 6 && value.length <= 50)
				valid = true;
			else
				this.password.tfError.text = loc("error_password");

			return valid;
		}



		protected usernameValidation(value: string): boolean
		{
			this.username.tfError.text = "";

			let valid = false;

			if (value.length > 0)
				valid = true;
			else
				this.username.tfError.text = loc("error_input_default");

			return valid;
		}



		protected onLogin(): void
		{
			this.emit("login");
		}



		protected onRegister(): void
		{
			if (this.form.validate())
			{
				this.tfError.alpha = 0;
				this.game.overlays.show(cuboro.overlays.Loader.NAME);

				casClient.registerEmail(this.username.value, this.email.value, this.password.value, this.cbNewsletter.isChecked, {}, (status: string) =>
				{
					this.game.overlays.hide(cuboro.overlays.Loader.NAME);

					if (status != kr3m.SUCCESS)
					{
						this.tfError.text = loc("error_register_failed");
						this.tfError.alpha = 1;
					}
				});
			}
		}



		protected onTogglePassword(): void
		{
			this.password.type = (this.cbShowPassword.isChecked) ? "text" : "password";
		}
	}
}
