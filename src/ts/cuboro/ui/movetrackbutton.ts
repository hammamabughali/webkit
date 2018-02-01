/// <reference path="iconbutton.ts"/>
/// <reference path="movetrackiconbutton.ts"/>



module cuboro.ui
{
	export class MoveTrackButton extends cuboro.ui.IconButton
	{
		protected maxX: number;
		protected maxZ: number;
		protected minX: number;
		protected minZ: number;

		public btDown: cuboro.ui.MoveTrackIconButton;
		public btLeft: cuboro.ui.MoveTrackIconButton;
		public btRight: cuboro.ui.MoveTrackIconButton;
		public btUp: cuboro.ui.MoveTrackIconButton;
		public buttons: gf.display.Container;
		public playground: cuboro.core.Playground;



		constructor(bottomMenu: cuboro.ui.BottomMenu)
		{
			super(bottomMenu.game, "move_track", loc("bt_move_track"));

			this.playground = bottomMenu.gameScreen.playground;
			this.interactiveChildren = true;
			this.hitArea = null;

			this.buttons = new gf.display.Container(this.game);
			this.buttons.interactive = true;
			this.buttons.x = -2;
			this.buttons.y = -262;
			this.buttons.visible = false;
			this.addChildAt(this.buttons, 0);

			const border = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			border.width = this.bg.width + 4;
			border.height = 262;
			border.tint = cuboro.COLOR_LIGHT_GREY;
			this.buttons.addChild(border);

			const bg = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			bg.width = this.bg.width;
			bg.height = 260;
			bg.x = 2;
			bg.y = 2;
			bg.tint = cuboro.COLOR_YELLOW;
			this.buttons.addChild(bg);

			this.btUp = new cuboro.ui.MoveTrackIconButton(this.game);
			this.btUp.on(gf.CLICK, this.onUp, this);
			this.btUp.icon.angle = -90;
			this.btUp.x = 2;
			this.btUp.y = 2;
			this.buttons.addChild(this.btUp);

			this.btRight = new cuboro.ui.MoveTrackIconButton(this.game);
			this.btRight.on(gf.CLICK, this.onRight, this);
			this.btRight.x = 2;
			this.btRight.y = 67;
			this.buttons.addChild(this.btRight);

			this.btLeft = new cuboro.ui.MoveTrackIconButton(this.game);
			this.btLeft.on(gf.CLICK, this.onLeft, this);
			this.btLeft.icon.angle = 180;
			this.btLeft.x = 2;
			this.btLeft.y = 132;
			this.buttons.addChild(this.btLeft);

			this.btDown = new cuboro.ui.MoveTrackIconButton(this.game);
			this.btDown.on(gf.CLICK, this.onDown, this);
			this.btDown.icon.angle = 90;
			this.btDown.x = 2;
			this.btDown.y = 197;
			this.buttons.addChild(this.btDown);

			const hit = new gf.display.Sprite(this.game, PIXI.Texture.EMPTY);
			hit.interactive = true;
			hit.buttonMode = true;
			hit.width = this.bg.width;
			hit.height = this.bg.height;
			hit.on("click tap", this.onMoveTrack, this);
			this.addChild(hit);
		}



		protected onClickOutside(e: PIXI.interaction.InteractionEvent): void
		{
			if (!this.isSelected) return;

			const pos = e.data.getLocalPosition(this);
			if (!this.getLocalBounds().contains(pos.x, pos.y))
			{
				this.onMoveTrack();
			}
		}



		protected getLimits(): void
		{
			this.maxX = -1;
			this.maxZ = -1;
			this.minX = -1;
			this.minZ = -1;

			this.playground.cubes.cubes.forEach((value: cuboro.core.Cube) =>
			{
				this.maxX = this.maxX == -1 ? value.mapPosition.x : Math.max(this.maxX, value.mapPosition.x);
				this.maxZ = this.maxZ == -1 ? value.mapPosition.z : Math.max(this.maxZ, value.mapPosition.z);
				this.minX = this.minX == -1 ? value.mapPosition.x : Math.min(this.minX, value.mapPosition.x);
				this.minZ = this.minZ == -1 ? value.mapPosition.z : Math.min(this.minZ, value.mapPosition.z);
			});
		}



		protected moveCubes(x: number, z: number): void
		{
			if (this.playground.controls.isDirectionX)
			{
				const tx = x;
				x = z;
				z = tx;

				if (this.playground.controls.direction == 1) x *= -1;
				if (this.playground.controls.direction == -1) z *= -1;
			}
			else
			{
				x *= this.playground.controls.direction;
				z *= this.playground.controls.direction;
			}

			if (this.minX + x < 0) return;
			if (this.minZ + z < 0) return;
			if (this.maxX + x >= cuboro.MAX_X) return;
			if (this.maxZ + z >= cuboro.MAX_Z) return;

			this.playground.cubes.cubes.forEach((value: cuboro.core.Cube) =>
			{
				this.playground.map.setAt(cuboro.EMPTY, value.mapPosition.x, value.mapPosition.y, value.mapPosition.z);
				value.mapPosition.x += x;
				value.mapPosition.z += z;
			});

			this.playground.cubes.cubes.forEach((value: cuboro.core.Cube) =>
			{
				this.playground.map.setAt(value.id, value.mapPosition.x, value.mapPosition.y, value.mapPosition.z);
				this.playground.cubes.updatePosition(value);
			});

			this.playground.save();
			this.playground.history.save();

			this.getLimits();
		}



		protected onDown(): void
		{
			this.getLimits();
			this.moveCubes(0, 1);
			this.playground.emit(cuboro.CUBE_UPDATE);
		}



		protected onLeft(): void
		{
			this.getLimits();
			this.moveCubes(-1, 0);
			this.playground.emit(cuboro.CUBE_UPDATE);
		}



		protected onRight(): void
		{
			this.getLimits();
			this.moveCubes(1, 0);
			this.playground.emit(cuboro.CUBE_UPDATE);
		}



		protected onUp(): void
		{
			this.getLimits();
			this.moveCubes(0, -1);
			this.playground.emit(cuboro.CUBE_UPDATE);
		}



		public onMoveTrack(): void
		{
			this.isSelected = !this.isSelected;
			this.buttons.visible = this.isSelected;

			if (this.isSelected)
				this.game.stage.on("mousedown touchstart", this.onClickOutside, this);
			else
				this.game.stage.off("mousedown touchstart", this.onClickOutside);
		}
	}
}
