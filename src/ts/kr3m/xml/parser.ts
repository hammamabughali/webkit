//# !CLIENT
/// <reference path="../lib/node.ts"/>
/// <reference path="../util/stringex.ts"/>
//# /!CLIENT

//# UNITTESTS
/// <reference path="../unittests/suite.ts"/>
//# /UNITTESTS



module kr3m.xml
{
	/*
		Hilfsklasse zum Parsen von XML-Daten.
		Der Hauptunterschied zwischen dieser Klasse und den
		XMLDocument im Browser ist, dass diese Klasse keine
		DOM-Trees erzeugt sondern einfache JSON-Objekte.
	*/
	export class Parser
	{
		protected i:number;
		protected rawXml:string;

		protected S = {" " : true, "\n" : true, "\r" : true, "\t" : true};
		protected NW = {" " : true, "\n" : true, "\t" : true, "<" : true, ">" : true, "=" : true, "\"" : true, "'" : true, "\r" : true};
		protected ESC = {amp : "&", lt : "<", gt : ">", quot : "\""};
		protected styleAttibutesPattern = /^xs[a-z]+:/;

		public stripStyleAttributes = true;



		protected eat():string
		{
			return this.rawXml.charAt(this.i++);
		}



		protected skipWS():void
		{
			while (this.S[this.rawXml.charAt(this.i)])
				++this.i;
		}



		protected skipHeader():boolean
		{
			var t = this.eat();
			while (t && t != "<")
				t = this.eat();

			var found = false;
			if (this.rawXml.slice(this.i, this.i + 4) == "?xml")
			{
				var t = this.eat();
				while (t && t != "<")
					t = this.eat();
				found = true;
			}
			--this.i;
			return found;
		}



		protected readWord():string
		{
			this.skipWS();
			var start = this.i;
			while (!this.NW[this.rawXml.charAt(this.i)])
				++this.i;
			return this.rawXml.slice(start, this.i);
		}



		protected readTill(token:string):string
		{
			var start = this.i;
			var f = token.charAt(0);
			while (1)
			{
				var t = this.eat();
				if (!t)
					break;

				if (t == f)
				{
					if (this.rawXml.slice(this.i - 1, this.i - 1 + token.length) == token)
						break;
				}
			}
			this.i += token.length - 1;
			return this.rawXml.slice(start, this.i - token.length);
		}



		protected readQuoted():string
		{
			this.skipWS();
			var q = this.eat();
			return this.readTill(q);
		}



		protected readAttributes():{[name:string]:string}
		{
			var attributes:{[name:string]:string} = {};
			while (true)
			{
				this.skipWS();
				var t = this.rawXml.charAt(this.i);
				if (t == ">" || t == "/")
					break;

				var name = this.readWord();
				this.skipWS();
				++this.i;
				var value = this.readQuoted();
				if (!this.stripStyleAttributes || !this.styleAttibutesPattern.test(name))
					attributes[name] = value;
			}
			return attributes;
		}



		protected isNull(node:any):boolean
		{
			for (var i in node._attributes)
			{
				if ((i == "nil" || i.slice(-4) == ":nil") && node._attributes[i] == "true")
					return true;
			}
			return false;
		}



		protected isPrimitive(node:any):boolean
		{
			for (var i in node._attributes)
				return false;

			for (var i in node)
			{
				if (i.charAt(0) != "_")
					return false;
			}

			return true;
		}



		protected fillChildNodes(node:any, nodes:any[]):void
		{
			var temp:any = {};
			for (var i = 0; i < nodes.length; ++i)
			{
				if (!temp[nodes[i]._tag])
					temp[nodes[i]._tag] = [];

				if (this.isNull(nodes[i]))
					temp[nodes[i]._tag].push(null);
				else if (this.isPrimitive(nodes[i]))
					temp[nodes[i]._tag].push(nodes[i]._data);
				else
					temp[nodes[i]._tag].push(nodes[i]);
			}
			for (var tag in temp)
				node[tag] = (temp[tag].length == 1) ? temp[tag][0] : temp[tag];
		}



		protected readNode():any
		{
			var start = this.i;
			this.skipWS();
			++this.i;
			var node:any = {};
			[, node._ns, node._tag] = this.readWord().match(/(?:([^\:]+)\:)?([^\:]+)/);
			if (node._tag.slice(-1) == "/")
			{
				node._tag = node._tag.slice(0, -1);
				this.i += 1;
				return node;
			}

			node._attributes = this.readAttributes();

			var t = this.eat();
			if (t == "/")
			{
				++this.i;
				return node;
			}

			var [data, nodes] = this.readContent();
			node._data = data.trim();
			this.fillChildNodes(node, nodes);
			this.skipWS();
			var skip = node._tag.length + (node._ns ? node._ns.length + 4 : 3);
			this.i += skip;
			return node;
		}



		protected readData():string
		{
			this.i += 9;
			var start = this.i;
			var l = this.rawXml.length;
			while (this.i < l)
			{
				while (this.i < l && this.rawXml.charAt(this.i) != "]")
					++this.i;

				if (this.rawXml.slice(this.i, this.i + 3) == "]]>")
				{
					this.i += 3;
					return this.rawXml.slice(start, this.i - 3);
				}

				++this.i;
			}
			throw new Error("invalid xml syntax - CDATA terminator expected");
		}



		protected unescape(escaped:string):string
		{
			var unescaped = this.ESC[escaped];
			if (unescaped)
				return unescaped;

			if (escaped.charAt(0) == "#")
				return String.fromCharCode(parseInt(escaped.slice(1), 8));

			return String.fromCharCode(parseInt(escaped));
		}



		protected skipComment():void
		{
			this.readTill("-->");
		}



		protected readContent():[string, any[]]
		{
			this.skipWS();
			var content = "";
			var nodes:any[] = [];
			while (1)
			{
				var t = this.eat();
				if (!t)
					break;

				if (t == "<")
				{
					t = this.eat();
					this.i -= 2;
					if (t == "!")
					{
						if (this.rawXml.slice(this.i, this.i + 4) == "<!--")
							this.skipComment();
						else
							content += this.readData();
					}
					else if (t == "/")
					{
						break;
					}
					else
					{
						nodes.push(this.readNode());
					}
				}
				else if (t == "&")
				{
					var escaped = this.readTill(";");
					content += this.unescape(escaped);
				}
				else
				{
					content += t;
				}
			}
			return [content, nodes];
		}



		public parse(rawXml:string):any
		{
			this.rawXml = rawXml;
			this.i = 0;
			if (!this.skipHeader() && this.i > 3)
				return undefined;
			var [content, nodes] = this.readContent();
			return nodes.length == 1 ? nodes[0] : undefined;
		}
	}



	export function parseString(rawXml:string):any
	{
		var parser = new kr3m.xml.Parser();
		return parser.parse(rawXml);
	}



//# CLIENT
	export function parseXml(xml:XMLDocument):any
	{
		var rawXml = new XMLSerializer().serializeToString(xml.documentElement);
		return parseString(rawXml);
	}
//# /CLIENT



//# !CLIENT
	export function parseLocalFile(
		path:string,
		callback:(content:any) => void):void
	{
		fsLib.readFile(path, {encoding : "utf8"}, (err:Error, rawXml:string) =>
		{
			if (err)
			{
				logError(err);
				return callback(undefined);
			}

			callback(parseString(kr3m.util.StringEx.stripBom(rawXml)));
		});
	}
//# /!CLIENT



//# !CLIENT
	export function parseLocalFileSync(path:string):any
	{
		try
		{
			var rawXml = fsLib.readFileSync(path, {encoding : "utf8"});
			return parseString(kr3m.util.StringEx.stripBom(rawXml));
		}
		catch (err)
		{
			logError(err);
			return undefined;
		}
	}
//# /!CLIENT
}



//# UNITTESTS
setTimeout(() =>
{
	var p = kr3m.xml.parseString;
	new kr3m.unittests.Suite("kr3m.xml.Parser")
	.add(new kr3m.unittests.CaseSync("parseString I", () => p(``), undefined))
	.add(new kr3m.unittests.CaseSync("parseString II", () => p(`<?xml version="1.0" encoding="utf-8" ?><texts>\n\t<text id="FIRST"><![CDATA[Erster]]></text>\n\t<text id="SECOND"><![CDATA[Zweiter]]></text>\n\t<text id="THIRD"><![CDATA[Dritter]]></text>\n</texts>`), {"_tag":"texts","_attributes":{},"_data":"","text":[{"_tag":"text","_attributes":{"id":"FIRST"},"_data":"Erster"},{"_tag":"text","_attributes":{"id":"SECOND"},"_data":"Zweiter"},{"_tag":"text","_attributes":{"id":"THIRD"},"_data":"Dritter"}]}))
	.add(new kr3m.unittests.CaseSync("parseString III", () => p(`<?xml version="1.0" encoding="utf-8" ?><texts>\n\t<text    id="FIRST"><![CDATA[Erster]]></text>\n\t<text id="SECOND"   ><![CDATA[Zweiter]]></text>\n\t<text   id="THIRD"    ><![CDATA[Dritter]]></text>\n</texts>`), {"_tag":"texts","_attributes":{},"_data":"","text":[{"_tag":"text","_attributes":{"id":"FIRST"},"_data":"Erster"},{"_tag":"text","_attributes":{"id":"SECOND"},"_data":"Zweiter"},{"_tag":"text","_attributes":{"id":"THIRD"},"_data":"Dritter"}]}))
	.run();
}, 1);
//# /UNITTESTS
