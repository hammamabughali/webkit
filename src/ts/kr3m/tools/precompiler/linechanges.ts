module kr3m.tools.precompiler
{
	export class LineChanges
	{
		private changes:[number, number][] = [];



		public remove(offset:number, count:number):void
		{
			this.changes.push([offset, count]);
		}



		public adjustLine(line:number):number
		{
			for (var i = 0; i < this.changes.length; ++i)
			{
				if (line >= this.changes[i][0])
					line += this.changes[i][1];
			}
			return line;
		}
	}
}
