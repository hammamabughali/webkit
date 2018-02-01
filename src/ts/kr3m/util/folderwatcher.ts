/// <reference path="../async/if.ts"/>
/// <reference path="../lib/node.ts"/>
/// <reference path="../types.ts"/>
/// <reference path="../util/file.ts"/>



module kr3m.util
{
	type FWTimestamps = {[name:string]:number};



	class FWPollMeta
	{
		public listeners:StringCallback[] = [];
		public files:FWTimestamps;
	}



	class FWEventMeta
	{
		public lastCalled:FWTimestamps = {};
		public listeners:{prefix:string, listener:StringCallback}[] = [];
	}



	/*
		This class can be used to call listener functions when
		files in selected folders on the file system change.

		If the static property usePolling is set to true, FolderWatcher
		will use polling instead of the native OS-events for file changes.
		This can be used in situations where the OS-events create problems
		with undesired side effects. For example some OSs prevent folders
		with FolderWatchers on them from being deleted. Polling isn't a
		very elegant solution but it works reliable even when using
		multi-process clusters. Still, if everything works as desired
		without polling, do not use it.
	*/
	export class FolderWatcher
	{
		private static pollMetaFlat:{[path:string]:FWPollMeta} = {};
		private static pollMetaRecursive:{[path:string]:FWPollMeta} = {};
		private static eventsMeta:{[path:string]:FWEventMeta} = {};

		private static pollNext = 0;
		private static pollRecursive = false;
		private static polling = false;

		public static usePolling = false;



		private static getTimestamps(
			path:string,
			recursive:boolean,
			callback:CB<FWTimestamps>):void
		{
			File.folderExists(path, (exists) =>
			{
				if (!exists)
					return callback({});

				var timestamps:FWTimestamps = {};
				File.crawlAsync(path, (relativePath, next, isFolder, absolutePath) =>
				{
					fsLib.stat(absolutePath, (err:Error, stats:any) =>
					{
						if (err)
							return next();

						timestamps[relativePath] = stats.mtime.getTime();
						next();
					});
				}, {wantFiles : true, wantFolders : false, recursive : recursive}, () =>
				{
					callback(timestamps);
				});
			});
		}



		private static poll():void
		{
			var metas = FolderWatcher.pollRecursive ? FolderWatcher.pollMetaRecursive : FolderWatcher.pollMetaFlat;
			var paths = Object.keys(metas);
			if (FolderWatcher.pollNext < paths.length)
			{
				var path = paths[FolderWatcher.pollNext];
				var meta = metas[path];
				if (!meta.files)
				{
					++FolderWatcher.pollNext;
					setTimeout(FolderWatcher.poll, 10);
					return;
				}

				var changed:string[] = [];
				FolderWatcher.getTimestamps(path, FolderWatcher.pollRecursive, (timestamps) =>
				{
					for (var file in timestamps)
					{
						if (meta.files[file] != timestamps[file])
							changed.push(file);

						delete meta.files[file];
					}

					for (var file in meta.files)
						changed.push(file);

					meta.files = timestamps;
					for (var i = 0; i < changed.length; ++i)
					{
						for (var j = 0; j < meta.listeners.length; ++j)
							meta.listeners[j](changed[i]);
					}

					++FolderWatcher.pollNext;
					setTimeout(FolderWatcher.poll, 100);
				});
			}
			else
			{
				FolderWatcher.pollNext = 0;
				FolderWatcher.pollRecursive = !FolderWatcher.pollRecursive;
				setTimeout(FolderWatcher.poll, 10);
			}
		}



		private static watchPolling(
			realPath:string,
			listener:StringCallback,
			recursive:boolean):void
		{
			var metas = recursive ? FolderWatcher.pollMetaRecursive : FolderWatcher.pollMetaFlat;

			if (!metas[realPath])
				metas[realPath] = new FWPollMeta();

			var meta = metas[realPath];
			meta.listeners.push(listener);

			if (meta.listeners.length > 1)
				return;

			if (!FolderWatcher.polling)
			{
				FolderWatcher.polling = true;
				FolderWatcher.poll();
			}

			FolderWatcher.getTimestamps(realPath, recursive, (files) =>
			{
				meta.files = files;
			});
		}



		private static handleEvent(path:string, eventType:string, fileName?:string):void
		{
			var meta = FolderWatcher.eventsMeta[path];
			if (!meta)
				return;

			var now = Date.now();
			var threshold = now - 1000;
			var changedFiles:FWTimestamps = {};
			kr3m.async.If.thenElse(fileName, (thenDone) =>
			{
				// on OSes that provide a filename, use it
				changedFiles[fileName] = now;
				thenDone();
			}, (elseDone) =>
			{
				// on OSes that don't provide a filename, get all files that changed within the last second
				FolderWatcher.getTimestamps(path, false, (timestamps) =>
				{
					for (fileName in timestamps)
					{
						if (timestamps[fileName] > threshold)
							changedFiles[fileName] = timestamps[fileName];
					}
					elseDone();
				});
			}, () =>
			{
				for (fileName in changedFiles)
				{
					// prevent redundant listener calls for the same change event on OSes that trigger multiple events
					if ((meta.lastCalled[fileName] || 0) <= threshold)
					{
						for (var i = 0; i < meta.listeners.length; ++i)
							meta.listeners[i].listener(meta.listeners[i].prefix + fileName);
					}
					meta.lastCalled[fileName] = now;
				}
			});
		}



		private static watchEvents(
			realPath:string,
			listener:StringCallback,
			recursive:boolean):void
		{
			var paths = [realPath];
			kr3m.async.If.then(recursive, (thenDone) =>
			{
				File.getSubFolders(realPath, true, (subFolders) =>
				{
					paths = subFolders.map(subFolder => realPath + "/" + subFolder);
					paths.unshift(realPath);
					thenDone();
				});
			}, () =>
			{
				for (var i = 0; i < paths.length; ++i)
				{
					if (!FolderWatcher.eventsMeta[paths[i]])
						FolderWatcher.eventsMeta[paths[i]] = new FWEventMeta();

					var prefix = paths[i].slice(realPath.length + 1);
					if (prefix)
						prefix += "/";

					FolderWatcher.eventsMeta[paths[i]].listeners.push({prefix : prefix, listener : listener});
					if (FolderWatcher.eventsMeta[paths[i]].listeners.length == 1)
					{
						var options = {persistent : false, recursive : false, enconding : "utf8"};
						fsLib.watch(paths[i], options, FolderWatcher.handleEvent.bind(null, paths[i]));
					}
				}
			});
		}



		public static watch(
			folderPath:string,
			listener:(changedFile:string) => void,
			recursive:boolean = true):void
		{
			fsLib.realpath(folderPath, (err:Error, realPath:string) =>
			{
				if (!realPath)
					return;

				if (FolderWatcher.usePolling)
					FolderWatcher.watchPolling(realPath, listener, recursive);
				else
					FolderWatcher.watchEvents(realPath, listener, recursive);
			});
		}
	}
}
