/// <reference path="../../../../../html/helper.ts"/>
/// <reference path="../../../../../tools/omniedit/src/omni/abstractscreen.ts"/>
/// <reference path="../../../../../ui/ex/htmleditor.ts"/>
/// <reference path="../../../../../util/stringex.ts"/>



module omni.screens
{
	export class HtmlEditor extends omni.AbstractScreen
	{
		private editor:kr3m.ui.ex.HtmlEditor;



		constructor(manager:kr3m.ui.ScreenManager)
		{
			super(manager, "htmlEditor");

			var buttons = new kr3m.ui.Element(this);
			new omni.ui.Button(buttons, "SAVE", () => this.save());

			this.editor = new kr3m.ui.ex.HtmlEditor(this);
		}



		private save():void
		{
			this.clearDownloads();
			var helper = new kr3m.html.Helper();
			var html = kr3m.util.StringEx.BOM + helper.wrapHtml(this.editor.getHtml());
			this.addDownload(this.fileName + ".html", html, "text/html;charset=utf-8");
		}



		public handleDroppedFiles(files:kr3m.util.ClientFile[]):void
		{
			for (var i = 0; i < files.length; ++i)
			{
				if (files[i].mimeType == "text/html")
				{
					this.setFileName(files[i].name);
					files[i].getTextContent((content:string) => this.editor.setHtml(content));
					break;
				}
			}
		}
	}
}
