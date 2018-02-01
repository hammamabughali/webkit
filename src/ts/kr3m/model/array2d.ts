module kr3m.model
{
	export class Array2d<T>
	{
		private raw:T[][] = [];



		constructor(
			private fillValue?:T,
			width:number = 0,
			height:number = 0)
		{
			for (var y = 0; y < height; ++y)
			{
				this.raw.push([]);
				for (var x = 0; x < width; ++x)
					this.raw[y].push(fillValue);
			}
		}



		public getWidth():number
		{
			var width = 0;
			for (var i = 0; i < this.raw.length; ++i)
				width = Math.max(width, this.raw[i].length);
			return width;
		}



		public getHeight():number
		{
			return this.raw.length;
		}



		public forEach(func:(value:T, x:number, y:number) => void):void
		{
			for (var y = 0; y < this.raw.length; ++y)
			{
				for (var x = 0; x < this.raw[y].length; ++x)
					func(this.raw[y][x] !== undefined ? this.raw[y][x] : this.fillValue, x, y);
			}
		}



		public map<N>(mapFunc:(value:T) => N):Array2d<N>
		{
			var newFillValue = this.fillValue === undefined ? undefined : mapFunc(this.fillValue);
			var result = new Array2d<N>(newFillValue);
			for (var y = 0; y < this.raw.length; ++y)
			{
				result.raw.push([]);
				for (var x = 0; x < this.raw[y].length; ++x)
					result.raw[y].push(mapFunc(this.raw[y][x]));
			}
			return result;
		}



		public reduceRow<N>(
			row:number,
			reduceFunc:(accum:N, current:T, col:number) => N,
			initialValue?:N):N
		{
			if (row < 0 || row >= this.raw.length)
				return undefined;

			var accum = initialValue;
			for (var x = (accum === undefined ? 1 : 0); x < this.raw[row].length; ++x)
				accum = reduceFunc(accum, this.raw[row][x], x);
			return accum;
		}



		public reduceCol<N>(
			col:number,
			reduceFunc:(accum:N, current:T, row:number) => N,
			initialValue?:N):N
		{
			var accum = initialValue;
			for (var y = (accum === undefined ? 1 : 0); y < this.raw.length; ++y)
			{
				var value = this.raw[y][col] !== undefined ? this.raw[y][col] : this.fillValue;
				accum = reduceFunc(accum, value, y);
			}
			return accum;
		}



		public getRaw():T[][]
		{
			if (this.fillValue !== undefined)
			{
				var maxLength = 0;
				for (var i = 0; i < this.raw.length; ++i)
					maxLength = Math.max(maxLength, this.raw[i].length);

				for (var i = 0; i < this.raw.length; ++i)
				{
					while (this.raw[i].length < maxLength)
						this.raw[i].push(this.fillValue);
				}
			}
			return this.raw;
		}



		public set(x:number, y:number, value:T):void
		{
			while (this.raw.length <= y)
				this.raw.push([]);
			while (this.raw[y].length <= x)
				this.raw[y].push(this.fillValue);
			this.raw[y][x] = value;
		}



		public get(x:number, y:number):T
		{
			if (y >= this.raw.length)
				return this.fillValue;

			if (x >= this.raw[y].length)
				return this.fillValue;

			return this.raw[y][x];
		}



		public getCol(x:number):T[]
		{
			var col:T[] = [];
			for (var y = 0; y < this.raw.length; ++y)
				col.push(this.get(x, y));
			return col;
		}



		public setCol(x:number, values:T[]):void
		{
			for (var y = 0; y < values.length; ++y)
				this.set(x, y, values[y]);
		}



		public getRow(y:number):T[]
		{
			var row:T[] = [];
			var w = this.getWidth();
			for (var x = 0; x < w; ++x)
				row.push(this.get(x, y));
			return row;
		}



		public setRow(y:number, values:T[]):void
		{
			for (var x = 0; x < values.length; ++x)
				this.set(x, y, values[x]);
		}
	}
}
