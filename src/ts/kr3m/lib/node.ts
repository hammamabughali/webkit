/// <reference path="../lib/external/node/node.d.ts"/>
/// <reference path="../lib/os.ts"/>
/// <reference path="../util/log.ts"/>
/// <reference path="../util/stringex.ts"/>



const clusterLib = require("cluster");
const constantsLib = require("constants");
const cryptoLib = require("crypto");
const fsLib = require("fs");
const httpLib = require("http");
const httpsLib = require("https");
const pathLib = require("path");
const querystringLib = require("querystring");
const urlLib = require("url");
const utilLib = require("util");
const v8Lib = require("v8");



function requireOptional(moduleName:string):any
{
	try
	{
		var mod = require(moduleName);
		return mod;
	}
	catch(e)
	{
		if (clusterLib.isMaster)
			logWarning("module", moduleName, "not found");
		return undefined;
	}
}



//# CLIENT
//# ERROR: Datei darf nicht in den Client kompiliert werden!
//# /CLIENT



if (!utilLib.isPrimitive)
{
	logWarning("using utilLib.isPrimitive polyfill");
	utilLib.isPrimitive = (obj:any) =>
	{
		var t = typeof obj;
		return (t == "string" || t == "number" || t == "boolean" || obj instanceof Date);
	};
}



if (!utilLib.isArray)
{
	logWarning("using utilLib.isArray polyfill");
	utilLib.isArray = (obj:any) =>
	{
		return obj && typeof obj.length == "number";
	};
}



if (!utilLib.isObject)
{
	logWarning("using utilLib.isObject polyfill");
	utilLib.isObject = (obj:any) =>
	{
		return obj && !utilLib.isPrimitive(obj) && !utilLib.isArray(obj);
	};
}



/*
	Gibt detailierte Informationen über den Inhalt der
	Parameter aus. Vorsicht, unterscheidet sich vom einfachen
	log(...) - Strings mit Sonderzeichen werden u.A.
	anders dargestellt, z.B. Zeilenumbrüche als \n
	dargestellt statt tatsächliche Zeilenumbrüche, usw.
*/
function debug(...objs:any[]):void
{
	for (var i = 0; i < objs.length; ++i)
		log(utilLib.inspect(objs[i], {depth:null}));
}



/*
	Erzeugt die gleiche Ausgabe wie debug() aber speichert
	sie in eine Datei anstatt sie in der Konsole auszugeben.
*/
function dumpToFile(filePath:string, ...objs:any[]):void
{
	var output = "";
	for (var i = 0; i < objs.length; ++i)
		output += utilLib.inspect(objs[i], {depth:null});
	fsLib.writeFile(filePath, output, () => {});
}



/*
	Decodiert einen Base64 String und gibt das Ergebnis
	dann wieder als String zurück.
	Im Prinzip genau das gleiche wie atob() im Browser.
*/
function decodeBase64EncodedString(base64:string):string
{
	return new Buffer(base64, "base64").toString("utf8");
}



/*
	Codiert einen String mit dem Base64 Verfahren und
	gibt das Ergebnis zurück.
	Im Prinzip genau das gleiche wie btoa() im Browser.
*/
function encodeBase64EncodedString(raw:string):string
{
	return new Buffer(raw).toString("base64");
}



/*
	Berechnet den SHA512 Hash der gegebenen Daten
	und gibt ihn als Base64 kodierten String zurück.
*/
function getSha512Base64(...data:Array<string|Buffer>):string
{
	var algorithm = cryptoLib.createHash("sha512");
	for (var i = 0; i < data.length; ++i)
		algorithm.update(data[i]);
	return algorithm.digest("base64");
}



/*
	Berechnet den MD5 Hash der gegebenen Daten
	und gibt ihn als Base64 kodierten String zurück.

	Achtung: diese Methode nicht mehr für das
	Verschlüsseln von Passwörtern verwenden, das MD5
	nicht mehr besonders zuverlässig ist. Statt dessen
	sollte getSha512Base64 verwendet werden.
*/
function getMd5Base64(...data:Array<string|Buffer>):string
{
	var algorithm = cryptoLib.createHash("md5");
	for (var i = 0; i < data.length; ++i)
		algorithm.update(data[i]);
	return algorithm.digest("base64");
}



/*
	Berechnet den MD5 Hash der gegebenen Daten
	und gibt ihn als hexadezimalen Zahlenstring
	zurück.
*/
function getMd5Hex(...data:Array<string|Buffer>):string
{
	var algorithm = cryptoLib.createHash("md5");
	for (var i = 0; i < data.length; ++i)
		algorithm.update(data[i]);
	return algorithm.digest("hex");
}



/*
	Gibt zurück wie viel Speicher der Prozess
	aktuell benötigt.
*/
function getMemoryUsed():number
{
	return process.memoryUsage().heapUsed;
}



/*
	Gibt zurück wie viel Speicher dem Prozess
	aktuell zugeteilt ist.
*/
function getMemoryAllocated():number
{
	return process.memoryUsage().rss;
}



/*
	Gibt zurück, wie viel Speicher die Anwendung
	aktuell verbraucht. Der Rückgabewert ist ein
	String, weil eine Maßeinheit mitgegeben wird.
*/
function getMemoryUseString():string
{
	var usage = process.memoryUsage();
	var used = kr3m.util.StringEx.getSizeString(usage.heapUsed);
	var allocated = kr3m.util.StringEx.getSizeString(usage.rss);
	return used + " / " + allocated;
}



if (parseInt(process.version.replace(/^v?(\d+)\..+/, "$1"), 10) < 6)
	throw new Error("Your node.js version is too old, node.js 6 or higher is required!");
