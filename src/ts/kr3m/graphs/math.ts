module kr3m.graphs
{
	/*
		Verwendet den Algorithmus aus Graphic Gems:
		Paul S. Heckbert: "Nice Numbers for Graph Labels"
		um schöne Zahlen für die Skala des Graphen zu berechnen.
	*/
	export function niceNumber(x:number, round:boolean):number
	{
		var e = Math.floor(Math.log(x) / Math.log(10));
		var f = x / Math.pow(10, e);
		var nf = 0;
		if (round)
		{
			if (f < 1.5)
				nf = 1;
			else if (f < 3)
				nf = 2;
			else if (f < 7)
				nf = 5;
			else
				nf = 10;
		}
		else
		{
			if (f <= 1)
				nf = 1;
			else if (f <= 2)
				nf = 2;
			else if (f <= 5)
				nf = 5;
			else
				nf = 10;
		}
		return nf * Math.pow(10, e);
	}



	export function getNiceMinimum(min:number, max:number, gridSteps:number = 5):number
	{
		var d = getNiceStep(min, max, gridSteps);
		var result = Math.floor(min / d) * d;
		return result;
	}



	export function getNiceMaximum(min:number, max:number, gridSteps:number = 5):number
	{
		var d = getNiceStep(min, max, gridSteps);
		var result = Math.ceil(max / d) * d;
		return result;
	}



	export function getNiceStep(min:number, max:number, gridSteps:number = 5):number
	{
		var range = niceNumber(max - min, false);
		var d = niceNumber(range / (gridSteps - 1), true);
		return d;
	}
}
