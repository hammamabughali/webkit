/// <reference path="../util/stringex.ts"/>

//# SERVER
/// <reference path="../lib/node.ts"/>
//# /SERVER



module kr3m.net
{
	export class MimeTypes
	{
		public static contentTypesByExtension =
		{
			".3gp" : "video/3gpp",
			".avi" : "video/x-msvideo",
			".bat" : "text/plain",
			".css" : "text/css",
			".csv" : "text/x-csv",
			".eot" : "application/vnd.ms-fontobject",
			".flv" : "video/x-flv",
			".gif" : "image/gif",
			".html" : "text/html",
			".ico" : "image/x-icon",
			".jpeg" : "image/jpeg",
			".jpg" : "image/jpeg",
			".js" : "text/javascript",
			".json" : "text/json",
			".m3u8" : "application/x-mpegURL",
			".md5anim" : "text/plain",
			".md5mesh" : "text/plain",
			".mov" : "video/quicktime",
			".mp3" : "audio/mpeg",
			".mp4" : "video/mp4",
			".ogg" : "audio/ogg",
			".ogm" : "video/ogg",
			".ogv" : "video/ogg",
			".otf" : "application/x-font-opentype",
			".pdf" : "application/pdf",
			".php" : "text/html",
			".png" : "image/png",
			".svg" : "image/svg+xml",
			".ts" : "video/MP2T",
			".ttf" : "application/x-font-truetype",
			".txt" : "text/plain",
			".wav" : "audio/wav",
			".webm" : "video/webm",
			".wmv" : "video/x-ms-wmv",
			".woff" : "application/font-woff",
			".xml" : "text/xml",
			".zip" : "application/zip"
		};



		public static getMimeTypeByUrl(
			url:string,
			fallbackType = "application/octet-stream"):string
		{
			var extension = "." + kr3m.util.StringEx.getAfter(url, ".", false).toLowerCase();
			extension = kr3m.util.StringEx.getBefore(extension, "?");
			var contentType = kr3m.net.MimeTypes.contentTypesByExtension[extension] || fallbackType;
			return contentType;
		}



//# !CLIENT
		public static getMimeTypeByFileName(fileName:string):string
		{
			var extension = pathLib.extname(fileName).toLowerCase();
			var contentType = kr3m.net.MimeTypes.contentTypesByExtension[extension] || "application/octet-stream";
			return contentType;
		}
//# /!CLIENT



		public static isImageType(contentType:string):boolean
		{
			return contentType.substr(0, 6) == "image/";
		}



		public static isImage(filePathOrUrl:string):boolean
		{
			return MimeTypes.isImageType(MimeTypes.getMimeTypeByUrl(filePathOrUrl));
		}



		public static isTextType(contentType:string):boolean
		{
			if (contentType == "text")
				return true;

			if (contentType.substr(0, 5) == "text/")
				return true;

			if (contentType == "application/xml")
				return true;

			return false;
		}



		public static isText(filePathOrUrl:string):boolean
		{
			return MimeTypes.isTextType(MimeTypes.getMimeTypeByUrl(filePathOrUrl));
		}
	}
}
