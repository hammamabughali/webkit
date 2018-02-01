/// <reference path="../../ui/userimage.ts"/>
/// <reference path="../../vo/highscorevo.ts"/>



module gf.ui.highscore
{
	export class HighscoreItem extends gf.display.Container
	{
		private _data:gf.vo.HighscoreVO;
		private _maxRank:number;

		public highscore:gf.ui.highscore.Highscore;
		public userImage:gf.ui.UserImage;
		public tfName:gf.display.Text;
		public tfRank:gf.display.Text;
		public tfScore:gf.display.Text;



		constructor(highscore:gf.ui.highscore.Highscore)
		{
			super(highscore.game);

			this.highscore = highscore;

			this.init();
		}



		protected init():void
		{
		}



		protected updateData():void
		{
		}



		protected updateMaxRank():void
		{
		}



		public get data():gf.vo.HighscoreVO
		{
			return this._data;
		}



		public set data(value:gf.vo.HighscoreVO)
		{
			this._data = value;
			this.updateData();
		}



		public get maxRank():number
		{
			return this._maxRank;
		}



		public set maxRank(value:number)
		{
			this._maxRank = value;
			this.updateMaxRank();
		}
	}
}
