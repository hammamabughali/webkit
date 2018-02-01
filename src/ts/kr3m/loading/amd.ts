/// <reference path="../async/join.ts"/>

//# CLIENT
/// <reference path="../loading/loader.ts"/>
//# /CLIENT

//# SERVER
/// <reference path="../cache/files/localfiles.ts"/>
/// <reference path="../lib/node.ts"/>
//# /SERVER



module kr3m.loading.amd
{
	var exports:{[moduleId:string]:any} = {};
	exports["require"] = requireAsync;
	exports["exports"] = {};

	var callbacks:{[moduleId:string]:Function[]} = {};

	export type AllLoadedCallback = (...params:any[]) => void;



//# CLIENT
	function load(moduleId:string, callback:() => void):void
	{
		if (exports[moduleId])
			return callback();

		var url = moduleId + ".js";
		var loader = Loader.getInstance();
		loader.queue(url, (rawJs:string) =>
		{
			if (!callbacks[moduleId])
				callbacks[moduleId] = [];
			callbacks[moduleId].push(callback);

			eval(rawJs);
		});
		loader.load();
	}
//# /CLIENT



//# SERVER
	function load(moduleId:string, callback:() => void):void
	{
		if (exports[moduleId])
			return callback();

		var path = moduleId + ".js";
		kr3m.cache.files.LocalFiles.getInstance().getFile(path, (content:Buffer) =>
		{
			if (!callbacks[moduleId])
				callbacks[moduleId] = [];
			callbacks[moduleId].push(callback);

			var raw = content.toString();
			eval(raw);
		});
	}
//# /SERVER



	export function requireAsync(
		dependencies:string[],
		callback:AllLoadedCallback):void
	{
		var join = new kr3m.async.Join();
		for (var i = 0; i < dependencies.length; ++i)
		{
			if (!exports[dependencies[i]])
				load(dependencies[i], join.getCallback());
		}
		join.addCallback(() =>
		{
			var params:any[] = [];
			for (var i = 0; i < dependencies.length; ++i)
			{
				if (dependencies[i] == "exports")
					params.push(undefined);
				else
					params.push(exports[dependencies[i]]);
			}

			callback.apply(null, params);
		});
	}



	export function define(
		moduleId:string,
		dependencies:string[],
		callback:AllLoadedCallback):void
	{
		var join = new kr3m.async.Join();
		for (var i = 0; i < dependencies.length; ++i)
		{
			if (!exports[dependencies[i]])
				load(dependencies[i], join.getCallback());
		}
		join.addCallback(() =>
		{
			exports[moduleId] = {};

			var params:any[] = [];
			for (var i = 0; i < dependencies.length; ++i)
			{
				if (dependencies[i] == "exports")
					params.push(exports[moduleId]);
				else
					params.push(exports[dependencies[i]]);
			}

			callback.apply(null, params);

			var moduleCallbacks = callbacks[moduleId] || [];
			for (var i = 0; i < moduleCallbacks.length; ++i)
				moduleCallbacks[i]();
		});
	}
}



function define(
	moduleId:string,
	dependencies:string[],
	callback:kr3m.loading.amd.AllLoadedCallback):void
{
	kr3m.loading.amd.define(moduleId, dependencies, callback);
}



function requireAsync(
	dependencies:string[],
	callback:kr3m.loading.amd.AllLoadedCallback):void
{
	kr3m.loading.amd.requireAsync(dependencies, callback);
}
