/// <reference path="../utils/maths.ts"/>



module cuboro.core
{
	export class Select
	{
		protected _cubeSpawning: boolean;
		protected _lastX: number;
		protected _lastY: number;
		protected _marbleTween: TweenMax;
		protected _marbleSpawning: boolean;
		protected _startX: number;
		protected _startY: number;

		public interaction: cuboro.core.Interaction;
		public playground: cuboro.core.Playground;
		public raycaster: THREE.Raycaster;
		public mouse: THREE.Vector2;
		public offset: THREE.Vector3;
		public offsetX: number;
		public offsetY: number;
		public intersection: THREE.Object3D;
		public intersections: THREE.Intersection[];
		public plane: THREE.Mesh;



		constructor(playground: cuboro.core.Playground)
		{
			this.playground = playground;
			this.raycaster = new THREE.Raycaster();
			this.mouse = new THREE.Vector2();
			this.offset = new THREE.Vector3();

			this.plane = new THREE.Mesh(
				new THREE.PlaneBufferGeometry(2000, 2000, 8, 8),
				new THREE.MeshBasicMaterial({color: 0x00FF00})
			);
			this.plane.visible = false;
			this.playground.scene.add(this.plane);

			if (!navigator["isCocoonJS"])
			{
				let container: JQuery = $("#kr3m");
				this.offsetX = container.offset().left;
				this.offsetY = container.offset().top;
			}
			else
			{
				this.offsetX = this.offsetY = 0;
			}

			this.interaction = this.playground.gameScreen.interaction;

			this.interaction.on("onMouseDown", this.onDown, this);
			this.interaction.on("onMouseMove", this.onMove, this);
			this.interaction.on("onMouseUp", this.onUp, this);
			this.interaction.on("onTouchStart", this.onDown, this);
			this.interaction.on("onTouchMove", this.onMove, this);
			this.interaction.on("onTouchEnd", this.onUp, this);
		}



		/**
		 * Gets the mouse point in 3D for the XZ plane (Y == 0).
		 * @returns {THREE.Vector3}
		 */
		protected getMouse3D(): THREE.Vector3
		{
			this.mouse.x = ((this._lastX - this.offsetX) / (this.playground.game.width * this.playground.game.scaleX)) * 2 - 1;
			this.mouse.y = -((this._lastY - this.offsetY) / (this.playground.game.height * this.playground.game.scaleY)) * 2 + 1;

			let pos = new THREE.Vector3(0, 0, 0);
			let pMouse = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);

			pMouse.unproject(this.playground.camera);

			let cam = this.playground.camera.position;
			let m = pMouse.y / (pMouse.y - cam.y);

			pos.x = pMouse.x + (cam.x - pMouse.x) * m;
			pos.z = pMouse.z + (cam.z - pMouse.z) * m;

			return pos;
		}



		protected spawnCubeFromList(): void
		{
			const list = this.playground.gameScreen.bottomMenu.cubeList;
			const listItem = list.currentItem;

			// Cube in list selected, place cube on tile clicked
			if (listItem && listItem.remaining > 0)
			{
				// Decrease remaining amount
				listItem.remaining--;
				const cube = new cuboro.core.Cube(this.playground, listItem.key);
				const mapX = this.intersection.userData.x;
				const mapZ = this.intersection.userData.z;
				cube.x = this.playground.map.xTo3DPos(mapX);
				cube.z = this.playground.map.zTo3DPos(mapZ);
				cube.y = this.playground.map.to3DPos(mapX, this.playground.map.getNextEmptyY(mapX, mapZ), mapZ).y;
				cube.mapPosition = this.playground.map.toMapPos(cube.x, cube.y, cube.z);
				this.playground.cubes.update(cube);

				this.playground.cubes.selected = cube;

				list.deselectItems();
				this.playground.placeables.hide();
			}
		}



		protected onMove(e: any): void
		{
			if (this.playground.physicsEnabled) return;

			this.mouse.x = ((this.getX(e) - this.offsetX) / (this.playground.game.width * this.playground.game.scaleX)) * 2 - 1;
			this.mouse.y = -((this.getY(e) - this.offsetY) / (this.playground.game.height * this.playground.game.scaleY)) * 2 + 1;

			this.raycaster.setFromCamera(this.mouse, this.playground.camera);

			// Get intersected objects
			this.intersections = this.raycaster.intersectObjects(this.playground.scene.children);

			if (this._marbleSpawning)
			{
				// Marble selected, move it
				this.moveMarble();
			}
			else if (this.playground.cubes.down && this.interactionDistance > 10)
			{
				// Cube down, move it
				this.moveCube();
			}
			else
			{
				// Check over states
				this.onOver();
			}
		}



		protected onOver(): void
		{
			if (this.playground.physicsEnabled) return;

			if (this.intersections.length > 0)
			{
				// Select first intersection
				if (this.intersection != this.intersections[0].object)
				{
					this.intersection = this.intersections[0].object;

					if (this.isCube)
					{
						this.playground.cubes.over = this.intersection.userData.cube;
					}
					else
					{
						this.playground.cubes.over = null;
					}

					this.plane.position.copy(this.intersection.position);
					this.plane.lookAt(this.playground.camera.position);
				}

				this.interaction.buttonMode = true;
			}
			else
			{
				this.intersection = null;
				this.playground.cubes.over = null;
				this.interaction.buttonMode = false;
			}
		}



		protected onDown(e: any): void
		{
			if (this.playground.physicsEnabled) return;

			// Perform move and over because of mobile devices
			this.onMove(e);
			this.onOver();

			this._startX = this.getX(e);
			this._startY = this.getY(e);

			this.getMouse3D();

			if (!this._marbleSpawning && this.isCube)
			{
				// Cube down state, deactivate camera movement
				this.playground.controls.enabled = false;
				this.playground.cubes.down = this.intersection.userData.cube;
				this.playground.map.setAt(cuboro.EMPTY, this.playground.cubes.down.mapPosition);
			}
			else if (!this._marbleSpawning && this.isPlaceable)
			{
				if (this.playground.cubes.selected)
				{
					const cubePos = this.playground.cubes.selected.mapPosition;
					const placeablePos = this.intersection.userData;

					if (placeablePos.x == cubePos.x && placeablePos.z == cubePos.z)
					{
						this.playground.controls.enabled = false;
						this.playground.cubes.down = this.playground.cubes.selected;
						this.playground.map.setAt(cuboro.EMPTY, this.playground.cubes.down.mapPosition);
					}
				}
			}
		}



		protected onUp(e: any): void
		{
			if (this.playground.physicsEnabled) return;

			this.onMove(e);

			// Enable camera movement
			this.playground.controls.enabled = true;

			if (this._cubeSpawning) this.intersection = this.playground.cubes.down.mesh;
			if (this._marbleSpawning) this.intersection = this.playground.marble.mesh;

			if (!this._marbleSpawning && (this.playground.cubes.down || this.isCube))
			{
				this.placeCube();
			}
			else if (this.isPlaceable)
			{
				const mapX = this.intersection.userData.x;
				const mapZ = this.intersection.userData.z;
				const isValidY = this.playground.map.isValidY(this.playground.map.getNextEmptyY(mapX, mapZ));

				if (this.interactionDistance < 10 && this.playground.gameScreen.bottomMenu.cubeList.currentItem != null && isValidY)
				{
					// Click an a placeable, if list item selected spawn cube on the placeable
					this.spawnCubeFromList();
					this.playground.history.save();
				}
				if (this.playground.cubes.selected && this.interactionDistance < 10 && this.playground.gameScreen.moveMenu.visible && isValidY)
				{
					// No cube in list selected, move selected cube on stage to placeable
					this.moveCubeByPos();
					this.playground.history.save();
				}
			}
			else if (this.isMarble)
			{
				this.placeMarble();
			}
			else if (this.isGround)
			{
				this.deselectCube();
			}
			else
			{
				this.deselectCube();
			}

			this.interaction.buttonMode = false;
		}



		protected placeCube(): void
		{
			const cube = this.playground.cubes.down || this.intersection.userData.cube;

			if (!this.isCubeOnMap(cube))
			{
				// Cube is not on the map, remove it
				this.playground.cubes.remove(cube);
				this.playground.history.save();
			}
			else if (this.isDownSameAsUp && this.interactionDistance < 10)
			{
				// It's a click on the cube to select or deselect it
				if (this.playground.cubes.swapping)
				{
					this.playground.cubes.swap(cube);

					// Disable swap
					this.playground.cubes.swapping = null;
					this.playground.gameScreen.bottomMenu.btSwap.isSelected = false;

					this.playground.history.save();
					this.playground.save();
				}
				else
				{
					this.playground.cubes.selected = cube;
					this.playground.cubes.update(cube);
				}
			}
			else
			{
				// Cube was only moved or spawned and moved
				if (this._cubeSpawning)
				{
					this.playground.cubes.selected = cube;
					this.playground.gameScreen.bottomMenu.cubeList.deselectItems();
					this.playground.placeables.hide();
				}

				this.playground.cubes.update(cube);
				this.playground.history.save();
				this.playground.save();
			}

			this.playground.cubes.down = null;
			this._cubeSpawning = false;
		}



		protected placeMarble(): void
		{
			if (!this.canMarbleStart)
			{
				// Invalid drop for marble
				this.playground.marble.mesh.visible = false;
			}
			else
			{
				// Start marble run
				if (this._marbleTween)
				{
					this._marbleTween.progress(1);
					this._marbleTween.kill();
				}
				this.playground.marble.start();
			}

			this._marbleSpawning = false;
			this.playground.cubes.highlightMarble(false);
			this.playground.gameScreen.bottomMenu.onMarbleUp();
		}



		protected deselectCube(): void
		{
			if (this.playground.cubes.selected)
				this.playground.cubes.selected = null;

			if (this.playground.cubes.swapping)
				this.playground.cubes.swapping = null;

			if (!this.playground.gameScreen.bottomMenu.cubeList.currentItem)
				this.playground.placeables.hide();
		}



		protected moveMarble(): void
		{
			let position: THREE.Vector3 = this.getMouse3D();

			this.intersection = this.playground.marble.mesh;

			let cube: cuboro.core.Cube;
			const intersectionCount = this.intersections.length;

			for (let i: number = 0; i < intersectionCount; ++i)
			{
				if (this.intersections[i].object.name.indexOf("cube") != -1 && !cube)
				{
					cube = this.intersections[i].object.userData.cube;
				}
			}

			if (cube)
			{
				const mapY = this.playground.map.getNextEmptyY(cube.mapPosition.x, cube.mapPosition.z);
				position = this.playground.map.to3DPos(cube.mapPosition.x, mapY, cube.mapPosition.z);
				position.y += cuboro.MARBLE_DROP_HEIGHTS[this.playground.gameScreen.bottomMenu.btDropHeight.dropHeight];
				this._marbleTween = TweenMax.to(this.playground.marble, 0.15,
					{
						x: position.x,
						y: position.y,
						z: position.z
					});
			}
			else
			{
				const mapPos: THREE.Vector3 = this.playground.map.toMapPos(position.x, this.playground.marble.y, position.z);
				const mapY = this.playground.map.getNextEmptyY(mapPos.x, mapPos.z);

				if (mapY != null && this.playground.map.isValidY(mapY))
				{
					position = this.playground.map.to3DPos(mapPos.x, mapY, mapPos.z);
					position.y += cuboro.MARBLE_DROP_HEIGHTS[this.playground.gameScreen.bottomMenu.btDropHeight.dropHeight];
					this._marbleTween = TweenMax.to(this.playground.marble, 0.15,
						{
							x: position.x,
							y: position.y,
							z: position.z
						});
				}
			}
		}



		protected moveCube(): void
		{
			let position: THREE.Vector3 = this.getMouse3D();

			const cube = this.playground.cubes.down;

			if (this._cubeSpawning) this.intersection = this.playground.cubes.down.mesh;

			let hitCube: cuboro.core.Cube;
			let intersection;
			const intersectionCount = this.intersections.length;

			for (let i: number = 0; i < intersectionCount; ++i)
			{
				intersection = this.intersections[i].object;
				if (intersection.name.indexOf("cube") != -1 && !hitCube && intersection.userData.cube != cube)
				{
					hitCube = intersection.userData.cube;
				}
			}

			if (hitCube)
			{
				const mapY = this.playground.map.getNextEmptyY(hitCube.mapPosition.x, hitCube.mapPosition.z);
				position = this.playground.map.to3DPos(hitCube.mapPosition.x, mapY, hitCube.mapPosition.z);

				if (this.playground.map.isValidY(mapY))
				{
					cube.mapPosition.set(hitCube.mapPosition.x, mapY, hitCube.mapPosition.z);

					TweenMax.to(cube, 0.25,
						{
							x: position.x,
							y: position.y,
							z: position.z,
							onComplete: () => this.playground.emit(cuboro.CUBE_UPDATE)
						});
				}
			}
			else if (this.isCubeOnMap(cube))
			{
				const mapPos: THREE.Vector3 = this.playground.map.toMapPos(position.x, cube.y, position.z);
				const mapY = this.playground.map.getNextEmptyY(mapPos.x, mapPos.z);

				if (mapY != null && this.playground.map.isValidY(mapY))
				{
					position = this.playground.map.to3DPos(mapPos.x, mapY, mapPos.z);

					cube.mapPosition.set(mapPos.x, mapY, mapPos.z);

					TweenMax.to(cube, 0.25,
						{
							x: position.x,
							y: position.y,
							z: position.z,
							onComplete: () => this.playground.emit(cuboro.CUBE_UPDATE)
						});
				}
			}
			else
			{
				cube.x = position.x;
				cube.z = position.z;
			}
		}



		protected moveCubeByPos(): void
		{
			let position = this.getMouse3D();
			const cube = this.playground.cubes.selected;

			const mapPos: THREE.Vector3 = this.playground.map.toMapPos(position.x, position.y, position.z);
			const mapY = this.playground.map.getNextEmptyY(mapPos.x, mapPos.z);

			if (mapY != null && this.playground.map.isValidY(mapY))
			{
				this.playground.map.setAt(cuboro.EMPTY, cube.mapPosition);

				position = this.playground.map.to3DPos(mapPos.x, mapY, mapPos.z);
				cube.mapPosition.set(mapPos.x, mapY, mapPos.z);
				this.playground.map.map[mapPos.x][mapY][mapPos.z] = cube.id;

				TweenMax.to(cube, 0.25,
					{
						x: position.x,
						y: position.y,
						z: position.z,
						onComplete: () => this.playground.emit(cuboro.CUBE_UPDATE),
					});

				this.playground.placeables.update();
			}
		}



		protected getIntersects(): THREE.Intersection[]
		{
			let vector: THREE.Vector3 = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5).unproject(this.playground.camera);
			let raycaster: THREE.Raycaster = new THREE.Raycaster(this.playground.camera.position, vector.sub(this.playground.camera.position).normalize());

			return raycaster.intersectObjects(this.playground.scene.children);
		}



		public spawnCube(e: any, key: string): void
		{
			this._cubeSpawning = true;

			this._startX = this._lastX = this.getX(e);
			this._startY = this._lastY = this.getY(e);

			const position = this.getMouse3D();

			this.playground.cubes.down = new cuboro.core.Cube(this.playground, key);
			this.playground.cubes.down.x = position.x;
			this.playground.cubes.down.y = 1;
			this.playground.cubes.down.z = position.z;

			this.moveCube();
		}



		public spawnMarble(e: any): void
		{
			this.playground.resetView();

			this._marbleSpawning = true;

			this._startX = this._lastX = this.getX(e);
			this._startY = this._lastY = this.getY(e);

			const position: THREE.Vector3 = this.getMouse3D();

			this.playground.marble.x = position.x;
			this.playground.marble.y = 1;
			this.playground.marble.z = position.z;

			this.playground.marble.mesh.visible = true;
			this.playground.cubes.highlightMarble(true);
		}



		public getX(e: any): number
		{
			this._lastX = (e.touches && e.touches.length > 0) ? e.touches[0].pageX : e.pageX || (e.clientX || this._lastX);
			return this._lastX;
		}



		public getY(e: any): number
		{
			this._lastY = (e.touches && e.touches.length > 0) ? e.touches[0].pageY : e.pageY || (e.clientY || this._lastY);
			return this._lastY;
		}



		protected isCubeOnMap(cube: cuboro.core.Cube): boolean
		{
			const onMap = this.playground.map.onMap3D(cube.x, cube.z);

			if (!onMap) return false;

			const mapPosition = cube.mapPosition;

			return this.playground.map.isValid(mapPosition.x, mapPosition.y, mapPosition.z)
		}



		protected get canMarbleStart(): boolean
		{
			const marbleMap = this.playground.map.toMapPos(this.playground.marble.mesh.position);
			const cube = this.playground.cubes.getHighestCube(marbleMap.x, marbleMap.z);

			return (!!cube);
		}



		protected get isCube(): boolean
		{
			if (!this.intersection) return false;

			return this.intersection.name.indexOf("cube") != -1;
		}



		protected get isGround(): boolean
		{
			if (!this.intersection) return false;

			return this.intersection.name.indexOf("ground") != -1;
		}



		protected get isMarble(): boolean
		{
			if (!this.intersection) return false;

			return this.intersection.name == "marble";
		}



		protected get isPlaceable(): boolean
		{
			if (!this.intersection) return false;

			return this.intersection.name.indexOf("placeable") != -1;
		}



		protected get isDownSameAsUp(): boolean
		{
			if (!this.playground.cubes.down) return false;
			if (!this.intersection) return false;
			if (!this.intersection.userData.cube) return false;

			return this.playground.cubes.down == this.intersection.userData.cube
		}



		protected get interactionDistance(): number
		{
			return gf.utils.Maths.distance(this._startX, this._startY, this._lastX, this._lastY);
		}
	}
}
