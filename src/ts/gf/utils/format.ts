module gf.utils
{
	export class Format
	{
		/*
			Convert milliseconds to a readable HH:MM:SS string
			@param ms
			@returns {string}
		*/
		public static toHHMMSS(ms:number):string
		{
			let totalSeconds:number = (ms / 1000) << 0;
			let hours:number = (totalSeconds / 3600) << 0;
			let minutes:number = ((totalSeconds - (hours * 3600)) / 60) << 0;
			let seconds = totalSeconds - (hours * 3600) - (minutes * 60);

			let h:string = hours < 10 ? "0" + hours.toString() : hours.toString();
			let m:string = minutes < 10 ? "0" + minutes.toString() : minutes.toString();
			let s:string = seconds < 10 ? "0" + seconds.toString() : seconds.toString();

			return h + ":" + m + ":" + s;
		}



		/*
			Convert milliseconds to a readable MM:SS string
			@param ms
			@returns {string}
		*/
		public static toMMSS(ms:number):string
		{
			let minutes:number = (ms / 1000 / 60) << 0;
			let seconds:number = ((ms / 1000) % 60) << 0;

			let m:string = minutes < 10 ? "0" + minutes.toString() : minutes.toString();
			let s:string = seconds < 10 ? "0" + seconds.toString() : seconds.toString();

			return m + ":" + s;
		}



		/*
			Add a decimal mark (default: ".")
			@param value
			@param mark
			@returns {string}
		*/
		public static decimalMark(value:string | number, mark:string = "."):string
		{
			return String(value).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1" + mark);
		}
	}
}
