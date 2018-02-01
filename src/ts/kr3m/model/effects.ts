/// <reference path="../util/util.ts"/>



module kr3m.model
{
	//# TODO: optionale subId hinzufügen
	//# TODO: optionale groupId hinzufügen
	export type Effect = {id:string, value:number};



	export class Effects
	{
		private effects:{[id:string]:Effect[]} = {};



		public add(effect:Effect):void
		{
			if (!this.effects[effect.id])
				this.effects[effect.id] = [];
			this.effects[effect.id].push(kr3m.util.Util.clone(effect));
		}



		public clear():void
		{
			this.effects = {};
		}



		public set(effects:Effect[]):void
		{
			this.clear();
			for (var i = 0; i < effects.length; ++i)
				this.add(effects[i]);
		}



		public remove(effect:Effect):void
		{
			if (!this.effects[effect.id])
				return;

			for (var i = 0; i < this.effects[effect.id].length; ++i)
			{
				if (kr3m.util.Util.equal(effect, this.effects[effect.id][i]))
				{
					this.effects[effect.id].splice(i--, 1);
					return;
				}
			}
		}



		public getSum(id:string):number
		{
			var sum = 0;
			var effects = this.effects[id] || [];
			for (var i = 0; i < effects.length; ++i)
				sum += effects[i].value;
			return sum;
		}



		public getHighest(id:string):number
		{
			var effects = this.effects[id] || [];
			if (effects.length == 0)
				return 0;

			var highest = effects[0].value;
			for (var i = 1; i < effects.length; ++i)
			{
				if (effects[i].value > highest)
					highest = effects[i].value;
			}
			return highest;
		}
	}
}
