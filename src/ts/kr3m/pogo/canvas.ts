/// <reference path="../pogo/actor.ts"/>
/// <reference path="../pogo/anchor.ts"/>
/// <reference path="../pogo/assets.ts"/>
/// <reference path="../pogo/camera.ts"/>
/// <reference path="../pogo/cameras/free.ts"/>
/// <reference path="../pogo/constants.ts"/>
/// <reference path="../pogo/entity.ts"/>
/// <reference path="../pogo/frame.ts"/>
/// <reference path="../pogo/globals.ts"/>
/// <reference path="../pogo/keyboard.ts"/>
/// <reference path="../pogo/renderers/deferred.ts"/>
/// <reference path="../pogo/renderers/forward.ts"/>
/// <reference path="../pogo/renderers/ui.ts"/>
/// <reference path="../pogo/ticked.ts"/>
/// <reference path="../pogo/touchscreen.ts"/>
/// <reference path="../pogo/types.ts"/>
/// <reference path="../util/util.ts"/>
/// <reference path="../webgl/canvas.ts"/>

//# PROFILING
/// <reference path="../async/loop.ts"/>
/// <reference path="../pogo/frames/profiling.ts"/>
//# /PROFILING



module pogo
{
	export class Canvas extends kr3m.webgl.Canvas
	{
		public camera:Camera;
		public keyboard:Keyboard;
		public touchscreen:Touchscreen;
		public screenFrame:Frame;

		public dirty = true;

		protected deferredRenderer:pogo.renderers.Deferred;
		protected forwardRenderer:pogo.renderers.Forward;
		protected uiRenderer:pogo.renderers.UI;

		protected tickeds:Ticked[] = [];
		protected entities:Entity[] = [];

		//# TODO: "globale" variablen des Canvas in ein extra Entity verpacken damit man sie auch animieren kann
		public backgroundColor = new kr3m.webgl.Color(0.25, 0.125, 0.125);
		public ambientLightColor = new kr3m.webgl.Color(1, 1, 1);

//# PROFILING
		public profile = {programSwitchCount : 0, uniformSwitchCount : 0, faceCount : 0};
//# /PROFILING



		constructor(parentNode:kr3m.ui2.ParentTypes, options?:kr3m.ui2.CanvasOptions)
		{
			super(parentNode, options);
			if (!this.gl)
				return;

			var gl = this.gl;

			gl.enable(gl.CULL_FACE);
			gl.cullFace(gl.BACK);

			this.camera = new pogo.cameras.Free(this);

			this.deferredRenderer = new pogo.renderers.Deferred(this, this.camera);
			this.forwardRenderer = new pogo.renderers.Forward(this, this.camera);
			this.uiRenderer = new pogo.renderers.UI(this);

			this.screenFrame = new Frame(this, {name : "ScreenFrame_##id##", width : this.getWidth(), height : this.getHeight()});

			this.keyboard = new Keyboard(this);
			this.touchscreen = new Touchscreen(this);

//# PROFILING
			new pogo.frames.Profiling(this);
			this.initHooks();
//# /PROFILING

			this.on("frame", () => this.onWorldTick(this.getDelta()));
			this.on("size", () => this.onCanvasSize());
		}



//# PROFILING
		protected initHooks():void
		{
			var gl = this.gl;
			var oldUseProgram = gl.useProgram;
			gl.useProgram = (...params:any[]) =>
			{
				++this.profile.programSwitchCount;
				oldUseProgram.apply(gl, params);
			};

			var oldDrawElements = gl.drawElements;
			gl.drawElements = (mode:number, count:number, type:number, indices:number) =>
			{
				this.profile.faceCount += count / 3;
				oldDrawElements.call(gl, mode, count, type, indices);
			};

			var uniSuffixes = ["f", "3fv", "1i", "Matrix4fv"];
			kr3m.async.Loop.forEach(uniSuffixes, (suffix, next) =>
			{
				var oldUni = gl["uniform" + suffix];
				gl["uniform" + suffix] = (...params:any[]) =>
				{
					++this.profile.uniformSwitchCount;
					oldUni.apply(gl, params);
				};
				next();
			});
		}
//# /PROFILING



		protected onCanvasSize():void
		{
			var gl = this.gl;
			if (!gl)
				return;

			gl.viewport(0, 0, this.getWidth(), this.getHeight());
			this.screenFrame.setSize(this.getWidth(), this.getHeight());
			this.dirty = true;
		}



		protected updateTicked(data:TickData):void
		{
			for (var i = 0; i < this.tickeds.length; ++i)
				this.tickeds[i].update(data);
		}



		public addEntity(entity:Entity):this
		{
			if (this.entities.indexOf(entity) >= 0)
				return this;

			this.entities.push(entity);
			this.tickeds.push(entity);
			return this;
		}



		public addTicked(ticked:Ticked):this
		{
			if (this.tickeds.indexOf(ticked) >= 0)
				return this;

			this.tickeds.push(ticked);
			return this;
		}



		protected collect(cls:any):any[]
		{
			var allEntities:Entity[] = [];
			var workset = this.entities.slice();
			while (workset.length > 0)
			{
				var entity = workset.shift();
				if (entity.visible)
				{
					allEntities.push(entity);
					workset = workset.concat(entity.children);
				}
			}
			return kr3m.util.Util.getAllInstancesOf(allEntities, cls);
		}



		protected collectActors():Actor[]
		{
			return this.collect(Actor);
		}



		protected collectFrames():Frame[]
		{
			return this.collect(Frame);
		}



		protected collectLights():Light[]
		{
			return this.collect(Light);
		}



		protected onWorldTick(delta:number):void
		{
			var data = new TickData(delta, 1);
			this.updateTicked(data);

			if (this.dirty)
			{
				this.clear(this.backgroundColor);

				var lights = this.collectLights();

				var deferredActors = this.collectActors();
				this.deferredRenderer.render(deferredActors);

				var forwardActors = this.collectActors();
				this.forwardRenderer.render(forwardActors, lights);

				var uiFrames = this.collectFrames();
				this.uiRenderer.render(uiFrames);
			}
			this.dirty = false;
		}



		public setCamera(camera:Camera):this
		{
			this.camera = camera;
			this.deferredRenderer.setCamera(this.camera);
			this.forwardRenderer.setCamera(this.camera);
			return this;
		}
	}
}
