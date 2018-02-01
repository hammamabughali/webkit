/// <reference path="../lib/node.ts"/>
/// <reference path="../util/json.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.google.geocoding
{
	export function getReverse(
		latitude:number, longitude:number, type:string,
		callback:(result:any) => void):void
	{
		var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&sensor=true&langugage=en";
		httpLib.get(url, (response:any) =>
		{
			var text:string = "";
			response.setEncoding("utf8");
			response.on("data", (data:any) =>
			{
				text += data.toString();
			});
			response.on("end", () =>
			{
				try
				{
					var result = kr3m.util.Json.decode(text);
					if (type == "")
						return callback(result);

					for (var i = 0; i < result.results.length; ++i)
					{
						var index = kr3m.util.Util.indexOf(type, result.results[i].types);
						if (index >= 0)
							return callback(result.results[i].address_components[index]);
					}
					callback(null);
				}
				catch(e)
				{
					callback(null);
				}
			});
		}).on("error", (e:any) =>
		{
			callback(null);
		});
	}



	export function getCountry(
		latitude:number, longitude:number,
		callback:(countryId:string) => void):void
	{
		kr3m.google.geocoding.getReverse(latitude, longitude, "country", (result:any) =>
		{
			if (!result)
				return callback(null);

			callback(result.short_name);
		});
	}
}
