declare module ads.vo
{
	class PlayerSettings
	{
		muted:boolean;
		autoplay:boolean;
		formats:string[];
		skippable:boolean;
		locale:string;
		debug:boolean;
		allowedPlayer:string[];// ignored on 2nd run (except if PLAYER_NOADS was first)
		is2ndAttempt:boolean;
		firstAttemptError:string; //why NOADS player has been forced? Error text or null
		overrideURL:string|string[];
		defaultTime:number;
		playerParentElement:any;
		displayInterval:number;// 0 means use default value from Ads Server
		suppressErrorMessages:boolean;
		preloadOnly:boolean;

		static FORMAT_OGG:string;
		static FORMAT_WEBM:string;
		static FORMAT_MP4:string;

		static PLAYER_NOADS:string;
		static PLAYER_IMA:string;
		static PLAYER_FLASH:string;// not supported at the moment
	}
}



﻿declare module ads
{
	class Client
	{
		getVersion():string;
		inject(slotId:string):void;
		setCallbacks(onPauseContext:() => void, onResumeContext:() => void):void;
		preload(slotId:string, settings?:ads.vo.PlayerSettings):void
		showOverlay(slotId:string, settings?:ads.vo.PlayerSettings, callback?: () => void):void;
	}
}

declare var kr3mAdClient:ads.Client;
