/// <reference path="../model/episodes.ts"/>
/// <reference path="../model/progress.ts"/>
/// <reference path="../model/user.ts"/>
/// <reference path="../vo/levelvo.ts"/>
/// <reference path="../vo/progressvo.ts"/>



module gf.model
{
	export class Levels
	{
		public data: any;
		public game: gf.core.Game;
		public levels: gf.vo.LevelVO[];

		protected _currentLevel: gf.vo.LevelVO;
		protected _levelCapReached: boolean = false;
		protected _levelCount: number;
		protected _levelPath: string;



		constructor(game: gf.core.Game)
		{
			this.game = game;
			this.levels = [];

			this.game.user.on(gf.LOGOUT, this.reset, this);
		}



		private loadLevels(count: number): void
		{
			this.game.overlays.show("loader");
			let loader: gf.core.Loader = new gf.core.Loader(this.game);
			let start: number = this.game.client.config.hasEndless ? 0 : 1;
			for (let i: number = start; i <= count; ++i)
			{
				if (!this.game.cache.checkJSON("level" + i))
				{
					loader.json("level" + i, this._levelPath + "level" + i + ".json");
				}
			}

			loader.once(gf.LOAD_COMPLETE, () =>
			{
				for (let i: number = start; i <= count; ++i)
				{
					this.getLevelVO(i).fromJson(this.game.cache.getJSON("level" + i));
				}
				this.game.overlays.hide("loader");
			}, this);
			loader.start();
		}



		public init(): void
		{
			if (!this.game.cache.checkJSON("levels")) return;

			this.data = this.game.cache.getJSON("levels");
			this._levelCount = this.data.total;
			this._levelPath = this.data.path;

			let level: gf.vo.LevelVO;
			for (let i: number = 0; i < this._levelCount; ++i)
			{
				level = new gf.vo.LevelVO();
				level.id = this.game.client.config.hasEndless ? i : i + 1;
				this.levels.push(level);
			}
		}



		public reset(): void
		{
			this.levels = [];
			this.init();
			this.unlockLevels();
		}



		public loadLevel(level: number, onComplete?: () => void): void
		{
			if (!this.game.cache.checkJSON("levels")) return;

			if (level < 0 || level > this._levelCount)
				return;

			if (!this.game.cache.getJSON("level" + level))
			{
				let loader: gf.core.Loader = new gf.core.Loader(this.game);
				loader.once(gf.LOAD_COMPLETE, () =>
				{
					this.getLevelVO(level).fromJson(this.game.cache.getJSON("level" + level));
					if (onComplete) onComplete();
				}, this);
				loader.json("level" + level, this._levelPath + "level" + level + ".json");
				loader.start();
			}
			else
			{
				if (onComplete) onComplete();
			}
		}



		public getLevelVO(level: number): gf.vo.LevelVO
		{
			let result: gf.vo.LevelVO = null;

			this.levels.forEach((levelVO: gf.vo.LevelVO) =>
			{
				if (levelVO.id == level)
				{
					result = levelVO;
					return true;
				}
			});

			return result;
		}



		public updateLevelVO(level: number, data: any): gf.vo.LevelVO
		{
			let result: gf.vo.LevelVO;

			this.levels.forEach((levelVO: gf.vo.LevelVO) =>
			{
				if (levelVO.id == level)
				{
					levelVO = $.extend(levelVO, data);
					result = levelVO;
					return true;
				}
			});

			if (this.currentLevel.id == level)
			{
				this.currentLevel = result;
			}

			return result;
		}



		public unlockNextLevel(level: number): boolean
		{
			if (this.getLevelVO(level))
			{
				if (!this.currentLevel.jsonLoaded)
				{
					this.game.levels.loadLevel(level, () => this.unlockLevel(level));
				}
				else
				{
					let episode: number = this.game.episodes.getEpisodeByLevel(level).id;
					if (!this.game.episodes.isEpisodeUnlocked(episode))
					{
						this.game.episodes.startActivationCountdown(episode);
					}

					this.unlockLevel(level);
				}
			}
			else
			{
				return true;
			}

			return false;
		}



		public unlockLevel(level: number): void
		{
			if (!this.game.cache.checkJSON("levels")) return;

			let levelVO: gf.vo.LevelVO = this.getLevelVO(level);
			levelVO.unlocked = true;

			let progress: gf.vo.ProgressVO = new gf.vo.ProgressVO();
			progress.level = level;
			progress.unlocked = true;

			this.game.user.progress.setProgress(progress);
		}



		public unlockLevels(): void
		{
			if (!this.game.cache.checkJSON("levels")) return;

			let levels: any = this.game.storage.getItem("levels");
			let start: number = this.game.client.config.hasEndless ? 0 : 1;
			let currentLevel: number = start;

			if (!levels)
			{
				for (let i: number = start; i <= this.game.client.config.unlockedLevels; ++i)
				{
					this.unlockLevel(i);

					let progress: gf.vo.ProgressVO = new gf.vo.ProgressVO();
					progress.level = i;
					progress.unlocked = true;
					this.game.storage.setItem("levels", {[progress.level]: progress});
				}

				this.currentLevel = this.getLevelVO(1);
			}
			else
			{
				let level: gf.vo.LevelVO;
				for (let key in levels)
				{
					let data: gf.vo.ProgressVO = levels[key];
					if (data.level <= this._levelCount)
					{
						if (!currentLevel || data.level > currentLevel && data.unlocked)
						{
							currentLevel = data.level;
						}

						level = this.getLevelVO(data.level);
						if (level)
						{
							level.unlocked = data.unlocked;
							this.game.user.progress.setProgress(data);
						}
					}
				}

				if (!this._currentLevel)
				{
					this._currentLevel = this.getLevelVO(currentLevel);
					this._currentLevel.unlocked = true;
				}
			}

			this.loadLevels(currentLevel);
		}



		public getStars(score: number, level: number, ascending: boolean = true): number
		{
			let levelVO: gf.vo.LevelVO = this.getLevelVO(level);

			if (score == null || score == 0 || levelVO == null)
			{
				return 0;
			}

			let s: number[] = levelVO.stars;
			let i: number;
			let stars: number;

			if (ascending)
			{
				stars = s.length;
				for (i = s.length - 1; i >= 0; --i)
				{
					if (score && score < s[i]) stars--;
				}
			}
			else
			{
				stars = 0;
				for (i = 0; i < s.length; ++i)
				{
					if (score && score < s[i]) stars++;
				}
			}

			return stars;
		}



		public getScoreByLevel(level: number): number
		{
			return this.getLevelVO(level).highscoreDataVO.score;
		}



		public get currentLevel(): gf.vo.LevelVO
		{
			return this._currentLevel;
		}



		public set currentLevel(value: gf.vo.LevelVO)
		{
			this._currentLevel = value;
		}



		public get levelCapReached(): boolean
		{
			return this._levelCapReached;
		}



		public get lastUnlockedLevelVO(): gf.vo.LevelVO
		{
			let i: number;

			for (i = 0; i < this.levels.length; ++i)
			{
				if (!this.levels[i] || !this.levels[i].unlocked)
				{
					break;
				}
			}

			return this.levels[i] ? this.levels[i] : this.levels[i - 1];
		}



		public get levelCount(): number
		{
			return this._levelCount;
		}
	}
}
