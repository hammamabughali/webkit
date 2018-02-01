module kr3m.model.mm
{
	export class Party<Player>
	{
		private static freeTicket = 0;

		public players:Player[];
		public ticket:number;
		public joined:number;



		constructor(players:Player[])
		{
			this.ticket = ++Party.freeTicket;
			this.joined = Date.now();
			this.players = players;
		}
	}
}
