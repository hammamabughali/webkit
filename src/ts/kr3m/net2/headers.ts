module kr3m.net2
{
	/*
		Bequemlichkeitsklasse zum Arbeiten mit HTTP-Headern.
		In den meisten F�llen sind Header-Sammlungen einfach
		nur Assoziative Arrays mit String-Schl�sseln und
		String-Werten, in manchen Ausnahmen k�nnen die Schl�ssel
		aber mehrfach verwendet werden (z.B. bei Cookies).
	*/
	export class Headers
	{
		private static DUPLICATES = ["Set-Cookie"];

		private data:{[name:string]:string|string[]} = {};



		public set(name:string, value:string):void
		{
			if (Headers.DUPLICATES.indexOf(name) < 0)
			{
				this.data[name] = value;
				return;
			}

			if (this.data[name] === undefined)
				this.data[name] = value;
			else if (typeof this.data[name] == "string")
				this.data[name] = [<string> this.data[name], value];
			else
				(<string[]> this.data[name]).push(value);
		}



		public setRaw(raw:any):void
		{
			for (var name in raw)
				this.set(name, raw[name]);
		}



		public get(name:string):string
		{
			if (this.data[name] === undefined)
				return undefined;

			return typeof this.data[name] == "string" ? <string> this.data[name] : this.data[name][0];
		}



		public getRaw():any
		{
			return this.data;
		}



		public delete(name:string):void
		{
			delete this.data[name];
		}



		public forEach(func:(name:string, value:string) => void):void
		{
			for (var name in this.data)
			{
				if (typeof this.data[name] == "string")
				{
					func(name, <string> this.data[name]);
				}
				else
				{
					for (var i = 0; i < this.data[name].length; ++i)
						func(name, this.data[name][i]);
				}
			}
		}
	}
}
