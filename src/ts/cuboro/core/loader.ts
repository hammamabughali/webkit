module cuboro.core
{
	export class Loader
	{
		public static loadTrack(
			game: gf.core.Game,
			track: cuboro.vo.Track,
			forceDuplicate: boolean): void
		{
			mTrack = track;

			if (forceDuplicate)
			{
				track.owner = mUser.getUser();
				sTrack.generateUniqueRandomName(loc("trackname_prefix"), (response: string) =>
				{
					mTrack.name = response;
					game.stage.header.trackMenu.trackName.value = mTrack.name;
				});
			}
			else
			{
				game.stage.header.trackMenu.trackName.value = mTrack.name;
			}

			if (game.screens.currentName != cuboro.screens.Game.NAME)
			{
				const gameScreen: cuboro.screens.Game = game.screens.show(cuboro.screens.Game.NAME);
				gameScreen.on(gf.TRANSITION_IN_COMPLETE, () =>
				{
					gameScreen.playground.on(cuboro.PLAYGROUND_READY, () =>
					{
						gameScreen.layers.update();
					});
					gameScreen.playground.reset();
					gameScreen.bottomMenu.start();
					gameScreen.playground.start();
				});
			}
			else
			{
				const gameScreen: cuboro.screens.Game = game.screens.current;
				gameScreen.playground.stop();
				gameScreen.playground.on(cuboro.PLAYGROUND_READY, () =>
				{
					gameScreen.layers.update();
				});
				gameScreen.playground.reset();
				gameScreen.bottomMenu.start();
				gameScreen.playground.start();
			}
		}
	}
}
