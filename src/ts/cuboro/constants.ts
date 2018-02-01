/// <reference path="version.ts"/>



module cuboro
{
//# CLIENT
	export const DEFAULT_FONT: string = "avenir";
	export const DEFAULT_FONT_HEAVY: string = "avenir-heavy";

	export const COLOR_YELLOW: number = 0xfecc00;
	export const COLOR_GREEN: number = 0x00aa00;
	export const COLOR_DARK_GREY: number = 0x1d1d1b;
	export const COLOR_GREY: number = 0xaaaaaa;
	export const COLOR_MID_GREY: number = 0xcdcdcd;
	export const COLOR_LIGHT_GREY: number = 0xf0f0f0;
	export const COLOR_RED: number = 0xcc0000;
	export const COLOR_WHITE: number = 0xffffff;
	export const COLOR_FB_BLUE: number = 0x3b5998;

	export const CAMERA_UPDATE: string = "cameraUpdate";
	export const CAMERA_UPDATED: string = "cameraUpdated";
	export const CUBE_UPDATE: string = "cubeUpdate";
	export const CUBE_SELECTED: string = "cubeSelected";
	export const CUBE_DESELECTED: string = "cubeDeselected";
	export const PLAYGROUND_READY: string = "playgroundReady";

	export const DEG_RAD_90: number = 1.5707963268;

	export const EMPTY: string = "0";

	export const PADDING: number = 5;

	export const LEFT_MENU_CHANGE: string = "leftMenuChange";
	export const RIGHT_MENU_CHANGE: string = "rightMenuChange";

	export const MARBLE_SKIP_THRESHOLD = 0.3;
	export const MARBLE_DEATH_SLOW_FACTOR = 0.99;
	export const MARBLE_DROP_HEIGHT_DEFAULT = "LOW";
	export const MARBLE_DROP_HEIGHTS =
		{
			LOW: -0.75,
			MEDIUM: -0.5,
			HIGH: 0
		};
	export const HISTORY =
	{
		CURRENT: "current",
		PREDECESSOR: "predecessor",
		SUCCESSOR: "successor"
	};
	export const MAX_X: number = 12;
	export const MAX_Y: number = 9;
	export const MAX_Z: number = 12;

	export const SETS =
		{
			BASIC: "basic",
			BUILD: "build",
			DUO: "duo",
			PROFI: "profi",
			METRO: "metro",
			PLUS: "plus",
			MULTI: "multi",
			SIXPACK_DUO: "sixpack_duo",
			SIXPACK_PROFI: "sixpack_profi",
			SIXPACK_METRO: "sixpack_metro",
			SIXPACK_PLUS: "sixpack_plus",
			SIXPACK_MULTI: "sixpack_multi",
			STANDARD: "standard"
		};
	export const START_CUBES: string[] = ["cube_11", "cube_12", "cube_21", "cube_22", "cube_31", "cube_41", "cube_42", "cube_51", "cube_61", "cube_71", "cube_92"];
	export const SWAP: string = "swap";
	export const TIMESTEP: number = 1 / 120;

	export const TEXT_STYLE_BUTTON_CHECKBOX: PIXI.TextStyle = new PIXI.TextStyle(
		{
			fontFamily: cuboro.DEFAULT_FONT,
			fontSize: 11,
			lineHeight: 12,
			fill: cuboro.COLOR_DARK_GREY
		});

	export const TEXT_STYLE_BUTTON_ICON: PIXI.TextStyle = new PIXI.TextStyle(
		{
			fontFamily: cuboro.DEFAULT_FONT,
			fontSize: 11,
			align: gf.CENTER,
			lineHeight: 11,
			wordWrap: true,
			fill: cuboro.COLOR_DARK_GREY
		});

	export const TEXT_STYLE_BUTTON_CUBE: PIXI.TextStyle = new PIXI.TextStyle(
		{
			fontFamily: cuboro.DEFAULT_FONT,
			fontSize: 13,
			fill: cuboro.COLOR_DARK_GREY
		});

	export const TEXT_STYLE_BUTTON_TEXT: PIXI.TextStyle = new PIXI.TextStyle(
		{
			fontFamily: cuboro.DEFAULT_FONT,
			fontSize: 13,
			fill: cuboro.COLOR_DARK_GREY
		});

	export const TEXT_STYLE_BUTTON_FOOTER: PIXI.TextStyle = new PIXI.TextStyle(
		{
			fontFamily: cuboro.DEFAULT_FONT,
			fontSize: 10,
			fill: cuboro.COLOR_DARK_GREY
		});

	export const TEXT_STYLE_BUTTON_TAB: PIXI.TextStyle = new PIXI.TextStyle(
		{
			fontFamily: cuboro.DEFAULT_FONT,
			fontSize: 20,
			fill: cuboro.COLOR_DARK_GREY
		});

	export const TEXT_STYLE_BUTTON_TAB_SELECTED: PIXI.TextStyle = new PIXI.TextStyle(
		{
			fontFamily: cuboro.DEFAULT_FONT_HEAVY,
			fontSize: 20,
			fill: cuboro.COLOR_DARK_GREY
		});

	export const TEXT_STYLE_INPUT_ERROR: PIXI.TextStyle = new PIXI.TextStyle(
		{
			fontFamily: cuboro.DEFAULT_FONT,
			fontSize: 10,
			fill: cuboro.COLOR_RED,
			wordWrap: true
		});

	export const TEXT_STYLE_INPUT_SUCCESS: PIXI.TextStyle = new PIXI.TextStyle(
		{
			fontFamily: cuboro.DEFAULT_FONT,
			fontSize: 10,
			fill: cuboro.COLOR_GREEN,
			wordWrap: true
		});

	export const TEXT_STYLE_LAYER: PIXI.TextStyle = new PIXI.TextStyle(
		{
			align: gf.CENTER,
			fontFamily: cuboro.DEFAULT_FONT,
			fontSize: 96,
			fill: cuboro.COLOR_DARK_GREY
		});

	export const TEXT_STYLE_LOADER: PIXI.TextStyle = new PIXI.TextStyle(
		{
			fontFamily: cuboro.DEFAULT_FONT,
			fontSize: 18,
			fill: cuboro.COLOR_DARK_GREY
		});

	export const TEXT_STYLE_SMALL: PIXI.TextStyle = new PIXI.TextStyle(
		{
			fontFamily: cuboro.DEFAULT_FONT,
			fontSize: 13,
			fill: cuboro.COLOR_DARK_GREY
		});

	export const TEXT_STYLE_SMALL_HEAVY: PIXI.TextStyle = new PIXI.TextStyle(
		{
			fontFamily: cuboro.DEFAULT_FONT_HEAVY,
			fontSize: 13,
			fill: cuboro.COLOR_DARK_GREY
		});

	export const TEXT_STYLE_TITLE: PIXI.TextStyle = new PIXI.TextStyle(
		{
			fontFamily: cuboro.DEFAULT_FONT,
			fontSize: 42,
			fill: cuboro.COLOR_DARK_GREY
		});

	export const TEXT_STYLE_TITLE_RIGHT_MENU_TAB: PIXI.TextStyle = new PIXI.TextStyle(
		{
			fontFamily: cuboro.DEFAULT_FONT,
			fontSize: 42,
			fill: cuboro.COLOR_DARK_GREY
		});

	export const TEXT_STYLE_TITLE_HINT: PIXI.TextStyle = new PIXI.TextStyle(
		{
			fontFamily: cuboro.DEFAULT_FONT,
			fontSize: 20,
			fill: cuboro.COLOR_DARK_GREY
		});

	export const TEXT_STYLE_TITLE_TAB: PIXI.TextStyle = new PIXI.TextStyle(
		{
			fontFamily: cuboro.DEFAULT_FONT_HEAVY,
			fontSize: 20,
			fill: cuboro.COLOR_DARK_GREY
		});

	export const TEXT_STYLE_DEFAULT: PIXI.TextStyle = new PIXI.TextStyle(
		{
			fontFamily: cuboro.DEFAULT_FONT,
			fontSize: 15,
			fill: cuboro.COLOR_DARK_GREY
		});

	export const TEXT_STYLE_DEFAULT_HEAVY: PIXI.TextStyle = new PIXI.TextStyle(
		{
			fontFamily: cuboro.DEFAULT_FONT_HEAVY,
			fontSize: 15,
			fill: cuboro.COLOR_DARK_GREY
		});

	export const TEXT_STYLE_PACKSHOT: PIXI.TextStyle = new PIXI.TextStyle(
		{
			fontFamily: cuboro.DEFAULT_FONT_HEAVY,
			fontSize: 15,
			fill: cuboro.COLOR_DARK_GREY,
			lineHeight: 14
		});

	export const TEXT_STYLE_VERSION: PIXI.TextStyle = new PIXI.TextStyle(
		{
			fontFamily: cuboro.DEFAULT_FONT,
			fontSize: 10,
			fill: cuboro.COLOR_DARK_GREY
		});
//# /CLIENT

	export const RATING_VALUES = [1, 2, 3, 4, 5];
	export const RATING_THRESHOLD = 10;

	export const ERROR_IS_NOT_TRACK_OWNER = "ERROR_IS_NOT_TRACK_OWNER";
	export const ERROR_TRACK_IS_PUBLISHED = "ERROR_TRACK_IS_PUBLISHED";
	export const ERROR_TRACK_NAME_NOT_OVERWRITTEN = "ERROR_TRACK_NAME_NOT_OVERWRITTEN";
	export const ERROR_CANT_RATE_OWN_TRACKS = "ERROR_CANT_RATE_OWN_TRACKS";
}
