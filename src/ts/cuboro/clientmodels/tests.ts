/// <reference path="../../cuboro/clientmodels/track.ts"/>
/// <reference path="../../cuboro/clientmodels/user.ts"/>
/// <reference path="../../cuboro/stubs/gallery.ts"/>
/// <reference path="../../cuboro/stubs/track.ts"/>
/// <reference path="../../cuboro/vo/gallery/filters.ts"/>
/// <reference path="../../cuboro/vo/track.ts"/>
/// <reference path="../../kr3m/async/loop.ts"/>
/// <reference path="../../kr3m/lib/three.ts"/>
/// <reference path="../../kr3m/util/log.ts"/>
/// <reference path="../../kr3m/util/util.ts"/>



module cuboro.clientmodels
{
	class RunTestResult
	{
		public cubeMapPosition: THREE.Vector3;
		public dropHeight: string;

		public duration: number;
		public score: number;

		public groundTouchPosition: any;
		public groundTouchVelocity: any;
		public groundTouchRotation: any;

		public reachedGround: boolean;
		public reachedContainer: boolean;
		public hasSkipped: boolean;

		public success: boolean;
	}



	class TrackTestResults
	{
		public trackId: number;
		public trackName: string;
		public runs: RunTestResult[] = [];
		public success: boolean;
	}



	export class Tests
	{
		private propMap =
			{
				angularDamping: "pg.marble.body.angularDamping",
				angularFactorX: "pg.marble.body.angularFactor.x",
				angularFactorY: "pg.marble.body.angularFactor.y",
				angularFactorZ: "pg.marble.body.angularFactor.z",
				friction: "pg.world.defaultContactMaterial.friction",
				gravity: "pg.world.gravity.y",
				linearDamping: "pg.marble.body.linearDamping",
				linearFactorX: "pg.marble.body.linearFactor.x",
				linearFactorY: "pg.marble.body.linearFactor.y",
				linearFactorZ: "pg.marble.body.linearFactor.z",
				restitution: "pg.world.defaultContactMaterial.restitution",
				mass: "pg.marble.body.mass"
			};

		public pg: cuboro.core.Playground;

		private initialized = false;
		private currentRun: RunTestResult;
		private running = false;
		private cancelled = false;



		private onMarbleCollision(body: CANNON.Body): void
		{
			if (body.id === this.pg.ground.body.id && !this.currentRun.groundTouchPosition)
			{
				this.currentRun.groundTouchPosition = this.pg.marble.body.position.clone();
				this.currentRun.groundTouchVelocity = this.pg.marble.body.velocity.clone();
				this.currentRun.groundTouchRotation = this.pg.marble.body.quaternion.clone();
			}
		}



		public showProps(): void
		{
			var props: any = {};
			for (var prop in this.propMap)
				props[prop] = kr3m.util.Util.getProperty(this, this.propMap[prop]);
			log("props", props);
		}



		public setProp(prop: string, value: number): void
		{
			if (!this.propMap[prop])
				return logError("unknown property name:", prop);

			kr3m.util.Util.setProperty(this, this.propMap[prop], value);
			log(prop, "set to", value);
		}



		public cancel(): void
		{
			this.cancelled = true;
			log("----------------------------------------");
			log("automated tests will be cancelled after next run");
			log("----------------------------------------");
		}



		public setDropHeight(value: "LOW" | "MEDIUM" | "HIGH", height: number): void
		{
			cuboro.MARBLE_DROP_HEIGHTS[value] = height;
			this.pg.gameScreen.bottomMenu.btDropHeight.dropHeight = value;
		}



		private loadTrack(track: cuboro.vo.Track,
						callback: Callback): void
		{
			this.pg.once(cuboro.PLAYGROUND_READY, callback, this);
			cuboro.core.Loader.loadTrack(this.pg.game, track, false);
		}



		private startRun(
			startCube: cuboro.core.Cube,
			dropHeightId: string,
			callback: CB<RunTestResult>): void
		{
			this.currentRun = new RunTestResult();
			this.currentRun.cubeMapPosition = startCube.mapPosition.clone();
			this.currentRun.dropHeight = dropHeightId;
			var startTime = Date.now();

			var freeMapY = this.pg.map.getNextEmptyY(startCube.mapPosition.x, startCube.mapPosition.z);
			var position = this.pg.map.to3DPos(startCube.mapPosition.x, freeMapY, startCube.mapPosition.z);
			this.pg.gameScreen.bottomMenu.btDropHeight.dropHeight = cuboro.MARBLE_DROP_HEIGHTS[dropHeightId];
			position.y += cuboro.MARBLE_DROP_HEIGHTS[dropHeightId];
			this.pg.marble.x = position.x;
			this.pg.marble.y = position.y;
			this.pg.marble.z = position.z;

			this.pg.marble.mesh.visible = true;
			this.pg.cubes.highlightMarble(true);
			this.pg.marble.start();
			this.pg.marble.once("stop", () =>
			{
				this.currentRun.reachedGround = this.pg.marble.isOnGround();
				this.currentRun.reachedContainer = this.pg.marble.isInContainer();
				this.currentRun.hasSkipped = this.pg.marble.hasSkipped();

				this.currentRun.success = !this.currentRun.hasSkipped && (this.currentRun.reachedGround || this.currentRun.reachedContainer);
				this.currentRun.duration = Date.now() - startTime;
				this.currentRun.duration *= this.pg.physicSpeedFactor;
				this.currentRun.score = this.pg.evaluation.current.scoreTotal;

				var result = this.currentRun;
				this.currentRun = undefined;
				setTimeout(() => callback(result), 1);
			});
		}



		private showRunResult(run: RunTestResult): void
		{
			var outputs =
				[
					"start:", run.cubeMapPosition,
					"dropHeight:", run.dropHeight,
					"score:", run.score,
					"duration:", (run.duration / 1000).toFixed(1) + "s",
					"hasSkipped:", run.hasSkipped,
					"reachedGround:", run.reachedGround,
					"reachedContainer:", run.reachedContainer,
					"groundTouchPosition:", run.groundTouchPosition,
					"groundTouchVelocity:", run.groundTouchVelocity,
					"groundTouchRotation:", run.groundTouchRotation
				];

			if (run.success)
				outputs.unshift("%cSUCCESS", "background-color: green; color: white; padding: 5px;");
			else
				outputs.unshift("%cFAILURE", "background-color: red; color: white; padding: 5px;");

			log(...outputs);
		}



		private runTests(callback: CB<TrackTestResults>): void
		{
			log("testing track", mTrack.id, "-", mTrack.name);

			var trackResults = new TrackTestResults();
			trackResults.trackId = mTrack.id;
			trackResults.trackName = mTrack.name;

			var cubes = this.pg.cubes.getHighestStartCubes();
			if (cubes.length == 0)
			{
				trackResults.success = false;
				logError("no starting cube found on the highest level");
				return callback(trackResults);
			}

			kr3m.async.Loop.forEach(cubes, (cube, nextCube) =>
			{
				kr3m.async.Loop.forEachAssoc(cuboro.MARBLE_DROP_HEIGHTS, (dropHeightId, dropHeight, nextHeight) =>
				{
					if (this.cancelled)
					{
						this.pg.physicSpeedFactor = 1;
						this.running = false;
						return log("automatic testing cancelled by user");
					}

					this.startRun(cube, dropHeightId, (runResult) =>
					{
						trackResults.runs.push(runResult);
						this.showRunResult(runResult);
						nextHeight();
					});
				}, nextCube);
			}, () => callback(trackResults));
		}



		private showResults(results: TrackTestResults[]): void
		{
			log("----------------------------------------");
			log("test run results");
			log("----------------------------------------");

			var totalRuns = 0;
			var totalSuccesses = 0;

			for (var i = 0; i < results.length; ++i)
			{
				totalRuns += results[i].runs.length;
				for (var j = 0; j < results[i].runs.length; ++j)
				{
					if (results[i].runs[j].success)
						++totalSuccesses;
				}
			}

			log("successfull", totalSuccesses, "/", totalRuns);
		}



		private init(): void
		{
			this.initialized = true;
			this.pg.marble.body.addEventListener("collide", event => this.onMarbleCollision(event.body));
		}



		public run(speed = 1, trackIds?: number[]): void
		{
			if (this.running)
				return log("automated tests are already running");

			if (!this.initialized)
			{
				this.init();
			}

			console.clear();

			log("----------------------------------------");
			log("running automated tests");
			log("----------------------------------------");

			this.running = true;
			this.cancelled = false;
			this.pg.physicSpeedFactor = speed;

			if (!mUser.isLoggedIn())
				return logError("user is not logged in");

			var filters = new cuboro.vo.gallery.Filters();
			filters.limit = 999999999;
			filters.own = true;
			sGallery.getPage(filters, (page, status) =>
			{
				if (status != kr3m.SUCCESS)
					return logError("error while loading tracks");

				var results: TrackTestResults[] = [];
				var tracks;

				if (trackIds)
					tracks = page.tracks.filter(track => trackIds.indexOf(track.id) >= 0);
				else
					tracks = page.tracks;

				log("testing " + tracks.length + " tracks");

				kr3m.async.Loop.forEach(tracks, (track, next) =>
				{
					this.loadTrack(track, () =>
					{
						this.runTests((result) =>
						{
							results.push(result);

							if (this.cancelled)
							{
								this.pg.physicSpeedFactor = 1;
								this.running = false;
								return log("automatic testing cancelled by user");
							}

							next();
						});
					});
				}, () =>
				{
					this.pg.physicSpeedFactor = 1;
					this.running = false;
					log("tests completed");
					this.showResults(results);
				});
			});
		}
	}
}



var mTests = new cuboro.clientmodels.Tests();
