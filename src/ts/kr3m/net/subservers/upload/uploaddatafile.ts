/// <reference path="../../../lib/node.ts"/>
/// <reference path="../../../net/mimetypes.ts"/>
/// <reference path="../../../types.ts"/>
/// <reference path="../../../util/file.ts"/>



module kr3m.net.subservers.upload
{
	export class UploadDataFile
	{
		public fileName:string; // wie hieß die Datei auf dem Rechner des Users
		public inputName:string; // wie hieß das HTML-Dom-Element (name-Attribut), über welches die Datei hochgeladen wurde
		public data:NodeBuffer; // ein Buffer mit dem Inhalt der Datei
		public mimeType:string; // der ermittelte mimeType der hochgeladenen Datei
		public url:string; // die URL, unter welcher die Datei nach dem Uploadvorgang auf dem Server gefunden werden kann. Enthält standardmäßig fileName, kann aber manuell geändert werden



		/*
			Lädt die gegebene Datei und befüllt die Felder
			des UploadDataFile-Objektes mit den entsprechenden
			Werten und gibt es zurück. Wenn ein Fehler auftritt,
			wird null zurück gegeben.
		*/
		public static loadFrom(
			filePath:string,
			callback:(file:UploadDataFile) => void):void
		{
			fsLib.readFile(filePath, (error:Error, buffer:NodeBuffer) =>
			{
				var file = new kr3m.net.subservers.upload.UploadDataFile();
				file.fileName = kr3m.util.File.getFilenameFromPath(filePath);
				file.inputName = "";
				file.data = buffer;
				file.mimeType = kr3m.net.MimeTypes.getMimeTypeByFileName(filePath);
				callback(file);
			});
		}



		/*
			Speichert die Datei unter dem gegebenen Namen
			und ruft anschließend die callback Funktion auf
			falls angegeben.
		*/
		public saveAs(
			filePath:string,
			callback?:SuccessCallback):void
		{
			fsLib.writeFile(filePath, this.data, (err:Error) =>
			{
				callback && callback(!err);
			});
		}



		/*
			Speichert die Datei unter ihrem Ursprungsnamen
			in dem gegebenen Verzeichnis ab und ruft anschließend
			die callback Funktion auf falls angegeben.
		*/
		public saveIn(
			directoryPath:string,
			callback?:SuccessCallback):void
		{
			var filePath = directoryPath + "/" + this.fileName;
			filePath = filePath.replace(/\/\//g, "/");
			fsLib.writeFile(filePath, this.data, (err:Error) =>
			{
				callback && callback(!err);
			});
		}
	}
}
