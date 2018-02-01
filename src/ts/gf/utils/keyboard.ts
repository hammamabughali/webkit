module gf.utils
{
	export class Keyboard
	{
		private static instance:gf.utils.Keyboard;
		private static keys:any[][];
		private static callbacks:{[key:number]:{callback:(e?:KeyboardEvent) => void, key:number}};



		constructor()
		{
			gf.utils.Keyboard.instance = this;
		}



		private static init():void
		{
			this.keys = [];

			try
			{
				top.addEventListener("keydown", (e: KeyboardEvent) =>
				{
					this.onKey(e);
				}, true);

				if (window != top)
				{
					window.addEventListener("keydown", (e: KeyboardEvent) =>
					{
						this.onKey(e);
					}, true);
				}
			}
			catch (e)
			{
				window.addEventListener("keydown", (e: KeyboardEvent) =>
				{
					this.onKey(e);
				}, true);
			}
		}



		private static addKey(key:number, callback:(e:KeyboardEvent) => void):void
		{
			if (!this.keys[key])
			{
				this.keys[key] = [];
			}

			this.keys[key].push(callback);
		}



		private static removeKey(key:number, callback:(e:KeyboardEvent) => void):void
		{
			if (!this.keys[key])
			{
				return;
			}

			this.keys[key].splice(this.keys[key].indexOf(callback), 1);
		}



		private static onKey(e:KeyboardEvent):void
		{
			let key:number = e.which;
			if (this.keys[key] && this.keys[key].length > 0)
			{
				for (let i:number = 0; i < this.keys[key].length; ++i)
				{
					this.keys[key][i](e);
				}
			}
		}



		private static getInstance():gf.utils.Keyboard
		{
			let self = gf.utils.Keyboard;
			if (typeof self.instance == "undefined")
			{
				self.instance = new gf.utils.Keyboard();
				this.init();
			}

			return self.instance;
		}



		public static add(callback:(e?:KeyboardEvent) => void, key:number | number[]):number | number[]
		{
			if (!this.instance) this.getInstance();

			if (!this.callbacks) this.callbacks = {};

			let callbackId:number;

			if (typeof key == "number")
			{
				callbackId = PIXI.utils.uid();
				this.callbacks[callbackId] = {callback: callback, key: <number>key};
				this.addKey(<number>key, callback);
				return callbackId;
			}

			let callbackIds:number[] = [];

			(<number[]>key).forEach((value:number) =>
			{
				callbackId = PIXI.utils.uid();
				this.callbacks[callbackId] = {callback: callback, key: value};
				this.addKey(value, callback);
				callbackIds.push(callbackId);
			});

			return callbackIds;
		}



		public static remove(callbackId:number | number[]):void
		{
			if (!this.instance) this.getInstance();

			if (typeof callbackId == "number")
			{
				this.removeKey(this.callbacks[<number>callbackId].key, this.callbacks[<number>callbackId].callback);
				this.callbacks[<number>callbackId] = null;
			}
			else
			{
				(<number[]>callbackId).forEach((value:number) =>
				{
					this.removeKey(this.callbacks[value].key, this.callbacks[value].callback);
					this.callbacks[value] = null;
				});
			}
		}
	}
}
