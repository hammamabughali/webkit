///<refrence path="domdisplayobject.ts" />


module gf.input
{
	export class TextArea extends gf.display.DomDisplayObject
	{
		protected _bold: boolean;
		protected _color: number;
		protected _fontSize: number;
		protected _inputDom: HTMLTextAreaElement;
		protected _italic: boolean;
		protected _regExp: RegExp;

		public required: boolean;
		public validateTrimmedValue: boolean;



		constructor(game: gf.core.Game, parent: string | gf.input.DomContainer, name: string)
		{
			super(game, parent, "textarea");

			this._regExp = /(\w|\W)+/;
			this.required = true;
			this._inputDom.name = name;
			this._italic = false;
			this._bold = false;
			this.validateTrimmedValue = true;
			this.addChangeListeners();
		}



		protected addChangeListeners(): void
		{
			this._inputDom.addEventListener("keyup", (e: KeyboardEvent) =>
			{
				if (e.keyCode != 9)
					this.onChange();
			});

			this._inputDom.oninput = () => this.onChange();

			$(this._inputDom).blur(() => this.onInputBlur());
			$(this._inputDom).focus(() => this.onInputFocus());
		}



		protected createDom(): void
		{
			super.createDom();
			this._inputDom = <HTMLTextAreaElement>this._dom;
			this._inputDom.style.position = "absolute";
			this._inputDom.style.border = "none";
			this._inputDom.style.fontFamily = "Arial, Helvetica, sans-serif";
		}



		public onInputBlur(): void
		{
		}



		public onInputFocus(): void
		{
		}



		public setFocus(): void
		{
			setTimeout(() => $(this._inputDom).focus(), 1);
		}



		public validate(): boolean
		{
			if (this.readOnly) return true;
			const value = (this.validateTrimmedValue) ? this.value.trim() : this.value;
			return (!this.required && this.value.length == 0) || this.regExp.test(value);
		}



		public get inputDom(): HTMLTextAreaElement
		{
			return this._inputDom;
		}



		public get name(): string
		{
			return this._inputDom.name;
		}



		public get regExp(): RegExp
		{
			return this._regExp;
		}



		public set regExp(value: RegExp)
		{
			this._regExp = value;
			this.onChange();
		}



		public get readOnly(): boolean
		{
			return this._inputDom.readOnly;
		}



		public set readOnly(value: boolean)
		{
			this._inputDom.readOnly = value;
		}



		public get value(): string
		{
			return this._inputDom.value;
		}



		public set value(value: string)
		{
			if (this._inputDom.value != value)
				this.onChange();

			this._inputDom.value = value;
		}



		public get placeholder(): string
		{
			return this._inputDom.placeholder;
		}



		public set placeholder(value: string)
		{
			this._inputDom.placeholder = value;
		}



		public get fontFamily(): string
		{
			return this._inputDom.style.fontFamily;
		}



		public set fontFamily(value: string)
		{
			this._inputDom.style.fontFamily = value;
		}



		public get fontSize(): number
		{
			return this._fontSize;
		}



		public set fontSize(value: number)
		{
			this._inputDom.style.fontSize = String(value) + "px";
			this._fontSize = value;
		}



		public get color(): number
		{
			return this._color;
		}



		public set color(value: number)
		{
			this._inputDom.style.color = "#" + value.toString(16);
			this._color = value;
		}



		public get italic(): boolean
		{
			return this._italic;
		}



		public set italic(value: boolean)
		{
			this._inputDom.style.fontStyle = (value) ? "italic" : "regular";
			this._italic = value;
		}



		public get bold(): boolean
		{
			return this._bold;
		}



		public set bold(value: boolean)
		{
			this._inputDom.style.fontWeight = (value) ? "bold" : "normal";
			this._bold = value;
		}



		public get maxLength(): number
		{
			return this._inputDom.maxLength ? this._inputDom.maxLength : 0
		}



		public set maxLength(value: number)
		{
			this._inputDom.maxLength = value;
		}



		public get cols(): number
		{
			return this._inputDom.cols;
		}



		public set cols(value: number)
		{
			this._inputDom.cols = value;
		}



		public get rows(): number
		{
			return this._inputDom.rows;
		}



		public set rows(value: number)
		{
			this._inputDom.rows = value;
		}



		public get wrap(): string
		{
			return this._inputDom.wrap;
		}



		public set wrap(value: string)
		{
			this._inputDom.wrap = value;
		}



		public get resize(): string
		{
			return this._inputDom.style.resize;
		}



		public set resize(value: string)
		{
			this._inputDom.style.resize = value;
		}
	}
}
