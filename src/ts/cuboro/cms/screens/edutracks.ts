﻿/// <reference path="../../../cuboro/cms/screens/abstract.ts"/>



module cuboro.cms.screens
{
	export class EduTracks extends Abstract
	{
		constructor(manager:kr3m.ui2.ex.ScreenManager)
		{
			super(manager, {name : "eduTracks"});

			var div = new kr3m.ui2.Div(this);
			div.setText(loc("eduTracks"));
		}
	}
}
