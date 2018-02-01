module kr3m.payment
{
	export class IBANSpecification
	{
		public countryCode:string;
		public length:number;
		public structure:string;
		private cachedRegex:RegExp;



		constructor(countryCode:string, length:number, structure:string)
		{
			this.countryCode = countryCode;
			this.length = length;
			this.structure = structure;
		}



		public validate(iban:string):boolean
		{
			return this.length == iban.length
				&& this.countryCode === iban.slice(0,2)
				&& this.checkStructure(iban)
				&& this.mod97(this.iso13616(iban)) == 1;
		}



		private checkStructure(iban:string):boolean
		{
			if (!this.cachedRegex)
				this.cachedRegex = this.parseStructure(this.structure);

			return this.cachedRegex.test(iban.slice(4));
		}



		private iso13616(iban:string):string
		{
			var A = 'A'.charCodeAt(0),
				Z = 'Z'.charCodeAt(0);

			iban = iban.toUpperCase();
			iban = iban.substr(4) + iban.substr(0,4);

			return iban.split("").map(function(n)
			{
				var code = n.charCodeAt(0);
				if (code >= A && code <= Z)
					return code - A + 10;
				else
					return n;
			}).join("");
		}



		private mod97(numberString:string):number
		{
			var remainder = numberString;
			while (remainder.length > 2)
			{
				var block = remainder.slice(0, 9);
				remainder = parseInt(block, 10) % 97 + remainder.slice(block.length);
			}

			return parseInt(remainder, 10) % 97;
		}



		private parseStructure(structure:string):RegExp
		{
			var regex = structure.match(/(.{3})/g).map((block:string) =>
			{
				// parse each structure block (1-char + 2-digits)
				var format:string;
				var pattern = block.slice(0, 1);
				var repeats = parseInt(block.slice(1), 10);

				switch (pattern)
				{
					case "A": format = "0-9A-Za-z"; break;
					case "B": format = "0-9A-Z"; break;
					case "C": format = "A-Za-z"; break;
					case "F": format = "0-9"; break;
					case "L": format = "a-z"; break;
					case "U": format = "A-Z"; break;
					case "W": format = "0-9a-z"; break;
				}

				return '([' + format + ']{' + repeats + '})';
			});

			return new RegExp('^' + regex.join("") + '$');
		}
	}
}
