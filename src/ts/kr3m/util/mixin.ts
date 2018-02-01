module kr3m.util
{
	export class Mixin
	{
		public static apply(derivedCtor:any, baseCtors:any[]):void
		{
			baseCtors.forEach((baseCtor:any) =>
			{
				Object.getOwnPropertyNames(baseCtor.prototype).forEach((name:any) =>
				{
					derivedCtor.prototype[name] = baseCtor.prototype[name];
				})
			});
		}
	}
}
