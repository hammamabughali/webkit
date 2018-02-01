/// <reference path="../util/json.ts"/>
/// <reference path="../util/stringex.ts"/>



//# CLIENT
module kr3m.util
{
	/*
		Wrapper für localStorage, der beliebige Datentypen statt
		nur String erlaubt. Außerdem wird auf Systemen, auf denen
		LocalStorage nicht funktioniert, ein Backupsystem verwendet,
		welches zumindest für die Dauer der aktuellen Session die
		Funktionalität von localstorage imitiert.
	*/
	export class LocalStorage
	{
		public static useObfuscation = false;

		private static supported:boolean;
		private static backup:{[name:string]:string};



		public static isSupported():boolean
		{
			if (LocalStorage.backup)
				return false;

			if (LocalStorage.supported)
				return true;

			try
			{
				var key = "kr3mTest89476";
				localStorage.setItem(key, "xyz");
				localStorage.getItem(key);
				localStorage.removeItem(key);
				LocalStorage.supported = true;
				return true;
			}
			catch (e)
			{
				LocalStorage.backup = {};
				return false;
			}
		}



		public static setItem(key:string, item:any):void
		{
			var encoded = Json.encode(item);
			if (LocalStorage.useObfuscation && window.btoa)
				encoded = window.btoa(encoded);

			if (LocalStorage.isSupported())
				localStorage.setItem(key, encoded);
			else
				LocalStorage.backup[key] = encoded;
		}



		public static getItem(key:string):any
		{
			if (LocalStorage.isSupported())
				var encoded = <string> localStorage.getItem(key);
			else
				var encoded = <string> LocalStorage.backup[key];

			if (!encoded)
				return encoded;

			var decoded = encoded;
			try
			{
				if (LocalStorage.useObfuscation && window.atob)
				{
					decoded = StringEx.stripBom(window.atob(decoded));
					if (!decoded)
						return undefined;
				}
			}
			catch(e)
			{
			}
			decoded = Json.decode(decoded);
			return decoded || encoded;
		}



		public static getStoredItemKeys():string[]
		{
			if (LocalStorage.isSupported())
			{
				var keys:string[] = [];
				for (var i = 0; i < localStorage.length; ++i)
					keys.push(localStorage.key(i));
				return keys;
			}
			else
			{
				return Object.keys(LocalStorage.backup);
			}
		}



		public static removeItem(key:string):void
		{
			if (LocalStorage.isSupported())
				localStorage.removeItem(key);
			else
				delete LocalStorage.backup[key];
		}



		public static clear():void
		{
			if (LocalStorage.isSupported())
				localStorage.clear();
			else
				LocalStorage.backup = {};
		}
	}
}



kr3m.util.LocalStorage.isSupported();

//# /CLIENT
