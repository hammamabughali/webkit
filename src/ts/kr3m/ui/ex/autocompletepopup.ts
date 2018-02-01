/// <reference path="../../ui/button.ts"/>
/// <reference path="../../ui/element.ts"/>



module kr3m.ui.ex
{
	export class AutoCompletePopup extends kr3m.ui.Element
	{
		private clickCallback:(option:string) => void;
		private optionButtons:kr3m.ui.Button[] = [];
		private selected:number;
		private hideTimer:number = null;
		private optionsUnescaped = false;



		constructor(
			parent:kr3m.ui.Element,
			clickCallback:(option:string) => void,
			optionsUnescaped = false)
		{
			super(null);

			this.clickCallback = clickCallback;
			this.optionsUnescaped = optionsUnescaped;

			parent.dom.wrap("<span class='autoCompletePopupParent' style='position:relative; margin:0px; padding:0px;'></span>");
			this.dom.insertBefore(parent.dom);

			this.parent = parent;
			this.onAddedToStage();
			this.addClass("autoCompletePopup");
			this.setAttribute("tabindex", "0");
			this.dom.css(
			{
				"position": "absolute",
				"z-index": 1000
			});

			parent.on("keydown", this.onKeyDown.bind(this));
			parent.on("blur", this.onBlur.bind(this));
			parent.on("focus", this.onFocus.bind(this));
			this.on("keydown", this.onKeyDown.bind(this));

			this.hide();
		}



		private onFocus():void
		{
			this.stopHideTimer();
		}



		private onBlur():void
		{
			this.startHideTimer();
		}



		private startHideTimer():void
		{
			if (this.hideTimer === null)
			{
				this.hideTimer = setTimeout(() =>
				{
					this.hide();
					this.hideTimer = null;
				}, 100);
			}
		}



		private stopHideTimer():void
		{
			if (this.hideTimer !== null)
			{
				clearTimeout(this.hideTimer);
				this.hideTimer = null;
			}
		}



		private onKeyDown(event:JQueryEventObject):void
		{
			switch (event.key)
			{
				case "Esc":
					this.parent.focus();
					this.hide();
					event.preventDefault();
					break;

				case "Enter":
					this.parent.focus();
					this.hide();
					event.preventDefault();
					if (this.selected < this.optionButtons.length)
						this.clickCallback(this.optionButtons[this.selected].dom.text());
					break;

				case "ArrowUp":
				case "Up":
					this.moveSelection(-1);
					event.preventDefault();
					break;

				case "ArrowDown":
				case "Down":
					this.moveSelection(1);
					event.preventDefault();
					break;
			}
		}



		private moveSelection(delta:number):void
		{
			if (this.optionButtons.length == 0)
				return;

			if ((delta < 0) && (this.selected == 0))
				return this.parent.focus();

			this.selected = (this.selected + delta) % this.optionButtons.length;
			for (var i = 0; i < this.optionButtons.length; ++i)
			{
				if (i == this.selected)
				{
					this.optionButtons[i].addClass("selected");
					this.optionButtons[i].focus();
				}
				else
				{
					this.optionButtons[i].removeClass("selected");
				}
			}
		}



		public setOptions(options:string[]):void
		{
			this.removeAllChildren();
			this.optionButtons = [];
			this.selected = -1;

			for (var i = 0; i < options.length; ++i)
			{
				var button = new kr3m.ui.Button(this, options[i], "option", this.onClicked.bind(this, options[i]));
				button.on("focus", this.onFocus.bind(this));
				button.on("blur", this.onBlur.bind(this));
				if (this.optionsUnescaped)
					button.setText(options[i]);
				this.optionButtons.push(button);
			}

			this.showOnClicked();
		}



		public showOnClicked():void
		{
			if (this.optionButtons.length > 0)
				this.show();
			else
				this.hide();
		}



		private onClicked(option:string):void
		{
			this.hide();
			this.parent.focus();
			this.clickCallback(option);
		}
	}
}
