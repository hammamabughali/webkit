/// <reference path="../../cuboro/input/textinput.ts"/>
/// <reference path="../../cuboro/overlays/overlay.ts"/>
/// <reference path="../../cuboro/ui/checkbox.ts"/>
/// <reference path="../../gf/input/form.ts"/>



module cuboro.overlays
{
	export class ChangePassword extends cuboro.overlays.Overlay
	{
		public static readonly NAME: string = "changePassword";

		public btChangePassword: cuboro.ui.TextButton;
		public cbShowPasswords: cuboro.ui.Checkbox;
		public passwordOld: cuboro.input.TextInput;
		public passwordNew: cuboro.input.TextInput;
		public passwordNewRepeat: cuboro.input.TextInput;
		public form: gf.input.Form;
		public tfError: gf.display.Text;
		public tfInfo: gf.display.Text;



		protected init(): void
		{
			super.init();

			this.tfTitle.text = loc("change_password_title");

			this.form = new gf.input.Form(this.game, "changePassword");
			this.form.onSubmit = () => this.onChangePassword();
			this.addChild(this.form);

			this.tfInfo = new gf.display.Text(this.game, loc("change_password"), cuboro.TEXT_STYLE_SMALL.clone());
			this.tfInfo.style.wordWrap = true;
			this.tfInfo.style.wordWrapWidth = this.bg.width - 44;
			this.tfInfo.y = this.tfTitle.bottom + cuboro.PADDING * 4;
			this.addChild(this.tfInfo);

			this.passwordOld = new cuboro.input.TextInput(this.game, this.form, "passwordOld");
			this.passwordOld.maxLength = 50;
			this.passwordOld.placeholder = loc("placeholder_password_old");
			this.passwordOld.tabIndex = 1;
			this.passwordOld.type = "password";
			this.passwordOld.tfTitle.text = loc("placeholder_password_old");
			this.passwordOld.validation = (value: string) => this.passwordValidation(value, this.passwordOld);
			this.passwordOld.y = this.tfInfo.bottom + cuboro.PADDING * 2;
			this.form.addChild(this.passwordOld);

			this.passwordNew = new cuboro.input.TextInput(this.game, this.form, "passwordNew");
			this.passwordNew.maxLength = 50;
			this.passwordNew.placeholder = loc("placeholder_password_new");
			this.passwordNew.tabIndex = 2;
			this.passwordNew.type = "password";
			this.passwordNew.tfTitle.text = loc("placeholder_password_new");
			this.passwordNew.validation = (value: string) => this.passwordValidationNew(value, this.passwordNew);
			this.passwordNew.y = this.passwordOld.bottom + cuboro.PADDING;
			this.form.addChild(this.passwordNew);

			this.passwordNewRepeat = new cuboro.input.TextInput(this.game, this.form, "passwordNewRepeat");
			this.passwordNewRepeat.maxLength = 50;
			this.passwordNewRepeat.placeholder = loc("placeholder_password_new_repeat");
			this.passwordNewRepeat.tabIndex = 3;
			this.passwordNewRepeat.type = "password";
			this.passwordNewRepeat.tfTitle.text = loc("placeholder_password_new_repeat");
			this.passwordNewRepeat.validation = (value: string) => this.passwordValidationNew(value, this.passwordNewRepeat);
			this.passwordNewRepeat.y = this.passwordNew.bottom + cuboro.PADDING;
			this.form.addChild(this.passwordNewRepeat);

			this.cbShowPasswords = new cuboro.ui.Checkbox(this.game, loc("bt_show_passwords"));
			this.cbShowPasswords.y = this.passwordNewRepeat.bottom + cuboro.PADDING;
			this.cbShowPasswords.on(gf.CLICK, this.onTogglePasswords, this);
			this.addChild(this.cbShowPasswords);

			this.btChangePassword = new cuboro.ui.TextButton(this.game, loc("bt_change_password2"), true);
			this.btChangePassword.on(gf.CLICK, this.onChangePassword, this);
			this.btChangePassword.y = this.cbShowPasswords.bottom + cuboro.PADDING * 2;
			this.btChangePassword.setWidth(this.passwordOld.width);
			this.addChild(this.btChangePassword);

			this.tfError = new gf.display.Text(this.game);
			this.tfError.style = cuboro.TEXT_STYLE_INPUT_ERROR.clone();
			this.tfError.style.wordWrapWidth = this.bg.width - 44;
			this.tfError.visible = false;
			this.tfError.y = this.btChangePassword.bottom + cuboro.PADDING * 2;
			this.addChild(this.tfError);

			this.bg.height = this.btChangePassword.bottom - this.bg.y + cuboro.PADDING * 4;
		}



		protected passwordValidation(value: string, input: cuboro.input.TextInput): boolean
		{
			input.hideError();

			let valid = false;

			if (value.length >= 6 && value.length <= 50)
				valid = true;
			else
				input.showError(loc("error_password"));

			return valid;
		}



		protected passwordValidationNew(value: string, input: cuboro.input.TextInput): boolean
		{
			this.passwordNew.hideError();
			this.passwordNewRepeat.hideError();

			let valid = false;

			if (value.length >= 6 && value.length <= 50)
			{
				if (this.passwordNew.value == this.passwordNewRepeat.value)
				{
					valid = true;
				}
				else
				{
					input.showError(loc("error_password_mismatch"));
				}
			}
			else
				input.showError(loc("error_password"));

			return valid;
		}



		protected onTogglePasswords(): void
		{
			this.passwordOld.type = (this.cbShowPasswords.isChecked) ? "text" : "password";
			this.passwordNew.type = (this.cbShowPasswords.isChecked) ? "text" : "password";
			this.passwordNewRepeat.type = (this.cbShowPasswords.isChecked) ? "text" : "password";
		}



		protected onChangePassword(): void
		{
			if (this.form.validate())
			{
				this.game.overlays.show(cuboro.overlays.Loader.NAME);

				casClient.setPassword(this.passwordOld.value, this.passwordNew.value, (status: string) =>
				{
					this.game.overlays.hide(cuboro.overlays.Loader.NAME);

					if (status == kr3m.SUCCESS)
					{
						this.game.overlays.hide(cuboro.overlays.ChangePassword.NAME);
						this.tfError.visible = false;

						const message = this.game.overlays.show(cuboro.overlays.Message.NAME);
						message.text = loc("change_password_changed");
					}
					else
					{
						this.tfError.text = loc("error_password_change");
						this.tfError.visible = true;
					}

					this.onResize();
				});
			}
		}



		protected onClose(): void
		{
			track("ChangePassword-Close");
			this.game.overlays.hide(cuboro.overlays.ChangePassword.NAME);
		}



		public onResize(): void
		{
			super.onResize();

			this.cbShowPasswords.x =
				this.passwordNew.x =
					this.passwordNewRepeat.x =
						this.passwordOld.x =
							this.btChangePassword.x =
								this.tfError.x =
									this.tfInfo.x = this.bg.x + 22;

			if (this.tfError.visible)
				this.bg.height = this.tfError.bottom - this.bg.y + cuboro.PADDING * 4;
			else
				this.bg.height = this.btChangePassword.bottom - this.bg.y + cuboro.PADDING * 4;
		}



		public transitionIn(): void
		{
			super.transitionIn();

			this.form.showDom();

			this.passwordNew.value = "";
			this.passwordNewRepeat.value = "";
			this.passwordOld.value = "";
		}



		public transitionOut(): void
		{
			super.transitionOut();

			this.form.hideDom();
		}
	}
}
