module kr3m.tools.autoformatter.languages
{
	export class Language
	{
		public static languages:kr3m.tools.autoformatter.languages.Language[] = [];



		constructor(public filePattern:RegExp)
		{
			// wird in abgeleiteten Klassen überschrieben
		}



		public autoformat(code:string, filePath:string):string
		{
			// wird in abgeleiteten Klassen überschrieben
			return code;
		}
	}
}
