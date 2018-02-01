/// <reference path="../../cuboro/input/textinput.ts"/>
/// <reference path="../../cuboro/overlays/overlay.ts"/>
/// <reference path="../../cuboro/ui/checkbox.ts"/>
/// <reference path="../../gf/input/form.ts"/>



module cuboro.overlays
{
	export class Account extends cuboro.overlays.Overlay
	{
		public static readonly NAME: string = "account";

		public accountData: cas.vo.AccountData;
		public btSave: cuboro.ui.TextButton;
		public cbNewsletter: cuboro.ui.Checkbox;
		public email: cuboro.input.TextInput;
		public form: gf.input.Form;
		public username: cuboro.input.TextInput;
		public tfError: gf.display.Text;
		public tfInfo: gf.display.Text;



		protected init(): void
		{
			super.init();

			this.tfTitle.text = loc("account_title");

			this.tfInfo = new gf.display.Text(this.game, loc("account"), cuboro.TEXT_STYLE_SMALL.clone());
			this.tfInfo.style.wordWrap = true;
			this.tfInfo.style.wordWrapWidth = this.bg.width - 44;
			this.tfInfo.y = this.tfTitle.bottom + cuboro.PADDING * 4;
			this.addChild(this.tfInfo);

			this.form = new gf.input.Form(this.game, "login");
			this.form.onSubmit = () => this.onSave();
			this.addChild(this.form);

			this.username = new cuboro.input.TextInput(this.game, this.form, "username");
			this.username.maxLength = 20;
			this.username.placeholder = loc("placeholder_username");
			this.username.tabIndex = 1;
			this.username.tfTitle.text = loc("placeholder_username");
			this.username.validation = (value: string) => this.usernameValidation(value);
			this.username.y = this.tfInfo.bottom + cuboro.PADDING * 2;
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

			this.cbNewsletter = new cuboro.ui.Checkbox(this.game, loc("bt_newsletter"));
			this.cbNewsletter.y = this.email.bottom + cuboro.PADDING * 2;
			this.cbNewsletter.tfLabel.style.wordWrap = true;
			this.cbNewsletter.tfLabel.style.wordWrapWidth = this.username.width - this.cbNewsletter.tfLabel.x;
			this.addChild(this.cbNewsletter);

			this.btSave = new cuboro.ui.TextButton(this.game, loc("bt_save"), true);
			this.btSave.on(gf.CLICK, this.form.submit, this.form);
			this.btSave.y = this.cbNewsletter.bottom + cuboro.PADDING * 2;
			this.btSave.setWidth(this.username.width);
			this.addChild(this.btSave);

			this.tfError = new gf.display.Text(this.game);
			this.tfError.style = cuboro.TEXT_STYLE_INPUT_ERROR.clone();
			this.tfError.style.wordWrapWidth = this.bg.width - 44;
			this.tfError.visible = false;
			this.tfError.y = this.btSave.bottom + cuboro.PADDING * 2;
			this.addChild(this.tfError);

			this.bg.height = this.btSave.bottom - this.bg.y + cuboro.PADDING * 4;
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



		protected onSave(): void
		{
			if (this.form.validate())
			{
				this.accountData.email = this.email.value;
				this.accountData.user.name = this.username.value;
				this.accountData.newsletter = this.cbNewsletter.isChecked;

				this.game.overlays.show(cuboro.overlays.Loader.NAME);

				casClient.saveUserAccount(this.accountData, (status: string) =>
				{
					this.game.overlays.hide(cuboro.overlays.Loader.NAME);

					if (status == kr3m.SUCCESS)
					{
						this.game.overlays.hide(cuboro.overlays.Account.NAME);
						this.tfError.visible = false;

						const message = this.game.overlays.show(cuboro.overlays.Message.NAME);
						message.text = loc("account_changed");
					}
					else
					{
						this.tfError.text = loc("error_account_changed");
						this.tfError.visible = true;
					}

					this.onResize();
				});
			}
		}



		protected onClose(): void
		{
			track("Account-Close");
			this.game.overlays.hide(cuboro.overlays.Account.NAME);
		}



		public onResize(): void
		{
			super.onResize();

			this.email.x =
				this.username.x =
					this.tfInfo.x =
						this.btSave.x =
							this.cbNewsletter.x = this.bg.x + 22;

			this.tfError.x = this.btSave.x + ((this.btSave.width - this.tfError.width) >> 1);

			if (this.tfError.visible)
			{
				this.bg.height = this.tfError.bottom - this.bg.y + cuboro.PADDING * 4;
			}
			else
			{
				this.bg.height = this.btSave.bottom - this.bg.y + cuboro.PADDING * 4;
			}
		}



		public transitionIn(): void
		{
			super.transitionIn();

			this.form.showDom();

			this.game.overlays.show(cuboro.overlays.Loader.NAME);
			casClient.getUserAccount((account: cas.vo.AccountData) =>
			{
				this.game.overlays.hide(cuboro.overlays.Loader.NAME);

				this.accountData = account;
				this.username.value = this.accountData.user.name;
				this.email.value = this.accountData.email;
				this.cbNewsletter.isChecked = this.accountData.newsletter;

				this.form.validate();
			});
		}



		public transitionOut(): void
		{
			super.transitionOut();

			this.form.hideDom();
		}
	}
}
