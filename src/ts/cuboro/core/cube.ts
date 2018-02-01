/// <reference path="../../kr3m/lib/cannon.ts"/>
/// <reference path="../../kr3m/lib/three.ts"/>



module cuboro.core
{
	export class Cube
	{
		public body: CANNON.Body;
		public id: string;
		public key: string;
		public layer: THREE.Mesh;
		public mapPosition: THREE.Vector3;
		public mesh: THREE.Mesh;
		public playground: cuboro.core.Playground;

		private _hits: number;
		private _isDown: boolean;
		private _isSelected: boolean;
		private _isOver: boolean;
		private _lastRotationX: number;
		private _lastRotationY: number;
		private _lastRotationZ: number;
		private _materialHit1: THREE.MeshLambertMaterial;
		private _materialHit2: THREE.MeshLambertMaterial;
		private _materialHit3: THREE.MeshLambertMaterial;
		private _materialHit4: THREE.MeshLambertMaterial;
		private _materialOut: THREE.MeshLambertMaterial;
		private _materialOver: THREE.MeshLambertMaterial;
		private _materialDown: THREE.MeshLambertMaterial;
		private _materialSelected: THREE.MeshLambertMaterial;
		private _materialHighlight: THREE.MeshLambertMaterial;
		private _opacity: number;
		private _rotationX: number;
		private _rotationY: number;
		private _rotationZ: number;
		private _selected: boolean;



		constructor(playground: cuboro.core.Playground, key: string)
		{
			this.playground = playground;
			this.key = key;
			this.mapPosition = new THREE.Vector3();
			this._hits = 0;
			this._opacity = 1;

			this.mesh = this.playground.assets.getMesh(this.key);
			this.mesh.material = this.playground.assets.getMaterial("cube-out");
			this.mesh.name = this.key;
			this.mesh.userData.body = this.body;
			this.mesh.userData.cube = this;

			this.body = this.playground.assets.getBody(this.mesh);

			this.playground.scene.add(this.mesh);
			this.playground.world.addBody(this.body);

			this.addLayerInfo();

			this._lastRotationX = 0;
			this._lastRotationZ = 0;
			this._lastRotationY = 0;
			this._rotationX = 0;
			this._rotationY = 0;
			this._rotationZ = 0;
			this._selected = false;

			this._materialHit1 = this.playground.assets.getMaterial("cube-hit1");
			this._materialHit2 = this.playground.assets.getMaterial("cube-hit2");
			this._materialHit3 = this.playground.assets.getMaterial("cube-hit3");
			this._materialHit4 = this.playground.assets.getMaterial("cube-hit4");
			this._materialOut = this.playground.assets.getMaterial("cube-out");
			this._materialOver = this.playground.assets.getMaterial("cube-over");
			this._materialDown = this.playground.assets.getMaterial("cube-down");
			this._materialSelected = this.playground.assets.getMaterial("cube-selected");
			this._materialHighlight = this.playground.assets.getMaterial("cube-highlight");

			this.id = PIXI.utils.uid().toString();
		}



		protected addLayerInfo(): void
		{
			const width = 256;
			const maxWidth = 256 >> 1;
			const height = 256;

			const c = new PIXI.Container();
			const s = new PIXI.Sprite(PIXI.Texture.EMPTY);
			s.width = width;
			s.height = height;
			c.addChild(s);

			const l = this.key.indexOf("mk") != -1 ? loc("cube_mk_layer") : this.key.indexOf("d") != -1 ? loc(this.key) : this.key.substr(5);
			const t = new gf.display.Text(this.playground.game, l, cuboro.TEXT_STYLE_LAYER.clone());
			if (t.width > s.width - maxWidth)
			{
				t.width = s.width - maxWidth;
				t.scaleY = t.scaleX;
			}
			t.x = (width - t.width) >> 1;
			t.y = (height - t.height) >> 1;
			c.addChild(t);

			const r: PIXI.CanvasRenderer = new PIXI.CanvasRenderer(width, height, {
				transparent: true,
				resolution: 1
			});
			r.render(c);

			const image: HTMLImageElement = new Image();
			image.src = r.view.toDataURL();
			image.width = width;
			image.height = height;

			c.destroy({children: true, texture: true, baseTexture: true});
			r.destroy(true);

			const texture: THREE.Texture = new THREE.Texture(image);
			texture.needsUpdate = true;

			const geometry = new THREE.BoxGeometry(2.01, 2.01, 2.01);
			const material = new THREE.MeshBasicMaterial({map: texture, transparent: true});
			this.layer = new THREE.Mesh(geometry, material);
			this.layer.visible = false;
			this.playground.scene.add(this.layer);
		}



		protected setState(state?: string): void
		{
			if (!state)
			{
				switch (this._hits)
				{
					case 0:
						this.mesh.material = this._materialOut;
						break;
					case 1:
						this.mesh.material = this._materialHit1;
						break;
					case 2:
						this.mesh.material = this._materialHit2;
						break;
					case 3:
						this.mesh.material = this._materialHit3;
						break;
					case 4:
						this.mesh.material = this._materialHit4;
						break;
				}
			}
			else
			{
				switch (state)
				{
					case gf.OUT:
						this.mesh.material = this._materialOut;
						break;

					case gf.OVER:
						this.mesh.material = this._materialOver;
						break;

					case gf.DOWN:
						this.mesh.material = this._materialDown;
						break;

					case gf.SELECTED:
						this.mesh.material = this._materialSelected;
						break;

					case gf.HIGHLIGHT:
						this.mesh.material = this._materialHighlight;
						break;
				}
			}
		}



		public remove(): void
		{
			this._materialHit1.dispose();
			this._materialHit2.dispose();
			this._materialHit3.dispose();
			this._materialHit4.dispose();
			this._materialOut.dispose();
			this._materialOver.dispose();
			this._materialDown.dispose();
			this._materialSelected.dispose();
			this._materialHighlight.dispose();

			this.playground.scene.remove(this.mesh);
			this.playground.gameScreen.bottomMenu.cubeList.getItemByKey(this.key).remaining++;

			this.playground.world.remove(this.body);
			this.playground.scene.remove(this.mesh);
			this.playground.scene.remove(this.layer);
		}



		public drop(): void
		{
			TweenMax.to(this, 0.5,
				{
					y: this.playground.map.yTo3DPos(this.mapPosition.y),
					ease: Bounce.easeOut,
					onUpdate: () =>
					{
						if (this.playground.gameScreen.moveMenu.visible)
						{
							this.playground.emit(cuboro.CUBE_UPDATE);
						}
					}
				});
		}



		/*
			Set the rotation of the mesh in degrees
				@param x Rotation x in degrees
			@param y Rotation y in degrees
			@param z Rotation z in degrees
		*/
		public setRotation(x: number, y: number, z: number): void
		{
			x = gf.utils.Maths.degToRad(x);
			y = gf.utils.Maths.degToRad(y);
			z = gf.utils.Maths.degToRad(z);
			TweenMax.to(this.mesh.rotation, 0.1, {x: x, y: y, z: z});
		}



		public get rotationX(): number
		{
			return this._rotationX;
		}



		public set rotationX(value: number)
		{
			this._rotationX = value;

			const val: number = this._rotationX - this._lastRotationX;

			const rotationMatrix: THREE.Matrix4 = new THREE.Matrix4();
			rotationMatrix.makeRotationAxis(new THREE.Vector3(1, 0, 0).normalize(), val);
			rotationMatrix.multiply(this.mesh.matrix);
			this.mesh.matrix = rotationMatrix;
			this.mesh.rotation.setFromRotationMatrix(this.mesh.matrix);

			this._lastRotationX = this._rotationX;
		}



		public resetRotationX(): void
		{
			this._rotationX = 0;
			this._lastRotationX = 0;
		}



		public get rotationY(): number
		{
			return this._rotationY;
		}



		public set rotationY(value: number)
		{
			this._rotationY = value;

			const val: number = this._rotationY - this._lastRotationY;

			const rotationMatrix: THREE.Matrix4 = new THREE.Matrix4();
			rotationMatrix.makeRotationAxis(new THREE.Vector3(0, 1, 0).normalize(), val);
			rotationMatrix.multiply(this.mesh.matrix);
			this.mesh.matrix = rotationMatrix;
			this.mesh.rotation.setFromRotationMatrix(this.mesh.matrix);

			this._lastRotationY = this._rotationY;
		}



		public resetRotationY(): void
		{
			this._rotationY = 0;
			this._lastRotationY = 0;
		}



		public get rotationZ(): number
		{
			return this._rotationZ;
		}



		public set rotationZ(value: number)
		{
			this._rotationZ = value;

			const val: number = this._rotationZ - this._lastRotationZ;

			const rotationMatrix: THREE.Matrix4 = new THREE.Matrix4();
			rotationMatrix.makeRotationAxis(new THREE.Vector3(0, 0, 1).normalize(), val);
			rotationMatrix.multiply(this.mesh.matrix);
			this.mesh.matrix = rotationMatrix;
			this.mesh.rotation.setFromRotationMatrix(this.mesh.matrix);

			this._lastRotationZ = this._rotationZ;
		}



		public resetRotationZ(): void
		{
			this._rotationZ = 0;
			this._lastRotationZ = 0;
		}



		public highlight(highlight: boolean): void
		{
			this.setState(highlight ? gf.HIGHLIGHT : gf.OUT);
		}



		public fromString(value: string): void
		{
			const data = JSON.parse(value);

			this.mapPosition.set(data.map.x, data.map.y, data.map.z);
			this.mesh.rotation.set(data.rot._x, data.rot._y, data.rot._z);
		}



		public toString(): string
		{
			let data: any = {};

			data.map = this.mapPosition;
			data.key = this.key;
			data.rot = this.mesh.rotation;

			return JSON.stringify(data);
		}



		public get isSelected(): boolean
		{
			return this._isSelected;
		}



		public set isSelected(value: boolean)
		{
			this._isSelected = value;
			this.setState(this.isSelected ? gf.SELECTED : this.isOver ? gf.OVER : gf.OUT);
		}



		public get isOver(): boolean
		{
			return this._isOver;
		}



		public set isOver(value: boolean)
		{
			this._isOver = value;
			if (!this.isSelected)
				this.setState(this.isOver ? gf.OVER : gf.OUT);
		}



		public get isDown(): boolean
		{
			return this._isDown;
		}



		public set isDown(value: boolean)
		{
			this._isDown = value;
			if (!this.isSelected)
				this.setState(this._isDown ? gf.DOWN : this.isOver ? gf.OVER : gf.OUT);
		}



		public get scale(): number
		{
			return this.mesh.scale.x;
		}



		public set scale(value: number)
		{
			this.mesh.scale.x = value;
			this.mesh.scale.y = value;
			this.mesh.scale.z = value;
		}



		public get x(): number
		{
			return this.body.position.x;
		}



		public set x(value: number)
		{
			this.mesh.position.x = value;
			this.body.position.x = value;
			this.layer.position.x = value;
		}



		public get y(): number
		{
			return this.body.position.y;
		}



		public set y(value: number)
		{
			this.mesh.position.y = value;
			this.body.position.y = value;
			this.layer.position.y = value;
		}



		public get z(): number
		{
			return this.body.position.z;
		}



		public set z(value: number)
		{
			this.mesh.position.z = value;
			this.body.position.z = value;
			this.layer.position.z = value;
		}



		public get hits(): number
		{
			return this._hits;
		}



		public set hits(value: number)
		{
			this._hits = Math.min(4, value);
			this.setState();
		}



		public get opacity(): number
		{
			return this._opacity;
		}



		public set opacity(value: number)
		{
			this._opacity = value;

			this._materialHit1.opacity = this._opacity;
			this._materialHit2.opacity = this._opacity;
			this._materialHit3.opacity = this._opacity;
			this._materialHit4.opacity = this._opacity;
			this._materialOut.opacity = this._opacity;
			this._materialOver.opacity = this._opacity;
			this._materialDown.opacity = this._opacity;
			this._materialSelected.opacity = this._opacity;
			this._materialHighlight.opacity = this._opacity;

			this.mesh.material.opacity = this._opacity;
		}
	}
}
