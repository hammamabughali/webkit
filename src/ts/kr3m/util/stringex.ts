/// <reference path="../util/json.ts"/>

//# UNITTESTS
/// <reference path="../unittests/suite.ts"/>
//# /UNITTESTS



module kr3m.util
{
	export class StringEx
	{
		public static BOM = "\ufeff";



		/*
			Führt ein RegEx-Match auf text mit dem Pattern
			regex durch und packt die Ergebnisse der einzelnen
			Capture-Groups in ein assoziatives Array. Die
			Attributsnamen für die einzelnen Capture-Groups
			werden in groupNames übergeben.
		*/
		public static captureNamed(
			text:string,
			regex:RegExp,
			groupNames:string[]):any
		{
			var matches = text.match(regex);
			if (!matches)
				return undefined;

			var result:any = {};
			var l = Math.min(groupNames.length, matches.length - 1);
			for (var i = 0; i < l; ++i)
				result[groupNames[i]] = matches[i + 1];
			return result;
		}



		/*
			Das gleiche wie captureNamed, aber der reguläre
			Ausdruck wird immer wieder angewendet, bis kein
			passendes Text mehr gefunden wird. Die einzelnen
			Ergebnisse werden in einem Array zurückgegeben.
		*/
		public static captureNamedGlobal(
			text:string,
			regex:RegExp,
			groupNames:string[]):any[]
		{
			var results:any = [];
			var match = regex.exec(text);
			while (match)
			{
				var result:any = {};
				var l = Math.min(groupNames.length, match.length - 1);
				for (var i = 0; i < l; ++i)
					result[groupNames[i]] = match[i + 1];
				results.push(result);
				match = regex.exec(text);
			}
			return results;
		}



		/*
			Entfernt den BOM von text falls vorhanden.
		*/
		public static stripBom(text:string):string
		{
			if (text.slice(0, StringEx.BOM.length) == StringEx.BOM)
				return text.slice(StringEx.BOM.length);
			else
				return text;
		}



		/*
			Funktioniert prinzipiell genauso wie String.split aber
			teilt nicht an Bruchstellen, die sich in Anführungszeichen
			oder dergleichen befinden.

			Vergleich:

				('Es war einmal "vor langer Zeit" in ...').split(" ") == ["Es", "war", "einmal", "\"vor", "langer", "Zeit\"", "in", "..."]
				StringEx.splitNoQuoted('Es war einmal "vor langer Zeit" in ...') == ["Es", "war", "einmal", "\"vor langer Zeit\"", "in", "..."]

			text ist der Eingabetext, der geteilt werden soll, seperator
			darf im Gegensatz zu String.split nur ein String sein. Mit
			openingQuotes und closingQuotes kann eingestellt werden, welche
			Zeichenfolgen Quotes beginnen und welche sie schließen. Die
			closingQuotes stehen im 1:1 Zusammenhang zu den openingQuotes:
			ein durch die erste openingQuote begonnener quoted Text kann nur
			durch die erste closingQuote geschlossen werden. Falls keine
			closingQuotes angegeben werden, werden die openingQuotes als
			closingQuotes verwendet.

			Beispiele für openingQuotes und closingQuotes Paare:

				1. ["\"", "'"] und null
				2. ["(", "{", "["] und [")", "}", "]"]
		*/
		public static splitNoQuoted(
			text:string,
			seperator:string = ",",
			openingQuotes:string[] = ["\"", "'"],
			closingQuotes?:string[]):string[]
		{
			closingQuotes = closingQuotes || openingQuotes;
			if (openingQuotes.length != closingQuotes.length)
				throw new Error("openingQuotes.length doesn't match closingQuotes.length");

			var quote = -1;
			var parts:string[] = [];
			var offset = 0;
			for (var i = 0; i < text.length; ++i)
			{
				if (quote < 0)
				{
					if (text.slice(i, i + seperator.length) == seperator)
					{
						parts.push(text.slice(offset, i));
						offset = i + seperator.length;
						i = offset - 1;
						continue;
					}

					for (var j = 0; j < openingQuotes.length; ++j)
					{
						if (text.slice(i, i + openingQuotes[j].length) == openingQuotes[j])
						{
							quote = j;
							break;
						}
					}
				}
				else
				{
					if (text.slice(i, i + closingQuotes[quote].length) == closingQuotes[quote])
						quote = -1;
				}
			}
			if (offset < text.length)
				parts.push(text.slice(offset));
			return parts;
		}



		/*
			Kombiniert alle übergebenen Parameter zu einem String
			in "camelback"-Schreibweise, wie sie üblicherweise für
			Funktionsnamen in Programmiersprachen verwendet wird.
		*/
		public static camelback(...values:any[]):string
		{
			var parts:string[] = [];
			for (var i = 0; i < values.length; ++i)
			{
				var text = values[i].toString();
				text = text.replace(/\W+/g, "_");
				parts = parts.concat(text.split("_"));
			}
			if (parts.length > 0)
				parts[0] = parts[0].toLowerCase();
			for (var i = 1; i < parts.length; ++i)
				parts[i] = parts[i].slice(0, 1).toUpperCase() + parts[i].slice(1).toLowerCase();
			return parts.join("");
		}



		/*
			Führt so lange eine Ersetzung durch bis sich am Text nichts
			mehr ändert.
			Vorsicht! Ist nicht besonders schnell und kann in
			Endlosschleifen enden wenn man nicht aufpasst.
		*/
		public static replaceSuccessive(
			haystack:string,
			needle:any,
			replacement:any):string
		{
			var old:string;
			while (old != haystack)
			{
				old = haystack;
				haystack = haystack.replace(needle, replacement);
			}
			return haystack;
		}



		/*
			Führt eine join Operation auf einem assoziativen Array aus
			statt auf einem gewöhnlichen Array. Geeignet, um z.B. Objekte
			in Konfigurationsstrings umzuwandeln.
		*/
		public static joinAssoc(
			obj:{[name:string]:any},
			seperator:string = "&",
			assignOperator:string = "=",
			valueFormatter?:(value:any) => string):string
		{
			var keys = Object.keys(obj);
			if (valueFormatter)
				return keys.map(key => key + assignOperator + valueFormatter(obj[key])).join(seperator);
			else
				return keys.map(key => key + assignOperator + obj[key]).join(seperator);
		}



		/*
			Führt eine split Operation für ein assoziatives Array aus
			statt für ein gewöhnliches Array. Geeignet, um z.B.
			Konfigurationsstrings in tatsächliche Objekte umzuwandeln.
		*/
		public static splitAssoc(
			text:string,
			seperator:string = "&",
			assignOperator:string = "=",
			valueFormatter?:(value:String) => string):{[name:string]:string}
		{
			var result:{[name:string]:string} = {};
			var parts = text.split(seperator);
			for (var i = 0; i < parts.length; ++i)
			{
				var pos = parts[i].indexOf(assignOperator);
				if (pos < 0)
					continue;

				var key = parts[i].substring(0, pos);
				var value = parts[i].substring(pos + assignOperator.length);
				result[key] = valueFormatter ? valueFormatter(value) : value;
			}
			return result;
		}



		/*
			Gibt die Schlüssel / Indices von obj als String
			zurück und verwendet seperator als Trennzeichen
			zwischen den einzelnen Schlüsseln.
		*/
		public static joinKeys(obj:any, seperator:string = ","):string
		{
			var parts:any[] = [];
			for (var i in obj)
				parts.push(i);
			return parts.join(seperator);
		}



		/*
			Gibt die Werte der Attribute von obj als String
			zurück und verwendet seperator als Trennzeichen
			zwischen den einzelnen Werten.
		*/
		public static joinValues(obj:any, seperator:string = ","):string
		{
			var parts:any[] = [];
			for (var i in obj)
				parts.push(obj[i]);
			return parts.join(seperator);
		}



		/*
			Gibt den Teil von text zurück, der vor needle steht.
			Falls text needle nicht enthält, wird einfach text
			zurück gegeben. fromFront gibt an, ob dabei vom Anfang
			oder vom Ende des Textes nach needle gesucht wird.
		*/
		public static getBefore(
			text:string,
			needle:string,
			fromFront:boolean = true):string
		{
			var pos = fromFront ? text.indexOf(needle) : text.lastIndexOf(needle);
			return (pos > 0) ? text.substr(0, pos) : text;
		}



		/*
			Gibt den Teil von text zurück, der hinter needle steht.
			Falls text needle nicht enthält, wird einfach text
			zurück gegeben. fromFront gibt an, ob dabei vom Anfang
			oder vom Ende des Textes nach needle gesucht wird.
		*/
		public static getAfter(
			text:string,
			needle:string,
			fromFront:boolean = true):string
		{
			var pos = fromFront ? text.indexOf(needle) : text.lastIndexOf(needle);
			return (pos >= 0) ? text.substr(pos + needle.length) : text;
		}



		/*
			Gibt text in umgekehrter Reihenfolge zurück (aus
			"Hamster" wird "retsmaH").
		*/
		public static flip(test:string):string
		{
			var result = "";
			for (var i = test.length - 1; i >= 0; --i)
				result += test.charAt(i);
			return result;
		}



		/*
			Sucht einen Teilstring in einem anderen String und ersetzt
			alle Vorkommnisse durch einen neuen Wert.

			Diese Methode benutzt explizit keine regulären Audrücke.
			Sie ist entsprechend langsamer, aber in bestimmten
			Situationen deutlich hilfreicher. U.a. kommt sie mit
			Sonderzeichen teilweise besser zurecht als replace.
		*/
		public static literalReplace(
			haystack:string,
			needle:string,
			newValue:string):string
		{
			return haystack.split(needle).join(newValue);
		}



		/*
			Praktisch das gleiche wie parseInt, gibt aber
			errorResult statt NaN zurück falls text keine Zahl ist.
			Außerdem wird immer von der Basis 10 ausgegangen
			statt es automatisch zu detektieren.
		*/
		public static parseIntSafe(text:any, errorResult:number = 0):number
		{
			if (text === null || typeof text === "undefined")
				return errorResult;

			var value = parseInt(text, 10);
			if (isNaN(value))
				value = errorResult;
			return value;
		}



		/*
			Praktisch das gleiche wie parseFloat, gibt aber
			errorResult statt NaN zurück falls text keine Zahl ist.
			Außerdem werden auch Kommas als Trennzeichen
			akzeptiert, nicht nur Punkte.
		*/
		public static parseFloatSafe(text:any, errorResult:number = 0):number
		{
			if (text === null || typeof text === "undefined")
				return errorResult;

			var value = parseFloat(text.replace(/,/g, "."));
			if (isNaN(value))
				value = errorResult;
			return value;
		}



		/*
			Funktioniert ähnlich wie der printf-Befehl in C/C++
			und ersetzt Platzhalter in einem Text durch Werte.
			Die Platzhalter werden mit % eingeleitet und werden
			von einem Specifier gefolgt. Zwischen % und Specifier
			dürfen noch Flags, Width, und Precision stehen.
			Das Format ist also folgendes (in BNF):
				%[FLAGS][WIDTH][.PRECISION]SPECIFIER

			Um ein % auszugeben, muss es im String durch ein weiteres
			% escaped werden.

			SPECIFIER ist einer von:
				n :number
				s :string
				j : JSON

			FLAGS können keiner oderer mehrere sein von:
				0 : Ausgabe mit 0-Zeichen auspolstern
				- : Ausgabe linksbündig ausgeben statt rechtsbündig
				+ : Ausgabe zentriert ausgeben statt rechtsbündig
				h : Zahl als Hexadezimalwert ausgeben
				b : Zahl als Binärwert ausgeben

			WIDTH ist die Mindestbreite der Ausgabe in Zeichen.

			PRECISION ist die Anzahl der Nachkommastellen bei
			Float-Werten.

			Beispiel für Anwendung:
				log(kr3m.util.StringEx.format("Fortschritt: %04.1n%% (%n / %n) %s", 0.3333, 1, 3, "lang_de.xml"));
		*/
		public static format(text:string, ...values:any[]):string
		{
			var result = "";
			var j = 0;
			var specs = {"%":true, "n":true, "j":true, "s":true};
			for (var i = 0; i < text.length; ++i)
			{
				var token = text.charAt(i);
				if (token == "%")
				{
					var k = i + 1;
					do
					{
						if (k >= text.length)
							return result;

						var spec = text.charAt(k++);
					}
					while (!specs[spec]);
					var options = text.slice(i + 1, k - 1);
					var matches = options.match(/^([0\-\+hb]*)(\d*)\.?(\d*)([hb])*$/);
					if (!matches)
						continue;

					var padWith = (matches[1].indexOf("0") >= 0) ? "0" : " ";
					var alignLeft = matches[1].indexOf("-") >= 0;
					var alignCenter = matches[1].indexOf("+") >= 0;
					var length = StringEx.parseIntSafe(matches[2]);
					var precision = StringEx.parseIntSafe(matches[3]);
					var base = 10;
					if ((matches[1] && matches[1].indexOf("h") >= 0) || (matches[4] && matches[4].indexOf("h") >= 0))
						base = 16;
					else if ((matches[1] && matches[1].indexOf("b") >= 0) || (matches[4] && matches[4].indexOf("b") >= 0))
						base = 2;

					var value:string;
					switch (spec)
					{
						case "%":
							if (options == "")
							{
								result += "%";
								++i;
								continue;
							}
							break;

						case "n": value = (precision > 0 ? values[j++].toFixed(precision) : values[j++]).toString(base); break;
						case "s": value = values[j++].toString(); break;
						case "j": value = Json.encode(values[j++]); break;
					}

					value = value || "";
					if (alignCenter)
					{
						var odd = false;
						while (value.length < length)
						{
							if (odd)
								value += padWith;
							else
								value = padWith + value;
							odd = !odd;
						}
					}
					else if (alignLeft)
					{
						while (value.length < length)
							value += padWith;
					}
					else
					{
						while (value.length < length)
							value = padWith + value;
					}
					result += value;
					i = k - 1;
				}
				else
				{
					result += token;
				}
			}
			return result;
		}



		/*
			Bricht einen Versionsstring in die einzelnen Teile
			auf und wandelt diese in Zahlen um. Anschließend
			werden sie als Array von Zahlen zurückgegeben.

			Die Umwandlung in Zahlen ist wichtig, damit es nicht
			zu lexikalischen Vergleichen kommt. Lässt man diese
			Umwandlung weg, dann wird z.B. Version "1.4" als
			höhere Version angesehen als "1.10" - was nicht
			erwünscht ist.
		*/
		public static getVersionParts(
			version:string,
			padToLength:number = 0):number[]
		{
			var parts:any[] = version.split(".").map(part => StringEx.parseIntSafe(part));
			while (parts.length < padToLength)
				parts.push(0);
			return parts;
		}



		/*
			Zerlegt einen Eingabestring und wandelt ihn in eine
			Parameterliste um.
		*/
		public static splitArguments(line:string):string[]
		{
			var args = line.split(" ");
			for (var i = 0; i < args.length; ++i)
			{
				var token = args[i].slice(0, 1);
				if (token == "'" || token == '"')
				{
					for (var j = i + 1; j < args.length; ++j)
					{
						args[i] += " " + args[j];
						if (args[j].slice(-1) == token)
							break;
					}
					args.splice(i + 1, j - i);
				}
				else
				{
					args[i] = args[i].trim();
				}

				if (args[i] == "")
					args.splice(i--, 1);
			}
			return args;
		}



		/*
			Durchsucht einen String-Array nach bestimmten
			Zeichenfolgen und gibt das Ergebnis entsprechend
			geordnet zurück. Das Haupteinsatzgebiet dieser
			Funktion ist es, Parameter, die von der Befehls-
			zeile übergeben wurden entsprechend zuzuordnen.

			Beispiel:

				kr3m.utilString.getNamedArguments(args,
				{
					"--out" : {name : "outPath", count : 1},
					"--in" : {name : "inPath", count : 1}
				});

		*/
		public static getNamedArguments(params:string[], mapping:any = {}):any
		{
			var result:any = {values:[]};
			for (var i = 0; i < params.length; ++i)
			{
				var meta = mapping[params[i]];
				if (meta)
				{
					var name = meta.name || params[i];
					var count = meta.count || 0;
					if (count == 0)
					{
						result[name] = params[i];
					}
					else if (count == 1)
					{
						result[name] = params[++i];
					}
					else
					{
						result[name] = [];
						for (var j = 0; j < count; ++j)
							result[name].push(params[++i]);
					}
				}
				else
				{
					result.values.push(params[i]);
				}
			}
			return result;
		}



		/*
			Bricht einen Text an den Leerzeichen um damit die Länge der
			einzelnen Zeilen lineLength nicht überschreitet. prefix und
			suffix werden an den Anfang bzw. das Ende jeder einzelnen
			neuen Zeile gehängt.
		*/
		public static wrapText(
			text:string,
			lineLength:number = 80,
			prefix:string = "",
			suffix:string = ""):string
		{
			if (lineLength < 0)
				return text;

			var words = text.split(" ");
			if (words.length == 0)
				return text;

			var result = "";
			var line = words[0];
			var count = words.length;
			for (var i = 1; i < count; ++i)
			{
				if (line.length + 1 + words[i].length <= lineLength)
				{
					line += " " + words[i];
				}
				else
				{
					result += prefix + line + suffix + "\n";
					line = words[i];
				}
			}
			result += prefix + line + suffix;
			return result;
		}



		public static sortCaseIndependant(items:string[]):void
		{
			items.sort((a, b) => a.trim().localeCompare(b.trim()));
		}



		public static getUnitString(
			value:number,
			units:{[unitName:string]:number},
			maxUnits = 0):string
		{
			if (value == 0)
				return "0" + (Object.keys(units)[0] || "");

			var parts:string[] = [];
			for (var unit in units)
			{
				var amount = value % units[unit];
				if (amount > 0)
					parts.unshift(amount + unit);
				value = Math.floor(value / units[unit]);
			}

			if (maxUnits > 0)
				parts = parts.slice(0, maxUnits);

			return parts.join(" ");
		}



		public static bigNumber(value:number, maxUnits = 0):string
		{
			var units = {"" : 1000, k : 1000, M : 1000, G : 1000, T : 1000, P : 1000, E : 1000, Z : 1000, Y : 1000, ALOT : 100000000};
			return StringEx.getUnitString(value, units, maxUnits);
		}



		/*
			Gibt eine Größe (in Byte) in einem String folgender
			Art zurück: "4MB 32kB". Ist useDual true wird 1024
			als Schrittweite verwendet, ansonsten 1000.
		*/
		public static getSizeString(size:number, useDual = true, maxUnits = 0):string
		{
			var units = useDual
				? {B : 1024, kB : 1024, MB : 1024, GB : 1024, TB : 1024, PB : 1024, EB : 1024, ZB : 1024, YB : 1024, ALOT : 100000000}
				: {B : 1000, kB : 1000, MB : 1000, GB : 1000, TB : 1000, PB : 1000, EB : 1000, ZB : 1000, YB : 1000, ALOT : 100000000};
			return StringEx.getUnitString(size, units, maxUnits);
		}



		/*
			Gibt zu einer Zeitdauer (in ms) einen String folgender
			Art zurück: "4d 2h 35m 23s 634ms".
		*/
		public static getDurationString(duration:number, maxUnits = 0):string
		{
			var units = {ms : 1000, s : 60, m : 60, h : 24, d : 7, w : 52, y : 100, centuries : 10, millenia : 1000, ages : 100000000};
			return StringEx.getUnitString(duration, units, maxUnits);
		}
	}
}



//# UNITTESTS
setTimeout(() =>
{
	var S = kr3m.util.StringEx;
	new kr3m.unittests.Suite("kr3m.util.StringEx")
	.add(new kr3m.unittests.CaseSync("flip I", () => S.flip("Hamster"), "retsmaH"))
	.add(new kr3m.unittests.CaseSync("splitNoQuoted I", () => S.splitNoQuoted("Unquoted String"), ["Unquoted String"]))
	.add(new kr3m.unittests.CaseSync("splitNoQuoted II", () => S.splitNoQuoted("one,two,three"), ["one", "two", "three"]))
	.add(new kr3m.unittests.CaseSync("splitNoQuoted III", () => S.splitNoQuoted("'one,two',three,'four','five,six,seven',eight"), ["'one,two'", "three", "'four'", "'five,six,seven'", "eight"]))
	.add(new kr3m.unittests.CaseSync("splitNoQuoted IV", () => S.splitNoQuoted("one,two;three,four;five", ";"), ["one,two", "three,four", "five"]))
	.add(new kr3m.unittests.CaseSync("splitNoQuoted V", () => S.splitNoQuoted("(1+2)+(3*4)+5+6*(7+8)", "+", ["("], [")"]), ["(1+2)", "(3*4)", "5", "6*(7+8)"]))
	.add(new kr3m.unittests.CaseSync("splitNoQuoted VI", () => S.splitNoQuoted("'one,two',\"three,four\",'five,\"six\",seven',\"eight,'nine'\""), ["'one,two'", "\"three,four\"", "'five,\"six\",seven'", "\"eight,'nine'\""]))
	.add(new kr3m.unittests.CaseSync("splitNoQuoted VII", () => S.splitNoQuoted("id=\"meineId\" name=\"Hans\"", " "), ["id=\"meineId\"", "name=\"Hans\""]))
	.add(new kr3m.unittests.CaseSync("getVersionParts I", () => S.getVersionParts("1.2.3.4"), [1, 2, 3, 4]))
	.add(new kr3m.unittests.CaseSync("getVersionParts II", () => S.getVersionParts("1.23.45"), [1, 23, 45]))
	.add(new kr3m.unittests.CaseSync("getVersionParts III", () => S.getVersionParts("1.23.45", 5), [1, 23, 45, 0, 0]))
	.add(new kr3m.unittests.CaseSync("getBefore I", () => S.getBefore("1,2,3,4,5,6", ":"), "1,2,3,4,5,6"))
	.add(new kr3m.unittests.CaseSync("getBefore II", () => S.getBefore("1,2,3,4,5,6", ","), "1"))
	.add(new kr3m.unittests.CaseSync("getBefore III", () => S.getBefore("1,2,3,4,5,6", ",", false), "1,2,3,4,5"))
	.add(new kr3m.unittests.CaseSync("getAfter I", () => S.getAfter("1,2,3,4,5,6", ":"), "1,2,3,4,5,6"))
	.add(new kr3m.unittests.CaseSync("getAfter II", () => S.getAfter("1,2,3,4,5,6", ","), "2,3,4,5,6"))
	.add(new kr3m.unittests.CaseSync("getAfter III", () => S.getAfter("1,2,3,4,5,6", ",", false), "6"))
	.run();
}, 1);
//# /UNITTESTS
