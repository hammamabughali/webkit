/// <reference path="../constants.ts"/>
/// <reference path="../util/validator.ts"/>

//# !CLIENT
/// <reference path="../lib/node.ts"/>
//# /!CLIENT



module kr3m.util
{
	export class Rand
	{
		public static CHARS_ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		public static CHARS_ALPHA_NUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		public static CHARS_PASSWORD = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!§$%&/()=?{[]}#+-_~^<>|\\@,.;:";



		/*
			Gibt eine zufällige ganze Zahl zwischen min(a,b) (inklusiv)
			und max(a,b) (exklusiv) zurück.
		*/
		public static getInt(a:number, b = 0):number
		{
			var from = Math.min(a, b);
			var to = Math.max(a, b);
			return Math.floor(Math.random() * (to - from) + from);
		}



		/*
			Gibt eine zufällige Kommazahl zwischen min(a,b) (inklusiv)
			und max(a,b) (exklusiv) zurück.
		*/
		public static getFloat(a = 1, b = 0):number
		{
			var from = Math.min(a, b);
			var to = Math.max(a, b);
			return Math.random() * (to - from) + from;
		}



		/*
			Gibt einen zufälligen String der gegebenen Länge zurück.
			Mit allowedCharacters kann bestimmt werden, welche Zeichen
			darin enthalten sein dürfen - die einzelnen Zeichen können
			öfters vorkommen. Falls allowedCharacters nicht angegeben
			wird, wird kr3m.util.Rand.CHARS_ALPHA_NUM verwendet.
		*/
		public static getString(
			length:number,
			allowedCharacters?:string):string
		{
			if (length <= 0)
				return "";

			allowedCharacters = allowedCharacters || Rand.CHARS_ALPHA_NUM;

			var result:string = "";
			var len = allowedCharacters.length;
			for (var i = 0; i < length; ++i)
				result += allowedCharacters.charAt(Rand.getInt(len));
			return result;
		}



//# !CLIENT
		/*
			Das gleiche wie getString(), verwendet aber komplexere
			Mechanismen um "zufälligere" und entsprechend sichererere
			Werte zu erzeugen.
		*/
		public static getSecureString(
			length:number, allowedCharacters:string,
			callback:(result:string) => void):void
		{
			allowedCharacters = allowedCharacters || Rand.CHARS_ALPHA_NUM;
			var bpc = 1;
			var limit = 256;
			while (allowedCharacters.length >= limit)
			{
				limit *= 256;
				++bpc;
			}
			cryptoLib.randomBytes(bpc * length, (err:Error, bytes:Buffer) =>
			{
				if (err)
				{
					logError(err);
					return callback(Rand.getString(length, allowedCharacters));
				}

				var alLen = allowedCharacters.length;
				var result = "";
				for (var i = 0; i < length; ++i)
				{
					var accum = 0;
					for (var j = 0; j < bpc; ++j)
						accum = accum * 256 + bytes[i * bpc + j];

					var c = Math.floor(accum / limit * alLen);
					result += allowedCharacters.charAt(c);
				}
				callback(result);
			});
		}
//# /!CLIENT



		/*
			Gibt einen zufälligen String zurück, der als
			Name für eine (temporäre) Funktion benutzt werden
			könnte und bisher auch noch nicht verwendet wird.
		*/
		public static getFunctionName():string
		{
			var name = Rand.getString(16, Rand.CHARS_ALPHA);
			while (window[name])
				name = Rand.getString(16, Rand.CHARS_ALPHA);
			return name;
		}



		/*
			Gibt zufällig true oder false zurück mit einer
			Gewichtung von trueChance für true und einer
			Chance von (1 - trueChance) für false.
		*/
		public static getBool(trueChance = 0.5):boolean
		{
			return Math.random() < trueChance;
		}



		/*
			Gibt einen zufälligen Index innerhalb des Arrays
			zurück oder undefined falls das Array leer ist.
		*/
		public static getIndex(array:any[]):number
		{
			if (array.length == 0)
				return undefined;

			return Rand.getInt(array.length);
		}



		public static getIndexWeighted(weights:number[]):number
		{
			var total = 0;
			for (var i = 0; i < weights.length; ++i)
				total += Math.max(weights[i], 0);

			var weight = Rand.getFloat(total);
			for (var i = 0; i < weights.length; ++i)
			{
				if (weight <= weights[i])
					return i;

				weight -= Math.max(weights[i], 0);
			}
			return undefined;
		}



		/*
			Gibt ein zufälliges Element aus dem Array zurück
			oder undefined wenn das Array leer ist.
		*/
		public static getElement<T>(array:T[]):T
		{
			if (array.length == 0)
				return undefined;

			return array[Rand.getIndex(array)];
		}



		public static getElementWeighted<T>(array:T[], weights:number[]):T
		{
			if (array.length == 0)
				return undefined;

			if (array.length != weights.length)
				throw new Error("array length and weights length don't match");

			return array[Rand.getIndexWeighted(weights)];
		}



		/*
			Gibt ein Array zurück, in dem die Zahlen von 0
			(inklusiv) bis count (exklusiv) in zufälliger
			Reihenfolge enthalten sind.
		*/
		public static getShuffledInts(count:number):number[]
		{
			var result:number[] = [];
			for (var i = 0; i < count; ++i)
				result.push(i);

			return Rand.shuffleArray(result);
		}



		public static shuffleArray<T>(arr:T[]):T[]
		{
			var result = arr.slice();
			for (var i = 0; i < result.length - 1; ++i)
			{
				var pos = Rand.getInt(i, result.length);
				var temp = result[i];
				result[i] = result[pos];
				result[pos] = temp;
			}
			return result;
		}



		/*
			Gibt einen zufälligen Zeitpunkt zwischen min(a,b)
			(inklusiv) und max(a,b) (exklusiv) zurück.
		*/
		public static getTimeStamp(a:Date, b:Date):Date
		{
			var from = Math.min(a.getTime(), b.getTime());
			var to = Math.max(a.getTime(), b.getTime());
			return new Date(Math.random() * (to - from) + from);
		}



		/*
			Erzeugt ein zufälliges Passwort, welches der
			gewünschten Sicherheitsstufe entspricht. Siehe
			kr3m.util.Validator.securePassword für eine
			genauere Beschreibung der Sicherheitsstufen.
		*/
		public static getPassword(
			level = kr3m.PASSWORD_SECURITY_LOW):string
		{
			var digits = 10;
			do
			{
				var password = Rand.getString(digits, Rand.CHARS_PASSWORD);
			}
			while (!Validator.securePassword(password, level))
			return password;
		}
	}
}
