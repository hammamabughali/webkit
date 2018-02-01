/// <reference path="../types.ts"/>



module kr3m.async
{
	/*
		Eine Klasse, die sicherstellt, dass alle über
		call aufgerufenen Funktionen nicht häufiger
		aufgerufen werden als einmal pro cooldown (in
		ms). Funktionen werden nicht verzögert sondern
		einfach nicht ausgeführt.
	*/
	export class Throttle
	{
		private cooldown:number;
		private next:number;



		constructor(cooldown:number)
		{
			this.cooldown = cooldown;
			this.next = 0;
		}



		public call(
			func:Callback):void
		{
			var now = Date.now();
			if (this.next <= now)
			{
				this.next = now + this.cooldown;
				func();
			}
		}
	}



	/*
		Verpackt eine Funktion so, dass sie nur einmal alle
		cooldown Millisekunden aufgerufen wird falls das
		häufiger passieren sollte.

		Kann z.B. verwendet werden damit eine Funktion in
		einer Schleife nur einmal pro Sekunde eine Ausgabe
		durchführt oder etwas in der Art.
	*/
	export function throttled(
		cooldown:number,
		func:Callback):Function
	{
		var next = 0;
		var helper = () =>
		{
			var now = Date.now();
			if (next <= now)
			{
				next = now + cooldown;
				func();
			}
		};
		return helper;
	}
}
