/// <reference path="highscorevo.ts"/>
/// <reference path="itemvo.ts"/>
/// <reference path="resultvo.ts"/>



module gf.vo
{
	export class LevelVO extends gf.vo.ItemVO
	{
		public jsonLoaded:boolean = false;

		/*
			The user's score in this levels
		*/
		public highscoreDataVO:gf.vo.HighscoreVO = new gf.vo.HighscoreVO();

		/*
			Result object of this level
		*/
		public resultVO:gf.vo.ResultVO = new gf.vo.ResultVO();

		/*
			Score user must achieve to get the amount of stars
		*/
		public stars:number[];

		/*
			Text token to display failed text
		*/
		public tokenFail:string;

		/*
			Text token to display win text
		*/
		public tokenWin:string;



		public getStarCount(score:number):number
		{
			let star:number = 0;

			if (score == 0 || !this.stars) return star;

			this.stars.forEach((value:number) =>
			{
				if (score >= value)
					star++;
			});

			return star;
		}



		public reset():void
		{
			this.tokenFail = null;
			this.tokenWin = null;
			this.stars = null;
			this.custom = null;
			this.jsonLoaded = false;
			this.id = null;
			this.highscoreDataVO.reset();
		}



		public fromJson(data:any):gf.vo.LevelVO
		{
			this.tokenFail = data.fail_text_token;
			this.tokenWin = data.win_text_token;
			this.stars = data.stars;
			this.custom = data.custom;
			this.jsonLoaded = true;
			this.id = data.id;

			return this;
		}
	}
}
