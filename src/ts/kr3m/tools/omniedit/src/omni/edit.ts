/// <reference path="../../../../app/application.ts"/>
/// <reference path="../../../../tools/omniedit/src/omni/constants.ts"/>
/// <reference path="../../../../tools/omniedit/src/omni/screens/adjustimage.ts"/>
/// <reference path="../../../../tools/omniedit/src/omni/screens/dataurl.ts"/>
/// <reference path="../../../../tools/omniedit/src/omni/screens/htmleditor.ts"/>
/// <reference path="../../../../tools/omniedit/src/omni/screens/localization.ts"/>
/// <reference path="../../../../tools/omniedit/src/omni/screens/podtable.ts"/>
/// <reference path="../../../../tools/omniedit/src/omni/ui/button.ts"/>
/// <reference path="../../../../ui/ex/filedroparea.ts"/>
/// <reference path="../../../../ui/screenmanager.ts"/>
/// <reference path="../../../../ui/textbox.ts"/>



module omni
{
	export class Edit extends kr3m.app.Application
	{
		private headerButtons:kr3m.ui.Element;
		private screens:kr3m.ui.ScreenManager;



		constructor()
		{
			super();
			this.callDelayed(() =>
			{
				log("Version", omni.VERSION);

				var dropArea = new kr3m.ui.ex.FileDropArea(this.base);
				dropArea.addClass("dropArea");

				this.headerButtons = new kr3m.ui.Element(dropArea);
				this.headerButtons.addClass("headerButtons");

				new kr3m.ui.Textbox(this.headerButtons, loc("SELECT_MODE"));

				this.screens = new kr3m.ui.ScreenManager(dropArea);
				new omni.screens.PodTable(this.screens);
				new omni.screens.Localization(this.screens);
				new omni.screens.DataUrl(this.screens);
				new omni.screens.AdjustImage(this.screens);
				new omni.screens.HtmlEditor(this.screens);

				var names = this.screens.getScreenNames();
				for (var i = 0; i < names.length; ++i)
				{
					var captionId = "SCREEN_" + names[i].toUpperCase();
					var button = new omni.ui.Button(this.headerButtons, captionId, this.showScreen.bind(this, names[i]));
					button.setAttribute("title", loc("TT_" + captionId));
				}

				dropArea.onDrop((files:kr3m.util.ClientFile[]) =>
				{
					var screen = <omni.AbstractScreen> this.screens.getCurrentScreen();
					if (screen)
						screen.handleDroppedFiles(files);
				});
			});
		}



		private showScreen(screenName:string):void
		{
			this.headerButtons.hide();
			this.screens.showScreenByName(screenName);
		}
	}
}
