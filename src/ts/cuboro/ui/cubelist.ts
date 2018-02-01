/// <reference path="cubelistitem.ts"/>
/// <reference path="scrollbar.ts"/>



module cuboro.ui
{
	export class CubeList extends gf.display.Container
	{
		private _dragDistance: number;
		private _dragStart: number;
		private _isDragging: boolean;
		private _minY: number;
		private _startY: number;
		private _total: number;

		protected dragStart: PIXI.Point;
		protected scrollEnd: number;
		protected items: cuboro.ui.CubeListItem[];
		protected itemSpawned: boolean;

		public bounds: gf.display.Sprite;
		public currentItem: cuboro.ui.CubeListItem;
		public bottomMenu: cuboro.ui.BottomMenu;
		public lastWidth: number;
		public list: gf.display.Container;
		public listMask: gf.display.Sprite;
		public scrollbar: cuboro.ui.Scrollbar;
		public sets: { [key: string]: any[][] };



		constructor(bottomMenu: cuboro.ui.BottomMenu)
		{
			super(bottomMenu.game);

			this.bottomMenu = bottomMenu;

			this.interactive = true;
			this.items = [];
			this.scrollEnd = 0;
			this._total = 0;

			this.listMask = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.listMask.height = 135;
			this.addChild(this.listMask);

			this.scrollbar = new cuboro.ui.Scrollbar(this.game);
			this.scrollbar.on(gf.UPDATE, this.onScrollbar, this);
			this.addChild(this.scrollbar);

			this.list = new gf.display.Container(this.game);
			this.list.interactive = true;
			this.list.mask = this.listMask;
			this.addChild(this.list);

			this.bounds = new gf.display.Sprite(this.game, PIXI.Texture.EMPTY);
			this.bounds.on("touchstart mousedown", this.onDown, this);
			this.bounds.interactive = true;
			this.list.addChild(this.bounds);

			this.sets = this.game.cache.getJSON("sets");
		}



		protected onScrollbar(): void
		{
			this.bounds.width =
				this.bounds.height = 1;
			this._minY = this.listMask.y - this.list.height + this.listMask.height;
			this.bounds.width = this.listMask.width;
			this.bounds.height = this.scrollbar.sizeScroll;
		}



		protected onDown(e: PIXI.interaction.InteractionEvent): void
		{
			if (this._isDragging) return;
			if (!this.scrollbar.visible) return;

			this.on("mouseup mouseupoutside touchend touchendoutside", this.onUp, this);

			this._dragDistance = 0;

			this.onMove(e);
		}



		protected onMove(e: PIXI.interaction.InteractionEvent): void
		{
			if (this._isDragging)
			{
				const py: number = e.data.global.y - this._dragStart;
				this.list.y = Math.min(this.listMask.y, Math.max(this._minY, this._startY + py));
				this.scrollbar.updateToContentPosition();
			}
			else
			{
				this._isDragging = true;

				this._dragStart = e.data.global.y;
				this._startY = this.list.y;

				this.on("mousemove touchmove", this.onMove, this);

				this.emit(gf.DRAG_START);
			}
		}



		protected onUp(): void
		{
			if (this._isDragging)
			{
				this._isDragging = false;
				this.removeAllListeners("mousemove mouseup mouseupoutside touchmove touchend touchendoutside");
			}
		}



		protected selectItem(item: cuboro.ui.CubeListItem): void
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



		protected onItemClick(e: PIXI.interaction.InteractionEvent): void
		{
			const item = e.currentTarget as cuboro.ui.CubeListItem;
			const playground = this.bottomMenu.gameScreen.playground;

			if (item.remaining === 0) return;

			if (playground.cubes.swapping)
			{
				this.deselectItems();

				const cubeDeleteId = playground.cubes.selected.id;
				const cube = new cuboro.core.Cube(playground, item.key);
				playground.cubes.swap(cube);
				playground.cubes.remove(playground.cubes.getById(cubeDeleteId));
				playground.cubes.selected = cube;
				item.remaining--;
			}
			else
			{
				if (item.isSelected)
				{
					this.deselectItems();
				}
				else
				{
					item.isSelected = true;
					this.bottomMenu.gameScreen.moveMenu.hide();
					this.bottomMenu.gameScreen.rotateMenu.hide();
				}

				this.selectItem(item);
			}
		}



		protected onItemDown(e: PIXI.interaction.InteractionEvent): void
		{
			const item = e.currentTarget as cuboro.ui.CubeListItem;

			if (item.remaining > 0)
			{
				this.dragStart = e.data.global.clone();
				item.on("mousemove touchmove", (e) => this.onItemMove(e));
			}
		}



		protected onItemMove(e: PIXI.interaction.InteractionEvent): void
		{
			const item = e.currentTarget as cuboro.ui.CubeListItem;

			if (!this.itemSpawned && gf.utils.Maths.distance(this.dragStart, e.data.global) > 10)
			{
				item.remaining--;
				this.itemSpawned = true;
				this.selectItem(item);
				this.bottomMenu.gameScreen.playground.cubes.selected = null;
				this.bottomMenu.gameScreen.playground.select.spawnCube(e.data.originalEvent, item.key);
			}
		}



		protected onItemUp(e: PIXI.interaction.InteractionEvent): void
		{
			const item = e.currentTarget as cuboro.ui.CubeListItem;
			item.removeAllListeners("mousemove touchmove");
			this.itemSpawned = false;
		}



		public addItem(id: string, count: number, index: number): void
		{
			let item = this.getItemById(id);

			if (!item)
			{
				item = new cuboro.ui.CubeListItem(this, id, count, index);
				item.on(gf.CLICK, this.onItemClick, this);
				item.on(gf.DOWN, this.onItemDown, this);
				item.on(gf.UP, this.onItemUp, this);
				this.list.addChild(item);

				this.items.push(item);
			}
			else
			{
				item.count += count;
				item.remaining += count;
			}

			this._total += count;
		}



		public addSet(name: string): void
		{
			this.sets[name].forEach((value: any[]) =>
			{
				this.addItem(value[0], value[1], value[2]);
			});
		}



		public deselectItems(): void
		{
			if (this.currentItem)
				this.currentItem.isSelected = false;

			this.currentItem = null;

			this.bottomMenu.gameScreen.playground.placeables.hide();
		}



		public getItems(): cuboro.ui.CubeListItem[]
		{
			return this.items;
		}



		public getItemByKey(key: string): cuboro.ui.CubeListItem
		{
			let item: cuboro.ui.CubeListItem = null;

			this.items.forEach((value: cuboro.ui.CubeListItem) =>
			{
				if (value.key === key)
				{
					item = value;
					return true;
				}
			});

			return item;
		}



		public getItemById(id: string): cuboro.ui.CubeListItem
		{
			let item: cuboro.ui.CubeListItem = null;

			this.items.forEach((value: cuboro.ui.CubeListItem) =>
			{
				if (value.id === id)
				{
					item = value;
					return true;
				}
			});

			return item;
		}



		public updateUsed(): void
		{
			let remaining = 0;

			this.items.forEach((value: cuboro.ui.CubeListItem) =>
			{
				remaining += value.remaining;
			});

			this.used = this.total - remaining;
		}



		/**
		 * Rearrange items for the given height and cols
		 * @param {number} width
		 */
		public arrange(width: number): void
		{
			if (this.items.length == 0) return;

			this.items.sort((a, b) => (a.index < b.index) ? -1 : 1);

			this.lastWidth = width;
			this.bounds.height = 1;

			let itemSize;
			this.list.y = this.listMask.y;

			itemSize = this.items[0].width;

			width -= this.scrollbar.width + cuboro.PADDING * 2;

			let col = 0;
			let row = 0;

			const cols = Math.floor(width / (itemSize + cuboro.PADDING));

			this.items.forEach((value: cuboro.ui.CubeListItem) =>
			{
				if (col == cols)
				{
					row++;
					col = 0;
				}
				value.x = col * itemSize + col * cuboro.PADDING;
				value.y = row * itemSize + row * cuboro.PADDING;
				value.isEnabled = value.remaining > 0;

				col++;
			});

			this.scrollbar.x = cols * itemSize + cols * cuboro.PADDING;

			this.listMask.width = this.scrollbar.x;
			this.bounds.width = this.listMask.width;
			this.bounds.height = this.list.height;

			this.scrollbar.update(this.list, this.listMask, 0);
			this.scrollbar.visible = this.scrollbar.sizeScroll > this.scrollbar.sizeVisible;
		}



		public reset(): void
		{
			this.list.removeChildren();
			this.list.y = this.listMask.y;
			this.list.addChild(this.bounds);

			this.items = [];

			this._total = 0;
		}



		public get total(): number
		{
			return this._total;
		}



		public set used(value: number)
		{
			this.game.stage.header.trackMenu.updateCubesUsed(this._total, value);
		}
	}
}
