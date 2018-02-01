module cuboro.core
{
	export class Assets
	{
		public materials: { [key: string]: any };
		public textures: { [key: string]: any };
		public threeJSON: { [key: string]: any };

		public playground: cuboro.core.Playground;



		constructor(playground: cuboro.core.Playground)
		{
			this.playground = playground;

			this.materials = {};
			this.textures = {};
			this.threeJSON = {};
		}



		public getMesh(key: string): THREE.Mesh
		{
			return this.threeJSON[key].mesh.clone();
		}



		public getMaterial(key: string): THREE.MeshLambertMaterial
		{
			const materialParameters: THREE.MeshLambertMaterialParameters = {};
			materialParameters.color = 0xffffff;
			materialParameters.map = this.getTexture(key);
			materialParameters.opacity = this.playground.cubeOpacity;
			materialParameters.flatShading = true;
			materialParameters.side = THREE.DoubleSide;
			materialParameters.transparent = true;
			materialParameters.reflectivity = 0;

			return new THREE.MeshLambertMaterial(materialParameters);
		}



		public getColorMaterial(color: number): THREE.MeshLambertMaterial
		{
			const materialParameters: THREE.MeshLambertMaterialParameters = {};
			materialParameters.color = color;
			materialParameters.opacity = 1;
			materialParameters.flatShading = true;
			materialParameters.transparent = false;
			materialParameters.reflectivity = 0;

			return new THREE.MeshLambertMaterial(materialParameters);
		}



		public getBody(mesh: THREE.Mesh): CANNON.Body
		{
			let vertice: THREE.Vector3;
			let vertices: number[] = [];
			let face: THREE.Face3;
			let faces: number[] = [];
			let j: number;

			// Get vertices
			for (j = 0; j < (<THREE.Geometry>mesh.geometry).vertices.length; ++j)
			{
				vertice = (<THREE.Geometry>mesh.geometry).vertices[j];
				vertices.push(vertice.x, vertice.y, vertice.z);
			}

			// Get faces
			for (j = 0; j < (<THREE.Geometry>mesh.geometry).faces.length; ++j)
			{
				face = (<THREE.Geometry>mesh.geometry).faces[j];
				faces.push(face.a, face.b, face.c);
			}

			const body: CANNON.Body = new CANNON.Body({mass: 0});
			body.addShape(new CANNON.Trimesh(vertices, faces));

			return body;
		}



		public getTexture(key: string): THREE.Texture
		{
			return this.textures[key].texture;
		}



		public addTexture(key: string, url: string, texture: THREE.Texture): void
		{
			this.textures[key] = {url: url, texture: texture};
		}



		public addThreeJSON(
			key: string,
			url: string,
			geometry: THREE.Geometry,
			materials: THREE.Material[]): void
		{
			let mesh: THREE.Mesh = new THREE.Mesh(geometry);
			this.threeJSON[key] = {geometry: geometry, materials: materials, url: url, mesh: mesh};
		}
	}
}
