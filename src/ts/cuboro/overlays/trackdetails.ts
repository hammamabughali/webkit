/// <reference path="../overlays/overlay.ts"/>
/// <reference path="../ui/tabs.ts"/>
/// <reference path="../ui/tabs/comments.ts"/>
/// <reference path="../ui/tabs/history.ts"/>
/// <reference path="../ui/tabs/scores.ts"/>
/// <reference path="../ui/tabs/share.ts"/>
/// <reference path="../ui/textbutton.ts"/>
/// <reference path="../ui/trackinfo.ts"/>
/// <reference path="../ui/trackpreview.ts"/>



module cuboro.overlays
{
	export class TrackDetails extends cuboro.overlays.Overlay
	{
		public static readonly NAME: string = "trackDetails";

		public btDuplicate: cuboro.ui.TextButton;
		public btDelete: cuboro.ui.TextButton;
		public btLoad: cuboro.ui.TextButton;
		public btUnpublish: cuboro.ui.TextButton;
		public star: gf.display.Sprite;
		public tabs: cuboro.ui.Tabs;
		public tabComments: cuboro.ui.tabs.Comments;
		public tabHistory: cuboro.ui.tabs.History;
		public tabScores: cuboro.ui.tabs.Scores;
		public tabShare: cuboro.ui.tabs.Share;
		public trackInfo: cuboro.ui.TrackInfo;
		public trophy: gf.display.Sprite;

		protected _track: cuboro.vo.Track;



		protected init(): void
		{
			super.init();

			this.tfTitle.text = loc("tab_track_details");

			this.trackInfo = new cuboro.ui.TrackInfo(this.game);
			this.trackInfo.y = this.tfTitle.bottom + cuboro.PADDING * 2;
			this.addChild(this.trackInfo);

			this.tabScores = new cuboro.ui.tabs.Scores(this.game);
			this.tabHistory = new cuboro.ui.tabs.History(this.game);
			this.tabComments = new cuboro.ui.tabs.Comments(this.game);
			this.tabShare = new cuboro.ui.tabs.Share(this.game);

			this.tabs = new cuboro.ui.Tabs(this.game);
			this.tabs.maxWidth = 500;
			this.tabs.isSmall = true;
			this.tabs.sameWidth = false;
			this.tabs.spacing = cuboro.PADDING;
			this.tabs.add(this.tabScores, loc("bt_track_scores"));
			this.tabs.add(this.tabHistory, loc("bt_track_history"));
			this.tabs.add(this.tabComments, loc("bt_track_comments"));
			this.tabs.add(this.tabShare, loc("bt_track_share"));
			this.tabs.y = this.trackInfo.bottom + cuboro.PADDING * 2;
			this.tabs.current = this.tabScores;
			this.tabs.updateSize(500, 215);
			this.tabs.on(gf.CHANGE, this.onTab, this);
			this.addChild(this.tabs);

			this.btDuplicate = new cuboro.ui.TextButton(this.game, loc("bt_track_duplicate"), false);
			this.btDuplicate.on(gf.CLICK, this.onDuplicate, this);
			this.btDuplicate.y = this.tabs.bottom + cuboro.PADDING * 2;
			this.addChild(this.btDuplicate);

			this.btDelete = new cuboro.ui.TextButton(this.game, loc("bt_track_delete"), false);
			this.btDelete.on(gf.CLICK, this.onDelete, this);
			this.btDelete.y = this.btDuplicate.y;
			this.addChild(this.btDelete);

			this.btUnpublish = new cuboro.ui.TextButton(this.game, loc("bt_track_unpublish"), false);
			this.btUnpublish.on(gf.CLICK, this.onUnpublish, this);
			this.btUnpublish.y = this.btDuplicate.y;
			this.addChild(this.btUnpublish);

			this.btLoad = new cuboro.ui.TextButton(this.game, loc("bt_track_load"), true);
			this.btLoad.on(gf.CLICK, this.onLoad, this);
			this.btLoad.y = this.btDuplicate.y;
			this.addChild(this.btLoad);

			this.bg.width = 500;
			this.bg.height = 480;
		}



		protected onTab(tab: cuboro.ui.tabs.Tab): void
		{
			switch (tab)
			{
				case this.tabComments:
					this.tabComments.update(this._track);
					break;

				case this.tabHistory:
					this.tabHistory.update(this._track);
					break;

				case this.tabScores:
					break;

				case this.tabShare:
					this.tabShare.update(this._track);
					this.tabShare.show();
					break;
			}

			if (tab != this.tabShare)
				this.tabShare.hide();

			this.btDuplicate.visible =
				this.btDelete.visible =
					this.btUnpublish.visible =
						this.btLoad.visible = tab == this.tabScores;
		}



		protected onDuplicate(): void
		{
			cuboro.core.Loader.loadTrack(this.game, this._track, true);
			this.game.overlays.hide(cuboro.overlays.TrackDetails.NAME);
		}



		protected onUnpublish(): void
		{
			this.game.overlays.show(cuboro.overlays.Loader.NAME);

			sTrack.unpublish(this._track.id, (status: string) =>
			{
				this.game.overlays.hide(cuboro.overlays.Loader.NAME);

				if (status == kr3m.SUCCESS)
				{
					this.update();
					this.reloadGallery();
					const message = this.game.overlays.show(cuboro.overlays.Message.NAME);
					message.text = loc("track_unpublished");
				}
				else
				{
					const message = this.game.overlays.show(cuboro.overlays.Message.NAME);
					message.text = loc("error_track_unpublish");
				}
			});
		}



		protected reloadGallery(): void
		{
			if (this.game.screens.currentName != cuboro.screens.Start.NAME) return;

			const startScreen = this.game.screens.current;
			startScreen.tabGallery.getPage(startScreen.tabGallery.galleryFilters);
		}



		protected onDelete(): void
		{
			this.game.overlays.show(cuboro.overlays.Loader.NAME);

			sTrack.delete(this._track.id, (status: string) =>
			{
				this.game.overlays.hide(cuboro.overlays.Loader.NAME);

				if (status == kr3m.SUCCESS)
				{
					this.game.overlays.hide(cuboro.overlays.TrackDetails.NAME);
					this.reloadGallery();
				}
				else
				{
					const message = this.game.overlays.show(cuboro.overlays.Message.NAME);
					message.text = loc("error_delete_track");
				}
			});
		}



		protected onLoad(): void
		{
			cuboro.core.Loader.loadTrack(this.game, this._track, false);
			this.game.overlays.hide(cuboro.overlays.TrackDetails.NAME);
		}



		protected onClose(): void
		{
			this.game.overlays.hide(cuboro.overlays.TrackDetails.NAME);
		}



		public update(): void
		{
			if (!this.visible) return;

			this.trackInfo.update(this._track);
			this.tabScores.update(this._track);
			this.btUnpublish.isEnabled = false;

			this.btDelete.isEnabled = (mUser.isLoggedIn() && this._track.owner.id == mUser.getUserId());
			if (this.btDelete.isEnabled)
			{
				this.game.overlays.show(cuboro.overlays.Loader.NAME);
				sTrack.isPublished(this._track.id, (response: boolean) =>
				{
					this.game.overlays.hide(cuboro.overlays.Loader.NAME);
					if (response)
					{
						this.btDelete.isEnabled = false;
						this.btUnpublish.isEnabled = true;
					}
				});
			}

			this.trackInfo.tfValues.x = this.trackInfo.tfTitles.right + cuboro.PADDING;
		}



		public transitionIn(): void
		{
			super.transitionIn();

			this.tabs.current = this.tabScores;
		}



		public transitionOut(): void
		{
			super.transitionOut();

			this.tabShare.hide();
		}



		public onResize(): void
		{
			super.onResize();

			this.btDuplicate.x =
				this.trackInfo.x = this.bg.x + 20;

			this.tabs.x = this.bg.x;

			this.btDelete.x = this.btDuplicate.right + cuboro.PADDING;
			this.btUnpublish.x = this.btDelete.right + cuboro.PADDING;
			this.btLoad.x = this.bg.right - this.btLoad.width - 20;
		}



		public get track(): cuboro.vo.Track
		{
			return this._track;
		}



		public set track(value: cuboro.vo.Track)
		{
			this._track = value;

			this.update();
		}
	}
}
