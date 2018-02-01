/// <reference path="../model/cooldown.ts"/>
/// <reference path="../utils/format.ts"/>



module gf.model
{
	const maxLives: number = 5;
	const msForLife: number = 600000;



	export class Lives extends gf.model.Cooldown
	{
		constructor(game: gf.core.Game)
		{
			super(game, msForLife, maxLives, "lives");

			if (this.game.client.config.hasLives)
				this.game.storage.on(gf.DATA, this.onStorageData, this);
		}



		public get formatedTime(): string
		{
			return gf.utils.Format.toMMSS(this.timeLeft);
		}



		public get lives(): number
		{
			return this.currentValue;
		}
	}
}
