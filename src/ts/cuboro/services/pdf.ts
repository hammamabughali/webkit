/// <reference path="../../cuboro/models/track.ts"/>
/// <reference path="../../cuboro/services/abstract.ts"/>
/// <reference path="../../cuboro/vo/track.ts"/>



module cuboro.services
{
	export class Pdf extends Abstract
	{
		public printPdf(
			context:cuboro.Context,
			params:any,
			callback:(url:string) => void):void
		{
			var helper = new kr3m.services.ParamsHelper(params);
			if (!helper.validate({trackId:"uint",screenshot : "string"}))
				return callback(kr3m.ERROR_PARAMS);

			mTrack.printPdf(context, params.trackId, params.screenshot, callback);
		}
	}
}
