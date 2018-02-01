module kr3m.util
{
	/*
		Factory-Klasse zum dynamischen erzeugen von Klassen.
		Die Factory wird dabei statt einem Aufruf von new
		erzeugt und ersetzt bei Bedarf die Klasse, von der
		ein Objekt erzeugt werden soll, durch eine andere.
	*/
	export class Factory
	{
		private mapping:{[className:string]:{new():any}} = {};

		private static instance:Factory;



		constructor()
		{
			if (!Factory.instance)
				Factory.instance = this;
		}



		/*
			Es wird eine globale Instanz der Factory erzeugt,
			welche mit getInstance aufgerufen werden kann.
			Alternativ kann man je nach Bedarf eigene Instanzen
			der Factory erzeugen. Es ist also jedem selbst
			überlassen, ob er die Factory als Singleton
			benutzt oder nicht.
		*/
		public static getInstance():Factory
		{
			if (!Factory.instance)
				Factory.instance = new Factory();
			return Factory.instance;
		}



		public addMapping<C1, C2 extends C1>(from:{new ():C1}, to:{new ():C2}):void
		{
			this.mapping[from.toString()] = to;
		}



		public map<C>(cls:{new ():C}):{new():C}
		{
			return this.mapping[cls.toString()] || cls;
		}



		public createInstance<T>(cls:{new():T}, ...params:any[]):T
		{
			var mapped = this.map(cls);
			function helper()
			{
				mapped.apply(this, params);
			}
			helper.prototype = mapped.prototype;
			return new helper();
		}
	}
}



/*
	Bequemlichkeitsfunktion um nicht immer
	kr3m.util.Factory.getInstance().createInstance schreiben zu müssen.

	Im Prinzip sollten einfach alle new Anweisungen durch Aufrufe an
	die factory Funktion ersetzt werden. Die Klasse wird dabei als
	erster Parameter übergeben, die restlichen Parameter einfach dran
	gehängt.

	Zum Beispiel: statt zu schreiben
		var button = new kr3m.ui.Button(this, "Hallo Welt");
	sollte man schreiben
		var button = factory(kr3m.ui.Button, this, "Hallo Welt");

	Dann kann bei Bedarf auf eine Instanz einer von kr3m.ui.Button
	abgeleiteten Klasse zurück gegeben werden statt eine Instanz der
	Basisklasse selbst.
*/
function factory<T>(cls:{new ():T}, ...params:any[]):T
{
	var fact = kr3m.util.Factory.getInstance();
	return fact.createInstance(cls, ...params);
}
