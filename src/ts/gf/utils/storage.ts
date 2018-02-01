module gf.utils
{
	export class Storage extends PIXI.utils.EventEmitter
	{
		protected _dataLocal: any;
		protected _dataServer: any;
		protected _dataFetched: boolean;
		protected _isSupported: boolean;
		protected _pending: any[];
		protected _running: boolean;

		public game: gf.core.Game;



		constructor(game: gf.core.Game)
		{
			super();

			this._dataLocal = {};
			this._dataServer = {};
			this._pending = [];
			this._running = false;
			this._dataFetched = false;

			this.checkIfSupported();

			this.game = game;

			this.game.user.on(gf.LOGIN, this.getData, this);
			this.game.user.on(gf.LOGOUT, () =>
			{
				this._dataFetched = false;
				this.clear(() => this.getData());
			}, this);
		}



		protected checkIfSupported(): void
		{
			this._isSupported = false;

			try
			{
				let key: string = "kr3mTest89476";
				localStorage.setItem(key, "xyz");
				localStorage.getItem(key);
				localStorage.removeItem(key);
				this._isSupported = true;
			}
			catch (e)
			{
			}
		}



		public getData(dispatch: boolean = true, callback?: (dataServer: any, dataLocal: any) => void, forceLocal: boolean = false): void
		{
			this._dataFetched = false;

			if (!this.isSupported)
			{
				this._dataLocal = {};
			}
			else
			{
				let decoded = localStorage.getItem(this.game.client.config.appName);
				if (decoded && window.atob)
					decoded = window.atob(decoded);
				else
					decoded = "{}";

				this._dataLocal = JSON.parse(decoded);
			}

			if (this.game.client.config.useCAS && navigator.onLine && !forceLocal)
			{
				let timeout = setTimeout(() =>
				{
					this.getData(dispatch, callback, true);
				}, 10000);

				casClient.getCookie(this.game.client.config.appName, (cookie: any) =>
				{
					clearTimeout(timeout);

					this._dataServer = cookie || {};
					this._dataFetched = true;

					if (dispatch)
					{
						this.emit(gf.DATA, this._dataServer, this._dataLocal);
					}
					if (callback)
					{
						callback(this._dataServer, this._dataLocal);
					}
				});
			}
			else
			{
				this._dataFetched = true;

				if (dispatch)
				{
					this.emit(gf.DATA, this._dataServer, this._dataLocal);
				}
				if (callback)
				{
					callback(this._dataServer, this._dataLocal);
				}
			}
		}



		/**
		* Clear all data (local and server)
		* @param {() => void} callback Callback
		*/
		public clear(callback?: () => void): void
		{
			this._dataLocal = {};
			this._dataServer = {};

			if (this.isSupported)
			{
				let encoded = JSON.stringify(this._dataLocal);
				if (window.btoa)
					encoded = window.btoa(encoded);

				localStorage.setItem(this.game.client.config.appName, encoded);
			}

			if (this.game.client.config.useCAS && navigator.onLine)
			{
				casClient.setCookie(this.game.client.config.appName, this._dataServer, () =>
				{
					if (callback)
					{
						callback();
					}
				});
			}
			else
			{
				if (callback)
				{
					callback();
				}
			}
		}



		/**
		* Getting an item from storage
		* @param {string} key  Key of the data
		* @param {boolean} localData   Wether to get item from local or server data
		* @returns {any}
		*/
		public getItem(key: string, localData: boolean = false): any
		{
			return localData ? this._dataLocal[key] : this._dataServer[key];
		}



		/**
		* Setting one or several items to storage
		* @param {string | string[]} key   Key or array of keys to set
		* @param {any | any[]} value   Value or array of values
		* @param {() => void} callback Callback function
		*/
		public setItem(key: string | string[], value: any | any[], callback?: () => void): void
		{
			if (typeof key === "string")
			{
				this._dataLocal[<string>key] = value;
				this._dataServer[<string>key] = value;
			}
			else
			{
				for (let i: number = 0; i < key.length; ++i)
				{
					this._dataLocal[key[i]] = value[i];
					this._dataServer[key[i]] = value[i];
				}
			}

			if (this.isSupported)
			{
				let encoded = JSON.stringify(this._dataLocal);
				if (window.btoa)
					encoded = window.btoa(encoded);

				localStorage.setItem(this.game.client.config.appName, encoded);
			}

			if (this.game.client.config.useCAS && navigator.onLine)
			{
				if (this._running)
				{
					this._pending.push(callback);
				}
				else
				{
					this.flush(callback);
				}
			}
			else
			{
				if (callback) callback();
			}
		}



		protected flush(callback: () => void): void
		{
			this._running = true;

			casClient.setCookie(this.game.client.config.appName, this._dataServer, () =>
			{
				if (this._pending.length > 0)
				{
					callback = this._pending.shift();
					this.flush(callback);
				}
				else
				{
					this._running = false;
				}

				if (callback) callback();
			});
		}



		public updateItem(key: string, value: any, callback?: () => void): void
		{
			this.setItem(key, $.extend({}, this.getItem(key), value), callback);
		}



		public get dataServer(): any
		{
			return this._dataServer;
		}



		public get dataLocal(): any
		{
			return this._dataLocal;
		}



		public get dataFetched(): boolean
		{
			return this._dataFetched;
		}



		public get isSupported(): boolean
		{
			return this._isSupported;
		}
	}
}
