/// <reference path="../../cuboro/stubs/abstract.ts"/>
/// <reference path="../../cuboro/vo/comment.ts"/>
/// <reference path="../../cuboro/vo/track.ts"/>



module cuboro.stubs
{
	export class Comment extends Abstract
	{
		constructor()
		{
			super();

			this.htmlEscapeStrings = false;
		}



		public saveTrackComment(
			trackId:number,
			comment:string,
			callback: ResultCB<boolean>):void
		{
			var params = {trackId:trackId, comment:comment};
			this.callService("Comment.saveTrackComment", params, response => callback(response.data, response.status));
		}



		public getTrackComment(
			trackId:number,
			callback:ResultCB<cuboro.vo.Comment[]>):void
		{
			var params = {trackId:trackId};
			this.callService("Comment.getTrackComment", params, response => callback(response.data, response.status));
		}


		public reportAbuse(
			commentId: number,
			callback: ResultCB<boolean>):void
		{
			var params = {commentId:commentId};
			this.callService("Comment.reportAbuse", params, response => callback(response.data, response.status));
		}
	}
}



var sComment = new cuboro.stubs.Comment();
