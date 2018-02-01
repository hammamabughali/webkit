/// <reference path="../../ui/galleryitem.ts"/>
/// <reference path="../../ui/tabs/tab.ts"/>
/// <reference path="../../ui/textbutton.ts"/>
/// <reference path="../../ui/texticonbutton.ts"/>
/// <reference path="../../vo/gallery/filters.ts"/>



module cuboro.ui.tabs
{
	export class Gallery extends cuboro.ui.tabs.Tab
	{
		protected galleryHeight: number;
		protected items: cuboro.ui.GalleryItem[];

		public btBest: cuboro.ui.TextIconButton;
		public btEdu: cuboro.ui.TextIconButton;
		public btLoadMore: cuboro.ui.TextButton;
		public btNewest: cuboro.ui.TextIconButton;
		public btOwn: cuboro.ui.TextIconButton;
		public galleryFilters: cuboro.vo.gallery.Filters;
		public tfTracks: gf.display.Text;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.items = [];

			this.btBest = new cuboro.ui.TextIconButton(this.game, "best", loc("bt_tracks_best"));
			this.btBest.x = cuboro.PADDING;
			this.btBest.y = cuboro.PADDING * 2;
			this.btBest.isSelected = true;
			this.btBest.setWidth(150);
			this.btBest.on(gf.CLICK, () => this.onFilter("rating", false, false, this.btBest, true), this);
			this.addChild(this.btBest);

			this.btNewest = new cuboro.ui.TextIconButton(this.game, "newest", loc("bt_tracks_newest"));
			this.btNewest.x = this.btBest.right + cuboro.PADDING;
			this.btNewest.y = this.btBest.y;
			this.btNewest.setWidth(150);
			this.btNewest.on(gf.CLICK, () => this.onFilter("age", false, false, this.btNewest, true), this);
			this.addChild(this.btNewest);

			this.btOwn = new cuboro.ui.TextIconButton(this.game, "own", loc("bt_tracks_own"));
			this.btOwn.x = this.btNewest.right + cuboro.PADDING;
			this.btOwn.y = this.btBest.y;
			this.btOwn.setWidth(150);
			this.btOwn.isEnabled = mUser.isLoggedIn();
			this.btOwn.on(gf.CLICK, () => this.onFilter("age", true, false, this.btOwn, true), this);
			this.addChild(this.btOwn);

			this.btEdu = new cuboro.ui.TextIconButton(this.game, "edu", loc("bt_tracks_edu"));
			this.btEdu.x = this.btOwn.right + cuboro.PADDING;
			this.btEdu.y = this.btBest.y;
			this.btEdu.setWidth(150);
			this.btEdu.on(gf.CLICK, () => this.onFilter("age", false, true, this.btEdu, true), this);
			this.addChild(this.btEdu);

			this.content.x =
				this.contentMask.x = cuboro.PADDING;

			this.content.y =
				this.contentMask.y = this.btBest.bottom + cuboro.PADDING * 2;

			this.btLoadMore = new cuboro.ui.TextButton(this.game, loc("bt_load_more"), false);
			this.btLoadMore.isEnabled = false;
			this.btLoadMore.on(gf.CLICK, this.onLoadMore, this);
			this.addChild(this.btLoadMore);

			this.tfTracks = new gf.display.Text(this.game, loc("gallery_tracks", {value: 0}));
			this.tfTracks.style = cuboro.TEXT_STYLE_BUTTON_TEXT.clone();
			this.tfTracks.visible = false;
			this.addChild(this.tfTracks);

			mUser.on("loggedIn", () => this.btOwn.isEnabled = true);
			mUser.on("logout", () => this.btOwn.isEnabled = false);
		}



		protected onLoadMore(): void
		{
			this.galleryFilters.offset += this.galleryFilters.limit;
			this.getPage(this.galleryFilters, false);
		}



		public addItem(track: cuboro.vo.Track): void
		{
			const item = new cuboro.ui.GalleryItem(this.game);
			item.track = track;
			item.on(gf.CLICK, () => this.emit("track", item), this);
			this.content.addChild(item);

			this.items.push(item);
		}



		public getItem(id: number): cuboro.ui.GalleryItem
		{
			let item: cuboro.ui.GalleryItem = null;

			this.items.forEach((value: cuboro.ui.GalleryItem) =>
			{
				if (value.track.id == id)
				{
					item = value;
					return true;
				}
			});

			return item;
		}



		public onFilter(
			sortBy: "rating" | "age",
			own: boolean,
			edu: boolean,
			bt: cuboro.ui.TextIconButton,
			reset: boolean = false): void
		{
			const filters =
				{
					offset: 0,
					limit: 20,
					own: own,
					edu: edu,
					sortBy: sortBy
				};

			this.btBest.isSelected = this.btBest == bt;
			this.btNewest.isSelected = this.btNewest == bt;
			this.btOwn.isSelected = this.btOwn == bt;
			this.btEdu.isSelected = this.btEdu == bt;

			this.getPage(filters, reset);
		}



		public arrange(): void
		{
			const itemSize = 150;

			let col = 0;
			let row = 0;

			const width = this.contentMask.width - (this.scrollbar.width + cuboro.PADDING * 2);
			const cols = Math.floor(width / (itemSize + cuboro.PADDING));

			this.items.forEach((value: cuboro.ui.GalleryItem) =>
			{
				if (col == cols)
				{
					col = 0;
					row++;
				}

				value.scaleXY = 1;
				value.x = col * itemSize + col * cuboro.PADDING;
				value.y = row * itemSize + row * cuboro.PADDING;

				col++;
			});

			this.bounds.width = this.contentMask.width;
			this.bounds.height = row * itemSize + row * cuboro.PADDING + itemSize;

			this.scrollbar.update(this.content, this.contentMask, 0);
			this.scrollbar.visible = this.scrollbar.sizeScroll > this.scrollbar.sizeVisible;
		}



		public getPage(filters: cuboro.vo.gallery.Filters, reset: boolean = true): void
		{
			this.galleryFilters = filters;

			this.game.overlays.show(cuboro.overlays.Loader.NAME);

			if (reset) this.reset();

			sGallery.getPage(this.galleryFilters, (result: cuboro.vo.gallery.Page, status: string) =>
			{
				this.game.overlays.hide(cuboro.overlays.Loader.NAME);

				if (status == kr3m.SUCCESS)
				{
					result.tracks.forEach((value: cuboro.vo.Track) =>
					{
						this.addItem(value);
					});

					const countLeft = result.totalCount - result.usedFilters.offset - result.tracks.length;
					this.btLoadMore.isEnabled = countLeft > 0;
					this.tfTracks.visible = countLeft > 0;
					this.tfTracks.text = loc("gallery_tracks", {value: countLeft});

					this.arrange();
				}

				this.emit("galleryLoaded");
			});
		}



		public reset(): void
		{
			this.content.y = this.contentMask.y;
			this.scrollbar.updateToContentPosition();
			this.content.removeChildren();
			this.content.addChild(this.bounds);
			this.items = [];
		}



		public updateSize(width: number, height: number): void
		{
			this.galleryHeight = height - this.btLoadMore.height - cuboro.PADDING * 4 - this.btBest.bottom;
			super.updateSize(width - this.scrollbar.width - cuboro.PADDING * 2, this.galleryHeight);

			this.arrange();

			this.onResize();
		}



		public onResize(): void
		{
			super.onResize();

			if (this.tfTracks.visible)
			{
				this.btLoadMore.x = (this.game.width - this.btLoadMore.width - this.tfTracks.width - cuboro.PADDING) >> 1;
			}
			else
			{
				this.btLoadMore.x = (this.game.width - this.btLoadMore.width) >> 1;
			}
			this.btLoadMore.y = this.galleryHeight + this.btBest.bottom + cuboro.PADDING * 3;

			this.tfTracks.x = this.btLoadMore.right + cuboro.PADDING;
			this.tfTracks.y = this.btLoadMore.y + ((this.btLoadMore.height - this.tfTracks.height) >> 1);
		}
	}
}
