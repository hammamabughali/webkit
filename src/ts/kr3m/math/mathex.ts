module kr3m.math
{
	export const RAD_2_DEG = 180 / Math.PI;
	export const DEG_2_RAD = Math.PI / 180;
	export const EPSILON = 1 / 1000000;



	/*
		Gibt den (linear) interpolierten Wert zwischen zwei Zahlen
		zurück. f ist der Interpolationsfaktor: 0 für a, 1 für b und
		dazwischen für interpolierte Werte. Ist f kleiner als 0 oder
		größer als 1 wird linear extrapoliert.
	*/
	export function interpolate(f:number, a:number, b:number):number
	{
		return f * b + (1 - f) * a;
	}



	/*
		Gibt value auf den Bereich zwischen min (inklusive) und
		max (inklusive) beschränkt zurück.
	*/
	export function clamp(value:number, min:number = 0, max:number = 1):number
	{
		return Math.min(max, Math.max(value, min));
	}



	export function sign(value:number):number
	{
		return value < 0 ? -1 : value > 0 ? 1 : 0;
	}
}
