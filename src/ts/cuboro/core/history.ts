module cuboro.core
{
	export class History extends PIXI.utils.EventEmitter
	{
		protected history: cuboro.core.CubeData[][];
		protected skipFirst: boolean;

		public playground: cuboro.core.Playground;



		constructor(playground: cuboro.core.Playground)
		{
			super();

			this.playground = playground;
			this.history = [];
		}



		public reset(): void
		{
			this.history = [];
			this.emit(gf.CHANGE, this.history.length);
		}



		public save(silent: boolean = false): void
		{
			let cube: cuboro.core.Cube;
			let data: cuboro.core.CubeData[] = [];

			this.playground.scene.children.forEach((value: THREE.Mesh) =>
			{
				if (value.name.indexOf("cube") != -1)
				{
					cube = value.userData.cube;
					data.push(
						{
							key: cube.key,
							pos: cube.mapPosition.toArray(),
							rot: cube.mesh.rotation.toArray()
						});
				}
			});

			if (this.history.length == 0 || JSON.stringify(data) != JSON.stringify(this.history[this.history.length - 1]))
			{
				this.skipFirst = true;
				this.history.push(data);
				if (!silent) this.emit(gf.CHANGE, this.history.length);
			}
		}



		public undo(): void
		{
			this.playground.cubes.selected = null;
			this.playground.cubes.removeCubes();
			this.playground.placeables.hide();

			this.playground.gameScreen.moveMenu.hide();
			this.playground.gameScreen.rotateMenu.hide();

			if (this.history.length > 0)
			{
				let cube: cuboro.core.Cube;

				let data: cuboro.core.CubeData[] = this.history.pop();

				if (this.skipFirst && data.length > 0) data = this.history.pop();
				this.skipFirst = false;

				if(!data) return;

				data.forEach((value: cuboro.core.CubeData) =>
				{
					cube = new cuboro.core.Cube(this.playground, value.key);
					cube.mapPosition.set(value.pos[0], value.pos[1], value.pos[2]);
					cube.mesh.rotation.set(value.rot[0], value.rot[1], value.rot[2]);
					this.playground.gameScreen.bottomMenu.cubeList.getItemByKey(cube.key).remaining--;
					this.playground.cubes.update(cube);
					this.playground.save();
				});

				this.playground.emit(cuboro.CUBE_UPDATE);
				this.emit(gf.CHANGE, this.history.length);
			}

			if (this.history.length == 0)
				this.save(true);
		}
	}



	export class CubeData
	{
		public key: string;

		/**
		* Map position of the cube
		*/
		public pos: number[];

		/**
		* Rotation of the cube in radians
		*/
		public rot: number[];
	}
}
