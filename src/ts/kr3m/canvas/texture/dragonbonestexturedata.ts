module kr3m.canvas.texture
{
	export class DragonBonesTextureData
	{
		public name:string;
		public SubTexture:any[];



		constructor(name:string, json:any)
		{
			this.name = name;
			this.parseJson(json);
		}



		private parseJson(json:any):void
		{
			this.SubTexture = [];

			var subTextures:any = json.frames;
			var textureData:any;
			var partName:string;
			var isArray:boolean = Array.isArray(subTextures);
			var numSubTextures:number = (isArray) ? subTextures.length : 0;

			var partsList:string[] = [];
			for (partName in json.frames)
				partsList.push(partName);

			for (var i:number = 0, j:number, s:string; i < subTextures.length; i++)
			{
				partName = partsList[i];
				if (isArray)
				{
					for (j = 0; j < numSubTextures; j++)
					{
						textureData = subTextures[j];
						if (textureData.name == partName)
						{
							this.SubTexture.push(this.createFrame(partName, textureData));
							break;
						}
					}
				}
				else
				{
					for (s in subTextures)
					{
						if (s == partName)
						{
							this.SubTexture.push(this.createFrame(partName, textureData[s]));
							break;
						}
					}
				}
			}
		}



		private createFrame(name:string, textureData:any):any
		{
			var frame =
			{
				name: name,
				x: textureData.x,
				y: textureData.y,
				width: textureData.w,
				height: textureData.h
			};
			return frame;
		}
	}
}
