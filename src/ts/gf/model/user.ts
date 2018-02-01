/// <reference path="../model/lives.ts"/>
/// <reference path="../model/progress.ts"/>



module gf.model
{
	export class User extends PIXI.utils.EventEmitter
	{
		protected _email: string = "";
		protected _id: number = 0;
		protected _isLoggedIn: boolean = false;
		protected _imageUrl: string = "";
		protected _name: string = "";

		public game: gf.core.Game;
		public lives: gf.model.Lives;
		public progress: gf.model.Progress;



		constructor(game: gf.core.Game)
		{
			super();

			this.game = game;
		}



		protected onLoggedIn(status: string, callback: (status: string) => void): void
		{
			if (status.toLowerCase() == gf.SUCCESS)
			{
				this._isLoggedIn = true;
				this.emit(gf.LOGIN);
				this.getUser(() =>
				{
					callback(gf.SUCCESS);
				});
			}
			else
			{
				callback(status);
			}
		}



		public getLoginStatus(callback: (result: boolean) => void): void
		{
			casClient.isLoggedIn((result: boolean) =>
			{
				if (result)
				{
					this._isLoggedIn = true;
					this.emit(gf.LOGIN);
					this.getUser(() =>
					{
						callback(true);
					});
				}
				else
				{
					callback(false);
				}
			});
		}



		public getUser(callback: () => void): void
		{
			casClient.getUser((user: any) =>
			{
				this._id = user.id;
				this._name = user.username;
				this._imageUrl = user.imageUrl;

				if (user.email && user.email.length > 0)
				{
					this._email = user.email;
				}

				callback();
			});
		}



		public login(callback: (status: string) => void): void
		{
			if (this._isLoggedIn) return;

			if (this.game.client.config.hasRaffle)
				casClient.ui.showRaffleDialog((status: string) => this.onLoggedIn(status, callback));
			else
				casClient.ui.showLoginDialog((status: string) => this.onLoggedIn(status, callback));
		}



		public logout(callback: () => void): void
		{
			if (!this._isLoggedIn) return;

			casClient.logout(() =>
			{
				this._isLoggedIn = false;
				this.emit(gf.LOGOUT);
				callback();
			});
		}



		public raffle(callback: (response: string) => void): void
		{
			casClient.ui.showRaffleDialog((status: string) =>
			{
				if (status.toLowerCase() == gf.SUCCESS)
				{
					this._isLoggedIn = true;
					this.emit(gf.LOGIN);
					this.getUser(() =>
					{
						callback(gf.SUCCESS);
					});
				}
				else
				{
					callback(status);
				}
			});
		}



		public showAccountDialog(callback?: (response: string) => void): void
		{
			casClient.ui.showAccountDialog((status: string) =>
			{
				if (callback)
					callback(status);
			});
		}



		public get isLoggedIn(): boolean
		{
			return this._isLoggedIn;
		}



		public get email(): string
		{
			return this._email;
		}



		public get id(): number
		{
			return this._id;
		}



		public get imageUrl(): string
		{
			return this._imageUrl;
		}



		public get name(): string
		{
			return this._name;
		}
	}
}
