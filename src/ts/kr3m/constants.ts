/// <reference path="types.ts"/>
/// <reference path="version.ts"/>
//# CLIENT
//# !WORKER
/// <reference path="legacy.ts"/>
//# /!WORKER
//# /CLIENT



module kr3m
{
	export const ANDROID = "ANDROID";
	export const IOS = "IOS";

	export const MAX_TAB_INDEX = 0x7fff;

//# MOBILE
	export const MOBILE_MIN_VERSIONS =
	{
		ANDROID : "4.0.0.0",
		IOS : "6.0.0.0"
	};
//# /MOBILE

	export const PASSWORD_SECURITY_NONE = 0;
	export const PASSWORD_SECURITY_LOW = 1;
	export const PASSWORD_SECURITY_MEDIUM = 2;
	export const PASSWORD_SECURITY_HIGH = 3;

	export const FORMAT_TIME = "FORMAT_TIME";
	export const FORMAT_DATE = "FORMAT_DATE";
	export const FORMAT_DATETIME = "FORMAT_DATETIME";

	export const SUCCESS = "SUCCESS";

	export const ERROR_CANCELLED = "ERROR_CANCELLED"; // Vorgang wurde (vom User) abgebrochen
	export const ERROR_DATABASE = "ERROR_DATABASE"; // Fehler beim Zugriff auf die Datenbank
	export const ERROR_DENIED = "ERROR_DENIED"; // Verifizierung des Clients ist fehlgeschlagen oder der User hat versucht etwas zu tun, was er nicht darf
	export const ERROR_EMPTY_DATA = "ERROR_EMPTY_DATA"; // der Verarbeitungsfunktion wurde eine leere Datenmenge übergeben
	export const ERROR_EXPIRED = "ERROR_EXPIRED"; // Ein Token ist nicht mehr gültig oder die gewünschte Aktion wurde zu spät ausgeführt und deswegen verweigert
	export const ERROR_EXTERNAL = "ERROR_EXTERNAL"; // beim Aufruf einer externen API, Bibliothek, Framework, Service, etc. ist ein Fehler aufgetreten
	export const ERROR_FILE = "ERROR_FILE"; // beim Zugriff auf das lokale Dateisystem ist ein Fehler aufgetreten (nicht vorhanden, fehlende Rechte, Festplatte voll, usw.)
	export const ERROR_INPUT = "ERROR_INPUT"; // (inhaltlicher) Fehler in den übermittelten Daten
	export const ERROR_INTERNAL = "ERROR_INTERNAL"; // interner Fehler bei der Verarbeitung der Anfrage
	export const ERROR_FLOOD = "ERROR_FLOOD"; // Anfrage wurde abgelehnt weil sie zu oft fehlgeschlagen ist und eine Überflutung illegaler Anfragen befürchtet wird (DoS-Attacke)
	export const ERROR_NETWORK = "ERROR_NETWORK"; // ein benötigter Server / Dienst / Schnittstelle ist nicht erreichbar
	export const ERROR_NOT_SUPPORTED = "ERROR_NOT_SUPPORTED"; // die gewünschte Funktion wird so nicht unterstützt
	export const ERROR_NYI = "ERROR_NYI"; // gewünschte Funktion ist noch nicht implementiert
	export const ERROR_PARAMS = "ERROR_PARAMS"; // (technischer) Fehler bei der Übertragung der Parameter an den Server
	export const ERROR_PARTIAL = "ERROR_PARTIAL"; // die Anfrage wurde teilweise erfolgreich ausgeführt, z.B. für einige Datensätze aber nicht für alle
	export const ERROR_PENDING = "ERROR_PENDING"; // die gewünschte Anfrage ist berreits in Bearbeitung
	export const ERROR_PERMISSION = "ERROR_PERMISSION"; // User hat nicht die Erlaubnis erteilt eine gewünschte Aktion auszuführen
	export const ERROR_REQUIRED = "ERROR_REQUIRED"; // Ein Eingabefeld wurde nicht ausgefüllt, das nicht als optional markiert ist
	export const ERROR_TAKEN = "ERROR_TAKEN"; // gewünschte Email / Benutzername / etc. ist schon vergeben
	export const ERROR_TIMEOUT = "ERROR_TIMEOUT"; // Anfrage / Aktion hat zu lange für die Ausführung benötigt und wurde abgebrochen
	export const ERROR_UPLOAD_COUNT = "ERROR_UPLOAD_COUNT"; // es wurd eine ungültige Anzahl von Dateien hochgeladen
	export const ERROR_UPLOAD_SIZE = "ERROR_UPLOAD_SIZE"; // die hochgeladene(n) Datei(en) hatte(n) eine ungültige Größe
	export const ERROR_UPLOAD_DIMENSIONS = "ERROR_UPLOAD_DIMENSIONS"; // die hochgeladene(n) Bild(er) hatten falsche Höhen und / oder Breiten
	export const ERROR_UPLOAD_TYPE = "ERROR_UPLOAD_TYPE"; // die hochgeladene(n) Datei(en) war(en) vom falschen Dateityp
	export const ERROR_VERSIONS = "ERROR_VERSIONS"; // die Versionsnummern (zwischen Client und Server) stimmen nicht überein
}
