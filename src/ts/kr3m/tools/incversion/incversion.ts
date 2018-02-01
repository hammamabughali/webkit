/// <reference path="../../lib/node.ts"/>
/// <reference path="../../util/log.ts"/>
/// <reference path="../../util/stringex.ts"/>

if (process.argv.length < 4)
{
	logError("not enough arguments");
	process.exit(1);
}

var filePath = process.argv[2];
var patternString = process.argv[3];
var pattern = new RegExp(patternString);

var content:string = fsLib.readFileSync(filePath, {encoding:"utf8"});
if (!content)
{
	logError("file not found:");
	process.exit(2);
}

var matches = content.match(pattern);
if (!matches || matches.length < 4)
{
	logError("pattern not found");
	logError(matches);
	process.exit(3);
}

var value = kr3m.util.StringEx.parseIntSafe(matches[2], -1);
++value;
var newText = matches[1] + value;
for (var i = 3; i < matches.length; ++i)
	newText += (i % 2) ? matches[i] : "0";

log(matches[0], "=>", newText);
content = content.replace(matches[0], newText);

fsLib.writeFileSync(filePath, content);

log("done");
process.exit(0);
