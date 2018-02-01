/// <reference path="../../ui/highscore/highscoreitem.ts"/>
/// <reference path="../../vo/highscorevo.ts"/>



module gf.ui.highscore
{
	export var HIGHSCORE_REQUEST: cas.stubs.AjaxRequest;

	export class Highscore extends gf.display.Container
	{
		public HighscoreItem:any;

		public data: gf.vo.HighscoreVO[];
		public divider: gf.display.Graphics;
		public contentSize: PIXI.Rectangle;
		public itemContainer: gf.display.Draggable;
		public itemContainerMask: gf.display.Graphics;
		public itemSpacingH:number;
		public itemSpacingV:number;
		public items: gf.ui.highscore.HighscoreItem[];
		public limit:number;
		public options: {friendsOnly:boolean, level:number, period:string};
		public tfLoading: gf.display.Text;
		public tfLogin: gf.display.Text;
		public tfNoEntries: gf.display.Text;
		public total:number;


		constructor(game: gf.core.Game)
		{
			super(game);

			this.interactive = true;

			this.init();
		}



		protected init():void
		{
			this.itemSpacingH = 0;
			this.itemSpacingV = 0;

			this.addContainer();
			this.addNoEntries();
			this.addLoading();
			this.addLogin();

			this.game.user.on(gf.LOGIN, this.onLogin, this);
			this.game.user.on(gf.LOGOUT, this.onLogout, this);
		}



		protected onLogin():void
		{
			this.updateLogin();
			this.destroyItems();
			this.updateData();
			this.onResize();
		}



		protected onLogout():void
		{
		}



		protected hasDivider():boolean
		{
			let myself:boolean = false;
			let myRank:number = 0;

			for (let i:number = 0; i < this.data.length; ++i)
			{
				if (this.data[i].myself)
				{
					myself = true;
					myRank = this.data[i].rank;
				}
			}

			return (myself && myRank > this.limit);
		}



		protected addContainer():void
		{
			this.itemContainerMask = new gf.display.Graphics(this.game);
			this.itemContainerMask.f(0xff00ff).dr(0, 0, 100, 100).ef();
			this.addChild(this.itemContainerMask);

			this.itemContainer = new gf.display.Draggable(this.game);
			this.itemContainer.buttonMode = true;
			this.itemContainer.canDragY = false;
			this.itemContainer.mask = this.itemContainerMask;
			this.addChild(this.itemContainer);
		}



		protected addDivider():void
		{
			this.divider = new gf.display.Graphics(this.game);
			this.itemContainer.addChild(this.divider);
		}



		protected addLogin():void
		{
			this.tfLogin = new gf.display.Text(this.game, loc("highscore_login"));
			this.tfLogin.visible = false;
			this.addChild(this.tfLogin);
		}



		protected addNoEntries():void
		{
			this.tfNoEntries = new gf.display.Text(this.game, loc("highscore_no_entries"));
			this.tfNoEntries.visible = false;
			this.addChild(this.tfNoEntries);
		}



		protected addLoading():void
		{
			this.tfLoading = new gf.display.Text(this.game, loc("highscore_loading"));
			this.tfLoading.visible = false;
			this.addChild(this.tfLoading);
		}



		protected updateData():void
		{
			this.tfNoEntries.visible = false;

			let targetX:number = 0;
			if (this.data && this.data.length > 0)
			{
				this.setLimit();

				if (this.data.length < this.limit - 1 && this.total > this.limit)
				{
					this.getHighscores(this.options.friendsOnly, this.options.level, this.options.period);
					return;
				}
				else if (this.data.length > this.limit)
				{
					for (let i:number = 0; i < this.data.length; ++i)
					{
						if (this.data[i].myself)
						{
							if (i >= this.limit - 1)
							{
								this.getHighscores(this.options.friendsOnly, this.options.level, this.options.period);
								return;
							}
						}
					}

					this.data = this.data.slice(0, this.limit - 1);
				}

				let maxRank:number = 1;
				this.data.forEach((value: gf.vo.HighscoreVO) =>
				{
					if (value.rank > maxRank) maxRank = value.rank;
				});

				this.tfNoEntries.visible = false;

				let hasDivider:boolean = this.hasDivider();
				let item: gf.ui.highscore.HighscoreItem;

				for (let i:number = 0; i < this.data.length; ++i)
				{
					item = new this.HighscoreItem(this);
					item.data = this.data[i];
					item.maxRank = maxRank;

					if (hasDivider && i == this.limit >> 1)
					{
						this.addDivider();

						if (this.game.portrait)
						{
							this.divider.x = this.itemContainer.width + this.itemSpacingH;
							this.divider.y = 0;
						}
						else
						{
							this.divider.x = 0;
							this.divider.y = this.itemContainer.height + this.itemSpacingV;
						}

						this.drawDivider();
					}

					if (this.game.portrait)
					{
						item.x = this.itemContainer.width + ((i > 0) ? this.itemSpacingH : 0);
						item.y = (this.contentSize.height - item.height) >> 1;
						if (this.game.portrait && this.data[i].myself)
						{
							targetX = item.x;
						}
					}
					else
					{
						item.y = this.itemContainer.height + ((i > 0) ? this.itemSpacingV : 0);
					}

					this.itemContainer.addChild(item);

					this.items.push(item);
				}
			}
			else
			{
				this.tfNoEntries.visible = true;
			}

			this.itemContainer.x = (this.game.portrait) ? Math.max((this.contentSize.x - targetX), this.contentSize.x + this.contentSize.width - this.itemContainer.width) : this.contentSize.x;
			this.itemContainer.y = (this.game.portrait) ? this.contentSize.y : this.contentSize.y + ((this.contentSize.height - this.itemContainer.height) * 0.5);
			this.itemContainer.isDraggable = this.game.portrait;
			this.itemContainer.maxX = this.contentSize.x;
			this.itemContainer.minX = this.contentSize.x + this.contentSize.width - this.itemContainer.width;
			this.itemContainer.hitArea = new PIXI.Rectangle(0, 0, this.itemContainer.width, this.contentSize.height);
		}



		protected drawDivider():void
		{
			if (this.game.portrait)
			{
				this.divider.f(0x000000).dr(0, 0, 2, this.contentSize.height).ef();
			}
			else
			{
				this.divider.f(0x000000).dr(0, 0, this.contentSize.width, 2).ef();
			}
		}



		protected destroyItems():void
		{
			this.itemContainer.removeChildren();
			this.items = [];
		}



		protected setLimit():void
		{
			const item: gf.ui.highscore.HighscoreItem = new this.HighscoreItem(this);

			const limitH = this.game.client.config.highscoreLimit >> 0;
			const limitV = (this.contentSize.height / (item.height + this.itemSpacingV) - 1) >> 0;
			this.limit = this.game.portrait ? limitH : limitV;
		}



		protected onGetHighscores(response: cas.vo.Highscores):void
		{
			this.tfLoading.visible = false;

			this.data = [];

			if (response && response.entries)
			{
				const numEntries:number = response.entries.length;
				let currentVO: gf.vo.HighscoreVO;
				let highscoreVO: cas.vo.Highscore;

				for (let i:number = 0; i < numEntries; ++i)
				{
					highscoreVO = response.entries[i];
					currentVO = <gf.vo.HighscoreVO>{};
					currentVO.imageUrl = highscoreVO.imageUrl;
					currentVO.name = highscoreVO.name;
					currentVO.rank = highscoreVO.offset + 1;
					currentVO.score = highscoreVO.score;

					if (this.game.user.isLoggedIn)
					{
						currentVO.myself = (highscoreVO.id == this.game.user.id);
					}

					this.data.push(currentVO);
				}
			}

			this.destroyItems();
			this.updateData();
		}



		public updateLogin():void
		{
			this.itemContainer.alpha = (this.game.user.isLoggedIn) ? 1 : 0.25;
			this.tfLoading.alpha = (this.game.user.isLoggedIn) ? 1 : 0;
			this.tfLogin.visible = !this.game.user.isLoggedIn;
			this.tfNoEntries.alpha = (this.game.user.isLoggedIn) ? 1 : 0;
		}



		public getHighscores(friendsOnly:boolean = false, level:number, period?:string):void
		{
			this.destroyItems();

			this.tfLoading.visible = true;
			this.tfNoEntries.visible = false;

			this.options = { friendsOnly: friendsOnly, level: level, period: period};

			this.data = null;

			if (this.game.client.config.useCAS)
			{
				this.setLimit();

				const options: cas.vo.HighscoreOptions = new cas.vo.HighscoreOptions();
				options.category = "level" + level;
				options.friendsOnly = friendsOnly;
				options.limit = this.limit;
				options.offset = 0;
				options.period = period || cas.HIGHSCORE_PERIOD_ALLTIME;

				if (gf.ui.highscore.HIGHSCORE_REQUEST)
					gf.ui.highscore.HIGHSCORE_REQUEST.cancel();

				gf.ui.highscore.HIGHSCORE_REQUEST = casClient.getHighscores(options, (highscores: cas.vo.Highscores) =>
				{
					gf.ui.highscore.HIGHSCORE_REQUEST = null;
					this.total = highscores.totalCount;

					if (highscores && highscores.userOffset > (this.limit - 1))
					{
						let result: cas.vo.Highscores = new cas.vo.Highscores();
						result.category = highscores.category;

						let topEntries = [];

						for (let i:number = 0; i < this.limit >> 1; ++i)
							topEntries.push(highscores.entries[i]);

						result.entries = topEntries;

						options.offset = highscores.userOffset - (this.limit >> 2);
						options.limit = this.limit >> 1;

						casClient.getHighscores(options, (customHighscores: cas.vo.Highscores) =>
						{
							result.entries = result.entries.concat(customHighscores.entries);
							this.onGetHighscores(result);
						});
					}
					else
					{
						this.onGetHighscores(highscores);
					}
				});
			}
			else
			{
				this.tfLoading.visible = false;
				this.tfNoEntries.visible = true;
			}
		}



		public onResize():void
		{
			this.destroyItems();

			this.itemContainerMask.c().f(0x000000).dr(0, 0, this.contentSize.width, this.contentSize.height).ef();
			this.itemContainerMask.x = this.contentSize.x;
			this.itemContainerMask.y = this.contentSize.y;

			this.tfNoEntries.style.wordWrapWidth = this.contentSize.width;
			this.tfNoEntries.hAlign(gf.CENTER, this.contentSize.width, this.contentSize.x);
			this.tfNoEntries.vAlign(gf.CENTER, this.contentSize.height, this.contentSize.y);

			this.tfLoading.style.wordWrapWidth = this.contentSize.width;
			this.tfLoading.hAlign(gf.CENTER, this.contentSize.width, this.contentSize.x);
			this.tfLoading.vAlign(gf.CENTER, this.contentSize.height, this.contentSize.y);

			this.tfLogin.style.wordWrapWidth = this.contentSize.width;
			this.tfLogin.hAlign(gf.CENTER, this.contentSize.width, this.contentSize.x);
			this.tfLogin.vAlign(gf.CENTER, this.contentSize.height, this.contentSize.y);

			if (this.data) this.updateData();

			super.onResize();
		}
	}
}
