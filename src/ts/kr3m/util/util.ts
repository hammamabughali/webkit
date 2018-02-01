/// <reference path="../types.ts"/>

//# DEBUG
/// <reference path="../util/log.ts"/>
//# /DEBUG

//# UNITTESTS
/// <reference path="../unittests/suite.ts"/>
//# /UNITTESTS



﻿module kr3m.util
{
	export class Util
	{
		/*
			Prüft ob die Objekte identisch sind
		*/
		public static equal(
			obj1:any,
			obj2:any,
			maxRecursionDepth = 1000):boolean
		{
			if (maxRecursionDepth < 0)
				return true;

			if (!obj1 != !obj2)
				return false;

			if (!obj1 && !obj2)
				return true;

			--maxRecursionDepth;

			if (typeof obj1 != "object" || typeof obj2 != "object")
				return obj1 === obj2;

			if (!obj1 != !obj2)
				return false;

			if (typeof obj1.equals == "function")
				return obj1.equals(obj2);

			if ((obj1.length || obj2.length) && obj1.length != obj2.length)
				return false;

			if (obj1 instanceof Date && obj2 instanceof Date)
				return obj1.getTime() == obj2.getTime();

			for (var i in obj1)
			{
				if (!Util.equal(obj1[i], obj2[i], maxRecursionDepth))
					return false;
			}

			for (var i in obj2)
			{
				if (!Util.equal(obj1[i], obj2[i], maxRecursionDepth))
					return false;
			}

			return true;
		}



		/*
			Compares all fields given in fieldNames are equal for
			obj1 and obj2 and returns true if they are, or false
			otherwise. If strict is set to true the strict compare
			operator is used.

		*/
		public static fieldsMatch(obj1:any, obj2:any, fieldNames:string[], strict = false):boolean
		{
			if (!obj1 || !obj2)
				return false;

			if (strict)
			{
				for (var i = 0; i < fieldNames.length; ++i)
				{
					if (Util.getProperty(obj1, fieldNames[i]) !== Util.getProperty(obj2, fieldNames[i]))
						return false;
				}
			}
			else
			{
				for (var i = 0; i < fieldNames.length; ++i)
				{
					if (Util.getProperty(obj1, fieldNames[i]) != Util.getProperty(obj2, fieldNames[i]))
						return false;
				}
			}
			return true;
		}



		/*
			Erstellt eine (Tiefen-)Kopie des gegebenen Objektes.
			Es wird ebenfalls versucht, Prototypen korrekt zu
			setzen um Klassen beizubehalten.
			Achtung: es wird nicht geprüft, ob die übergebenen
			Objekte cyclische Graphen bilden. In solchen Fällen
			wird es mit hoher Wahrscheinlichkeit zu Endlosschleifen
			führen.
		*/
		public static clone<T>(obj:T):T
		{
			if (!obj || typeof obj != "object")
				return obj;

			if (obj instanceof Date)
				return <any> new Date((<any> obj).getTime());

			var result:any = typeof obj["length"] == "number" ? [] : obj["__proto__"] ? Object.create(obj["__proto__"]) : {};
			var keys = Object.keys(obj);
			for (var i = 0; i < keys.length; ++i)
			{
				if (typeof obj[keys[i]] == "object")
					result[keys[i]] = Util.clone(obj[keys[i]]);
				else
					result[keys[i]] = obj[keys[i]];
			}
			return result;
		}



		/*
			Ersetzt alle "gefährlichen" Sonderzeichen in einem String durch
			HTML-escaped Zeichen. Ist praktisch die Javascriptversion der
			html_specialchars Funktion aus PHP.
		*/
		public static encodeHtml(text:string):string
		{
			if (!text)
				return text;

			text = text
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#039;");
			return text;
		}



		/*
			Das Gegenstück zu encodeHtml
		*/
		public static decodeHtml(text:string):string
		{
			var tokens = { nbsp : " ", amp : "&", lt : "<", gt : ">", quot : "\"" };
			text = text.replace(/&(#?\w+?);/g, (all, captured) =>
			{
				if (tokens[captured])
					return tokens[captured];

				try
				{
					if (captured.charAt(0) == "#")
						return String.fromCharCode(parseInt(captured.slice(1)));
				}
				catch (e)
				{
				}
				return all;
			});
			return text;
		}



		/*
			Gibt das gegebene Array in verkehrter Reihenfolge zurück
		*/
		public static reverse<T>(values:T[]):T[]
		{
			values = values.slice();
			var m = Math.floor(values.length / 2);
			var e = values.length - 1;
			for (var i = 0; i < m; ++i)
				[values[i], values[e - i]] = [values[e - i], values[i]];
			return values;
		}



//# DEPRECATED_1_4_20_16
		/*
			Eine indexOf Funktion für Arrays. Leider ist indexOf in einigen
			Browsern nicht vorhanden und auch die JQuery-Funktion ist teilweise
			nicht ganz problemlos. Ist strict true wird der strikte
			Gleichheitsoperator === für den Vergleich verwendet statt der
			einfache Gleichheitsoperator == .
		*/
		public static indexOf<T = any>(
			needle:T,
			haystack:ArrayLike<T>,
			strict = false):number
		{
			if (!haystack || haystack.length <= 0)
				return -1;

			for (var i= 0; i < haystack.length; ++i)
			{
				if (haystack[i] === needle || (!strict && haystack[i] == needle))
					return i;
			}
			return -1;
		}
//# /DEPRECATED_1_4_20_16



		/*
			Gibt true zurück, falls target in container vorhanden
			ist oder false falls nicht. Ist im Prinzip eine Bequemlichkeits-
			methode, um nicht immer indexOf > -1 schreiben zu müssen.
			Ist strict true wird der strikte Gleichheitsoperator === für den
			Vergleich verwendet statt der einfache Gleichheitsoperator == .
		*/
		public static contains<T = any>(
			container:ArrayLike<T>,
			target:T,
			strict = false):boolean
		{
			if (!container || container.length <= 0)
				return false;

			for (var i = 0; i < container.length; ++i)
			{
				if (container[i] === target || (!strict && container[i] == target))
					return true;
			}
			return false;
		}



		/*
			Entfernt target aus container falls es darin vorhanden ist.
			War es vorhanden, wird das entfernte Element zurück gegeben.
			Ist strict true wird der strikte Gleichheitsoperator === für den
			Vergleich verwendet statt der einfache Gleichheitsoperator == .
		*/
		public static remove<T = any>(
			container:T[],
			target:T,
			strict = false):T
		{
			for (var i = 0; i < container.length; ++i)
			{
				if (container[i] === target || (!strict && container[i] == target))
					return container.splice(i, 1)[0];
			}
			return null;
		}



		/*
			Gibt einen Array mit allen Elementen zurück, die in base
			enthalten sind aber in keinem Array aus operands.
		*/
		public static difference<T = any>(
			base:T[],
			...operands:T[][]):T[]
		{
			var result:T[] = base.slice(0);
			for (var i = 0; i < result.length; ++i)
			{
				for (var j = 0; j < operands.length; ++j)
				{
					if (Util.contains(operands[j], result[i]))
					{
						result.splice(i--, 1);
						break;
					}
				}
			}
			return result;
		}



		/*
			Gibt einen Array mit Elementen zurück, die jeweils in
			allen übergebenen Arrays enthalten waren.
		*/
		public static intersect<T = any>(...arrays:T[][]):T[]
		{
			var result:T[] = Util.merge(...arrays);
			for (var i = 0; i < result.length; ++i)
			{
				for (var j = 0; j < arrays.length; ++j)
				{
					if (!Util.contains(arrays[j], result[i]))
					{
						result.splice(i--, 1);
						break;
					}
				}
			}
			return result;
		}



		/*
			Fügt mehrere Arrays zu einem einzelnen zusammen. Der
			Unterschied zu concat ist, dass jedes Element nur einmal
			vorkommt, egal in wie vielen Arrays es zuvor enthalten
			war. Die Reihenfolge der Elemente im Array sollte als
			nicht deterministisch angesehen werden.
		*/
		public static merge<T = any>(...arrays:T[][]):T[]
		{
			var result:T[] = [];
			for (var i = 0; i < arrays.length; ++i)
			{
				for (var j in arrays[i])
				{
					if (!Util.contains(result, arrays[i][j]))
						result.push(arrays[i][j]);
				}
			}
			return result;
		}



		/*
			Fügt mehrere assoziative Arrays / Objekte zu einem einzelnen
			zusammen. Die Attribute der Objekte, die später in der
			Parameterliste kommen, "überschreiben" die Attribute derer,
			die weiter links in der Liste stehen. So ergibt z.B.
			mergeAssoc({id:1, name:"Hamster"}, {value:42, name:"Backe"})
			als Ergebnis {{id:1, name:"Backe", value:42}}. Die Reihenfolge
			der Attribute im Objekt sollte als nicht deterministisch
			angesehen werden. Es wird nicht rekursiv zusammengefügt.
		*/
		public static mergeAssoc(...objects:any[]):any
		{
			var result:any = {};
			for (var i = 0; i < objects.length; ++i)
			{
				if (!objects[i])
					continue;

				for (var j in objects[i])
					result[j] = objects[i][j];
			}
			return result;
		}



		/*
			Gibt das Element von obj mit dem Namen propertyName
			zurück. Im Prinzip obj[propertyName] aber mit dem
			wichtigen Unterschied, dass Punktschreibweise
			verwendet werden kann um auf Elemente von Elementen
			zuzugreifen.
		*/
		public static getProperty(obj:any, propertyName:string):any
		{
			var parts = propertyName.split(".");
			while (parts.length > 0)
			{
				if (!obj)
					return undefined;

				obj = obj[parts.shift()];
			}
			return obj;
		}



		/*
			Gibt das Element von obj mit dem Namen propertyName
			zurück. Im Prinzip obj[propertyName] aber mit dem
			wichtigen Unterschied, dass Punktschreibweise
			verwendet werden kann um auf Elemente von Elementen
			zuzugreifen und das mit () Funktionen als Getter
			aufgerufen werden können: 'prop.getter().prop.getter()'.
			Für den leeren String wird das Ursprungsobjekt
			zurückgegeben.
		*/
		public static getPropertyAndGetter(obj:any, propertyName:string):any
		{
			if (propertyName == "")
				return obj;

			var parts = propertyName.split(".");
			while (parts.length > 0)
			{
				if (!obj)
					return undefined;

				var prop:string = parts.shift();
				if (prop.substr(prop.length - 2, 2) == '()')
					obj = obj[prop.substr(0, prop.length - 2)]();
				else
					obj = obj[prop];
			}
			return obj;
		}



		/*
			Setzt das Element von obj mit dem Namen propertyName
			auf den Wert value. Im Prinzip obj[propertyName] = value
			aber mit dem wichtigen Unterschied, dass Punktschreibweise
			verwendet werden kann um auf Elemente von Elementen
			zuzugreifen.
		*/
		public static setProperty(obj:any, name:string, value:any):void
		{
			var parts = name.split(".");
			while (parts.length > 1)
			{
				var key = parts.shift();
				if (typeof obj[key] == "undefined")
				{
					var index = parseInt(parts[0], 10);
					if (isNaN(index))
					{
						obj[key] = {};
					}
					else
					{
						obj[key] = [];
						for (var i = -1; i < index; ++i)
							obj[key].push(undefined);
					}
				}
				obj = obj[key];
			}
			obj[parts[0]] = value;
		}



		/*
			Wie getBy aber gibt nicht das gefundene Element zurück sondern
			seine Position in Array, falls gefunden. Falls nicht gefunden wird
			-1 zurück gegeben.
		*/
		public static findBy<T>(
			objects:ArrayLike<T>,
			propertyName:string,
			propertyValue:any,
			offset = 0,
			strict = false):number
		{
			if (!objects)
				return -1;

			if (strict)
			{
				for (var i = offset; i < objects.length; ++i)
				{
					if (Util.getProperty(objects[i], propertyName) === propertyValue)
						return i;
				}
			}
			else
			{
				for (var i = offset; i < objects.length; ++i)
				{
					if (Util.getProperty(objects[i], propertyName) == propertyValue)
						return i;
				}
			}
			return -1;
		}



		/*
			Durchsucht einen Array nach einem Objekt, dessen Attribut mit
			dem Namen propertyName den Wert propertyValue hat und gibt es
			zurück.
		*/
		public static getBy<T>(
			objects:ArrayLike<T>,
			propertyName:string,
			propertyValue:any,
			offset = 0,
			strict = false):T
		{
			var pos = Util.findBy(objects, propertyName, propertyValue, offset, strict);
			return pos >= 0 ? objects[pos] : undefined;
		}



		/*
			Funktioniert prinzipiell genau so wie Array.map() aber erzeugt ein
			assoziatives Objekt statt einem neuen Array.
		*/
		public static mapAssoc<OT, NT>(
			values:OT[],
			mapFunc:(value:OT, i:number) => [string, NT]):{[id:string]:NT}
		{
			var assoc:{[id:string]:NT} = {};
			for (var i = 0; i < values.length; ++i)
			{
				var [id, newValue] = mapFunc(values[i], i);
				assoc[id] = newValue;
			}
			return assoc;
		}



		/*
			Füht zwei Arrays zusammen und erzeugt ein assoziatives Array daraus.
			Die Werte aus keys ergeben die Schlüssel und die Werte aus values
			den Inhalt des assoziatives Arrays.

			keys und values müssen beide die gleiche Anzahl von Elementen enthalten.
		*/
		public static combine<T>(keys:Array<string|number>, values:T[]):{[id:string]:T}
		{
			if (keys.length != values.length)
				throw new Error("keys.length doesn't match values.length");

			var result:{[id:string]:T} = {};
			for (var i = 0; i < keys.length; ++i)
				result[keys[i]] = values[i];
			return result;
		}



		public static getAllBy<T>(
			objects:ArrayLike<T>,
			propertyName:string,
			propertyValue:any):T[]
		{
			if (!objects)
				return [];

			var results:T[] = [];
			for (var i = 0; i < objects.length; ++i)
			{
				if (Util.getProperty(objects[i], propertyName) == propertyValue)
					results.push(objects[i]);
			}
			return results;
		}



		/*
			Durchsucht einen Array nach allen Objekten, deren Attribut mit
			dem Namen propertyName den Wert propertyValue hat und löscht alle
			die gefunden werden. Alle gelöschten Objekte werden als Ergebnis
			zurückgegeben.
		*/
		public static removeBy<T>(
			objects:T[],
			propertyName:string,
			propertyValue:any):T[]
		{
			var result:T[] = [];
			if (!objects)
				return result;

			for (var i = 0; i < objects.length; ++i)
			{
				if (Util.getProperty(objects[i], propertyName) == propertyValue)
					result = result.concat(objects.splice(i--, 1));
			}
			return result;
		}



		/*
			"Sammelt" die Werte eines bestimmten Attributs aus mehreren
			Objekten und gibt sie in einem Array zurück. Z.B. kann man
			sich alle Namen aus einem Array von User-Objekten zurückgeben
			lassen mit

				var names = kr3m.util.Util.gather(users, "name");

			Die Methode unterstützt auch Punktnotation um sich Elemente
			in Elementen zurück geben zu lassen. Z.B. etwas in der Art:

				var cities = kr3m.util.Util.gather(companies, "address.city");

			Als dritter Parameter kann optional eine Funktion übergeben
			werden. Falls angegeben, werden alle Objekte dieser Funktion
			übergeben und nur solche Objekte, für welche filterFunc true
			zurück gibt, werden in das Ergebnis übernommen.

			Es ist egal ob ein normales Array oder ein assoziatives Array
			übergeben wird. Im letzteren Fall wird davon ausgegangen, dass
			alle Attribute des assoziativen Arrays Objekte sind, deren
			Attribut eingesammelt werden soll.
		*/
		public static gather(
			objects:Object[] | Object, fieldName:string,
			filterFunc?:(obj:Object) => boolean):any[]
		{
			var result:any[] = [];
			var parts = fieldName.split(".");
			if (filterFunc)
			{
				for (var i in objects)
				{
					if (filterFunc(objects[i]))
					{
						var temp = objects[i];
						for (var j = 0; j < parts.length; ++j)
							temp = temp[parts[j]];
						result.push(temp);
					}
				}
			}
			else
			{
				for (var i in objects)
				{
					var temp = objects[i];
					for (var j = 0; j < parts.length; ++j)
						temp = temp[parts[j]];
					result.push(temp);
				}
			}
			return result;
		}



		/*
			Diese Methode funktioniert genau wie gather, es wird aber außerdem
			darauf geachtet, daß jeder Wert im Ergebnis nur einmal vorkommen kann.
		*/
		public static gatherUnique(
			objects:any[], fieldName:string,
			filterFunc?:(obj:any) => boolean):any[]
		{
			return Util.removeDuplicates(Util.gather(objects, fieldName, filterFunc));
		}



		/*
			Gibt die einzigartigen (unique) Werte aus dem gegebenen
			Array zurück. Es wird der normale Vergleichsoperator ==
			dafür verwendet, um zu prüfen, ob zwei Werte gleich sind
			oder nicht. Die Reihenfolge der Elemente im Ergebnis
			basiert auf dem ersten Auftreten eines Wertes.
		*/
		public static removeDuplicates<T>(objects:ArrayLike<T>):T[]
		{
			var result:T[] = [];
			for (var i = 0; i < objects.length; ++i)
			{
				if (result.indexOf(objects[i]) < 0)
					result.push(objects[i]);
			}
			return result;
		}



		/*
			Wandelt einen Array in ein Objekt / assoziatives Array um,
			wobei die Werte aus dem Attribut indexField als Schlüssel
			verwendet werden.
		*/
		public static arrayToAssoc<T = any>(
			data:ArrayLike<T>,
			indexField = "id"):{[index:string]:T}
		{
			var result:{[index:string]:T} = {};
			for (var i = 0; i < data.length; ++i)
			{
				var key = Util.getProperty(data[i], indexField);
				result[key] = data[i];
			}
			return result;
		}



		/*
			Ähnlich wie arrayToAssoc, aber statt das gesamte Objekt
			unter dem Schlüssel indexField abzulegen werden nur die
			Werte aus valueField verwendet.
		*/
		public static arrayToPairs(
			data:any,
			indexField:string,
			valueField:string):any
		{
			var result:any = {};
			for (var i in data)
			{
				var key = Util.getProperty(data[i], indexField);
				var value = Util.getProperty(data[i], valueField);
				result[key] = value;
			}
			return result;
		}



		/*
			Wandelt einen Array in ein assoziatives Array um, bei dem
			die ursprünglichen Werte die Schlüssel bilden. Kann z.B.
			verwendet werden um schneller zu überprüfen, ob bestimmte
			Werte vorhanden sind als ständige indexOf Anfragen zu benutzen.
		*/
		public static arrayToSet(
			data:string[]|number[],
			trueValue:any = true):any
		{
			var set:any = {};
			for (var i = 0; i < data.length; ++i)
				set[data[i]] = trueValue;
			return set;
		}



		/*
			Wandelt ein Objekt / assoziatives Array in einen normalen
			Array um.
		*/
		public static assocToArray(data:any):any[]
		{
			var result:any[] = [];
			for (var i in data)
				result.push(data[i]);
			return result;
		}



		/*
			Überprüft ob value in validValues enthalten ist. Falls ja,
			wird value zurück gegeben, falls nicht, wird fallbackValue
			zurück gegeben.

			Hat nichts mit Array.filter() zu tun!
		*/
		public static filter(
			value:any,
			validValues:any[],
			fallbackValue:any = null):any
		{
			for (var i = 0; i < validValues.length; ++i)
			{
				if (validValues[i] == value)
					return value;
			}
			return fallbackValue;
		}



		/*
			Überprüft ob key ein gültiger Schlüssel in validKeys ist. Falls ja,
			wird key zurück gegeben, falls nicht, wird fallbackKey zurück gegeben.

			Hat nichts mit Array.filter() zu tun!
		*/
		public static filterKey(
			key:any,
			validKeys:any,
			fallbackKey:any = null):any
		{
			if (typeof validKeys[key] != "undefined")
				return key;
			return fallbackKey;
		}



		/*
			Eine Variante von Array.filter(), die für assoziative Arrays verwendet
			werden kann.
		*/
		public static filterAssoc(
			obj:any,
			func:(value:any, name:string) => boolean):any
		{
			var result:any = {};
			for (var name in obj)
			{
				if (func(obj[name], name))
					result[name] = obj[name];
			}
			return result;
		}



		/*
			Ruft matchFunc für jeden Wert des Arrays auf (wobei der
			Wert selbst als Parameter übergeben wird) und entfernt
			alle Werte, für die matchFunc true zurück gibt.
			Praktisch das Gegenteil von keepMatching.
		*/
//# DEPRECATED_1_4_20_15
		public static removeMatching<T>(values:T[], matchFunc:(value:T) => boolean):void
		{
			for (var i = 0; i < values.length; ++i)
			{
				if (matchFunc(values[i]))
				{
					values.splice(i, 1);
					--i;
				}
			}
		}
//# /DEPRECATED_1_4_20_15



		/*
			Ruft matchFunc für jeden Wert des Arrays auf (wobei der
			Wert selbst als Parameter übergeben wird) und entfernt
			alle Werte, für die matchFunc false zurück gibt.
			Praktisch das Gegenteil von removeMatching.
		*/
//# DEPRECATED_1_4_20_15
		public static keepMatching<T>(values:T[], matchFunc:(value:T) => boolean):void
		{
			for (var i = 0; i < values.length; ++i)
			{
				if (!matchFunc(values[i]))
				{
					values.splice(i, 1);
					--i;
				}
			}
		}
//# /DEPRECATED_1_4_20_15



		/*
			Sortiert ein Array von Objekten nach einem Attribut,
			welches in allen Objekten enthalten ist. Für den Namen
			des Attributes kann auch die Punktschreibweise verwendet
			werden, um auf Elemente von Elementen zugreifen zu können.

			Bsp.:
				kr3m.util.Util.sortBy(users, "name", true);

			Alternativ kann statt einem Attributsnamen ein assoziatives
			Array übergeben werden, das für mehrere Attribute angibt, ob
			sie aufsteigend sortiert werden sollen (true) oder (false).
			Die Reihenfolge der Namen in dem assoziativen Array ist
			ausschlaggebend.

			Bsp.:
				kr3m.util.Util.sortBy(users, {"lastName" : true, "firstName" : true, "age" : false});

			Es werden die Vergleichsoperatoren < und > verwendet um die
			einzelnen Attributswerte miteinander zu vergleichen.
		*/
		public static sortBy(values:any[], field:string, ascending:boolean):void;
		public static sortBy(values:any[], field:string):void;
		public static sortBy(values:any[], fields:{[name:string]:boolean}):void;

		public static sortBy():void
		{
			var values = <any[]> arguments[0];
			var fields:{[name:string]:boolean};
			if (typeof arguments[1] == "string")
			{
				fields = {};
				fields[arguments[1]] = arguments[2] === undefined ? true : <boolean> arguments[2];
			}
			else
			{
				fields = arguments[1];
			}

			//# DEBUG
			for (var i = 0; i < values.length; ++i)
			{
				for (var name in fields)
				{
					if (Util.getProperty(values[i], name) === undefined)
					{
						Log.logError("property", name, "in", values[i], "not found while sorting, aborting sort");
						break;
					}
				}
			}
			//# /DEBUG

			values.sort(function(a:any, b:any)
			{
				for (var name in fields)
				{
					var aValue = Util.getProperty(a, name);
					var bValue = Util.getProperty(b, name);
					if (aValue < bValue)
						return fields[name] ? -1 : 1;
					if (aValue > bValue)
						return fields[name] ? 1 : -1;
				}
				return 0;
			});
		}



		/*
			Sortiert ein assoziatives Array nach dessen Schlüsseln unter
			Verwendung von sortFunc und gibt das sortierte Objekt zurück.
			Das ursprüngliche Objekt wird dabei nicht verändert.
			Wird sortFunc nicht angegeben wird alphabetisch sortiert.
		*/
		public static sortAssocByKey(data:any, sortFunc?:(keyA:string, keyB:string) => number):any
		{
			sortFunc = sortFunc || ((keyA:string, keyB:string) => keyA.localeCompare(keyB));
			var keys = Object.keys(data);
			keys.sort(sortFunc);
			var result:any = {};
			for (var i = 0; i < keys.length; ++i)
				result[keys[i]] = data[keys[i]];
			return result;
		}



		/*
			Sortiert ein assoziatives Array nach dessen Werten unter
			Verwendung von sortFunc und gibt das sortierte Objekt zurück.
			Das ursprüngliche Objekt wird dabei nicht verändert.
			Wird sortFunc nicht angegeben wird alphabetisch sortiert.
		*/
		public static sortAssocByValue(data:any, sortFunc?:(valueA:any, valueB:any) => number):any
		{
			sortFunc = sortFunc || ((valueA:any, valueB:any) => valueA.toString().localeCompare(valueB.toString()));
			var keys = Object.keys(data);
			keys.sort((keyA:string, keyB:string) => sortFunc(data[keyA], data[keyB]));
			var result:any = {};
			for (var i = 0; i < keys.length; ++i)
				result[keys[i]] = data[keys[i]];
			return result;
		}



		/*
			Funktioniert prinzipiell wie sortBy, verändert aber nicht
			die Reihenfolge der Elemente in values. Statt dessen wird
			ein Array zurückgegeben, das die Indices der sortierten
			Elemente enthält.

			Stellt eine Alternative zu sortBy dar wenn die Reihenfolge
			der Elemente auf keinen Fall geändert werden darf / sollte.
		*/
		public static sortIndicesBy(
			values:any[],
			field:string,
			ascending = true):number[]
		{
			var one = ascending ? 1 : -1;
			var results:number[] = [];
			for (var i = 0; i < values.length; ++i)
				results.push(i);
			results.sort(function(a:number, b:number)
			{
				var aValue = Util.getProperty(values[a], field);
				var bValue = Util.getProperty(values[b], field);
				return (aValue > bValue) ? one : (aValue < bValue) ? -one : 0;
			});
			return results;
		}



		/*
			Sortiert die Werte values in Buckets (Eimer) in Abhängigkeit
			eines ihrer Attribute. Die Buckets werden in einem assoziativen
			Array zurück gegeben. Für jeden eindeutigen Wert field, der in
			values vorkommt gibt es einen Bucket im Ergebnis.
		*/
		public static bucketBy<T>(
			values:ArrayLike<T>,
			field:string):{[id:string]:T[]}
		{
			var buckets:{[id:string]:T[]} = {};
			for (var i = 0; i < values.length; ++i)
			{
				var key = Util.getProperty(values[i], field);
				if (!buckets[key])
					buckets[key] = [];

				buckets[key].push(values[i]);
			}
			return buckets;
		}



		/*
			Das gleiche wie bucketBy, wird aber für alle fields rekursiv
			aufgerufen.

			Damit sind z.B. Aufrufe folgender Art möglich:

				var usersAssoc = Util.bucketByRecursive(users, "lastName", "firstName");
				log(usersAssoc["Wurst"]["Hans"]);
		*/
		public static bucketByRecursive<T>(
			values:ArrayLike<T>,
			...fields:string[]):{[id:string]:any}
		{
			if (fields.length == 0)
				return undefined;

			var field = fields.shift();
			var buckets = <{[id:string]:any}> Util.bucketBy(values, field);
			if (fields.length > 0)
			{
				for (var id in buckets)
					buckets[id] = Util.bucketByRecursive(buckets[id], ...fields);
			}
			return buckets;
		}



		/*
			Variante von bucketBy welche ein assoziatives Array statt einem
			gewöhnlichen Array erwartet (und langsamer ist).
		*/
		public static bucketAssocBy(values:any, field:string):any
		{
			var buckets:any = {};
			for (var i in values)
			{
				var key = Util.getProperty(values[i], field);
				if (!buckets[key])
					buckets[key] = [];

				buckets[key].push(values[i]);
			}
			return buckets;
		}



		/*
			Führt func rekursiv für alle Werte von obj und dessen
			Unterelemente aus. Es wird nicht für Unterobjekte selbst
			ausgeführt, sondern nur für deren Attribute. Z.B. würde
			es für data.user.name ausgeführt werden, aber nicht für
			data.user, da user ein Objekte mit Unterelementen ist.

			Die Reihenfolge ist nicht deterministisch und kann sich
			in der Zukunft ändern, sie sollte nicht als fest angesehen
			werden.
		*/
		public static forEachRecursive(obj:any, func:(key:string, value?:any, obj?:any) => void):void
		{
			if (!obj || typeof obj != "object")
				return;

			var workset:string[] = Object.keys(obj);
			while (workset.length > 0)
			{
				var key = workset.pop();
				var value = Util.getProperty(obj, key);
				var type = value ? typeof value : "null";
				switch (type)
				{
					case "object":
						var subKeys = Object.keys(value);
						for (var i = 0; i < subKeys.length; ++i)
							workset.push(key + "." + subKeys[i]);
						break;

					default:
						func(key, value, obj);
						break;
				}
			}
		}



		/*
			Recursive variant of mergeAssoc
		*/
		public static mergeAssocRecursive(...objects:any[]):any
		{
			var result:any = {};
			for (var i = 0; i < objects.length; ++i)
				Util.forEachRecursive(objects[i], (key, value) => Util.setProperty(result, key, value));
			return result;
		}



		/*
			Gibt das erste Element eines Arrays zurück, welches von
			cls abgeleitet wurde. Dabei werden die ersten offset
			Elemente des Arrays nicht überprüft. Von den tatsächlich
			überprüften und passenden Elementen werden die ersten
			skip verworfen.
		*/
		public static getFirstInstanceOf<T>(
			values:any[] | IArguments,
			cls:{new(...args:any[]):T},
			offset = 0,
			skip = 0):T
		{
			for (var i = offset; i < values.length; ++i)
			{
				if (values[i] instanceof cls)
				{
					if (skip <= 0)
						return values[i];
					--skip;
				}
			}
			return undefined;
		}



		/*
			Gibt das erste Element eines Arrays zurück, welches mit
			typeof den gewünschten Typ type ergeben würde. Dabei
			werden die ersten offset Elemente des Arrays nicht
			überprüft. Von den tatsächlich überprüften und passenden
			Elementen werden die ersten skip verworfen.
		*/
		public static getFirstOfType(
			values:any[] | IArguments,
			type:string,
			offset = 0,
			skip = 0):any
		{
			for (var i = offset; i < values.length; ++i)
			{
				if (typeof values[i] == type)
				{
					if (skip <= 0)
						return values[i];
					--skip;
				}
			}
			return undefined;
		}



		/*
			Gibt alle Elemente eines Arrays zurück, welche von
			cls abgeleitet wurden.
		*/
		public static getAllInstancesOf<B, C extends B>(
			values:B[]|IArguments,
			cls:{new(...args:any[]):C},
			offset = 0):C[]
		{
			var result:C[] = [];
			for (var i = offset; i < values.length; ++i)
			{
				if (values[i] instanceof cls)
					result.push(values[i]);
			}
			return result;
		}



		/*
			Gibt alle Elemente eines Arrays zurück, welche mit
			typeof den gewünschten Typ type ergeben würden.
		*/
		public static getAllOfType(
			values:any[] | IArguments,
			type:string,
			offset = 0):any[]
		{
			var result:any[] = [];
			for (var i = offset; i < values.length; ++i)
			{
				if (typeof values[i] == type)
					result.push(values[i]);
			}
			return result;
		}



		/*
			Ordnet die Elemente in values in einer anderen Reihenfolge
			abhängig von newOffsets. newOffsets enthält dabei für jedes
			Element die Position in values. Ist values länger als newOffsets
			werden alle Elemente, die über newOffsets Länge hinaus gehen
			einfach übernommen.

			Beispiel:
				Vertausche das erste und das vierte Element eines Arrays:
				Util.rearrange(["Alice", "Bob", "Charly", "David", "Eric"], [3, 1, 2, 0]);
		*/
		public static rearrange<T = any>(values:T[], newOffsets:number[]):T[]
		{
			var result:T[] = [];
			for (var i = 0; i < newOffsets.length; ++i)
				result.push(values[newOffsets[i]]);
			result = result.concat(values.slice(newOffsets.length));
			return result;
		}



		/*
			Erstellt ein Array mit count Objekten, die von func erzeugt
			werden. func erhält immer die aktuelle Position im Array als
			Parameter und muss das entsprechende Element zurück geben.
			Alternativ kann einfach ein Wert angegeben, der dann für alle
			Arraypositionen gesetzt wird.

			Beispiele:
				var evenNumbers = kr3m.util.Util.fill(10, (i:number) => (i + 1) * 2);
				var offsets = kr3m.util.Util.fill(evenNumbers.length, (i:number) => i);
				var lotOfZeroes = kr3m.util.Util.fill(1000, 0);
		*/
		public static fill<T = any>(count:number, func:(i:number) => T):T[]
		public static fill<T = any>(count:number, value:T):T[]

		public static fill<T = any>():T[]
		{
			var result:T[] = [];
			if (typeof arguments[1] == "function")
			{
				for (var i = 0; i < arguments[0]; ++i)
					result.push(arguments[1](i));
			}
			else
			{
				for (var i = 0; i < arguments[0]; ++i)
					result.push(arguments[1]);
			}
			return result;
		}
	}
}



/*
	Bequemlichkeitsfunktion um nicht immer kr3m.util.Util.getFirstOfType schreiben zu müssen.
*/
//# !HIDE_GLOBAL
function firstOfType(
	values:any[] | IArguments,
	type:string,
	offset = 0,
	skip = 0):any
{
	return kr3m.util.Util.getFirstOfType(values, type, offset, skip);
}
//# /!HIDE_GLOBAL



//# UNITTESTS
setTimeout(() =>
{
	var now = new Date();
	var U = kr3m.util.Util;
	var CS = kr3m.unittests.CaseSync;
	new kr3m.unittests.Suite("kr3m.util.Util")

	.add(new CS("equal I", () => U.equal(true, true), true))
	.add(new CS("equal II", () => U.equal(true, false), false))
	.add(new CS("equal III", () => U.equal(false, true), false))
	.add(new CS("equal IV", () => U.equal(false, false), true))
	.add(new CS("equal V", () => U.equal({}, {}), true))
	.add(new CS("equal VI", () => U.equal("3", 3), false))
	.add(new CS("equal VII", () => U.equal("3", "3"), true))
	.add(new CS("equal VIII", () => U.equal({name:"Hans", values:[1,2,3]}, {values:[1,2,3], name:"Hans"}), true))
	.add(new CS("equal IX", () => U.equal({name:"Hans", values:[1,2,3]}, {values:[1,2], name:"Hans"}), false))
	.add(new CS("equal X", () => U.equal({name:"Hans", sub:{values:[1,2,3]}}, {sub:{values:[1,2,3]}, name:"Hans"}), true))
	.add(new CS("equal XI", () => U.equal(null, null), true))
	.add(new CS("equal XII", () => U.equal(null, 43), false))
	.add(new CS("equal XIII", () => U.equal([], []), true))
	.add(new CS("equal XIV", () => U.equal([0], []), false))
	.add(new CS("equal XV", () => U.equal([], [0]), false))
	.add(new CS("equal XVI", () => U.equal([0], [0]), true))

	.add(new CS("fill I", () => U.fill(0, (i:number) => i), []))
	.add(new CS("fill II", () => U.fill(5, (i:number) => i), [0, 1, 2, 3, 4]))
	.add(new CS("fill III", () => U.fill(5, (i:number) => i * i), [0, 1, 4, 9, 16]))

	.add(new CS("clone I", () => U.clone({firstName:"Hans", lastName:"Wurst"}), {firstName:"Hans", lastName:"Wurst"}))
	.add(new CS("clone II", () => U.clone({firstName:"Hans", ids:[1,2,3,4,5,6], lastName:"Wurst"}), {firstName:"Hans", lastName:"Wurst", ids:[1,2,3,4,5,6]}))
	.add(new CS("clone III", () => U.clone("Hamster"), "Hamster"))
	.add(new CS("clone IV", () => U.clone(false), false))
	.add(new CS("clone V", () => U.clone(42), 42))
	.add(new CS("clone VI", () => U.clone(now), now))

	.add(new CS("getProperty I", () => U.getProperty({}, "name"), undefined))
	.add(new CS("getProperty II", () => U.getProperty({name:"Hans"}, "name"), "Hans"))
	.add(new CS("getProperty III", () => U.getProperty({name:"Hans",pet:{name:"Guggi"}}, "name"), "Hans"))
	.add(new CS("getProperty IV", () => U.getProperty({name:"Hans",pet:{name:"Guggi"}}, "pet.name"), "Guggi"))

	.add(new CS("arrayToPairs I", () => U.arrayToPairs([], "first", "last"), {}))
	.add(new CS("arrayToPairs II", () => U.arrayToPairs([{first:"Hans", last:"Wurst"}, {first:"Monster", last:"Backe"}], "first", "last"), {Hans:"Wurst", Monster:"Backe"}))
	.add(new CS("arrayToPairs III", () => U.arrayToPairs([{owner:{first:"Hans", last:"Wurst"}}, {owner:{first:"Monster", last:"Backe"}}], "owner.first", "owner.last"), {Hans:"Wurst", Monster:"Backe"}))

	.add(new CS("sortBy I", () =>
	{
		var data = [{x:0, y:1}, {x:1, y:0}, {x:0, y:0}, {x:1, y:1}];
		U.sortBy(data, {x:true, y:true});
		return data;
	}, [{x:0, y:0}, {x:0, y:1}, {x:1, y:0}, {x:1, y:1}]))
	.add(new CS("sortBy II", () =>
	{
		var data = [{x:0, y:1}, {x:1, y:0}, {x:0, y:0}, {x:1, y:1}];
		U.sortBy(data, {x:true, y:false});
		return data;
	}, [{x:0, y:1}, {x:0, y:0}, {x:1, y:1}, {x:1, y:0}]))
	.add(new CS("sortBy III", () =>
	{
		var data = [{x:0, y:1}, {x:1, y:0}, {x:0, y:0}, {x:1, y:1}];
		U.sortBy(data, {x:false, y:true});
		return data;
	}, [{x:1, y:0}, {x:1, y:1}, {x:0, y:0}, {x:0, y:1}]))
	.add(new CS("sortBy IV", () =>
	{
		var data = [{x:0, y:1}, {x:1, y:0}, {x:0, y:0}, {x:1, y:1}];
		U.sortBy(data, {x:false, y:false});
		return data;
	}, [{x:1, y:1}, {x:1, y:0}, {x:0, y:1}, {x:0, y:0}]))

	.run();
}, 1);
//# /UNITTESTS
