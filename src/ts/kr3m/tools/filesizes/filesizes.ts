/// <reference path="../../lib/node.ts"/>
/// <reference path="../../util/log.ts"/>
/// <reference path="../../util/util.ts"/>

var collected:any[] = [];
var ignoreHidden = true;



function getSize(path:string):number
{
	var size = 0;
	var files = fsLib.readdirSync(path);
	for (var i = 0; i < files.length; ++i)
	{
		if (ignoreHidden && files[i].slice(0, 1) == ".")
			continue;

		var subPath = path + "/" + files[i];
		subPath = subPath.replace(/\/\/+/g, "/").replace(/\\/g, "/");
		var stats = fsLib.statSync(subPath);
		if (stats.isDirectory())
			size += getSize(subPath);
		else
			size += stats.size;
	}
	collected.push({path : path, size : size});
	return size;
}



function output():void
{
	kr3m.util.Util.sortBy(collected, "SIZE", false);
	for (var i = 0; i < collected.length; ++i)
		log(collected[i].path, collected[i].SIZE);
}



function main()
{
	var rootPath = process.argv[2];
	log("collecting filesizes for path " + rootPath);
	getSize(rootPath);
	output();
	log("done");
	process.exit(0);
}



main();
