/// <reference path="../../net2/context.ts"/>
/// <reference path="../../net2/session.ts"/>
/// <reference path="../../types.ts"/>



module kr3m.net2.sessionmanagers
{
	export abstract class Abstract
	{
		/*
			Ermittelt anhand des Context welche Session gebraucht
			wird und gibt diese zurück. Das kann z.B. über gesetzt
			Cookies passieren, aber alle anderen Methoden sind auch
			denkbar.
		*/
		public abstract get(
			context:Context,
			callback:CB<Session>):void



		/*
			Persistiert die Änderungen an der Session und gibt sie
			"frei", d.h. es kann im aktuellen Context nicht mehr auf
			die Session zugegriffen werden. Diese Methode hat nichts
			mit dem Löschen oder Zerstören von Sessions zu tun.
		*/
		public abstract release(
			context:Context,
			session:Session,
			callback:Callback):void;



		/*
			Erzeugt eine neue ID in der Session damit die alte
			SessionID nicht mehr benutzt werden kann (soll Session-
			Hijacking verhinden). Sollte nach allen Aktionen ausgeführt
			werden, welche die Rechte des aktuellen Users verändern
			und in der Session speichern (also nach Login, Registrierung,
			Logout usw.).
		*/
		public abstract regenerate(
			context:Context,
			session:Session,
			callback:Callback):void;



		/*
			Zerstört die Session inklusive aller darin enthaltenen
			Daten. Wird in zukünftigen Aufrufen auf die Session
			zugegriffen wird eine neue erzeugt.
		*/
		public abstract destroy(
			context:Context,
			session:Session,
			callback:Callback):void;
	}
}
