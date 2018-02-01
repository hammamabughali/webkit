module gf.vo
{
	export class HighscoreVO
	{
		public imageUrl:string;
		public levelId:number;
		public myself:boolean = false;
		public name:string;
		public rank:number;
		public score:number = 0;



		public reset():void
		{
			this.score = 0;
			this.myself = false;
			this.levelId = null;
			this.imageUrl = null;
			this.rank = null;
			this.name = null;
		}
	}
}
