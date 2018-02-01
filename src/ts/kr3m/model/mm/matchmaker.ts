/// <reference path="../../algorithms/search/bisect.ts"/>
/// <reference path="../../model/mm/mm.ts"/>
/// <reference path="../../model/mm/party.ts"/>
/// <reference path="../../model/mm/stack.ts"/>



module kr3m.model.mm
{
	export class MatchMaker<Player>
	{
		private threshold = 1;
		private matchFunc:MatchingFunction<Player>;
		private tickets:number[] = [];
		private parties:{[ticket:number]:Party<Player>} = {};
		private timer:any;

		public decayTime = 60000;

		private foundListeners:Array<(players:Player[]) => void> = [];
		private droppedListeners:Array<(players:Player[]) => void> = [];



		constructor(matchFunc:MatchingFunction<Player>)
		{
			this.matchFunc = matchFunc;
		}



		private step():void
		{
			if (this.timer)
			{
				clearTimeout(this.timer);
				this.timer = null;
			}
			if (this.tickets.length < 2)
				return;

			var stepCount = 0;
			var pending = 1e9;
			var now = Date.now();

			var stack = new Stack(this.tickets.length);
			while (stack.notEmpty())
			{
				++stepCount;

				var players:Player[] = [];
				for (var i = 0; i < stack.values.length; ++i)
					players = players.concat(this.parties[this.tickets[stack.values[i]]].players);

				var match = this.matchFunc(players);
				if (match.complete)
				{
					var joined = this.parties[this.tickets[stack.values[0]]].joined;
					var waited = now - joined;
					var threshold = 1 - waited / this.decayTime;
					if (match.score >= threshold)
					{
						this.foundPlayers(players);
						for (var j = stack.values.length - 1; j >= 0; --j)
						{
							delete this.parties[this.tickets[stack.values[j]]];
							this.tickets.splice(stack.values[j], 1);
						}
						stack.reset(this.tickets.length);
						if (stack.values[0] >= this.tickets.length)
							break;
					}
					else
					{
						var rest = (threshold - match.score) * this.decayTime;
						pending = Math.min(pending, rest);
					}
				}
				stack.step(!match.invalid && !match.full);
			}
			logProfilingLow("stepCount", stepCount);
			if (pending != 1e9)
				this.timer = setTimeout(() => this.step(), pending);
		}



		public join(players:Player[]):number
		{
			if (players.length == 0)
				return 0;

			var match = this.matchFunc(players);
			if (match.invalid)
			{
				this.dropPlayers(players);
				return 0;
			}

			if (match.complete)
			{
				this.foundPlayers(players);
				return 0;
			}

			var party = new Party(players);
			this.tickets.push(party.ticket);
			this.parties[party.ticket] = party;
			this.step();
			return party.ticket;
		}



		public leave(ticket:number):void
		{
			if (!this.parties[ticket])
				return;

			var i = kr3m.algorithms.search.bisect(this.tickets, ticket, (a:number, b:number) => a - b);
			if (i >= 0)
			{
				this.dropPlayers(this.parties[ticket].players);
				delete this.parties[ticket];
				this.tickets.splice(i, 1);
			}
		}



		public getQueueLength():number
		{
			return this.tickets.length;
		}



		public getPosition(ticket:number):number
		{
			var i = kr3m.algorithms.search.bisect(this.tickets, ticket, (a:number, b:number) => a - b);
			return (i < 0) ? this.tickets.length : i;
		}



		private foundPlayers(players:Player[]):void
		{
			for (var i = 0; i < this.foundListeners.length; ++i)
				this.foundListeners[i](players);
		}



		private dropPlayers(players:Player[]):void
		{
			for (var i = 0; i < this.droppedListeners.length; ++i)
				this.droppedListeners[i](players);
		}



		public onFound(listener:(players:Player[]) => void):void
		{
			this.foundListeners.push(listener);
		}



		public onDropped(listener:(players:Player[]) => void):void
		{
			this.droppedListeners.push(listener);
		}
	}
}
