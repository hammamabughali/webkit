/// <reference path="../../cuboro/input/textarea.ts"/>
/// <reference path="../../cuboro/input/textinput.ts"/>
/// <reference path="../../cuboro/overlays/overlay.ts"/>
/// <reference path="../../cuboro/ui/checkbox.ts"/>
/// <reference path="../../gf/input/form.ts"/>



module cuboro.overlays
{
	export class Contact extends cuboro.overlays.Overlay
	{
		public static readonly NAME: string = "contact";

		public btAbort: cuboro.ui.TextButton;
		public btSubmit: cuboro.ui.TextButton;
		public form: gf.input.Form;
		public username: cuboro.input.TextInput;
		public email: cuboro.input.TextInput;
		public message: cuboro.input.TextArea;
		public tfDisclaimer: gf.display.Text;
		public tfInfo: gf.display.Text;



		protected init(): void
		{
			super.init();

			this.tfTitle.text = loc("contact");

			this.form = new gf.input.Form(this.game, "contact");
			this.form.onSubmit = () => this.onContact();
			this.addChild(this.form);

			this.tfInfo = new gf.display.Text(this.game, loc("contact_info"), cuboro.TEXT_STYLE_DEFAULT.clone());
			this.tfInfo.style.fontSize = 13;
			this.tfInfo.style.wordWrap = true;
			this.tfInfo.style.wordWrapWidth = this.bg.width - 44;
			this.tfInfo.y = this.tfTitle.bottom + cuboro.PADDING * 4;
			this.addChild(this.tfInfo);

			this.username = new cuboro.input.TextInput(this.game, this.form, "username");
			this.username.maxLength = 100;
			this.username.placeholder = loc("placeholder_username");
			this.username.required = true;
			this.username.tabIndex = 1;
			this.username.tfTitle.text = loc("placeholder_username");
			this.username.validation = (value: string) => this.usernameValidation(value);
			this.username.y = this.tfInfo.bottom + cuboro.PADDING * 2;
			this.form.addChild(this.username);

			this.email = new cuboro.input.TextInput(this.game, this.form, "email");
			this.email.maxLength = 100;
			this.email.placeholder = loc("placeholder_email");
			this.email.required = true;
			this.email.tabIndex = 2;
			this.email.tfTitle.text = loc("placeholder_email");
			this.email.type = "email";
			this.email.validation = (value: string) => this.emailValidation(value);
			this.email.y = this.username.bottom + cuboro.PADDING * 2;
			this.form.addChild(this.email);

			this.message = new cuboro.input.TextArea(this.game, this.form, "message");
			this.message.placeholder = loc("placeholder_message");
			this.message.tabIndex = 3;
			this.message.tfTitle.text = loc("placeholder_message");
			this.message.validation = (value: string) => this.messageValidation(value);
			this.message.required = true;
			this.message.setRows(5);
			this.message.y = this.email.bottom + cuboro.PADDING * 2;
			this.form.addChild(this.message);

			this.tfDisclaimer = new gf.display.Text(this.game, loc("contact_disclaimer"), cuboro.TEXT_STYLE_DEFAULT.clone());
			this.tfDisclaimer.style.fontSize = 13;
			this.tfDisclaimer.style.wordWrap = true;
			this.tfDisclaimer.style.wordWrapWidth = this.bg.width - 44;
			this.tfDisclaimer.y = this.message.bottom + cuboro.PADDING * 4;
			this.addChild(this.tfDisclaimer);

			const btWidth = (this.bg.width - 44 - cuboro.PADDING * 2) >> 1;

			this.btSubmit = new cuboro.ui.TextButton(this.game, loc("bt_submit"), true);
			this.btSubmit.x = cuboro.PADDING;
			this.btSubmit.y = this.tfDisclaimer.bottom + cuboro.PADDING * 2;
			this.btSubmit.on(gf.CLICK, this.onContact, this);
			this.btSubmit.setWidth(btWidth);
			this.addChild(this.btSubmit);

			this.btAbort = new cuboro.ui.TextButton(this.game, loc("bt_abort"), false);
			this.btAbort.y = this.btSubmit.y;
			this.btAbort.on(gf.CLICK, this.onClose, this);
			this.btAbort.setWidth(btWidth);
			this.addChild(this.btAbort);

			this.bg.height = this.btAbort.bottom - this.bg.y + cuboro.PADDING * 4;
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



		protected onContact(): void
		{
			if (this.form.validate())
			{
				track("Contact-Submit");
				this.game.overlays.show(cuboro.overlays.Loader.NAME);
				sMail.sendContact(this.username.value, this.email.value, this.message.value, () =>
				{
					this.game.overlays.hide(cuboro.overlays.Loader.NAME);
					this.game.overlays.hide(cuboro.overlays.Contact.NAME);
				});
			}
		}



		protected onClose(): void
		{
			track("Contact-Close");
			this.game.overlays.hide(cuboro.overlays.Contact.NAME);
		}



		public onResize(): void
		{
			super.onResize();

			this.btSubmit.x =
				this.username.x =
					this.email.x =
						this.message.x =
							this.tfDisclaimer.x =
								this.tfInfo.x = this.bg.x + 22;

			this.btAbort.x = this.username.right - this.btAbort.width;
		}



		public transitionIn(): void
		{
			super.transitionIn();

			this.form.showDom();

			this.username.value = "";
			this.email.value = "";
			this.message.value = "";
		}



		public transitionOut(): void
		{
			super.transitionOut();

			this.form.hideDom();
		}
	}
}
