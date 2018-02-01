module kr3m.tools.precompiler
{
	export class ParserLine
	{
		public start:number;
		public end:number;
		public content:string;
		public line:number;
	}



	export class Parser
	{
		private lines:kr3m.tools.precompiler.ParserLine[] = [];



		constructor(source:string)
		{
			var len = source.length;
			var lineCount = 1;
			for (var i = 0; i < len; ++i)
			{
				if (source.charAt(i) == "\n")
				{
					++lineCount;
					continue;
				}

				if (source.charAt(i) == "/" && source.charAt(i + 1) == "/" && source.charAt(i + 2) == "#")
				{
					var line = new kr3m.tools.precompiler.ParserLine();
					line.start = i;
					line.line = lineCount;

					while (source.charAt(i) && source.charAt(i) != "\n")
						++i;

					line.end = i + 1;
					line.content = source.slice(line.start + 3, line.end).trim();
					this.lines.push(line);

					++lineCount;
				}
			}
		}



		public getLines():kr3m.tools.precompiler.ParserLine[]
		{
			return this.lines;
		}
	}
}
