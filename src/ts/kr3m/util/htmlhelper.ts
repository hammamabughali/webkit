/// <reference path="../util/log.ts"/>
/// <reference path="../util/stringex.ts"/>
/// <reference path="../util/tokenizer.ts"/>



module kr3m.util
{
	/*
		Klasse zum Arbeiten mit Html-Quellcode ohne Browser. Z.B.
		wenn Dateien geparsed werden sollen ohne sie vorher in
		die DOM rein zu laden oder wenn man auf dem Server arbeiten
		muss.
	*/
	//# DEPRECATED: kr3m.util.HtmlHelper is deprecated. Please use kr3m.html.Helper instead.
	export class HtmlHelper
	{
		public static DOCTYPE = "<!DOCTYPE html>";

		public static locFunc = kr3m.util["Localization"] ? kr3m.util["Localization"].get : (id:string, tokens?:any, languageId?:string) => id;



		/*
			Allgemeine Funktion zum Verarbeiten von Html-Code. Sie
			wird von allen möglichen Templates (Email, HtmlTemplate,
			Pdf, usw.) verwendet. Je nach Einstellung werden Tokens
			ersetzt, Sprachdateien verwendet, usw.
		*/
		public static processCode(
			code:string,
			replaceTokens = true,
			tokens?:any,
			localizeIt = true,
			languageId?:string):string
		{
			if (replaceTokens)
				code = Tokenizer.get(code, tokens);

			if (localizeIt)
			{
				code = code.replace(/loc\(\s*([\w_-]+)\s*\)/gm, (match:string, p1?:string) =>
				{
					return HtmlHelper.locFunc(p1, tokens, languageId);
				});
			}
			return code;
		}



		/*
			Sucht alle img-Tags aus code heraus und gibt deren src-Attribute
			in einem Array zurück.
		*/
		public static extractImageUrls(code:string):string[]
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
		public static stripComments(html:string):string
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
		public static getBody(
			htmlCode:string,
			replaceTokens = true,
			tokens?:any,
			localizeIt = true,
			languageId?:string):string
		{
			var matchResult = htmlCode.match(/<body[^>]*>([\s\S]*)<\/body>/im);
			htmlCode = matchResult ? matchResult[1] : htmlCode;
			return HtmlHelper.processCode(htmlCode, replaceTokens, tokens, localizeIt, languageId);
		}



		public static renderElement(tag:string, attributes:any):string
		{
			var code = "<" + tag;
			var attrText = StringEx.joinAssoc(attributes, '" ', '="');
			if (attrText != "")
				code += attrText + '"';
			code += "/>";
			return code;
		}



		public static getTemplateKey(templateUrl:string):string
		{
			return templateUrl.replace(/[^\w\d]/g, "_");
		}



		public static wrapHtml(bodyContent:string):string
		{
			return HtmlHelper.DOCTYPE + "\n<html><head/><body>" + bodyContent + "</body></html>";
		}



		public static renderAsTable(rows:any[], escape:boolean = true):string
		{
			var html = "<table>";
			var keys:string[] = [];

			var e = escape ? Util.encodeHtml : (t:string) => t;

			for (var i = 0; i < rows.length; ++i)
				keys = Util.merge(keys, Object.keys(rows[i]));

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



//# !CLIENT
		public static consoleToHtml(consoleText:string):string
		{
			var html = consoleText
				.replace(/\r\n/g, "\n");

			var l = Log;
			var lr = kr3m.util.StringEx.literalReplace;
			html = lr(html, l.COLOR_BRIGHT_RED, "<font style='color:red;'>");
			html = lr(html, l.COLOR_BRIGHT_GREEN, "<font style='color:green;'>");
			html = lr(html, l.COLOR_BRIGHT_YELLOW, "<font style='color:yellow;'>");
			html = lr(html, l.COLOR_BRIGHT_BLUE, "<font style='color:blue;'>");
			html = lr(html, l.COLOR_BRIGHT_MAGENTA, "<font style='color:magenta;'>");
			html = lr(html, l.COLOR_BRIGHT_CYAN, "<font style='color:cyan;'>");
			html = lr(html, l.COLOR_BRIGHT_PINK, "<font style='color:magenta;'>");
			html = lr(html, l.COLOR_DARK_RED, "<font style='color:darkred;'>");
			html = lr(html, l.COLOR_DARK_GREEN, "<font style='color:darkgreen;'>");
			html = lr(html, l.COLOR_DARK_YELLOW, "<font style='color:darkorange;'>");
			html = lr(html, l.COLOR_DARK_BLUE, "<font style='color:darkblue;'>");
			html = lr(html, l.COLOR_DARK_MAGENTA, "<font style='color:darkmagenta;'>");
			html = lr(html, l.COLOR_DARK_CYAN, "<font style='color:darkcyan;'>");
			html = lr(html, l.COLOR_DARK_PINK, "<font style='color:darkmagenta;'>");
			html = lr(html, l.COLOR_RESET, "</font>");

			html = "<div style='white-space:pre;'>" + html + "</div>";
			return html;
		}
//# /!CLIENT
	}
}
