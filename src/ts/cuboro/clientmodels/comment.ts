/// <reference path="../../cuboro/stubs/comment.ts"/>
/// <reference path="../../kr3m/model/eventdispatcher.ts"/>



module cuboro.clientmodels
{
	export class Comment extends kr3m.model.EventDispatcher
	{
		constructor()
		{
			super();
		}


		public saveTrackComment(trackId: number,  comment: string)
		{
			sComment.saveTrackComment(trackId,
				comment,
				(status) =>
			{
				console.log("status ", status);
			});
		}


		public reportAbuse(commentId:number)
		{
			sComment.reportAbuse(commentId, (status) =>
			{
				console.log(" status ", status);
			});
		}
	}
}



var mComment = new cuboro.clientmodels.Comment();
