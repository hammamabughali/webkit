/// <reference path="../overlays/overlay.ts"/>
/// <reference path="../ui/button.ts"/>



module gf.overlays
{
	export class Episodes extends gf.overlays.Overlay
	{
		public static NAME = "episodes";

		public btBack: gf.ui.Button;
		public btInvite: gf.ui.Button;



		protected init(): void
		{
		}



		protected addBtInvite(): void
		{
			if (this.btInvite)
				this.btInvite.on(gf.CLICK, this.onInvite, this);
		}



		protected addBtBack(): void
		{
			if (this.btBack)
				this.btBack.on(gf.CLICK, this.onBack, this);
		}



		protected onBack(): void
		{
			track("Episodes-Back");
			this.game.overlays.hide(this.name);
		}



		protected onCounter(): void
		{
		}



		protected onInvite(): void
		{
			track({eventAction: "Episodes-Invite", eventLabel: "CAS"});

			let episode: gf.vo.EpisodeVO = this.game.episodes.next;
			if (!episode) return;

			if (this.game.user.isLoggedIn)
			{
				this.game.overlays.show("loader");

				let options = new cas.vo.RequestOptions();
				options.receiverHeadline = loc("episodes_receiver_headline", {episode: episode.id});
				options.receiverMessage = loc("episodes_receiver_message",
					{
						episode: episode.id,
						name: this.game.user.name
					});
				options.senderMessage = loc("episodes_sender_message",
					{
						message: options.receiverMessage,
						episode: episode.id
					});
				options.acceptedMessage = loc("episodes_accepted_message", {episode: episode.id});
				options.imageUrl = this.game.client.config.ogUrl + "/img/cas_episode.png";
				options.customData =
					{
						type: gf.REQUEST_EPISODE,
						episode: episode.id,
						user:
							{
								id: this.game.user.id,
								imageUrl: this.game.user.imageUrl,
								name: this.game.user.name
							}
					};

				casClient.ui.showRequestDialog(options, () => this.game.overlays.hide("loader"));
			}
			else
			{
				this.game.user.login(() =>
				{
					if (this.game.user.isLoggedIn) this.onInvite();
				});
			}
		}



		protected onUser(user: any, index: number): void
		{
		}



		public update(episode: number): void
		{
			this.game.episodes.startActivationCountdown(episode);
			const users: any[] = this.game.episodes.getActivationsByEpisode(episode);

			if (users && users.length > 0)
			{
				users.forEach((user: any, index: number) => this.onUser(user, index));
			}
		}



		public transitionIn(): void
		{
			super.transitionIn();

			this.game.episodes.on(gf.model.COOLDOWN_CHANGE, this.onCounter, this);
			this.game.episodes.on(gf.model.COOLDOWN_COMPLETE, this.onCounter, this);
			this.onCounter();
		}



		public transitionOutComplete(): void
		{
			super.transitionOutComplete();

			this.game.episodes.off(gf.model.COOLDOWN_CHANGE, this.onCounter, this);
			this.game.episodes.off(gf.model.COOLDOWN_COMPLETE, this.onCounter, this);
		}
	}
}
