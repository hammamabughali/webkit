/// <reference path="frame.ts"/>
/// <reference path="framedata.ts"/>



module gf.utils
{
	export class Parser
	{
		public static Level(data:any):any
		{
			return null;
		}



		public static BitmapFont(xmlData: XMLDocument, key:string):any
		{
			let data:any = {};
			let info: Element = <Element>xmlData.getElementsByTagName("info")[0];
			let common: Element = <Element>xmlData.getElementsByTagName("common")[0];

			data.font = info.getAttribute("face");
			data.size = parseInt(info.getAttribute("size"), 10);
			data.lineHeight = parseInt(common.getAttribute("lineHeight"), 10);
			data.chars = {};

			let letters: NodeList = <NodeList>xmlData.getElementsByTagName("char");
			let i:number;

			for (i = 0; i < letters.length; i++)
			{
				let charCode = parseInt((<Element>letters[i]).getAttribute("id"), 10);

				let textureRect = new PIXI.Rectangle(
					parseInt((<Element>letters[i]).getAttribute("x"), 10),
					parseInt((<Element>letters[i]).getAttribute("y"), 10),
					parseInt((<Element>letters[i]).getAttribute("width"), 10),
					parseInt((<Element>letters[i]).getAttribute("height"), 10)
				);

				data.chars[charCode] =
				{
					xOffset: parseInt((<Element>letters[i]).getAttribute("xoffset"), 10),
					yOffset: parseInt((<Element>letters[i]).getAttribute("yoffset"), 10),
					xAdvance: parseInt((<Element>letters[i]).getAttribute("xadvance"), 10),
					kerning: {},
					texture: PIXI.utils.TextureCache[key] = new PIXI.Texture(PIXI.utils.BaseTextureCache[key], textureRect)
				};
			}

			let kernings: NodeList = <NodeList>xmlData.getElementsByTagName("kerning");

			for (i = 0; i < kernings.length; i++)
			{
				let first = parseInt((<Element>kernings[i]).getAttribute("first"), 10);
				let second = parseInt((<Element>kernings[i]).getAttribute("second"), 10);

				data.chars[second].kerning[first] = parseInt((<Element>kernings[i]).getAttribute("amount"), 10);
			}

			return data;
		}



		/*
			Parst string data zu XML
			@param data
			@returns {XMLDocument}
		*/
		public static XML(data:string): XMLDocument
		{
			let xml;

			try
			{
				if (window["DOMParser"])
				{
					let domparser: DOMParser = new DOMParser();
					xml = domparser.parseFromString(data, "text/xml");
				}
				else
				{
					xml = new ActiveXObject("Microsoft.XMLDOM");
					xml.async = false;
					xml.loadXML(data);
				}
			}
			catch (e)
			{
				xml = null;
			}

			if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length)
			{
				return null;
			}
			else
			{
				return xml;
			}
		}



		/*
			Parse the JSON data and extract the animation frame data from it.
				@param {gf.core.Game} game - A reference to the currently running game.
			@param {Object} json - The JSON data from the Texture Atlas. Must be in JSON Hash format.
			@return {gf.utils.FrameData} A FrameData object containing the parsed frames.
		*/
		public static JSONDataHash(game: gf.core.Game, json:any): gf.utils.FrameData
		{
			if (!json.frames)
			{
				logWarning("gf.utils.Parser.JSONDataHash: Invalid Texture Atlas JSON given, missing \"frames\" object");
				return;
			}

			let data: gf.utils.FrameData = new gf.utils.FrameData();
			let resolution:number = game.client.config.assetsResolution;
			let frames = json.frames;
			let uid:number;
			let i:number = 0;

			for (let key in frames)
			{
				uid = PIXI.utils.uid();
				data.addFrame(new gf.utils.Frame(i, frames[key], key, uid, resolution));
				i++;
			}

			return data;
		}
	}
}
