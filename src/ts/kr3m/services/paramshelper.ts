/// <reference path="../lib/node.ts"/>
/// <reference path="../payment/validator.ts"/>
/// <reference path="../util/class.ts"/>
/// <reference path="../util/dates.ts"/>
/// <reference path="../util/json.ts"/>
/// <reference path="../util/stringex.ts"/>
/// <reference path="../util/util.ts"/>
/// <reference path="../util/validator.ts"/>



module kr3m.services
{
	/*
		Klasse mit Bequemlichkeitsmethoden für die Arbeit mit
		Parametern bei Serviceaufrufen.

		Ist vor allem dafür gedacht, zu überprüfen, ob alle
		erforderlichen Parameter vorhanden sind und ob sie
		korrekte Daten enthalten. Ist praktisch die erste
		Verteidigungslinie gegen Eingaben, die vom User kommen.
	*/
	export class ParamsHelper
	{
		public static passwordSecurityLevel:number = kr3m.PASSWORD_SECURITY_NONE; // wie von kr3m.util.Validator.securePassword verwendet

		public rawParameters:any = null;
		public parameters:any = null;

		private useVODefaults:any = {};

		// optionale Überprüfungen von Attributen
		public checkNaN = true; // überprüfen, ob numbers NaN sind oder nicht
		public checkEmptyString = false; // überprüfen, ob strings leer sind oder nicht
		public deleteUnknownFields:boolean; // alle nicht überprüften Felder aus dem params Objekt löschen

		// optionale Umwandlungen von Attributen während des Überprüfens
		public emailLowerCase = true; // wandelt alle emails in Kleinschreibung um
		public passwordMd5Hash = true; // wandelt Passwörter während der Überprüfung in MD5 Hashes um



		constructor(rawParameters:any, deleteUnknownFields:boolean = false)
		{
			this.rawParameters = kr3m.util.Util.clone(rawParameters);
			this.parameters = rawParameters;
			this.deleteUnknownFields = deleteUnknownFields;
		}



		/*
			Nimmt kleinere Umwandlungen des gegebenen Wertes vor bevor er überprüft wird:
			- Zahlen, die als Strings übermittelt wurden in tatsächliche number-Values umgewandelt
			- Strings, die als Zahlen übermittelt wurden werden über toString() in Strings umgewandelt
			- Großbuchstaben in E-Mail-Adressen werden in Kleinbuchstaben umgewandelt
			- Daten, die als JSON-Objekte erwartet werden, werden dekodiert
			- Booleans, die als String übermittelt wurden werden in tatsächliche Booleans umgewandelt
			- Arrays, die als Kommaseperierte Strings übermittelt wurden werden in Arrays umgewandelt
		*/
		private preCast(value:any, postType:string):{type:string, value:any}
		{
			var preType = typeof value;
			try
			{
				if (preType == "string")
				{
					if (typeof postType == "string")
					{
						var matches = postType.match(/^([a-zA-Z0-9\.]+)\[(\d*)\]$/i);
						if (matches)
							return this.preCast(value.split(","), postType)
					}

					if (typeof postType == "string" && postType.slice(0, 5) == "JSON:")
						return this.preCast(kr3m.util.Json.decode(value), postType.slice(5));

					if (postType == "number")
					{
						var newNumber = parseFloat(value);
						if (isNaN(newNumber))
							return {type : postType, value : undefined};
						return {type : postType, value : newNumber};
					}

					if (postType == "int" || postType == "uint")
					{
						var newNumber = parseInt(value, 0);
						if (isNaN(newNumber))
							return {type : postType, value : undefined};
						if (postType == "uint" && newNumber < 0)
							return {type : postType, value : undefined};
						return {type : postType, value : newNumber};
					}

					if (postType == "boolean" && (value == "true" || value == "false"))
						return {type : postType, value : value == "true"};

					if (postType == "email" && this.emailLowerCase)
						return {type : postType, value : value.toLowerCase()};

					if (postType == "date")
					{
						var newDate = kr3m.util.Dates.getDateFromDateTimeString(value);
						if (newDate)
							return {type : postType, value : newDate};
						newDate = new Date(value);
						if (!isNaN(newDate.getTime()))
							return {type : postType, value : newDate};
						return {type : postType, value : undefined};
					}
				}
				else if (preType == "number")
				{
					if (postType == "string")
						return {type : postType, value : value.toString()};
				}
				else if (utilLib.isArray(value))
				{
					var matches = postType.match(/^([a-zA-Z0-9\.]+)\[(\d*)\]$/i);
					if (matches)
					{
						for (var i = 0; i < value.length; ++i)
							value[i] = this.preCast(value[i], matches[1]).value;
					}
				}
			}
			catch(e)
			{
				// nichts machen, einfach weiter
			}
			return {type : postType, value : value};
		}



		/*
			Nimmt kleinere Umwandlungen des gegebenen
			Wertes vor nachdem er überprüft wurde:
			- Passwörter werden MD5 und Base64 encoded
		*/
		private postCast(value:any, type:string):any
		{
			var valueType = typeof value;
			try
			{
				if (valueType == "string")
				{
					if (this.passwordMd5Hash && type == "password")
						return getMd5Base64(value);
				}
			}
			catch(e)
			{
				// nichts machen, einfach weiter
			}
			return value;
		}



		/*
			Überprüft ob value ein gültiger Wert ist, in abhängigkeit
			von desiredType. Dabei kann desiredType selbst verschiedene
			Formen haben, je nach dem, was überprüft werden soll.

			- desiredType kann ein String sein, der den Namen eines
			primitiven Datentypen enthält: "boolean", "string",
			"number", "object", "function"
			- es sich um einen Wert aus der folgenden Liste handeln:
			"email", "url", "dataUrl", "urlOrDataUrl", "date", "iban",
			"deviceid", "password", "username", "int", "uint"
			- es kann sich um einen Klassennamen handeln - in diesem
			Fall wird ein Objekt dieser Klasse erzeugt und mit validateVO
			(s.d.) mit dem Wert verglichen
			- desiredType kann einer der obigen Werte sein, gefolgt von eckigen
			Klammern um auf Arrays zu prüfen, z.B. "string[3]" (Array
			mit drei Strings), "email[2]" usw. oder einfach "string[]"
			für einen String-Array beliebiger Länge
			- ist desiredType ein Array, wird überprüft ob value in dem
			Array enthalten ist
			- ist desiredType eine Function, wird diese aufgerufen und erhält
			value als ersten und einzigen Parameter. Der Rückgabewert
			der Funktion wird dann als Ergebnis von matchesType
			verwendet
			- ist desiredType ein regulärer Ausdruck, wird überprüft ob value
			den Ausdruck erfüllt oder nicht
			- ist desiredType ein String, der mit "JSON:" beginnt wird value
			als JSON-kodierte Version ihrer selbst betrachtet, d.h. alle
			entsprechenden values werden erst einmal JSON-dekodiert und
			anschließend überprüft

			Siehe auch die verschiedenen
			kr3m.services.ParamsHelper.check* Attribute
		*/
		private matchesType(value:any, desiredType:any):boolean
		{
			var metaType = typeof desiredType;
			if (metaType == "string")
			{
				if (desiredType == "email")
					return kr3m.util.Validator.email(value);

				if (desiredType == "url")
					return kr3m.util.Validator.url(value);

				if (desiredType == "dataUrl")
					return kr3m.util.Validator.dataUrl(value);

				if (desiredType == "urlOrDataUrl")
					return kr3m.util.Validator.url(value) || kr3m.util.Validator.dataUrl(value);

				if (desiredType == "iban")
					return kr3m.payment.Validator.iban(value);

				if (desiredType == "deviceid")
					return kr3m.util.Validator.deviceId(value);

				if (desiredType == "password")
					return kr3m.util.Validator.securePassword(value, kr3m.services.ParamsHelper.passwordSecurityLevel);

				if (desiredType == "username")
					return kr3m.util.Validator.username(value);

				var matches = desiredType.match(/^([a-zA-Z0-9\.]+)\[(\d*)\]$/i);
				if (matches)
				{
					if (!utilLib.isArray(value))
						return false;

					var expectedLength = kr3m.util.StringEx.parseIntSafe(matches[2]);
					if (expectedLength > 0 && value.length != expectedLength)
						return false;

					for (var i = 0; i < value.length; ++i)
						if (!this.matchesType(value[i], matches[1]))
							return false;

					return true;
				}

				if (desiredType == "date")
					return value instanceof Date;

				if (kr3m.util.Util.contains(["string", "boolean", "object", "number"], desiredType))
				{
					if (typeof value != desiredType)
						return false;

					if (this.checkNaN && desiredType == "number" && isNaN(value))
						return false;

					if (this.checkEmptyString && desiredType == "string" && value == "")
						return false;
				}
				else if (kr3m.util.Util.contains(["int", "uint"], desiredType))
				{
					if (typeof value != "number")
						return false;

					if (this.checkNaN && isNaN(value))
						return false;

					if (value - Math.floor(value) != 0)
						return false;

					if (desiredType == "uint" && value < 0)
						return false;
				}
				else if (desiredType == "function")
				{
					return typeof value == "function";
				}
				else
				{
					try
					{
						var tempVO = kr3m.util.Class.createInstanceOfClass(desiredType);
						return this.validateVOInternal(tempVO, this.useVODefaults[desiredType] ? tempVO : {}, value);
					}
					catch(e)
					{
						return false;
					}
				}
			}
			else if (utilLib.isArray(desiredType))
			{
				return kr3m.util.Util.contains(desiredType, value, true);
			}
			else if (metaType == "function")
			{
				return desiredType(value);
			}
			else if (utilLib.isRegExp(desiredType))
			{
				return desiredType.test(value);
			}

			return true;
		}



		private deleteUnknown(compareObj:any):void
		{
			var newParams:any = {};
			for (var i in compareObj)
				kr3m.util.Util.setProperty(newParams, i, kr3m.util.Util.getProperty(this.parameters, i));
			this.parameters = newParams;
		}



		public useVODefaultFields(voClassName:string):void
		{
			this.useVODefaults[voClassName] = true;
		}



		/*
			Überprüft ob alle in required angegebenen Werte in den
			Parametern enthalten sind und vom gegebenen Typ sind.
			Zusätzlich zu den primitiven Typen von Javascript stehen
			noch weitere Typen zur Verfügung - siehe auch
			kr3m.services.Paramshelper.matchesType

			Beispiel:

				var helper = kr3m.services.ParamsHelper(params);
				if (helper.validate({firstname:"string", lastname:"string", age:"number"}))
				{...}

			Wird für fallbacks ein Objekt mit Werten angegeben, so
			werden die Werte aus fallbacks für die entsprechenden
			Attribute verwendet falls diese bei matchesType ein false
			zurück liefern.
		*/
		public validate(required:any, fallbacks:any = {}):boolean
		{
			if (!this.parameters)
			{
//# DEBUG
				logError("parameters not set");
//# /DEBUG
				return false;
			}

			var value:any;
			for (var i in required)
			{
				value = kr3m.util.Util.getProperty(this.parameters, i);
				var cast = this.preCast(value, required[i]);
				required[i] = cast.type;
				kr3m.util.Util.setProperty(this.parameters, i, cast.value);
			}

			var failed = false;
			for (var i in required)
			{
				value = kr3m.util.Util.getProperty(this.parameters, i);
				if (!this.matchesType(value, required[i]))
				{
					if (fallbacks[i] !== undefined)
					{
						kr3m.util.Util.setProperty(this.parameters, i, fallbacks[i]);
					}
					else
					{
//# DEBUG
						if (utilLib.isRegExp(required[i]))
							log("parameter", i, "doesn't match expected regex", required[i].toString(), "with", (typeof value), ":", kr3m.util.Json.encode(value));
						else
							log("parameter", i, "doesn't match, expected", kr3m.util.Json.encode(required[i]), "but got", (typeof value), ":", kr3m.util.Json.encode(value));
//# /DEBUG
						failed = true;
					}
				}
			}

			if (failed)
				return false;

			for (var i in required)
			{
				value = kr3m.util.Util.getProperty(this.parameters, i);
				value = this.postCast(value, required[i]);
				kr3m.util.Util.setProperty(this.parameters, i, value);
			}

			if (this.deleteUnknownFields)
				this.deleteUnknown(required);

			return true;
		}



		private validateVOInternal(vo:any, fallbacks:any, params:any):boolean
		{
			if (!vo)
			{
//# DEBUG
				logError("vo not set");
//# /DEBUG
				return false;
			}

			if (!params)
			{
//# DEBUG
				logError("parameters not set");
//# /DEBUG
				return false;
			}

			var value:any;
			var type:string;

			for (var i in vo)
			{
				type = typeof vo[i];
				if (type != "function")
				{
					value = kr3m.util.Util.getProperty(params, i);
					var cast = this.preCast(value, type);
					kr3m.util.Util.setProperty(params, i, cast.value);
				}
			}

			var failed = false;
			for (var i in vo)
			{
				type = typeof vo[i];
				if (type != "function")
				{
					if (!this.matchesType(params[i], type))
					{
						if (fallbacks[i] !== undefined)
						{
							kr3m.util.Util.setProperty(params, i, fallbacks[i]);
						}
						else
						{
//# DEBUG
							log("vo attribute", i, "doesn't match");
//# /DEBUG
							failed = true;
						}
					}
				}
			}

			if (failed)
			{
//# DEBUG
				debug(params);
//# /DEBUG
				return false;
			}

			for (var i in vo)
			{
				type = typeof vo[i];
				if (type != "function")
				{
					value = kr3m.util.Util.getProperty(params, i);
					value = this.postCast(value, type);
					kr3m.util.Util.setProperty(params, i, value);
				}
			}

			if (this.deleteUnknownFields)
				this.deleteUnknown(vo);

			return true;
		}



		/*
			Überprüft ob alle Werte von vo in den Parametern enhalten
			sind und den gleichen Typ haben. Die Werte im vo müssen mit
			Werten besetzt sein, damit diese Funktion zur Laufzeit
			funktioniert. Diese Funktion ist ähnlich zu validate,
			ermittelt die erwarteten Typen aber selbst statt sie in
			Stringform zu erhalten.

			Wird für fallbacks ein Objekt mit Werten angegeben, so werden
			die Werte aus fallbacks für die entsprechenden Attribute
			verwendet falls diese bei matchesType ein false zurück liefern.
		*/
		public validateVO(vo:any, fallbacks:any = {}):boolean
		{
			return this.validateVOInternal(vo, fallbacks, this.parameters);
		}



		public transferProperties(from:any, to:any, fallbacks:any = from):void
		{
			for (var i in to)
			{
				if (typeof to[i] != "function")
					to[i] = from[i] || fallbacks[i];
			}
		}
	}
}
