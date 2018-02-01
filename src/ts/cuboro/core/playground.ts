/// <reference path="../../cuboro/clientmodels/tests.ts"/>
/// <reference path="../../cuboro/core/assetloader.ts"/>
/// <reference path="../../cuboro/core/assets.ts"/>
/// <reference path="../../cuboro/core/canvas.ts"/>
/// <reference path="../../cuboro/core/controls.ts"/>
/// <reference path="../../cuboro/core/controlssettings.ts"/>
/// <reference path="../../cuboro/core/cube.ts"/>
/// <reference path="../../cuboro/core/cubes.ts"/>
/// <reference path="../../cuboro/core/evaluation.ts"/>
/// <reference path="../../cuboro/core/ground.ts"/>
/// <reference path="../../cuboro/core/history.ts"/>
/// <reference path="../../cuboro/core/map.ts"/>
/// <reference path="../../cuboro/core/marble.ts"/>
/// <reference path="../../cuboro/core/placeables.ts"/>
/// <reference path="../../cuboro/core/select.ts"/>
/// <reference path="../../kr3m/lib/cannon.ts"/>
/// <reference path="../../kr3m/lib/greensock.ts"/>
/// <reference path="../../kr3m/lib/howler.ts"/>
/// <reference path="../../kr3m/lib/jquery.ts"/>
/// <reference path="../../kr3m/lib/pixi.ts"/>
/// <reference path="../../kr3m/lib/three.ts"/>



module cuboro.core
{
	export class Playground extends PIXI.utils.EventEmitter
	{
		public assets: cuboro.core.Assets;
		public camera: THREE.PerspectiveCamera;
		public canvas: cuboro.core.Canvas;
		public controls: cuboro.core.Controls;
		public cubeOpacity: number;
		public cubes: cuboro.core.Cubes;
		public elapsedMS: number;
		public elementMargin: number;
		public evaluation: cuboro.core.Evaluation;
		public game: gf.core.Game;
		public gameScreen: cuboro.screens.Game;
		public ground: cuboro.core.Ground;
		public history: cuboro.core.History;
		public layerMargin: number;
		public map: cuboro.core.Map;
		public marble: cuboro.core.Marble;
		public physicSpeedFactor = 1;
		public placeables: cuboro.core.Placeables;
		public scene: THREE.Scene;
		public select: cuboro.core.Select;
		public spotLight: THREE.SpotLight;
		public world: CANNON.World;

		private accumulator: number;
		private saveId: number;
		private _isRunning: boolean;
		private _isSaving: boolean;
		private _physicsEnabled: boolean;



		constructor(gameScreen: cuboro.screens.Game)
		{
			super();

			mTests.pg = this;

			this._isSaving = false;

			this.game = gameScreen.game;
			this.gameScreen = gameScreen;

			this.world = new CANNON.World();
			this.world.bodies = [];
			this.world.gravity.set(0, -50, 0);
			this.world.defaultContactMaterial.friction = 0.0018;
			this.world.defaultContactMaterial.restitution = 0;

			this.camera = new THREE.PerspectiveCamera(50, this.game.width / this.game.height, 1, 100);
			this.camera.rotation.set(-cuboro.DEG_RAD_90, 10, cuboro.DEG_RAD_90);

			this.scene = new THREE.Scene();
			this.scene.add(this.camera);

			const hemiLight: THREE.HemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.75);
			hemiLight.position.set(12, 500, 12);
			this.scene.add(hemiLight);

			this.spotLight = new THREE.SpotLight(0xffffff, 0.5, 200);
			const camera: THREE.PerspectiveCamera = <THREE.PerspectiveCamera>this.spotLight.shadow.camera;
			camera.near = this.camera.near;
			camera.far = this.camera.far;
			camera.fov = this.camera.fov;
			this.spotLight.target.position.set(12, 0, 12);
			this.scene.add(this.spotLight);

			const controlsSettings = new cuboro.core.ControlsSettings();
			controlsSettings.interaction = this.gameScreen.interaction;
			controlsSettings.camera = this.camera;
			controlsSettings.lookAt = new THREE.Vector3(0, 0, 0);

			this.controls = new cuboro.core.Controls(this, controlsSettings);
			this.cubes = new cuboro.core.Cubes(this);
			this.history = new cuboro.core.History(this);
			this.evaluation = new cuboro.core.Evaluation(this);
			this.map = new cuboro.core.Map(this);
			this.select = new cuboro.core.Select(this);
			this.assets = new cuboro.core.Assets(this);

			this.cubeOpacity = 1;
			this.elementMargin = 0;
			this.layerMargin = 0;

			this.game.on(gf.RESIZE, this.onResize, this);
		}



		protected load(): void
		{
			const assetLoader = new cuboro.core.AssetLoader(this.game, this.assets);
			assetLoader.texture("cube-hit1", "img/texture-cube-hit1.png");
			assetLoader.texture("cube-hit2", "img/texture-cube-hit2.png");
			assetLoader.texture("cube-hit3", "img/texture-cube-hit3.png");
			assetLoader.texture("cube-hit4", "img/texture-cube-hit4.png");
			assetLoader.texture("cube-out", "img/texture-cube-out.png");
			assetLoader.texture("cube-over", "img/texture-cube-over.png");
			assetLoader.texture("cube-down", "img/texture-cube-down.png");
			assetLoader.texture("cube-highlight", "img/texture-cube-highlight.png");
			assetLoader.texture("cube-selected", "img/texture-cube-selected.png");
			assetLoader.texture("ground", "img/ground.png");
			assetLoader.texture("unplaceable", "img/unplaceable.png");
			assetLoader.texture("marble", "img/marble.jpg");

			const cubes = this.gameScreen.bottomMenu.cubeList.getItems();
			cubes.forEach((value: cuboro.ui.CubeListItem) => assetLoader.threeJSON(value.key, "models/" + value.key + ".json"));
			assetLoader.on(gf.LOAD_COMPLETE, this.loadComplete, this);
			assetLoader.start();
		}



		protected loadComplete(): void
		{
			if (!this.ground)
				this.ground = new cuboro.core.Ground(this);

			if (!this.placeables)
				this.placeables = new cuboro.core.Placeables(this);

			if (!this.marble)
				this.marble = new cuboro.core.Marble(this);

			if (mTrack.data.cubes)
			{
				this.cubes.setCubes(mTrack.data.cubes);
				if (mTrack.data.evaluation)
					this.evaluation.current = mTrack.data.evaluation;
			}

			this.emit(cuboro.PLAYGROUND_READY);
		}



		public onResize(): void
		{
			this.camera.aspect = this.game.width / this.game.height;
			this.camera.updateProjectionMatrix();
			if (this.canvas) this.canvas.onResize();
		}



		public resetView(): void
		{
			if (this.elementMargin > 0)
				this.elementMargin = this.gameScreen.bottomMenu.elementMargin = 0;

			if (this.layerMargin > 0)
				this.layerMargin = this.gameScreen.bottomMenu.layerMargin = 0;
		}



		public save(): void
		{
			if (this._isSaving || !mUser.isLoggedIn()) return;

			this._isSaving = true;

			if (mTrack.id && !mTrack.imageUrl)
			{
				this.saveImage();
			}

			const data = new cuboro.vo.TrackData();
			data.cubes = this.cubes.getCubes();
			data.evaluation = this.evaluation.current;
			data.sets = mTrack.data.sets;

			const name = this.game.stage.header.trackMenu.trackName.value;

			if (!mTrack.owner)
			{
				this.saveDupe(data);
				return;
			}

			if (mTrack.owner.id != mUser.getUserId())
			{
				this.saveDupe(data);
				return;
			}

			this.saveId = window.setTimeout(() => this.saveTimeout(), 10000);
			sTrack.save(data, name, true, null, (savedTrack: cuboro.vo.Track, status: string) =>
			{
				clearTimeout(this.saveId);
				if (status == "ERROR_IS_NOT_TRACK_OWNER")
				{
					log(loc("error_track_name_taken"));
				}
				else if (status == "ERROR_TRACK_NAME_NOT_OVERWRITTEN")
				{
					log(loc("error_track_name_taken_own"));
				}
				else if (status == kr3m.SUCCESS)
				{
					this.game.stage.header.trackMenu.tfSaved.text = locDate("track_info_saved", savedTrack.lastSavedWhen);
					mTrack = savedTrack;
					if (!mTrack.imageUrl) this.saveImage();
				}

				this._isSaving = false;
			});
		}



		protected saveDupe(data: cuboro.vo.TrackData): void
		{
			mTrack.owner = mUser.getUser();
			sTrack.generateUniqueRandomName(loc("trackname_prefix"), (response: string) =>
			{
				mTrack.name = response;
				this.game.stage.header.trackMenu.trackName.value = mTrack.name;
				this.saveId = window.setTimeout(() => this.saveTimeout(), 10000);
				sTrack.save(data, mTrack.name, true, mTrack.id, (savedTrack: cuboro.vo.Track, status: string) =>
				{
					clearTimeout(this.saveId);
					if (status == "ERROR_IS_NOT_TRACK_OWNER")
					{
						log(loc("error_track_name_taken"));
					}
					else if (status == "ERROR_TRACK_NAME_NOT_OVERWRITTEN")
					{
						log(loc("error_track_name_taken_own"));
					}
					else if (status == kr3m.SUCCESS)
					{
						this.game.stage.header.trackMenu.tfSaved.text = locDate("track_info_saved", savedTrack.lastSavedWhen);
						mTrack = savedTrack;
						if (!mTrack.imageUrl) this.saveImage();
					}

					this._isSaving = false;
				});
			});
		}



		protected saveImage(): void
		{
			cuboro.ui.TrackPreview.GetBase64(this, 300, (value) =>
			{
				sTrack.saveTrackImage(mTrack.id, mTrack.name, value, (imageUrl) =>
				{
					mTrack.imageUrl = imageUrl;
					this._isSaving = false;
				});
			});
		}



		protected saveTimeout(): void
		{
			clearTimeout(this.saveId);

			if (navigator.onLine)
				this.game.stage.header.trackMenu.tfSaved.text = loc("error_save");
			else
				this.game.stage.header.trackMenu.tfSaved.text = loc("error_save_offline");

			this._isSaving = false;
		}



		public start(): void
		{
			if (this._isRunning) return;

			this._isRunning = true;
			if (!this.canvas)
				this.canvas = cuboro.core.Canvas.getInstance(this.game, (elapsed: number) => this.update(elapsed));
			this.canvas.start();

			this.history.reset();
			this.history.save();

			this.load();
		}



		public stop(): void
		{
			if (!this._isRunning)
				return;

			this._isRunning = false;
			this.canvas.stop();
			this.reset();
		}



		public reset(): void
		{
			this.cubes.removeCubes();
			this.history.reset();
			this.gameScreen.moveMenu.hide();
			this.gameScreen.rotateMenu.hide();
		}



		public update(elapsed: number): void
		{
			if (this._physicsEnabled)
			{
				elapsed *= this.physicSpeedFactor * 0.001;

				this.accumulator += elapsed;
				while (this.accumulator >= cuboro.TIMESTEP)
				{
					this.world.step(cuboro.TIMESTEP);
					this.marble.update();
					this.accumulator -= cuboro.TIMESTEP;
				}
				this.elapsedMS += elapsed;
			}
			else
			{
				this.accumulator = 0;
			}

			this.canvas.renderer.render(this.scene, this.camera);
		}



		public get physicsEnabled(): boolean
		{
			return this._physicsEnabled;
		}



		public set physicsEnabled(value: boolean)
		{
			if (value)
				this.elapsedMS = 0;
			this._physicsEnabled = value;
		}
	}
}
