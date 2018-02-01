/// <reference path="../constants.ts"/>
/// <reference path="../util/regex.ts"/>

//# UNITTESTS
/// <reference path="../unittests/suite.ts"/>
//# /UNITTESTS



module kr3m.util
{
	export class Validator
	{
		/*
			Gibt true zurück, wenn text eine gültige EMail-Adresse
			ist oder false falls nicht. Es wird nicht die offizielle
			W3C-Syntax verwendet, deswegen können manche extrem
			exotischen Adressen zu Fehlerkennungen führen.
		*/
		public static email(text:string):boolean
		{
			if (!text)
				return false;

			return kr3m.REGEX_EMAIL.test(text);
		}



		public static date(d:number, m:number, y:number):boolean
		{
			var date = new Date(y, m - 1, d);
			return (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d);
		}



		public static username(text:string):boolean
		{
			if (!text)
				return false;

			return kr3m.REGEX_USERNAME.test(text);
		}



		public static deviceId(text:string):boolean
		{
			if (!text)
				return false;

			return kr3m.REGEX_DEVICE_ID.test(text);
		}



		public static url(text:string):boolean
		{
			if (!text)
				return false;

			return kr3m.REGEX_URL.test(text);
		}



		public static dataUrl(text:string):boolean
		{
			if (!text)
				return false;

			return kr3m.REGEX_DATA_URL.test(text);
		}



		/*
			Gibt true zurück, wenn text eine ganze Zahl ist oder
			false falls nicht.
		*/
		public static isInt(text:string):boolean
		{
			if (!text)
				return false;

			return kr3m.REGEX_INTEGER.test(text);
		}



		/*
			Gibt true zurück, wenn text eine Kommazahl ist oder
			false falls nicht.
		*/
		public static isFloat(text:string):boolean
		{
			if (!text)
				return false;

			return kr3m.REGEX_FLOAT.test(text);
		}



		/*
			Gibt eine Bewertung der "Sicherheit" des eingegebenen
			Passworts zurück. Die Bewertung liegt zwischen 0 (völlig
			unsicher) und 1 (extrem sicher).
		*/
		public static getPasswordSecurity(password:string):number
		{
			var maxLevel = 3;
			for (var i = maxLevel; i >= 0; --i)
				if (Validator.securePassword(password, i))
					return i / maxLevel;
			return 0;
		}



		/*
			Gibt true zurück, wenn das gegebene Passwort ein
			"sicheres" Password ist. password ist das Passwort,
			das überprüft werden soll, level gibt an, wie sicher
			das Passwort sein muss. Je höher, desto strikter muss
			ein Passwort sein um akzeptiert zu werden.
			Beispiele für level sind:
				PASSWORD_SECURITY_NONE (0):
					- keine Sicherheit benötigt (Highscores)
					- Darf nicht leer sein
				PASSWORD_SECURITY_LOW (1):
					- ein bisschen Sicherheit, keine gefährlichen Daten (nicht personalisierte Profildaten)
					- Mindestlänge 4 Zeichen
				PASSWORD_SECURITY_MEDIUM (2):
					- wichtige personenbezogene Daten (private Profildaten)
					- Mindestlänge 6 Zeichen
				PASSWORD_SECURITY_HIGH (3):
					- Zahlungsrelevante Daten (Kreditkarten-, Kontonummern)
					- Mindestlänge 8 Zeichen
					- Muss mindestens eine Zahl, einen Großbuchstaben und ein Sonderzeichen enthalten
			Jedes Level beinhaltet die Anforderungen der
			darunterliegenden Level.
		*/
		public static securePassword(
			password:string,
			level:number = kr3m.PASSWORD_SECURITY_LOW):boolean
		{
			if (password == "")
				return false;

			if (level <= kr3m.PASSWORD_SECURITY_NONE)
				return true;

			if (password.length < 4)
				return false;

			if (level <= kr3m.PASSWORD_SECURITY_LOW)
				return true;

			if (password.length < 6)
				return false;

			if (level <= kr3m.PASSWORD_SECURITY_MEDIUM)
				return true;

			if (password.length < 8)
				return false;

			var types = {digits:/\d/, capitalLetters:/[A-Z]/, letters:/[a-z]/};
			var typeCount = {digits:0, capitalLetters:0, letters:0, others:0};

			for (var j = 0; j < password.length; ++j)
			{
				var token = password.substr(j, 1);
				var found = false;
				for (var i in types)
				{
					if (types[i].test(token))
					{
						++typeCount[i];
						found = true;
					}
				}
				if (!found)
					++typeCount.others;
			}

			if (typeCount.digits <= 0
				|| typeCount.capitalLetters <= 0
				|| typeCount.others <= 0)
				return false;

			return true;
		}
	}
}



//# UNITTESTS
setTimeout(() =>
{
	var V = kr3m.util.Validator;
	new kr3m.unittests.Suite("kr3m.util.Validator")
	.add(new kr3m.unittests.CaseSync("isInt I", () => V.isInt("0"), true))
	.add(new kr3m.unittests.CaseSync("isInt II", () => V.isInt("42"), true))
	.add(new kr3m.unittests.CaseSync("isInt III", () => V.isInt("42.35"), false))
	.add(new kr3m.unittests.CaseSync("isInt IV", () => V.isInt("-42"), true))
	.add(new kr3m.unittests.CaseSync("isInt V", () => V.isInt("Hamster"), false))
	.add(new kr3m.unittests.CaseSync("isInt VI", () => V.isInt(""), false))
	.add(new kr3m.unittests.CaseSync("isFloat I", () => V.isFloat("0"), true))
	.add(new kr3m.unittests.CaseSync("isFloat II", () => V.isFloat("42"), true))
	.add(new kr3m.unittests.CaseSync("isFloat III", () => V.isFloat("42.35"), true))
	.add(new kr3m.unittests.CaseSync("isFloat IV", () => V.isFloat("-42"), true))
	.add(new kr3m.unittests.CaseSync("isFloat V", () => V.isFloat("Hamster"), false))
	.add(new kr3m.unittests.CaseSync("isFloat VI", () => V.isFloat(""), false))
	.run();
}, 1);
//# /UNITTESTS
