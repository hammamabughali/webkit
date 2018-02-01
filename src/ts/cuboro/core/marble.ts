/// <reference path="../../cuboro/core/cube.ts"/>
/// <reference path="../../cuboro/core/playground.ts"/>
/// <reference path="../../gf/utils/timer.ts"/>
/// <reference path="../../kr3m/lib/cannon.ts"/>
/// <reference path="../../kr3m/lib/pixi.ts"/>
/// <reference path="../../kr3m/lib/three.ts"/>



module cuboro.core
{
	export interface Collision
	{
		bodyId: number;
		cube: cuboro.core.Cube;
	}



	export class Marble extends PIXI.utils.EventEmitter
	{
		private _collisions: cuboro.core.Collision[];

		protected bodies: { [bodyId: number]: cuboro.core.Cube };
		protected inContainer: boolean;
		protected isRunning: boolean;
		protected isStuck: boolean;
		protected lastHitTime: number;
		protected onGround: boolean;
		protected preHit: number;
		protected prePreHit: number;
		protected lowestY: number;
		protected skipHeight: number;
		protected zeroTimer: gf.utils.Timer;

		public body: CANNON.Body;
		public mesh: THREE.Mesh;
		public playground: cuboro.core.Playground;



		constructor(playground: cuboro.core.Playground)
		{
			super();

			this.playground = playground;

			this.body = new CANNON.Body({mass: 2.5});
			this.body.angularDamping = -0.00001;
			this.body.angularFactor.set(0.9, 0.9, 0.9);
			this.body.linearDamping = 0.01;
			this.body.linearFactor.set(0.85, 0.85, 0.85);
			this.body.addShape(new CANNON.Sphere(0.31));
			this.body.addEventListener("collide", (e: any) => this.onCollision(e.body));

			const materialParameters: THREE.MeshPhongMaterialParameters = {};
			materialParameters.color = 0xffffff;
			materialParameters.map = this.playground.assets.getTexture("marble");
			materialParameters.opacity = 0.90;
			materialParameters.flatShading = true;
			materialParameters.transparent = true;
			materialParameters.reflectivity = 1;
			materialParameters.refractionRatio = 0.75;

			this.mesh = new THREE.Mesh(new THREE.SphereGeometry(0.31, 20, 20));
			this.mesh.material = new THREE.MeshPhongMaterial(materialParameters);
			this.mesh.name = "marble";
			this.mesh.visible = false;

			this.playground.scene.add(this.mesh);
			this.playground.world.addBody(this.body);

			this.zeroTimer = new gf.utils.Timer(this.playground.game);
			this.zeroTimer.on(gf.TIMER_COMPLETE, () => this.isStuck = true, this);
		}



		public isOnGround(): boolean
		{
			return this.onGround;
		}



		public isInContainer(): boolean
		{
			return this.inContainer;
		}



		public hasSkipped(): boolean
		{
			return this.skipHeight >= cuboro.MARBLE_SKIP_THRESHOLD;
		}



		protected onCollision(body: CANNON.Body): void
		{
			if (body.id === this.playground.ground.body.id)
				this.onGround = true;

			if (body.id != this.preHit && !this.onGround)
			{
				if (!this.lastHitTime || Date.now() - this.lastHitTime > 100)
				{
					this.lastHitTime = Date.now();
					this.prePreHit = this.preHit;
					this.preHit = body.id;

					const cube: cuboro.core.Cube = this.bodies[body.id];

					if (cube)
					{
						if (cube.mesh.name === "cube_mk")
							this.inContainer = true;

						this._collisions.push({bodyId: body.id, cube: cube});
						cube.hits++;
					}
				}
			}
		}



		protected reset(): void
		{
			this.inContainer = false;
			this.isStuck = false;
			this.onGround = false;

			this.preHit = null;
			this.prePreHit = null;
			this.lastHitTime = null;

			this.bodies = {};

			this.resetBody();

			this.playground.cubes.cubes.forEach((value: cuboro.core.Cube) =>
			{
				const body = value.body;

				body.position.copy(<any>value.mesh.position);
				body.quaternion.copy(<any>value.mesh.quaternion);

				body.velocity.setZero();
				body.initVelocity.setZero();
				body.angularVelocity.setZero();
				body.initAngularVelocity.setZero();
				body.previousPosition.setZero();

				body.force.setZero();
				body.torque.setZero();

				body.sleepState = 0;
				body.timeLastSleepy = 0;

				value.hits = 0;

				this.bodies[body.id] = value;
			});
		}



		protected resetBody(): void
		{
			this.body.velocity.setZero();
			this.body.initVelocity.setZero();
			this.body.angularVelocity.setZero();
			this.body.initAngularVelocity.setZero();
			this.body.previousPosition.setZero();
			this.body.force.setZero();
			this.body.torque.setZero();
			this.body.sleepState = 0;
			this.body.timeLastSleepy = 0;
		}



		protected evaluate(success: boolean, aborted: boolean): void
		{
			if (success)
			{
				this.playground.game.overlays.hide(cuboro.overlays.Loader.NAME);
				this.playground.evaluation.calculate();
				this.playground.game.overlays.show(cuboro.overlays.TrackDetailsIngame.NAME);
			}
			else if (!aborted)
			{
				const message: cuboro.overlays.Message = this.playground.game.overlays.show(cuboro.overlays.Message.NAME);
				message.text = loc("marble_run_failed");
			}

			this.reset();
			this.playground.physicsEnabled = false;

			this.playground.game.stage.header.show();
			this.playground.gameScreen.bottomMenu.visible = true;
			this.playground.gameScreen.layers.visible = true;
			this.playground.gameScreen.marbleRun.visible = false;
		}



		public update(): void
		{
			const skip = this.body.position.y - this.lowestY;
			this.skipHeight = Math.max(this.skipHeight, skip);
			this.lowestY = Math.min(this.lowestY, this.body.position.y);

			if (this.onGround || this.inContainer || this.isStuck)
			{
				// Marble on ground or in container or stuck, slow it down
				const f = cuboro.MARBLE_DEATH_SLOW_FACTOR;
				this.body.velocity = this.body.velocity.mult(f);
				this.body.angularVelocity = this.body.angularVelocity.mult(f);

				if (this.body.velocity.almostZero(0.1))
					this.stop(false);
			}
			else
			{
				if (this.body.velocity.almostZero(0.5))
				{
					if (!this.zeroTimer.isRunning)
						this.zeroTimer.start(3 / this.playground.physicSpeedFactor);
				}
				else
				{
					this.zeroTimer.stop();
				}
			}

			this.mesh.position.set(this.body.position.x, this.body.position.y, this.body.position.z);
			this.mesh.quaternion.copy(<any>this.body.quaternion);
		}



		public start(): void
		{
			if (this.isRunning) return;

			this.isRunning = true;
			this.bodies = {};

			this.playground.game.stage.header.hide();
			this.playground.gameScreen.bottomMenu.visible = false;
			this.playground.gameScreen.layers.visible = false;
			this.playground.gameScreen.marbleRun.visible = true;

			this.reset();

			this.lowestY = this.body.position.y;
			this.skipHeight = 0;

			this._collisions = [];

			this.playground.physicsEnabled = true;
		}



		public stop(aborted: boolean): void
		{
			if (!this.isRunning) return;

			this.isRunning = false;
			this.mesh.visible = false;

			const success = this.onGround || this.inContainer;

			if (!aborted && success)
			{
				this.playground.game.overlays.show(cuboro.overlays.Loader.NAME);
				cuboro.ui.TrackPreview.GetBase64(this.playground, 300, (value: string) =>
				{
					if (mUser.isLoggedIn() && mTrack.owner.id == mUser.getUserId())
					{
						sTrack.saveTrackImage(mTrack.id, mTrack.name, value, (imageUrl: string) =>
						{
							mTrack.imageUrl = imageUrl;
							this.evaluate(true, aborted);
							this.playground.save();
						});
					}
					else
					{
						this.evaluate(true, aborted);
					}
				});
			}
			else
			{
				this.evaluate(false, aborted);
			}

			this.zeroTimer.stop();

			this.emit("stop");
		}



		public get collisions(): cuboro.core.Collision[]
		{
			return this._collisions;
		}



		public get x(): number
		{
			return this.body.position.x;
		}



		public set x(value: number)
		{
			this.mesh.position.x = value;
			this.body.position.x = value;
		}



		public get y(): number
		{
			return this.body.position.y;
		}



		public set y(value: number)
		{
			this.mesh.position.y = value;
			this.body.position.y = value;
		}



		public get z(): number
		{
			return this.body.position.z;
		}



		public set z(value: number)
		{
			this.mesh.position.z = value;
			this.body.position.z = value;
		}
	}
}
