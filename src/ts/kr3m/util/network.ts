/// <reference path="../model/eventdispatcher.ts"/>



module kr3m.util
{
	export class Network extends kr3m.model.EventDispatcher
	{
		private connection:any;



		constructor()
		{
			super();

			this.connection = navigator["connection"] || navigator["mozConnection"] || navigator["webkitConnection"];
			if (this.connection)
				this.connection.addEventListener("typechange", () => this.dispatch("typechange"));

			window.addEventListener("online", () => this.dispatch("online"));
			window.addEventListener("offline",() => this.dispatch("offline"));
		}



		public getType():string
		{
			return this.connection ? this.connection.type : "unknown";
		}



		public isOnline():boolean
		{
			return navigator.onLine;
		}
	}
}
