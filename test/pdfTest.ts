/// <reference path="../src/ts/kr3m/lib/node.ts"/>
/// <reference path="../src/ts/kr3m/util/log.ts"/>
/// <reference path="../src/ts/kr3m/util/pdf.ts"/>
/// <reference path="../src/ts/kr3m/util/util.ts"/>



log("start");
var pdf = new kr3m.util.Pdf();
pdf.setHeaderFromFile("header.html");
pdf.setFooterFromFile("footer.html");
pdf.setBodyFromFile("body.html");
pdf.save("test.pdf", (success) =>
{
	log("success", success);
	log("done");
});
