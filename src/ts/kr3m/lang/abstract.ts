module kr3m.lang
{
	/*
		The classes in this module are used for actual changes
		to a given language. They are not used for localization.
		Localization is done using kr3m.util.Localization.
	*/
	export abstract class Abstract
	{
		protected languageId:string;
		protected countryId:string;



		public getLanguageId():string
		{
			return this.languageId;
		}



		public getCountryId():string
		{
			return this.countryId;
		}



		public getLocale():string
		{
			return this.languageId + this.countryId;
		}



		public abstract getSingular(word:string):string;
		public abstract getPlural(word:string):string;



		public getSingulars(words:string[]):string[]
		{
			return words.map(word => this.getSingular(word));
		}



		public getPlurals(words:string[]):string[]
		{
			return words.map(word => this.getPlural(word));
		}
	}
}
