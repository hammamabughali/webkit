/// <reference path="../../../../../tools/omniedit/src/omni/abstractscreen.ts"/>
/// <reference path="../../../../../tools/omniedit/src/omni/widgets/propertyset.ts"/>
/// <reference path="../../../../../ui/ex/imagetransformerbuttons.ts"/>



module omni.screens
{
	export class AdjustImage extends omni.AbstractScreen
	{
		private sizePopup:kr3m.ui.Element;
		private sizeProperties:omni.widgets.PropertySet;

		private transformer:kr3m.ui.ex.ImageTransformerButtons;



		constructor(manager:kr3m.ui.ScreenManager)
		{
			super(manager, "adjustImage");

			this.sizePopup = new kr3m.ui.Element(this);
			this.sizePopup.addClass("sizePopup");
			this.sizePopup.hide();

			var buttons = new kr3m.ui.Element(this);
			new omni.ui.Button(buttons, "SET_SIZE", () => this.showSizePopup());
			new omni.ui.Button(buttons, "SAVE", () => this.save());

			this.transformer = new kr3m.ui.ex.ImageTransformerButtons(this, 640, 480);
			this.transformer.addClass("adjustImageTransformer");
		}



		private showSizePopup():void
		{
			this.sizePopup.removeAllChildren();
			var propertySet = new omni.widgets.PropertySet(this.sizePopup);
			propertySet.add("width", "WIDTH");
			propertySet.add("height", "HEIGHT");
			var props:{[id:string]:any} = {};
			[props["width"], props["height"]] = this.transformer.getSize();
			propertySet.setProperties(props);

			new omni.ui.CloseButton(this.sizePopup, () =>
			{
				var props = propertySet.getProperties();
				var width = parseInt(props["width"], 10);
				var height = parseInt(props["height"], 10);
				this.transformer.setSize(width, height);
				this.closeAsPopup(this.sizePopup);
			});
			this.showAsPopup(this.sizePopup);
		}



		private save():void
		{
			this.clearDownloads();

			var types = ["jpg", "png", "gif"];

			for (var i = 0; i < types.length; ++i)
			{
				var dataUrl = this.transformer.getDataUrl("image/" + types[i]);
				var filename = this.fileName + "." + types[i];
				this.addDownloadUrl(filename, dataUrl);
			}
		}



		public handleDroppedFiles(files:kr3m.util.ClientFile[]):void
		{
			for (var i = 0; i < files.length; ++i)
			{
				if (files[i].mimeType.slice(0, 6) == "image/")
				{
					this.setFileName(files[i].name);
					files[i].getDataUrl((dataUrl:string) => this.transformer.setSource(dataUrl));
					break;
				}
			}
		}
	}
}
