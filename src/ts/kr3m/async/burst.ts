/// <reference path="../async/loop.ts"/>
/// <reference path="../types.ts"/>



module kr3m.async
{
	/*
		Die Burst-Klasse kann verwendet werden um zu verhindern,
		dass Operationen, die aus sehr vielen Schritten bestehen,
		zu einem Skript-Timeout oder dergleichen führen.

		Im Prinzip werden Batches von Schritten ausgeführt, dann
		überprüft ob seit Beginn eine bestimmte Zeit vergangen ist.
		Falls nicht, werden weiter Batches ausgeführt bis das
		Zeitlimit erreicht ist. Anschließend wird ein setTimeout
		verwendet um die Kontrolle abzugeben und später weiter zu
		machen. Dann geht es wieder mit den weiteren Schritten und
		einem neuen Zeitlimit weiter bis alle Schritte durchgeführt
		worden sind.

		Die Burstklasse unterstützt nur synchrone Rechenschritte,
		da asynchrone schon durch ihre Natur nicht für
		Skript-Timeouts anfällig sind.
	*/
	export class Burst
	{
		/*
			Führt wiederholt batchSize mal func aus bis timeframe
			(in ms) vergangen ist. Setzt dann die Bearbeitung bis
			zum nächsten tick aus und macht dann weiter. Das wird
			so lange wiederholt bis func false zurück gibt.
			Anschließend wird callback aufgerufen sofern angegeben.
		*/
		static process(
			batchSize:number,
			timeframe:number,
			func:() => boolean,
			callback?:Callback):void
		{
			var temp = () =>
			{
				var threshold = Date.now() + timeframe;
				while (Date.now() < threshold)
				{
					for (var i = 0; i < batchSize; ++i)
					{
						if (!func())
							return callback && callback();
					}
				}
				setTimeout(temp, 0);
			};
			temp();
		}



		/*
			Führt func für alle Elemente aus elements aus, wobei
			das entsprechende Element zusammen mit seiner Position
			in Elements als Parameter übergeben werden. Alle
			burstSize Operationen wird überprüft, ob seit der letzten
			Überprüfung oder dem Start der Operation timeFrame oder
			mehr Millisekunden vergangen sind. Falls ja wird
			interBurstListener aufgerufen, sofern angegeben.
			Anschließend wird der Ablauf kurz unterbrochen damit andere
			Funktionen arbeiten können und anschließend wieder mit dem
			nächsten Element aus elements wieder aufgenommen. Wenn
			alle Elemente abgearbeitet wurden, wird callback aufgerufen,
			sofern vorhanden.
		*/
		static forEach<T>(
			elements:T[],
			func:(element:T, i:number) => void,
			callback?:Callback,
			burstSize = 100,
			timeFrame = 200,
			interBurstListener?:CB<number>):void
		{
			var lastTime = Date.now();
			Loop.forEachBatch(elements, burstSize, (batch, next, offset) =>
			{
				for (var i = 0; i < batch.length; ++i)
					func(batch[i], offset + i);

				if (Date.now() - lastTime > timeFrame)
					return next();

				lastTime = Date.now();
				setTimeout(next, 0);
			}, callback);
		}
	}
}
