/// <reference path="cubelistitem.ts"/>
/// <reference path="packshotlistitem.ts"/>
/// <reference path="scrollbar.ts"/>



module cuboro.ui
{
	export class PackshotList extends gf.display.Container
	{
		protected dragStart: PIXI.Point;
		protected scrollEnd: number;
		protected items: cuboro.ui.PackshotListItem[];
		protected sets: { [key: string]: any[][] };

		public currentItem: cuboro.ui.PackshotListItem;
		public bottomMenu: cuboro.ui.BottomMenu;
		public list: gf.display.Container;
		public listMask: gf.display.Sprite;
		public scrollbar: cuboro.ui.Scrollbar;



		constructor(bottomMenu: cuboro.ui.BottomMenu)
		{
			super(bottomMenu.game);

			this.bottomMenu = bottomMenu;

			this.interactive = true;
			this.items = [];
			this.scrollEnd = 0;

			this.listMask = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.listMask.width = 80;
			this.listMask.height = 135;
			this.addChild(this.listMask);

			this.scrollbar = new cuboro.ui.Scrollbar(this.game);
			this.addChild(this.scrollbar);

			this.list = new gf.display.Container(this.game);
			this.list.interactive = true;
			this.list.mask = this.listMask;
			this.addChild(this.list);

			this.sets = this.game.cache.getJSON("sets");
		}



		protected selectItem(item: cuboro.ui.PackshotListItem): void
		{
			if (this.currentItem)
				this.currentItem.isSelected = false;

			if (this.currentItem == item)
			{
				this.currentItem = null;
				this.bottomMenu.gameScreen.playground.placeables.hide();
			}
			else
			{
				this.currentItem = item;
				this.bottomMenu.gameScreen.playground.placeables.show();
			}

			this.bottomMenu.gameScreen.playground.cubes.selected = null;
		}



		protected onItemClick(item: cuboro.ui.PackshotListItem): void
		{
			this.selectItem(item);
		}



		public addItem(id: string): void
		{
			let item = new cuboro.ui.PackshotListItem(this, id);
			item.on(gf.CLICK, () => this.onItemClick(item), this);
			this.list.addChild(item);

			this.items.push(item);

			this.arrange();
		}



		public deselectItems(): void
		{
			if (this.currentItem)
				this.currentItem.isSelected = false;

			this.currentItem = null;
		}



		/**
		* Rearrange items
		*/
		public arrange(): void
		{
			if (this.items.length == 0) return;

			this.list.y = 0;

			this.items.forEach((value: cuboro.ui.PackshotListItem, index: number) =>
			{
				value.y = index * 65 + index * cuboro.PADDING;
			});

			this.scrollbar.update(this.list, this.listMask, cuboro.PADDING);
			this.scrollbar.visible = this.scrollbar.sizeScroll > this.scrollbar.sizeVisible;
		}



		public reset(): void
		{
			this.list.removeChildren();
			this.items = [];
		}
	}
}
