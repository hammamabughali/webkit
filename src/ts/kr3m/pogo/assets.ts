/// <reference path="../loading/assetlibrary.ts"/>
/// <reference path="../pogo/data/fontmeta.ts"/>
/// <reference path="../types.ts"/>



module pogo
{
	export class AssetLibrary extends kr3m.loading.AssetLibrary
	{
		private fonts:{[url:string]:pogo.data.FontMeta} = {};



		public getFontMeta(
			fontUrl:string,
			callback:CB<pogo.data.FontMeta>,
			priority = 0):void
		{
			var font = this.fonts[fontUrl];
			if (font)
				return callback(font);

			this.get(fontUrl, (fontXml:XMLDocument) =>
			{
				font = this.fonts[fontUrl];
				if (font)
					return callback(font);

				font = new pogo.data.FontMeta(fontUrl, fontXml);
				this.fonts[fontUrl] = font;
				callback(font);
			}, priority);
		}
	}



	export const assets = new pogo.AssetLibrary();
}
