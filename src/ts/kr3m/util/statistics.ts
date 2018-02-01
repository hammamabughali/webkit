/// <reference path="../util/util.ts"/>



//# DEPRECATED: kr3m.util.Statistics is deprecated, please use the native methods Array.filter and Array.reduce instead
module kr3m.util
{
	/*
		Die Statistics-Klassse stellt verschiedene Funktionen zur Verfügung, um
		einfache Berechnungen auf Arrays von Objekten durchführen zu können.
		So können z.B. Durchschnitt, Summe oder ähnliche statistisch relevante
		Daten über den Inhalt eines Arrays gebildet werden.

		Um irrelevante Daten aus den Berechnungen auszunehmen, können
		Filterfunktionen verwendet werden. Diese sind von der gleichen Art wie
		solche, die für Array.filter() verwendet werden können. Übergibt man sie
		aber den Funktionen hier, wird nicht extra ein gefiltertes Array erstellt.
	*/
	export class Statistics
	{
		/*
			Erzeugt eine Filterfunktion, die nur Objekte zuläßt,
			bei denen ein gewünschtes Attribut zwischen einem
			Minimum (inklusive) und einem Maximum (inklusive)
			liegt. Die Filterfunktion kann anschließend für die
			mathematischen Funktionen der Statistics-Klasse
			verwendet werden.
		*/
		public static rangeFilter<T>(
			fieldName:string,
			from:any,
			to:any):(item:T) => boolean
		{
			var func = function(fieldName:string, from:any, to:any, item:T)
			{
				var fieldValue = Util.getProperty(item, fieldName);
				return (fieldValue >= from) && (fieldValue <= to);
			};
			return func.bind(null, fieldName, from, to);
		}



		/*
			Erzeugt eine Filterfunktion, die nur Objekte zuläßt,
			bei denen ein gewünschtes Attribut gleich einem gegebenen
			Wert ist. Die Filterfunktion kann anschließend für die
			mathematischen Funktionen der Statistics-Klasse
			verwendet werden.
		*/
		public static isFilter<T>(
			fieldName:string,
			value:any):(item:T) => boolean
		{
			var func = function(fieldName:string, value:any, item:T)
			{
				var fieldValue = Util.getProperty(item, fieldName);
				return (fieldValue == value);
			};
			return func.bind(null, fieldName, value);
		}



		/*
			Erzeugt eine Filterfunktion, die nur Objekte zuläßt,
			bei denen ein gewünschtes Attribut kleiner als ein gegebener
			Wert ist. Die Filterfunktion kann anschließend für die
			mathematischen Funktionen der Statistics-Klasse
			verwendet werden.
		*/
		public static lesserThanFilter<T>(
			fieldName:string,
			value:any):(item:T) => boolean
		{
			var func = function(fieldName:string, value:any, item:T)
			{
				var fieldValue = Util.getProperty(item, fieldName);
				return (fieldValue < value);
			};
			return func.bind(null, fieldName, value);
		}



		/*
			Erzeugt eine Filterfunktion, die nur Objekte zuläßt,
			bei denen ein gewünschtes Attribut größer als ein gegebener
			Wert ist. Die Filterfunktion kann anschließend für die
			mathematischen Funktionen der Statistics-Klasse
			verwendet werden.
		*/
		public static greaterThanFilter<T>(
			fieldName:string,
			value:any):(item:any) => boolean
		{
			var func = function(fieldName:string, value:any, item:T)
			{
				var fieldValue = Util.getProperty(item, fieldName);
				return (fieldValue > value);
			};
			return func.bind(null, fieldName, value);
		}



		public static andFilter<T>(
			func1:(item:T) => boolean, func2:(item:T) => boolean):(item:T) => boolean
		{
			var func = function(func1:(item:T) => boolean, func2:(item:T) => boolean, item:T)
			{
				return func1(item) && func2(item);
			};
			return func.bind(null, func1, func2);
		}



		public static orFilter<T>(
			func1:(item:T) => boolean, func2:(item:T) => boolean):(item:T) => boolean
		{
			var func = function(func1:(item:T) => boolean, func2:(item:T) => boolean, item:T)
			{
				return func1(item) || func2(item);
			};
			return func.bind(null, func1, func2);
		}



		public static getByHighestField<T>(
			data:T[], fieldName:string):T
		{
			if (data.length == 0)
				return undefined;

			var max = Util.getProperty(data[0], fieldName);
			var maxPos = 0;
			for (var i = 1; i < data.length; ++i)
			{
				var temp = Util.getProperty(data[i], fieldName);
				if (temp > max)
				{
					max = temp;
					maxPos = i;
				}
			}
			return data[maxPos];
		}



		public static getFieldMax<T>(
			data:T[], fieldName:string,
			filter?:(item:T) => boolean):any
		{
			var max:any;
			if (filter)
			{
				for (var i = 0; i < data.length; ++i)
				{
					if (filter(data[i]))
					{
						var value = Util.getProperty(data[i], fieldName);
						if (max === undefined || value > max)
							max = value;
					}
				}
			}
			else
			{
				for (var i = 0; i < data.length; ++i)
				{
					var value = Util.getProperty(data[i], fieldName);
					if (max === undefined || value > max)
						max = value;
				}
			}
			return max;
		}



		public static getFieldMin<T>(
			data:T[], fieldName:string,
			filter?:(item:T) => boolean):any
		{
			var min:any;
			if (filter)
			{
				for (var i = 0; i < data.length; ++i)
				{
					if (filter(data[i]))
					{
						var value = Util.getProperty(data[i], fieldName);
						if (min === undefined || value < min)
							min = value;
					}
				}
			}
			else
			{
				for (var i = 0; i < data.length; ++i)
				{
					var value = Util.getProperty(data[i], fieldName);
					if (min === undefined || value < min)
						min = value;
				}
			}
			return min;
		}



		/*
			Gibt die Summe der Werte aus data zurück.
		*/
		public static getSum(data:number[]):number
		{
			if (data.length < 1)
				return 0;

			var total = 0;
			for (var i = 0; i < data.length; ++i)
				total += data[i];

			return total;
		}



		/*
			Addiert alle Werte eines gleichnamigen Feldes der
			Objekte in einem Array. Z.B. für Fragen wie "wie viel
			Geld haben alle Kunden zusammen ausgegeben?"
			@param data Ein Array mit Datenobjekten, z.B. das
			Ergebnis aus einer Datenbankabfrage.
			@param fieldName Der Name des Feldes / Attributes,
			dessen Summe gebildet werden soll.
			@filter Eine optionale Funktion, die ungültige
			Objekte ausfiltert. Die Funktion bekommt ein einzelnes
			Objekt aus dem Array als Parameter und muß true
			zurück geben, wenn das Objekt verwendet werden soll
			und false wenn es verworfen werden soll.
		*/
		public static getFieldSum<T>(
			data:T[], fieldName:string,
			filter?:(item:T) => boolean):number
		{
			var total = 0;
			if (filter)
			{
				for (var i = 0; i < data.length; ++i)
				{
					if (filter(data[i]))
						total += Util.getProperty(data[i], fieldName);
				}
			}
			else
			{
				for (var i = 0; i < data.length; ++i)
					total += Util.getProperty(data[i], fieldName);
			}
			return total;
		}



		/*
			Gibt den Durchschnitt der Werte aus data zurück.
		*/
		public static getAverage(data:number[]):number
		{
			if (data.length < 1)
				return 0;

			var total = 0;
			for (var i = 0; i < data.length; ++i)
				total += data[i];

			return total / data.length;
		}



		/*
			Berechnet den Durchschnitt über alle Werte eines
			gleichnamigen Feldes der Objekte in einem Array.
			Z.B. für Fragen wie "wie viel Geld haben die Kunden
			im Schnitt ausgegeben?"
			@param data Ein Array mit Datenobjekten, z.B. das
			Ergebnis aus einer Datenbankabfrage.
			@param fieldName Der Name des Feldes / Attributes,
			dessen Durchschnitt gebildet werden soll.
			@filter Eine optionale Funktion, die ungültige
			Objekte ausfiltert. Die Funktion bekommt ein einzelnes
			Objekt aus dem Array als Parameter und muß true
			zurück geben, wenn das Objekt verwendet werden soll
			und false wenn es verworfen werden soll.
		*/
		public static getFieldAverage<T>(
			data:T[], fieldName:string,
			filter?:(item:T) => boolean):number
		{
			if (data.length == 0)
				return 0;

			var average = 0;
			var count = data.length;
			if (filter)
			{
				for (var i = 0; i < data.length; ++i)
				{
					if (filter(data[i]))
					{
						average += Util.getProperty(data[i], fieldName);
						++count;
					}
				}
			}
			else
			{
				for (var i = 0; i < data.length; ++i)
					average += Util.getProperty(data[i], fieldName);
			}
			return average / count;
		}



		/*
			Zählt bei wie vielen der Elemente aus data der Wert des
			Attributes fieldName gleich value ist.
		*/
		public static getFieldCount<T>(
			data:T[], fieldName:string, value:any,
			filter?:(item:T) => boolean):number
		{
			if (data.length == 0)
				return 0;

			var count = 0;
			if (filter)
			{
				for (var i = 0; i < data.length; ++i)
				{
					if (filter(data[i]))
					{
						if (value == Util.getProperty(data[i], fieldName))
							++count;
					}
				}
			}
			else
			{
				for (var i = 0; i < data.length; ++i)
				{
					if (value == Util.getProperty(data[i], fieldName))
						++count;
				}
			}
			return count;
		}



		/*
			Berechnet den gewichteten Durchschnitt über alle Werte
			eines gleichnamigen Feldes der Objekte in einem Array.
			Ein zweites Feld wird dabei als Gewichtung verwendet.
			@param data Ein Array mit Datenobjekten, z.B. das
			Ergebnis aus einer Datenbankabfrage.
			@param valueFieldName Der Name des Feldes / Attributes,
			dessen Durchschnitt gebildet werden soll.
			@param weightFieldName Der Name des Feldes / Attributes,
			das als Gewichtung verwendet werden soll.
			@filter Eine optionale Funktion, die ungültige
			Objekte ausfiltert. Die Funktion bekommt ein einzelnes
			Objekt aus dem Array als Parameter und muß true
			zurück geben, wenn das Objekt verwendet werden soll
			und false wenn es verworfen werden soll.
		*/
		public static getFieldWeightedAverage<T>(
			data:T[], valueFieldName:string, weightFieldName:string,
			filter?:(item:T) => boolean):number
		{
			if (data.length == 0)
				return 0;

			var average = 0;
			var weight = 0;
			if (filter)
			{
				for (var i = 0; i < data.length; ++i)
				{
					if (filter(data[i]))
					{
						var fieldValue = Util.getProperty(data[i], valueFieldName);
						var weightValue = Util.getProperty(data[i], weightFieldName);
						average += fieldValue * weightValue;
						weight += weightValue;
					}
				}
			}
			else
			{
				for (var i = 0; i < data.length; ++i)
				{
					var fieldValue = Util.getProperty(data[i], valueFieldName);
					var weightValue = Util.getProperty(data[i], weightFieldName);
					average += fieldValue * weightValue;
					weight += weightValue;
				}
			}
			return (weight != 0) ? (average / weight) : 0;
		}
	}
}
