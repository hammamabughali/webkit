/// <reference path="../util/json.ts"/>
/// <reference path="../util/log.ts"/>



module kr3m.util
{
	/*
		Wrapper für die postmessage Api um sie in allen Browsern
		verwenden zu können. Schickt Nachrichten beliebigen Typs
		zwischen einzelnen Windows in einer Anwendung (z.B. denen
		in Frames) hin und her.

		Diese Implementierung ist sehr nahe an der ursprünglichen
		PostMessage-Funktionalität. Für eine einfachere Handhabung
		der ganzen Geschichte ist meistens kr3m.util.PostMessageNode
		besser geeignet.
	*/
	export class PostMessage
	{
		private static trimOrigin(origin:string):string
		{
			return origin.replace(/\/+$/, "");
		}



		public static addListener(
			listener:(message:any) => void,
			targetWindow:Window = window,
			sourceOrigin:string = "*"):void
		{
			sourceOrigin = PostMessage.trimOrigin(sourceOrigin);
			var helper = (event:any) =>
			{
				if (sourceOrigin != "*" && sourceOrigin != PostMessage.trimOrigin(event.origin))
					return;

				if (typeof event.data != "string" || !Json.isJSON(event.data))
					return;

				var decoded = Json.decode(event.data);
				listener(decoded);
			};

			if (targetWindow["attachEvent"])
				targetWindow["attachEvent"]("onmessage", helper);
			else if (targetWindow.addEventListener)
				targetWindow.addEventListener("message", helper, false);
			else
				Log.logError("window object doesn't support neither attachEvent nor addEventListener", targetWindow);
		}



		/*
			Schickt die Nachricht message an das Fenster targetWindow.
			Die Nachricht wird in ein JSON Objekt umgewandelt, bevor
			sie verschickt wird.
		*/
		public static send(
			message:any,
			targetWindow = window,
			targetOrigin = "*"):void
		{
			try
			{
				var encoded = Json.encode(message);
				targetWindow.postMessage(encoded, targetOrigin);
			}
			catch (exception)
			{
				kr3m.util.Log.logWarning("PostMessage could not be sent:", exception);
			}
		}



		/*
			Schickt die Nachricht message an das Fenster targetWindow.
			Die Nachricht wird nicht manipuliert sondern genau so
			versand wie sie übergeben wurde.
		*/
		public static sendText(
			message:string,
			targetWindow = window,
			targetOrigin = "*"):void
		{
			try
			{
				targetWindow.postMessage(message, targetOrigin);
			}
			catch (exception)
			{
				kr3m.util.Log.logWarning("PostMessage could not be sent:", exception);
			}
		}
	}
}
