/// <reference path="../constants.ts"/>



module gf.utils
{
	export class Render
	{
		public static type:string = gf.RENDER_TYPE_DEFAULT;



		/*
			Renders only if something changes on the stage.
			This improves battery life on mobile device and lower cpu usage.
			@param game
		*/
		public static onChange(game: gf.core.Game):void
		{
			this.type = gf.RENDER_TYPE_ON_CHANGE;

			/*
				mesh.Mesh override on texture update
			*/
			PIXI.mesh.Mesh.prototype["game"] = game;
			PIXI.mesh.Mesh.prototype["_onTextureUpdate"] = (function (_super)
			{
				return function ()
				{
					this.game.renderState = 2;
					return _super.apply(this, arguments);
				};
			})(PIXI.mesh.Mesh.prototype["_onTextureUpdate"]);

			/*
				core.sprites.Sprite override _onTextureUpdate
			*/
			PIXI.Sprite.prototype["game"] = game;
			PIXI.Sprite.prototype["_onTextureUpdate"] = (function (_super)
			{
				return function ()
				{
					this.game.renderState = 2;
					return _super.apply(this, arguments);
				};
			})(PIXI.Sprite.prototype["_onTextureUpdate"]);

			/*
				core.text.Text override updateTexture
			*/
			PIXI.Text.prototype["game"] = game;
			PIXI.Text.prototype["updateTexture"] = (function (_super)
			{
				return function ()
				{
					this.game.renderState = 2;
					return _super.apply(this, arguments);
				};
			})(PIXI.Text.prototype["updateTexture"]);

			/*
				core.display.DisplayObject override getter/setter for alpha
			*/
			PIXI.DisplayObject.prototype["game"] = game;
			Object.defineProperty(PIXI.DisplayObject.prototype, "alpha",
			{
				set: function (value)
				{
					if (this.worldVisible) this.game.renderState = 2;
					this._alpha = value;
				},
				get: function ()
				{
					return this._alpha;
				}
			});

			/*
				core.display.DisplayObject override getter/setter for rotation
				@type {gf.core.Game}
			*/
			Object.defineProperty(PIXI.DisplayObject.prototype, "rotation",
			{
				set: function (value)
				{
					if (this.worldVisible) this.game.renderState = 2;
					this.transform.rotation = value;
				},
				get: function ()
				{
					return this.transform.rotation;
				}
			});

			/*
				core.display.DisplayObject override getter/setter for scale
				@type {gf.core.Game}
			*/
			Object.defineProperty(PIXI.DisplayObject.prototype, "scale",
			{
				set: function (value)
				{
					if (this.worldVisible) this.game.renderState = 2;
					this.transform.scale.copy(value);
				},
				get: function ()
				{
					return this.transform.scale;
				}
			});

			/*
				core.display.DisplayObject override getter/setter for skew
				@type {gf.core.Game}
			*/
			Object.defineProperty(PIXI.DisplayObject.prototype, "skew",
			{
				set: function (value)
				{
					if (this.worldVisible) this.game.renderState = 2;
					this.transform.skew.copy(value);
				},
				get: function ()
				{
					return this.transform.skew;
				}
			});

			/*
				core.display.TransformStatic override onChange
			*/
			PIXI.TransformStatic.prototype["game"] = game;
			PIXI.TransformStatic.prototype["onChange"] = (function (_super)
			{
				return function ()
				{
					this.game.renderState = 2;
					return _super.apply(this, arguments);
				};
			})(PIXI.TransformStatic.prototype["onChange"]);

			/*
				Render on mouse/finger
			*/
			if (parseInt(PIXI.VERSION.split(".").join("")) < 452)
			{
				game.renderer["plugins"].interaction.on("pointermove", () => game.renderState = 2);
			}
			game.renderer["plugins"].interaction.on("mousedown", () => game.renderState = 2);
			game.renderer["plugins"].interaction.on("mouseup", () => game.renderState = 2);
			game.renderer["plugins"].interaction.on("mousemove", () => game.renderState = 2);
			game.renderer["plugins"].interaction.on("touchstart", () => game.renderState = 2);
			game.renderer["plugins"].interaction.on("touchend", () => game.renderState = 2);
			game.renderer["plugins"].interaction.on("touchmove", () => game.renderState = 2);
		}
	}
}
