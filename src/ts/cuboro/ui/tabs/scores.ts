/// <reference path="tab.ts"/>



module cuboro.ui.tabs
{
	export class Scores extends cuboro.ui.tabs.Tab
	{
		public tfCubeScores: gf.display.Text;
		public tfCubeScoresValues: gf.display.Text;
		public tfCubeTitles: gf.display.Text;
		public tfCubeValues: gf.display.Text;
		public tfTitleCount: gf.display.Text;
		public tfTitleScore: gf.display.Text;
		public tfTitleTotal: gf.display.Text;
		public tfTitleTotalScore: gf.display.Text;
		public tfTitleType: gf.display.Text;
		public tfTitleValue: gf.display.Text;



		constructor(game: gf.core.Game)
		{
			super(game);

			const lineHeight = 18;

			this.tfTitleType = new gf.display.Text(this.game, loc("cube_info_type"), cuboro.TEXT_STYLE_SMALL_HEAVY.clone());
			this.tfTitleType.x = 20;
			this.content.addChild(this.tfTitleType);

			this.tfTitleCount = new gf.display.Text(this.game, loc("cube_info_count"), cuboro.TEXT_STYLE_SMALL_HEAVY.clone());
			this.content.addChild(this.tfTitleCount);

			this.tfTitleValue = new gf.display.Text(this.game, loc("cube_info_value"), cuboro.TEXT_STYLE_SMALL_HEAVY.clone());
			this.content.addChild(this.tfTitleValue);

			this.tfTitleScore = new gf.display.Text(this.game, loc("cube_info_score"), cuboro.TEXT_STYLE_SMALL_HEAVY.clone());
			this.content.addChild(this.tfTitleScore);

			this.tfCubeTitles = new gf.display.Text(this.game, loc("cube_info"), cuboro.TEXT_STYLE_SMALL.clone());
			this.tfCubeTitles.style.lineHeight = lineHeight;
			this.tfCubeTitles.x = 20;
			this.tfCubeTitles.y = this.tfTitleType.bottom + cuboro.PADDING;
			this.content.addChild(this.tfCubeTitles);

			this.tfCubeValues = new gf.display.Text(this.game);
			this.tfCubeValues.style = cuboro.TEXT_STYLE_SMALL.clone();
			this.tfCubeValues.style.align = gf.RIGHT;
			this.tfCubeValues.style.lineHeight = lineHeight;
			this.tfCubeValues.y = this.tfCubeTitles.y;
			this.content.addChild(this.tfCubeValues);

			this.tfCubeScores = new gf.display.Text(this.game, loc("cube_info_scores"), cuboro.TEXT_STYLE_SMALL.clone());
			this.tfCubeScores.y = this.tfCubeTitles.y;
			this.tfCubeScores.style.lineHeight = lineHeight;
			this.content.addChild(this.tfCubeScores);

			this.tfCubeScoresValues = new gf.display.Text(this.game);
			this.tfCubeScoresValues.style = cuboro.TEXT_STYLE_SMALL.clone();
			this.tfCubeScoresValues.style.lineHeight = lineHeight;
			this.tfCubeScoresValues.y = this.tfCubeTitles.y;
			this.content.addChild(this.tfCubeScoresValues);

			this.tfTitleTotal = new gf.display.Text(this.game, loc("cube_info_total"), cuboro.TEXT_STYLE_SMALL_HEAVY.clone());
			this.tfTitleTotal.x = this.tfCubeTitles.x;
			this.tfTitleTotal.y = this.tfCubeTitles.bottom + cuboro.PADDING * 2;
			this.content.addChild(this.tfTitleTotal);

			this.tfTitleTotalScore = new gf.display.Text(this.game);
			this.tfTitleTotalScore.style = cuboro.TEXT_STYLE_SMALL_HEAVY.clone();
			this.tfTitleTotalScore.y = this.tfTitleTotal.y;
			this.content.addChild(this.tfTitleTotalScore);

			this.tfCubeValues.x = this.tfTitleCount.x = this.tfCubeTitles.right + cuboro.PADDING * 2;
			this.tfCubeScores.x = this.tfTitleValue.x = this.tfTitleCount.right + cuboro.PADDING * 2;
			this.tfCubeScoresValues.x = this.tfTitleScore.x = this.tfTitleTotalScore.x = this.tfTitleValue.right + cuboro.PADDING * 4;
		}



		public update(track: cuboro.vo.Track): void
		{
			if(!track.data.evaluation.track[4]) track.data.evaluation.track[4] = 0;
			if(!track.data.evaluation.scoreTrack[4]) track.data.evaluation.scoreTrack[4] = 0;

			this.tfCubeValues.text = track.data.evaluation.cubes + "\n" +
				track.data.evaluation.track[0] + "\n" +
				track.data.evaluation.track[1] + "\n" +
				track.data.evaluation.track[2] + "\n" +
				track.data.evaluation.track[3] + "\n" +
				track.data.evaluation.track[4] + "\n" +
				track.data.evaluation.substructure;

			this.tfCubeScoresValues.text = "= " + track.data.evaluation.scoreCubes + "\n= " +
				track.data.evaluation.scoreTrack[0] + "\n= " +
				track.data.evaluation.scoreTrack[1] + "\n= " +
				track.data.evaluation.scoreTrack[2] + "\n= " +
				track.data.evaluation.scoreTrack[3] + "\n= " +
				track.data.evaluation.scoreTrack[4] + "\n= " +
				track.data.evaluation.scoreSubstructure;

			this.tfTitleTotalScore.text = "= " + track.data.evaluation.scoreTotal;
		}
	}
}
