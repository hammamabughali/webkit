module kr3m.math
{
	/*
		Klasse zum Rechnen mit (beliebig) großen Integerzahlen.
		Die Zahlen in dieser Klasse haben niemals Rundungsfehler
		und keine Beschränkung auf Größe. Dafür verbraucht diese
		Klasse extrem viel Speicher und ist sehr viel langsamer
		als "normale" Zahlen. Intern werden die Werte als Strings
		im Dezimalsystem vorgehalten und es werden aktuell nur
		positive Zahlen unterstützt - also die sog. natürlichen
		Zahlen mit 0.
	*/
	export class BigInt
	{
		public value:string = "0";



		constructor(value:any = null)
		{
			if (value)
			{
				switch (typeof value)
				{
					case "number":
						if (value < 0)
							throw new Error("only positive integers and 0 are supported in this version");
						this.value = Math.floor(value).toString();
						break;

					case "string":
						var digitPattern = /^\d+$/;
						if (!digitPattern.test(value))
							throw new Error("only positive integers and 0 are supported in this version");
						this.value = value;
						break;

					case "object":
						if (value instanceof BigInt)
							this.value = value.value;
						break;
				}
				this.trim();
			}
		}



		private trim():void
		{
			while (this.value.length > 1 && this.value.charAt(0) == "0")
				this.value = this.value.substr(1);
		}



		private pad(length:number):void
		{
			while (this.value.length < length)
				this.value = "0" + this.value;
		}



		public slice(from?:number, to?:number):BigInt
		{
			return new BigInt(this.value.substring(from, to));
		}



		public clone():BigInt
		{
			return new BigInt(this);
		}



		public getDigit(index:number):number
		{
			index = this.value.length - index - 1;
			return this.value.charCodeAt(index) - 48;
		}



		public setDigit(index:number, value:number):void
		{
			index = this.value.length - index - 1;
			this.value = this.value.substr(0, index) + String.fromCharCode(value + 48) + this.value.substr(index + 1);
		}



		public isLessThan(other:BigInt):boolean
		{
			if (this.value.length < other.value.length)
				return true;

			if (this.value.length > other.value.length)
				return false;

			return this.value < other.value;
		}



		public minus(subtrahend:BigInt):BigInt
		{
			var len = this.value.length;
			subtrahend = subtrahend.clone();
			subtrahend.pad(len);
			var result = "";
			var overflow = 0;
			for (var i = 0; i < len; ++i)
			{
				var a = this.getDigit(i);
				var b = subtrahend.getDigit(i);
				var d = a - b - overflow;
				if (d < 0)
				{
					d += 10;
					overflow = 1;
				}
				else
				{
					overflow = 0;
				}
				result = String.fromCharCode(d + 48) + result;
			}
			return new BigInt(result);
		}



		public modulo(divisor:BigInt):BigInt
		{
			var progress = 0;
			var temp = this.slice(0, 1);

			while (progress < this.value.length)
			{
				while (temp.isLessThan(divisor))
				{
					++progress;
					if (progress >= this.value.length)
						return temp;

					temp.value = temp.value + this.value.charAt(progress);
				}

				while (!temp.isLessThan(divisor))
					temp = temp.minus(divisor);
			}

			return temp;
		}



		public toInt():number
		{
			return parseInt(this.value, 10);
		}
	}
}
