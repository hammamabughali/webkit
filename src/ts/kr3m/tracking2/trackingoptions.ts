module kr3m.tracking2
{
	// Google Analytics Event Options
	export class GAEventOptions
	{
		// benötigt
		public category:string = "button";
		public action:string = "click";

		// optional
		public label:string;
		public value:number;
		public noninteraction:boolean;
	}



	export class TrackingOptions
	{
		public trackIvw:boolean = true; // Soll ein Aufruf an die IVW stattfinden?
		public initiatiedByUser:boolean = true; // Wurde der Trackingpunkt erreicht weil der User eine Aktion ausgeführt hat?
		public applicationName:string = null; // Der Name / die ID der Anwendung, um sie auseinanderhalten zu können.
		public trackingPointUrl:string = null; // Der Name des Trackingpunktes, der erreicht wurde.
		public gaEvent = new kr3m.tracking2.GAEventOptions();
	}
}
