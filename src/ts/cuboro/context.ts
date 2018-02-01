/// <reference path="../cuboro/tables/regiondomainstable.ts"/>
/// <reference path="../cuboro/tables/regionvariantstable.ts"/>
/// <reference path="../kr3m/net2/context.ts"/>
/// <reference path="../kr3m/types.ts"/>



module cuboro
{
	export interface ContextOptions extends kr3m.net2.ContextOptions
	{
		region?:boolean;
	}



	export class Context extends kr3m.net2.Context
	{
		public region:cuboro.tables.RegionVariantVO;



		public need(
			options:ContextOptions,
			callback:Callback,
			errorCallback?:(missingFieldId:string) => void):void
		{
			this.checkRegionVariant(options, () =>
			{
				super.need(options, callback, errorCallback);
			}, errorCallback);
		}



		protected checkRegionVariant(
			options:ContextOptions,
			callback:Callback,
			errorCallback?:(missingFieldId:string) => void):void
		{
			if (!options.region)
				return callback();

			if (this.region)
				return callback();

			var domainName = this.request.getHost() || this.request.getOrigin() || this.request.getReferer();
			tRegionDomains.getByName(domainName, (domain) =>
			{
				var regionId = domain ? domain.regionId : "MAIN";
				tRegionVariants.getById(regionId, (region) =>
				{
					if (!region)
						return errorCallback && errorCallback("region");

					this.region = region;
					return callback();
				});
			});
		}
	}
}
