//# UNITTESTS
/// <reference path="../unittests/suite.ts"/>
//# /UNITTESTS



module kr3m.algorithms
{
	class SparseArraySegment<T>
	{
		public offset:number;
		public elements:T[] = [];



		public clone():SparseArraySegment<T>
		{
			var clone = new SparseArraySegment<T>();
			clone.offset = this.offset;
			clone.elements = this.elements.slice();
			return clone;
		}



		public end():number
		{
			return this.offset + this.elements.length;
		}
	}



	/*
		Datenklasse für extrem große Arrays mit extrem wenigen
		tatsächlich gesetzten Werten. Die meisten Funktionen
		funktioneren genau so wie bei normalen Arrays. Die
		Ausnahmen sind get / set statt [] und getEnd() statt
		length.

		Die tatsächlich belegten Bereiche werden in segments
		gespeichert und jedem Segment ist ein absoluter offset
		innerhalb des SparseArray zugeordnet. Damit alles
		funktioniert müssen folgende Bedingungen immer erfüllt
		sein:
			- die Segmente sind nach offset aufsteigend sortiert
			- Segmente berühren und / oder überlappen sich niemals
			(falls sie es sollten müssen sie zu einem Segment
			zusammengefasst werden)
			- Segmente enthalten mindestens ein Element (sonst
			werden sie entfernt)
	*/
	export class SparseArray<T>
	{
		private segments:SparseArraySegment<T>[] = [];



		constructor(values?:T[])
		{
			if (values)
			{
				var seg = new SparseArraySegment<T>();
				seg.offset = 0;
				seg.elements = values.slice();
				this.segments.push(seg);
			}
		}



		/*
			Gibt die Position des letzten gesetzten Elementes
			(höchster offset) plus eins zurück. Sozusagen die
			Position, an die push() Elemente anfügen würde.
		*/
		public getEnd():number
		{
			if (this.segments.length == 0)
				return 0;

			var seg = this.segments[this.segments.length - 1];
			return seg.offset + seg.elements.length;
		}



		private findIncluding(pos:number, offset:number = 0):number
		{
			for (var i = offset; i < this.segments.length; ++i)
			{
				var seg = this.segments[i];
				if (seg.offset <= pos && seg.end() > pos)
					return i;
			}
			return -1;
		}



		private findInsert(pos:number, offset:number = 0):number
		{
			for (var i = offset; i < this.segments.length; ++i)
			{
				var seg = this.segments[i];
				if (seg.offset >= pos)
					return i;

				if (seg.offset <= pos && seg.end() > pos)
					return i;
			}
			return i;
		}



		public set(pos:number, value:T):void
		{
			for (var i = 0; i < this.segments.length; ++i)
			{
				var seg = this.segments[i];
				if (seg.offset <= pos)
				{
					var end = seg.offset + seg.elements.length;
					if (end > pos)
					{
						seg.elements[pos - seg.offset] = value;
						return;
					}
					else if (end == pos)
					{
						seg.elements.push(value);
						var nextSeg = this.segments[i + 1];
						if (nextSeg && nextSeg.offset == pos + 1)
						{
							seg.elements = seg.elements.concat(nextSeg.elements);
							this.segments.splice(i + 1, 1);
						}
						return;
					}
				}
				else if (seg.offset > pos)
				{
					var seg = new SparseArraySegment<T>();
					seg.offset = pos;
					seg.elements.push(value);
					this.segments.splice(i, 0, seg);
					var nextSeg = this.segments[i + 1];
					if (nextSeg && nextSeg.offset == pos + 1)
					{
						seg.elements = seg.elements.concat(nextSeg.elements);
						this.segments.splice(i + 1, 1);
					}
					return;
				}
			}

			var seg = new SparseArraySegment<T>();
			seg.offset = pos;
			seg.elements.push(value);
			this.segments.push(seg);
		}



		/*
			Schreibt ab Position pos die Werte values in
			das Array hinein. Im Gegensatz zu splice() werden
			bereits existierende Werte dabei überschrieben
			und nicht verschoben.
		*/
		public setSlice(pos:number, values:T[]):void
		{
			var iFrom = this.findInsert(pos);
			if (iFrom >= this.segments.length)
			{
				if (this.segments.length > 0)
				{
					var seg = this.segments[this.segments.length - 1];
					if (seg.end() == pos)
					{
						seg.elements = seg.elements.concat(values);
						return;
					}
				}

				var seg = new SparseArraySegment<T>();
				seg.offset = pos;
				seg.elements = values.slice();
				this.segments.push(seg);
				return;
			}

			var seg = this.segments[iFrom];
			if (pos < seg.offset)
			{
				seg = new SparseArraySegment<T>();
				seg.offset = pos;
				seg.elements = values.slice();
				this.segments.splice(iFrom, 0, seg);
			}
			else
			{
				seg.elements = seg.elements.slice(0, pos - seg.offset).concat(values);
			}

			var iTo = iFrom + 1;
			while (iTo < this.segments.length)
			{
				var nextSeg = this.segments[iTo];
				if (seg.end() < nextSeg.offset)
					break;

				seg.elements = seg.elements.concat(nextSeg.elements.slice(seg.end() - nextSeg.offset));
				this.segments.splice(iTo, 1);
			}
		}



		public get(pos:number):T
		{
			var i = this.findIncluding(pos);
			if (i < 0)
				return undefined;

			var seg = this.segments[i];
			return seg.elements[pos - seg.offset];
		}



		public push(...values:T[]):void
		{
			if (this.segments.length > 0)
			{
				var seg = this.segments[this.segments.length - 1];
				seg.elements = seg.elements.concat(values);
				return;
			}

			var seg = new SparseArraySegment<T>();
			seg.offset = 0;
			seg.elements = values.slice();
			this.segments.push(seg);
		}



		public pop():T
		{
			if (this.segments.length == 0)
				return undefined;

			var seg = this.segments[this.segments.length - 1];
			var result = seg.elements.pop();
			if (seg.elements.length == 0)
				this.segments.pop();

			return result;
		}



		public unshift(...values:T[]):void
		{
			var l = Math.floor(values.length / 2);
			for (var i = 0; i < l; ++i)
				[values[i], values[values.length - i - 1]] = [values[values.length - i - 1], values[i]];

			for (var i = 0; i < this.segments.length; ++i)
				this.segments[i].offset += values.length;

			if (this.segments.length > 0 && this.segments[0].offset == values.length)
			{
				var seg = this.segments[0];
				seg.offset = 0;
				seg.elements = values.concat(seg.elements);
			}
			else
			{
				var seg = new SparseArraySegment<T>();
				seg.offset = 0;
				seg.elements = values.slice();
				this.segments.unshift(seg);
			}
		}



		public shift():T
		{
			if (this.segments.length == 0)
				return undefined;

			for (var i = 0; i < this.segments.length; ++i)
				--this.segments[i].offset;

			var seg = this.segments[0];
			if (seg.offset >= 0)
				return undefined;

			seg.offset = 0;
			var result = seg.elements.shift();

			if (seg.elements.length == 0)
				this.segments.splice(0, 1);

			return result;
		}



		public concat(...others:(SparseArray<T>|T[])[]):SparseArray<T>
		{
			others = others.slice();
			others.unshift(this);

			var result = new SparseArray<T>();
			var totalOffset = 0;
			for (var i = 0; i < others.length; ++i)
			{
				var other = (others[i] instanceof SparseArray) ? <SparseArray<T>> others[i] : new SparseArray<T>(<T[]> others[i]);
				for (var j = 0; j < other.segments.length; ++j)
				{
					var otherSeg = other.segments[j];
					var seg = new SparseArraySegment<T>();
					seg.offset = totalOffset + otherSeg.offset;
					seg.elements = otherSeg.elements.slice();
					result.segments.push(seg);
				}
				if (seg)
					totalOffset = seg.end();
			}
			for (var i = 1; i < result.segments.length; ++i)
			{
				var leftSeg = result.segments[i - 1];
				var rightSeg = result.segments[i];
				if (leftSeg.end() == rightSeg.offset)
				{
					leftSeg.elements = leftSeg.elements.concat(rightSeg.elements);
					result.segments.splice(i--, 1);
				}
			}
			return result;
		}



		private getFromTo(fromPos:number, toPos:number):[number, number]
		{
			var length = this.getEnd();

			if (fromPos === undefined)
				fromPos = 0;
			else if (fromPos < 0)
				fromPos = Math.max(fromPos + length);

			if (toPos === undefined)
				toPos = length;
			else if (toPos < 0)
				toPos = Math.max(toPos + length);

			return [fromPos, toPos];
		}



		/*
			Gibt zurück, ob zwischen fromPos und toPos alle
			Position besetzt sind (true) oder nicht (false).
			fromPos und toPos funktionieren genau so wie bei
			slice und ähnlichen Funktionen.
		*/
		public isPopuplated(fromPos?:number, toPos?:number):boolean
		{
			[fromPos, toPos] = this.getFromTo(fromPos, toPos);

			if (fromPos == toPos)
				return true;

			var i = this.findIncluding(fromPos);
			if (i < 0)
				return false;

			var seg = this.segments[i];
			var end = seg.offset + seg.elements.length;
			return end >= toPos;
		}



		public slice(fromPos?:number, toPos?:number):SparseArray<T>
		{
			[fromPos, toPos] = this.getFromTo(fromPos, toPos);

			var result = new SparseArray<T>();

			if (fromPos == toPos)
				return result;

			var iFrom = this.findInsert(fromPos);
			if (iFrom >= this.segments.length)
				return result;

			var iTo = this.findInsert(toPos, iFrom);

			if (iFrom == iTo)
			{
				var seg = this.segments[iFrom];

				var newSeg = new SparseArraySegment<T>();
				newSeg.offset = 0;
				newSeg.elements = seg.elements.slice(fromPos - seg.offset, toPos - seg.offset);
				result.segments.push(newSeg);
				return result;
			}

			for (var i = iFrom; i < iTo; ++i)
			{
				var seg = this.segments[i];
				var newSeg = new SparseArraySegment<T>();
				newSeg.offset = seg.offset - fromPos;
				newSeg.elements = seg.elements.slice(fromPos - seg.offset, toPos - seg.offset);
				result.segments.push(newSeg);
			}
			return result;
		}



		public toArray():T[]
		{
			var result:T[] = [];
			for (var i = 0; i < this.segments.length; ++i)
			{
				var seg = this.segments[i];
				while (result.length < seg.offset)
					result.push(undefined);
				for (var j = 0; j < seg.elements.length; ++j)
					result.push(seg.elements[j]);
			}
			return result;
		}
	}
}



//# UNITTESTS
setTimeout(() =>
{
	new kr3m.unittests.Suite("kr3m.algorithms.SparseArray")
	.add(new kr3m.unittests.CaseSync("constructor I", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		return sa.toArray();
	}, []))
	.add(new kr3m.unittests.CaseSync("constructor II", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>([0, 1, 2, 3, 4, 5, 6]);
		return sa.toArray();
	}, [0, 1, 2, 3, 4, 5, 6]))
	.add(new kr3m.unittests.CaseSync("set I", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.set(0, 1);
		return sa.toArray();
	}, [1]))
	.add(new kr3m.unittests.CaseSync("set II", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.set(1, 1);
		return sa.toArray();
	}, [undefined, 1]))
	.add(new kr3m.unittests.CaseSync("set III", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.set(3, 3);
		sa.set(4, 4);
		sa.set(2, 2);
		return sa.toArray();
	}, [undefined, undefined, 2, 3, 4]))
	.add(new kr3m.unittests.CaseSync("push I", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.push(1);
		sa.push(2, 3);
		sa.push(4, 5, 6);
		return sa.toArray();
	}, [1, 2, 3, 4, 5, 6]))
	.add(new kr3m.unittests.CaseSync("push II", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.set(4, 4);
		sa.push(5, 6);
		return sa.toArray();
	}, [undefined, undefined, undefined, undefined, 4, 5, 6]))
	.add(new kr3m.unittests.CaseSync("isPopuplated I", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.push(0, 1, 2, 3, 4, 5, 6);
		return sa.isPopuplated();
	}, true))
	.add(new kr3m.unittests.CaseSync("isPopuplated II", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.push(0, 1, 2, 3, 4, 5, 6);
		return sa.isPopuplated(2, 5);
	}, true))
	.add(new kr3m.unittests.CaseSync("isPopuplated III", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.push(0, 1, 2, 3, 4, 5, 6);
		return sa.isPopuplated(5, 9);
	}, false))
	.add(new kr3m.unittests.CaseSync("isPopuplated IV", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.set(1, 1);
		sa.set(4, 4);
		return sa.isPopuplated();
	}, false))
	.add(new kr3m.unittests.CaseSync("slice I", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.push(0, 1, 2, 3, 4, 5, 6);
		return sa.slice().toArray();
	}, [0, 1, 2, 3, 4, 5, 6]))
	.add(new kr3m.unittests.CaseSync("slice II", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.push(0, 1, 2, 3, 4, 5, 6);
		return sa.slice(2).toArray();
	}, [2, 3, 4, 5, 6]))
	.add(new kr3m.unittests.CaseSync("slice III", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.push(0, 1, 2, 3, 4, 5, 6);
		return sa.slice(2, 4).toArray();
	}, [2, 3]))
	.add(new kr3m.unittests.CaseSync("slice IV", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.push(0, 1, 2, 3, 4, 5, 6);
		return sa.slice(-2).toArray();
	}, [5, 6]))
	.add(new kr3m.unittests.CaseSync("slice V", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.push(0, 1, 2, 3, 4, 5, 6);
		return sa.slice(-3, -1).toArray();
	}, [4, 5]))
	.add(new kr3m.unittests.CaseSync("slice VI", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.push(0, 1, 2, 3);
		sa.set(8, 8);
		sa.set(9, 9);
		sa.set(10, 10);
		sa.set(12, 12);
		return sa.slice().toArray();
	}, [0, 1, 2, 3, undefined, undefined, undefined, undefined, 8, 9, 10, undefined, 12]))
	.add(new kr3m.unittests.CaseSync("slice VII", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.push(0, 1, 2, 3);
		sa.set(8, 8);
		sa.set(9, 9);
		sa.set(10, 10);
		sa.set(12, 12);
		return sa.slice(2, 5).toArray();
	}, [2, 3]))
	.add(new kr3m.unittests.CaseSync("slice VIII", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.push(0, 1, 2, 3);
		sa.set(8, 8);
		sa.set(9, 9);
		sa.set(10, 10);
		sa.set(12, 12);
		return sa.slice(1, -1).toArray();
	}, [1, 2, 3, undefined, undefined, undefined, undefined, 8, 9, 10]))
	.add(new kr3m.unittests.CaseSync("setSlice I", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.setSlice(2, [2, 3]);
		return sa.toArray();
	}, [undefined, undefined, 2, 3]))
	.add(new kr3m.unittests.CaseSync("setSlice II", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.setSlice(2, [2, 3]);
		sa.setSlice(7, [7, 8, 9]);
		sa.setSlice(4, [4, 5, 6, 7, 8]);
		return sa.toArray();
	}, [undefined, undefined, 2, 3, 4, 5, 6, 7, 8, 9]))
	.add(new kr3m.unittests.CaseSync("shift I", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.push(1, 2, 3, 4, 5, 6);
		sa.shift();
		sa.shift();
		return sa.shift();
	}, 3))
	.add(new kr3m.unittests.CaseSync("shift II", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.setSlice(2, [2, 3]);
		return sa.shift();
	}, undefined))
	.add(new kr3m.unittests.CaseSync("shift III", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.setSlice(2, [2, 3]);
		sa.shift();
		sa.shift();
		return sa.shift();
	}, 2))
	.add(new kr3m.unittests.CaseSync("unshift I", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.unshift();
		sa.unshift();
		sa.unshift();
		return sa.toArray();
	}, []))
	.add(new kr3m.unittests.CaseSync("unshift II", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.unshift(5, 4, 3);
		sa.unshift(2);
		sa.unshift(1, 0);
		return sa.toArray();
	}, [0, 1, 2, 3, 4, 5]))
	.add(new kr3m.unittests.CaseSync("unshift III", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.setSlice(3, [5, 6]);
		sa.unshift(1, 0);
		return sa.toArray();
	}, [0, 1, undefined, undefined, undefined, 5, 6]))
	.add(new kr3m.unittests.CaseSync("unshift IV", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>();
		sa.setSlice(0, [2, 3]);
		sa.unshift(1, 0);
		return sa.toArray();
	}, [0, 1, 2, 3]))
	.add(new kr3m.unittests.CaseSync("concat I", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>([0, 1, 2]);
		sa = sa.concat(new kr3m.algorithms.SparseArray<number>([3, 4, 5]), new kr3m.algorithms.SparseArray<number>([6, 7]));
		sa = sa.concat(new kr3m.algorithms.SparseArray<number>([]), new kr3m.algorithms.SparseArray<number>([8]));
		return sa.toArray();
	}, [0, 1, 2, 3, 4, 5, 6, 7, 8]))
	.add(new kr3m.unittests.CaseSync("concat I", () =>
	{
		var sa = new kr3m.algorithms.SparseArray<number>([0, 1, 2]);
		sa = sa.concat([3, 4, 5], [6, 7]);
		sa = sa.concat([], [8]);
		return sa.toArray();
	}, [0, 1, 2, 3, 4, 5, 6, 7, 8]))
	.run();
}, 1);
//# /UNITTESTS
