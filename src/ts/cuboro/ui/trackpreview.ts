module cuboro.ui
{
	export class TrackPreview extends gf.display.Container
	{
		public bg: gf.display.Sprite;
		public preview: gf.display.Sprite;
		public loader: gf.core.Loader;

		private _url: string;



		constructor(game: gf.core.Game, url?: string)
		{
			super(game);

			this.bg = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.bg.width = 150;
			this.bg.height = 150;
			this.addChild(this.bg);

			this.preview = new gf.display.Sprite(this.game, PIXI.Texture.EMPTY);
			this.preview.width = 150;
			this.preview.height = 150;
			this.addChild(this.preview);

			if (url)
			{
				this.url = url;
			}
		}



		private static GenerateTexture(playground: cuboro.core.Playground, size: number = 150, callback?: (texture: PIXI.RenderTexture) => void): void
		{
			const pos = playground.controls.settings.camera.position.clone();

			playground.camera.position.set(20, 17, 20);
			playground.camera.lookAt(playground.controls.settings.lookAt);
			playground.canvas.renderer.render(playground.scene, playground.camera);

			const content: string = playground.canvas.renderer.domElement.toDataURL();

			const img = new Image();
			img.src = content;
			img.onload = () =>
			{
				const c = new PIXI.Container();
				const t = new PIXI.Texture(new PIXI.BaseTexture(img, PIXI.SCALE_MODES.LINEAR, 2));
				const s = new PIXI.Sprite(t);
				s.width = size;
				s.height = size;
				c.addChild(s);

				const rt = playground.game.renderer.generateTexture(c, PIXI.SCALE_MODES.LINEAR, 2);

				playground.camera.position.set(pos.x, pos.y, pos.z);
				playground.camera.lookAt(playground.controls.settings.lookAt);

				if (callback)
				{
					callback(rt);
				}
			}
		}



		public static GetBase64(playground: cuboro.core.Playground, size: number = 150, callback?: (value: string) => void): void
		{
			this.GenerateTexture(playground, size, (texture: PIXI.RenderTexture) =>
			{
				callback(playground.game.renderer.extract.base64(texture));
			});
		}



		public get url(): string
		{
			return this._url;
		}



		public set url(value: string)
		{
			if (!value) return;
			this._url = value;
			this.preview.texture = PIXI.Texture.fromImage(value);
		}
	}
}
