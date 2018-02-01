/// <reference path="../ui/selectsetbutton.ts"/>
/// <reference path="overlay.ts"/>



module cuboro.overlays
{
	export class AddSets extends cuboro.overlays.Overlay
	{
		public static readonly NAME: string = "addSets";

		public btAbort: cuboro.ui.TextButton;
		public btAddSets: cuboro.ui.TextButton;

		/**
		 * Is set from the outside (cuboro.ui.BottomMenu)
		 */
		public bottomMenu: cuboro.ui.BottomMenu;
		public content: gf.display.Container;
		public list: gf.display.Container;
		public listMask: gf.display.Sprite;
		public scrollbar: cuboro.ui.Scrollbar;
		public tfSelected: gf.display.Text;

		protected items: cuboro.ui.SelectSetButton[];



		protected init(): void
		{
			super.init();

			this.tfTitle.text = loc("add_sets");

			this.bg.width = 500;
			this.bg.height = 420;

			this.content = new gf.display.Container(this.game);
			this.content.y = this.tfTitle.bottom + cuboro.PADDING * 4;
			this.addChild(this.content);

			this.listMask = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.listMask.width = 456;
			this.content.addChild(this.listMask);

			this.scrollbar = new cuboro.ui.Scrollbar(this.game);
			this.content.addChild(this.scrollbar);

			this.list = new gf.display.Container(this.game);
			this.list.interactive = true;
			this.list.mask = this.listMask;
			this.content.addChild(this.list);

			this.btAbort = new cuboro.ui.TextButton(this.game, loc("bt_abort"), false);
			this.btAbort.on(gf.CLICK, this.onClose, this);
			this.btAbort.y = this.bg.bottom - this.btAbort.height - cuboro.PADDING;
			this.btAbort.autoFit();
			this.addChild(this.btAbort);

			this.btAddSets = new cuboro.ui.TextButton(this.game, loc("bt_add_sets"), true);
			this.btAddSets.on(gf.CLICK, this.onAddSets, this);
			this.btAddSets.y = this.btAbort.y;
			this.btAddSets.autoFit();
			this.addChild(this.btAddSets);

			this.tfSelected = new gf.display.Text(this.game, loc("new_track_selected",
				{
					sets: 0,
					sixpacks: 0
				}), cuboro.TEXT_STYLE_TITLE_TAB.clone());
			this.tfSelected.style.fontFamily = cuboro.DEFAULT_FONT;
			this.tfSelected.style.fontSize = 13;
			this.tfSelected.y = this.btAbort.y + ((this.btAbort.height - this.tfSelected.height) >> 1);
			this.addChild(this.tfSelected);

			this.listMask.height = this.btAbort.y - cuboro.PADDING * 2 - this.content.y;

			this.bg.height = this.btAbort.bottom - this.bg.y + cuboro.PADDING * 4;

			this.addSets();
		}



		protected addSet(value: string): void
		{
			const bt = new cuboro.ui.SelectSetButton(this.game, value);
			bt.on(gf.CHANGE, this.onSet, this);
			this.list.addChild(bt);

			this.items.push(bt);
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

			this.arrange();
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
		}



		protected onAddSets(): void
		{
			this.game.overlays.show(cuboro.overlays.Loader.NAME);

			const cubesToLoad = [];
			this.items.forEach((value: cuboro.ui.SelectSetButton) =>
			{
				if (value.isSelected && mTrack.data.sets.indexOf(value.setName) == -1)
				{
					mTrack.data.sets.push(value.setName);
					this.bottomMenu.cubeList.addSet(value.setName);
					this.bottomMenu.cubeList.sets[value.setName].forEach((cube: any[]) =>
					{
						cubesToLoad.push("cube_" + cube[0]);
					});
				}
			});

			const assetLoader = new cuboro.core.AssetLoader(this.game, this.bottomMenu.gameScreen.playground.assets);
			cubesToLoad.forEach((value: string) => assetLoader.threeJSON(value, "models/" + value + ".json"));
			assetLoader.once(gf.LOAD_COMPLETE, () =>
			{
				this.game.overlays.hide(cuboro.overlays.Loader.NAME);

				this.bottomMenu.cubeList.arrange(this.bottomMenu.cubeList.lastWidth);
				this.bottomMenu.cubeList.updateUsed();
				this.bottomMenu.btAddSets.label = loc("bt_select_sets", {count: mTrack.data.sets.length});

				this.game.overlays.hide(cuboro.overlays.AddSets.NAME);
			});
			assetLoader.start();
		}



		protected arrange(): void
		{
			if (this.items.length == 0) return;

			let itemSize;
			this.list.y = this.listMask.y;

			itemSize = this.items[0].width;

			const width = this.listMask.width;

			let col = 0;
			let row = 0;

			const cols = Math.floor(width / (itemSize + cuboro.PADDING));

			this.items.forEach((value: cuboro.ui.SelectSetButton) =>
			{
				if (col == cols)
				{
					row++;
					col = 0;
				}
				value.x = col * itemSize + col * cuboro.PADDING * 2;
				value.y = row * itemSize + row * cuboro.PADDING;

				col++;
			});

			this.scrollbar.x = cols * itemSize + cols * (cuboro.PADDING * 2);

			this.listMask.width = this.scrollbar.x;

			this.scrollbar.update(this.list, this.listMask, 0);
			this.scrollbar.visible = this.scrollbar.sizeScroll > this.scrollbar.sizeVisible;
		}



		protected onClose(): void
		{
			track("AddSets-Close");
			this.game.overlays.hide(cuboro.overlays.AddSets.NAME);
		}



		public onResize(): void
		{
			super.onResize();

			this.content.x =
				this.btAbort.x = this.bg.x + 22;

			this.btAddSets.x = this.bg.right - this.btAddSets.width - 22;
			this.tfSelected.x = this.btAbort.right + cuboro.PADDING * 2;
		}



		public transitionIn(): void
		{
			super.transitionIn();

			this.items.forEach((bt: cuboro.ui.SelectSetButton) =>
			{
				bt.isSelected = false;
			});

			mTrack.data.sets.forEach((setName: string) =>
			{
				this.items.forEach((bt: cuboro.ui.SelectSetButton) =>
				{
					if (bt.setName == setName)
					{
						bt.isSelected = true;
						bt.isEnabled = false;
					}
				});
			});

			this.onSet();
		}
	}
}
