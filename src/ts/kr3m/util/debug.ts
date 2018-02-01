/// <reference path="../util/log.ts"/>
/// <reference path="../util/set.ts"/>



module kr3m.util
{
	export class Debug
	{
		/*
			Recursively compares properties of two objects and dumps
			all differences to the console.
		*/
		public static deepCompareDump(a:any, b:any):void
		{
			if (typeof a != typeof b)
				Log.log("types do not match: " + typeof a + " <-> " + typeof b);

			var equal = true;
			var knownProperties = new Set<string>();

			Util.forEachRecursive(a, (key, aValue) =>
			{
				var bValue = Util.getProperty(b, key);
				if (typeof aValue != typeof bValue)
				{
					Log.log(key + "   types: " + typeof aValue + " <-> " + typeof bValue);
					equal = false;
				}
				else if (typeof aValue != "object" && aValue != bValue)
				{
					Log.log(key + "   values: " + aValue + " <-> " + bValue);
					equal = false;
				}
				knownProperties.add(key);
			});

			Util.forEachRecursive(b, (key, bValue) =>
			{
				if (knownProperties.contains(key))
					return;

				var aValue = Util.getProperty(a, key);
				if (typeof aValue != typeof bValue)
				{
					Log.log(key + "   types: " + typeof aValue + " <-> " + typeof bValue);
					equal = false;
				}
				else if (typeof bValue != "object" && aValue != bValue)
				{
					Log.log(key + "   values: " + aValue + " <-> " + bValue);
					equal = false;
				}
				knownProperties.add(key);
			});

			if (equal)
				Log.log("objects are equal");
			else
				Log.log("objects are not equal");
		}
	}
}
