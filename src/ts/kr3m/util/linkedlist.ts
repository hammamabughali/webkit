//# EXPERIMENTAL
module kr3m.util
{
	/*
		A simple linked list implementation. Faster than
		an array when many items have to be added at the
		end and removed at the start.
	*/
	export class LinkedList<T>
	{
		private head:{item:T, next?:any};
		private tail:{item:T, next?:any};
		private length = 0;



		public getLength():number
		{
			return this.length;
		}



		public isEmpty():boolean
		{
			return !this.length;
		}



		public getHead():T
		{
			return this.head ? this.head.item : undefined;
		}



		public getTail():T
		{
			return this.tail ? this.tail.item : undefined;
		}



		public push(...items:T[]):void
		{
			var start = 0;
			if (!this.head)
			{
				this.tail = this.head = {item : items[0]};
				start = 1;
			}

			for (var i = start; i < items.length; ++i)
			{
				this.tail.next = {item : items[i]};
				this.tail = this.tail.next;
			}

			this.length += items.length;
		}



		public unshift(...items:T[]):void
		{
			var end = items.length - 1;
			if (!this.head)
			{
				this.tail = this.head = {item : items[end]};
				--end;
			}

			for (var i = end; i >= 0; --i)
				this.head = {item : items[i], next : this.head};

			this.length += items.length;
		}



		public shift():T
		{
			if (!this.head)
				return undefined;

			var oldHead = this.head;
			this.head = this.head.next;
			--this.length;
			return oldHead.item;
		}
	}
}
//# /EXPERIMENTAL
