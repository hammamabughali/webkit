/// <reference path="../../cuboro/stubs/abstract.ts"/>
/// <reference path="../../cuboro/vo/gallery/filters.ts"/>
/// <reference path="../../cuboro/vo/gallery/page.ts"/>
/// <reference path="../../cuboro/vo/track.ts"/>



module cuboro.stubs
{
	export class Gallery extends Abstract
	{
		public getPage(
			filters: cuboro.vo.gallery.Filters,
			callback: ResultCB<cuboro.vo.gallery.Page>): void
		{
			var params = {filters: filters};
			this.callService("Gallery.getPage", params, response => callback(response.data, response.status));
		}
	}
}



var sGallery = new cuboro.stubs.Gallery();
