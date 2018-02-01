/// <reference path="../util/json.ts"/>
/// <reference path="../util/rand.ts"/>



//# EXPERIMENTAL
module kr3m.model
{
	interface Item
	{
		name:string;
		rarity:number;
		minCount:number;
		maxCount:number;
	}



	interface Table
	{
		rollEach:boolean;
		items:Item[];
	}



	interface Rolls
	{
		tableId:string;
		rarity:number;
		minCount:number;
		maxCount:number;
	}



	interface Container
	{
		rolls:Rolls[];
	}



	export type Drops = {[name:string]:number};



	export class Loot
	{
		private tables:{[id:string]:Table} = {};
		private containers:{[id:string]:Container} = {};



		public createTable(tableId:string, rollEach:boolean = true):void
		{
			this.tables[tableId] = {rollEach : rollEach, items : []};
		}



		public addItem(
			tableId:string,
			name:string,
			rarity:number,
			minCount:number = 1,
			maxCount:number = 1):void
		{
			this.tables[tableId].items.push({name : name, rarity : rarity, minCount : minCount, maxCount : maxCount});
		}



		public createContainer(containerId:string):void
		{
			this.containers[containerId] = {rolls : []};
		}



		public addRolls(
			containerId:string,
			tableId:string,
			rarity:number = 1,
			minCount:number = 1,
			maxCount:number = 1):void
		{
			this.containers[containerId].rolls.push({tableId : tableId, rarity : rarity, minCount : minCount, maxCount : maxCount});
		}



		public rollRarity(
			rarity:number,
			bias:number = 0):boolean
		{
			return kr3m.util.Rand.getInt(0, rarity) <= bias;
		}



		public getDrops(
			containerId:string,
			callback:CB<Drops>,
			bias:number = 0):void
		{
			var drops:Drops = {};
			var container = this.containers[containerId];
			for (var i = 0; i < container.rolls.length; ++i)
			{
				var roll = container.rolls[i];
				if (this.rollRarity(roll.rarity))
				{
					var table = this.tables[roll.tableId];
					var count = kr3m.util.Rand.getInt(roll.minCount, roll.maxCount + 1);
					for (var j = 0; j < count; ++j)
					{
						//# TODO: Itembearbeitung auf Burst umstellen für große Tabellen
						if (table.rollEach)
						{
							for (var k = 0; k < table.items.length; ++k)
							{
								var item = table.items[k];
								if (this.rollRarity(item.rarity, bias))
									drops[item.name] = (drops[item.name] || 0) + kr3m.util.Rand.getInt(item.minCount, item.maxCount + 1);
							}
						}
						else
						{
							var weights = table.items.map((item) => 1 / item.rarity);
							var item = kr3m.util.Rand.getElementWeighted(table.items, weights);
							drops[item.name] = (drops[item.name] || 0) + kr3m.util.Rand.getInt(item.minCount, item.maxCount + 1);
						}
					}
				}
			}
			callback(drops);
		}



		public toJson():string
		{
			return kr3m.util.Json.encode({tables : this.tables, containers : this.containers});
		}



		public static fromJson(json:string):Loot
		{
			var loot = new Loot();
			var decoded = kr3m.util.Json.decode(json);
			loot.tables = decoded.tables;
			loot.containers = decoded.containers;
			return loot;
		}
	}
}
//# /EXPERIMENTAL
