/// <reference path="tabbutton.ts"/>
/// <reference path="tabs/tab.ts"/>



module cuboro.ui
{
	export class Tabs extends gf.display.Container
	{
		protected _current: cuboro.ui.tabs.Tab;
		protected _tabs: cuboro.ui.tabs.Tab[];
		protected _tabButtons: cuboro.ui.TabButton[];

		public maxWidth: number;
		public isSmall: boolean;
		public sameWidth: boolean;
		public size: PIXI.Point;
		public spacing: number;
		public tabButtons: gf.display.Container;
		public tabContent: gf.display.Container;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.interactive = true;

			this.isSmall = false;
			this.sameWidth = true;
			this.spacing = 0;
			this.maxWidth = this.game.width;

			this._tabs = [];
			this._tabButtons = [];

			this.tabButtons = new gf.display.Container(this.game);
			this.tabButtons.interactive = true;
			this.addChild(this.tabButtons);

			this.tabContent = new gf.display.Container(this.game);
			this.tabContent.interactive = true;
			this.tabContent.y = 40;
			this.addChild(this.tabContent)
		}



		protected onTabButton(tabButton: cuboro.ui.TabButton): void
		{
			if (tabButton.isSelected) return;
			this.current = tabButton.tab;
		}



		protected resizeTabButtons(): void
		{
			if (this.sameWidth)
			{
				const buttonWidth = (this.maxWidth - ((this._tabButtons.length - 1) * this.spacing)) / this._tabButtons.length;
				let x = 0;

				this._tabButtons.forEach((value: cuboro.ui.TabButton) =>
				{
					value.bg.width = buttonWidth;
					value.x = x;
					x += buttonWidth + this.spacing;
				});
			}
			else
			{
				let x = 0;
				this._tabButtons.forEach((value: cuboro.ui.TabButton) =>
				{
					value.bg.width = value.tfLabel.width + 40;
					value.x = x;
					x += value.tfLabel.width + 40 + this.spacing;
				});
			}
		}



		public add(tab: cuboro.ui.tabs.Tab, btLabel?: string): void
		{
			if (btLabel)
			{
				const bt = new cuboro.ui.TabButton(this.game, btLabel);
				bt.on(gf.CLICK, () => this.onTabButton(bt));
				bt.tab = tab;

				if (this.isSmall)
				{
					bt.bg.height = 27;
					bt.tfLabel.style.fontSize = 13;
					bt.tfLabel.y = 6;
				}

				this.tabButtons.addChild(bt);

				this._tabButtons.push(bt);
			}

			this.tabContent.addChild(tab);
			this._tabs.push(tab);

			this.resizeTabButtons();
		}



		public updateSize(width: number, height: number): void
		{
			this.size = new PIXI.Point(width, height);

			this._tabs.forEach((value: cuboro.ui.tabs.Tab) =>
			{
				value.updateSize(width, height);
			});

			this.resizeTabButtons();
		}



		public onResize(): void
		{
			super.onResize();

			this.resizeTabButtons();
		}



		public getTabButtonByContent(content: cuboro.ui.tabs.Tab): cuboro.ui.TabButton
		{
			let bt = null;

			this._tabButtons.forEach((value: cuboro.ui.TabButton) =>
			{
				if (value.tab == content)
				{
					bt = value;
					return;
				}
			});

			return bt;
		}



		public get current(): cuboro.ui.tabs.Tab
		{
			return this._current;
		}



		public set current(value: cuboro.ui.tabs.Tab)
		{
			this._current = value;
			this._tabButtons.forEach((bt: cuboro.ui.TabButton) =>
			{
				bt.isSelected = (bt.tab == value);
				if (this.isSmall)
				{
					bt.tfLabel.style.fontSize = 13;
				}

				if (bt.isSelected)
					bt.tab.show();
				else
					bt.tab.hide();
			});

			this.emit(gf.CHANGE, this._current);
		}
	}
}
