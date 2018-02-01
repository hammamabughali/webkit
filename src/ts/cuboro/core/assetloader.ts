/// <reference path="../../gf/core/loader.ts"/>



module cuboro.core
{
	export class AssetLoader extends gf.core.Loader
	{
		protected _loaded:boolean;

		public assets: cuboro.core.Assets;
		public game: gf.core.Game;



		constructor(game: gf.core.Game, assets: cuboro.core.Assets)
		{
			super(game);

			this.assets = assets;
			this.on(gf.LOAD_COMPLETE, this.onComplete, this);
		}



		public onComplete():void
		{
			this.game.overlays.hide("loader");
			this._loaded = true;
		}



		public loadFile(file:any):void
		{
			switch (file.type)
			{
				case "threeJSON":
					new THREE.JSONLoader().load(file.url, (geometry: THREE.Geometry, materials: THREE.Material[]) =>
					{
						file.geometry = geometry;
						file.materials = materials;
						this.fileComplete(file);
					});
					break;

				case "texture":
					new THREE.TextureLoader().load(file.url, (texture: THREE.Texture) =>
					{
						file.texture = texture;
						this.fileComplete(file);
					});
					break;

				case "cubeTexture":
					new THREE.CubeTextureLoader().load(file.url, (texture: THREE.Texture) =>
					{
						file.texture = texture;
						this.fileComplete(file);
					});
					break;

				default:
					super.loadFile(file);
					break;
			}
		}



		public fileComplete(file:any, xhr?: XMLHttpRequest):void
		{
			let callAsyncComplete:boolean = true;

			switch (file.type)
			{
				case "threeJSON":
					this.assets.addThreeJSON(file.key, file.url, file.geometry, file.materials);
					break;

				case "texture":
					this.assets.addTexture(file.key, file.url, file.texture);
					break;

				case "cubeTexture":
					this.assets.addTexture(file.key, file.url, file.texture);
					break;

				default:
					callAsyncComplete = false;
					super.fileComplete(file, xhr);
					break;
			}

			if (callAsyncComplete)
			{
				this.asyncComplete(file);
			}
		}



		public threeJSON(key:string, url:string):void
		{
			this.addToFileList("threeJSON", key, url);
		}



		public texture(key:string, url:string):void
		{
			this.addToFileList("texture", key, url);
		}



		public cubeTexture(key:string, url:string):void
		{
			this.addToFileList("cubeTexture", key, url);
		}



		public start():void
		{
			this.game.overlays.show("loader");

			super.start();
		}


		public get loaded():boolean
		{
			return this._loaded;
		}
	}
}
