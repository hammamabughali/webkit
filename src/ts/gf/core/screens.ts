/// <reference path="../core/game.ts"/>
/// <reference path="../display/container.ts"/>
/// <reference path="../screens/screen.ts"/>



module gf.core
{
	export class Screens extends gf.display.Container
	{
		protected _currentName:string;
		protected _previousName:string;
		protected _screens: { [name:string]: gf.screens.Screen };



		constructor(game: gf.core.Game)
		{
			super(game);

			this.name = "screens";

			this._screens = {};
			this.interactive = true;
		}



		protected add(name:string, screen: gf.screens.Screen):void
		{
			this._screens[name] = screen;
			screen.name = name;
			this.addChild(screen);
		}



		public init():void
		{
			this.game.stage.addChild(this);
			if (!this.game.client.config.screens) return;

			let screen:any;
			for (let i:number = 0; i < this.game.client.config.screens.length; ++i)
			{
				screen = this.game.client.config.screens[i];
				if (screen.name && screen.class)
					this.add(screen.name, new screen.class(this.game));
				else
					this.add(screen.NAME, new screen(this.game));
			}
		}



		public show(name:string):any
		{
			if (!this._currentName)
			{
				this._currentName = name;
				this.getScreen(name).transitionIn();
				return this.current;
			}

			if (this._currentName == name)
			{
				this.current.transitionIn();
				return this.current;
			}

			let currentScreen: gf.screens.Screen = this.getScreen(this._currentName);
			let nextScreen: gf.screens.Screen = this.getScreen(name);

			if (!nextScreen)
			{
				logWarning("Error: gf.core.Screens.show(). No screen found with name: \"" + name + "\"");
				return;
			}

			this._previousName = this._currentName;

			currentScreen.once(gf.TRANSITION_OUT_COMPLETE, () =>
			{
				this._currentName = nextScreen.name;
				nextScreen.transitionIn();
				this.emit(gf.SCREEN, nextScreen, nextScreen.name);
			}, this);
			currentScreen.transitionOut();

			return nextScreen;
		}



		public hide(name:string):any
		{
			this.getScreen(name).transitionOut();

			return this.getScreen(name);
		}



		public showPrevious():any
		{
			if (!this._previousName || this._previousName === this._currentName)
			{
				if (!this._previousName)
				{
					logWarning("Error: gf.core.Screens.showPrevious(). No previous screen available.");
				}
				else
				{
					logWarning("Error: gf.core.Screens.showPrevious(). Current screen is equal to previous screen.");
				}
				return null;
			}

			return this.show(this._previousName);
		}



		public getScreen(name:string):any
		{
			if (!this._screens[name])
				logWarning("Error: gf.core.Screens.getScreen(). No screen with name \"" + name + "\" found.");

			return this._screens[name];
		}



		public hasScreen(name:string):boolean
		{
			return !!this._screens[name];
		}



		public onResize():void
		{
			let screen: gf.screens.Screen;
			for (let name in this._screens)
			{
				screen = this._screens[name];
				if (screen.isActive)
				{
					this._screens[name].onResize();
				}
			}
		}



		public get currentName():string
		{
			return this._currentName;
		}



		public get current():any
		{
			return this.getScreen(this._currentName);
		}



		public get previous():any
		{
			return this.getScreen(this._previousName);
		}
	}
}
