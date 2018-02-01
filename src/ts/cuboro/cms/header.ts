/// <reference path="../../kr3m/ui2/cms/casloginstatus.ts"/>
/// <reference path="../../kr3m/ui2/div.ts"/>
/// <reference path="../../kr3m/ui2/img.ts"/>



module cuboro.cms
{
	export class Header extends kr3m.ui2.Div
	{
		constructor(parentElement:kr3m.ui2.Element|HTMLElement)
		{
			super(parentElement);
			this.addClass("header");

			new kr3m.ui2.Img(this, {src : "../img/logo.png", classes : "logo", css : {"width" : "30vw", "margin-left" : "30vw"}});
			new kr3m.ui2.cms.CasLoginStatus(this);
		}
	}
}
