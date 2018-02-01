/// <reference path="../core/game.ts"/>
/// <reference path="../display/container.ts"/>
/// <reference path="../overlays/overlay.ts"/>



module gf.core
{
	export class Overlays extends gf.display.Container
	{
		protected _overlays: { [name: string]: gf.overlays.Overlay };



		constructor(game: gf.core.Game)
		{
			super(game);

			this.name = "overlays";

			this._overlays = {};
			this.interactive = true;
		}



		protected add(name: string, overlay: gf.screens.Screen): void
		{
			this._overlays[name] = overlay;
			overlay.name = name;
			this.addChild(overlay);
		}



		public init(): void
		{
			this.game.stage.addChild(this);
			if (!this.game.client.config.overlays) return;

			let overlay: any;
			for (let i: number = 0; i < this.game.client.config.overlays.length; ++i)
			{
				overlay = this.game.client.config.overlays[i];
				if (overlay.name && overlay.class)
					this.add(overlay.name, new overlay.class(this.game));
				else
					this.add(overlay.NAME, new overlay(this.game));
			}
		}



		public show(name: string): any
		{
			let overlay: gf.overlays.Overlay = this.getOverlay(name);

			if (!overlay)
			{
				logWarning("Error: gf.core.Overlays.show(). No overlay found with name: " + name);
				return;
			}

			this.swapChildren(this.getChildAt(this.children.length - 1), overlay);
			overlay.transitionIn();

			return overlay;
		}



		public hide(name: string): gf.overlays.Overlay
		{
			let overlay: gf.overlays.Overlay = this.getOverlay(name);

			if (overlay)
			{
				this.getOverlay(name).transitionOut();
				return this.getOverlay(name);
			}

			return null;
		}



		public getOverlay(name: string): any
		{
			if (!this._overlays[name])
				logWarning("Error: gf.core.Overlays.getOverlay(). No overlay with name \"" + name + "\" found.");

			return this._overlays[name];
		}



		public onResize(): void
		{
			let overlay: gf.overlays.Overlay;
			for (let name in this._overlays)
			{
				overlay = this._overlays[name];
				if (overlay.isActive)
				{
					this._overlays[name].onResize();
				}
			}
		}
	}
}
