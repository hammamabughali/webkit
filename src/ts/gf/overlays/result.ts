/// <reference path="../model/episodes.ts"/>
/// <reference path="../overlays/episodes.ts"/>
/// <reference path="../overlays/message.ts"/>
/// <reference path="../overlays/overlay.ts"/>
/// <reference path="../ui/highscore/highscore.ts"/>
/// <reference path="../vo/episodevo.ts"/>



module gf.overlays
{
	export class Result extends gf.overlays.Overlay
	{
		public static NAME:string = "result";

		protected won:boolean;

		public btBack:gf.ui.Button;
		public btNextLevel:gf.ui.Button;
		public btPlayAgain:gf.ui.Button;
		public btSaveScore:gf.ui.Button;
		public highscore:gf.ui.highscore.Highscore;



		protected init():void
		{
			this.addBtBack();
			this.addBtNextLevel();
			this.addBtPlayAgain();
			this.addBtSaveScore();
		}



		protected addBtBack():void
		{
			if (this.btBack)
				this.btBack.onClick.add(this.onBack, this);
		}



		protected addBtNextLevel():void
		{
			if (this.btNextLevel)
				this.btNextLevel.onClick.add(this.onNextLevel, this);
		}



		protected addBtPlayAgain():void
		{
			if (this.btPlayAgain)
				this.btPlayAgain.onClick.add(this.onPlayAgain, this);
		}



		protected addBtSaveScore():void
		{
			if (this.btSaveScore)
				this.btSaveScore.onClick.add(this.onSaveScore, this);
		}



		protected saveScore():void
		{
			this.game.overlays.show("loader");

			let score:number = this.game.levels.currentLevel.resultVO.score;
			let level:number = this.game.levels.currentLevel.id;

			let category:string = "level" + level;
			casClient.setHighscore("level" + level, score, () =>
			{
				this.game.overlays.hide("loader");
				this.highscore.getHighscores(false, this.game.levels.currentLevel.id);
			});
		}



		protected onBack():void
		{
			track("Result-Back");
			this.game.overlays.hide(this.name);
			if (this.game.levels.levelCount == 1)
			{
				this.game.overlays.show("detail");
			}
			else
			{
				this.game.screens.show("trail");
			}
		}



		protected onNextLevel():void
		{
			track("Result-Next-Level");
			this.game.overlays.hide(this.name);
			let nextLevel:number = this.game.levels.currentLevel.id + 1;

			if (!this.game.levels.getLevelVO(nextLevel))
			{
				this.game.screens.show("trail");
				let message:gf.overlays.Message = this.game.overlays.show("message");
				message.message = loc("hint_finished");
				message.title = loc("hint_finished_title");
			}
			else
			{
				this.game.levels.loadLevel(nextLevel, () =>
				{
					let levelVO:gf.vo.LevelVO = this.game.levels.getLevelVO(nextLevel);
					let episodeVO:gf.vo.EpisodeVO = this.game.episodes.getEpisodeByLevel(nextLevel);
					if (!levelVO.unlocked || !episodeVO.unlocked)
					{
						if (!episodeVO.unlocked)
						{
							let episodes:gf.overlays.Episodes = this.game.overlays.show("episodes");
							episodes.update(episodeVO.id);
						}

						this.game.screens.show("trail");
					}
					else
					{
						this.game.levels.currentLevel = levelVO;
						this.game.overlays.show("detail");
					}
				});
			}
		}



		protected onPlayAgain():void
		{
			track("Result-Play-Again");
			this.game.overlays.hide(this.name);
			let game:gf.screens.Game = <gf.screens.Game>this.game.screens.current;
			game.start();
		}



		protected onSaveScore():void
		{
			track("Result-Login-Save-Score", "CAS");
			this.game.overlays.show("loader");

			this.game.user.login(() =>
			{
				this.game.overlays.hide("loader");
				if (this.game.user.isLoggedIn)
				{
					if (this.btSaveScore)
						this.btSaveScore.visible = false;
					if (this.btNextLevel)
						this.btNextLevel.visible = true;

					this.saveScore();

					this.onResize();
				}
			});
		}
	}
}
