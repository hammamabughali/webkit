module gf.model
{
	export class Progress
	{
		public game: gf.core.Game;
		public progress: gf.vo.ProgressVO[];



		constructor(game: gf.core.Game)
		{
			this.game = game;
			this.progress = [];
			this.game.storage.on(gf.DATA, this.onStorageData, this);
			this.game.user.on(gf.LOGOUT, this.reset, this);
		}



		public onStorageData():void
		{
			if (this.game.user.isLoggedIn)
			{
				this.mergeProgress();
			}
			else
			{
				this.progress = [];
				this.game.levels.unlockLevels();
			}
		}



		public reset():void
		{
			this.progress = [];
		}



		public mergeProgress():void
		{
			let levels:any = this.game.storage.getItem("levels");
			let storedProgress: gf.vo.ProgressVO[] = [];

			for (let key in levels)
			{
				if (levels.hasOwnProperty(key))
				{
					storedProgress.push(levels[key]);
				}
			}

			let progressToSet: gf.vo.ProgressVO[] = [];
			let progressVO: gf.vo.ProgressVO;

			this.progress.forEach((currentProgressVO: gf.vo.ProgressVO) =>
			{
				progressVO = this.getProgressByLevel(storedProgress, currentProgressVO.level);
				if (progressVO)
				{
					if (currentProgressVO.score > progressVO.score)
					{
						progressToSet.push(progressVO);
					}
				}
				else
				{
					progressToSet.push(currentProgressVO);
				}
			});

			let data:any = {};
			let scoresToSet: {score:number, level?:number}[] = [];

			progressToSet.forEach((progressVO: gf.vo.ProgressVO) =>
			{
				data[progressVO.level] = progressVO;
				scoresToSet.push({score: progressVO.score, level: progressVO.level});
			});

			if (progressToSet.length > 0)
			{
				this.game.storage.updateItem("levels", data, () =>
				{
					if (this.game.client.config.useCAS)
					{
						let entries:cas.vo.NewHighscore[] = [];
						let vo:cas.vo.NewHighscore;

						scoresToSet.forEach((value:{score:number, level:number}) =>
						{
							vo = new cas.vo.NewHighscore();
							vo.category = "level" + value.level;
							vo.score = value.score;

							if (vo.score != 0)
								entries.push(vo);
						});

						casClient.setHighscores(entries, () => {});
					}
					this.game.levels.unlockLevels();
				});
			}
			else
			{
				this.game.levels.unlockLevels();
			}
		}



		public setProgress(progress: gf.vo.ProgressVO):void
		{
			let progressFound:boolean = false;
			this.progress.forEach((vo: gf.vo.ProgressVO) =>
			{
				if (vo.level == progress.level)
				{
					progressFound = true;
					if (progress.score > vo.score)
					{
						$.extend(vo, progress);
						this.game.storage.updateItem("levels", {[progress.level]: progress});
					}
				}
			});

			if (!progressFound)
			{
				this.progress.push($.extend(new gf.vo.ProgressVO(), progress));
				this.game.storage.updateItem("levels", {[progress.level]: progress});
			}
		}



		public getProgress(level?:number): gf.vo.ProgressVO
		{
			let levels:any = this.game.storage.getItem("levels");
			let lastLevel:number = 1;
			let progress: gf.vo.ProgressVO = new gf.vo.ProgressVO;

			for (let key in levels)
			{
				if (levels.hasOwnProperty(key))
				{
					progress = levels[key];

					if (isNaN(level))
					{
						if (progress.level > lastLevel)
						{
							lastLevel = progress.level;
						}
					}
					else if (progress.level == level)
					{
						return progress;
					}
				}
			}

			if (!level)
			{
				return this.getProgress(lastLevel);
			}
		}



		private getProgressByLevel(progressVOs: gf.vo.ProgressVO[], level:number): gf.vo.ProgressVO
		{
			let progress: gf.vo.ProgressVO = null;

			progressVOs.forEach((vo: gf.vo.ProgressVO) =>
			{
				if (vo.level == level)
				{
					progress = vo;
					return true;
				}
			});

			return progress;
		}
	}
}
