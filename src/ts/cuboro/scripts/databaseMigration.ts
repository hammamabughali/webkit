/// <reference path="../../kr3m/async/loop.ts"/>
/// <reference path="../../kr3m/db/mysqldbconfig.ts"/>
/// <reference path="../../kr3m/lib/node.ts"/>
/// <reference path="../../kr3m/util/log.ts"/>

/// <reference path="../../kr3m/services/paramshelper.ts"/>
/// <reference path="../../kr3m/util/file.ts"/>
/// <reference path="../../cuboro/db.ts"/>
/// <reference path="../../cuboro/tables/trackvo.ts"/>
/// <reference path="../../cuboro/vo/track.ts"/>



var dbConfig  = kr3m.util.File.loadJsonFileSync("../config/config.json");
db = new kr3m.db.MySqlDb(dbConfig.mysql);
log(db.config);
log(" START SCRIPT");


var countTracks = 0;
log(" trackCounter " ,countTracks);
var sql = "SELECT * FROM `tracks`";
sql = db.escape(sql, []);
log(sql);


function saveTrackImage(track:any, data:any, callback:Callback):void
{
	if (data.texture)
	{
		const filePath = "../public/track/"+track.id+".png";
		const fileUrl = "track/"+track.id+".png";
		log(data.texture.substr(0, 100));
		return kr3m.util.File.saveDataUrl(data.texture, filePath, (status) =>
		{
			if (status == kr3m.SUCCESS)
			{
				track.imageUrl = fileUrl;
				//delete data.texure;
				//track.data = JSON.stringify(data);
			}
			callback();
		});
	}
	callback();
}


db.queryIterative(sql, (tracks:any[], callback:() => void) =>
{
	kr3m.async.Loop.forEach(tracks, (track, next) =>
	{
		var data = kr3m.util.Json.decode(track.data);
		var evaluation = data.evaluation;
		if (evaluation && typeof evaluation.scoreTotal === 'number')
		{
			log(evaluation.scoreTotal);
			track.scoreTotal = evaluation.scoreTotal;
		}
		saveTrackImage(track, data, () => db.update('tracks', track, next, 'id', error => next()));
	}, callback)
}, () =>
{
	log("done");
	process.exit(0);
}, 100, (error) =>
{
	log("error", error);
});
