/// <reference path="../display/slice9.ts"/>
/// <reference path="../display/sprite.ts"/>
/// <reference path="../display/tilingsprite.ts"/>
/// <reference path="../utils/frame.ts"/>
/// <reference path="../utils/framedata.ts"/>



module gf.utils
{
	export class Texture
	{
		public static update(
			display:gf.display.Sprite | gf.display.Slice9 | gf.display.TilingSprite):void
		{
			if (display.key instanceof PIXI.Texture)
			{
				display.texture = <PIXI.Texture>display.key;
			}
			else
			{
				let frameData:gf.utils.FrameData = display.game.cache.getFrameData(<string>display.key);

				if (display.frameName)
				{
					let frame:gf.utils.Frame = frameData.getFrameByName(display.frameName);
					this.setFrame(display, frame);
				}
				else
				{
					if (frameData)
						this.setFrame(display, frameData.getFrame());
					else
						logWarning("Warning: Can't find frame data with key: " + display.key);
				}
			}
		}



		public static getTexture(game:gf.core.Game, key:string, frameName?:string):PIXI.Texture
		{
			let frameData:gf.utils.FrameData = game.cache.getFrameData(key);
			let frame:gf.utils.Frame = (frameName) ? frameData.getFrameByName(frameName) : frameData.getFrame();

			return new PIXI.Texture(PIXI.utils.TextureCache[key], frame.frame, frame.orig, frame.trim, frame.rotated ? 2 : 0);
		}



		private static setFrame(
			display:gf.display.Sprite | gf.display.Slice9 | gf.display.TilingSprite,
			frame:gf.utils.Frame):void
		{
			try
			{
				display.frame = frame;
				display.texture = new PIXI.Texture(PIXI.utils.TextureCache[<string>display.key], frame.frame, frame.orig, frame.trim, frame.rotated ? 2 : 0);
			}
			catch (e)
			{
				logWarning("gf.utils.Texture.setFrame() error with key: " + display.key + ", frame: " + display.frameName);
			}
		}



		public static crop(display:gf.display.Sprite, rect:PIXI.Rectangle):void
		{
			let crop:PIXI.Rectangle = display.texture.frame.clone();
			crop.x += rect.x;
			crop.y += rect.y;
			crop.width = rect.width;
			crop.height = rect.height;

			display.texture.frame = crop;
			display.texture["_updateUvs"]();
		}
	}
}
