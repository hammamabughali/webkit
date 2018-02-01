//# SERVER
/// <reference path="../../cuboro/tables/commentvo.ts"/>
/// <reference path="../../cuboro/tables/uservo.ts"/>
//# /SERVER



module cuboro.vo
{
	export class Comment
	{
		public comment: string;
		public createdWhen: Date;
		public trackId: number;
		public userId: number;
		public name: string;
		public id:number;



//# SERVER
		constructor(comment: cuboro.tables.CommentVO, user: cuboro.tables.UserVO)
		{
			this.comment = comment.comment;
			this.createdWhen = comment.createdWhen;
			this.trackId= comment.trackId;
			this.userId = comment.userId;
			this.name  =  user.name;
			this.id = comment.id;
		}
//# /SERVER
	}
}
