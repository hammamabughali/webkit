/// <reference path="../async/flags.ts"/>
/// <reference path="../types.ts"/>
/// <reference path="../util/tokenizer.ts"/>
/// <reference path="../util/util.ts"/>
/// <reference path="../webgl/canvas.ts"/>



module kr3m.webgl
{
	export class Shader
	{
		public flags = new kr3m.async.Flags();

		protected source:string;
		protected shaderObj:any;
		protected uniformTypes:any = {};
		protected tokens:{[name:string]:string|number} = {};
		protected foundTokens:string[] = [];

		protected errorListeners:ErrorCallback[] = [];



		constructor(
			protected canvas:kr3m.webgl.Canvas,
			type:any)
		{
			var gl = this.canvas.getGL();
			this.shaderObj = gl.createShader(type);
		}



		public attach(programObj:any):void
		{
			var gl = this.canvas.getGL();
			gl.attachShader(programObj, this.shaderObj);
		}



		private findUniforms(source:string):void
		{
			this.uniformTypes = {};
			var pat = /uniform\s+(\w+)\s+(\w+)/g;
			var matches:any;
			while (matches = pat.exec(source))
				this.uniformTypes[matches[2]] = matches[1];
		}



		public getUniformTypes():any
		{
			return this.uniformTypes;
		}



		public onError(listener:ErrorCallback):void
		{
			this.errorListeners.push(listener);
		}



		private compile():void
		{
			if (kr3m.util.Util.intersect(Object.keys(this.tokens), this.foundTokens).length < this.foundTokens.length)
				return;

			this.flags.clear("ready");
			var source = tokenize(this.source, this.tokens);
			var gl = this.canvas.getGL();
			gl.shaderSource(this.shaderObj, source);
			gl.compileShader(this.shaderObj);
			if (!gl.getShaderParameter(this.shaderObj, gl.COMPILE_STATUS))
			{
				logError("error while compiling shader");
				var errorMessage = gl.getShaderInfoLog(this.shaderObj);
//# DEBUG
				if (this.errorListeners.length == 0)
				{
					logError(source);
					logError(errorMessage);
				}
//# /DEBUG
				this.errorListeners.forEach(listener => listener(errorMessage));
				return;
			}
			this.flags.set("ready");
		}



		public setToken(name:string, value:string|number):void
		{
			this.tokens[name] = value;
			if (this.foundTokens.indexOf(name) >= 0)
				this.compile();
		}



		private findTokens(source:string):void
		{
			this.foundTokens = [];
			var pat = /##(.+?)##/g;
			var matches:any;
			while (matches = pat.exec(source))
				this.foundTokens.push(matches[1]);
			this.foundTokens = kr3m.util.Util.removeDuplicates(this.foundTokens);
		}



		public setSource(source:string):void
		{
			this.findUniforms(source);
			this.findTokens(source);
			this.source = source;
			this.compile();
		}
	}
}
