/// <reference path="../../cuboro/vo/user.ts"/>
/// <reference path="../../kr3m/lib/cas.ts"/>
/// <reference path="../../kr3m/lib/casbackend.ts"/>



module cuboro.models
{
	export class User
	{
//# DEBUG
		private casBackend = new cas.Backend("zonVmeCVwn8hWGzMWuGM", "hu823ji9sdioAS9fdsHJDAS");
//# /DEBUG
//# RELEASE
		private casBackend = new cas.Backend("nmbOLHABGYfAsiAy8gnt", "hu823ji9sdioAS9fdsHJDAS");
//# /RELEASE



		public getFromContext(
			context:Context,
			callback:CB<cuboro.vo.User>):void
		{
			context.need({session : true}, () =>
			{
				var user = context.session.getValue("user");
				callback(user);
			}, () => callback(undefined));
		}



		public login(
			context:Context,
			casUserId:number,
			casToken:string,
			callback:ResultCB<cuboro.vo.User>):void
		{
			this.casBackend.getUser(casUserId, casToken, (casUser) =>
			{
				if (!casUser)
					return callback(undefined, kr3m.ERROR_DENIED);

				context.need({session : true, region : true}, () =>
				{
					var user = new cuboro.tables.UserVO();
					user.id = casUser.id;
					user.name = casUser.name;
					user.imageUrl = casUser.imageUrl;
					user.lastRegionId = context.region.id;
					user.upsert(() =>
					{
						var vo = new cuboro.vo.User(user);
						context.session.setValue("user", vo);
						callback(vo, kr3m.SUCCESS);
					}, () => callback(undefined, kr3m.ERROR_DATABASE));
				}, () => callback(undefined, kr3m.ERROR_INTERNAL));
			}, () => callback(undefined, kr3m.ERROR_EXTERNAL));
		}



		public logout(
			context:Context,
			callback:StatusCallback):void
		{
			context.need({session : true}, () =>
			{
				context.session.deleteValue("user");
				callback(kr3m.SUCCESS);
			}, () => callback(kr3m.ERROR_INTERNAL));
		}
	}
}



var mUser = new cuboro.models.User();
