/// <reference path="../../cuboro/vo/trackdata.ts"/>
/// <reference path="../../cuboro/vo/user.ts"/>

//# SERVER
/// <reference path="../../cuboro/tables/trackvo.ts"/>
/// <reference path="../../kr3m/util/json.ts"/>
//# /SERVER



module cuboro.vo
{
	export class Track
	{
		public id: number;
		public data: cuboro.vo.TrackData = new cuboro.vo.TrackData();
		public lastSavedWhen: Date;
		public name: string;
		public owner: User;
		public rating: number; // equals 0 while not enough ratings available
		public scoreTotal: number;
		public imageUrl: string;



//# SERVER
		constructor(track: cuboro.tables.TrackVO, owner: cuboro.tables.UserVO)
		{
			this.id = track.id;
			this.name = track.name;
			this.lastSavedWhen = track.lastSavedWhen;
			this.scoreTotal = track.scoreTotal;
			this.imageUrl = track.imageUrl;

			this.owner = new User(owner);

			this.data = kr3m.util.Json.decode(track.data);
		}
//# /SERVER
	}
}
