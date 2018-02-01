/// <reference path="../model/eventdispatcher.ts"/>



module kr3m.model
{
	/*
		Klasse zum Abbilden von Zustandsautomaten, z.B.
		um komplexere Abläufe in Brettspielen oder
		dergleichen darzustellen.
	*/
	export class StateMachine extends EventDispatcher
	{
		private currentState:string = "START";
		private transitions:{[fromState:string]:{[action:string]:{toState:string, event:string}}} = {};



		public addTransition(
			fromState:string,
			action:string,
			toState:string,
			event:string = null):void
		{
			if (!this.transitions[fromState])
				this.transitions[fromState] = {};

			this.transitions[fromState][action] = {toState : toState, event : event};
		}



		public setState(state:string):void
		{
			this.currentState = state;
		}



		public getState():string
		{
			return this.currentState;
		}



		public doAction(action:string):string
		{
			var transition = this.transitions[this.currentState];
			if (!transition)
			{
				transition = this.transitions["*"];
				if (!transition)
					return this.currentState;
			}

			var result = transition[action];
			if (!result)
				return this.currentState;

			this.dispatch("exit", this.currentState);
			this.currentState = result.toState;
			this.dispatch("enter", result.toState);
			if (result.event)
				this.dispatch("event", result.event);

			return this.currentState;
		}
	}
}
