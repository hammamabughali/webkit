/// <reference path="../types.ts"/>
/// <reference path="../util/util.ts"/>

//# UNITTESTS
/// <reference path="../unittests/suite.ts"/>
//# /UNITTESTS



module kr3m.async
{
	/*
		Das Flags ist ein Container für verschiedene Zustände. Jeder Zustand
		(oder Flag) hat einen eindeutigen Namen und kann entweder gesetzt (set)
		oder nicht gesetzt (clear) sein. Zustände können von außen mit set() und
		clear() gesetzt werden. Dabei werden listener aufgerufen, die sich auf
		Kombinationen von gesetzten oder nicht gesetzten Zuständen beziehen.
		Im Anfangszustand zählen alle Zustände als nicht gesetzt (clear).

		Im Gegensatz zu EventDispatchern werden die Listener auch sofort beim
		Setzen aufgerufen, wenn die Zustände zuvor schon passend gesetzt wurden.
	*/
	export class Flags
	{
		private flags:{[name:string]:boolean} = {};
		private metas:{names:string[], isOnce:boolean, isClear:boolean, listener:Callback}[] = [];
		private setConstraints:{[name:string]:string[]} = {};
		private clearConstraints:{[name:string]:string[]} = {};
		private ignored:string[] = [];



		/*
			Setzt die Zustände names auf eine interne Blacklist. Es wird davon
			ausgegangen, dass diese Zustände niemals gesetzt werden und deshalb
			entsprechende Aufrufe mit onSet und onceSet einfach ignoriert werden
			sollen.
		*/
		public ignore(...names:string[]):void
		{
			for (var i = 0; i < names.length; ++i)
			{
				if (this.ignored.indexOf(names[i]) < 0)
					this.ignored.push(names[i]);
			}

			for (var i = 0; i < this.metas.length; ++i)
			{
				var ignored = kr3m.util.Util.intersect(names, this.metas[i].names);
				if (ignored.length > 0)
					this.metas.splice(i--, 1);
			}
		}



		/*
			Entfernt die Zustände names von der internen Blacklist (siehe
			ignore).
		*/
		public unignore(...names:string[]):void
		{
			this.ignored = this.ignored.filter((name) => names.indexOf(name) < 0);
		}



		/*
			Gibt die Namen aller gesetzten Zustände zurück.
		*/
		public getSet():string[]
		{
			var names = Object.keys(this.flags);
			names = names.filter((name) => this.flags[name]);
			return names;
		}



		/*
			Gibt true zurück wenn der Zustand name gesetzt ist und false sonst.
		*/
		public isSet(name:string):boolean
		{
			return this.flags[name] || false;
		}



		/*
			Führt func für jeden gesetzten Zustand aus und übergibt dessen Namen
			als einzigen Parameter.
		*/
		public forEach(func:(name:string) => void):void
		{
			var names = Object.keys(this.flags);
			names = names.filter((name) => this.flags[name]);
			for (var i = 0; i < names.length; ++i)
				func(names[i]);
		}



		/*
			Gibt true zurück wenn alle Zustände aus names gesetzt sind und
			false sobald mindestens einer davon nicht gesetzt ist.
		*/
		public areSet(...names:string[]):boolean
		{
			for (var i = 0; i < names.length; ++i)
			{
				if (!this.flags[names[i]])
					return false;
			}
			return true;
		}



		/*
			Führt listener jedes Mal aus wenn das Setzen eines Zustandes dazu
			führt, dass alle Zustände aus names gesetzt sind oder sofort, falls
			sie bereits alle gesetzt sein sollten.
		*/
		public onSet(names:string|string[], listener:Callback):void
		{
			if (typeof names == "string")
				names = [names];

			var ignored = kr3m.util.Util.intersect(names, this.ignored);
			if (ignored.length > 0)
				return;

			var hasAll = true;
			for (var i = 0; i < names.length; ++i)
			{
				if (!this.flags[names[i]])
				{
					hasAll = false;
					break;
				}
			}

			if (hasAll)
				listener();

			var item =
			{
				names : typeof names == "string" ? [names] : names,
				isOnce : false,
				isClear : false,
				listener : listener
			};
			this.metas.push(item);
		}



		/*
			Führt listener einmalig aus wenn das Setzen eines Zustandes dazu
			führt, dass alle Zustände aus names gesetzt sind oder sofort, falls
			sie bereits alle gesetzt sein sollten.
		*/
		public onceSet(names:string|string[], listener:Callback):void
		{
			if (typeof names == "string")
				names = [names];

			var ignored = kr3m.util.Util.intersect(names, this.ignored);
			if (ignored.length > 0)
				return;

			var hasAll = true;
			for (var i = 0; i < names.length; ++i)
			{
				if (!this.flags[names[i]])
				{
					hasAll = false;
					break;
				}
			}
			if (hasAll)
				return listener();

			var item =
			{
				names : typeof names == "string" ? [names] : names,
				isOnce : true,
				isClear : false,
				listener : listener
			};
			this.metas.push(item);
		}



		/*
			Entfernt einen der mit onSet oder onceSet gesetzten listener. Wird
			listener leer gelassen werden statt dessen alle Listener entfernt,
			die auf names warten.
		*/
		public offSet(names:string|string[], listener?:Callback):void
		{
			if (typeof names == "string")
				names = [names];

			for (var i = 0; i < this.metas.length; ++i)
			{
				if (!this.metas[i].isClear)
				{
					var inter = kr3m.util.Util.intersect(this.metas[i].names, names);
					if (inter.length == names.length)
					{
						if (!listener || listener == this.metas[i].listener)
							this.metas.splice(i--, 1);
					}
				}
			}
		}



		/*
			Das gleiche wie onSet wird aber aufgerufen wenn die Zustände nicht
			gesetzt sind / wurden.

			Im Gegensatz zu onSet wird der listener auch nicht aufgerufen, wenn
			die Zustände beim Aufruf von onClear bereits alle nicht gesetzt sind.
		*/
		public onClear(names:string|string[], listener:Callback):void
		{
			if (typeof names == "string")
				names = [names];

			var item =
			{
				names : typeof names == "string" ? [names] : names,
				isOnce : false,
				isClear : true,
				listener : listener
			};
			this.metas.push(item);
		}



		/*
			Das gleiche wie onceSet wird aber aufgerufen wenn die Zustände nicht
			gesetzt sind / wurden.

			Im Gegensatz zu onceSet wird der listener auch nicht aufgerufen, wenn
			die Zustände beim Aufruf von onceClear bereits alle nicht gesetzt sind.
		*/
		public onceClear(names:string|string[], listener:Callback):void
		{
			if (typeof names == "string")
				names = [names];

			var item =
			{
				names : typeof names == "string" ? [names] : names,
				isOnce : true,
				isClear : true,
				listener : listener
			};
			this.metas.push(item);
		}



		public offClear(names:string|string[], listener?:Callback):void
		{
			if (typeof names == "string")
				names = [names];

			for (var i = 0; i < this.metas.length; ++i)
			{
				if (this.metas[i].isClear)
				{
					var inter = kr3m.util.Util.intersect(this.metas[i].names, names);
					if (inter.length == names.length)
					{
						if (!listener || listener == this.metas[i].listener)
							this.metas.splice(i--, 1);
					}
				}
			}
		}



		private dispatch(setNames:string[], clearedNames:string[]):void
		{
			var allSetNames:string[];
			for (var i = 0; i < this.metas.length; ++i)
			{
				var names = this.metas[i].isClear ? clearedNames : setNames;
				var inter = kr3m.util.Util.intersect(this.metas[i].names, names);
				if (inter.length > 0)
				{
					allSetNames = allSetNames || this.getSet();
					inter = kr3m.util.Util.intersect(this.metas[i].names, allSetNames);
					if (inter.length == this.metas[i].names.length)
					{
						this.metas[i].listener();
						if (this.metas[i].isOnce)
							this.metas.splice(i--, 1);
					}
				}
			}
		}



		/*
			Setzt alle Zustände aus names auf gesetzt und ruft entsprechende
			Listener auf.
		*/
		public set(...names:string[]):void
		{
			var setNames:string[] = [];
			for (var i = 0; i < names.length; ++i)
			{
				if (!this.flags[names[i]])
					setNames.push(names[i]);
				this.flags[names[i]] = true;
			}

			var runLoop = true;
			while (runLoop)
			{
				runLoop = false;
				for (var name in this.setConstraints)
				{
					if (!this.flags[name])
					{
						var inter = kr3m.util.Util.intersect(this.setConstraints[name], setNames);
						if (inter.length > 0)
						{
							for (var i = 0; i < this.setConstraints[name].length; ++i)
							{
								if (!this.flags[this.setConstraints[name][i]])
									break;
							}
							if (i >= this.setConstraints[name].length)
							{
								this.flags[name] = true;
								setNames.push(name);
								runLoop = true;
							}
						}
					}
				}
			}

			this.dispatch(setNames, []);
		}



		/*
			Setzt alle Zustände aus names auf nicht gesetzt und ruft
			entsprechende Listener auf.
		*/
		public clear(...names:string[]):void
		{
			var clearedNames:string[] = [];
			for (var i = 0; i < names.length; ++i)
			{
				if (this.flags[names[i]])
					clearedNames.push(names[i]);
				this.flags[names[i]] = false;
			}

			var runLoop = true;
			while (runLoop)
			{
				runLoop = false;
				for (var name in this.clearConstraints)
				{
					if (this.flags[name])
					{
						var inter = kr3m.util.Util.intersect(this.clearConstraints[name], clearedNames);
						if (inter.length > 0)
						{
							this.flags[name] = false;
							clearedNames.push(name);
							runLoop = true;
						}
					}
				}
			}

			this.dispatch([], clearedNames);
		}



		/*
			Setzt alle aktuell gesetzten Zustände auf nicht gesetzt.
		*/
		public clearAll():void
		{
			var names = Object.keys(this.flags);
			names = names.filter((name) => this.flags[name]);
			this.clear(...names);
		}



		/*
			Setzt den Zustand name auf "gesetzt" sobald alle Zustände
			aus otherNames auf "gesetzt" umgestellt wurden. Wird
			addClearContraint auf true gesetzt, wird name auch wieder
			automatisch gelöscht sobald ein Zustand aus otherNames
			gelöscht wird.
		*/
		public addSetConstraint(
			name:string,
			otherNames:string[],
			addClearConstraint = false):void
		{
			this.setConstraints[name] = otherNames;
			if (addClearConstraint)
				this.addClearConstraint(name, otherNames);
		}



		/*
			Setzt den Zustand name auf "nicht gesetzt" sobald einer
			der Zustände aus otherNames auf "nicht gesetzt"
			umgeschaltet wird.
		*/
		public addClearConstraint(
			name:string, otherNames:string[]):void
		{
			this.clearConstraints[name] = otherNames;
		}
	}
}



//# UNITTESTS
setTimeout(() =>
{
	new kr3m.unittests.Suite("kr3m.async.Flags")
	.add(new kr3m.unittests.CaseSync("set I", () =>
	{
		var f = new kr3m.async.Flags();
		return f.getSet();
	}, []))
	.add(new kr3m.unittests.CaseSync("set II", () =>
	{
		var f = new kr3m.async.Flags();
		f.set("alpha");
		return f.getSet();
	}, ["alpha"]))
	.add(new kr3m.unittests.CaseSync("set III", () =>
	{
		var f = new kr3m.async.Flags();
		f.set("alpha", "beta", "gamma");
		f.clear("beta");
		return f.getSet();
	}, ["alpha", "gamma"]))
	.add(new kr3m.unittests.CaseSync("clear I", () =>
	{
		var f = new kr3m.async.Flags();
		f.set("beta", "gamma");
		return f.getSet();
	}, ["beta", "gamma"]))
	.add(new kr3m.unittests.CaseSync("addSetConstraint I", () =>
	{
		var f = new kr3m.async.Flags();
		f.addSetConstraint("omega", ["alpha", "beta", "gamma"]);
		f.set("alpha");
		return f.getSet();
	}, ["alpha"]))
	.add(new kr3m.unittests.CaseSync("addSetConstraint II", () =>
	{
		var f = new kr3m.async.Flags();
		f.addSetConstraint("omega", ["alpha", "beta", "gamma"]);
		f.set("alpha", "beta");
		f.set("gamma");
		return f.getSet();
	}, ["alpha", "beta", "gamma", "omega"]))
	.add(new kr3m.unittests.CaseSync("addClearConstraint I", () =>
	{
		var f = new kr3m.async.Flags();
		f.addClearConstraint("delta", ["alpha", "gamma"]);
		f.set("alpha", "beta", "gamma", "delta");
		f.clear("beta");
		return f.getSet();
	}, ["alpha", "gamma", "delta"]))
	.add(new kr3m.unittests.CaseSync("addClearConstraint II", () =>
	{
		var f = new kr3m.async.Flags();
		f.addClearConstraint("delta", ["alpha", "gamma"]);
		f.set("alpha", "beta", "gamma", "delta");
		f.clear("alpha");
		return f.getSet();
	}, ["beta", "gamma"]))
	.run();
}, 1);
//# /UNITTESTS
