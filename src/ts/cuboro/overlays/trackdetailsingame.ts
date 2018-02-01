/// <reference path="trackdetails.ts"/>



module cuboro.overlays
{
	export class TrackDetailsIngame extends cuboro.overlays.TrackDetails
	{
		public static readonly NAME: string = "trackDetailsIngame";



		protected init(): void
		{
			super.init();

			this.btDuplicate.visible = false;
			this.btDelete.visible = false;
			this.btLoad.visible = false;
		}



		protected onTab(tab: cuboro.ui.tabs.Tab): void
		{
			switch (tab)
			{
				case this.tabComments:
					this.tabComments.update(mTrack);
					break;

				case this.tabHistory:
					this.tabHistory.update(mTrack);
					break;

				case this.tabScores:
					break;

				case this.tabShare:
					this.tabShare.update(mTrack);
					this.tabShare.show();
					break;
			}

			if (tab != this.tabShare)
				this.tabShare.hide();

			this.btUnpublish.visible = tab == this.tabScores;
		}



		protected onClose(): void
		{
			this.game.overlays.hide(cuboro.overlays.TrackDetailsIngame.NAME);
		}



		public update(): void
		{
			this._track = mTrack;

			this.trackInfo.update(mTrack);
			this.tabScores.update(mTrack);

			this.btUnpublish.isEnabled = false;
			if (mUser.isLoggedIn() && mTrack.owner.id == mUser.getUserId())
			{
				this.game.overlays.show(cuboro.overlays.Loader.NAME);
				sTrack.isPublished(mTrack.id, (response: boolean) =>
				{
					this.game.overlays.hide(cuboro.overlays.Loader.NAME);
					if (response)
					{
						this.btUnpublish.isEnabled = true;
					}
				});
			}

			this.trackInfo.tfValues.x = this.trackInfo.tfTitles.right + cuboro.PADDING;
			this.onTab(this.tabScores);
		}



		public onResize(): void
		{
			super.onResize();

			this.btUnpublish.x = this.bg.x + 20;
		}



		public transitionIn(): void
		{
			super.transitionIn();

			this.update();

			this.tabs.getTabButtonByContent(this.tabComments).isEnabled =
				this.tabs.getTabButtonByContent(this.tabHistory).isEnabled =
					this.tabs.getTabButtonByContent(this.tabShare).isEnabled = !!mTrack.id;
		}
	}
}
