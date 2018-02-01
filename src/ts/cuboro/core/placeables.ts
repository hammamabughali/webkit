module cuboro.core
{
	export class Placeables
	{
		public geometry: THREE.PlaneBufferGeometry;
		public materialPlaceable: THREE.MeshLambertMaterial;
		public materialUnplaceable: THREE.MeshLambertMaterial;
		public playground: cuboro.core.Playground;
		public tilesMap:any[][];
		public tiles: THREE.Mesh[];



		constructor(playground: cuboro.core.Playground)
		{
			this.playground = playground;

			this.createPlaceables();
			this.hide();
		}



		protected createPlaceables():void
		{
			this.materialPlaceable = this.playground.assets.getColorMaterial(0x00ff00);
			this.materialPlaceable.name = "materialPlaceable";
			this.materialPlaceable.transparent = true;
			this.materialPlaceable.opacity = 0;

			this.materialUnplaceable = this.playground.assets.getMaterial("unplaceable");
			this.materialUnplaceable.name = "materialUnplaceable";
			this.materialUnplaceable.transparent = true;

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
					tile.name = "placeable" + col.toString() + "_" + row.toString();
					tile.position.z = col * 2 - (cuboro.MAX_Z - 1);
					tile.position.y = 0.05;
					tile.position.x = row * 2 - (cuboro.MAX_X - 1);
					tile.userData = {x: row, z: col};
					tile.material = this.materialPlaceable;

					this.playground.scene.add(tile);

					this.tilesMap[row][col] = tile;
					this.tiles.push(tile);
				}
			}
		}



		protected getTile(): THREE.Mesh
		{
			const mesh: THREE.Mesh = new THREE.Mesh(this.geometry, this.materialPlaceable);
			mesh.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -cuboro.DEG_RAD_90);

			return mesh;
		}



		public update():void
		{
			let row:number;
			let col:number;
			let tile: THREE.Mesh;
			let material: THREE.Material;

			for (row = 0; row < cuboro.MAX_X; ++row)
			{
				for (col = 0; col < cuboro.MAX_Z; ++col)
				{
					let mapY = this.playground.map.getNextEmptyY(row, col);

					tile = this.tilesMap[row][col];
					tile.position.y = this.playground.map.yTo3DPos(mapY) - 0.99;
					material = (mapY == cuboro.MAX_Y) ? this.materialUnplaceable : this.materialPlaceable;
					if (material.name != tile.material.name) tile.material = material;
				}
			}
		}



		public hide():void
		{
			this.tiles.forEach((value: THREE.Mesh) =>
			{
				value.visible = false;
			});
		}



		public show():void
		{
			this.update();

			this.tiles.forEach((value: THREE.Mesh) =>
			{
				value.visible = true;
			});
		}
	}
}
