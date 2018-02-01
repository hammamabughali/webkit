/// <reference path="../../cuboro/models/user.ts"/>
/// <reference path="../../cuboro/tables/commentstable.ts"/>
/// <reference path="../../cuboro/tables/commentvo.ts"/>
/// <reference path="../../cuboro/tables/trackstable.ts"/>
/// <reference path="../../cuboro/tables/trackvo.ts"/>
/// <reference path="../../cuboro/vo/comment.ts"/>
/// <reference path="../../cuboro/vo/gallery/filters.ts"/>



module cuboro.models
{
	export class Comment
	{
		public saveTrackComment(
			usreId:number,
			trackId: number,
			comment: string,
			callback: ResultCB<boolean>): void
		{
			let commentVo = new cuboro.tables.CommentVO();
			commentVo.comment = comment;
			commentVo.trackId = trackId;
			commentVo.userId = usreId;
			commentVo.upsert(() => callback(true, kr3m.SUCCESS), () => callback(false, kr3m.ERROR_DATABASE));
		}



		public getTrackComment(
			trackId:number,
			callback:ResultCB<cuboro.vo.Comment[]>):void
		{
			tTracks.getById(trackId, (track) =>
			{
				track.getComments((comments) =>
				{
					kr3m.util.Util.sortBy(comments, "createdWhen");
					var userIds = kr3m.util.Util.gatherUnique(comments, "userId");
					tUsers.getByIds(userIds, (usersById) =>
					{
						var vos = comments.map(comment => new cuboro.vo.Comment(comment, usersById[comment.userId]));

						kr3m.util.Util.sortBy(vos, 'createdWhen', false);

						callback(vos, kr3m.SUCCESS);
					});
				});
			});
		}



		public reportAbuse(
			context: cuboro.Context,
			reporterUser:cuboro.vo.User,
			commentId:number,
			callback: ResultCB<boolean>): void
		{
			tComments.getById(commentId, (comment)=>
			{
				if(!comment)
					callback(false, kr3m.ERROR_EMPTY_DATA);

				var report = new cuboro.tables.ReportscommentVO();
				report.userId = reporterUser.id;
				report.commentId = comment.id;

				report.insert((inserId)=>
				{
					mMail.sendReportAbuse(context, reporterUser, comment , (isSend) =>
					{
						callback(true, kr3m.SUCCESS);
					});
				},
				(error)=>
				{
					callback(false, kr3m.ERROR_DATABASE);
				});
			},
			(error)=>
			{
				callback(false, kr3m.ERROR_DATABASE);
			});
		}
	}
}



var mComment = new cuboro.models.Comment();
