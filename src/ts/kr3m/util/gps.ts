module kr3m.util
{
	export class Gps
	{
		public static isAvailable():boolean
		{
			return navigator.geolocation != undefined;
		}



		public static getPosition(callback:(position:Position) => void):void
		{
			if (!Gps.isAvailable())
				return callback(null);

			navigator.geolocation.getCurrentPosition(callback, (error:PositionError) =>
			{
				callback(null);
			});
		}



		public static watchPosition(callback:(position:Position) => void):number
		{
			if (!Gps.isAvailable())
				return 0;

			return navigator.geolocation.watchPosition(callback, (error:PositionError) =>
			{
				callback(null);
			});
		}



		public static clearWatch(watchId:number):void
		{
			if (!Gps.isAvailable())
				return;

			navigator.geolocation.clearWatch(watchId);
		}
	}
}
