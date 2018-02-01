module kr3m.payment.expercash
{
	export class PopupParameters
	{
		public popupId:string; // Zugangskennung der Anwendung
		public amount:number; // Preis in Cent
		public paymentMethod:string; // welche Zahlungsmethode: Kreditkarte, Sofortüberweisung, usw...
		public returnUrl:string; // Rücksprungadresse im Erfolgsfall
		public errorUrl:string; // Rücksprungadresse falls der User den Zahlungsvorgang abbricht
		public notifyUrl:string; // Rücksprungadresse für Hintergrundbenachrichtigungen - wird parallel zur returnUrl aufgerufen, aber vom ExperCash-Server statt vom User-Browser
		public updateUrl:string; // Rücksprungadresse für Hintergrund-Updates (wo benötigt) - wird für Zahlarten verwendet, deren Status sich nach dem Zahlvorgang noch ändern kann (bisher nur Barzahlung)
		public cssUrl:string; // URL wo CSS für den Inhalt des Frames hinterlegt ist - muss HTTPS verwenden
		public profile:number;
		public currency:string = "EUR"; // dreistelliger Währungscode
		public jobId:string;
		public transactionId:string; // beliebige Transaktions-ID / Rechnungsnummer, wird bei Notifications mitgesendet
		public language:string = "de"; // zweistelliger Sprachencode
		public popupKey:string; // berechneter Sicherheitsschlüssel aus den einzelnen Parametern - nicht selbst setzen, berechnen lassen

		public pollUrl:string; // URL über die abgefragt wird, ob eine Zahlung bezahlt wurde oder nicht - ist nicht von Expercash sondern von kr3m
	}
}
