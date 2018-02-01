/// <reference path="../async/delayed.ts"/>
/// <reference path="../util/csvhelper.ts"/>
/// <reference path="../util/stringex.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.services
{
	/*
		Klasse zum ermitteln des Landes, aus dem eine
		Anfrage kommt, anhand der verwendeten IP des
		Absenders. Es wird eine CSV-Datei mit entsprechenden
		Länderdaten benötigt, wie man sie sich hier
		runterladen kann:

			http://download.ip2location.com/lite/

		Die CSV-Datei muss mindestens drei Spalten haben.
		In den ersten beiden stehen die IP-Bereiche von und
		bis, in der dritten Spalte muss das Länderkürzel
		stehen. Die IPs können als IP-Adresse oder als
		32 unsigned integers angegeben werden.

		Die erste Zeile wird als der erste Datensatz
		interpretiert, d.h. es dürfen keine
		Spaltenüberschriften verwendet werden.

		Die Grenzwerte der IP-Bereiche werden in 32 Bit
		Integer umgewandelt und anschließend die Bereiche
		sortiert abgespeichert. Der Lookup verwendet
		anschließend ein Intervallhalbierungsverfahren um
		den gewünschten IP-Bereich zu finden.
	*/
	export class GeoIP
	{
		private data:any[] = [];
		private delayed = new kr3m.async.Delayed();



		constructor(dataFilePath:string)
		{
			kr3m.util.CsvHelper.loadFromFile(dataFilePath, (data:string[][]) =>
			{
				for (var i = 0; i < data.length; ++i)
				{
					if (data[i].length > 1)
						this.data.push({from:this.ip2number(data[i][0]), to:this.ip2number(data[i][1]), id:data[i][2]});
				}
				kr3m.util.Util.sortBy(this.data, "from");
				this.delayed.execute();
			}, false);
		}



		private ip2number(ip:string):number
		{
			var matches = ip.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
			if (!matches)
				return kr3m.util.StringEx.parseIntSafe(ip, -1);

			var value = 0;
			value += kr3m.util.StringEx.parseIntSafe(matches[1]) * 0x1000000;
			value += kr3m.util.StringEx.parseIntSafe(matches[2]) * 0x10000;
			value += kr3m.util.StringEx.parseIntSafe(matches[3]) * 0x100;
			value += kr3m.util.StringEx.parseIntSafe(matches[4]);
			return value;
		}



		public getCountryIdSync(ip:string):string
		{
			var value = this.ip2number(ip);
			var min = 0;
			var max = this.data.length;
			while (min < max)
			{
				var i = Math.floor((max + min) / 2);
				var item = this.data[i];
				if (item.from > value)
					max = i;
				else if (item.to >= value)
					return item.id;
				else
					min = i + 1;
			}
			return null;
		}



		public getCountryId(ip:string, callback:(countryId:string) => void):void
		{
			this.delayed.call(() =>
			{
				callback(this.getCountryIdSync(ip));
			});
		}
	}
}
