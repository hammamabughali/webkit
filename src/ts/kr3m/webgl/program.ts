/// <reference path="../async/flags.ts"/>
/// <reference path="../math/matrix4x4.ts"/>
/// <reference path="../types.ts"/>
/// <reference path="../util/util.ts"/>
/// <reference path="../webgl/fragmentshader.ts"/>
/// <reference path="../webgl/vertexshader.ts"/>



module kr3m.webgl
{
	export class Program
	{
		public flags = new kr3m.async.Flags();

		protected programObj:any;

		protected vertexShader:kr3m.webgl.VertexShader;
		protected fragmentShader:kr3m.webgl.FragmentShader;

		protected uniformTypes:any = {};
		protected uniformLocations:{[name:string]:number} = {};

		protected textureUnits:string[] = [];
		protected textures:kr3m.webgl.Texture[] = [];

		protected errorListeners:ErrorCallback[] = [];



		constructor(
			protected canvas:kr3m.webgl.Canvas)
		{
			var gl = this.canvas.getGL();
			this.programObj = gl.createProgram();
			this.flags.onSet(["fragment", "vertex"], () => this.compile());
		}



		public setVertexShader(shader:kr3m.webgl.VertexShader):void
		{
			this.flags.clear("vertex");
			this.vertexShader = shader;
			if (this.vertexShader)
				this.vertexShader.flags.onceSet("ready", () => this.flags.set("vertex"));
		}



		public setFragmentShader(shader:kr3m.webgl.FragmentShader):void
		{
			this.flags.clear("fragment");
			this.fragmentShader = shader;
			if (this.fragmentShader)
				this.fragmentShader.flags.onceSet("ready", () => this.flags.set("fragment"));
		}



		public onError(listener:ErrorCallback):void
		{
			this.errorListeners.push(listener);
		}



		private compile():void
		{
			this.vertexShader.attach(this.programObj);
			this.fragmentShader.attach(this.programObj);

			var gl = this.canvas.getGL();
			gl.linkProgram(this.programObj);

			if (!gl.getProgramParameter(this.programObj, gl.LINK_STATUS))
			{
				var errorMessage = "error while linking shader program";
//# DEBUG
				if (this.errorListeners.length == 0)
					logError(errorMessage);
//# /DEBUG
				this.errorListeners.forEach(listener => listener(errorMessage));
				return;
			}

			this.uniformTypes = kr3m.util.Util.mergeAssoc(this.vertexShader.getUniformTypes(), this.fragmentShader.getUniformTypes());
			this.flags.set("ready");
		}



		protected bind():void
		{
			if (this.canvas.currentProgram == this)
				return;

			this.canvas.currentProgram = this;

			var gl = this.canvas.getGL();
			gl.useProgram(this.programObj);
		}



		public use():void
		{
			this.bind();

			var gl = this.canvas.getGL();
			for (var i = 0; i < this.textures.length; ++i)
				this.textures[i].use(i);
		}



		public setToken(name:string, value:string|number):void
		{
			if (this.vertexShader)
				this.vertexShader.setToken(name, value);

			if (this.fragmentShader)
				this.fragmentShader.setToken(name, value);
		}



		public setAttributes(name:string, buffer:kr3m.webgl.AttributeBuffer):void
		{
			this.flags.onceSet("ready", () =>
			{
				var loc = this.uniformLocations[name];
				if (loc < 0)
					return;

				this.bind();

				var gl = this.canvas.getGL();
				if (loc === undefined)
				{
					loc = gl.getAttribLocation(this.programObj, name);
					this.uniformLocations[name] = loc;
				}

				if (loc < 0)
					return;

				gl.enableVertexAttribArray(loc);
				buffer.useInLoc(loc);
			});
		}



		public setUniformFloat(name:string, value:number):void
		{
			this.flags.onceSet("ready", () =>
			{
				if (this.uniformTypes[name] != "float")
					return;

				this.bind();

				var gl = this.canvas.getGL();
				var loc = gl.getUniformLocation(this.programObj, name);
				gl.uniform1f(loc, value);
			});
		}



		public setUniformInt(name:string, value:number):void
		{
			this.flags.onceSet("ready", () =>
			{
				if (this.uniformTypes[name] != "int")
					return;

				this.bind();

				var gl = this.canvas.getGL();
				var loc = gl.getUniformLocation(this.programObj, name);
				gl.uniform1f(loc, value);
			});
		}



		public setUniformColor(name:string, color:kr3m.webgl.Color):void
		{
			this.flags.onceSet("ready", () =>
			{
				if (this.uniformTypes[name] != "vec3")
					return;

				this.bind();

				var gl = this.canvas.getGL();
				var loc = gl.getUniformLocation(this.programObj, name);
				gl.uniform3fv(loc, new Float32Array([color.r, color.g, color.b]));
			});
		}



		public setUniformVectorArray(
			name:string,
			values:number[],
			paddTo:number):void
		{
			this.flags.onceSet("ready", () =>
			{
				if (this.uniformTypes[name] != "vec3")
					return;

				this.bind();

				var gl = this.canvas.getGL();
				while (values.length < paddTo * 3)
					values.push(0);

				var loc = gl.getUniformLocation(this.programObj, name);
				gl.uniform3fv(loc, new Float32Array(values));
			});
		}



		public setUniformTexture(name:string, texture:kr3m.webgl.Texture):void
		{
			this.flags.onceSet("ready", () =>
			{
				if (this.uniformTypes[name] != "sampler2D")
					return;

				this.bind();

				var gl = this.canvas.getGL();
				var unit = this.textureUnits.indexOf(name);
				if (unit < 0)
				{
					this.textureUnits.push(name);
					unit = this.textureUnits.length - 1;
				}
				this.textures[unit] = texture;

				var loc = gl.getUniformLocation(this.programObj, name);
				gl.uniform1i(loc, unit);
			});
		}



		public setUniformMatrix(name:string, matrix:kr3m.math.Matrix4x4):void
		{
			this.flags.onceSet("ready", () =>
			{
				if (this.uniformTypes[name] != "mat4")
					return;

				this.bind();

				var gl = this.canvas.getGL();
				var loc = gl.getUniformLocation(this.programObj, name);
				gl.uniformMatrix4fv(loc, false, new Float32Array(matrix.v));
			});
		}
	}
}
