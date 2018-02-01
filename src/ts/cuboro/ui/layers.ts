/// <reference path="../screens/game.ts"/>
/// <reference path="../ui/layerbutton.ts"/>



module cuboro.ui
{
	export class Layers extends gf.display.Container
	{
		protected buttons: cuboro.ui.LayerButton[];
		protected buttonsHeight: number;

		public bg: gf.display.Sprite;
		public btAll: cuboro.ui.LayerButton;
		public buttonContainer: gf.display.Container;
		public gameScreen: cuboro.screens.Game;
		public tfLayers: gf.display.Text;



		constructor(gameScreen: cuboro.screens.Game)
		{
			super(gameScreen.game);

			this.gameScreen = gameScreen;

			this.bg = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.bg.tint = cuboro.COLOR_LIGHT_GREY;
			this.bg.width = 69;
			this.addChild(this.bg);

			this.tfLayers = new gf.display.Text(this.game, loc("layers"), cuboro.TEXT_STYLE_BUTTON_ICON.clone());
			this.tfLayers.x = (this.bg.width - this.tfLayers.width) >> 1;
			this.tfLayers.visible = false;
			this.addChild(this.tfLayers);

			this.buttonContainer = new gf.display.Container(this.game);
			this.addChild(this.buttonContainer);

			this.buttons = [];
			this.buttonsHeight = 0;

			let i;
			for (i = 0; i < cuboro.MAX_Y; ++i)
			{
				let bt = new cuboro.ui.LayerButton(this.game, cuboro.MAX_Y - i);
				bt.on(gf.CLICK, () => this.onLayer(bt), this);
				bt.y = i * bt.height + i * cuboro.PADDING;
				this.buttonsHeight += bt.height + cuboro.PADDING;
				bt.visible = false;
				this.buttonContainer.addChild(bt);

				this.buttons.push(bt);
			}

			this.btAll = new cuboro.ui.LayerButton(this.game, 0);
			this.btAll.on(gf.CLICK, this.onAll, this);
			this.btAll.y = i * this.btAll.height + i * cuboro.PADDING;
			this.btAll.label = "Alle Ebenen\nanzeigen";
			this.btAll.tfLabel.anchor.y = 0;
			this.btAll.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
			this.btAll.tfLabel.y = this.btAll.icon.bottom + cuboro.PADDING;
			this.btAll.bg.height = this.btAll.tfLabel.bottom + cuboro.PADDING;
			this.buttonsHeight += this.btAll.height + cuboro.PADDING;
			this.buttonContainer.addChild(this.btAll);

			this.gameScreen.playground.on(cuboro.CUBE_UPDATE, this.update, this);
		}



		protected onAll(): void
		{
			this.buttons.forEach((value: cuboro.ui.LayerButton) =>
			{
				value.isSelected = false;
			});

			this.onLayer();
		}



		protected onLayer(bt?: cuboro.ui.LayerButton): void
		{
			if (bt)
			{
				bt.isSelected = !bt.isSelected;

				this.buttons.forEach((value: cuboro.ui.LayerButton) =>
				{
					if (value != bt) value.isSelected = false;
				});
			}

			let isButtonSelected = false;
			this.buttons.forEach((value: cuboro.ui.LayerButton) =>
			{
				if (value.isSelected)
				{
					isButtonSelected = true;
					return;
				}
			});

			const currentOpacity = this.gameScreen.playground.cubeOpacity;

			this.gameScreen.playground.cubes.cubes.forEach((value: cuboro.core.Cube) =>
			{
				value.opacity = !isButtonSelected ? currentOpacity : this.isSelected(value.mapPosition.y + 1) ? currentOpacity : 0.2;
				value.layer.visible = !isButtonSelected ? false : this.isSelected(value.mapPosition.y + 1);
			});
		}



		protected isSelected(y: number): boolean
		{
			let isSelected = false;
			this.buttons.forEach((value: cuboro.ui.LayerButton) =>
			{
				if (value.isSelected && value.layer == y)
				{
					isSelected = true;
					return;
				}
			});

			return isSelected;
		}



		public update(): void
		{
			let cubesPerLayer = [0, 0, 0, 0, 0, 0, 0, 0, 0];

			this.gameScreen.playground.cubes.cubes.forEach((value: cuboro.core.Cube) =>
			{
				cubesPerLayer[value.mapPosition.y]++;
			});

			this.buttons.forEach((value: cuboro.ui.LayerButton) =>
			{
				value.visible = cubesPerLayer[value.layer - 1] > 0;
			});

			this.tfLayers.visible = this.buttons[this.buttons.length - 1].visible;
			this.onLayer();

			this.onResize();
		}



		public reset(): void
		{
			this.buttons.forEach((value: cuboro.ui.LayerButton) =>
			{
				value.isSelected = false;
			});

			this.update();
		}



		public onResize(): void
		{
			super.onResize();

			this.bg.height = this.gameScreen.bottomMenu.y - this.game.stage.header.bg.height;

			this.tfLayers.y = this.bg.height - this.tfLayers.height - cuboro.PADDING * 2;
			this.buttonContainer.y = this.tfLayers.y - this.buttonsHeight - cuboro.PADDING * 2;
		}
	}
}
