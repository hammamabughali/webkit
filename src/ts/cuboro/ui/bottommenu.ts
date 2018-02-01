/// <reference path="cubelist.ts"/>
/// <reference path="dropheightbutton.ts"/>
/// <reference path="iconbutton.ts"/>
/// <reference path="marblebutton.ts"/>
/// <reference path="movetrackbutton.ts"/>
/// <reference path="packshotlist.ts"/>
/// <reference path="sliderbutton.ts"/>



module cuboro.ui
{
	export class BottomMenu extends gf.display.Container
	{
		private _elementMargin: number;
		private _layerMargin: number;

		protected dragStart: PIXI.Point;
		protected marbleSpawned: boolean;

		public bg: gf.display.Sprite;
		public btAddSets: cuboro.ui.IconButton;
		public btDelete: cuboro.ui.IconButton;
		public btDropHeight: cuboro.ui.DropHeightButton;
		public btElementsDistance: cuboro.ui.SliderButton;
		public btLayerDistance: cuboro.ui.SliderButton;
		public btMarble: cuboro.ui.MarbleButton;
		public btMoveCube: cuboro.ui.IconButton;
		public btMoveTrack: cuboro.ui.MoveTrackButton;
		public btMoveView: cuboro.ui.IconButton;
		public btOpacity: cuboro.ui.SliderButton;
		public btSwap: cuboro.ui.IconButton;
		public btUndo: cuboro.ui.IconButton;
		public btZoom: cuboro.ui.SliderButton;
		public cubeList: cuboro.ui.CubeList;
		public listBg: gf.display.Sprite;
		public gameScreen: cuboro.screens.Game;



		constructor(gameScreen: cuboro.screens.Game)
		{
			super(gameScreen.game);

			this.interactive = true;

			this.gameScreen = gameScreen;

			this.bg = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.bg.height = 145;
			this.bg.tint = cuboro.COLOR_LIGHT_GREY;
			this.addChild(this.bg);

			this.btMoveView = new cuboro.ui.IconButton(this.game, "move_view", loc("bt_move_view"));
			this.btMoveView.on(gf.CLICK, this.onMoveView, this);
			this.btMoveView.x = cuboro.PADDING;
			this.btMoveView.y = cuboro.PADDING;
			this.addChild(this.btMoveView);

			this.btLayerDistance = new cuboro.ui.SliderButton(this.game, "distance_layer", loc("bt_distance_layer"));
			this.btLayerDistance.on(gf.CHANGE, this.onLayerDistance, this);
			this.btLayerDistance.on(gf.CLICK, this.updateSlider, this);
			this.btLayerDistance.inverse = true;
			this.btLayerDistance.x = cuboro.PADDING;
			this.btLayerDistance.y = this.bg.height - this.btLayerDistance.height - cuboro.PADDING;
			this.addChild(this.btLayerDistance);

			this.btOpacity = new cuboro.ui.SliderButton(this.game, "opacity", loc("bt_opacity"));
			this.btOpacity.on(gf.CHANGE, this.onOpacity, this);
			this.btOpacity.on(gf.CLICK, this.updateSlider, this);
			this.btOpacity.inverse = true;
			this.btOpacity.x = this.btMoveView.right + cuboro.PADDING;
			this.btOpacity.y = this.btMoveView.y;
			this.addChild(this.btOpacity);

			this.btAddSets = new cuboro.ui.IconButton(this.game, "plus", loc("bt_select_sets", {count: 0}));
			this.btAddSets.on(gf.CLICK, this.onAddSets, this);
			this.btAddSets.x = this.btOpacity.right + cuboro.PADDING;
			this.btAddSets.y = this.btMoveView.y;
			this.addChild(this.btAddSets);

			const set = new gf.display.Sprite(this.game, "sprites", "icon_add_set");
			this.btAddSets.addChildAt(set, this.btAddSets.getChildIndex(this.btAddSets.icon));

			this.btElementsDistance = new cuboro.ui.SliderButton(this.game, "distance_elements", loc("bt_distance_elements"));
			this.btElementsDistance.on(gf.CHANGE, this.onElementsDistance, this);
			this.btElementsDistance.on(gf.CLICK, this.updateSlider, this);
			this.btElementsDistance.inverse = true;
			this.btElementsDistance.x = this.btOpacity.x;
			this.btElementsDistance.y = this.btLayerDistance.y;
			this.addChild(this.btElementsDistance);

			this.btZoom = new cuboro.ui.SliderButton(this.game, "zoom", loc("bt_zoom"));
			this.btZoom.on(gf.CHANGE, this.onZoom, this);
			this.btZoom.on(gf.CLICK, this.updateSlider, this);
			this.btZoom.inverse = true;
			this.btZoom.x = this.btAddSets.x;
			this.btZoom.y = this.btLayerDistance.y;
			this.addChild(this.btZoom);

			this.listBg = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.listBg.tint = cuboro.COLOR_MID_GREY;
			this.listBg.height = this.bg.height;
			this.listBg.x = this.btZoom.right + cuboro.PADDING;
			this.addChild(this.listBg);

			this.cubeList = new cuboro.ui.CubeList(this);
			this.cubeList.x = this.listBg.x + cuboro.PADDING;
			this.cubeList.y = cuboro.PADDING;
			this.addChild(this.cubeList);

			this.btUndo = new cuboro.ui.IconButton(this.game, "undo", loc("bt_undo"));
			this.btUndo.y = cuboro.PADDING;
			this.btUndo.on(gf.CLICK, this.onUndo, this);
			this.addChild(this.btUndo);

			this.btDelete = new cuboro.ui.IconButton(this.game, "delete", loc("bt_delete"));
			this.btDelete.on(gf.CLICK, this.onDelete, this);
			this.btDelete.y = this.btLayerDistance.y;
			this.addChild(this.btDelete);

			this.btSwap = new cuboro.ui.IconButton(this.game, "swap", loc("bt_swap"));
			this.btSwap.on(gf.CLICK, this.onSwap, this);
			this.btSwap.y = this.btLayerDistance.y;
			this.addChild(this.btSwap);

			this.btMoveCube = new cuboro.ui.IconButton(this.game, "move_cube", loc("bt_move_cube"));
			this.btMoveCube.on(gf.CLICK, this.onMoveCube, this);
			this.btMoveCube.y = this.btLayerDistance.y;
			this.addChild(this.btMoveCube);

			this.btDropHeight = new cuboro.ui.DropHeightButton(this.game);
			this.btDropHeight.on(gf.CLICK, this.onDropHeight, this);
			this.btDropHeight.y = cuboro.PADDING;
			this.addChild(this.btDropHeight);

			this.btMoveTrack = new cuboro.ui.MoveTrackButton(this);
			this.btMoveTrack.y = this.btLayerDistance.y;
			this.addChild(this.btMoveTrack);

			this.btMarble = new cuboro.ui.MarbleButton(this.game);
			this.btMarble.y = cuboro.PADDING;
			this.btMarble.on(gf.DOWN, this.onMarbleDown, this);
			this.btMarble.on(gf.UP, this.onMarbleUp, this);
			this.btMarble.on(gf.CLICK, this.onMarbleClick, this);
			this.addChild(this.btMarble);

			this.gameScreen.playground.history.on(gf.CHANGE, this.onHistory, this);
			this.gameScreen.playground.on(cuboro.CAMERA_UPDATE, this.updateSlider, this);
			this.gameScreen.playground.on(cuboro.CUBE_DESELECTED, this.deselectCube, this);

			this.onResize();
		}



		protected updateSlider(): void
		{
			const playground = this.gameScreen.playground;

			this.btElementsDistance.value = playground.elementMargin;
			this.btLayerDistance.value = playground.layerMargin;
			this.btOpacity.value = Math.abs(playground.cubeOpacity / 0.5 - 2);

			const max = playground.controls.settings.maxDistance;
			const min = playground.controls.settings.minDistance;
			this.btZoom.value = 1 - (playground.controls.distance - min) / (max - min);
		}



		protected deselectCube(): void
		{
			this.btSwap.isSelected = false;
			this.gameScreen.moveMenu.hide();
			this.gameScreen.rotateMenu.hide();
		}



		protected updateElementMargin(): void
		{
			const playground = this.gameScreen.playground;

			playground.elementMargin = this._elementMargin;
			this.btElementsDistance.value = this._elementMargin;


			playground.cubes.cubes.forEach((cube: cuboro.core.Cube) =>
			{
				cube.x = playground.map.xTo3DPos(cube.mapPosition.x);
				cube.z = playground.map.zTo3DPos(cube.mapPosition.z);
			});

			playground.ground.tiles.forEach((tile: THREE.Mesh) =>
			{
				tile.position.x = playground.map.xTo3DPos(tile.userData.x);
				tile.position.z = playground.map.zTo3DPos(tile.userData.z);
			});

			playground.placeables.tiles.forEach((tile: THREE.Mesh) =>
			{
				tile.position.x = playground.map.xTo3DPos(tile.userData.x);
				tile.position.z = playground.map.zTo3DPos(tile.userData.z);
			});

			playground.emit(cuboro.CUBE_UPDATE);
		}



		protected updateLayerMargin(): void
		{
			const playground = this.gameScreen.playground;

			playground.layerMargin = this._layerMargin;
			this.btLayerDistance.value = this._layerMargin;

			playground.cubes.cubes.forEach((cube: cuboro.core.Cube) =>
			{
				cube.y = playground.map.yTo3DPos(cube.mapPosition.y);
			});

			playground.emit(cuboro.CUBE_UPDATE);
		}



		protected spawnMarble(e: PIXI.interaction.InteractionEvent): void
		{
			this.gameScreen.playground.cubes.selected = null;
			this.gameScreen.playground.select.spawnMarble(e);
			this.gameScreen.playground.placeables.hide();
			this.gameScreen.moveMenu.hide();
			this.gameScreen.rotateMenu.hide();
		}



		protected onAddSets(): void
		{
			const addSets = this.game.overlays.show(cuboro.overlays.AddSets.NAME);
			addSets.bottomMenu = this;
		}



		protected onDelete(): void
		{
			if (!this.gameScreen.playground.cubes.selected) return;

			this.gameScreen.moveMenu.hide();
			this.gameScreen.rotateMenu.hide();

			this.gameScreen.playground.cubes.remove();

			this.gameScreen.playground.emit(cuboro.CUBE_UPDATE);
			this.gameScreen.playground.history.save();
			this.gameScreen.playground.save();
		}



		protected onHistory(length): void
		{
			this.btUndo.isEnabled = (length > 0);
		}



		protected onOpacity(value: number): void
		{
			const playground = this.gameScreen.playground;
			playground.cubeOpacity = 1 - (value * 0.5);
			playground.cubes.cubes.forEach((value: cuboro.core.Cube) =>
			{
				value.opacity = playground.cubeOpacity;
			});
		}



		protected onElementsDistance(value: number): void
		{
			this.elementMargin = value;
		}



		protected onLayerDistance(value: number): void
		{
			this.layerMargin = value;
		}



		protected onMoveView(): void
		{
			this.btMoveView.isSelected = !this.btMoveView.isSelected;
		}



		protected onZoom(value: number): void
		{
			const playground = this.gameScreen.playground;
			const max = playground.controls.settings.maxDistance;
			const min = playground.controls.settings.minDistance;
			playground.controls.distance = (1 - value) * (max - min) + min;
		}



		protected onSwap(): void
		{
			if (!this.gameScreen.playground.cubes.selected) return;

			if (this.btSwap.isSelected)
			{
				this.btSwap.isSelected = false;
				this.gameScreen.playground.cubes.swapping = null;
				this.gameScreen.rotateMenu.show();
			}
			else
			{
				this.btSwap.isSelected = true;

				this.btMoveCube.isSelected = false;
				this.gameScreen.moveMenu.hide();
				this.gameScreen.rotateMenu.hide();

				this.gameScreen.playground.cubes.swapping = this.gameScreen.playground.cubes.selected;

				/*this.hint.setText(loc("hint_swap_title"), loc("hint_swap_text"));
				this.hint.hideAbort();
				this.hint.onHide = () => this.onSwap();
				this.hint.show();*/
			}
		}



		protected onDropHeight(): void
		{
			if (this.btDropHeight.dropHeight == "HIGH")
				this.btDropHeight.dropHeight = "LOW";
			else if (this.btDropHeight.dropHeight == "LOW")
				this.btDropHeight.dropHeight = "MEDIUM";
			else
				this.btDropHeight.dropHeight = "HIGH";
		}



		protected onUndo(): void
		{
			this.gameScreen.playground.history.undo();
		}



		protected onMoveCube(): void
		{
			if (this.btMoveCube.isSelected)
			{
				this.btMoveCube.isSelected = false;
				this.gameScreen.moveMenu.hide();
			}
			else
			{
				this.btMoveCube.isSelected = true;
				if (this.gameScreen.playground.cubes.selected)
					this.gameScreen.moveMenu.show();
			}
		}



		protected onMarbleClick(e: PIXI.interaction.InteractionEvent): void
		{
			this.btMarble.removeAllListeners("mousemove touchmove");
			this.spawnMarble(e);
		}



		protected onMarbleDown(e: PIXI.interaction.InteractionEvent): void
		{
			this.dragStart = e.data.global.clone();
			this.btMarble.on("mousemove touchmove", (e) => this.onMarbleMove(e));
		}



		protected onMarbleMove(e: PIXI.interaction.InteractionEvent): void
		{
			if (!this.marbleSpawned && gf.utils.Maths.distance(this.dragStart, e.data.global) > 10)
			{
				this.marbleSpawned = true;
				this.spawnMarble(e);
			}
		}



		public onMarbleUp(): void
		{
			this.btMarble.removeAllListeners("mousemove touchmove");
			this.marbleSpawned = false;
		}



		public start(): void
		{
			this.cubeList.reset();

			mTrack.data.sets.forEach((value: string) =>
			{
				this.cubeList.addSet(value);
			});

			this.btAddSets.label = loc("bt_select_sets", {count: mTrack.data.sets.length});
			this.game.stage.header.trackMenu.checkPublish();

			this.gameScreen.playground.elementMargin = 0;
			this.gameScreen.playground.layerMargin = 0;
			this.gameScreen.playground.cubeOpacity = 1;
			this.gameScreen.playground.controls.distance = this.gameScreen.playground.controls.settings.maxDistance;

			this.btElementsDistance.value = 1;
			this.btLayerDistance.value = 1;
			this.btOpacity.value = 1;
			this.btZoom.value = 1;

			this.btDropHeight.dropHeight = cuboro.MARBLE_DROP_HEIGHT_DEFAULT;

			if (this.btMoveCube.isSelected) this.btMoveCube.isSelected = false;
			if (this.btMoveTrack.isSelected) this.btMoveTrack.onMoveTrack();
			if (this.btElementsDistance.isSelected) this.btElementsDistance.onSlider();
			if (this.btLayerDistance.isSelected) this.btLayerDistance.onSlider();
			if (this.btOpacity.isSelected) this.btOpacity.onSlider();
			if (this.btZoom.isSelected) this.btZoom.onSlider();

			this.btMoveTrack.isSelected = false;
			this.btMoveView.isSelected = false;
			this.btSwap.isSelected = false;

			this.gameScreen.playground.cubes.swapping = null;
			this.gameScreen.layers.reset();
			this.game.stage.header.trackMenu.btDetails.isSelected = false;
			this.game.stage.header.trackMenu.tfSaved.text = "";
			this.cubeList.updateUsed();

			this.onResize();
		}



		public onResize(): void
		{
			super.onResize();

			this.y = this.game.height - this.bg.height - this.game.stage.footer.height;

			this.bg.width = this.game.width;

			this.btDelete.x = this.game.width - this.btDelete.width - cuboro.PADDING;
			this.btSwap.x = this.btDelete.x - this.btSwap.width - cuboro.PADDING;
			this.btMoveTrack.x = this.btSwap.x - this.btMoveTrack.width - cuboro.PADDING;
			this.btDropHeight.x = this.btMoveTrack.x;
			this.btMarble.x = this.btDropHeight.right;
			this.btMoveCube.x = this.btMoveTrack.x - this.btMoveCube.width - cuboro.PADDING;
			this.btUndo.x = this.btMoveCube.x;

			this.listBg.width = this.btMoveCube.x - cuboro.PADDING - this.listBg.x;

			this.cubeList.arrange(this.listBg.width - (this.cubeList.x - this.listBg.x));
		}



		public get layerMargin(): number
		{
			return this._layerMargin;
		}



		public set layerMargin(value: number)
		{
			if (value == this._layerMargin) return;

			this._layerMargin = value;
			this.updateLayerMargin();
		}



		public get elementMargin(): number
		{
			return this._elementMargin;
		}



		public set elementMargin(value: number)
		{
			if (value == this._elementMargin) return;

			this._elementMargin = value;
			this.updateElementMargin();
		}
	}
}
