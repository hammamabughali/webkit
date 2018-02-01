/// <reference path="../async/delayed.ts"/>
/// <reference path="../lib/external/cordova/cordova.d.ts"/>

// siehe auch: https://build.phonegap.com/plugins



interface Window
{
	device:any;
	plugin:any;
}



//# DEPRECATED_1_2_16_19
/*
	Bitte diese Funktionen nicht mehr verwenden. Statt dessen
	die entsprechenden Methoden von kr3m.phonegap.Phonegap
	benutzen.
*/
module kr3m.lib.cordova
{
	export function isAvailable():boolean
	{
//# APP
		return true;
//# /APP
//# !APP
		return false;
//# /!APP
	}



	/*
		Lässt das Smartphone für time Millisekunden
		vibrieren.
	*/
	export function vibrate(time:number):void
	{
//# APP
		navigator.notification.vibrate(time);
//# /APP
	}



	/*
		Startet die Standard-Kamera-App des Gerätes
		und fordert den User auf, ein Bild mit den
		gewünschten Maßen zu machen. Falls alles
		klappt, wird das Bild als Base64-kodiertes
		JPG zurückgegeben, ansonsten null.
	*/
	export function takePicture(
		width:number, height:number,
		callback:(data:string) => void):void
	{
//# APP
		navigator.camera.getPicture((dataUrl:string) =>
		{
			callback(dataUrl);
		}, (errorMessage:string) =>
		{
			logError(errorMessage);
			callback(null);
		},
		{
			quality:90,
			destinationType:Camera.DestinationType.DATA_URL,
			sourceType:Camera.PictureSourceType.CAMERA,
			allowEdit:false,
			mediaType:Camera.MediaType.PICTURE,
			encodingType:Camera.EncodingType.JPEG,
			targetWidth:width,
			targetHeight:height,
			saveToPhotoAlbum:false
		});
//# /APP
	}



	/*
		Funktioniert prinzipiell genau gleich wie takePicture,
		aber statt ein Bild mit der Kamera aufzunehmen muss
		der User ein Bild von seinen gespeicherten Bildern auf
		seinem Smartphone aussuchen.
	*/
	export function chosePicture(
		width:number, height:number,
		callback:(data:string) => void):void
	{
//# APP
		navigator.camera.getPicture((dataUrl:string) =>
		{
			callback(dataUrl);
		}, (errorMessage:string) =>
		{
			logError(errorMessage);
			callback(null);
		},
		{
			quality:90,
			destinationType:Camera.DestinationType.DATA_URL,
			sourceType:Camera.PictureSourceType.SAVEDPHOTOALBUM,
			allowEdit:false,
			mediaType:Camera.MediaType.PICTURE,
			encodingType:Camera.EncodingType.JPEG,
			targetWidth:width,
			targetHeight:height,
			saveToPhotoAlbum:false
		});
//# /APP
	}
}
//# /DEPRECATED_1_2_16_19
