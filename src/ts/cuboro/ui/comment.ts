///<reference path="reportabusebutton.ts"/>



module cuboro.ui
{
	export class Comment extends gf.display.Container
	{
		private _title: string;
		private _text: string;

		public btReportAbuse: cuboro.ui.ReportAbuseButton;
		public comment: cuboro.vo.Comment;
		public tfTitle: gf.display.Text;
		public tfText: gf.display.Text;



		constructor(game: gf.core.Game, comment: cuboro.vo.Comment)
		{
			super(game);

			this.comment = comment;

			const date = locDate("comment_date", this.comment.createdWhen);
			const title = loc("comment_title", {username: this.comment.name, date: date});
			this.tfTitle = new gf.display.Text(this.game, title);
			this.tfTitle.style = cuboro.TEXT_STYLE_SMALL_HEAVY.clone();
			this.addChild(this.tfTitle);

			this.tfText = new gf.display.Text(this.game, this.comment.comment);
			this.tfText.style = cuboro.TEXT_STYLE_SMALL.clone();
			this.addChild(this.tfText);

			this.btReportAbuse = new cuboro.ui.ReportAbuseButton(this.game);
			this.btReportAbuse.on(gf.CLICK, this.onReportAbuse, this);
			this.btReportAbuse.isEnabled = mUser.isLoggedIn();
			this.addChild(this.btReportAbuse);
		}



		protected onReportAbuse(): void
		{
			this.game.overlays.show(cuboro.overlays.Loader.NAME);
			sComment.reportAbuse(this.comment.id, () =>
			{
				this.game.overlays.hide(cuboro.overlays.Loader.NAME);

				const message = this.game.overlays.show(cuboro.overlays.Message.NAME);
				message.text = loc("abuse_reported");
			});
		}



		public get text(): string
		{
			return this._text;
		}



		public set text(value: string)
		{
			this._text = value;
			this.tfText.text = this._text;
		}



		public get title(): string
		{
			return this._title;
		}



		public set title(value: string)
		{
			this._title = value;
			this.tfTitle.text = this._title;
			this.tfText.y = this.tfTitle.bottom;
		}



		public get wordWrapWidth(): number
		{
			return this.tfText.style.wordWrapWidth;
		}



		public set wordWrapWidth(value: number)
		{
			this.tfText.style.breakWords = true;
			this.tfText.style.wordWrap = true;
			this.tfText.style.wordWrapWidth = value - this.tfText.x;

			this.tfTitle.style.wordWrap = true;
			this.tfTitle.style.wordWrapWidth = value - this.btReportAbuse.width - cuboro.PADDING * 2;

			this.tfText.y = this.tfTitle.bottom;

			this.btReportAbuse.x = value - this.btReportAbuse.width - cuboro.PADDING;
		}
	}
}
