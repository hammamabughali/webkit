/// <reference path="../payment/ibanspecification.ts"/>



module kr3m.payment
{
	export class Iban
	{
		private static countrySpecifications:{[countryCode:string]:IBANSpecification} =
		{
			AD : new IBANSpecification("AD", 24, "F04F04A12"),
			AE : new IBANSpecification("AE", 23, "F03F16"),
			AL : new IBANSpecification("AL", 28, "F08A16"),
			AO : new IBANSpecification("AO", 25, "F21"),
			AT : new IBANSpecification("AT", 20, "F05F11"),
			AZ : new IBANSpecification("AZ", 28, "U04A20"),
			BA : new IBANSpecification("BA", 20, "F03F03F08F02"),
			BE : new IBANSpecification("BE", 16, "F03F07F02"),
			BF : new IBANSpecification("BF", 27, "F23"),
			BG : new IBANSpecification("BG", 22, "U04F04F02A08"),
			BH : new IBANSpecification("BH", 22, "U04A14"),
			BI : new IBANSpecification("BI", 16, "F12"),
			BJ : new IBANSpecification("BJ", 28, "F24"),
			BR : new IBANSpecification("BR", 29, "F08F05F10U01A01"),
			CH : new IBANSpecification("CH", 21, "F05A12"),
			CI : new IBANSpecification("CI", 28, "U01F23"),
			CM : new IBANSpecification("CM", 27, "F23"),
			CR : new IBANSpecification("CR", 21, "F03F14"),
			CV : new IBANSpecification("CV", 25, "F21"),
			CY : new IBANSpecification("CY", 28, "F03F05A16"),
			CZ : new IBANSpecification("CZ", 24, "F04F06F10"),
			DE : new IBANSpecification("DE", 22, "F08F10"),
			DK : new IBANSpecification("DK", 18, "F04F09F01"),
			DO : new IBANSpecification("DO", 28, "U04F20"),
			DZ : new IBANSpecification("DZ", 24, "F20"),
			EE : new IBANSpecification("EE", 20, "F02F02F11F01"),
			ES : new IBANSpecification("ES", 24, "F04F04F01F01F10"),
			FI : new IBANSpecification("FI", 18, "F06F07F01"),
			FO : new IBANSpecification("FO", 18, "F04F09F01"),
			FR : new IBANSpecification("FR", 27, "F05F05A11F02"),
			GB : new IBANSpecification("GB", 22, "U04F06F08"),
			GE : new IBANSpecification("GE", 22, "U02F16"),
			GI : new IBANSpecification("GI", 23, "U04A15"),
			GL : new IBANSpecification("GL", 18, "F04F09F01"),
			GR : new IBANSpecification("GR", 27, "F03F04A16"),
			GT : new IBANSpecification("GT", 28, "A04A20"),
			HR : new IBANSpecification("HR", 21, "F07F10"),
			HU : new IBANSpecification("HU", 28, "F03F04F01F15F01"),
			IE : new IBANSpecification("IE", 22, "U04F06F08"),
			IL : new IBANSpecification("IL", 23, "F03F03F13"),
			IR : new IBANSpecification("IR", 26, "F22"),
			IS : new IBANSpecification("IS", 26, "F04F02F06F10"),
			IT : new IBANSpecification("IT", 27, "U01F05F05A12"),
			JO : new IBANSpecification("JO", 30, "A04F22"),
			KW : new IBANSpecification("KW", 30, "U04A22"),
			KZ : new IBANSpecification("KZ", 20, "F03A13"),
			LB : new IBANSpecification("LB", 28, "F04A20"),
			LC : new IBANSpecification("LC", 32, "U04F24"),
			LI : new IBANSpecification("LI", 21, "F05A12"),
			LT : new IBANSpecification("LT", 20, "F05F11"),
			LU : new IBANSpecification("LU", 20, "F03A13"),
			LV : new IBANSpecification("LV", 21, "U04A13"),
			MC : new IBANSpecification("MC", 27, "F05F05A11F02"),
			MD : new IBANSpecification("MD", 24, "U02A18"),
			ME : new IBANSpecification("ME", 22, "F03F13F02"),
			MG : new IBANSpecification("MG", 27, "F23"),
			MK : new IBANSpecification("MK", 19, "F03A10F02"),
			ML : new IBANSpecification("ML", 28, "U01F23"),
			MR : new IBANSpecification("MR", 27, "F05F05F11F02"),
			MT : new IBANSpecification("MT", 31, "U04F05A18"),
			MU : new IBANSpecification("MU", 30, "U04F02F02F12F03U03"),
			MZ : new IBANSpecification("MZ", 25, "F21"),
			NL : new IBANSpecification("NL", 18, "U04F10"),
			NO : new IBANSpecification("NO", 15, "F04F06F01"),
			PK : new IBANSpecification("PK", 24, "U04A16"),
			PL : new IBANSpecification("PL", 28, "F08F16"),
			PS : new IBANSpecification("PS", 29, "U04A21"),
			PT : new IBANSpecification("PT", 25, "F04F04F11F02"),
			QA : new IBANSpecification("QA", 29, "U04A21"),
			RO : new IBANSpecification("RO", 24, "U04A16"),
			RS : new IBANSpecification("RS", 22, "F03F13F02"),
			SA : new IBANSpecification("SA", 24, "F02A18"),
			SE : new IBANSpecification("SE", 24, "F03F16F01"),
			SI : new IBANSpecification("SI", 19, "F05F08F02"),
			SK : new IBANSpecification("SK", 24, "F04F06F10"),
			SM : new IBANSpecification("SM", 27, "U01F05F05A12"),
			SN : new IBANSpecification("SN", 28, "U01F23"),
			ST : new IBANSpecification("ST", 25, "F08F11F02"),
			TL : new IBANSpecification("TL", 23, "F03F14F02"),
			TN : new IBANSpecification("TN", 24, "F02F03F13F02"),
			TR : new IBANSpecification("TR", 26, "F05F01A16"),
			UA : new IBANSpecification("UA", 29, "F25"),
			VG : new IBANSpecification("VG", 24, "U04F16"),
			XK : new IBANSpecification("XK", 20, "F04F10F02")
		};



		public static validate(iban:string):boolean
		{
			if (typeof iban != "string")
				return false;

			iban = Iban.getElectronicFormat(iban);
			var countrySpecification = Iban.countrySpecifications[iban.slice(0,2)];
			return !!countrySpecification && countrySpecification.validate(iban);
		}



		public static getCountryCode(iban:string):string
		{
			return iban.slice(0, 2);
		}



		public static getBankCode(iban:string):string
		{
			var countryId = iban.slice(0, 2);
			var spec = Iban.countrySpecifications[countryId];
			if (!spec)
				return "";

			var length = parseInt(spec.structure.slice(1, 3), 10);
			return iban.substring(4, 4 + length).replace(/^0+/, "").trim();
		}



		public static getElectronicFormat(iban:string):string
		{
			return iban.trim().replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
		}



		public static getPrintFormat(iban:string, separator:string = " "):string
		{
			return this.getElectronicFormat(iban).replace(/(.{4})(?!$)/g, "$1" + separator);
		}
	}
}
