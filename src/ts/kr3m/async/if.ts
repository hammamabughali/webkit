/// <reference path="../types.ts"/>



module kr3m.async
{
	/*
		Bequemlichkeitsklasse zum Arbeiten mit asynchronen
		if-then(-else)-Abfragen. Jeder der hier aufgelisteten
		Funktionen kann eine Condition als erster Parameter
		übergeben werden. Ist die Condition eine Funktion,
		wird diese aufgerufen und sie muss der Callback-Funktion,
		welche sie erhält, einen Wert zurück geben. Dieser
		Wert wird mit einer einfach if-Abfrage geprüft und
		entsprechend thenFunc oder elseFunc (sofern vorhanden)
		ausgeführt. Wenn alles fertig ist, wird anschließend
		noch die finallyFunc aufgerufen (sofern vorhanden).
	*/
	export class If
	{
		private static checkCondition(
			condition:any,
			callback:CB<boolean>):void
		{
			if (typeof condition == "function")
				condition((result) => callback(result ? true : false));
			else
				callback(condition ? true : false);
		}



		public static then(
			condition:any,
			thenFunc:(thenDone:Callback) => void,
			finallyFunc?:Callback)
		{
			kr3m.async.If.checkCondition(condition, (isTrue) =>
			{
				if (isTrue)
					thenFunc(() => finallyFunc && finallyFunc());
				else
					finallyFunc && finallyFunc();
			});
		}



		public static thenElse(
			condition:any,
			thenFunc:(thenDone:Callback) => void,
			elseFunc:(elseDone:Callback) => void,
			finallyFunc?:Callback)
		{
			kr3m.async.If.checkCondition(condition, (isTrue) =>
			{
				if (isTrue)
					thenFunc(() => finallyFunc && finallyFunc());
				else
					elseFunc(() => finallyFunc && finallyFunc());
			});
		}
	}
}
