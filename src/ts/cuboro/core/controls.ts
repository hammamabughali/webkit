module cuboro.core
{
	export const STATE_NONE: number = -1;
	export const STATE_ROTATE: number = 0;
	export const STATE_ZOOM: number = 1;
	export const STATE_PAN: number = 2;



	export class Controls
	{
		public canPan: boolean;
		public canRotate: boolean;
		public canZoom: boolean;
		public enabled: boolean;
		public lookAt: THREE.Vector3;
		public playground: cuboro.core.Playground;
		public settings: cuboro.core.ControlsSettings;

		private _pos: THREE.Vector3 = new THREE.Vector3();
		private _currentPanAngle: number;
		private _currentTiltAngle: number;
		private _panAngle: number;
		private _tiltAngle: number;
		private _distance: number;
		private _minPan: THREE.Vector3;
		private _maxPan: THREE.Vector3;
		private _mouse: THREE.Vector2;
		private _lastMouse: THREE.Vector2;
		private _lastPanAngle: number;
		private _lastTiltAngle: number;
		private _pan: THREE.Vector3;
		private _panStart: THREE.Vector2;
		private _panEnd: THREE.Vector2;
		private _panDelta: THREE.Vector2;
		private _state: number;
		private _zoomStart: THREE.Vector2;
		private _zoomEnd: THREE.Vector2;
		private _zoomDelta: THREE.Vector2;



		constructor(playground: cuboro.core.Playground, settings: cuboro.core.ControlsSettings)
		{
			this.playground = playground;
			this.settings = settings;

			this._mouse = new THREE.Vector2(0, 0);
			this._lastMouse = new THREE.Vector2(0, 0);
			this._state = STATE_NONE;

			this._panStart = new THREE.Vector2();
			this._panEnd = new THREE.Vector2();
			this._panDelta = new THREE.Vector2();
			this._minPan = new THREE.Vector3(-10, -10, -10);
			this._maxPan = new THREE.Vector3(10, 10, 10);
			this._pan = new THREE.Vector3();

			this.canPan = true;
			this.canRotate = true;
			this.canZoom = true;

			this._distance = this.settings.distance;
			this._panAngle = this.settings.panAngle;
			this._tiltAngle = this.settings.tiltAngle;
			this.lookAt = this.settings.lookAt.clone();

			this._zoomStart = new THREE.Vector2();
			this._zoomEnd = new THREE.Vector2();
			this._zoomDelta = new THREE.Vector2();

			this._currentPanAngle = this._panAngle;
			this._currentTiltAngle = this._tiltAngle;
			this._lastPanAngle = this._currentPanAngle;
			this._lastTiltAngle = this._currentTiltAngle;

			this.settings.interaction.on("onMouseDown", this.onMouseDown, this);
			this.settings.interaction.on("onMouseMove", this.onMouseMove, this);
			this.settings.interaction.on("onMouseUp", this.onMouseUp, this);
			this.settings.interaction.on("onMouseWheel", this.onMouseWheel, this);

			this.settings.interaction.on("onTouchStart", this.onTouchStart, this);
			this.settings.interaction.on("onTouchMove", this.onTouchMove, this);
			this.settings.interaction.on("onTouchEnd", this.onTouchEnd, this);

			this.enabled = true;

			this.reset();
		}



		private update(interpolate: boolean = false): void
		{
			if (this._tiltAngle != this._currentTiltAngle || this._panAngle != this._currentPanAngle)
			{
				if (interpolate)
				{
					this._currentTiltAngle += (this._tiltAngle - this._currentTiltAngle) / (this.settings.steps + 1);
					this._currentPanAngle += (this._panAngle - this._currentPanAngle) / (this.settings.steps + 1);
				}
				else
				{
					this._currentPanAngle = this._panAngle;
					this._currentTiltAngle = this._tiltAngle;
				}

				if ((Math.abs(this.tiltAngle - this._currentTiltAngle) < 0.01) && (Math.abs(this._panAngle - this._currentPanAngle) < 0.01))
				{
					this._currentTiltAngle = this._tiltAngle;
					this._currentPanAngle = this._panAngle;
				}
			}

			this._pos.x = this.lookAt.x;
			this._pos.y = this.lookAt.y;
			this._pos.z = this.lookAt.z;

			this.settings.camera.position.x = this._pos.x - this._distance * Math.sin(this._currentPanAngle * PIXI.DEG_TO_RAD) * Math.cos(this._currentTiltAngle * PIXI.DEG_TO_RAD);
			this.settings.camera.position.z = this._pos.z + this._distance * Math.cos(this._currentPanAngle * PIXI.DEG_TO_RAD) * Math.cos(this._currentTiltAngle * PIXI.DEG_TO_RAD);
			this.settings.camera.position.y = this._pos.y + this._distance * Math.sin(this._currentTiltAngle * PIXI.DEG_TO_RAD) * this.settings.yFactor;

			this.settings.camera.lookAt(this.lookAt);

			this.playground.spotLight.position.x = this.settings.camera.position.x - 2;
			this.playground.spotLight.position.y = this.settings.camera.position.y - 2;
			this.playground.spotLight.position.z = this.settings.camera.position.z - 2;
			this.playground.spotLight.target.position.copy(this.lookAt);

			setTimeout(() => this.playground.emit(cuboro.CAMERA_UPDATE), 10);
		}



		private hideMenus():void
		{
			this.playground.gameScreen.moveMenu.alpha = 0.25;
			this.playground.gameScreen.rotateMenu.alpha = 0.25;
		}



		private showMenus():void
		{
			this.playground.gameScreen.moveMenu.alpha = 1;
			this.playground.gameScreen.rotateMenu.alpha = 1;
		}



		private onMouseWheel(e: any): void
		{
			if (!this.canZoom) return;

			let delta: number = 0;

			if (e.wheelDelta !== undefined)
			{
				// WebKit / Opera / Explorer 9
				delta = e.wheelDelta;
			}
			else if (e.detail !== undefined)
			{
				// Firefox
				delta = -e.detail;
			}

			if (delta > 0)
			{
				this.distance *= 0.95;
			}
			else if (delta < 0)
			{
				this.distance /= 0.95;
			}

			this.update();
		}



		private onMouseMove(e: MouseEvent): void
		{
			if (!this.enabled) return;

			this._mouse.set(e.clientX, e.clientY);

			if (this._state == cuboro.core.STATE_ROTATE)
			{
				if (!this.canRotate) return;
				this.panAngle = 0.3 * (this._mouse.x - this._lastMouse.x) + this._lastPanAngle;
				this.tiltAngle = 0.3 * (this._mouse.y - this._lastMouse.y) + this._lastTiltAngle;
				this.update();
			}
			else if (this._state == cuboro.core.STATE_PAN)
			{
				if (!this.canPan) return;
				this._panEnd.set(this._mouse.x, this._mouse.y);
				this._panDelta.subVectors(this._panEnd, this._panStart);

				const l: number = this.settings.camera.position.clone().sub(this.lookAt).length();
				const targetDistance: number = l * Math.tan((this.settings.camera.fov * 0.5) * PIXI.DEG_TO_RAD);

				this.panLeft(2 * this._panDelta.x * targetDistance / this.playground.game.height);
				this.panUp(2 * this._panDelta.y * targetDistance / this.playground.game.height);

				this._panStart.copy(this._panEnd);

				this.lookAt.add(this._pan);
				this.lookAt.clamp(this._minPan, this._maxPan);

				this._pan.set(0, 0, 0);
				this.update();
			}
		}



		private onMouseDown(e: MouseEvent): void
		{
			if (!this.enabled) return;

			this.hideMenus();

			this._lastPanAngle = this.panAngle;
			this._lastTiltAngle = this.tiltAngle;
			this._lastMouse.set(e.clientX, e.clientY);

			switch (e.button)
			{
				case 0:
					if (!this.canRotate) return;
					if (this.playground.gameScreen.bottomMenu.btMoveView.isSelected && this.canPan)
					{
						this._state = cuboro.core.STATE_PAN;
						this._panStart.set(e.clientX, e.clientY);
					}
					else
					{
						this._state = cuboro.core.STATE_ROTATE;
					}
					break;

				case 2:
					if (!this.canPan) return;
					this._state = cuboro.core.STATE_PAN;
					this._panStart.set(e.clientX, e.clientY);
					break;
			}
		}



		private onMouseUp(): void
		{
			this.showMenus();
			this._state = cuboro.core.STATE_NONE;
			this.playground.emit(cuboro.CAMERA_UPDATED);
		}



		private onTouchStart(e: any): void
		{
			if (!this.enabled) return;

			this.hideMenus();

			const touchCount: number = (e.touches) ? e.touches.length : 1;
			const x: number = (e.touches) ? e.touches[0].pageX : e.clientX;
			const y: number = (e.touches) ? e.touches[0].pageY : e.clientY;

			switch (touchCount)
			{
				case 1:	// one-fingered touch: rotate
					if (this.playground.gameScreen.bottomMenu.btMoveView.isSelected && this.canPan)
					{
						this._state = cuboro.core.STATE_PAN;
						this._panStart.set(x, y);
					}
					else if (this.canRotate)
					{
						this._state = cuboro.core.STATE_ROTATE;
						this._lastPanAngle = this.panAngle;
						this._lastTiltAngle = this.tiltAngle;
						this._lastMouse.set(x, y);
					}
					break;

				case 2:	// two-fingered touch: zoom
					if (!this.canZoom) return;
					this._state = cuboro.core.STATE_ZOOM;

					const dx = x - e.touches[1].pageX;
					const dy = y - e.touches[1].pageY;
					const distance = Math.sqrt(dx * dx + dy * dy);

					this._zoomStart.set(0, distance);
					break;

				case 3: // three-fingered touch: pan
					if (!this.canPan) return;
					this._state = cuboro.core.STATE_PAN;

					this._panStart.set(x, y);
					break;

				default:
					this._state = cuboro.core.STATE_NONE;
			}
		}



		private onTouchMove(e: any): void
		{
			if (this.enabled === false) return;

			const x: number = (e.touches) ? e.touches[0].pageX : e.clientX;
			const y: number = (e.touches) ? e.touches[0].pageY : e.clientY;

			switch (this._state)
			{
				case cuboro.core.STATE_ROTATE:
					if (!this.canRotate) return;

					this._mouse.set(x, y);

					this.panAngle = 0.3 * (this._mouse.x - this._lastMouse.x) + this._lastPanAngle;
					this.tiltAngle = 0.3 * (this._mouse.y - this._lastMouse.y) + this._lastTiltAngle;

					this.update();
					break;

				case cuboro.core.STATE_ZOOM:
					if (!this.canZoom) return;

					const dx = x - e.touches[1].pageX;
					const dy = y - e.touches[1].pageY;
					const distance = Math.sqrt(dx * dx + dy * dy);

					this._zoomEnd.set(0, distance);
					this._zoomDelta.subVectors(this._zoomEnd, this._zoomStart);

					if (this._zoomDelta.y > 0)
					{
						this.distance *= 0.98;
					}
					else if (this._zoomDelta.y < 0)
					{
						this.distance /= 0.98;
					}

					this._zoomStart.copy(this._zoomEnd);

					this.update();
					break;

				case cuboro.core.STATE_PAN:
					if (!this.canPan) return;

					this._panEnd.set(x, y);
					this._panDelta.subVectors(this._panEnd, this._panStart);

					const l: number = this.settings.camera.position.clone().sub(this.lookAt).length();
					const targetDistance: number = l * Math.tan((this.settings.camera.fov * 0.5) * PIXI.DEG_TO_RAD);

					this.panLeft(2 * this._panDelta.x * targetDistance / this.playground.game.height);
					this.panUp(2 * this._panDelta.y * targetDistance / this.playground.game.height);

					this._panStart.copy(this._panEnd);

					this.lookAt.add(this._pan);
					this.lookAt.clamp(this._minPan, this._maxPan);

					this._pan.set(0, 0, 0);
					break;

				default:
					this._state = cuboro.core.STATE_NONE;
			}
		}



		private onTouchEnd(): void
		{
			this.showMenus();
			this._state = cuboro.core.STATE_NONE;
			this.playground.emit(cuboro.CAMERA_UPDATED);
		}



		public reset(): void
		{
			this.distance = this.settings.distance; // 20
			this.panAngle = this.settings.panAngle; // -133.5
			this.tiltAngle = this.settings.tiltAngle; // 30
			this.lookAt = this.settings.lookAt.clone(); // new THREE.Vector3(0, 0, 0);

			this.update();
		}



		public panLeft(distance: number): void
		{
			const panOffset: THREE.Vector3 = new THREE.Vector3();
			const te = this.settings.camera.matrix.elements;

			panOffset.set(te[0], te[1], te[2]);
			panOffset.multiplyScalar(-distance);

			this._pan.add(panOffset);

			this.lookAt.add(this._pan);
			this.lookAt.clamp(this._minPan, this._maxPan);

			this._pan.set(0, 0, 0);

			this.update();
		}



		public panUp(distance: number): void
		{
			const panOffset: THREE.Vector3 = new THREE.Vector3();
			const te = this.settings.camera.matrix.elements;

			panOffset.set(te[4], te[5], te[6]);
			panOffset.multiplyScalar(distance);

			this._pan.add(panOffset);

			this.lookAt.add(this._pan);
			this.lookAt.clamp(this._minPan, this._maxPan);

			this._pan.set(0, 0, 0);

			this.update();
		}



		public get isDirectionX(): boolean
		{
			const direction: THREE.Vector3 = new THREE.Vector3(0, -1, 0);
			direction.applyQuaternion(this.settings.camera.quaternion);
			return (Math.abs(direction.x) > Math.abs(direction.z));
		}



		public get direction(): number
		{
			const direction: THREE.Vector3 = new THREE.Vector3(0, -1, 0);
			direction.applyQuaternion(this.settings.camera.quaternion);

			if (this.isDirectionX)
			{
				return (direction.x * -1) > 0 ? 1 : -1;
			}
			else
			{
				return direction.z > 0 ? 1 : -1
			}
		}



		public get distance(): number
		{
			return this._distance;
		}



		public set distance(value: number)
		{
			if (this._distance == value)
			{
				return;
			}

			this._distance = Math.max(this.settings.minDistance, Math.min(this.settings.maxDistance, value));
			this.update();
		}



		/*
			Rotation of the camera in degrees around the y axis. Defaults to 0.
		*/
		public get panAngle(): number
		{
			return this._panAngle;
		}



		public set panAngle(value: number)
		{
			value = Math.max(this.settings.minPanAngle, Math.min(this.settings.maxPanAngle, value));

			if (this._panAngle == value)
			{
				return;
			}

			this._panAngle = value;
			this.update();
		}



		/*
			Elevation angle of the camera in degrees. Defaults to 90.
		*/
		public get tiltAngle(): number
		{
			return this._tiltAngle;
		}



		public set tiltAngle(value: number)
		{
			value = Math.max(this.settings.minTiltAngle, Math.min(this.settings.maxTiltAngle, value));

			if (this._tiltAngle == value)
			{
				return;
			}

			this._tiltAngle = value;
			this.update();
		}
	}
}
