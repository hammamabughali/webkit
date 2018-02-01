/// <reference path="../../cuboro/models/pdf.ts"/>
/// <reference path="../../cuboro/tables/trackstable.ts"/>
/// <reference path="../../cuboro/tables/trackvo.ts"/>
/// <reference path="../../cuboro/tables/userstable.ts"/>
/// <reference path="../../cuboro/vo/history.ts"/>
/// <reference path="../../cuboro/vo/track.ts"/>


module cuboro.models
{
	export class Track
	{
		public load(
			trackId: number,
			callback: ResultCB<cuboro.vo.Track>): void
		{
			tTracks.getById(trackId, (track) =>
			{
				if (!track)
					return callback(undefined, kr3m.ERROR_INPUT);

				track.getOwner((owner) =>
				{
					var vo = new cuboro.vo.Track(track, owner);
					callback(vo, kr3m.SUCCESS);
				});
			}, () => callback(undefined, kr3m.ERROR_DATABASE));
		}



		public save(
			userId: number,
			trackData: any,
			name: string,
			overwrite: boolean,
			previousId:number,
			callback: ResultCB<cuboro.vo.Track>): void
		{
			tUsers.getById(userId, (user) =>
			{
				if (!user)
					return callback(undefined, kr3m.ERROR_INTERNAL);

				tTracks.getByName(name, (track) =>
				{
					if (track)
					{
						if (track.ownerId != userId)
							return callback(undefined, cuboro.ERROR_IS_NOT_TRACK_OWNER);

						if (track.isPublished)
							return callback(undefined, cuboro.ERROR_TRACK_IS_PUBLISHED);

						if (!overwrite)
							return callback(undefined, cuboro.ERROR_TRACK_NAME_NOT_OVERWRITTEN);
					}
					else
					{
						track = new cuboro.tables.TrackVO();
						track.ownerId = userId;
					}

					track.name = name;
					track.data = kr3m.util.Json.encode(trackData);
					track.lastSavedWhen = new Date();
					track.scoreTotal = trackData.evaluation.scoreTotal;
					if(previousId)
						track.previousId = previousId;


					track.upsert(() =>
					{
						var vo = new cuboro.vo.Track(track, user);
						callback(vo, kr3m.SUCCESS);
					}, () => callback(undefined, kr3m.ERROR_DATABASE));
				});
			});
		}



		public saveImageTrack(
			userId: number,
			name: string,
			trackId:string,
			trackImage : string,
			callback: ResultCB<String>): void
		{
			tUsers.getById(userId, (user) =>
			{
				if (!user)
					return callback(undefined, kr3m.ERROR_INTERNAL);

				tTracks.getByName(name, (track) =>
				{
					if (track)
					{
						if (track.ownerId != userId)
							return callback(undefined, cuboro.ERROR_IS_NOT_TRACK_OWNER);
					}
					else
					{
						track = new cuboro.tables.TrackVO();
						track.ownerId = userId;
					}

					var filePath = "public/track/"+trackId+".png";
					const  fileUrl = "track/"+trackId+".png";
					kr3m.util.File.saveDataUrl(trackImage, filePath, (status) =>
					{
						if (status == kr3m.SUCCESS)
						{
							track.imageUrl = fileUrl;
							track.upsert(() =>
							{
								callback(fileUrl, kr3m.SUCCESS);
							}, () => callback(undefined, kr3m.ERROR_DATABASE));
						}
						else
							callback("", status);
					});
				});
			});
		}



		public delete(
			userId: number,
			trackId: number,
			callback: StatusCallback): void
		{
			tTracks.getById(trackId, (track) =>
			{
				if (!track)
					return callback(kr3m.ERROR_INPUT);

				if (track.ownerId != userId)
					return callback(kr3m.ERROR_DENIED);

				track.delete(() => callback(kr3m.SUCCESS), () => callback(kr3m.ERROR_DATABASE));
			});
		}



		public publish(
			userId: number,
			trackId: number,
			name: string,
			callback: StatusCallback): void
		{
			tTracks.getById(trackId, (track) =>
			{
				if (!track)
					return callback(kr3m.ERROR_INPUT);

				if (track.ownerId != userId)
					return callback(kr3m.ERROR_DENIED);

				track.isPublished = true;
				track.name = name;
				track.update(() => callback(kr3m.SUCCESS), () => callback(kr3m.ERROR_DATABASE));
			});
		}



		public unpublish(
			userId: number,
			trackId: number,
			callback: StatusCallback): void
		{
			tTracks.getById(trackId, (track) =>
			{
				if (!track)
					return callback(kr3m.ERROR_INPUT);

				if (track.ownerId != userId)
					return callback(kr3m.ERROR_DENIED);

				track.isPublished = false;
				track.update(() => callback(kr3m.SUCCESS), () => callback(kr3m.ERROR_DATABASE));
			});
		}


		public isNameUnique(
			trackId: number,
			newName: string,
			callback: ResultCB<boolean>): void
		{
			var where = 'id != ? AND isPublished = ? AND name = ?';
			where = db.escape(where,[trackId, true,  newName] );
			tTracks.getCount(where, count => callback(count == 0, kr3m.SUCCESS), () => callback(false, kr3m.ERROR_DATABASE));
		}




		public isPublished(
			trackId: number,
			callback: ResultCB<boolean>): void
		{
			tTracks.getById(trackId, (track) =>
			{
				if (!track)
					return callback(undefined, kr3m.ERROR_INPUT);

				callback(track.isPublished, kr3m.SUCCESS);
			});
		}



		public printPdf(
			context: kr3m.net2.Context,
			trackId:number,
			screenshot:string,
			callback: StringCallback): void
		{
			tTracks.getById(trackId, (track) =>
			{
				if(!track)
					return callback(kr3m.ERROR_EMPTY_DATA);

				track.getComments((comments)=>
				{
					mPdf.generateUniqueRandomName("Track_", (fileName) =>
					{
						var savePath = "public/pdf/" + fileName + ".pdf";
						var callbackUrl = "pdf/" + fileName + ".pdf";
						var bodyTemplate = "public/templates/pdf/body.html";

						var commentToPdf = '<ul style="width: 300px">';
						kr3m.async.Loop.forEach(comments,  (comment, next, i)=>
						{
							comment.getUser((user)=>
							{
								commentToPdf += '<li>' + user.name + " : " + comment.comment + '</li>' ;
								next();
							});
						}, ()=>
						{
							commentToPdf += "</ul>";
							var data = kr3m.util.Json.decode(track.data);

							var cubes = [];
							for(var i = 0; i < data['cubes'].length; i++ )
								cubes.push(kr3m.util.Json.decode(data['cubes'][i]));

							var cubesAsso = kr3m.util.Util.bucketBy(cubes,'key');

							var cubesAssoIdCount = [];
							Object.keys(cubesAsso).forEach((v, i, arr)=>
							{
								var cubeAssozIdCount = {"cubeId": v, "count" : cubesAsso[v].length, "countId" : v.replace('cube_', '')};
								cubesAssoIdCount.push(cubeAssozIdCount);
							});
							kr3m.util.Util.sortBy(cubesAssoIdCount, "cubeId", true);

							var cubesAssoIdCountLength = cubesAssoIdCount.length;
							var colCounter = 0;
							var colPerRow = 7;

							var cubesHtml = "<div class='divTable' style='width: 100%;' border='0'>";
							for(var i = 0; i < cubesAssoIdCount.length; i++)
							{
								if((i % colPerRow) == 0)
								{
									cubesHtml +="<div class=\"divTableRow\">";
								}

								if((i % colPerRow) >= 0)
								{
									++colCounter;
									cubesHtml +='<div class="divTableCell"><div class="cubeinfo"><span class="spanCounterCuber">'+ cubesAssoIdCount[i]['count']+'x</span><span>'+ cubesAssoIdCount[i]['countId'] +'</span></div><img height="140" width="140" style="margin-top: 3px;" src="img/pdf/'+ cubesAssoIdCount[i]['cubeId']+'.png"></div>';
								}

								if(colCounter == colPerRow || i == cubesAssoIdCountLength -1)
								{
									cubesHtml += "</div>";
									colCounter = 0;
								}
							}
							cubesHtml += "</div>";


							var layersHtml = "";
							for(var layerIndex = 0; layerIndex < 9; layerIndex++)
							{
								if(layerIndex == 6)
									layersHtml +='<div style="page-break-before: always;"></div>';
								layersHtml += '<div class="ldivTable" ><span style="background-color:#cfcfcf;font-family: Arial; font-size: 22px;">'+ (layerIndex+1) +'</span>';
								for(var rowIndex = 0; rowIndex < 12; rowIndex++ )
								{
									layersHtml += "<div class=\"divTableRow\">";
									for(var colIndex = 0; colIndex < 12; colIndex++)
									{
										//x:'+colIndex+'z:'+ rowIndex+ 'y:'+ layerIndex +'
										var cubeData = this.isCellInMap(cubes, {"x":colIndex, "y":layerIndex, "z":rowIndex});
										if( cubeData != null)
											layersHtml += '<div class="ldivTableCell" style="background-color: black; color: white;">'+ cubeData["key"].replace('cube_', '') +'</div>';
										else
											layersHtml += '<div class="ldivTableCell">&nbsp;</div>';
									}
									layersHtml +="</div>";
								}

								layersHtml +="</div>";

							}

							var setsHtml="";
							for(var i = 0; i < data['sets'].length; i++)
								setsHtml +='<img src="img/pdf/sets/'+ data['sets'][i]+'.png">';

							const tokens =
								{
									TRACKNAME : track.name,
									DATE: new Date(),
									SCREENSHOT: screenshot,
									PDF_CUBES_NUMBERS: data['evaluation']['cubes'],
									PDF_CUBES_NUMBERS_SCORE: data['evaluation']['scoreCubes'],
									PDF_TRACK_ELEMENTS: data['evaluation']['track'][0],
									PDF_TRACK_ELEMENTS_SCORE: data['evaluation']['scoreTrack'][0],
									PDF_TRACK_2_ELEMENTS: data['evaluation']['track'][1],
									PDF_TRACK_3_ELEMENTS: data['evaluation']['track'][2],
									PDF_TRACK_4_ELEMENTS: data['evaluation']['track'][3],
									PDF_TRACK_2_ELEMENTS_SCORE: data['evaluation']['scoreTrack'][1],
									PDF_TRACK_3_ELEMENTS_SCORE: data['evaluation']['scoreTrack'][2],
									PDF_TRACK_4_ELEMENTS_SCORE: data['evaluation']['scoreTrack'][3],
									PDF_TRACK_PLUS_UNDER_ELEMENTS: data['evaluation']['substructure'],
									PDF_TRACK_PLUS_UNDER_ELEMENTS_SCORE: data['evaluation']['scoreSubstructure'],
									PDF_TRACK_SCORETOTAL:data['evaluation']['scoreTotal'],
									PDF_CUBE_TABLE: cubesHtml,
									PDF_LAYER_TABLE: layersHtml,
									PDF_YOUR_USED_SETS: setsHtml,
									PDF_COMMENTS:commentToPdf
								};

							mPdf.generatePdf(context, bodyTemplate, savePath, tokens, (success) =>
							{
								if (!success)
									return callback(null);
								else
									callback(callbackUrl);
							});
						});

					});
				}, error => callback(kr3m.ERROR_DATABASE));
				});
		}



		private isCellInMap(cubes:any , map:any):any
		{
			for(var i = 0; i < cubes.length; i++ )
			{
				if(JSON.stringify(map) === JSON.stringify(cubes[i]['map']))
					return cubes[i];
			}

			return null;
		}








		public getHistory(
			trackId:number,
			callback:ResultCB<cuboro.vo.History>):void
		{
			let previousVos:cuboro.vo.Track[] = [];
			let forwardVos:cuboro.vo.Track[] = [];

			var history = new cuboro.vo.History();
			history.previousTracks = previousVos;
			history.forwardTracks = forwardVos;

			tTracks.getById(trackId, track=>
			{
				if (!track)
					return callback(history , kr3m.ERROR_EMPTY_DATA);

				let tmp:cuboro.tables.TrackVO = track;

				kr3m.async.Loop.loop((next) =>
				{
					tmp.getPrevious(previous =>
					{
						if (!previous)
						{
							next(false);
						}
						else
						{
							history.previousTracks.push(new cuboro.vo.Track(previous, null));
							tmp = previous;
							next(true);
						}
					}, error => callback(history , kr3m.ERROR_EMPTY_DATA));
				},() =>
				{
					track.getTracks(forwads =>
					{
						for (var i = 0; i < forwads.length; i++)
							history.forwardTracks.push(new cuboro.vo.Track(forwads[i], null));

						callback( history, kr3m.SUCCESS);
					});
				});
			}, error => callback(history, kr3m.ERROR_DATABASE));
		}
	}
}



var mTrack = new cuboro.models.Track();
