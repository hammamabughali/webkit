module cuboro.core
{
	export class Map
	{
		public map: string[][][];
		public playground: cuboro.core.Playground;



		constructor(playground: cuboro.core.Playground)
		{
			this.playground = playground;

			let x: number;
			let y: number;
			let z: number;

			this.map = [];

			for (x = 0; x < cuboro.MAX_X; ++x)
			{
				this.map[x] = [];

				for (y = 0; y < cuboro.MAX_Y; ++y)
				{
					this.map[x][y] = [];

					for (z = 0; z < cuboro.MAX_Z; ++z)
					{
						this.map[x][y][z] = cuboro.EMPTY;
					}
				}
			}
		}



		public getAt(
			pos: THREE.Vector3): string
		public getAt(x: number, y: number, z: number): string
		public getAt(posOrX: THREE.Vector3 | number, y?: number, z?: number): string
		{
			let x: number;

			if (typeof posOrX != "number")
			{
				const pos: THREE.Vector3 = <THREE.Vector3>posOrX;
				x = pos.x;
				y = pos.y;
				z = pos.z;
			}
			else
			{
				x = <number>posOrX;
			}
			if (!this.onMap(x, z, y)) return null;

			return this.map[x][y][z];
		}



		public setAt(
			id: string,
			pos: THREE.Vector3): void
		public setAt(id: string, x: number, y?: number, z?: number): void
		public setAt(id: string, posOrX: THREE.Vector3 | number, y?: number, z?: number): void
		{
			let x: number;

			if (typeof posOrX != "number")
			{
				const pos: THREE.Vector3 = <THREE.Vector3>posOrX;
				x = pos.x;
				y = pos.y;
				z = pos.z;
			}
			else
			{
				x = <number>posOrX;
			}

			if (this.onMap(x, z, y))
			{
				this.map[x][y][z] = id;
			}
			else
			{
				log("cuboro.core.Map.setAt error. Position " + x + ", " + y + ", " + z + " not on map!")
			}
		}



		public isValidX(value): boolean
		{
			return !(value < 0 || value >= cuboro.MAX_X);
		}



		public isValidY(value: number): boolean
		{
			return !(value < 0 || value >= cuboro.MAX_Y);
		}



		public isValidZ(value): boolean
		{
			return !(value < 0 || value >= cuboro.MAX_Z);
		}



		public isValid(x, y, z): boolean
		{
			if (!this.isValidX(x)) return false;
			if (!this.isValidY(y)) return false;
			return this.isValidZ(z);
		}



		/*
			Getting the next free map y position
				@param x Map x position
			@param z Map y position
			@returns {number} The next free map y position
		*/
		public getNextEmptyY(x: number, z: number): number
		{
			for (let y: number = 0; y < cuboro.MAX_Y + 1; ++y)
			{
				if (this.map[x])
				{
					if (this.map[x][y])
					{
						if (this.map[x][y][z] == cuboro.EMPTY)
						{
							return y;
						}
					}
					else
					{
						return y;
					}
				}
			}
		}



		/*
			Convert map position to 3d position
				@param {THREE.Vector3} pos
			@returns {THREE.Vector3}
		*/
		public to3DPos(
			pos: THREE.Vector3): THREE.Vector3
		public to3DPos(x: number, y: number, z: number): THREE.Vector3
		public to3DPos(posOrX: THREE.Vector3 | number, y?: number, z?: number): THREE.Vector3
		{
			let x: number;

			if (typeof posOrX != "number")
			{
				const pos: THREE.Vector3 = <THREE.Vector3>posOrX;
				x = pos.x;
				y = pos.y;
				z = pos.z;
			}
			else
			{
				x = <number>posOrX;
			}

			x = this.xTo3DPos(x);
			y = this.yTo3DPos(y);
			z = this.zTo3DPos(z);

			return new THREE.Vector3(x, y, z);
		}



		/*
			Convert x map position to x 3d position
			@param value
			@returns {THREE.Vector3}
		*/
		public xTo3DPos(value: number): number
		{
			const maxX = cuboro.MAX_X >> 1;
			return (value * 2 + (this.playground.elementMargin * (value - maxX))) - 11;
		}



		/*
			Convert y map position to y 3d position
			@param value
			@returns {THREE.Vector3}
		*/
		public yTo3DPos(value: number): number
		{
			return (value * 2 + (this.playground.layerMargin * 2 * value)) + 1;
		}



		/*
			Convert z map position to z 3d position
			@param value
			@returns {THREE.Vector3}
		*/
		public zTo3DPos(value: number): number
		{
			const maxZ = cuboro.MAX_Z >> 1;
			return (value * 2 + (this.playground.elementMargin * (value - maxZ))) - 11;
		}



		/**
		* Convert a 3d position to map position
		* @param {THREE.Vector3} pos
		* @returns {THREE.Vector3}
		*/
		public toMapPos(
			pos: THREE.Vector3): THREE.Vector3
		public toMapPos(x: number, y: number, z: number): THREE.Vector3
		public toMapPos(posOrX: THREE.Vector3 | number, y?: number, z?: number): THREE.Vector3
		{
			let x: number;

			if (typeof posOrX != "number")
			{
				const pos = <THREE.Vector3>posOrX;

				x = this.xToMapPos(pos.x);
				y = this.yToMapPos(pos.y);
				z = this.zToMapPos(pos.z);
			}
			else
			{
				x = this.xToMapPos(posOrX);
				y = this.yToMapPos(y);
				z = this.zToMapPos(z);
			}

			return new THREE.Vector3(x, y, z);
		}



		/**
		* Convert x 3d position to x map position
		* @param value
		* @returns {number}
		*/
		public xToMapPos(value): number
		{
			const offset = this.playground.elementMargin * (Math.round((value + 11) * 0.5) - (cuboro.MAX_X >> 1));
			return Math.round((value + 11 - offset) * 0.5);
		}



		/**
		* Convert y 3d position to y map position
		* @param value
		* @returns {number}
		*/
		public yToMapPos(value): number
		{
			const offset = this.playground.layerMargin * 2 * ((value - 1) * 0.5);
			return Math.round((value - offset - 1) * 0.5);
		}



		/**
		* Convert z 3d position to z map position
		* @param value
		* @returns {number}
		*/
		public zToMapPos(value): number
		{
			const offset = this.playground.elementMargin * (Math.round((value + 11) * 0.5) - (cuboro.MAX_Z >> 1));
			return Math.round((value + 11 - offset) * 0.5);
		}



		/**
		* Check if x and y 3d position are valid
		* @param {number} x
		* @param {number} z
		* @returns {boolean}
		*/
		public onMap3D(x: number, z: number): boolean
		{
			x = this.xToMapPos(x);
			z = this.xToMapPos(z);

			return this.onMap(x, z);
		}



		/**
		* Check if x and z map position are valid
		* @param {number} x
		* @param {number} z
		* @param {number} y
		* @returns {boolean}
		*/
		public onMap(x: number, z: number, y?: number): boolean
		{
			if (x < 0)
			{
				return false;
			}
			if (x > cuboro.MAX_X)
			{
				return false;
			}

			if (z < 0)
			{
				return false;
			}
			if (z > cuboro.MAX_Z)
			{
				return false;
			}

			if (y == undefined)
			{
				return true;
			}

			if (y < 0)
			{
				return false;
			}

			return y <= cuboro.MAX_Y;
		}



		public mapItem(x: number, y: number, z: number): number | string
		{
			if (!this.map[x])
			{
				return null;
			}
			if (!this.map[x][y])
			{
				return null;
			}
			if (!this.map[x][y][z])
			{
				return null;
			}

			return this.map[x][y][z];
		}
	}
}
