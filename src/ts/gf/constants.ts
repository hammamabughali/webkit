module gf
{
	export const RENDER_AUTO:number = 0;
	export const RENDER_CANVAS:number = 1;
	export const RENDER_WEBGL:number = 2;

	export const LEFT:string = "left";
	export const CENTER:string = "center";
	export const RIGHT:string = "right";
	export const TOP:string = "top";
	export const BOTTOM:string = "bottom";
	export const JUSTIFY:string = "justify";
	export const NONE:string = "none";
	export const CHANGE:string = "change";
	export const COMPLETE:string = "complete";

	export const HORIZONTAL:string = "horizontal";
	export const VERTICAL:string = "vertical";

	export const OVER:string = "over";
	export const OUT:string = "out";
	export const DOWN:string = "down";
	export const UP:string = "up";
	export const SELECTED:string = "selected";
	export const HIGHLIGHT:string = "highlight";

	export const ACCEPTED:string = "accepted";
	export const PENDING:string = "pending";
	export const SUCCESS:string = "success";

	export const RENDER_TYPE_DEFAULT:string = "default";
	export const RENDER_TYPE_ON_CHANGE:string = "onChange";

	export const REQUEST_EPISODE:string = "requestEpisode";
	export const REQUEST_LIVES:string = "requestLives";

	export const SOUND_FX:string = "fx";
	export const SOUND_MUSIC:string = "music";

	export const BLUR: string = "gameBlur";
	export const CLICK: string = "clickOrTap";
	export const DATA: string = "storageData";
	export const DISABLE: string = "disable";
	export const DRAG_CHANGE: string = "dragChange";
	export const DRAG_START: string = "dragStart";
	export const DRAG_STOP: string = "dragStop";
	export const ENABLE: string = "enable";
	export const FOCUS: string = "gameFocus";
	export const INITIALIZED: string = "initialized";
	export const LANDSCAPE: string = "landscape";
	export const LOAD_COMPLETE: string = "loadComplete";
	export const LOAD_ERROR: string = "loadError";
	export const LOAD_PROGRESS: string = "loadProgress";
	export const LOGIN: string = "login";
	export const LOGOUT: string = "logout";
	export const MUSIC_LOADED: string = "musicLoaded";
	export const PORTRAIT: string = "portrait";
	export const RESIZE: string = "resize";
	export const RUNNING: string = "running";
	export const SCREEN: string = "screen";
	export const TIMER: string = "timer";
	export const TIMER_COMPLETE: string = "timerComplete";
	export const TRANSITION_IN: string = "transitionIn";
	export const TRANSITION_IN_COMPLETE: string = "transitionInComplete";
	export const TRANSITION_OUT: string = "transitionOut";
	export const TRANSITION_OUT_COMPLETE: string = "transitionOutComplete";
	export const UPDATE: string = "update";

	export const VENDORS:string[] = ["ms", "moz", "webkit", "o", ""];
}
