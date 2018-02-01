/// <reference path="../../cuboro/stubs/abstract.ts"/>
/// <reference path="../../cuboro/vo/track.ts"/>



module cuboro.stubs
{
	export class Pdf extends Abstract
	{
		constructor()
		{
			super();

			this.htmlEscapeStrings = false;
		}



		public printPdf(
			trackId: number,
			screenshot:string,
			callback:(url:string) => void):void
		{
			var params = {trackId:trackId, screenshot:screenshot};
			this.callService("Pdf.printPdf", params, callback);
		}
	}
}



var sPdf = new cuboro.stubs.Pdf();
