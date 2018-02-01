/// <reference path="../tracking2/trackingoptions.ts"/>
/// <reference path="../util/util.ts"/>

declare var trackCustom:(options:kr3m.tracking2.TrackingOptions) => void;



module kr3m.tracking2
{
	/*
		Das neue Tracking, das in allen zukünftigen Anwendungen von
		kr3m verwendet werden sollte. Über das statische Attribut
		defaultTrackOptions können werte eingestellt werden, die bei
		allen Aufrufen gleich sein sollen (z.B. applicationName).
		Anschließend wird einfach nur die methode track aufgerufen,
		welche selbst auch nur eine externe Methode namens trackCustom
		aufruft. Diese ist einer eigenen Javascript-Datei gespeichert
		und kann für Kundenanpassungen leicht geändert werden.
	*/
	export class Track
	{
		public static defaultTrackOptions = new kr3m.tracking2.TrackingOptions();



		public static track(
			pointUrl:string,
			trackIvw:boolean = true,
			initiatiedByUser:boolean = true):void
		{
			if (typeof trackCustom != "undefined")
			{
				var options = kr3m.util.Util.clone(kr3m.tracking2.Track.defaultTrackOptions);
				options.trackingPointUrl = pointUrl;
				options.trackIvw = trackIvw;
				options.initiatiedByUser = initiatiedByUser;
				options.gaEvent.label = pointUrl;
				trackCustom(options);
			}
		}
	}
}



//# !HIDE_GLOBAL
/*
	Bequemlichkeitsfunktion, um nicht immer
	kr3m.tracking2.Track.track schreiben zu müssen.
*/
function track(
	pointUrl:string,
	trackIvw:boolean = true,
	initiatiedByUser:boolean = true):void
{
	kr3m.tracking2.Track.track(pointUrl, trackIvw, initiatiedByUser);
}
//# /!HIDE_GLOBAL
