module cuboro.ui
{
	export class ForgotPassword extends gf.display.Container
	{
		public tfTitle: gf.display.Text;
		public form: gf.input.Form;



		constructor(game:gf.core.Game)
		{
			super(game);

			this.tfTitle = new gf.display.Text(this.game, loc("forgot_password"), cuboro.TEXT_STYLE_TITLE_TAB.clone());
			this.tfTitle.y = 30;
			this.addChild(this.tfTitle);

			this.form = new gf.input.Form(this.game, "forgotPassword");
			this.form.onSubmit = () => this.onForgotPassword();
			this.addChild(this.form);
		}



		protected onForgotPassword():void
		{
		}
	}
}
