/// <reference path="../model/cooldown.ts"/>
/// <reference path="../utils/format.ts"/>
/// <reference path="../vo/episodevo.ts"/>
/// <reference path="../vo/levelvo.ts"/>



module gf.model
{
	const msForUnlock: number = 259200000;
	export const EPISODE_UNLOCKED: string = "episodeUnlocked";
	export const EPISODE_UPDATE: string = "episodeUpdate";



	export class Episodes extends gf.model.Cooldown
	{
		private _activations: any[][];
		private _current: gf.vo.EpisodeVO;
		private _episodes: gf.vo.EpisodeVO[];
		private _total: number;



		constructor(game: gf.core.Game)
		{
			super(game, msForUnlock, 1, "episode1", 1);

			this.game.user.on(gf.LOGOUT, this.reset, this);

			this._episodes = [];
			this._activations = [["default"]];

			this.on(gf.model.COOLDOWN_COMPLETE, () =>
			{
				const episode: number = this.game.storage.getItem("episodeToUnlock");
				if (episode)
				{
					this.unlockEpisodeByTime(episode);
				}
			}, this);
		}



		public onData(): void
		{
			this._activations = this.game.storage.getItem("episodes");

			if (!this._activations)
			{
				this.setActivations([["default"]])
			}

			this.unlockEpisodes();
		}



		/*
			Set all activations also in storage
			@param value
		*/
		public setActivations(value: any[][]): void
		{
			this._activations = [value];
			this.game.storage.setItem("episodes", this._activations);
		}



		public init(): void
		{
			if (!this.game.cache.checkJSON("levels")) return;

			let episodes: any[] = this.game.cache.getJSON("levels").episodes;
			this._total = episodes.length;

			if (this._total > 0)
			{
				let episodeVO: gf.vo.EpisodeVO;

				for (let i: number = 0; i < this._total; ++i)
				{
					episodeVO = new gf.vo.EpisodeVO();
					episodeVO.id = i + 1;
					episodeVO.levels = episodes[i].levels;
					episodeVO.custom = episodes[i].custom || {};
					this._episodes.push(episodeVO);
				}

				this._current = this.getEpisode(1);
			}

			this.game.storage.on(gf.DATA, this.onData, this);
		}



		public unlockEpisodes(): void
		{
			if (this._total <= 0) return;

			// Unlock first episode
			let episodeVO: gf.vo.EpisodeVO = this.getEpisode(1);
			episodeVO.unlocked = true;
			this._current = episodeVO;
			this.unlockLevelForEpisode(episodeVO.id);

			// Check unlocked levels to unlock episodes
			for (let i: number = 0; i < this._total; ++i)
			{
				episodeVO = this._episodes[i];

				let levels: number[] = episodeVO.levels;
				let lastLevelVO: gf.vo.LevelVO = this.game.levels.getLevelVO(levels[levels.length - 1]);
				if (lastLevelVO && lastLevelVO.unlocked && this._episodes[i + 1])
				{
					episodeVO = this._episodes[i + 1];
					episodeVO.unlocked = this.isEpisodeUnlocked(episodeVO.id);
					if (episodeVO.unlocked)
					{
						if (episodeVO.id == 1 || this.game.levels.getLevelVO(this.getEpisode(episodeVO.id - 1).lastLevel).unlocked)
						{
							this._current = episodeVO;
							this.unlockLevelForEpisode(episodeVO.id);
						}
					}
				}
			}

			// Check activations for next episode
			if (this.hasNext)
			{
				episodeVO = this.getEpisode(this.next.id);
				episodeVO.unlocked = this.isEpisodeUnlocked(episodeVO.id);

				if (episodeVO.unlocked)
				{
					if (episodeVO.id == 1 || this.game.levels.getLevelVO(this.getEpisode(episodeVO.id - 1).lastLevel).unlocked)
					{
						this._current = episodeVO;
						this.unlockLevelForEpisode(episodeVO.id);
					}
				}
			}


			// Check cooldown if episode is already activated
			episodeVO = this.getEpisode(this.game.storage.getItem("episodeToUnlock"));
			if (episodeVO)
			{
				episodeVO.unlocked = this.isEpisodeUnlocked(episodeVO.id);

				if (episodeVO.unlocked)
				{
					if (episodeVO.id == 1 || this.game.levels.getLevelVO(this.getEpisode(episodeVO.id - 1).lastLevel).unlocked)
					{
						this._current = episodeVO;
						this.unlockLevelForEpisode(episodeVO.id);
					}
				}
				else
				{
					this.startActivationCountdown(episodeVO.id);
				}
			}
		}



		protected unlockLevelForEpisode(episode: number): void
		{
			let levelVO: gf.vo.LevelVO = this.game.levels.getLevelVO(this.getEpisode(episode).levels[0]);
			if (levelVO && !levelVO.unlocked)
			{
				levelVO.unlocked = true;

				let progress: gf.vo.ProgressVO = new gf.vo.ProgressVO();
				progress.level = levelVO.id;
				progress.score = 0;
				progress.unlocked = true;
				this.game.user.progress.setProgress(progress);
			}
		}



		public reset(): void
		{
			this._current = this.getEpisode(1);
			this._activations = [["default"]];
		}



		public deletePendingRequests(callback?: () => void): void
		{
			let requestIds: string[] = [];

			casClient.getRequests((requests: cas.vo.Requests) =>
			{
				requests.outgoing.forEach((request: cas.vo.Request) =>
				{
					if (request.status == "ACCEPTED")
					{
						if (request.customData.type == gf.REQUEST_EPISODE)
						{
							this.unlockEpisodeByUser(request.user, request.customData.episode);
							requestIds.push(request.id);
						}
					}
				});

				if (requestIds.length == 0)
				{
					if (callback) callback();
				}
				else
				{
					let requestsDeleted: number = 0;
					requestIds.forEach((value: string) =>
					{
						casClient.deleteRequest(value, () =>
						{
							requestsDeleted++;
							if (requestsDeleted == requestIds.length)
								if (callback) callback();
						});
					});
				}
			});
		}



		public startActivationCountdown(episode: number): void
		{
			if (episode > this._total) return;

			this.storageToken = "episode" + episode;
			if (!!!(this.game.storage.getItem(this.storageToken + "Running")))
			{
				// Activate episode cooldown only once
				this.game.storage.setItem(this.storageToken + "Running", true);
				this.game.storage.setItem(this.storageToken, 0);
				this.game.storage.setItem("episodeToUnlock", episode);
			}

			this.onStorageData();
		}



		/*
			Get episode vo by episode number
			@param episode
			@returns {gf.vo.EpisodeVO}
		*/
		public getEpisode(episode: number): gf.vo.EpisodeVO
		{
			let result: gf.vo.EpisodeVO = null;

			this._episodes.forEach((episodeVO: gf.vo.EpisodeVO) =>
			{
				if (episodeVO.id == episode)
				{
					result = episodeVO;
					return false;
				}
				return true;
			});

			return result;
		}



		/*
			Get episode vo by level number
			@param level
			@returns {gf.vo.EpisodeVO}
		*/
		public getEpisodeByLevel(level: number): gf.vo.EpisodeVO
		{
			let result: gf.vo.EpisodeVO = null;

			this._episodes.forEach((episodeVO: gf.vo.EpisodeVO) =>
			{
				if (episodeVO.levels.indexOf(level) != -1)
				{
					result = episodeVO;
					return false;
				}
				return true;
			});

			return result;
		}



		/*
			Get the activations for an episode
			@param episode
			@returns {any[]}
		*/
		public getActivationsByEpisode(episode?: number): any[]
		{
			if (!episode)
			{
				return this._activations[this._current.id - 1]
			}

			return this._activations[episode - 1];
		}



		/*
			Unlock episode by user
			@param user  User data
			@param episode   Episode to unlock
			@returns {boolean}   Returns true if episode is unlocked
		*/
		public unlockEpisodeByUser(user: cas.vo.User, episode?: number): boolean
		{
			if (!episode)
			{
				this.unlockEpisodeByUser(user, this._current.id);
				return;
			}

			let activations: cas.vo.Friend[] = (this._activations[episode - 1]) ? this._activations[episode - 1] : [];
			let userFound: boolean = false;
			activations.forEach((value: cas.vo.Friend) =>
			{
				if (value && value.id == user.id)
				{
					userFound = true;
				}
			});

			if (!userFound)
			{
				activations.push(user);

				this._activations[episode - 1] = activations;
				this.game.storage.setItem("episodes", this._activations);
			}

			let episodeVO: gf.vo.EpisodeVO = this.getEpisode(episode);
			episodeVO.unlocked = this.isEpisodeUnlocked(episode);

			if (episodeVO.unlocked)
			{
				this.emit(gf.model.EPISODE_UNLOCKED, episode, activations);
			}

			return episodeVO.unlocked;
		}



		/*
			Unlock episode by time
			@param episode
		*/
		public unlockEpisodeByTime(episode: number): void
		{
			let episodeVO: gf.vo.EpisodeVO = this.getEpisode(episode);

			let activations: any[] = (this._activations[episode - 1]) ? this._activations[episode - 1] : [];
			activations.push("activatedByTimer");
			episodeVO.unlocked = this.isEpisodeUnlocked(episode);

			this._activations[episode - 1] = activations;
			this.game.storage.setItem("episodes", this._activations);

			if (episodeVO.unlocked)
			{
				if (episodeVO.id == 1 || this.game.levels.getLevelVO(this.getEpisode(episodeVO.id - 1).lastLevel).unlocked)
				{
					this._current = episodeVO;
					this.unlockLevelForEpisode(episodeVO.id);
				}
			}
		}



		public unlockEpisode(episode: number): void
		{
			this._activations[episode - 1] = ["default"];
			this.game.storage.setItem("episodes", this._activations);

			let episodeVO: gf.vo.EpisodeVO = this.getEpisode(episode);
			episodeVO.unlocked = this.isEpisodeUnlocked(episode);

			if (episodeVO.unlocked)
			{
				if (episodeVO.id == 1 || this.game.levels.getLevelVO(this.getEpisode(episodeVO.id - 1).lastLevel).unlocked)
				{
					this._current = episodeVO;
					this.unlockLevelForEpisode(episodeVO.id);
				}
			}
		}



		/*
			Check if the episode is unlocked
			@param episode
			@returns {boolean}
		*/
		public isEpisodeUnlocked(episode: number): boolean
		{
			if (episode > this._total) return false;

			let activations: any[] = this.getActivationsByEpisode(episode);

			if (activations && activations.length > 0)
			{
				return (activations.length == 3 || activations[0] == "default" || activations[0] == "activatedByCurrency" || activations[0] == "activatedByTimer");
			}

			return this.getEpisode(episode).unlocked;
		}



		/*
			Check if episode is already in progress of unlocking
			@param episode
			@returns {boolean}
		*/
		public isUnlocking(episode: number): boolean
		{
			let pending: number = this.game.storage.getItem("episodeToUnlock");
			if (!pending) return false;
			return pending == episode;
		}



		/*
			Check if the episode with the given level is unlocked
			@param level
			@returns {boolean}
		*/
		public isUnlocked(level: number): boolean
		{
			return this.getEpisodeByLevel(level).unlocked;
		}



		/*
			Get the last level number of the current episode
			@returns {number}
		*/
		public get lastLevel(): number
		{
			if (this._current)
			{
				return this._current.levels[this._current.levels.length - 1];
			}
		}



		/*
			Check if a next episode exists
			@returns {boolean}
		*/
		public get hasNext(): boolean
		{
			return this.current.id < this._total;
		}



		/*
			Get the previous episode
			@returns {gf.vo.EpisodeVO}
		*/
		public get previous(): gf.vo.EpisodeVO
		{
			if (this._current.id > 1)
				return this.getEpisode(this._current.id - 1);

			return null;
		}



		/*
			Get the next episode
			@returns {gf.vo.EpisodeVO}
		*/
		public get next(): gf.vo.EpisodeVO
		{
			if (this.hasNext)
				return this.getEpisode(this._current.id + 1);

			return null;
		}



		/*
			Set the current episode
			@param value
		*/
		public set current(value: gf.vo.EpisodeVO)
		{
			this._current = value;
		}



		/*
			Get the current episode
			@returns {gf.vo.EpisodeVO}
		*/
		public get current(): gf.vo.EpisodeVO
		{
			return this._current;
		}



		/*
			Get formated time (HH:MM:SS) to wait until the next episode unlocks
			@returns {string}
		*/
		public get formatedTime(): string
		{
			return gf.utils.Format.toHHMMSS(this.timeLeft);
		}



		/*
			Get total count of episodes
			@returns {number}
		*/
		public get total(): number
		{
			return this._total;
		}
	}
}
