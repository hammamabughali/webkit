/// <reference path="../../../../../async/loop.ts"/>
/// <reference path="../../../../../tools/omniedit/src/omni/abstractscreen.ts"/>
/// <reference path="../../../../../ui/anchor.ts"/>
/// <reference path="../../../../../ui/textbox.ts"/>



module omni.screens
{
	export class DataUrl extends omni.AbstractScreen
	{
		private table:omni.widgets.PodTable;
		private itemContainer:kr3m.ui.Element;



		constructor(manager:kr3m.ui.ScreenManager)
		{
			super(manager, "dataUrl");
			this.itemContainer = new kr3m.ui.Element(this);
			new kr3m.ui.Textbox(this.itemContainer, loc("DROP_FILES_HERE"));
		}



		public handleDroppedFiles(files:kr3m.util.ClientFile[]):void
		{
			this.itemContainer.removeAllChildren();
			kr3m.async.Loop.forEach(files, (file:kr3m.util.ClientFile, next:() => void) =>
			{
				file.getDataUrl((url:string) =>
				{
					new kr3m.ui.Anchor(this.itemContainer, file.name, url, {target : "_blank", style : "display: block;"});
					next();
				});
			});
		}
	}
}
