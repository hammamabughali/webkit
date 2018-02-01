/// <reference path="../../cuboro/stubs/pdf.ts"/>
/// <reference path="../../kr3m/model/eventdispatcher.ts"/>



module cuboro.clientmodels
{
	export class Pdf extends kr3m.model.EventDispatcher
	{
		constructor()
		{
			super();
		}


		public printPdf(trackId: number, screenshot: string)
		{
			//open("https://cuboro.das-onlinespiel.de/pdf/bahn.pdf", '_blank');
			sPdf.printPdf(
				trackId,
				screenshot,
				(url) =>
			{
				console.log(" URL ", url);
				//open("https://cuboro.das-onlinespiel.de/pdf/bahn.pdf", '_blank');
				open( url,'_blank');
			});
		}
	}
}



var mPdf = new cuboro.clientmodels.Pdf();
