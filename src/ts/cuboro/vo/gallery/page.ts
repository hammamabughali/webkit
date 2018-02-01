/// <reference path="../../../cuboro/vo/gallery/filters.ts"/>
/// <reference path="../../../cuboro/vo/track.ts"/>



module cuboro.vo.gallery
{
	export class Page
	{
		public usedFilters:Filters;
		public tracks:cuboro.vo.Track[];
		public totalCount:number;
	}
}
