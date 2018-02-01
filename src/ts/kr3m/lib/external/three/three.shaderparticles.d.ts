// Type definitions for ShaderParticleEngine 0.7.9
// Project: https://github.com/squarefeet/ShaderParticleEngine
// Definitions by: Robert Krasky
/// <reference path="three.d.ts"/>

declare module SPE
{
	export interface GroupOptions
	{
		fixedTimeStep?:number; // default: 0.016
		hasPerspective?:boolean; // default: true
		colorize?:boolean; // default: true
		blending?: THREE.Blending; // default: THREE.AdditiveBlending
		transparent?:boolean; // default: true
		alphaTest?:number; // default: 0.5
		depthWrite?:boolean; // default: false
		depthTest?:boolean; // default: true
		maxParticleCount?:number;
		texture?: SPE.Texture;
		fog?:boolean; // default: true
		scale?:number; // default: 300
	}

	export interface Texture
	{
		value?: THREE.Texture; // default: null
		frames?: THREE.Vector2; // default: THREE.Vector2( 1, 1 )
		frameCount?:number // default: textureFrames.x * textureFrames.y
		loop?:number; // default: 1
	}

	export interface Distribution
	{
		BOX:number;
		SPHERE:number;
		DISC:number;
	}

	export interface MaxAge
	{
		value?:number; // default: 2
		spread?:number; // default: 0
	}

	export interface Position
	{
		value?: THREE.Vector3;
		spread?: THREE.Vector3;
		spreadClamp?: THREE.Vector3;
		radius?:number; // default: 10
		radiusScale?: THREE.Vector3;
		distribution?: SPE.Distribution;
		randomise?:boolean; // default: false
	}

	export interface Velocity
	{
		value?: THREE.Vector3;
		spread?: THREE.Vector3;
		distribution?: SPE.Distribution;
		randomise?:boolean; // default: false
	}

	export interface Acceleration
	{
		value?: THREE.Vector3;
		spread?: THREE.Vector3;
		distribution?: SPE.Distribution;
		randomise?:boolean; // default: false
	}

	export interface Drag
	{
		value?: THREE.Vector3;
		spread?: THREE.Vector3;
		randomise?:boolean; // default: false
	}

	export interface Wiggle
	{
		value?: THREE.Vector3; // default: 0
		spread?: THREE.Vector3; // default: 0
	}

	export interface Color
	{
		value?: THREE.Color;
		spread?: THREE.Vector3; // default: 0
		randomise?:boolean; // default: false
	}

	export interface Opacity
	{
		value?:number|number[]; // default: 1
		spread?:number|number[]; // default: 0
		randomise?:boolean; // default: false
	}

	export interface Size
	{
		value?:number|number[]; // default: 0
		spread?:number|number[]; // default: 0
		randomise?:boolean; // default: false
	}

	export interface Angle
	{
		value?:number|number[]; // default: 1
		spread?:number|number[]; // default: 0
		randomise?:boolean; // default: false
	}

	export interface Rotation
	{
		axis?: THREE.Vector3; // default: THREE.Vector3(0, 1, 0)
		axisSpread?: THREE.Vector3;
		angle?:number; // default: 0
		angleSpread?:number; // default: 0
		static?:boolean; // default: false
		center?: THREE.Vector3;
		randomise?:boolean; // default: false
	}

	export interface EmitterSettings
	{
		distribution: SPE.Distribution; // default: BOX
		duration?:number; // default: null (endless)
		isStatic?:number; // default: 0
		activeMultiplier?:number; // default: 1
		direction?:number; // default: 1
		maxAge: SPE.MaxAge;
		position: SPE.Position;
		velocity: SPE.Velocity;
		acceleration: SPE.Acceleration;
		drag: SPE.Drag;
		wiggle: SPE.Wiggle;
		rotation: SPE.Rotation;
		color: SPE.Color;
		opacity: SPE.Opacity;
		size: SPE.Size;
		angle: SPE.Angle;
		particleCount?:number; // default: 100
		alive?:boolean // default: true
	}

	class Group
	{
		constructor(options: GroupOptions);

		addEmitter(particleEmitter: Emitter): Group;

		removeEmitter(emitter);

		getFromPool(): Emitter;

		releaseIntoPool(emitter: Emitter): Group;

		addPool(numEmitters:number, emitterSettings: EmitterSettings, createNew:boolean): Group;

		triggerPoolEmitter(numEmitters:number, position: THREE.Vector3): Group;

		tick(dt:number);

		mesh: THREE.Mesh;
	}

	class Emitter
	{
		constructor(options: EmitterSettings);

		tick();

		reset(force:boolean);

		enable();

		disable();

		alive:boolean;
		uuid:number;
		particleCount:number;
		duration:number;
		isStatic:boolean;
		activeMultiplier:number;
		direction:number;
		particlesPerSecond:number;
		activationIndex:number;
		attributeOffset:number;
		attributeEnd:number;
		age:number;
		activeParticleCount:number;
		group: SPE.Group;
	}
}
