module gf.utils
{
	export class FPS
	{
		static _dom: HTMLElement;
		static _fps:number;
		static _frames:number;
		static _isAdded:boolean;
		static _total:number[];
		static _prevTime:number;



		protected static update():void
		{
			this._frames++;

			let time = (performance || Date).now();

			if (time > this._prevTime + 1000)
			{
				this._fps = (this._frames * 1000 ) / ( time - this._prevTime );
				this._prevTime = time;
				this._frames = 0;
				this._total.push(this._fps);

				if (this._total.length > 60)
					this._total = [this.average];

				if (this._dom)
					this._dom.innerText = "FPS: " + Math.round(this._fps) + " (∅ " + Math.round(this.average) + ")";
			}
		}



		public static reset():void
		{
			this._frames = 0;
			this._prevTime = (performance || Date).now();
			this._total = [];
		}



		public static add(game: gf.core.Game):void
		{
			if (this._isAdded) return;

			this._isAdded = true;
			this.reset();
			game.ticker.add(this.update, this);
			game.on(gf.FOCUS, this.reset, this);
		}



		public static remove(game: gf.core.Game):void
		{
			this._isAdded = false;
			game.ticker.remove(this.update, this);
			game.off(gf.FOCUS, this.reset, this);
		}



		public static addToDom(game: gf.core.Game):void
		{
			if (!this._isAdded) this.add(game);

			this._dom = document.createElement("div");
			this._dom.style.cssText = "position:fixed;display:block;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000;background-color:#fff;color:#000;font-size:10px;padding:2px;";
			document.body.appendChild(this._dom);
		}



		public static get fps():number
		{
			return this._fps;
		}



		public static get average():number
		{
			return this._total.reduce((a, b) => a + b, 0) / this._total.length;
		}



		public static removeFromDOM(game: gf.core.Game):void
		{
			if (this._isAdded)
			{
				this.remove(game);
				document.body.removeChild(this._dom);
			}
		}
	}
}
