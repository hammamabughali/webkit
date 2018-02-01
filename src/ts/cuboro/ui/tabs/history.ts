/// <reference path="../historyitem.ts"/>
/// <reference path="../tabs/tab.ts"/>



module cuboro.ui.tabs
{
	export class History extends cuboro.ui.tabs.Tab
	{
		protected items: cuboro.ui.HistoryItem[];

		public iconPredecessor: gf.display.Sprite;
		public iconSuccessor: gf.display.Sprite;
		public tfPredecessor: gf.display.Text;
		public tfSuccessor: gf.display.Text;
		public track: cuboro.vo.Track;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.iconPredecessor = new gf.display.Sprite(this.game, "sprites", "icon_predecessor");
			this.iconPredecessor.tint = cuboro.COLOR_DARK_GREY;
			this.iconPredecessor.x = 20;
			this.addChild(this.iconPredecessor);

			this.tfPredecessor = new gf.display.Text(this.game, loc("track_predecessor"), cuboro.TEXT_STYLE_SMALL.clone());
			this.tfPredecessor.x = this.iconPredecessor.right + cuboro.PADDING;
			this.tfPredecessor.y = (this.iconPredecessor.height - this.tfPredecessor.height) >> 1;
			this.addChild(this.tfPredecessor);

			this.iconSuccessor = new gf.display.Sprite(this.game, "sprites", "icon_successor");
			this.iconSuccessor.tint = cuboro.COLOR_DARK_GREY;
			this.iconSuccessor.x = this.tfPredecessor.right + cuboro.PADDING * 4;
			this.addChild(this.iconSuccessor);

			this.tfSuccessor = new gf.display.Text(this.game, loc("track_successor"), cuboro.TEXT_STYLE_SMALL.clone());
			this.tfSuccessor.x = this.iconSuccessor.right + cuboro.PADDING;
			this.tfSuccessor.y = this.tfPredecessor.y;
			this.addChild(this.tfSuccessor);

			this.contentMask.width = 480 - this.scrollbar.width - 20;
			this.contentMask.x = 20;
			this.contentMask.y = this.iconPredecessor.bottom + cuboro.PADDING;
			this.contentMask.height = 180 - this.contentMask.y + 27 + cuboro.PADDING;

			this.scrollbar.y = this.contentMask.y;

			this.content.x = this.contentMask.x;
			this.content.y = this.contentMask.y;
		}



		protected arrange(): void
		{
			this.content.y = this.contentMask.y;

			this.items.forEach((value: cuboro.ui.HistoryItem, index: number) =>
			{
				value.y = index * value.height + index * cuboro.PADDING;
			});

			this.scrollbar.update(this.content, this.contentMask);
		}



		protected reset(): void
		{
			this.content.removeChildren();
			this.items = [];
		}



		protected addItem(track: cuboro.vo.Track, type: string): void
		{
			const item = new cuboro.ui.HistoryItem(this.game, track, type);
			this.content.addChild(item);

			this.items.push(item);
		}



		public updateSize(width: number, height: number): void
		{
		}



		public update(track: cuboro.vo.Track): void
		{
			this.track = track;

			this.reset();

			this.game.overlays.show(cuboro.overlays.Loader.NAME);

			sTrack.getHistory(this.track.id, (response: cuboro.vo.History) =>
			{
				this.game.overlays.hide(cuboro.overlays.Loader.NAME);

				response.previousTracks.forEach((value: cuboro.vo.Track) =>
				{
					this.addItem(value, cuboro.HISTORY.PREDECESSOR);
				});

				this.addItem(this.track, cuboro.HISTORY.CURRENT);

				response.forwardTracks.forEach((value: cuboro.vo.Track) =>
				{
					this.addItem(value, cuboro.HISTORY.SUCCESSOR);
				});

				this.arrange();
			});
		}
	}
}
