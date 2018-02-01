/// <reference path="../../cuboro/ui/galleryitembutton.ts"/>
/// <reference path="../../cuboro/ui/trackpreview.ts"/>
/// <reference path="../../cuboro/vo/track.ts"/>
/// <reference path="../../gf/ui/button.ts"/>



module cuboro.ui
{
	export class GalleryItem extends gf.display.Sprite
	{
		private _track: cuboro.vo.Track;

		public bg: gf.display.Sprite;
		public bgBottom: gf.display.Sprite;
		public bgTop: gf.display.Sprite;
		public btDetails: cuboro.ui.GalleryItemButton;
		public btLoad: gf.display.Sprite;
		public info: gf.display.Sprite;
		public preview: cuboro.ui.TrackPreview;
		public tfScoreTotal: gf.display.Text;
		public tfTrackName: gf.display.Text;
		public trophy: gf.display.Sprite;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.interactive = true;

			this.bg = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.bg.tint = cuboro.COLOR_MID_GREY;
			this.bg.width = 150;
			this.bg.height = 150;
			this.addChild(this.bg);

			this.preview = new cuboro.ui.TrackPreview(this.game);
			this.preview.x = 1;
			this.preview.y = 1;
			this.preview.width = 148;
			this.preview.height = 148;
			this.addChild(this.preview);

			this.bgTop = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.bgTop.tint = cuboro.COLOR_MID_GREY;
			this.bgTop.width = 150;
			this.bgTop.height = 22;
			this.addChild(this.bgTop);

			this.tfTrackName = new gf.display.Text(this.game);
			this.tfTrackName.style = cuboro.TEXT_STYLE_BUTTON_CUBE.clone();
			this.tfTrackName.x = cuboro.PADDING;
			this.tfTrackName.y = (this.bgTop.height - this.tfTrackName.height) >> 1;
			this.addChild(this.tfTrackName);

			this.bgBottom = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.bgBottom.tint = cuboro.COLOR_MID_GREY;
			this.bgBottom.width = 150;
			this.bgBottom.height = 22;
			this.bgBottom.y = 128;
			this.addChild(this.bgBottom);

			this.btLoad = new gf.display.Sprite(this.game, PIXI.Texture.EMPTY);
			this.btLoad.on("click tap", this.onLoad, this);
			this.btLoad.width = this.bg.width;
			this.btLoad.height = this.bg.height - this.bgBottom.height;
			this.btLoad.interactive = true;
			this.btLoad.buttonMode = true;
			this.addChild(this.btLoad);

			this.trophy = new gf.display.Sprite(this.game, "sprites", "icon_trophy");
			this.trophy.tint = cuboro.COLOR_DARK_GREY;
			this.trophy.x = cuboro.PADDING;
			this.trophy.y = 132;
			this.addChild(this.trophy);

			this.tfScoreTotal = new gf.display.Text(this.game);
			this.tfScoreTotal.style = cuboro.TEXT_STYLE_SMALL.clone();
			this.tfScoreTotal.x = this.trophy.right + cuboro.PADDING;
			this.tfScoreTotal.y = 132;
			this.addChild(this.tfScoreTotal);

			this.btDetails = new cuboro.ui.GalleryItemButton(this.game, loc("bt_track_details"));
			this.btDetails.on("click tap", this.onDetails, this);
			this.btDetails.x = (150 - this.btDetails.width - cuboro.PADDING) >> 0;
			this.btDetails.y = this.tfScoreTotal.y;
			this.addChild(this.btDetails);
		}



		protected onDetails(): void
		{
			const trackDetails = this.game.overlays.show(cuboro.overlays.TrackDetails.NAME);
			trackDetails.track = this._track;
		}



		protected onLoad(): void
		{
			cuboro.core.Loader.loadTrack(this.game, this.track, false);
		}



		public update(): void
		{
			if (!this._track || !this._track.data) return;

			if (this._track.imageUrl)
				this.preview.url = this._track.imageUrl;

			this.tfTrackName.text = this._track.name;
			this.tfTrackName.truncate(this.bg.width - cuboro.PADDING * 2);

			if (this._track.data.evaluation)
				this.tfScoreTotal.text = this._track.data.evaluation.scoreTotal.toString();
			else
				this.tfScoreTotal.text = "-";
		}



		public get track(): cuboro.vo.Track
		{
			return this._track;
		}



		public set track(value: cuboro.vo.Track)
		{
			this._track = value;
			this.update();
		}
	}
}
