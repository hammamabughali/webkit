/// <reference path="../core/playground.ts"/>
/// <reference path="../vo/evaluationdata.ts"/>



module cuboro.core
{
	export class Evaluation
	{
		public playground: cuboro.core.Playground;
		public current: cuboro.vo.EvaluationData;



		constructor(playground: cuboro.core.Playground)
		{
			this.playground = playground;
			this.reset();
		}



		protected isSubstructure(cube: cuboro.core.Cube): boolean
		{
			let result = false;
			this.playground.cubes.cubes.forEach((value: cuboro.core.Cube) =>
			{
				if (value.hits > 0)
				{
					if (value.mapPosition.x == cube.mapPosition.x && value.mapPosition.z == cube.mapPosition.z)
					{
						if (value.mapPosition.y > cube.mapPosition.y)
						{
							result = true;
							return true;
						}
					}
				}
			});

			return result;
		}



		public reset(): void
		{
			this.current = new cuboro.vo.EvaluationData();

			this.current.cubes = 0;
			this.current.track = [0, 0, 0, 0, 0];
			this.current.substructure = 0;

			this.current.scoreCubes = 0;
			this.current.scoreTotal = 0;
			this.current.scoreTrack = [0, 0, 0, 0, 0];
			this.current.scoreSubstructure = 0;
		}



		public calculate(): void
		{
			this.reset();

			this.current.cubes = this.playground.cubes.getCubes().length;

			this.current.scoreCubes = this.current.cubes;
			this.current.scoreTrack = [0, 0, 0, 0, 0];
			this.current.scoreSubstructure = 0;

			const collisions = this.playground.marble.collisions;
			const cubes = [];

			collisions.forEach((value: cuboro.core.Collision) =>
			{
				if (cubes.indexOf(value.cube) == -1)
					cubes.push(value.cube);
			});

			cubes.forEach((value: cuboro.core.Cube) =>
			{
				this.current.track[value.hits - 1]++;

				if (value.hits == 1)
					this.current.scoreTrack[0] += 2;
				else if (value.hits == 2)
					this.current.scoreTrack[1] += 4;
				else if (value.hits == 3)
					this.current.scoreTrack[2] += 12;
				else if (value.hits == 4)
					this.current.scoreTrack[3] += 16;
				else if (value.hits > 4)
					this.current.scoreTrack[4] += 16;

				if (this.isSubstructure(value))
				{
					this.current.substructure++;
					this.current.scoreSubstructure += 4;
				}
			});

			this.current.scoreTotal = this.current.scoreCubes +
				this.current.scoreTrack[0] +
				this.current.scoreTrack[1] +
				this.current.scoreTrack[2] +
				this.current.scoreTrack[3] +
				this.current.scoreTrack[4] +
				this.current.scoreSubstructure;

			mTrack.data.evaluation = this.current;
			this.playground.game.stage.header.trackMenu.checkPublish();
		}
	}
}
