/// <reference path="../../kr3m/util/json.ts"/>



module cuboro.core
{
	export class Cubes
	{
		private _over: cuboro.core.Cube;
		private _down: cuboro.core.Cube;
		private _selected: cuboro.core.Cube;
		private _swapping: cuboro.core.Cube;

		public cubes: cuboro.core.Cube[];
		public playground: cuboro.core.Playground;



		constructor(playground: cuboro.core.Playground)
		{
			this.playground = playground;
			this.cubes = [];
		}



		public remove(cube?: cuboro.core.Cube): void
		{
			if (!cube) cube = this.selected;
			if (!cube) return;

			this.playground.map.setAt(cuboro.EMPTY, cube.mapPosition);
			this.cubes.splice(this.cubes.indexOf(cube), 1);

			cube.remove();

			this.updateY();

			this.playground.placeables.update();
		}



		public swap(cube: cuboro.core.Cube): void
		{
			const x = this.selected.mapPosition.x;
			const y = this.selected.mapPosition.y;
			const z = this.selected.mapPosition.z;

			this.selected.mapPosition.x = cube.mapPosition.x;
			this.selected.mapPosition.y = cube.mapPosition.y;
			this.selected.mapPosition.z = cube.mapPosition.z;

			cube.mapPosition.x = x;
			cube.mapPosition.y = y;
			cube.mapPosition.z = z;

			this.update(cube, false);
			this.update(this.selected, false);
			this.updateY();

			this.playground.emit(cuboro.SWAP);
		}



		public getById(id: string): cuboro.core.Cube
		{
			let cube: cuboro.core.Cube = null;

			this.cubes.forEach((value: cuboro.core.Cube) =>
			{
				if (value.id == id)
				{
					cube = value;
					return true;
				}
			});

			return cube;
		}



		/**
		* Get highest cube at the given position
		* @param {number} mapX
		* @param {number} mapZ
		* @returns {cuboro.core.Cube}
		*/
		public getHighestCube(mapX: number, mapZ: number): cuboro.core.Cube
		{
			for (let mapY = cuboro.MAX_Y - 1; mapY >= 0; --mapY)
			{
				let id = this.playground.map.getAt(mapX, mapY, mapZ);
				if (id != cuboro.EMPTY)
					return this.getById(id);
			}

			return this.getById(cuboro.EMPTY);
		}



		/*
			Remove all cubes
		*/
		public removeCubes(): void
		{
			while (this.cubes.length)
				this.remove(this.cubes[0]);

			this.cubes = [];
		}



		/**
		* Returns all cubes that are considered starting
		* cubes and are placed on the highest level occupied
		* by starting cubes.
		* @returns {cuboro.core.Cube[]}
		*/
		public getHighestStartCubes(): Cube[]
		{
			const startCubes = this.cubes.filter(cube => cuboro.START_CUBES.indexOf(cube.key) >= 0);
			let maxY = 0;
			for (let i = 0; i < startCubes.length; ++i)
				maxY = Math.max(maxY, startCubes[i].mapPosition.y);
			return startCubes.filter(cube => cube.mapPosition.y == maxY);
		}



		/**
		* Higlight cubes, over which marble can be dropped
		* @param {boolean} highlight
		*/
		public highlightMarble(highlight: boolean): void
		{
			this.cubes.forEach((value: cuboro.core.Cube) =>
			{
				if (cuboro.START_CUBES.indexOf(value.key) != -1)
					value.highlight(highlight);
			});
		}



		/**
		* Updates cube 3d position by map position and added it to the cubes array if needed.
		* Afterwards y positions of all cubes are checked and the placeables are updated.
		* @param {cuboro.core.Cube} cube
		* @param {boolean} updateY
		*/
		public update(cube?: cuboro.core.Cube, updateY: boolean = true): void
		{
			if (!cube && !this.selected)
				return;

			if (!cube)
				cube = this.selected;

			if (this.cubes.indexOf(cube) == -1)
				this.cubes.push(cube);

			const mapPos = cube.mapPosition;
			this.playground.map.setAt(cube.id, mapPos);

			this.updatePosition(cube);

			this.playground.placeables.update();

			if (updateY)
				this.updateY();
		}



		public updatePosition(cube: cuboro.core.Cube): void
		{
			const pos: THREE.Vector3 = this.playground.map.to3DPos(cube.mapPosition);
			cube.x = pos.x;
			cube.y = pos.y;
			cube.z = pos.z;
		}



		public updateY(): void
		{
			let cubeIsFalling = false;
			for (let i = 0; i < this.cubes.length; ++i)
			{
				let cube = this.cubes[i];
				if (cube.mapPosition.y > 0 && this.playground.map.getAt(cube.mapPosition.x, cube.mapPosition.y - 1, cube.mapPosition.z) == cuboro.EMPTY)
				{
					this.playground.map.setAt(cuboro.EMPTY, cube.mapPosition);
					cube.mapPosition.y = cube.mapPosition.y - 1;
					this.playground.map.setAt(cube.id, cube.mapPosition);
					cube.drop();
					cubeIsFalling = true;

					break;
				}
			}

			if (cubeIsFalling)
				this.updateY();
		}



		public getCubes(): string[]
		{
			const data = [];
			this.cubes.forEach((value: cuboro.core.Cube) =>
			{
				data.push(value.toString());
			});

			return data;
		}



		public setCubes(data: string[]): void
		{
			data.forEach((value) =>
			{
				const cube = new cuboro.core.Cube(this.playground, kr3m.util.Json.decode(value).key);
				cube.fromString(value);
				this.playground.gameScreen.bottomMenu.cubeList.getItemByKey(cube.key).remaining--;
				this.playground.cubes.update(cube, false);
			})
		}



		public get over(): cuboro.core.Cube
		{
			return this._over;
		}



		public set over(value: cuboro.core.Cube)
		{
			if (this._over != value)
			{
				if (this._over)
					this._over.isOver = false;

				this._over = value;

				if (this._over)
					this._over.isOver = true;
			}
		}



		public get down(): cuboro.core.Cube
		{
			return this._down;
		}



		public set down(value: cuboro.core.Cube)
		{
			if (this._down != value)
			{
				if (this._down)
					this._down.isDown = false;

				this._down = value;

				if (this._down)
					this._down.isDown = true;
			}
		}



		public get selected(): cuboro.core.Cube
		{
			return this._selected;
		}



		public set selected(value: cuboro.core.Cube)
		{
			const rotateMenu = this.playground.gameScreen.rotateMenu;
			const moveMenu = this.playground.gameScreen.moveMenu;

			if (this._selected != value)
			{
				if (this._selected)
					this._selected.isSelected = false;

				this._selected = value;
				this.playground.emit(cuboro.CUBE_SELECTED, this._selected);

				if (this._selected)
				{
					this._selected.isSelected = true;
					if (this.playground.gameScreen.bottomMenu.btMoveCube.isSelected)
						moveMenu.show();
					else
						rotateMenu.show();
				}
				else
				{
					this.playground.emit(cuboro.CUBE_DESELECTED);
				}
			}
			else if (this._selected)
			{
				this._selected.isSelected = false;
				this._selected = null;
				this.playground.emit(cuboro.CUBE_DESELECTED);
			}
		}



		public get swapping(): cuboro.core.Cube
		{
			return this._swapping;
		}



		public set swapping(value: cuboro.core.Cube)
		{
			this._swapping = value;
		}
	}
}
