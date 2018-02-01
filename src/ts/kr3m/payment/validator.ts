/// <reference path="../payment/iban.ts"/>



module kr3m.payment
{
	export class Validator
	{
		/*
			Gibt true zurück, wenn text eine gültige IBAN (international
			bank account number) ist. Es wird nur die Syntax überprüft,
			es kann natürlich nicht überprüft werden, ob das Konto, das
			zu dieser IBAN gehört, tatsächlich existiert.
		*/
		public static iban(text:string):boolean
		{
			if (!text)
				return false;

			return Iban.validate(text);
		}



		/*
			Gibt true zurück, wenn text eine gültige BIC (Business
			Identifier Code) ist. Es wird natürlich nur die Syntax
			überprüft. Da die BIC frei wählbar ist kann nicht
			überprüft werden ob es tatsächlich eine Bank mit dieser
			BIC gibt.
		*/
		public static bic(text:string):boolean
		{
			if (!text)
				return false;

			if (text.length != 8 && text.length != 11)
				return false;

			var pat = /^[a-z0-9]+$/i;
			return pat.test(text);
		}
	}
}
