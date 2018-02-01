/// <reference path="../../cuboro/stubs/abstract.ts"/>
/// <reference path="../../cuboro/vo/history.ts"/>
/// <reference path="../../cuboro/vo/track.ts"/>



module cuboro.stubs
{
	export class Track extends Abstract
	{
		constructor()
		{
			super();

			this.htmlEscapeStrings = false;
		}



		public generateUniqueRandomName(
			namePrefix : string,
			callback:StringCallback):void
		{
			var params = {namePrefix:namePrefix};
			this.callService("Track.generateUniqueRandomName", params, response => callback(response.data))
		}



		public delete(
			trackId:number,
			callback:StatusCallback):void
		{
			var params = {trackId : trackId};
			this.callService("Track.delete", params, response => callback(response.status));
		}



		public unpublish(
			trackId:number,
			callback:StatusCallback):void
		{
			var params = {trackId : trackId};
			this.callService("Track.unpublish", params, response => callback(response.status));
		}



		public publish(
			trackId:number,
			name: string,
			callback:StatusCallback):void
		{
			var params = {trackId : trackId, name: name};
			this.callService("Track.publish", params, response => callback(response.status));
		}



		public load(
			trackId:any,
			callback:ResultCB<cuboro.vo.Track>):void
		{
			var params = {trackId : trackId};
			this.callService("Track.load", params, response => callback(response.data, response.status));
		}



		public save(
			trackData:any,
			name:string,
			overwrite:boolean,
			previousId:number|null,
			callback:ResultCB<cuboro.vo.Track>):void
		{
			var params = {trackData : trackData, name : name, overwrite : overwrite, previousId:previousId};
			this.callService("Track.save", params, response => callback(response.data, response.status));
		}


		
		public saveTrackImage(
			trackId:number,
			name:string,
			trackImage:string,
			callback:StringCallback):void
		{
			var params = {trackId:trackId, name : name, trackImage: trackImage  };
			this.callService("Track.saveTrackImage", params, response => callback(response.data));
		}



		public isNameUnique(
			trackId:number,
			name:string,
			callback:ResultCB<boolean>):void
		{
			var params = {trackId : trackId, newName : name};
			this.callService("Track.isNameUnique", params, response => callback(response.data, response.status));
		}


		public isPublished(
			trackId:number,
			callback:ResultCB<boolean>):void
		{
			var params = {trackId : trackId};
			this.callService("Track.isPublished", params, response => callback(response.data, response.status));
		}



		public getHistory(
			trackId:number,
			callback:ResultCB<cuboro.vo.History>):void
		{
			var params = {trackId : trackId};
			this.callService("Track.getHistory", params, response => callback(response.data, response.status));
		}
	}
}



var sTrack = new cuboro.stubs.Track();
