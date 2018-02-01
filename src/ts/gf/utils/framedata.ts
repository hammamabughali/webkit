/// <reference path="frame.ts"/>



module gf.utils
{
	export class FrameData
	{
		protected _frames:gf.utils.Frame[];
		protected _frameNames:any;



		constructor()
		{
			this._frames = [];
			this._frameNames = [];
		}



		/*
			Fügt einen Frame zu diesem FrameData hinzu.
				@param frame
			@returns {gf.utils.Frame}
		*/
		public addFrame(frame:gf.utils.Frame)
		{
			frame.index = this._frames.length;

			this._frames.push(frame);

			if (frame.name !== "")
			{
				this._frameNames[frame.name] = frame.index;
			}

			return frame;
		}



		/*
			Gibt anhand eines Indexes den Frame zurück.
				@param index
			@return {gf.utils.Frame}
		*/
		public getFrame(index:number = 0):gf.utils.Frame
		{
			if (index > this._frames.length)
			{
				index = 0;
			}

			return this._frames[index];
		}



		/*
			Gibt anhand des Framenamens den Frame zurück.
				@param name
			@returns {gf.utils.Frame}
		*/
		public getFrameByName(name:string):gf.utils.Frame
		{
			if (typeof this._frameNames[name] == "undefined")
				logWarning("Frame with name \"" + name + "\" is not in given sprite sheet.");

			return this._frames[this._frameNames[name]];
		}



		/*
			Prüft auf einen gegebenen Framenamen.
				@param name
			@returns {boolean}
		*/
		public checkFrameName(name:string):boolean
		{
			return this._frameNames[name] != null;
		}



		/*
			Gibt alle Frames in diesem FrameData zurück.
				@returns {gf.utils.Frame[]}
		*/
		public getFrames():gf.utils.Frame[]
		{
			return this._frames;
		}



		/*
			Gibt die Anzahl der Frames in diesem FrameData zurück.
				@returns {number}
		*/
		public get total():number
		{
			return this._frames.length;
		}
	}
}
