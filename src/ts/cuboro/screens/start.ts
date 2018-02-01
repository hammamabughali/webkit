/// <reference path="../screens/screen.ts"/>
/// <reference path="../ui/language.ts"/>
/// <reference path="../ui/tabs.ts"/>
/// <reference path="../ui/tabs/contest.ts"/>
/// <reference path="../ui/tabs/create.ts"/>
/// <reference path="../ui/tabs/gallery.ts"/>



module cuboro.screens
{
	export class Start extends cuboro.screens.Screen
	{
		public static readonly NAME: string = "start";

		public content: gf.display.Container;
		public language: gf.display.Container;
		public logo: gf.display.Sprite;
		public logoBg: gf.display.Sprite;
		public tabs: cuboro.ui.Tabs;
		public tabContest: cuboro.ui.tabs.Contest;
		public tabCreate: cuboro.ui.tabs.Create;
		public tabGallery: cuboro.ui.tabs.Gallery;



		public init(): void
		{
			super.init();

			this.content = new gf.display.Container(this.game);
			this.content.y = this.game.stage.header.bg.height;
			this.content.interactive = true;
			this.addChild(this.content);

			this.logoBg = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.logoBg.tint = cuboro.COLOR_YELLOW;
			this.content.addChild(this.logoBg);

			this.logo = new gf.display.Sprite(this.game, "logo");
			this.content.addChild(this.logo);

			this.tabContest = new cuboro.ui.tabs.Contest(this.game);
			this.tabCreate = new cuboro.ui.tabs.Create(this.game);
			this.tabGallery = new cuboro.ui.tabs.Gallery(this.game);

			this.tabs = new cuboro.ui.Tabs(this.game);
			this.tabs.y = this.logo.bottom;
			this.tabs.spacing = cuboro.PADDING * 2;
			this.tabs.add(this.tabGallery, loc("bt_gallery"));
			this.tabs.add(this.tabCreate, loc("bt_create_track"));
			this.tabs.add(this.tabContest, loc("bt_contest"));
			this.tabs.current = this.tabGallery;
			this.tabs.on(gf.CHANGE, this.onTab, this);
			this.content.addChild(this.tabs);

			this.language = new cuboro.ui.Language(this.game);
			this.addChild(this.language);

			this.logoBg.height = this.logo.height;

			mUser.on("loggedIn", this.getGallery, this);
		}



		protected onTab(value: cuboro.ui.tabs.Tab): void
		{
			if (value == this.tabGallery)
				this.getGallery();
		}



		public getGallery(): void
		{
			const filters = new cuboro.vo.gallery.Filters();
			this.tabGallery.getPage(filters);
		}



		public onResize(): void
		{
			super.onResize();

			this.logoBg.width = this.game.width;
			this.logo.x = gf.utils.Align.centerX(this.logo, this.game);

			this.language.x = this.game.width - this.language.width - cuboro.PADDING;
			this.language.y = this.game.height - this.game.stage.footer.bg.height - this.language.height - cuboro.PADDING;

			const h = this.game.height - this.tabs.y - this.tabs.tabButtons.height - this.game.stage.footer.height - this.game.stage.header.bg.height;
			this.tabs.maxWidth = this.game.width;
			this.tabs.updateSize(this.game.width, h);
		}



		public transitionIn():void
		{
			super.transitionIn();

			this.tabGallery.onFilter("rating", false, false, this.tabGallery.btBest);
			this.tabCreate.reset();
		}
	}
}
