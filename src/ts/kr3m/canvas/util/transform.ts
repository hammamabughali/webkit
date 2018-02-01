/// <reference path="../../lib/pixi.ts"/>



module kr3m.canvas.util
{
	export interface ITransforming extends PIXI.DisplayObject
	{
		skew:PIXI.Point;
	}


	export function updateTranform(obj:kr3m.canvas.util.ITransforming):void
	{
		var parentTransform:PIXI.Matrix = obj.parent.worldTransform;
		var worldTransform:PIXI.Matrix = obj.worldTransform;

		var px = obj.pivot.x;
		var py = obj.pivot.y;

		var a00:number = obj.scale.x * Math.cos(obj.rotation + obj.skew.y),
			a01:number = obj.scale.y * Math.sin(-obj.rotation - obj.skew.x),
			a10:number = obj.scale.x * Math.sin(obj.rotation + obj.skew.y),
			a11:number = obj.scale.y * Math.cos(obj.rotation + obj.skew.x),
			a02:number = obj.position.x - a00 * px - py * a01,
			a12:number = obj.position.y - a11 * py - px * a10,
			b00:number = parentTransform.a, b01 = parentTransform.c,
			b10:number = parentTransform.b, b11 = parentTransform.d;

		worldTransform.a = b00 * a00 + b01 * a10;
		worldTransform.c = b00 * a01 + b01 * a11;
		worldTransform.tx = b00 * a02 + b01 * a12 + parentTransform.tx;

		worldTransform.b = b10 * a00 + b11 * a10;
		worldTransform.d = b10 * a01 + b11 * a11;
		worldTransform.ty = b10 * a02 + b11 * a12 + parentTransform.ty;

		obj.worldAlpha = obj.alpha * obj.parent.worldAlpha;
	}
}
