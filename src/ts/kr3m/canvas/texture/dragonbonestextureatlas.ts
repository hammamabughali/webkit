/// <reference path="../../lib/pixi.ts"/>



module kr3m.canvas.texture
{
	export class DragonBonesTextureAtlas
	{
		public image:PIXI.Texture;
		public scale:number;
		public name:string;

		private _regions:{[key:string]:any};



		constructor(image:PIXI.Texture, atlasRawData:any, scale:number = 1)
		{
			this.image = image;
			this.scale = scale;
			this.parseData(atlasRawData);
		}



		public dispose():void
		{
			this.image = null;
			this._regions = null;
		}



		public getRegion(subTextureName:string):any
		{
			return this._regions[subTextureName];
		}



		private parseData(atlasRawData:any):void
		{
			this._regions = {};
			var textureAtlasData:any = dragonBones.objects.DataParser.parseTextureAtlasData(atlasRawData, this.scale);
			this.name = textureAtlasData.__name;
			delete textureAtlasData.__name;

			for (var subTextureName in textureAtlasData)
				this._regions[subTextureName] = textureAtlasData[subTextureName];
		}
	}
}
