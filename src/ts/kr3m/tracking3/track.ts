declare var trackGTMCustom:(trackObj:any) => void;



module kr3m.tracking3
{
	/*
		Trackklasse ab 06.05.2015 welche einfach nur das
		übergebene Objekt um Standardwerte erweitert und
		an die trackGTMCustom Funktion aus der track.js
		Datei übergibt.
	*/
	export class Track
	{
		public static track(trackPoint:string):void;
		public static track(trackObj:any):void;

		public static track():void
		{
			if (typeof trackGTMCustom != "function")
				return;

			var trackObj:any = typeof arguments[0] == "string" ? {eventAction : arguments[0]} : (arguments[0] || {});

			trackObj.event = trackObj.event || "kr3m";
			trackObj.hitType = trackObj.hitType || "Button";
			trackObj.eventCategory = trackObj.eventCategory || "Click";
			// trackObj.eventAction
			// trackObj.eventLabel
			// trackObj.eventValue
			// trackObj.eventLocation
			trackGTMCustom(trackObj);
		}
	}
}



//# !HIDE_GLOBAL
/*
	Bequemlichkeitsfunktion, um nicht immer
	kr3m.tracking3.Track.track schreiben zu müssen.
*/
function track(trackPoint:string):void;
function track(trackObj:any):void;

function track():void
{
	kr3m.tracking3.Track.track(arguments[0]);
}
//# /!HIDE_GLOBAL
