/// <reference path="../../cuboro/types.ts"/>
/// <reference path="../../kr3m/services/ajaxstub.ts"/>



module cuboro.stubs
{
	export abstract class Abstract extends kr3m.services.AjaxStub
	{
		constructor()
		{
			super();
			this.htmlEscapeStrings = false;
		}
	}
}
