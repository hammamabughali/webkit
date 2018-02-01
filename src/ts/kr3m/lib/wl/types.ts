module kr3m.wl
{
	export class UserProfile
	{
		public userId:number;
		public username:string;
		public gender:string; // "m" or "f"
		public profileUrl:string;
		public profileImageUrl:string; // can be null if the user hasn't uploaded a unique profile picture yet
	}
}
