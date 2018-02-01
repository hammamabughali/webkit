		public getFree##capitalKey##(
			callback:(##key##:string) => void,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "getFree##capitalKey##");
			var ##key##:string;
			kr3m.async.Loop.loop((loopDone) =>
			{
				kr3m.util.Rand.getSecureString(##keyLength##, null, (secString) =>
				{
					##key## = secString;
					this.getBy##capitalKey##(##key##, dummy => loopDone(!!dummy), errorCallback);
				});
			}, () => callback(##key##));
		}
