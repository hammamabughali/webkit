/// <reference path="../../../db/mysqlfs.ts"/>
/// <reference path="../../../net/subserver2.ts"/>



module kr3m.net.subservers.dbfiles
{
	export class MySqlFileServer extends kr3m.net.SubServer2
	{
		private fs:kr3m.db.MySqlFs;
		private resourcePrefix:string;



		constructor(fs:kr3m.db.MySqlFs, resourcePrefix:string = "public/")
		{
			super();
			this.fs = fs;
			this.resourcePrefix = resourcePrefix;
		}



		public needsSession(
			context:kr3m.net.RequestContext,
			callback:(needSession:boolean) => void):void
		{
			callback(false);
		}



		public handleRequest(
			context:kr3m.net.RequestContext,
			callback:(wasHandled:boolean) => void):void
		{
			var path = context.uriResourcePath.slice(this.resourcePrefix.length);
			this.fs.get(path, (content:NodeBuffer, metadata:any) =>
			{
				if (!content)
				{
					context.setResponseContent("500 Error\n");
					context.flushResponse(500);
					return;
				}

				context.setResponseContent(content, metadata.mimeType);
				context.flushResponse(200);
			});
			callback(true);
		}
	}
}
