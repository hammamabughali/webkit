declare module google.ima
{
	class Ad
	{
		getDescription():string;
		getTitle():string;
		getDuration():number;
		getMinSuggestedDuration():number;
		getWidth():number;
		getHeight():number;
		getContentType():string;
		getUiElements():string[];
		isLinear():boolean;
	}

	class AdDisplayContainer
	{
		constructor(adContainer:HTMLElement, fallbackVideoContainer?:HTMLElement);
		initialize():void;
	}

	class ImaSdkSettings
	{
		static VpaidMode :
		{
			DISABLED:string;
			ENABLED:string;
			INSECURE:string;
		}

		getNumRedirects():number;
		setNumRedirects(value:number):void;
		setVpaidMode(vpaidMode:string);
		setLocale(locale:string);
	}

	class AdsLoader
	{
		constructor(adDisplayContainer:AdDisplayContainer);
		addEventListener(eventName:string, callback:Function, bubble?:boolean):void;
		requestAds(adsRequest:AdsRequest):void;
		getSettings():ImaSdkSettings;
		destroy():void;
	}

	class AdsRenderingSettings
	{
		AUTO_SCALE:number;
		autoAlign:boolean;
		bitrate:number;
		enablePreloading:boolean;
		loadVideoTimeout:number;
		mimeTypes:string[];
		playAdsAfterTime:any;
		restoreCustomPlaybackStateOnAdBreakComplete:any;
		uiElements:string[];
		useShareButton:boolean;
		useStyledLinearAds:any;
		useStyledNonLinearAds:boolean;
	}

	class ViewMode
	{
		static NORMAL:string;
		static FULLSCREEN:string;
	}

	class AdEvent
	{
		static Type :
		{
			AD_BREAK_READY:string;
			AD_METADATA:string;
			ALL_ADS_COMPLETED:string;
			CLICK:string;
			COMPLETE:string;
			CONTENT_PAUSE_REQUESTED:string;
			CONTENT_RESUME_REQUESTED:string;
			DURATION_CHANGE:string;
			FIRST_QUARTILE:string;
			IMPRESSION:string;
			LINEAR_CHANGED:string;
			LOADED:string;
			LOG:string;
			MIDPOINT:string;
			PAUSED:string;
			RESUMED:string;
			SKIPPABLE_STATE_CHANGED:string;
			SKIPPED:string;
			STARTED:string;
			THIRD_QUARTILE:string;
			USER_CLOSE:string;
			VOLUME_CHANGED:string;
			VOLUME_MUTED:string;
		}

		getAd():Ad;
	}

	class AdsManager
	{
		addEventListener(eventName:string, callback:Function, bubble?:boolean):void;
		init(width:number, height:number, viewMode:string):void;
		resize(width:number, height:number, viewMode:string):void;
		start():void;
		pause():void;
		resume():void;
		stop():void;
		skip():void;
		destroy():void;
		setVolume(number):void;
		getVolume():number;
		getRemainingTime():number;
		getAdSkippableState():boolean;
	}

	class AdsManagerLoadedEvent
	{
		static Type :
		{
			ADS_MANAGER_LOADED:string;
		}

		getAdsManager(timeTracker: { currentTime:number }, settings?: AdsRenderingSettings): AdsManager;
	}

	export const enum IMAErrorCode
	{
		VAST_MALFORMED_RESPONSE = 100,
		UNKNOWN_AD_RESPONSE = 200,
		VAST_LOAD_TIMEOUT = 301,
		VAST_TOO_MANY_REDIRECTS = 302,
		VAST_INVALID_URL = 303,
		VIDEO_PLAY_ERROR = 400,
		VAST_MEDIA_LOAD_TIMEOUT = 402,
		VAST_LINEAR_ASSET_MISMATCH = 403,
		COMPANION_AD_LOADING_FAILED = 603,
		UNKNOWN_ERROR = 900,
		PLAYLIST_MALFORMED_RESPONSE = 1004,
		FAILED_TO_REQUEST_ADS = 1005,
		REQUIRED_LISTENERS_NOT_ADDED = 1006,
		VAST_ASSET_NOT_FOUND = 1007,
		ADSLOT_NOT_VISIBLE = 1008,
		VAST_EMPTY_RESPONSE = 1009,
		FAILED_LOADING_AD = 1010,
		NETWORK_ERROR = 1012,
		STREAM_INITIALIZATION_FAILED = 1020,
		INVALID_ARGUMENTS = 1101,
		API_ERROR = 1102,
		IOS_RUNTIME_TOO_OLD = 1103,
		VIDEO_ELEMENT_USED = 1201,
		VIDEO_ELEMENT_REQUIRED = 1202,
		CONTENT_PLAYHEAD_MISSING = 1205
		}

	class AdError
	{
		static Type :
		{
			AD_LOAD:string;
			AD_PLAY:string;
		}
		getErrorCode():number;
	}

	class AdErrorEvent
	{
		static Type :
		{
			AD_ERROR:string;
		}

		getError():AdError;
	}

	class AdsRequest
	{
		adTagUrl:string;
		linearAdSlotWidth:number|string;
		linearAdSlotHeight:number|string;
		nonLinearAdSlotWidth:number|string;
		nonLinearAdSlotHeight:number|string;
		adsResponse:string;
	}

	var settings:ImaSdkSettings;

	const VERSION:string;
}
