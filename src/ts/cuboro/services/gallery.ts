/// <reference path="../../cuboro/models/gallery.ts"/>
/// <reference path="../../cuboro/services/abstract.ts"/>
/// <reference path="../../cuboro/vo/gallery/filters.ts"/>
/// <reference path="../../cuboro/vo/gallery/page.ts"/>



module cuboro.services
{
	export class Gallery extends Abstract
	{
		public getPage(
			context:cuboro.Context,
			params:any,
			callback:CB<kr3m.services.CallbackResult<cuboro.vo.gallery.Page>>):void
		{
			const helper = new kr3m.services.ParamsHelper(params);
			if (!helper.validate({filters : "cuboro.vo.gallery.Filters"}))
				return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));

			mGallery.getPage(context, params.filters, (page, status) => callback(new kr3m.services.CallbackResult(status, page)));
		}
	}
}
