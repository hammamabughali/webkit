/// <reference path="domcontainer.ts"/>
/// <reference path="ienable.ts"/>



module gf.input
{
	export class Form extends gf.input.DomContainer
	{
		protected _formDom: HTMLFormElement;
		protected _formName:string;
		protected _submitButton: gf.input.IEnable;
		protected _additionalData: { [key:string]:any };

		public onSubmit: (data:any) => void;
		public disableSubmitButtonByInvalidInputs:boolean;



		constructor(game: gf.core.Game, name?:string)
		{
			super(game, "form");

			this._additionalData = {};

			if (typeof name == "string")
				this._formName = name;

			this.disableSubmitButtonByInvalidInputs = true;

			this.on("change", () => this.change());
		}



		protected change():void
		{
			if (this.disableSubmitButtonByInvalidInputs && this._submitButton)
				(this.validate()) ? this._submitButton.enable() : this._submitButton.disable();
		}



		protected createDom():void
		{
			super.createDom();

			this._formDom = <HTMLFormElement>this._dom;
			this._formDom.autocomplete = "on";
			this._formDom.action = "form/submit";
			this._formDom.method = "post";
			this._formDom.name = this._formName;

			if (typeof this._formName == "string")
				this._formDom.name = this._formName;

			this._formDom.onsubmit = (e: Event) =>
			{
				const activeElement: HTMLElement = (!!document.activeElement) ? <HTMLElement>document.activeElement : document.body
				activeElement.blur();
				if (typeof this.onSubmit == "function")
					this.onSubmit(this.data);
				e.preventDefault();
				return true;
			};

			const submitInput: HTMLButtonElement = document.createElement("button");
			submitInput.type = "submit";
			submitInput.name = "Submit";
			submitInput.style.opacity = "0";
			this._formDom.appendChild(submitInput);
		}



		public addData(key:string, value:any):void
		{
			this._additionalData[key] = value;
		}



		public addDomChild(child: gf.display.DomDisplayObject):void
		{
			super.addDomChild(child);
			this.change();
		}



		public clear():void
		{
			this._domChildren.forEach((domDisplay: gf.display.DomDisplayObject) =>
			{
				if (domDisplay["value"])
					domDisplay["value"] = "";
			});
		}



		public submit():void
		{
			let event: Event;
			if (typeof document.createEvent == "function")
			{
				event = document.createEvent("Event");
				event.initEvent("submit", true, true);
			}
			else
			{
				event = new Event("submit");
			}
			this._formDom.dispatchEvent(event);
		}



		public get data():any
		{
			const dataList:any[] = $(this._formDom).serializeArray();
			const data:any = {};
			dataList.forEach((dataItem:any) =>
			{
				data[dataItem.name] = dataItem.value;
			});

			for (let key in this._additionalData)
				data[key] = this._additionalData[key];

			return data;
		}



		public get submitButton(): gf.input.IEnable
		{
			return this._submitButton;
		}



		public set submitButton(value: gf.input.IEnable)
		{
			this._submitButton = value;
			this.change();
		}
	}
}
