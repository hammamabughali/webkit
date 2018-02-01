// Type definitions for howler.js v2.0.0-beta12
// Project:https://github.com/goldfire/howler.js

declare class HowlerGlobal
{
	mute(muted:boolean):HowlerGlobal;
	volume():number;
	volume(volume:number):HowlerGlobal;
	unload();
	codecs(extension:string):boolean;

	masterGain:GainNode;
	noAudio:boolean;
	usingWebAudio:boolean;
	autoSuspend:boolean;
	ctx:AudioContext;
	mobileAutoEnable:boolean;
}

declare var Howler:HowlerGlobal;

interface IHowlSoundSpriteDefinition
{
	[name:string]:number[];
}

interface IHowlProperties
{
	autoplay?:boolean;
	buffer?:boolean;
	format?:string;
	loop?:boolean;
	sprite?:IHowlSoundSpriteDefinition;
	volume?:number;
	src?:string[];
	onend?:Function;
	onload?:Function;
	onloaderror?:Function;
	onpause?:Function;
	onplay?:Function;
	urls?:string[]
}

interface Howl
{
	_duration:number;
	_src:string;
	autoplay:boolean;
	buffer:boolean;
	format:string;
	rate:number;
	model:string;

	/*
		Listen for events. Multiple events can be added by calling this multiple times.
			@param event Name of event to fire/set (load, loaderror, play, end, pause, stop, mute, volume, rate, seek, fade).
		@param callback Define function to fire on event.
		@param id Only listen to events for this sound id.
	*/
	on(event:string, callback:(soundId:number) => void, id?:number):void;

	/*
		Same as on, but it removes itself after the callback is fired.
			@param event Name of event to fire/set (load, loaderror, play, end, pause, stop, mute, volume, rate, seek, fade).
		@param callback Define function to fire on event.
		@param id Only listen to events for this sound id.
	*/
	once(event:string, callback:(soundId:number) => void, id?:number):void;

	/*
		Remove event listener that you've set. Call without parameters to remove all events.
			@param event Name of event (load, loaderror, play, end, pause, stop, mute, volume, rate, seek, fade).
		@param callback The listener to remove. Omit this to remove all events of type.
		@param id Only remove events for this sound id.
	*/
	off(event:string, callback?:(soundId:number) => void, id?:number):void;
	onend:Function;
	onload:Function;
	onloaderror:Function;
	onpause:Function;
	onplay:Function;
	onfade :Function;
	load():Howl;
	play(sprite?:string, callback?:(soundId:number) => void):Howl;
	play(callback?:(soundId:number) => void):Howl;
	pause(soundId?:number):Howl;
	stop(soundId?:number):Howl;
	mute(muted?:boolean, soundId?:number):Howl;
	fade(from:number, to:number, duration:number, soundId?:number):Howl;
	loop():boolean;
	loop(loop:boolean):Howl;
	pos(position?:number, soundId?:number):number;
	seek(seek?:number, id?:number):number;
	pos3d(x:number, y:number, z:number, soundId?:number):any;
	sprite(definition?:IHowlSoundSpriteDefinition):IHowlSoundSpriteDefinition;
	volume():number;
	volume(volume?:number, soundId?:number):Howl;
	urls():string[];
	urls(urls:string[]):Howl;
	on(event:string, listener?:Function):Howl;
	off(event:string, listener?:Function):Howl;
	unload():void;
}

interface HowlStatic
{
	new (properties:IHowlProperties):Howl;
}

declare let Howl:HowlStatic;

declare module "howler"
{
	export let Howler:HowlerGlobal;
	export let Howl:HowlStatic;
}
