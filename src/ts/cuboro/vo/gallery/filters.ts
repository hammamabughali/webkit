module cuboro.vo.gallery
{
	export class Filters
	{
		public offset = 0;
		public limit = 20;
		public sortBy: "rating"|"age" = "rating";
		public own = false; // get only the tracks owned by the current user
		public edu = false; // get only the tracks marked as educational
	}
}
