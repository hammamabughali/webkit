/// <reference path="../createbutton.ts"/>
/// <reference path="../selectsetbutton.ts"/>
/// <reference path="../tabs/tab.ts"/>



module cuboro.ui.tabs
{
	export class Create extends cuboro.ui.tabs.Tab
	{
		public btCreateNewTrack: cuboro.ui.TextButton;
		public tfSelected: gf.display.Text;

		protected items: cuboro.ui.SelectSetButton[];



		constructor(game: gf.core.Game)
		{
			super(game);

			this.content.x =
				this.contentMask.x = cuboro.PADDING;

			this.content.y =
				this.contentMask.y = cuboro.PADDING * 2;

			this.btCreateNewTrack = new cuboro.ui.TextButton(this.game, loc("bt_create_track"), true);
			this.btCreateNewTrack.on(gf.CLICK, this.onCreateTrack, this);
			this.btCreateNewTrack.autoFit();
			this.addChild(this.btCreateNewTrack);

			this.tfSelected = new gf.display.Text(this.game, loc("new_track_selected",
				{
					sets: 0,
					sixpacks: 0
				}), cuboro.TEXT_STYLE_TITLE_TAB.clone());
			this.tfSelected.style.fontSize = 13;
			this.tfSelected.x = cuboro.PADDING;
			this.addChild(this.tfSelected);

			this.addSets();
		}



		protected addSet(value: string): void
		{
			const bt = new cuboro.ui.SelectSetButton(this.game, value);
			bt.on(gf.CHANGE, this.onSet, this);
			this.content.addChild(bt);

			this.items.push(bt);
		}



		protected onSet(): void
		{
			let sets = 0;
			let sixpacks = 0;

			this.items.forEach((value: cuboro.ui.SelectSetButton) =>
			{
				if (value.isSelected)
				{
					if (value.setName.indexOf("sixpack") != -1)
						sixpacks++;
					else
						sets++;
				}
			});

			this.tfSelected.text = loc("new_track_selected", {sets: sets, sixpacks: sixpacks});
			this.btCreateNewTrack.isEnabled = sets + sixpacks > 0;
		}



		protected addSets(): void
		{
			this.items = [];

			const setOrder = [cuboro.SETS.STANDARD,
				cuboro.SETS.BASIC,
				cuboro.SETS.BUILD,
				cuboro.SETS.DUO,
				cuboro.SETS.METRO,
				cuboro.SETS.MULTI,
				cuboro.SETS.PLUS,
				cuboro.SETS.PROFI,
				cuboro.SETS.SIXPACK_DUO,
				cuboro.SETS.SIXPACK_PROFI,
				cuboro.SETS.SIXPACK_METRO,
				cuboro.SETS.SIXPACK_MULTI,
				cuboro.SETS.SIXPACK_PLUS];

			setOrder.forEach((value: string) =>
			{
				this.addSet(value);
			});

			this.onResize();
		}



		protected onCreateTrack(): void
		{
			let selectedSets = [];

			this.items.forEach((value: cuboro.ui.SelectSetButton) =>
			{
				if (value.isSelected)
					selectedSets.push(value.setName);
			});

			if (selectedSets.length > 0)
			{
				mTrack = new cuboro.vo.Track();
				mTrack.data.sets = selectedSets;

				if (mUser.isLoggedIn())
					mTrack.owner = mUser.getUser();

				this.game.overlays.show(cuboro.overlays.Loader.NAME);

				sTrack.generateUniqueRandomName(loc("trackname_prefix"), (response: string) =>
				{
					this.game.overlays.hide(cuboro.overlays.Loader.NAME);
					mTrack.name = response;
					cuboro.core.Loader.loadTrack(this.game, mTrack, false);
				});
			}
		}



		public reset(): void
		{
			this.items.forEach((value: cuboro.ui.SelectSetButton) =>
			{
				value.isSelected = false;
			});

			this.tfSelected.text = loc("new_track_selected", {sets: 0, sixpacks: 0});
			this.btCreateNewTrack.isEnabled = false;
		}



		public arrange(): void
		{
			if (this.items.length == 0) return;

			let itemSize;

			itemSize = this.items[0].width;

			const width = this.contentMask.width - (this.scrollbar.width + cuboro.PADDING * 2);

			let col = 0;
			let row = 0;

			const cols = Math.min(Math.floor(width / (itemSize + cuboro.PADDING)), 5);
			const offsetX = (this.contentMask.width - (cols * itemSize + cols * cuboro.PADDING * 2)) >> 1;

			this.items.forEach((value: cuboro.ui.SelectSetButton) =>
			{
				if (col == cols)
				{
					row++;
					col = 0;
				}
				value.x = col * itemSize + col * cuboro.PADDING * 2 + offsetX;
				value.y = row * itemSize + row * cuboro.PADDING;

				col++;
			});

			this.bounds.width = this.contentMask.width;
			this.bounds.height = row * itemSize + row * cuboro.PADDING + itemSize;

			this.scrollbar.update(this.content, this.contentMask, 0);

			if (!this.scrollbar.visible)
				this.content.y = (this.contentMask.height - this.content.height) >> 1;
			else
				this.content.y = this.contentMask.y;
		}



		public updateSize(width: number, height: number): void
		{
			super.updateSize(width - this.scrollbar.width - cuboro.PADDING * 2, height - cuboro.PADDING * 4 - this.btCreateNewTrack.height);

			this.onResize();
		}



		public show(): void
		{
			super.show();

			this.onSet();

			if (!this.scrollbar.visible)
				this.content.y = (this.contentMask.height - this.content.height) >> 1;
			else
				this.content.y = this.contentMask.y;
		}



		public onResize(): void
		{
			super.onResize();

			this.btCreateNewTrack.x = this.btCreateNewTrack.x = (this.game.width - this.btCreateNewTrack.width) >> 1;
			this.btCreateNewTrack.y = this.contentMask.bottom + cuboro.PADDING;
			this.tfSelected.y = this.btCreateNewTrack.y + ((this.btCreateNewTrack.height - this.tfSelected.height) >> 1);

			this.arrange();
		}
	}
}
