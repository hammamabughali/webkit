module gf.vo
{
	export class ItemVO
	{
		/*
			Custom game data
		*/
		public custom:any = {};

		/*
			ID
		*/
		public id:number;

		/*
			Wether vo is locked (false) or not (true)
		*/
		public unlocked:boolean;
	}
}
