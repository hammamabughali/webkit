/// <reference path="../../util/url.ts"/>



module pogo.data
{
	export class FontChar
	{
		public id:number;
		public x:number;
		public y:number;
		public width:number;
		public height:number;
		public xoffset:number;
		public yoffset:number;
		public xadvance:number;
		public page:number;
		public chnl:number;
	}



	export class FontMeta
	{
		public url:string;
		public face:string;
		public size:number;
		public bold:number;
		public italic:number;
		public charset:string;
		public unicode:string;
		public stretchH:number;
		public smooth:number;
		public aa:number;
		public padding:number[] = [];
		public spacing:number[] = [];
		public outline:number;
		public lineHeight:number;
		public base:number;
		public scaleW:number;
		public scaleH:number;
		public packed:number;
		public pages:string[] = [];
		public chars:{[charCode:number]:FontChar} = {};



		constructor(fontUrl:string, raw:any)
		{
			this.url = fontUrl;

			var pages = raw.pages.page.length ? raw.pages.page : [raw.pages.page];
			for (var i = 0; i < pages.length; ++i)
				this.pages.push(kr3m.util.Url.merge(fontUrl, pages[i]._attributes.file));

			var info = raw.info;
			var common = raw.common;
			var chars = raw.chars.char;

			this.face = info._attributes.face;
			this.size = parseInt(info._attributes.size, 10);
			this.bold = parseInt(info._attributes.bold, 10);
			this.italic = parseInt(info._attributes.italic, 10);
			this.charset = info._attributes.charset;
			this.unicode = info._attributes.unicode;
			this.stretchH = parseInt(info._attributes.stretchH, 10);
			this.smooth = parseInt(info._attributes.smooth, 10);
			this.aa = parseInt(info._attributes.aa, 10);
			this.padding = info._attributes.padding.split(",").map(p => parseInt(p, 10));
			this.spacing = info._attributes.spacing.split(",").map(p => parseInt(p, 10));
			this.outline = parseInt(info._attributes.outline, 10);
			this.lineHeight = parseInt(common._attributes.lineHeight, 10);
			this.base = parseInt(common._attributes.base, 10);
			this.scaleW = parseInt(common._attributes.scaleW, 10);
			this.scaleH = parseInt(common._attributes.scaleH, 10);
			this.packed = parseInt(common._attributes.packed, 10);

			for (var i = 0; i < chars.length; ++i)
			{
				var c = chars[i];
				var char = new pogo.data.FontChar();
				char.id = parseInt(c._attributes.id, 10);
				char.x = parseInt(c._attributes.x, 10);
				char.y = parseInt(c._attributes.y, 10);
				char.width = parseInt(c._attributes.width, 10);
				char.height = parseInt(c._attributes.height, 10);
				char.xoffset = parseInt(c._attributes.xoffset, 10);
				char.yoffset = parseInt(c._attributes.yoffset, 10);
				char.xadvance = parseInt(c._attributes.xadvance, 10);
				char.page = parseInt(c._attributes.page, 10);
				char.chnl = parseInt(c._attributes.chnl, 10);
				this.chars[char.id] = char;
			}
		}
	}
}
