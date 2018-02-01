/// <reference path="../../canvas/display/dragonbonescontainer.ts"/>
/// <reference path="../../canvas/factory/dragonbonesfactory.ts"/>
/// <reference path="../../canvas/texture/dragonbonestextureatlas.ts"/>
/// <reference path="../../canvas/texture/dragonbonestexturedata.ts"/>
/// <reference path="../../lib/dragonbones.ts"/>



module kr3m.canvas.animation
{
	interface DragonBonesData
	{
		atlas:any;
		skeleton:any;
	}



	interface ArmatureConfig
	{
		name:string;
		skeletonId:string;
		animationId:string;
	}



	export class DragonBones extends PIXI.DisplayObjectContainer
	{
		public static data:{ [key:string]:DragonBonesData } = {};

		public armature:dragonBones.Armature;
		public display:kr3m.canvas.display.DragonBonesContainer;


		private sleeping:boolean = false


		constructor(key:string, armatureName:string, animationId:string = null, sleep:boolean = false)
		{
			super();

			if (!kr3m.canvas.animation.DragonBones.data[key])
				throw new Error("No DragonBones data width key " + key + " found!");

			var atlas:any = kr3m.canvas.animation.DragonBones.data[key].atlas;
			var skeleton:any = kr3m.canvas.animation.DragonBones.data[key].skeleton;

			this.sleeping = true;

			var skeletonId = skeleton.name;

			var config:ArmatureConfig =
			{
				name: armatureName,
				skeletonId: skeletonId,
				animationId: animationId
			};

			var texture:any = PIXI.TextureCache[key];
			this.armature = this.makeArmature(config, skeleton, atlas, texture);

			this.display = <kr3m.canvas.display.DragonBonesContainer>this.armature.getDisplay();
			this.addChild(this.display);
		}



		private makeArmature(
			config:ArmatureConfig,
			skeletonJson:any,
			atlasJson:any,
			texture:PIXI.Texture):dragonBones.Armature
		{
			var skeletonId = config.skeletonId;
			var armatureName = config.name;
			var animationId = config.animationId;

			var textureData:canvas.texture.DragonBonesTextureData = new kr3m.canvas.texture.DragonBonesTextureData(skeletonId, atlasJson);

			var factory:kr3m.canvas.factory.DragonBonesFactory = new kr3m.canvas.factory.DragonBonesFactory();
			factory.addSkeletonData(dragonBones.objects.DataParser.parseSkeletonData(skeletonJson));

			var textureAtlas:kr3m.canvas.texture.DragonBonesTextureAtlas = new kr3m.canvas.texture.DragonBonesTextureAtlas(texture, textureData);

			factory.addTextureAtlas(textureAtlas);

			var armature:dragonBones.Armature = factory.buildArmature(armatureName, animationId, skeletonId, null, null);

			if (!this.sleeping)
				dragonBones.animation.WorldClock.clock.add(armature);

			if (animationId)
				armature.animation.gotoAndPlay(animationId);

			return armature;
		}



		public isAwake():boolean
		{
			return !this.sleeping;
		}



		public sleep():void
		{
			if (!this.sleeping)
				dragonBones.animation.WorldClock.clock.remove(this.armature);

			this.sleeping = true;
		}



		public wakeUp():void
		{
			if (this.sleeping)
				dragonBones.animation.WorldClock.clock.add(this.armature);

			this.sleeping = false;
		}



		public showBone(boneName:string):void
		{
			var bone:dragonBones.Bone = this.armature.getBone(boneName);
			if (!bone)
				throw new Error("No bone with name " + boneName + " found in DragonBones armature " + this.armature.name);

			bone.setVisible(true);
		}



		public hideBone(boneName:string):void
		{
			var bone:dragonBones.Bone = this.armature.getBone(boneName);
			if (!bone)
				throw new Error("No bone with name " + boneName + " found in DragonBones armature " + this.armature.name);

			bone.setVisible(false);
		}



		public setBoneVisible(boneName:string, visible:boolean):void
		{
			if (visible)
				this.showBone(boneName);
			else
				this.hideBone(boneName);
		}



		public isBoneVisible(boneName:string):boolean
		{
			var bone:dragonBones.Bone = this.armature.getBone(boneName);
			if (!bone)
				throw new Error("No bone with name " + boneName + " found in DragonBones armature " + this.armature.name);

			return bone.getVisible();
		}



		public playChildAnimation(boneName:string, name:string):void
		{
			var bone:dragonBones.Bone = this.armature.getBone(boneName);
			if (!bone)
				throw new Error("No bone with name " + boneName + " found in DragonBones armature " + this.armature.name);

			if (bone.slot.getChildArmature().animation.animationNameList.indexOf(name) == -1)
				throw new Error("No animation with name " + name + " found in DragonBones armature " + bone.slot.getChildArmature().name);

			bone.slot.getChildArmature().animation.gotoAndPlay(name);
		}



		public addEventListener(eventType, listener:Function):void
		{
			this.armature.addEventListener(eventType, listener);
		}



		public removeEventListener(eventType, listener:Function):void
		{
			this.armature.removeEventListener(eventType, listener);
		}



		public removeAllEventListeners(eventType):void
		{
			this.armature.removeAllEventListeners(eventType);
		}



		public play(name:string):void
		{
			if (this.armature.animation.animationNameList.indexOf(name) == -1)
				throw new Error("No animation with name " + name + " found in DragonBones armature " + this.armature.name);

			this.armature.animation.gotoAndPlay(name);
		}



		public stop():void
		{
			if (this.armature.animation.getIsPlaying())
				this.armature.animation.stop();
		}



		public getAnimationNameList():string[]
		{
			return this.armature.animation.animationNameList;
		}



		public switchBoneTexture(boneName:string, frameName:string):void
		{
			var bone:dragonBones.Bone = this.armature.getBone(boneName);
			if (!bone)
				throw new Error("No bone with name " + boneName + " found in Dragon Bones armature with name " + this.armature.name);

			var displayList:kr3m.canvas.display.Sprite[] = bone.slot.getDisplay().children;
			for (var i:number = 0; i < displayList.length; ++i)
				displayList[i].visible = (displayList[i].frameName == frameName);
		}
	}
}
