/// <reference path="../../cuboro/stubs/user.ts"/>
/// <reference path="../../cuboro/vo/user.ts"/>
/// <reference path="../../kr3m/lib/cas.ts"/>
/// <reference path="../../kr3m/model/eventdispatcher.ts"/>



declare var casClient: cas.Client;



module cuboro.clientmodels
{
	export class User extends kr3m.model.EventDispatcher
	{
		private user: cuboro.vo.User;
		private casUser: cas.vo.User;



		constructor()
		{
			super();
			casClient.addEventListener(this.handleCasEvent.bind(this));
		}



		private handleCasEvent(eventName: string, params: any): void
		{
			switch (eventName)
			{
				case cas.EVENT_ONLINE:
					this.dispatch("login");
					casClient.getUser((casUser) =>
					{
						casClient.getToken((casToken) =>
						{
							sUser.login(casUser.id, casToken, (user, status) =>
							{
								if (status != kr3m.SUCCESS)
								{
									this.user = null;
									this.casUser = null;
									return;
								}

								this.user = user;
								this.casUser = casUser;
								this.dispatch("loggedIn");
							});
						});
					});
					break;

				case cas.EVENT_LOGOUT:
					this.user = null;
					this.casUser = null;
					sUser.logout();
					this.dispatch("logout");
					break;
			}
		}



		public isLoggedIn(): boolean
		{
			return !!this.user;
		}



		public getUserId(): number
		{
			return this.isLoggedIn() ? this.user.id : null;
		}



		public getUser(): cuboro.vo.User
		{
			return this.isLoggedIn() ? this.user : null;
		}
	}
}



var mUser = new cuboro.clientmodels.User();
