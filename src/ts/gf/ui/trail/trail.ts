/// <reference path="../../display/draggable.ts"/>
/// <reference path="../../overlays/episodes.ts"/>
/// <reference path="../../ui/trail/itrailtile.ts"/>



module gf.ui.trail
{
	export const LEVEL_SELECT: string = "levelSelect";



	export class Trail extends gf.display.Container
	{
		protected lastLevel:number;
		protected mapIndex:number;
		protected positionIndex:number;

		public tiles: gf.ui.trail.ITrailTile[];
		public container: gf.display.Draggable;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.interactive = true;
			this.lastLevel = -1;

			this.init();
		}



		protected init():void
		{
			this.addTrailContainer();
			this.build();

			this.game.storage.on(gf.DATA, this.onStorageData, this);
		}



		protected onStorageData():void
		{
			this.tiles.forEach((value) => value.update());
		}



		protected addTrailContainer():void
		{
			this.container = new gf.display.Draggable(this.game);
			this.container.canDragX = false;
			this.addChild(this.container);
		}



		protected getEpisodeByLevel(level:number):number
		{
			let episode:number = 1;

			this.game.levels.data.episodes.forEach((value:any) =>
			{
				if (value.levels.indexOf(level) != -1)
				{
					episode = value.id;
					return true;
				}
			});

			return episode;
		}



		protected getPosition(): PIXI.Point
		{
			if (this.positionIndex == this.game.levels.data.positions.length)
			{
				this.positionIndex = 0;
				this.mapIndex++;
			}

			let position:number[] = this.game.levels.data.positions[this.positionIndex];
			this.positionIndex++;

			return new PIXI.Point(position[0] / this.game.client.config.assetsResolution, position[1] / this.game.client.config.assetsResolution);
		}



		protected addTile(level:number, episode:number):void
		{
			let tileVO: gf.vo.TileVO = new gf.vo.TileVO();
			tileVO.level = level;
			tileVO.episode = episode;

			let position: PIXI.Point = this.getPosition();
			tileVO.x = position.x;
			tileVO.y = position.y;
			tileVO.map = this.mapIndex;

			let tile:any = new this.game.client.config.TrailTileClass(this.game, tileVO);
			tile.onLevelSelect.add(this.selectLevel, this);
			this.container.addChild(tile);

			this.tiles.push(tile);
		}



		public build():void
		{
			this.mapIndex = 1;
			this.positionIndex = 0;
			this.tiles = [];

			let episode:number;
			let lastEpisode:number = 1;

			for (let level:number = 0; level <= this.game.levels.levelCount - 1; ++level)
			{
				episode = this.getEpisodeByLevel(level);
				if (episode != lastEpisode)
				{
					this.addTile(-1, episode);
					lastEpisode = episode;
				}

				this.addTile(level, episode);
			}
		}



		public selectLevel(tileVO: gf.vo.TileVO):void
		{
			if (Math.abs(this.container.dragDistance.y) > 10) return;

			if (tileVO.level == -1 || !this.game.episodes.isEpisodeUnlocked(tileVO.episode))
			{
				let episodes: gf.overlays.Episodes = this.game.overlays.show("episodes");
				episodes.update(tileVO.episode);
			}
			else
			{
				this.game.levels.loadLevel(tileVO.level, () =>
				{
					this.game.levels.currentLevel = this.game.levels.getLevelVO(tileVO.level);
					this.emit(gf.ui.trail.LEVEL_SELECT);
				});
			}
		}



		public update():void
		{
			this.tiles.forEach((tile: gf.ui.trail.ITrailTile) =>
			{
				tile.update();
				if (tile.tileVO.level == this.game.user.progress.getProgress().level && tile.tileVO.level > this.lastLevel)
				{
					this.moveToTile(tile);
					this.lastLevel = tile.tileVO.level;
				}
			});
		}



		public move(value:number):void
		{
			this.container.move(0, value);
		}



		public moveToTile(tile: gf.ui.trail.ITrailTile):void
		{
			const ty:number = -tile.y * this.container.scale.x + (this.game.height >> 1);
			TweenMax.to(this.container, 0.5,
			{
				y: Math.min(this.container.maxY, Math.max(this.container.minY, ty)),
				ease: Quad.easeInOut
			});
		}



		public onResize():void
		{
			this.container.minY = this.game.height;
			this.container.maxY = this.game.height + (this.container.height - this.game.height);

			this.container.y = Math.min(this.container.maxY, Math.max(this.container.minY, this.container.y));

			super.onResize();
		}
	}
}
