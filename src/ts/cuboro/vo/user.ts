//# SERVER
/// <reference path="../../cuboro/tables/uservo.ts"/>
//# /SERVER



module cuboro.vo
{
	export class User
	{
		public id:number;
		public name:string;
		public imageUrl:string;

		public isAdmin:boolean;



//# SERVER
		constructor(user?:cuboro.tables.UserVO, isAdmin?:boolean)
		{
			if (user)
			{
				this.id = user.id;
				this.name = user.name;
				this.imageUrl = user.imageUrl;

				this.isAdmin = isAdmin;
			}
		}
//# /SERVER
	}
}
