module kr3m.phonegap.pnsenders
{
	export class PNSender
	{
		public notificationTTL:number = 3600; // Lebensdauer der Notifications in Sekunden



		public send(
			regIds:string[],
			title:string, message:string,
			callback:(success:boolean) => void = null):void
		{
			// wird in abgeleiteten Klassen überschrieben
		}
	}
}
