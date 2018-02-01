/// <reference path="../constants.ts"/>
/// <reference path="../util/log.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.util
{
	export type TokenFormatter = (value:any, tokens:any, name:string) => string;



	export class Tokenizer
	{
		private static globalTokens:Object = {};
		private static formatters:{[name:string]:TokenFormatter} = {};



		public static setFormatter(name:string, formatter:TokenFormatter):void
		{
			Tokenizer.formatters[name] = formatter;
		}



		/*
			Setzt ein Token in der globalen Tokenliste auf den
			angegeben Wert. Die globale Tokenliste wird immer
			dann verwendet, wenn nicht ausdrücklich eine
			Tokenliste angegeben wird.
		*/
		public static setToken(name:string, value:string):void
		{
			Tokenizer.globalTokens[name] = value;
		}



		/*
			Baut ein Tokensobjekt aus verschiedenen
			Tokenobjekten / VOs zusammen. Z.B. kann man die VOs
			consumerData und productData mit folgendem Aufruf
			zusammenfassen:

				var tokens = kr3m.util.Tokenizer.mergeTokens({consumer:consumerData, product:productData});
		*/
		public static mergeTokens(tokensArray:any):{[id:string]:any}
		{
			var result:any = {};
			for (var i in tokensArray)
			{
				for (var j in tokensArray[i])
				{
					if (typeof tokensArray[i][j] != "function")
					{
						var key = i + "_" + j;
						key = key.replace(/\W/g, "");
						key = key.replace(/([a-z])([A-Z])/g, "$1_$2");
						key = key.replace(/__+/g, "_");
						key = key.toUpperCase();
						result[key] = tokensArray[i][j];
					}
				}
			}
			return result;
		}



		/*
			Ersetzt alle Tokens im gegebenen Text durch Werte
			der gegebenen Tokens. Werden keine Tokens angegeben,
			wird statt dessen die globale Tokenliste verwendet.
			Der seperator gibt an, welche Zeichenfolge verwendet
			wird um die Tokens innerhalb des Textes herauszufinden.
		*/
		public static get(
			text:string,
			tokens?:Object,
			seperator = "##"):string
		{
			tokens = Util.mergeAssoc(Tokenizer.globalTokens, tokens);

			var parts = text.split(seperator);
			for (var i = 1; i < parts.length; i += 2)
			{
				var tokenParts = parts[i].split(":");
				if (tokenParts.length < 1)
					continue;

				var value = Util.getProperty(tokens, tokenParts[0]);
				if (tokenParts.length > 1)
				{
					var formatter = <(value:any, tokens?:any, name?:string) => string> Tokenizer.formatters[tokenParts[1]];
					if (formatter)
					{
						try
						{
							value = formatter(value, tokens, tokenParts[0]);
						}
						catch(e)
						{
							Log.logError(e);
						}
					}
					else
					{
						Log.logWarning("unknown token-formatter:", tokenParts[1]);
					}
				}

//# RELEASE
				parts[i] = (value !== null) ? value : "";
//# /RELEASE
//# !RELEASE
//# !CLIENT
				if (value === null || value === undefined)
					Log.logWarning("unknown token:", tokenParts[0]);
//# /!CLIENT
				parts[i] = (value !== null) ? value : seperator + parts[i] + seperator;
//# /!RELEASE
			}
			return parts.join("");
		}



		/*
			Die Umkehrfunktion zu get. Kann verwendet werden um
			in einem String, der durch den Tokenizer umgewandelt
			wurde die Werte für die einzelnen Tokens heraus zu
			finden. templateText ist die ursprüngliche Vorlage
			des Textes (die noch Tokens enthält), tokenizedText
			ist der verarbeitete Text (in dem alle Tokens durch
			Werte ersetzt wurden). Das Ergebnis ist ein Objekt,
			das für jedes Token den gefundenen Wert aus dem
			verarbeiteten Text enthält. Passen die Texte nicht
			zusammen, wird statt dessen null zurück gegeben.

			Beispiel: Der Aufruf

				revertValues("Ich heisse ##FIRSTNAME## ##LASTNAME##.", "Ich heisse Jan Minar.");

			gibt {FIRSTNAME:"Jan", LASTNAME:"Minar"} als Ergebnis
			zurück.

			Vorsicht! Da es teilweise Mehrdeutigkeiten geben kann
			ist nicht sicher, dass das Ergebnis zu 100% mit dem
			Original übereinstimmt. Außerdem ist es wichtig, dass
			zwischen den Tokens auch tatsächlich Trennzeichen
			vorkommen. Der String "##FIRST####LAST##" wird nicht
			aufgelöst werden können, weil nicht gesagt werden kann,
			wo das erste Token aufhört und das zweite anfängt.
		*/
		public static revertValues(
			templateText:string,
			tokenizedText:string,
			seperator = "##"):any
		{
			var result:any = {};
			var parts = templateText.split(seperator);
			if (parts.length == 1)
				return {};

			var startPos = tokenizedText.indexOf(parts[0], startPos);
			if (startPos < 0)
				return null;

			var endPos = 0;
			for (var i = 0; i < parts.length - 1; i += 2)
			{
				startPos += parts[i].length;
				endPos = (parts[i + 2] != "") ? tokenizedText.indexOf(parts[i + 2], startPos) : tokenizedText.length;
				if (endPos < 0)
					return null;

				result[parts[i + 1]] = tokenizedText.substring(startPos, endPos);
				startPos = endPos;
			}
			return result;
		}
	}
}



/*
	Bequemlichkeitsfunktion um nicht jedes Mal
	kr3m.util.Tokenizer.get schreiben zu müssen.
*/
//# !HIDE_GLOBAL
function tokenize(
	text:string,
	tokens?:Object,
	seperator = "##"):string
{
	return kr3m.util.Tokenizer.get(text, tokens, seperator);
}
//# /!HIDE_GLOBAL



/*
	Bequemlichkeitsfunktion um nicht jedes Mal
	kr3m.util.Tokenizer.setToken schreiben zu müssen.
*/
//# !HIDE_GLOBAL
function setToken(name:string, value:string):void
{
	kr3m.util.Tokenizer.setToken(name, value);
}
//# /!HIDE_GLOBAL
