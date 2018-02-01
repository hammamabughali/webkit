/// <reference path="../../cuboro/context.ts"/>
/// <reference path="../../cuboro/tables/localizationstable.ts"/>
/// <reference path="../../cuboro/vo/competition.ts"/>



module cuboro.models
{
	class LocaMeta
	{
		public itemType:string;
		public idField:string;
		public fields:string[];
		public tableName:string;
	}



	export class Localization
	{
		private getItemMeta(items:cuboro.vo.Competition[]):LocaMeta
		{
			if (!items || items.length == 0)
				return undefined;

			if (items[0] instanceof cuboro.vo.Competition)
			{
				var meta =
				{
					itemType : "competition",
					idField : "id",
					fields : ["title", "description", "prize"],
					tableName : "competitions"
				};
				return meta;
			}
			// add any other localizable items here
			return undefined;
		}



		public locItems(
			context:cuboro.Context,
			items:cuboro.vo.Competition[],
			callback:Callback):void
		{
			var meta = this.getItemMeta(items);
			if (!meta)
				return callback();

			context.localization.getLoadOrder(context, (locales) =>
			{
				var itemIds = items.map(item => item[meta.idField]);
				var where = db.where(
				{
					locale : locales,
					itemType : meta.itemType,
					itemId : itemIds
				});
				tLocalizations.get(where, (localizations) =>
				{
					var itemTexts = <any> kr3m.util.Util.bucketByRecursive(localizations, "itemId", "locale");
					for (var itemId in itemTexts)
					{
						for (var locale in itemTexts[itemId])
							itemTexts[itemId][locale] = kr3m.util.Util.arrayToPairs(itemTexts[itemId][locale], "field", "text");
					}
					for (var i = 0; i < items.length; ++i)
					{
						if (!itemTexts[items[i][meta.idField]])
							continue;

						var texts:{[id:string]:string} = {};
						for (var j = 0; j < locales.length; ++j)
							texts = kr3m.util.Util.mergeAssoc(texts, itemTexts[items[i][meta.idField]][locales[j]]);

						for (var id in texts)
							items[i][id] = texts[id];
					}
					callback();
				}, () => callback());
			});
		}
	}
}



var mLoca = new cuboro.models.Localization();
