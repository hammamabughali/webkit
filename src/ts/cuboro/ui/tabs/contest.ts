/// <reference path="../tabs/tab.ts"/>



module cuboro.ui.tabs
{
	export class Contest extends cuboro.ui.tabs.Tab
	{
		public tfInfo: gf.display.Text;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.tfInfo = new gf.display.Text(this.game, loc("contest_empty"), cuboro.TEXT_STYLE_TITLE_HINT.clone());
			this.tfInfo.style.align = gf.CENTER;
			this.tfInfo.style.wordWrap = true;
			this.addChild(this.tfInfo);
		}



		public updateSize(width: number, height: number): void
		{
			super.updateSize(width, height);

			this.tfInfo.style.wordWrapWidth = width - cuboro.PADDING * 4;
			this.tfInfo.x = (width - this.tfInfo.width) >> 1;
			this.tfInfo.y = (height - this.tfInfo.height) >> 1;
		}
	}
}
