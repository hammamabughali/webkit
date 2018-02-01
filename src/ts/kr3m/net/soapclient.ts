/// <reference path="../lib/soap.ts"/>
/// <reference path="../util/log.ts"/>



module kr3m.net
{
	/*
		Client für SOAP-Aufrufe.

		https://github.com/vpulim/node-soap

		TODO: schönere Methode finden als client einfach
		public nach außen frei zu geben
	*/
	export class SoapClient
	{
		public client:any;



		constructor(
			wsdlUrl:string,
			callback?:(err:any, client:any) => void,
			location?:string)
		{
			soapLib.createClient(wsdlUrl, {}, (err:any, client:any) =>
			{
				if (err)
					logError(err);
				this.client = client;
				callback && callback(err, client);
			}, location);
		}
	}
}
