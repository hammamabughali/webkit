/// <reference path="../types.ts"/>
/// <reference path="../util/log.ts"/>
/// <reference path="../util/stringex.ts"/>
/// <reference path="../util/tokenizer.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.html
{
	/*
		Klasse zum Arbeiten mit Html-Quellcode ohne Browser. Z.B.
		wenn Dateien geparsed werden sollen ohne sie vorher in
		die DOM rein zu laden oder wenn man auf dem Server arbeiten
		muss.
	*/
	export class Helper
	{
		public static DOCTYPE = "<!DOCTYPE html>";



		/*
			Allgemeine Funktion zum Verarbeiten von Html-Code. Sie
			wird von allen möglichen Templates (Email, HtmlTemplate,
			Pdf, usw.) verwendet. Je nach Einstellung werden Tokens
			ersetzt, Sprachdateien verwendet, usw.
		*/
		public processCode(
			code:string,
			tokens?:Tokens,
			locFunc?:LocFunc,
			locParseFunc?:(text:string, tokens?:Tokens) => string):string
		{
			if (locParseFunc)
				code = locParseFunc(code, tokens);
			else if (tokens)
				code = kr3m.util.Tokenizer.get(code, tokens);
//# CLIENT
			locFunc = locFunc || kr3m.util["Localization"].get;
//# /CLIENT
			if (locFunc && !locParseFunc)
				code = code.replace(/loc\(\s*([\w_-]+)\s*\)/gm, (match, p1?) => locFunc(p1, tokens));
			return code;
		}



		private getNextNode(code:string, offset = 0):[string, number]
		{
			for (var i = offset; i < code.length; ++i)
			{
				if (code.charAt(i) == "<")
				{
					var quote = "";
					for (var j = i + 1; j < code.length; ++j)
					{
						var t = code.charAt(j);
						switch (t)
						{
							case ">":
								if (!quote)
									return [code.slice(i, j + 1), i];
								break;

							case "'":
							case "\"":
								if (quote)
								{
									if (quote == t)
										quote = "";
								}
								else
								{
									quote = t;
								}
								break;
						}
					}
					return [code.slice(i), i];
				}
			}
			return [null, -1];
		}



		private getNodeTag(node:string):string
		{
			var matches = node.match(/^<\/?(.+?)\b/);
			return matches ? matches[1].toLowerCase() : null;
		}



		/*
			Entfernt alle Html-Tags aus code bis auf die in keepTags
		*/
		public stripTags(
			code:string,
			keepTags:string[] = [],
			stripAttributes = true):string
		{
			var offset = 0;
			while (true)
			{
				var [node, offset] = this.getNextNode(code, offset);
				if (!node)
					break;

				var tag = this.getNodeTag(node);
				if (keepTags.indexOf(tag) >= 0)
				{
					if (stripAttributes)
					{
						var newNode = "<";
						if (node.charAt(1) == "/")
							newNode += "/";
						newNode += tag;
						if (node.charAt(node.length - 2) == "/")
							newNode += "/";
						newNode += ">";

						code = code.slice(0, offset) + newNode + code.slice(offset + node.length);
						offset += newNode.length;
					}
					else
					{
						offset += node.length;
					}
				}
				else
				{
					code = code.slice(0, offset) + code.slice(offset + node.length);
				}
			}
			return code;
		}



		/*
			Sucht alle img-Tags aus code heraus und gibt deren src-Attribute
			in einem Array zurück.
		*/
		public extractImageUrls(code:string):string[]
		{
			var pat = /<img [^>]*src=["']([^'"]+)['"][^>]*>/ig; //'
			var matches:string[];
			var urls:string[] = [];
			while (matches = pat.exec(code))
				urls.push(matches[1]);
			return urls;
		}



		/*
			Entfernt HTML-Kommentare aus dem Code
		*/
		public stripComments(html:string):string
		{
			var pat = /\<\!\-\-.*?\-\-\>/g;
			return html.replace(pat, "");
		}



		/*
			Extrahiert den Inhalt des body-Tags aus htmlCode, jagt ihn
			durch processCode und gibt ihn anschließend zurück. Wird
			kein body-Tag gefunden, wird statt dessen der gesamte Inhalt
			von htmlCode verarbeitet und zurück gegeben.
		*/
		public getBody(
			code:string,
			tokens?:Tokens,
			locFunc?:LocFunc,
			locParseFunc?:LocFunc):string
		{
			var matchResult = code.match(/<body[^>]*>([\s\S]*)<\/body>/im);
			code = matchResult ? matchResult[1] : code;
			return this.processCode(code, tokens, locFunc, locParseFunc);
		}



		public renderElement(tag:string, attributes:any):string
		{
			var code = "<" + tag;
			var attrText = kr3m.util.StringEx.joinAssoc(attributes, '" ', '="');
			if (attrText != "")
				code += attrText + '"';
			code += "/>";
			return code;
		}



		public getTemplateKey(templateUrl:string):string
		{
			return templateUrl.replace(/[^\w\d]/g, "_");
		}



		public wrapHtml(bodyContent:string):string
		{
			return Helper.DOCTYPE + "\n<html><head/><body>" + bodyContent + "</body></html>";
		}



		public renderAsTable(rows:any[], escape = true):string
		{
			var html = "<table>";
			var keys:string[] = [];

			var e = escape ? kr3m.util.Util.encodeHtml : (t:string) => t;

			for (var i = 0; i < rows.length; ++i)
				keys = kr3m.util.Util.merge(keys, Object.keys(rows[i]));

			html += "<tr>";
			for (var i = 0; i < keys.length; ++i)
				html += "<th>" + keys[i] + "</th>";
			html += "</tr>";

			for (var i = 0; i < rows.length; ++i)
			{
				html += "<tr>";
				for (var j = 0; j < keys.length; ++j)
				{
					var value = rows[i][keys[j]] ? e(rows[i][keys[j]].toString()) : "";
					html += "<td>" + value + "</td>";
				}
				html += "</tr>";
			}
			html += "</table>";
			return html;
		}



		public getRedirectUrl(htmlCode:string):string
		{
			var headerParts = htmlCode.match(/(<head(?:\s+[^>]*)>)([\s\S]*)(<\/head>)/i);
			if (!headerParts)
				return "";

			var metaParts = headerParts[2].match(/<meta\s+.+?\s*\/?>/gi);
			if (!metaParts)
				return "";

			for (var i = 0; i < metaParts.length; ++i)
			{
				var attributes = metaParts[i].match(/<meta.*(http-equiv)=["'](refresh)["'].*(content)=["'](\d+);\s+url=([^"']*)["'].*\/?>/i);
				if (attributes)
					return attributes[5];
			}
			return "";
		}



//# !CLIENT
		public consoleToHtml(consoleText:string):string
		{
			var mappedStyles =
			{
				// "1" : COLOR_BRIGHT,
				"100" : "background-color:#808080",
				"101" : "background-color:#FF0000",
				"102" : "background-color:#00FF00",
				"103" : "background-color:#FFFF00",
				"104" : "background-color:#0000FF",
				"105" : "background-color:#FF00FF",
				"106" : "background-color:#00FFFF",
				"107" : "background-color:#FFFFFF",
				// "2" : COLOR_DARK",
				"30" : "color:#000000",
				"31" : "color:#800000",
				"32" : "color:#008000",
				"33" : "color:#808000",
				"34" : "color:#000080",
				"35" : "color:#800080",
				"36" : "color:#008080",
				"37" : "color:#C0C0C0",
				"40" : "background-color:#000000",
				"41" : "background-color:#800000",
				"42" : "background-color:#008000",
				"43" : "background-color:#808000",
				"44" : "background-color:#000080",
				"45" : "background-color:#800080",
				"46" : "background-color:#008080",
				"47" : "background-color:#C0C0C0",
				"90" : "color:#808080",
				"91" : "color:#FF0000",
				"92" : "color:#00FF00",
				"93" : "color:#FFFF00",
				"94" : "color:#0000FF",
				"95" : "color:#FF00FF",
				"96" : "color:#00FFFF",
				"97" : "color:#FFFFFF"
			};

			var html = kr3m.util.Util.encodeHtml(consoleText)
				.replace(/\r/g, "")
				.replace(/\x1b\[0m/g, "</font>")
				.replace(/(?:\x1b\[\d+m)+/g, (match) =>
				{
					var codes = match.match(/\d+/g);
					var styles = codes.map(code => mappedStyles[code] || "");
					return "<font style='" + styles.join(";") + "'>";
				});

			html = "<div style='background-color:#000000; color:#C0C0C0; margin:10px; padding:5px; word-wrap:break-word; white-space:pre; overflow-x:scroll;'>" + html + "</div>";
			return html;
		}
//# /!CLIENT
	}
}
