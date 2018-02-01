//# !CLIENT
/// <reference path="../lib/node.ts"/>
/// <reference path="../util/stringex.ts"/>
//# /!CLIENT



module kr3m.xml
{
	/*
		Hilfsklasse zum Erzeugen von XML-Daten.
		Der Hauptunterschied zwischen dieser Klasse und den
		XMLDocument im Browser ist, dass diese Klasse keine
		DOM-Trees benutzt sondern schlichte JSON-Objekte.
	*/
	export class Generator
	{
		protected prefix:string;
		protected xml:string;

		public rootElementName = "root";



		protected writeHeader():void
		{
			this.xml += "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
		}



		protected indent():void
		{
			this.prefix += "  ";
		}



		protected unindent():void
		{
			this.prefix = this.prefix.slice(0, -2);
		}



		protected writeAttributes(attributes:any):void
		{
			for (var i in attributes)
			{
				var value = attributes[i].replace(/"/g, "\\\"");
				this.xml += " " + i + "=\"" + value + "\"";
			}
		}



		protected writePrimitive(tag:string, value:any):void
		{
			var escaped = (typeof value == "string") ? value.replace(/</g, "&lt;").replace(/>/g, "&gt;") : value;
			this.xml += this.prefix + "<" + tag + ">" + escaped + "</" + tag + ">\n";
		}



		protected writeCData(node:any):void
		{
			this.xml += "<![CDATA[" + node._data + "]]>";
		}



		protected writeContent(node:any):void
		{
			for (var tag in node)
			{
				if (tag.charAt(0) != "_")
				{
					if (node[tag].length !== undefined && typeof node[tag] != "string")
					{
						for (var i = 0; i < node[tag].length; ++i)
						{
							if (typeof node[tag][i] == "object")
								this.writeNode(node[tag][i], tag);
							else
								this.writePrimitive(tag, node[tag][i]);
						}
					}
					else if (typeof node[tag] == "object")
					{
						this.writeNode(node[tag], tag);
					}
					else
					{
						this.writePrimitive(tag, node[tag]);
					}
				}
			}
		}



		protected writeNode(node:any, fallbackTag:string):void
		{
			var tag = node._tag || fallbackTag;
			this.xml += this.prefix + "<" + tag;
			if (node._attributes)
				this.writeAttributes(node._attributes);

			this.xml += ">";
			if (node._data)
			{
				this.writeCData(node);
			}
			else
			{
				this.xml += "\n";
				this.indent();
				this.writeContent(node);
				this.unindent();
				this.xml += this.prefix;
			}
			this.xml += "</" + tag + ">\n";
		}



		public generate(data:any):string
		{
			if (typeof data != "object")
				data = {data : data};

			this.prefix = "";
			this.xml = "";

			this.writeHeader();
			this.writeNode(data, this.rootElementName);
			return this.xml;
		}
	}



	export function generateString(data:any):string
	{
		var generator = new Generator();
		return generator.generate(data);
	}



//# !CLIENT
	export function generateLocalFileSync(path:string, data:any):void
	{
		try
		{
			var xml = kr3m.util.StringEx.BOM + generateString(data);
			fsLib.writeFileSync(path, xml, {encoding : "utf8"});
		}
		catch (err)
		{
			logError(err);
		}
	}
//# /!CLIENT
}
