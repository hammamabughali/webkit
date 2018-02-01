/// <reference path="../async/flags.ts"/>
/// <reference path="../math/matrix4x4.ts"/>
/// <reference path="../pogo/tickdata.ts"/>
/// <reference path="../pogo/tween.ts"/>
/// <reference path="../webgl/program.ts"/>
/// <reference path="../webgl/texture.ts"/>



module pogo
{
	export interface MaterialOptions
	{
		priority?:number;
	}



	export class Material
	{
		protected options:MaterialOptions;

		public flags = new kr3m.async.Flags();

		protected program:kr3m.webgl.Program;
		protected tweenObj:Tween<Material>;

		protected maxLightCount = 1;



		constructor(
			protected canvas:Canvas,
			options?:MaterialOptions)
		{
			this.options = options || {};
			this.tweenObj = new Tween(this);
		}



		public setProgram(program:kr3m.webgl.Program)
		{
			this.program = program;
			if (this.program)
			{
				this.program.setToken("maxLightCount", this.maxLightCount);
				this.program.flags.onceSet("ready", () => this.flags.set("ready"));
			}
		}



		public getProgram():kr3m.webgl.Program
		{
			return this.program;
		}



		public get tween():Tween<Material>
		{
			return this.tweenObj;
		}



		public update(data:TickData):void
		{
			this.tween.update(data.deltaScaled);
		}



		protected applyLights(lights:Light[]):void
		{
			if (lights.length > this.maxLightCount)
			{
				this.maxLightCount = lights.length;
				this.program.setToken("maxLightCount", this.maxLightCount);
			}

			var lightColors:number[] = [];
			var lightPositions:number[] = [];
			for (var i = 0; i < lights.length; ++i)
			{
				lights[i].pushPosition(lightPositions);
				lights[i].pushColor(lightColors);
			}
			for (var i = lights.length; i < this.maxLightCount; ++i)
			{
				lightPositions.push(0, 0, 0);
				lightColors.push(0, 0, 0);
			}
			this.program.setUniformVectorArray("uLightPositions", lightPositions, this.maxLightCount);
			this.program.setUniformVectorArray("uLightColors", lightColors, this.maxLightCount);
		}



		public render(
			matrices:{[id:string]:kr3m.math.Matrix4x4},
			mesh:Mesh,
			lights:Light[]):void
		{
			if (!this.flags.isSet("ready"))
				return;

			//# TODO: applyLights sollte nur ausgeführt werden wenn sich an den Lichtern tatsächlich etwas verändert hat
			this.applyLights(lights);

			this.program.use();
			for (var i in matrices)
				this.program.setUniformMatrix(i, matrices[i]);

			mesh.render(this.program);
		}
	}
}
