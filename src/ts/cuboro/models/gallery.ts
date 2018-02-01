/// <reference path="../../cuboro/models/user.ts"/>
/// <reference path="../../cuboro/tables/trackstable.ts"/>
/// <reference path="../../cuboro/tables/trackvo.ts"/>
/// <reference path="../../cuboro/vo/gallery/filters.ts"/>
/// <reference path="../../cuboro/vo/gallery/page.ts"/>



module cuboro.models
{
	export class Gallery
	{
		public getPage(
			context:Context,
			filters:cuboro.vo.gallery.Filters,
			callback:ResultCB<cuboro.vo.gallery.Page>):void
		{
			switch (filters.sortBy)
			{
				case "rating":
					var ordering = ["scoreTotal", "DESC", "createdWhen", "ASC"];
					break;

				case "age":
					var ordering = ["createdWhen", "DESC"];
					break;

				default:
					return callback(undefined, kr3m.ERROR_INPUT);
			}

			context.need({region : true}, () =>
			{
				var where = db.escape("`regionId` = ?", [context.region.id]);
				mUser.getFromContext(context, (user) =>
				{
					if (filters.edu)
					{
						where = db.where({isPublished : true, isEducational : true}) + " AND " + where;
					}
					else
					{
						var orParts:string[] = [];

						if (!user || !filters.own)
							orParts.push("`isPublished` = 'true'");

						if (filters.own && user)
							orParts.push(db.escape("`ownerId` = ?", [user.id]));

						where += " AND (" + orParts.join(" OR ") + ")";
					}
					tTracks.get(where, filters.offset, filters.limit, ordering, (tracks) =>
					{
						var page = new cuboro.vo.gallery.Page();
						page.usedFilters = filters;
						var userIds = tracks.map(track => track.ownerId);
						tUsers.getByIds(userIds, (usersById) =>
						{
							page.tracks = tracks.map(track => new cuboro.vo.Track(track, usersById[track.ownerId]));
							tTracks.getCount(where,(totalCount) =>
							{
								page.totalCount = totalCount;
								callback(page, kr3m.SUCCESS);
							});
						});
					});
				});
			}, () => callback(undefined, kr3m.ERROR_INTERNAL));
		}
	}
}



var mGallery = new cuboro.models.Gallery();
