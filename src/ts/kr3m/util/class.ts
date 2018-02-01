/// <reference path="../util/log.ts"/>



module kr3m.util
{
	export class Class
	{
		/*
			Gibt den Klassennamen einer Instance zurück

			Beispiel:
				var app:kr3m.app.Application = new kr3m.app.Application();
				var className:string = kr3m.util.Class.getClassNameOfInstance(app); // returns 'Application'
		*/
		public static getClassNameOfInstance(instance:any):string
		{
			var funcNameRegex:RegExp = /function (.{1,})\(/;
			var results:any = (funcNameRegex).exec((<any>instance).constructor.toString());
			return (results && results.length > 1) ? results[1].toString() : "";
		}



		/*
			Gibt anhand einer Klassendeklaration/-definition deren Namen zurück

			Beispiel:
				var className:string = kr3m.util.Class.getNameOfClass(kr3m.util.StringEx); // returns 'String'
		*/
		public static getNameOfClass(clss:any):string
		{
			var funcNameRegex:RegExp = /function (.{1,})\(/;
			var results:any = (funcNameRegex).exec(clss.toString());
			return (results && results.length > 1) ? results[1].toString() : "";
		}



		/*
			Erstellt anhand einer Klassendeklaration/-definition eine Instanz derer.
			Bei clss kann es sich um die tatsächliche Klasse handeln oder um einen
			String, der den Namen der Klasse enthält.

			Beispiel:
				var app:kr3m.app.Application = kr3m.util.Class.createInstanceOfClass(kr3m.app.Application);
		*/
		public static createInstanceOfClass(clss:any, params:any[] = []):any
		{
			try
			{
				clss = (typeof clss == "string") ? eval(clss) : clss;
				var helper = function()
				{
					clss.apply(this, params);
				};
				helper.prototype = clss.prototype;
				return new helper();
			}
			catch(er)
			{
				kr3m.util.Log.logDebug(er);
				return null;
			}
		}
	}
}
