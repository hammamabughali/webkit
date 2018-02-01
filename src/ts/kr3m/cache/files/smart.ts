/// <reference path="../../cache/files/abstract.ts"/>
/// <reference path="../../cache/files/downloads.ts"/>
/// <reference path="../../cache/files/localfiles.ts"/>
/// <reference path="../../util/url.ts"/>



module kr3m.cache.files
{
	/*
		A mix of LocalFiles and Downloads that choses either
		depending on the given path / url.
	*/
	export class Smart extends Abstract
	{
		private static instance:Smart;



		constructor(
			protected downloads:Downloads,
			protected localFiles:LocalFiles
		)
		{
			super();
		}



		public static getInstance():Smart
		{
			if (!Smart.instance)
				Smart.instance = new Smart(Downloads.getInstance(), LocalFiles.getInstance());
			return Smart.instance;
		}



		public isRemote(path:string):boolean
		{
			var parts = kr3m.util.Url.parse(path);
			return !!parts.protocol;
		}



		private getSub(path:string):Abstract
		{
			return this.isRemote(path) ? this.downloads : this.localFiles;
		}



		public getFile(
			path:string,
			callback:CB<Buffer>):void
		{
			this.getSub(path).getFile(path, callback);
		}



		public getTextFile(
			path:string,
			callback:CB<string>):void
		{
			this.getSub(path).getTextFile(path, callback);
		}



		public getModified(
			path:string,
			callback:CB<Date>):void
		{
			this.getSub(path).getModified(path, callback);
		}



		public setDirty(
			path:string,
			callback?:Callback):void
		{
			this.getSub(path).setDirty(path, callback);
		}
	}
}
