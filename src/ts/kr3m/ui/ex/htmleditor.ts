/// <reference path="../../ui/checkbox.ts"/>
/// <reference path="../../ui/dropdown.ts"/>
/// <reference path="../../ui/element.ts"/>
/// <reference path="../../ui/image.ts"/>
/// <reference path="../../util/util.ts"/>



module kr3m.ui.ex
{
	/*
		Html-Element zum Bearbeiten von HTML-Text.

		Beispielhafte LESS-Styles:

			.htmlEditor
			{
				background-color: white;
				border: solid black 1px;
				max-height: 90vh;
				max-width: 90vw;
				padding: 1%;

				.dropdowns
				{
					width: 100%;
				}

				.buttons
				{
					width: 100%;
				}

				.header
				{
					width: 100%;
				}

				.content
				{
					border: solid black 1px;
					overflow: scroll;
					min-height: 20vh;
					width: 100%;
				}
			}
	*/
	export class HtmlEditor extends kr3m.ui.Element
	{
		public static STYLE_LIST_TYPES =
		[
			{
				id : "BLOCK_TYPE",
				formatting : "formatblock",
				values :
				{
					"0" : "- formatting -",
					"h1" : "Title 1 <h1>",
					"h2" : "Title 2 <h2>",
					"h3" : "Title 3 <h3>",
					"h4" : "Title 4 <h4>",
					"h5" : "Title 5 <h5>",
					"h6" : "Subtitle <h6>",
					"p" : "Paragraph <p>",
					"pre" : "Preformatted <pre>"
				}
			},
			{
				id : "FONT_SIZE",
				formatting : "fontsize",
				values :
				{
					"0" : "- size -",
					"1" : "Very small",
					"2" : "A bit small",
					"3" : "Normal",
					"4" : "Medium-large",
					"5" : "Big",
					"6" : "Very big",
					"7" : "Maximum"
				}
			}
		];

		public static STYLE_BUTTON_TYPES =
		[
			{ id : "UNDO", formatting : "undo", iconUrl : "data:image/gif;base64,R0lGODlhFgAWAOMKADljwliE33mOrpGjuYKl8aezxqPD+7/I19DV3NHa7P///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARR8MlJq7046807TkaYeJJBnES4EeUJvIGapWYAC0CsocQ7SDlWJkAkCA6ToMYWIARGQF3mRQVIEjkkSVLIbSfEwhdRIH4fh/DZMICe3/C4nBQBADs=" },
			{ id : "REDO", formatting : "redo", iconUrl : "data:image/gif;base64,R0lGODlhFgAWAMIHAB1ChDljwl9vj1iE34Kl8aPD+7/I1////yH5BAEKAAcALAAAAAAWABYAAANKeLrc/jDKSesyphi7SiEgsVXZEATDICqBVJjpqWZt9NaEDNbQK1wCQsxlYnxMAImhyDoFAElJasRRvAZVRqqQXUy7Cgx4TC6bswkAOw==" },
			{ id : "CUT", formatting : "cut", iconUrl : "data:image/gif;base64,R0lGODlhFgAWAIQSAB1ChBFNsRJTySJYwjljwkxwl19vj1dusYODhl6MnHmOrpqbmpGjuaezxrCztcDCxL/I18rL1P///////////////////////////////////////////////////////yH5BAEAAB8ALAAAAAAWABYAAAVu4CeOZGmeaKqubDs6TNnEbGNApNG0kbGMi5trwcA9GArXh+FAfBAw5UexUDAQESkRsfhJPwaH4YsEGAAJGisRGAQY7UCC9ZAXBB+74LGCRxIEHwAHdWooDgGJcwpxDisQBQRjIgkDCVlfmZqbmiEAOw==" },
			{ id : "COPY", formatting : "copy", iconUrl : "data:image/gif;base64,R0lGODlhFgAWAIQcAB1ChBFNsTRLYyJYwjljwl9vj1iE31iGzF6MnHWX9HOdz5GjuYCl2YKl8ZOt4qezxqK63aK/9KPD+7DI3b/I17LM/MrL1MLY9NHa7OPs++bx/Pv8/f///////////////yH5BAEAAB8ALAAAAAAWABYAAAWG4CeOZGmeaKqubOum1SQ/kPVOW749BeVSus2CgrCxHptLBbOQxCSNCCaF1GUqwQbBd0JGJAyGJJiobE+LnCaDcXAaEoxhQACgNw0FQx9kP+wmaRgYFBQNeAoGihCAJQsCkJAKOhgXEw8BLQYciooHf5o7EA+kC40qBKkAAAGrpy+wsbKzIiEAOw==" },
			{ id : "PASTE", formatting : "paste", iconUrl : "data:image/gif;base64,R0lGODlhFgAWAIQUAD04KTRLY2tXQF9vj414WZWIbXmOrpqbmpGjudClFaezxsa0cb/I1+3YitHa7PrkIPHvbuPs+/fvrvv8/f///////////////////////////////////////////////yH5BAEAAB8ALAAAAAAWABYAAAWN4CeOZGmeaKqubGsusPvBSyFJjVDs6nJLB0khR4AkBCmfsCGBQAoCwjF5gwquVykSFbwZE+AwIBV0GhFog2EwIDchjwRiQo9E2Fx4XD5R+B0DDAEnBXBhBhN2DgwDAQFjJYVhCQYRfgoIDGiQJAWTCQMRiwwMfgicnVcAAAMOaK+bLAOrtLUyt7i5uiUhADs=" },
			{ id : "CLEAN", formatting : "removeFormat", iconUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABGdBTUEAALGPC/xhBQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB9oECQMCKPI8CIIAAAAIdEVYdENvbW1lbnQA9syWvwAAAuhJREFUOMtjYBgFxAB501ZWBvVaL2nHnlmk6mXCJbF69zU+Hz/9fB5O1lx+bg45qhl8/fYr5it3XrP/YWTUvvvk3VeqGXz70TvbJy8+Wv39+2/Hz19/mGwjZzuTYjALuoBv9jImaXHeyD3H7kU8fPj2ICML8z92dlbtMzdeiG3fco7J08foH1kurkm3E9iw54YvKwuTuom+LPt/BgbWf3//sf37/1/c02cCG1lB8f//f95DZx74MTMzshhoSm6szrQ/a6Ir/Z2RkfEjBxuLYFpDiDi6Af///2ckaHBp7+7wmavP5n76+P2ClrLIYl8H9W36auJCbCxM4szMTJac7Kza////R3H1w2cfWAgafPbqs5g7D95++/P1B4+ECK8tAwMDw/1H7159+/7r7ZcvPz4fOHbzEwMDwx8GBgaGnNatfHZx8zqrJ+4VJBh5CQEGOySEua/v3n7hXmqI8WUGBgYGL3vVG7fuPK3i5GD9/fja7ZsMDAzMG/Ze52mZeSj4yu1XEq/ff7W5dvfVAS1lsXc4Db7z8C3r8p7Qjf///2dnZGxlqJuyr3rPqQd/Hhyu7oSpYWScylDQsd3kzvnH738wMDzj5GBN1VIWW4c3KDon7VOvm7S3paB9u5qsU5/x5KUnlY+eexQbkLNsErK61+++VnAJcfkyMTIwffj0QwZbJDKjcETs1Y8evyd48toz8y/ffzv//vPP4veffxpX77z6l5JewHPu8MqTDAwMDLzyrjb/mZm0JcT5Lj+89+Ybm6zz95oMh7s4XbygN3Sluq4Mj5K8iKMgP4f0////fv77//8nLy+7MCcXmyYDAwODS9jM9tcvPypd35pne3ljdjvj26+H2dhYpuENikgfvQeXNmSl3tqepxXsqhXPyc666s+fv1fMdKR3TK72zpix8nTc7bdfhfkEeVbC9KhbK/9iYWHiErbu6MWbY/7//8/4//9/pgOnH6jGVazvFDRtq2VgiBIZrUTIBgCk+ivHvuEKwAAAAABJRU5ErkJggg==" },
			{ id : "BOLD", formatting : "bold", iconUrl : "data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAInhI+pa+H9mJy0LhdgtrxzDG5WGFVk6aXqyk6Y9kXvKKNuLbb6zgMFADs=" },
			{ id : "ITALIC", formatting : "italic", iconUrl : "data:image/gif;base64,R0lGODlhFgAWAKEDAAAAAF9vj5WIbf///yH5BAEAAAMALAAAAAAWABYAAAIjnI+py+0Po5x0gXvruEKHrF2BB1YiCWgbMFIYpsbyTNd2UwAAOw==" },
			{ id : "UNDERLINE", formatting : "underline", iconUrl : "data:image/gif;base64,R0lGODlhFgAWAKECAAAAAF9vj////////yH5BAEAAAIALAAAAAAWABYAAAIrlI+py+0Po5zUgAsEzvEeL4Ea15EiJJ5PSqJmuwKBEKgxVuXWtun+DwxCCgA7" },
			{ id : "ALIGN_LEFT", formatting : "justifyleft", iconUrl : "data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JMGELkGYxo+qzl4nKyXAAAOw==" },
			{ id : "ALIGN_CENTER", formatting : "justifycenter", iconUrl : "data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIfhI+py+0Po5y02ouz3jL4D4JOGI7kaZ5Bqn4sycVbAQA7" },
			{ id : "ALIGN_RIGHT", formatting : "justifyright", iconUrl : "data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JQGDLkGYxouqzl43JyVgAAOw==" },
			{ id : "LIST_NUMBERED", formatting : "insertorderedlist", iconUrl : "data:image/gif;base64,R0lGODlhFgAWAMIGAAAAADljwliE35GjuaezxtHa7P///////yH5BAEAAAcALAAAAAAWABYAAAM2eLrc/jDKSespwjoRFvggCBUBoTFBeq6QIAysQnRHaEOzyaZ07Lu9lUBnC0UGQU1K52s6n5oEADs=" },
			{ id : "LIST_BULLETS", formatting : "insertunorderedlist", iconUrl : "data:image/gif;base64,R0lGODlhFgAWAMIGAAAAAB1ChF9vj1iE33mOrqezxv///////yH5BAEAAAcALAAAAAAWABYAAAMyeLrc/jDKSesppNhGRlBAKIZRERBbqm6YtnbfMY7lud64UwiuKnigGQliQuWOyKQykgAAOw==" },
			{ id : "QUOTE", formatting : "formatblock','blockquote", iconUrl : "data:image/gif;base64,R0lGODlhFgAWAIQXAC1NqjFRjkBgmT9nqUJnsk9xrFJ7u2R9qmKBt1iGzHmOrm6Sz4OXw3Odz4Cl2ZSnw6KxyqO306K63bG70bTB0rDI3bvI4P///////////////////////////////////yH5BAEKAB8ALAAAAAAWABYAAAVP4CeOZGmeaKqubEs2CekkErvEI1zZuOgYFlakECEZFi0GgTGKEBATFmJAVXweVOoKEQgABB9IQDCmrLpjETrQQlhHjINrTq/b7/i8fp8PAQA7" },
			{ id : "INDENT", formatting : "outdent", iconUrl : "data:image/gif;base64,R0lGODlhFgAWAMIHAAAAADljwliE35GjuaezxtDV3NHa7P///yH5BAEAAAcALAAAAAAWABYAAAM2eLrc/jDKCQG9F2i7u8agQgyK1z2EIBil+TWqEMxhMczsYVJ3e4ahk+sFnAgtxSQDqWw6n5cEADs=" },
			{ id : "OUTDENT", formatting : "indent", iconUrl : "data:image/gif;base64,R0lGODlhFgAWAOMIAAAAADljwl9vj1iE35GjuaezxtDV3NHa7P///////////////////////////////yH5BAEAAAgALAAAAAAWABYAAAQ7EMlJq704650B/x8gemMpgugwHJNZXodKsO5oqUOgo5KhBwWESyMQsCRDHu9VOyk5TM9zSpFSr9gsJwIAOw==" }
		];

		public static INSERT_BUTTON_TYPES =
		[
			{ id : "HYPERLINK", formatting : "createlink", promptText : "Target URL:", iconUrl : "data:image/gif;base64,R0lGODlhFgAWAOMKAB1ChDRLY19vj3mOrpGjuaezxrCztb/I19Ha7Pv8/f///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARY8MlJq7046827/2BYIQVhHg9pEgVGIklyDEUBy/RlE4FQF4dCj2AQXAiJQDCWQCAEBwIioEMQBgSAFhDAGghGi9XgHAhMNoSZgJkJei33UESv2+/4vD4TAQA7" },
			{ id : "IMAGE", formatting : "insertImage", promptText : "Image URL:", iconUrl : "data:image/gif;base64,R0lGODlhFgAWAOMKAB1ChDRLY19vj3mOrpGjuaezxrCztb/I19Ha7Pv8/f///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARY8MlJq7046827/2BYIQVhHg9pEgVGIklyDEUBy/RlE4FQF4dCj2AQXAiJQDCWQCAEBwIioEMQBgSAFhDAGghGi9XgHAhMNoSZgJkJei33UESv2+/4vD4TAQA7" }
		];

		private header:kr3m.ui.Element;
		private dropdowns:kr3m.ui.Element;
		private buttons:kr3m.ui.Element;
		private content:kr3m.ui.Element;

		private showRaw = false;



		constructor(par:kr3m.ui.Element)
		{
			super(par);
			this.addClass("htmlEditor");

			this.addHeader();
			this.addDropdowns();
			this.addButtons();
			this.addContent();
		}



		protected addHeader():void
		{
			this.header = new kr3m.ui.Element(this);
			this.header.addClass("header");

			var rawCheck = new kr3m.ui.Checkbox(this.header);
			rawCheck.on("change", () => this.setMode(rawCheck.isChecked()));
			var rawLabel = new kr3m.ui.Element(this.header, null, "span");
			rawLabel.setInnerHtml("Show Raw");
		}



		protected addDropdowns():void
		{
			this.dropdowns = new kr3m.ui.Element(this);
			this.dropdowns.addClass("dropdowns");

			for (var i = 0; i < HtmlEditor.STYLE_LIST_TYPES.length; ++i)
			{
				var slt = HtmlEditor.STYLE_LIST_TYPES[i];
				var dropdown = new kr3m.ui.DropDown(this.dropdowns, slt.values, "styleDropdown");
				dropdown.on("change", ((slt, dropdown) =>
				{
					this.applyFormatting(slt.formatting, dropdown.getSelectedValue());
					dropdown.select("0");
				}).bind(null, slt, dropdown));
				dropdown.select("");
			}
		}



		protected addButtons():void
		{
			this.buttons = new kr3m.ui.Element(this);
			this.buttons.addClass("buttons");

			for (var i = 0; i < HtmlEditor.STYLE_BUTTON_TYPES.length; ++i)
			{
				var sbtt = HtmlEditor.STYLE_BUTTON_TYPES[i];
				var button = new kr3m.ui.Image(this.buttons, sbtt.iconUrl, "button styleButton");
				button.on("click", ((sbtt) => this.applyFormatting(sbtt.formatting)).bind(null, sbtt));
				button.setAttribute("tabIndex", 0);
			}

			for (var i = 0; i < HtmlEditor.INSERT_BUTTON_TYPES.length; ++i)
			{
				var ibtt = HtmlEditor.INSERT_BUTTON_TYPES[i];
				var button = new kr3m.ui.Image(this.buttons, ibtt.iconUrl, "button styleButton");
				button.on("click", ((ibtt) =>
				{
					var value = prompt(ibtt.promptText);
					if (value)
						this.applyFormatting(ibtt.formatting, value);
				}).bind(null, ibtt));
				button.setAttribute("tabIndex", 0);
			}
		}



		protected addContent():void
		{
			this.content = new kr3m.ui.Element(this);
			this.content.addClass("content");
			this.content.setAttribute("contenteditable", true);
			this.content.setAttribute("tabIndex", 0);
		}



		protected applyFormatting(command:string, value?:string):void
		{
			if (this.showRaw)
				return;

			document.execCommand(command, false, value);
		}



		public setMode(raw:boolean):void
		{
			if (raw == this.showRaw)
				return;

			if (raw)
				this.content.setInnerHtml(kr3m.util.Util.encodeHtml(this.content.getInnerHtml()));
			else
				this.content.setInnerHtml(kr3m.util.Util.decodeHtml(this.content.getInnerHtml()));

			this.dropdowns.setVisible(!raw);
			this.buttons.setVisible(!raw);
			this.showRaw = raw;
		}



		public setText(text:string):void
		{
			this.setHtml(kr3m.util.Util.encodeHtml(text));
		}



		public getText():string
		{
			return kr3m.util.Util.decodeHtml(this.getHtml());
		}



		public setHtml(html:string):void
		{
			if (this.showRaw)
				this.content.setInnerHtml(kr3m.util.Util.encodeHtml(html));
			else
				this.content.setInnerHtml(html);
		}



		public getHtml():string
		{
			if (this.showRaw)
				return kr3m.util.Util.decodeHtml(this.content.getInnerHtml());
			else
				return this.content.getInnerHtml();
		}
	}
}
