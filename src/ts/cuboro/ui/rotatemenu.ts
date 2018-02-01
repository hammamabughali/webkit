/// <reference path="roundiconbutton.ts"/>



module cuboro.ui
{
	export class RotateMenu extends gf.display.Container
	{
		public btDown: cuboro.ui.RoundIconButton;
		public btLeft: cuboro.ui.RoundIconButton;
		public btLeftSide: cuboro.ui.RoundIconButton;
		public btRight: cuboro.ui.RoundIconButton;
		public btRightSide: cuboro.ui.RoundIconButton;
		public btUp: cuboro.ui.RoundIconButton;
		public playground: cuboro.core.Playground;



		constructor(playground: cuboro.core.Playground)
		{
			super(playground.game);

			this.interactive = true;
			this.playground = playground;

			this.btUp = new cuboro.ui.RoundIconButton(this.game, "cube_up");
			this.btUp.on(gf.CLICK, this.onUp, this);
			this.addChild(this.btUp);

			this.btDown = new cuboro.ui.RoundIconButton(this.game, "cube_down");
			this.btDown.on(gf.CLICK, this.onDown, this);
			this.addChild(this.btDown);

			this.btLeft = new cuboro.ui.RoundIconButton(this.game, "cube_left");
			this.btLeft.on(gf.CLICK, this.onLeft, this);
			this.addChild(this.btLeft);

			this.btLeftSide = new cuboro.ui.RoundIconButton(this.game, "cube_side_left");
			this.btLeftSide.on(gf.CLICK, this.onLeftSide, this);
			this.addChild(this.btLeftSide);

			this.btRight = new cuboro.ui.RoundIconButton(this.game, "cube_right");
			this.btRight.on(gf.CLICK, this.onRight, this);
			this.addChild(this.btRight);

			this.btRightSide = new cuboro.ui.RoundIconButton(this.game, "cube_side_right");
			this.btRightSide.on(gf.CLICK, this.onRightSide, this);
			this.addChild(this.btRightSide);

			this.btUp.x = this.btUp.width + 25;

			this.btLeftSide.y = this.btUp.bottom + 10;

			this.btRightSide.x = this.btUp.right + 25;
			this.btRightSide.y = this.btLeftSide.y;

			this.btLeft.y = this.btLeftSide.bottom + 20;

			this.btRight.x = this.btRightSide.x;
			this.btRight.y = this.btLeft.y;

			this.btDown.x = this.btUp.x;
			this.btDown.y = this.btLeft.bottom + 10;

			this.playground.on(cuboro.CAMERA_UPDATED, this.toScreen, this);
			this.playground.on(cuboro.CUBE_UPDATE, this.toScreen, this);

			this.visible = false;
		}



		protected onUp(): void
		{
			TweenMax.killChildTweensOf(this, true);

			if (!this.playground.controls.isDirectionX)
			{
				TweenMax.to(this.playground.cubes.selected, 0.25,
					{
						rotationX: this.playground.controls.direction * -cuboro.DEG_RAD_90,
						onComplete: () =>
						{
							this.playground.cubes.selected.resetRotationX();
							this.onRotation();
						}
					});
			}
			else
			{
				TweenMax.to(this.playground.cubes.selected, 0.25,
					{
						rotationZ: this.playground.controls.direction * -cuboro.DEG_RAD_90,
						onComplete: () =>
						{
							this.playground.cubes.selected.resetRotationZ();
							this.onRotation();
						}
					});
			}
		}



		protected onDown(): void
		{
			TweenMax.killChildTweensOf(this, true);

			if (!this.playground.controls.isDirectionX)
			{
				TweenMax.to(this.playground.cubes.selected, 0.25,
					{
						rotationX: this.playground.controls.direction * cuboro.DEG_RAD_90,
						onComplete: () =>
						{
							this.playground.cubes.selected.resetRotationX();
							this.onRotation();
						}
					});
			}
			else
			{
				TweenMax.to(this.playground.cubes.selected, 0.25,
					{
						rotationZ: this.playground.controls.direction * cuboro.DEG_RAD_90,
						onComplete: () =>
						{
							this.playground.cubes.selected.resetRotationZ();
							this.onRotation();
						}
					});
			}
		}



		protected onLeft(): void
		{
			TweenMax.killChildTweensOf(this, true);

			TweenMax.to(this.playground.cubes.selected, 0.25,
				{
					rotationY: -cuboro.DEG_RAD_90,
					onComplete: () =>
					{
						this.playground.cubes.selected.resetRotationY();
						this.onRotation();
					}
				});
		}



		protected onLeftSide(): void
		{
			TweenMax.killChildTweensOf(this, true);

			if (!this.playground.controls.isDirectionX)
			{
				TweenMax.to(this.playground.cubes.selected, 0.25,
					{
						rotationZ: this.playground.controls.direction * cuboro.DEG_RAD_90,
						onComplete: () =>
						{
							this.playground.cubes.selected.resetRotationZ();
							this.onRotation();
						}
					});
			}
			else
			{
				TweenMax.to(this.playground.cubes.selected, 0.25,
					{
						rotationX: this.playground.controls.direction * -cuboro.DEG_RAD_90,
						onComplete: () =>
						{
							this.playground.cubes.selected.resetRotationX();
							this.onRotation();
						}
					});
			}
		}



		protected onRight(): void
		{
			TweenMax.killChildTweensOf(this, true);

			TweenMax.to(this.playground.cubes.selected, 0.25,
				{
					rotationY: cuboro.DEG_RAD_90,
					onComplete: () =>
					{
						this.playground.cubes.selected.resetRotationY();
						this.onRotation();
					}
				});
		}



		protected onRightSide(): void
		{
			TweenMax.killChildTweensOf(this, true);

			if (!this.playground.controls.isDirectionX)
			{
				TweenMax.to(this.playground.cubes.selected, 0.25,
					{
						rotationZ: this.playground.controls.direction * -cuboro.DEG_RAD_90,
						onComplete: () =>
						{
							this.playground.cubes.selected.resetRotationZ();
							this.onRotation();
						}
					});
			}
			else
			{
				TweenMax.to(this.playground.cubes.selected, 0.25,
					{
						rotationX: this.playground.controls.direction * cuboro.DEG_RAD_90,
						onComplete: () =>
						{
							this.playground.cubes.selected.resetRotationX();
							this.onRotation();
						}
					});
			}
		}



		protected onRotation(): void
		{
			this.playground.history.save();
			this.playground.save();
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



		public hide(): void
		{
			this.visible = false;
		}



		public show(): void
		{
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
