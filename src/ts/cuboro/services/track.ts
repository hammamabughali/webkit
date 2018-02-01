/// <reference path="../../cuboro/models/pdf.ts"/>
/// <reference path="../../cuboro/models/track.ts"/>
/// <reference path="../../cuboro/services/abstract.ts"/>
/// <reference path="../../cuboro/vo/track.ts"/>



module cuboro.services
{
	export class Track extends Abstract
	{
		public generateUniqueRandomName(
			context:cuboro.Context,
			params:any,
			callback:CB<kr3m.services.CallbackResult<string>>):void
		{
			var helper = new kr3m.services.ParamsHelper(params);
			if (!helper.validate({namePrefix : "string"}))
				return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));

			mPdf.generateUniqueRandomName(params.namePrefix, (name, status) =>
			{
				callback(new kr3m.services.CallbackResult(status, name));
			});
		}



		public load(
			context:cuboro.Context,
			params:any,
			callback:CB<kr3m.services.CallbackResult<cuboro.vo.Track>>):void
		{
			var helper = new kr3m.services.ParamsHelper(params);
			if (!helper.validate({trackId : "uint"}))
				return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));

			mTrack.load(params.trackId, (track, status) => callback(new kr3m.services.CallbackResult(status, track)));
		}



		public save(
			context:cuboro.Context,
			params:any,
			callback:CB<kr3m.services.CallbackResult<cuboro.vo.Track>>):void
		{
			var helper = new kr3m.services.ParamsHelper(params);
			if (!helper.validate({trackData : "object", name : "string", overwrite : "boolean"}))
				return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));

			mUser.getFromContext(context, (user) =>
			{
				if (!user)
					return callback(new kr3m.services.CallbackResult(kr3m.ERROR_DENIED));

				mTrack.save(user.id, params.trackData, params.name, params.overwrite, params.previousId, (track, status) =>
				{
					callback(new kr3m.services.CallbackResult(status, track));
				});
			});
		}


		public saveTrackImage(
			context:cuboro.Context,
			params:any,
			callback:CB<kr3m.services.CallbackResult<String>>):void
		{
			var helper = new kr3m.services.ParamsHelper(params);
			if (!helper.validate({trackId:"number", name : "string", trackImage: "string"}))
				return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));

			mUser.getFromContext(context, (user) =>
			{
				if (!user)
					return callback(new kr3m.services.CallbackResult(kr3m.ERROR_DENIED));

				mTrack.saveImageTrack(user.id, params.name, params.trackId, params.trackImage, (imageUrl, status) =>
				{
					callback(new kr3m.services.CallbackResult(status, imageUrl));
				});
			});
		}



		public delete(
			context:cuboro.Context,
			params:any,
			callback:CB<kr3m.services.CallbackResult>):void
		{
			var helper = new kr3m.services.ParamsHelper(params);
			if (!helper.validate({trackId : "uint"}))
				return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));

			mUser.getFromContext(context, (user) =>
			{
				if (!user)
					return callback(new kr3m.services.CallbackResult(kr3m.ERROR_DENIED));

				mTrack.delete(user.id, params.trackId, status => callback(new kr3m.services.CallbackResult(status)));
			});
		}



		public publish(
			context:cuboro.Context,
			params:any,
			callback:CB<kr3m.services.CallbackResult>):void
		{
			var helper = new kr3m.services.ParamsHelper(params);
			if (!helper.validate({trackId : "uint", name: "string"}))
				return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));

			mUser.getFromContext(context, (user) =>
			{
				if (!user)
					return callback(new kr3m.services.CallbackResult(kr3m.ERROR_DENIED));

				mTrack.publish(user.id, params.trackId, params.name, status => callback(new kr3m.services.CallbackResult(status)));
			});
		}



		public unpublish(
			context:cuboro.Context,
			params:any,
			callback:CB<kr3m.services.CallbackResult>):void
		{
			var helper = new kr3m.services.ParamsHelper(params);
			if (!helper.validate({trackId : "uint"}))
				return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));

			mUser.getFromContext(context, (user) =>
			{
				if (!user)
					return callback(new kr3m.services.CallbackResult(kr3m.ERROR_DENIED));

				mTrack.unpublish(user.id, params.trackId, status => callback(new kr3m.services.CallbackResult(status)));
			});
		}



		public isNameUnique(
			context:cuboro.Context,
			params:any,
			callback:CB<kr3m.services.CallbackResult<boolean>>):void
		{
			var helper = new kr3m.services.ParamsHelper(params);
			if (!helper.validate({trackId : "uint", newName : "string"}))
				return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));

			mTrack.isNameUnique(params.trackId, params.newName, (isUnique, status) =>
			{
				callback(new kr3m.services.CallbackResult(status, isUnique));
			});
		}



		public isPublished(
			context:cuboro.Context,
			params:any,
			callback:CB<kr3m.services.CallbackResult<boolean>>):void
		{
			var helper = new kr3m.services.ParamsHelper(params);
			if (!helper.validate({trackId : "uint"}))
				return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));

			mTrack.isPublished(params.trackId, (isPublished, status) =>
			{
				callback(new kr3m.services.CallbackResult(status, isPublished));
			});
		}


		public getHistory(
			context:cuboro.Context,
			params:any,
			callback:CB<kr3m.services.CallbackResult<cuboro.vo.History>>):void
		{
			var helper = new kr3m.services.ParamsHelper(params);
			if (!helper.validate({trackId : "uint"}))
				return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));

			mTrack.getHistory(params.trackId, (status, history) => callback(new kr3m.services.CallbackResult(history, status)));
		}
	}
}
