/// <reference path="trackpreview.ts"/>



module cuboro.ui
{
	export class TrackInfo extends gf.display.Container
	{
		public preview: cuboro.ui.TrackPreview;
		public previewBg: gf.display.Sprite;
		public tfTitles: gf.display.Text;
		public tfValues: gf.display.Text;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.previewBg = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.previewBg.tint = cuboro.COLOR_GREY;
			this.previewBg.width = 152;
			this.previewBg.height = this.previewBg.width;
			this.addChild(this.previewBg);

			this.preview = new cuboro.ui.TrackPreview(this.game);
			this.preview.x = 1;
			this.preview.y = this.preview.x;
			this.addChild(this.preview);

			const lineHeight = 18;

			this.tfTitles = new gf.display.Text(this.game, loc("track_info"), cuboro.TEXT_STYLE_SMALL.clone());
			this.tfTitles.style.lineHeight = lineHeight;
			this.tfTitles.x = 150 + cuboro.PADDING * 3;
			this.tfTitles.y = this.preview.y + cuboro.PADDING;
			this.addChild(this.tfTitles);

			this.tfValues = new gf.display.Text(this.game);
			this.tfValues.style = cuboro.TEXT_STYLE_SMALL.clone();
			this.tfValues.style.align = gf.RIGHT;
			this.tfValues.style.lineHeight = lineHeight;
			this.tfValues.x = this.tfTitles.right + cuboro.PADDING;
			this.tfValues.y = this.tfTitles.y;
			this.addChild(this.tfValues);
		}



		public reset(): void
		{
			this.tfValues.text = loc("track_info_values",
				{
					creator: "-",
					elementScore: "-",
					scoreTotal: "-",
					trackname: "-"
				});
		}



		public update(track: cuboro.vo.Track): void
		{
			let scoreTotal = "-";
			let scoreElement = "-";
			let creator = "-";
			let date = "-";

			if (track.data.evaluation)
			{
				if (track.data.evaluation.scoreTotal)
				{
					scoreTotal = track.data.evaluation.scoreTotal.toString();
				}

				if (track.data.evaluation.cubes > 0)
				{
					const score = track.data.evaluation.scoreTrack.reduce((pv, cv) => pv+cv, 0) + track.data.evaluation.scoreSubstructure;
					const cubes = track.data.evaluation.track.reduce((pv, cv) => pv+cv, 0) + track.data.evaluation.substructure;

					const rounded = (score > 0) ? Math.round((score / cubes) * 10) / 10 : 0;
					scoreElement = rounded.toFixed(1).replace(".", ",");
				}
			}

			if (track.owner)
			{
				creator = track.owner.name;
			}

			if (track.lastSavedWhen)
			{
				date = locDate("track_info_last_saved", track.lastSavedWhen);
			}

			this.tfValues.text = loc("track_info_values",
				{
					creator: creator,
					date: date,
					scoreElement: scoreElement,
					scoreTotal: scoreTotal,
					trackname: track.name
				});

			if (track.imageUrl)
			{
				this.preview.url = track.imageUrl;
			}
		}
	}
}
