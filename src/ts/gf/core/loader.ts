/// <reference path="../core/game.ts"/>
/// <reference path="../utils/parser.ts"/>



module gf.core
{
	export class Loader extends PIXI.utils.EventEmitter
	{
		public crossOrigin: boolean | string;
		public game: gf.core.Game;

		public static retryWithXhrLoad: boolean = false; //if  xhrLoadWithXDR() fails, try with xhrLoad(). This fixes game loading on IE9.

		private _fileList: gf.core.File[];
		private _fileLoadStarted: boolean;
		private _flightQueue: gf.core.File[];
		private _hasLoaded: boolean;
		private _isLoading: boolean;
		private _loadedFileCount: number;
		private _processingHead: number;
		private _totalFileCount: number;
		private _XDomainRequestFailedOnce: boolean = false;



		constructor(game: gf.core.Game)
		{
			super();

			this.game = game;
			this._isLoading = false;
			this._hasLoaded = false;
			this.crossOrigin = false;
			this._fileList = [];
			this._flightQueue = [];
			this._processingHead = 0;
			this._fileLoadStarted = false;
			this._totalFileCount = 0;
			this._loadedFileCount = 0;
		}



		private processLoadQueue(): void
		{
			if (!this._isLoading)
			{
				this.finishedLoading(true);
				return;
			}

			let file: gf.core.File;
			let i: number;

			for (i = 0; i < this._flightQueue.length; ++i)
			{
				file = this._flightQueue[i];

				if (file.loaded || file.error)
				{
					this._flightQueue.splice(i, 1);
					i--;

					file.loading = false;
					file.requestUrl = null;
					file.requestObject = null;

					if (file.error)
					{
						this.emit(gf.LOAD_ERROR, file.key, file);
						this.loadTest("error");
					}

					this._loadedFileCount++;
					this.emit(gf.LOAD_PROGRESS, file.key, !file.error, this._loadedFileCount, this._totalFileCount);
				}
			}

			let syncblock: boolean = false;

			for (i = this._processingHead; i < this._fileList.length; i++)
			{
				file = this._fileList[i];

				if (file.loaded || file.error)
				{
					// Item at the start of file list finished, can skip it in future
					if (i === this._processingHead)
					{
						this._processingHead = i + 1;
					}
				}
				else if (!file.loading && this._flightQueue.length < 4)
				{
					// -> not loaded/failed, not loading
					if (!syncblock)
					{
						if (!this._fileLoadStarted)
						{
							this._fileLoadStarted = true;
						}

						this._flightQueue.push(file);
						file.loading = true;

						this.loadFile(file);
					}
				}

				if (!file.loaded && file.syncPoint)
				{
					syncblock = true;
				}
			}

			if (this._processingHead >= this._fileList.length)
			{
				this.finishedLoading();
			}
			else if (!this._flightQueue.length)
			{
				logWarning("gf.core.Loader - aborting: processing queue empty, loading may have stalled");

				setTimeout(() =>
				{
					this.finishedLoading(true);
				}, 2000);
			}
		}



		private loadTest(endType: string): void
		{
			try
			{
				if (parent && (parent.location.href == window.location.href + "loadtest.html"))
				{
					if (!window.hasOwnProperty("_kr3m_LT_"))
						window["_kr3m_LT_"] = {error: 0, complete: false};

					if (endType == "error")
						window["_kr3m_LT_"].error += 1;
					else if (endType == "complete")
						window["_kr3m_LT_"].complete = true;
				}
			}
			catch (e)
			{
			}
		}



		private finishedLoading(abnormal: boolean = false): void
		{
			if (this._hasLoaded)
			{
				return;
			}

			this._hasLoaded = true;
			this._isLoading = false;

			// If there were no files make sure to trigger the event anyway, for consistency
			if (!abnormal && !this._fileLoadStarted)
			{
				this._fileLoadStarted = true;
			}

			this.reset();

			this.emit(gf.LOAD_COMPLETE);
			this.loadTest("complete");
		}



		protected asyncComplete(file: gf.core.File, errorMessage: string = ""): void
		{
			file.loaded = true;
			file.error = !!errorMessage;

			if (errorMessage)
			{
				file.errorMessage = errorMessage;
				logWarning("gf.core.Loader - " + file.type + "[" + file.key + "]" + ": " + errorMessage);
			}

			this.processLoadQueue();
		}



		private transformUrl(url: string): string
		{
			url += (url.indexOf("?") == -1 ? "?" : "&") + "_=" + this.game.client.config.version;
			return url;
		}



		protected loadFile(file: gf.core.File): void
		{
			switch (file.type)
			{
				case "image":
				case "textureatlas":
				case "bitmapfont":
				case "svg":
					file.url = this.transformUrl(file.url);
					this.loadImageTag(file);
					break;

				case "woff":
					const style: string = '<style type="text/css">@font-face {font-family:"' + file.key + '"; src:url("' + file.url + '") format("woff");}</style>';
					$(style).appendTo("head");
					WebFont.load(
						{
							custom:
								{
									families: [file.key]
								},
							fontactive: () =>
							{
								this.fileComplete(file);
							},
							fontinactive: () =>
							{
								this.fileComplete(file);
							}
						});
					break;

				case "audioatlas":
					file.url = this.transformUrl(file.url);
					this.xhrLoad(file, file.url, "arraybuffer", "fileComplete");
					break;

				case "audio":
					if (file.url)
					{
						file.url = this.transformUrl(file.url);
						this.xhrLoad(file, file.url, "arraybuffer", "fileComplete");
					}
					else
					{
						this.fileError(file, null, "no supported audio URL specified");
					}
					break;

				case "video":
					this.xhrLoad(file, file.url, "arraybuffer", "videoBufferLoaded");
					break;

				case "script":
					this.xhrLoad(file, this.transformUrl(file.url), "text", "fileComplete");
					break;

				case "json":
					file.url = this.transformUrl(file.url);
					this.xhrLoad(file, file.url, "text", "jsonLoadComplete");
					break;

				case "xml":
					file.url = this.transformUrl(file.url);
					this.xhrLoad(file, file.url, "text", "xmlLoadComplete");
					break;
			}
		}



		private videoBufferLoaded(file: gf.core.File, xhr?: XMLHttpRequest): void
		{
			file.data = PIXI.Texture.fromVideoUrl(file.url);

			this.fileComplete(file, xhr);
		}



		private loadImageTag(file: gf.core.File): void
		{
			file.data = new Image();
			file.data.name = file.key;

			if (this.crossOrigin)
			{
				file.data.crossOrigin = this.crossOrigin;
			}

			file.data.onload = () =>
			{
				if (file.data.onload)
				{
					file.data.onload = null;
					file.data.onerror = null;
					this.fileComplete(file);
				}
			};
			file.data.onerror = () =>
			{
				if (file.data.onload)
				{
					file.data.onload = null;
					file.data.onerror = null;
					this.fileError(file);
				}
			};

			file.data.src = file.url;

			// Image is immediately-available/cached
			if (file.data.complete && file.data.width && file.data.height)
			{
				file.data.onload = null;
				file.data.onerror = null;
				this.fileComplete(file);
			}
		}



		private xhrLoadWithXDR(
			file: gf.core.File,
			url: string,
			type: string,
			onload: string,
			onerror?: string): void
		{
			// Ref: http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
			let xhr = new window["XDomainRequest"]();
			xhr.open("GET", url, true);
			xhr.responseType = type;

			// XDomainRequest has a few quirks. Occasionally it will abort requests
			// A way to avoid this is to make sure ALL callbacks are set even if not used
			// More info here: http://stackoverflow.com/questions/15786966/xdomainrequest-aborts-post-on-ie-9
			xhr.timeout = 3000;

			onerror = onerror || "fileError";

			xhr.onerror = () =>
			{
				if (Loader.retryWithXhrLoad)
				{
					log("Fallback to xhrLoad:" + url);
					this._XDomainRequestFailedOnce = true;
					this.xhrLoad(file, url, type, onload, onerror);
				}
				else
				{
					try
					{
						return this[onerror](file, xhr);
					}
					catch (e)
					{
						this.asyncComplete(file, e.message || "Exception");
					}
				}
			};

			xhr.ontimeout = () =>
			{
				try
				{
					return this[onerror](file, xhr);
				}
				catch (e)
				{
					this.asyncComplete(file, e.message || "Exception");
				}
			};

			xhr.onprogress = function ()
			{
			};

			xhr.onload = () =>
			{
				try
				{
					return this[onload](file, xhr);
				}
				catch (e)
				{
					this.asyncComplete(file, e.message || "Exception");
				}
			};

			file.requestObject = xhr;
			file.requestUrl = url;

			//  Note: The xdr.send() call is wrapped in a timeout to prevent an issue with the interface where some requests are lost
			//  if multiple XDomainRequests are being sent at the same time.
			setTimeout(function ()
			{
				xhr.send();
			}, 0);
		}



		private xhrLoad(
			file: gf.core.File,
			url: string,
			type: string,
			onload: string,
			onerror?: string): void
		{
			if (this._XDomainRequestFailedOnce == false)
			{
				if (!!(window["XDomainRequest"] && !("withCredentials" in (new XMLHttpRequest()))))
				{
					this.xhrLoadWithXDR(file, url, type, onload, onerror);
					return;
				}
			}

			let xhr: XMLHttpRequest = new XMLHttpRequest();
			xhr.open("GET", url, true);
			xhr.withCredentials = true;
			xhr.responseType = <any> type;

			onerror = onerror || "fileError";

			xhr.onload = () =>
			{
				return this[onload](file, xhr);
			};

			xhr.onerror = () =>
			{
				try
				{
					return this[onerror](file, xhr);
				}
				catch (e)
				{
					if (!this._hasLoaded)
					{
						this.asyncComplete(file, e.message || "Exception");
					}
					else
					{
						logDebug(e, file);
					}
				}
			};

			file.requestObject = xhr;
			file.requestUrl = url;

			xhr.send();
		}



		private fileError(file: gf.core.File, xhr?: XMLHttpRequest, reason: string = ""): void
		{
			let url = file.requestUrl || this.transformUrl(file.url);
			let message = "Error loading file from URL " + url;

			if (!reason && xhr)
			{
				reason = xhr.status.toString();
			}

			if (reason)
			{
				message = message + " (" + reason + ")";
			}

			this.asyncComplete(file, message);
		}



		protected fileComplete(file: gf.core.File, xhr?: XMLHttpRequest): void
		{
			let loadNext = true;

			switch (file.type)
			{
				case "image":
					this.game.cache.addImage(file.key, file.url, file.data);
					break;

				case "svg":
					this.game.cache.addSVG(file.key, file.url, file.data);
					break;

				case "woff":
					break;

				case "audioatlas":
					//  Load the JSON before carrying on with the next file
					loadNext = false;
					file.atlasURL = this.transformUrl(file.atlasURL);
					this.xhrLoad(file, file.atlasURL, "text", "jsonLoadComplete");
					break;

				case "script":
					file.data = document.createElement("script");
					file.data.language = "javascript";
					file.data.type = "text/javascript";
					file.data.defer = false;
					file.data.text = xhr.responseText;
					document.head.appendChild(file.data);
					break;

				case "textureatlas":
					if (file.atlasURL == null)
					{
						this.game.cache.addTextureAtlas(file.key, file.url, file.data, file.atlasData);
					}
					else
					{
						//  Load the JSON or XML before carrying on with the next file
						loadNext = false;
						file.atlasURL = this.transformUrl(file.atlasURL);
						this.xhrLoad(file, file.atlasURL, "text", "jsonLoadComplete");
					}
					break;

				case "bitmapfont":
					if (!file.xmlURL)
					{
						this.game.cache.addBitmapFont(file.key, file.url, file.data, file.xmlData);
					}
					else
					{
						//  Load the XML before carrying on with the next file
						loadNext = false;
						file.xmlURL = this.transformUrl(file.xmlURL);
						this.xhrLoad(file, file.xmlURL, "text", "xmlLoadComplete");
					}
					break;

				case "audio":
					loadNext = false;
					file.data = xhr.response;
					this.game.cache.addSound(file.key, file.url, file.data);
					this.game.sounds.addSound(file.key, file.soundType, () =>
					{
						this.asyncComplete(file);
					});
					break;

				case "video":
					this.game.cache.addVideo(file.key, file.data);
					break;
			}

			if (loadNext)
			{
				this.asyncComplete(file);
			}
		}



		private jsonLoadComplete(file: gf.core.File, xhr: XMLHttpRequest): void
		{
			let data: any;
			try
			{
				data = JSON.parse(xhr.responseText);
			}
			catch (e)
			{
				logError("JSON parse error file " + file.url, e)
			}

			if (file.type === "json")
			{
				this.game.cache.addJSON(file.key, file.url, data);
				this.asyncComplete(file);
			}
			else if (file.type === "audioatlas")
			{
				this.game.cache.addSound(file.key, file.url, file.data, data);
				this.game.sounds.addSound(file.key, file.soundType, () =>
				{
					this.asyncComplete(file);
				});
			}
			else
			{
				this.game.cache.addTextureAtlas(file.key, file.url, file.data, data);
				this.asyncComplete(file);
			}
		}



		protected addToFileList(
			type: string,
			key: string,
			url: string,
			properties?: any,
			overwrite: boolean = false): void
		{
			let file: gf.core.File = new gf.core.File();
			file.type = type;
			file.key = key;
			file.url = url;
			file.data = null;
			file.loading = false;
			file.loaded = false;
			file.error = false;

			if (properties)
			{
				for (let prop in properties)
				{
					file[prop] = properties[prop];
				}
			}

			let fileIndex: number = this.getAssetIndex(type, key);

			if (overwrite && fileIndex > -1)
			{
				let currentFile: any = this._fileList[fileIndex];

				if (!currentFile.loading && !currentFile.loaded)
				{
					this._fileList[fileIndex] = file;
				}
				else
				{
					this._fileList.push(file);
					this._totalFileCount++;
				}
			}
			else if (fileIndex === -1)
			{
				this._fileList.push(file);
				this._totalFileCount++;
			}
		}



		public checkKeyExists(type: string, key: string): boolean
		{
			return this.getAssetIndex(type, key) > -1;
		}



		public getAssetIndex(type: string, key: string): number
		{
			let bestFound: number = -1;

			for (let i = 0; i < this._fileList.length; i++)
			{
				let file = this._fileList[i];

				if (file.type === type && file.key === key)
				{
					bestFound = i;

					// An already loaded/loading file may be superceded.
					if (!file.loaded && !file.loading)
					{
						break;
					}
				}
			}

			return bestFound;
		}



		/*
			Reset the loader and clear any queued assets. If `Loader.resetLocked` is true this operation will abort.
			This will abort any loading and clear any queued assets.
			Optionally you can clear any associated events.
				@param {boolean} [clearEvents=false] - If true, all listeners will be removed.
		*/
		public reset(clearEvents: boolean = false): void
		{
			this._isLoading = false;

			this._processingHead = 0;
			this._fileList.length = 0;
			this._flightQueue.length = 0;

			this._fileLoadStarted = false;
			this._totalFileCount = 0;
			this._loadedFileCount = 0;

			if (clearEvents)
			{
				this.removeAllListeners(gf.LOAD_COMPLETE);
				this.removeAllListeners(gf.LOAD_ERROR);
				this.removeAllListeners(gf.LOAD_PROGRESS);
			}
		}



		public script(key: string, url: string): gf.core.Loader
		{
			this.addToFileList("script", key, url, {syncPoint: true}, false);

			return this;
		}



		public image(key: string, url: string, overwrite: boolean = false): gf.core.Loader
		{
			this.addToFileList("image", key, url, undefined, overwrite);

			return this;
		}



		public json(key: string, url: string, overwrite: boolean = false): gf.core.Loader
		{
			this.addToFileList("json", key, url, undefined, overwrite);

			return this;
		}



		public svg(key: string, url: string, overwrite: boolean = false): gf.core.Loader
		{
			this.addToFileList("svg", key, url, null, overwrite);

			return this;
		}



		public xml(key: string, url: string, overwrite: boolean = false): gf.core.Loader
		{
			this.addToFileList("xml", key, url, null, overwrite);

			return this;
		}



		public audio(key: string, url: string, soundType: string = gf.SOUND_MUSIC): gf.core.Loader
		{
			this.addToFileList("audio", key, url, {buffer: null, soundType: soundType});

			return this;
		}



		public audiosprite(
			key: string,
			url: string,
			atlasURL: string,
			soundType: string = gf.SOUND_FX): gf.core.Loader
		{
			this.addToFileList("audioatlas", key, url, {atlasURL: atlasURL, soundType: soundType});

			return this;
		}



		public bitmapFont(
			key: string,
			textureURL: string,
			xmlURL?: string,
			xmlData?: any): gf.core.Loader
		{
			if (xmlURL)
			{
				this.addToFileList("bitmapfont", key, textureURL,
					{
						xmlURL: xmlURL,
					});
			}
			else
			{
				//  An xml string or object has been given
				if (typeof xmlData === "string")
				{
					let xml = gf.utils.Parser.XML(xmlData);

					if (!xml)
					{
						throw new Error("gf.core.Loader. Invalid Bitmap Font XML given");
					}

					this.addToFileList("bitmapfont", key, textureURL,
						{
							xmlURL: null,
							xmlData: xml,
						});
				}
			}

			return this;
		}



		public woff(key: string, url: string, overwrite: boolean = false): gf.core.Loader
		{
			this.addToFileList("woff", key, url, null, overwrite);

			return this;
		}



		public video(key: string, url: string, overwrite: boolean = false): gf.core.Loader
		{
			this.addToFileList("video", key, url, null, overwrite);

			return this;
		}



		public atlas(
			key: string,
			textureURL: string,
			atlasURL: string,
			atlasData?: any): gf.core.Loader
		{
			//  A URL to a json/xml file has been given
			if (atlasURL)
			{
				this.addToFileList("textureatlas", key, textureURL, {atlasURL: atlasURL});
			}
			else
			{
				atlasData = JSON.parse(atlasData);

				this.addToFileList("textureatlas", key, textureURL,
					{
						atlasURL: null,
						atlasData: atlasData
					});
			}

			return this;
		}



		public removeAll(): void
		{
			this._fileList.length = 0;
			this._flightQueue.length = 0;
		}



		public start(): void
		{
			if (this._isLoading)
			{
				return;
			}

			this._hasLoaded = false;
			this._isLoading = true;

			this.processLoadQueue();
		}



		/*
			Gibt die Anzahl der Dateien die geladen worden sind zurück.
			@returns {number}
		*/
		public get totalLoadedFiles(): number
		{
			return this._loadedFileCount;
		}



		/*
			Gibt die Anzahl der Dateien die noch nicht geladen worden sind zurück.
			@returns {number}
		*/
		public get totalQueuedFiles(): number
		{
			return this._totalFileCount - this._loadedFileCount;
		}



		/*
			Gibt den nicht gerundeten Lade-Fortschritt zurück (0.0 bis 100.0)
			@returns {number}
		*/
		public get progressFloat(): number
		{
			let progress: number = (this._loadedFileCount / this._totalFileCount) * 100;
			return gf.utils.Maths.clamp(progress || 0, 0, 100);
		}



		/*
			Gibt den gerundeten Lade-Fortschritt zurück (0 bis 100)
			@returns {number}
		*/
		public get progress(): number
		{
			return Math.round(this.progressFloat);
		}



		public get hasLoaded(): boolean
		{
			return this._hasLoaded;
		}



		public get isLoading(): boolean
		{
			return this._isLoading;
		}
	}



	export class File
	{
		public atlasData: any;
		public atlasURL: any;
		public data: any;
		public error: boolean;
		public errorMessage: string;
		public key: string;
		public loaded: boolean;
		public loading: boolean;
		public requestObject: any;
		public requestUrl: string;
		public soundType: string;
		public syncPoint: boolean;
		public type: string;
		public url: string;
		public xmlData: any;
		public xmlURL: string;
	}



	export class Asset
	{
		public index: number;
		public file: File;
		public loaded: boolean;
		public loading: boolean;



		constructor(index: number, file: File)
		{
			this.index = index;
			this.file = file;
		}
	}
}
