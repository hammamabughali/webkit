/// <reference path="roundiconbutton.ts"/>



module cuboro.ui
{
	export class MoveMenu extends gf.display.Container
	{
		public btDown: cuboro.ui.RoundIconButton;
		public btLeft: cuboro.ui.RoundIconButton;
		public btRight: cuboro.ui.RoundIconButton;
		public btUp: cuboro.ui.RoundIconButton;
		public playground: cuboro.core.Playground;



		constructor(playground: cuboro.core.Playground)
		{
			super(playground.game);

			this.interactive = true;
			this.playground = playground;

			this.btUp = new cuboro.ui.RoundIconButton(this.game, "arrow");
			this.btUp.on(gf.CLICK, this.onUp, this);
			this.btUp.icon.angle = -90;
			this.addChild(this.btUp);

			this.btLeft = new cuboro.ui.RoundIconButton(this.game, "arrow");
			this.btLeft.on(gf.CLICK, this.onLeft, this);
			this.btLeft.icon.angle = 180;
			this.addChild(this.btLeft);

			this.btRight = new cuboro.ui.RoundIconButton(this.game, "arrow");
			this.btRight.on(gf.CLICK, this.onRight, this);
			this.addChild(this.btRight);

			this.btDown = new cuboro.ui.RoundIconButton(this.game, "arrow");
			this.btDown.on(gf.CLICK, this.onDown, this);
			this.btDown.icon.angle = 90;
			this.addChild(this.btDown);

			this.btUp.x = this.btUp.width + 25;

			this.btLeft.y = this.btUp.bottom + 10;

			this.btRight.x = this.btUp.right + 25;
			this.btRight.y = this.btLeft.y;

			this.btDown.x = this.btUp.x;
			this.btDown.y = this.btLeft.bottom + 10;

			this.playground.on(cuboro.CAMERA_UPDATED, this.toScreen, this);
			this.playground.on(cuboro.CUBE_UPDATE, this.toScreen, this);

			this.visible = false;
		}



		protected isValidY(x:number, z:number):boolean
		{
			return this.playground.map.getNextEmptyY(x, z) < cuboro.MAX_Y;
		}



		protected update(cube?: cuboro.core.Cube):void
		{
			if (!cube) cube = this.playground.cubes.selected;

			if (this.playground.map.getAt(cube.mapPosition) != cuboro.EMPTY)
			{
				cube.mapPosition.y = this.playground.map.getNextEmptyY(cube.mapPosition.x, cube.mapPosition.z);
			}

			TweenMax.to(cube, 0.25,
			{
				x: this.playground.map.xTo3DPos(cube.mapPosition.x),
				y: this.playground.map.yTo3DPos(cube.mapPosition.y),
				z: this.playground.map.zTo3DPos(cube.mapPosition.z),
				onUpdate: () => this.playground.emit(cuboro.CUBE_UPDATE)
			});

			this.playground.cubes.update(cube);
			this.updateButtons();
			this.playground.history.save();
		}



		protected onUp():void
		{
			const cube = this.playground.cubes.selected;

			this.playground.map.setAt(cuboro.EMPTY, cube.mapPosition);

			if (this.playground.controls.isDirectionX)
			{
				cube.mapPosition.x = Math.max(0, Math.min(cuboro.MAX_X - 1, cube.mapPosition.x + this.playground.controls.direction));
			}
			else
			{
				cube.mapPosition.z = Math.max(0, Math.min(cuboro.MAX_Z - 1, cube.mapPosition.z - this.playground.controls.direction));
			}

			this.update(cube);
		}



		protected onLeft():void
		{
			const cube = this.playground.cubes.selected;

			this.playground.map.setAt(cuboro.EMPTY, cube.mapPosition);

			if (this.playground.controls.isDirectionX)
			{
				cube.mapPosition.z = Math.max(0, Math.min(cuboro.MAX_Z - 1, cube.mapPosition.z - this.playground.controls.direction));
			}
			else
			{
				cube.mapPosition.x = Math.max(0, Math.min(cuboro.MAX_X - 1, cube.mapPosition.x - this.playground.controls.direction));
			}

			this.update(cube);
		}



		protected onRight():void
		{
			const cube = this.playground.cubes.selected;

			this.playground.map.setAt(cuboro.EMPTY, cube.mapPosition);

			if (this.playground.controls.isDirectionX)
			{
				cube.mapPosition.z = Math.max(0, Math.min(cuboro.MAX_Z - 1, cube.mapPosition.z + this.playground.controls.direction));
			}
			else
			{
				cube.mapPosition.x = Math.max(0, Math.min(cuboro.MAX_X - 1, cube.mapPosition.x + this.playground.controls.direction));
			}

			this.update(cube);
		}



		protected onDown():void
		{
			const cube = this.playground.cubes.selected;

			this.playground.map.setAt(cuboro.EMPTY, cube.mapPosition);

			if (this.playground.controls.isDirectionX)
			{
				cube.mapPosition.x = Math.max(0, Math.min(cuboro.MAX_X - 1, cube.mapPosition.x - this.playground.controls.direction));
			}
			else
			{
				cube.mapPosition.z = Math.max(0, Math.min(cuboro.MAX_Z - 1, cube.mapPosition.z + this.playground.controls.direction));
			}

			this.update(cube);
		}



		protected toScreen(): void
		{
			if (!this.visible) return;
			if (!this.playground.cubes.selected) return;

			const vector = new THREE.Vector3();
			const widthHalf = 0.5 * (this.playground.canvas.renderer.context.canvas.width / this.game.scaleX);
			const heightHalf = 0.5 * (this.playground.canvas.renderer.context.canvas.height / this.game.scaleY);

			this.playground.cubes.selected.mesh.updateMatrixWorld(true);
			vector.setFromMatrixPosition(this.playground.cubes.selected.mesh.matrixWorld);
			vector.project(this.playground.camera);

			vector.x = ((vector.x * widthHalf) + widthHalf) / this.game.client.config.resolution;
			vector.y = (-(vector.y * heightHalf) + heightHalf) / this.game.client.config.resolution;

			this.x = vector.x - (this.width >> 1);
			this.y = vector.y - (this.height >> 1);
			this.updateButtons();
			this.checkBounds();
		}



		protected checkBounds(): void
		{
			const right = this.x < this.playground.gameScreen.layers.right;
			const left = this.right > this.game.width;
			const up = this.bottom > this.playground.gameScreen.bottomMenu.y;
			const down = this.y < this.game.stage.header.bottom;

			let moved = false;

			if (!right && left)
			{
				this.playground.controls.panLeft(-1);
				moved = true;
			}
			else if (right && !left)
			{
				this.playground.controls.panLeft(1);
				moved = true;
			}
			if (!up && down)
			{
				this.playground.controls.panUp(1);
				moved = true;
			}
			else if (up && !down)
			{
				this.playground.controls.panUp(-1);
				moved = true;
			}

			if (moved) this.playground.once(cuboro.CAMERA_UPDATE, this.toScreen, this);
		}



		public updateButtons():void
		{
			const cube = this.playground.cubes.selected;

			if (!cube) return;

			let next:number;

			if (this.playground.controls.isDirectionX)
			{
				next = cube.mapPosition.x + this.playground.controls.direction;
				this.btUp.isEnabled = this.playground.map.isValidX(next);
				if (!this.isValidY(next, cube.mapPosition.z)) this.btUp.isEnabled = false;

				next = cube.mapPosition.z - this.playground.controls.direction;
				this.btLeft.isEnabled = this.playground.map.isValidZ(next);
				if (!this.isValidY(cube.mapPosition.x, next)) this.btLeft.isEnabled = false;

				next = cube.mapPosition.z + this.playground.controls.direction;
				this.btRight.isEnabled = this.playground.map.isValidZ(next);
				if (!this.isValidY(cube.mapPosition.x, next)) this.btRight.isEnabled = false;

				next = cube.mapPosition.x - this.playground.controls.direction;
				this.btDown.isEnabled = this.playground.map.isValidX(next);
				if (!this.isValidY(next, cube.mapPosition.z)) this.btDown.isEnabled = false;
			}
			else
			{
				next = cube.mapPosition.z - this.playground.controls.direction;
				this.btUp.isEnabled = this.playground.map.isValidZ(next);
				if (!this.isValidY(cube.mapPosition.x, next)) this.btUp.isEnabled = false;

				next = cube.mapPosition.x - this.playground.controls.direction;
				this.btLeft.isEnabled = this.playground.map.isValidX(next);
				if (!this.isValidY(next, cube.mapPosition.z)) this.btLeft.isEnabled = false;

				next = cube.mapPosition.x + this.playground.controls.direction;
				this.btRight.isEnabled = this.playground.map.isValidX(next);
				if (!this.isValidY(next, cube.mapPosition.z)) this.btRight.isEnabled = false;

				next = cube.mapPosition.z + this.playground.controls.direction;
				this.btDown.isEnabled = this.playground.map.isValidZ(next);
				if (!this.isValidY(cube.mapPosition.x, next)) this.btDown.isEnabled = false;
			}
		}



		public hide():void
		{
			if (this.visible)
			{
				this.playground.placeables.hide();
				if (this.playground.cubes.selected)
					this.playground.gameScreen.rotateMenu.show();
			}
			this.visible = false;
		}



		public show():void
		{
			this.playground.placeables.show();
			this.playground.gameScreen.rotateMenu.hide();
			this.visible = true;
			this.toScreen();
		}



		public onResize(): void
		{
			super.onResize();

			this.toScreen();
		}
	}
}
