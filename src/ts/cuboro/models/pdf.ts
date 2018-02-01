/// <reference path="../../kr3m/util/pdf.ts"/>
/// <reference path="../../kr3m/util/rand.ts"/>



module cuboro.models
{
	export class Pdf
	{
		private dateFormat():string
		{
			var d = new Date();
			var dFormate = d.getFullYear() + ""
				+ (d.getMonth() + 1) + ""
				+ d.getDate() + ""
				+ d.getHours() + ""
				+ d.getMinutes() + ""
				+ d.getSeconds();
			return dFormate;
		}



		public generateUniqueRandomName(
			prefixName:string,
			callback: ResultCB<string>):void
		{
			var name = prefixName + this.dateFormat() + kr3m.util.Rand.getInt(1, 999);
			callback(name, kr3m.SUCCESS);
		}



		public generatePdf(
			context: kr3m.net2.Context,
			bodyTemplatePath: string,
			outputPath: string,
			tokens: any,
			callback: SuccessCallback): void
		{
			context.getSyncParseFunc((locParse) =>
			{
				var options =
				{
					locParse : locParse,
					tokens : tokens
				};

				var pdf = new kr3m.util.Pdf(options);
				pdf.setHeaderFromFile("public/templates/pdf/header.html");
				pdf.setBodyFromFile(bodyTemplatePath);
				pdf.setFooterFromFile("public/templates/pdf/footer.html");
				pdf.save(outputPath, callback);
			});
		}
	}
}



var mPdf = new cuboro.models.Pdf();
