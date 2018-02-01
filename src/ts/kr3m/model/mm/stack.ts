module kr3m.model.mm
{
	export class Stack
	{
		public values:number[];
		private max:number;



		constructor(max:number)
		{
			this.values = [0];
			this.max = max;
		}



		public reset(max:number):void
		{
			this.max = max;
			while (this.values.length > 1)
				this.values.pop();
		}



		public step(addMore:boolean):void
		{
			var last = this.values[this.values.length - 1];
			if (addMore && last < this.max - 1)
			{
				this.values.push(last + 1);
				return;
			}

			while (this.values.length > 0)
			{
				last = this.values.pop();
				if (last < this.max - 1)
				{
					this.values.push(last + 1);
					return;
				}
			}
		}



		public notEmpty():boolean
		{
			return this.values.length > 0;
		}
	}
}
