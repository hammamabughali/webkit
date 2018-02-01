/// <reference path="../../cuboro/models/comment.ts"/>
/// <reference path="../../cuboro/services/abstract.ts"/>



module cuboro.services
{
	export class Comment extends Abstract
	{
		public saveTrackComment(
			context:cuboro.Context,
			params:any,
			callback:CB<kr3m.services.CallbackResult<boolean>>):void
		{
			var helper = new kr3m.services.ParamsHelper(params);
			if (!helper.validate({trackId : "uint", comment : "string"}))
				return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));

			mUser.getFromContext(context, (user) =>
			{
				if (!user)
					return callback(new kr3m.services.CallbackResult(kr3m.ERROR_DENIED));

				mComment.saveTrackComment(user.id, params.trackId, params.comment, (status, isSaved) => callback(new kr3m.services.CallbackResult(isSaved, status)));
			});
		}

		

		public getTrackComment(
			context:cuboro.Context,
			params:any,
			callback:CB<kr3m.services.CallbackResult<cuboro.vo.Comment[]>>):void
		{
			var helper = new kr3m.services.ParamsHelper(params);
			if (!helper.validate({trackId : "uint"}))
				return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));

			mComment.getTrackComment(params.trackId, (status, comment) => callback(new kr3m.services.CallbackResult(comment, status)));
		}


		public reportAbuse(
			context:cuboro.Context,
			params:any,
			callback:CB<kr3m.services.CallbackResult<boolean>>):void
		{
			var helper = new kr3m.services.ParamsHelper(params);
			if (!helper.validate({commentId : "uint"}))
				return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));

			mUser.getFromContext(context, (user) =>
			{
				if (!user)
					return callback(new kr3m.services.CallbackResult(kr3m.ERROR_DENIED));

				mComment.reportAbuse(context, user, params.commentId, (status, isReportAbused) => callback(new kr3m.services.CallbackResult(isReportAbused, status)));
			});
		}
	}
}
