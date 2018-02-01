/// <reference path="../../kr3m/lib/cannon.ts"/>
/// <reference path="../../kr3m/lib/three.ts"/>



module cuboro.core
{
	export class Ground
	{
		public body: CANNON.Body;
		public geometry: THREE.PlaneBufferGeometry;
		public map:number[][];
		public material: THREE.MeshBasicMaterial;
		public playground: cuboro.core.Playground;
		public tilesMap:any[][];
		public tiles: THREE.Mesh[];



		constructor(playground: cuboro.core.Playground)
		{
			this.playground = playground;

			this.createBody();
			this.createGround();
			this.createMap();
		}



		public createBody():void
		{
			this.body = new CANNON.Body({mass: 0});
			this.body.addShape(new CANNON.Plane());
			this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
			this.body.position = new CANNON.Vec3(1, 0, 1);
			this.playground.world.addBody(this.body);
		}



		public createGround():void
		{
			this.material = new THREE.MeshBasicMaterial({map: this.playground.assets.getTexture("ground")});
			this.geometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
			this.tiles = [];
			this.tilesMap = [];

			let row:number;
			let col:number;
			let tile: THREE.Mesh;

			for (row = 0; row < cuboro.MAX_X; ++row)
			{
				this.tilesMap[row] = [];

				for (col = 0; col < cuboro.MAX_Z; ++col)
				{
					tile = this.getTile();
					tile.name = "ground" + col.toString() + "_" + row.toString();
					tile.position.z = col * 2 - (cuboro.MAX_Z - 1);
					tile.position.y = 0;
					tile.position.x = row * 2 - (cuboro.MAX_X - 1);
					tile.userData = { x: row, z: col};

					this.playground.scene.add(tile);

					this.tilesMap[row][col] = tile;
					this.tiles.push(tile);
				}
			}
		}



		public createMap():void
		{
			let row:number;
			let col:number;
			this.map = [];

			for (row = 0; row < cuboro.MAX_X; ++row)
			{
				this.map[row] = [];

				for (col = 0; col < cuboro.MAX_Z; ++col)
				{
					this.map[row][col] = 1;
				}
			}
		}



		public update(map:number[][]):void
		{
			this.map = map;

			let row:number;
			let col:number;
			let tile: THREE.Mesh;

			for (row = 0; row < cuboro.MAX_X; ++row)
			{
				for (col = 0; col < cuboro.MAX_Z; ++col)
				{
					tile = this.tilesMap[row][col];
					tile.visible = (map[row][col] == 1);
					this.map[row][col] = (tile.visible) ? 1 : 0;
				}
			}
		}



		public updateTile(row:number, col:number, active:boolean):void
		{
			this.tilesMap[row][col].visible = active;
			this.map[row][col] = (active) ? 1 : 0;
		}



		public getTile(): THREE.Mesh
		{
			const mesh: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);
			mesh.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -cuboro.DEG_RAD_90);

			return mesh;
		}
	}
}
