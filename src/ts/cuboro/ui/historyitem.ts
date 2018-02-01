module cuboro.ui
{
	export class HistoryItem extends gf.display.Container
	{
		public bg: gf.display.Slice3;
		public icon: gf.display.Sprite;
		public track: cuboro.vo.Track;
		public tfOwner: gf.display.Text;
		public tfScore: gf.display.Text;
		public tfTrackName: gf.display.Text;
		public type: string;



		constructor(game: gf.core.Game, track: cuboro.vo.Track, type: string)
		{
			super(game);

			this.track = track;
			this.type = type;

			this.bg = new gf.display.Slice3(this.game, 10, 10, "sprites", "bt_text_disabled");
			this.bg.width = 460 - 18 - cuboro.PADDING;
			this.addChild(this.bg);

			const dummy = new gf.display.Sprite(this.game, PIXI.Texture.EMPTY);
			dummy.width = this.bg.width;
			dummy.height = this.bg.height;
			this.addChild(dummy);

			this.icon = new gf.display.Sprite(this.game, "sprites", "icon_successor");
			this.icon.tint = cuboro.COLOR_DARK_GREY;
			this.icon.y = 1;
			this.addChild(this.icon);

			if (this.type == cuboro.HISTORY.PREDECESSOR)
				this.icon.frameName = "icon_predecessor";

			this.tfTrackName = new gf.display.Text(this.game, this.track.name, cuboro.TEXT_STYLE_SMALL.clone());
			this.tfTrackName.x = this.icon.right + cuboro.PADDING * 2;
			this.tfTrackName.y = 6;
			this.addChild(this.tfTrackName);

			this.tfOwner = new gf.display.Text(this.game, this.track.owner.name, cuboro.TEXT_STYLE_SMALL.clone());
			this.tfOwner.x = 200;
			this.tfOwner.y = this.tfTrackName.y;
			this.addChild(this.tfOwner);

			this.tfScore = new gf.display.Text(this.game, this.track.scoreTotal.toString(), cuboro.TEXT_STYLE_SMALL.clone());
			this.tfScore.x = this.bg.width - this.tfScore.width - cuboro.PADDING * 2;
			this.tfScore.y = this.tfOwner.y;
			this.addChild(this.tfScore);

			this.icon.visible = this.type != cuboro.HISTORY.CURRENT;
			this.bg.visible = this.icon.visible;

			this.tfTrackName.truncate(this.tfOwner.x - this.tfTrackName.x - cuboro.PADDING * 2);
			this.tfOwner.truncate(this.tfScore.x - this.tfOwner.x - cuboro.PADDING * 2);
		}
	}
}
