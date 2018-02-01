/// <reference path="../comment.ts"/>
/// <reference path="../tabs/tab.ts"/>



module cuboro.ui.tabs
{
	export class Comments extends cuboro.ui.tabs.Tab
	{
		protected items: cuboro.ui.Comment[];

		public btNewComment: cuboro.ui.TextButton;
		public tfNoComments: gf.display.Text;
		public track: cuboro.vo.Track;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.contentMask.width = 480 - this.scrollbar.width - 20;
			this.contentMask.height = 180;
			this.contentMask.x = 20;

			this.scrollbar.y = this.contentMask.y;

			this.content.x = this.contentMask.x;
			this.content.y = this.contentMask.y;

			this.btNewComment = new cuboro.ui.TextButton(this.game, loc("bt_new_comment"), true);
			this.btNewComment.on(gf.CLICK, this.onNewComment, this);
			this.btNewComment.x = 500 - this.btNewComment.width - 20;
			this.btNewComment.y = this.contentMask.bottom + cuboro.PADDING;
			this.btNewComment.isEnabled = mUser.isLoggedIn();
			this.addChild(this.btNewComment);

			this.tfNoComments = new gf.display.Text(this.game, loc("comments_empty"), cuboro.TEXT_STYLE_SMALL.clone());
			this.tfNoComments.x = gf.utils.Align.centerX(this.tfNoComments, 500);
			this.tfNoComments.y = gf.utils.Align.centerY(this.tfNoComments, this.contentMask.height);
			this.tfNoComments.visible = false;
			this.addChild(this.tfNoComments);

			mUser.on("loggedIn", this.onLogin, this);
			mUser.on("logout", this.onLogout, this);

			console.log(this);
		}



		protected onLogin(): void
		{
			this.btNewComment.isEnabled = true;
			this.items.forEach((value: cuboro.ui.Comment) =>
			{
				value.btReportAbuse.isEnabled = true;
			});
		}



		protected onLogout(): void
		{
			this.btNewComment.isEnabled = false;
			this.items.forEach((value: cuboro.ui.Comment) =>
			{
				value.btReportAbuse.isEnabled = false;
			});
		}



		protected addItem(value: cuboro.vo.Comment): void
		{
			const comment = new cuboro.ui.Comment(this.game, value);
			comment.wordWrapWidth = this.contentMask.width;
			this.content.addChild(comment);

			this.items.push(comment);
		}



		protected onNewComment(): void
		{
			const comments = this.game.overlays.show(cuboro.overlays.NewComment.NAME);
			comments.once(gf.TRANSITION_OUT, () => this.update(this.track), this);
			comments.trackId = this.track.id;
		}



		protected arrange(): void
		{
			this.tfNoComments.visible = (this.items.length == 0);

			this.content.y = this.contentMask.y;
			let height = 0;

			this.items.forEach((value: cuboro.ui.Comment) =>
			{
				value.y = height;
				height += value.height + cuboro.PADDING * 2;
			});

			this.scrollbar.update(this.content, this.contentMask);
		}



		protected reset(): void
		{
			this.content.removeChildren();
			this.items = [];
		}



		public updateSize(width: number, height: number): void
		{
		}



		public update(track: cuboro.vo.Track): void
		{
			this.track = track;
			this.reset();

			this.game.overlays.show(cuboro.overlays.Loader.NAME);
			sComment.getTrackComment(this.track.id, (comments: cuboro.vo.Comment[]) =>
			{
				this.game.overlays.hide(cuboro.overlays.Loader.NAME);
				comments.forEach((value: cuboro.vo.Comment) =>
				{
					this.addItem(value);
				});
				this.arrange();
			});
		}
	}
}
