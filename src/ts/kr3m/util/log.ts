/// <reference path="../util/json.ts"/>

//# !CLIENT
/// <reference path="../util/dates.ts"/>
//# /!CLIENT

//# IE8
//# CLIENT
/// <reference path="../util/browser.ts"/>
//# /CLIENT
//# /IE8



module kr3m.util
{
	export class Log
	{
		public static enabled = true;
//# !CLIENT
//# SERVER
		public static showTimestamps = true;
//# /SERVER
//# !SERVER
		public static showTimestamps = false;
//# /!SERVER
//# /!CLIENT

//# !CLIENT
		/*
			gute Übersicht über verfügbare Farben und Formatierungen:
				http://misc.flogisoft.com/bash/tip_colors_and_formatting
		*/
		public static COLOR_BLACK = "\x1b[30m";
		public static COLOR_BLUE = "\x1b[34m";
		public static COLOR_BRIGHT = "\x1b[1m";
		public static COLOR_BRIGHT_BLUE = "\x1b[94m";
		public static COLOR_BRIGHT_CYAN = "\x1b[96m";
		public static COLOR_BRIGHT_GREEN = "\x1b[92m";
		public static COLOR_BRIGHT_GREY = "\x1b[37m";
		public static COLOR_BRIGHT_MAGENTA = "\x1b[95m";
		public static COLOR_BRIGHT_PINK = "\x1b[95m";
		public static COLOR_BRIGHT_RED = "\x1b[91m";
		public static COLOR_BRIGHT_YELLOW = "\x1b[93m";
		public static COLOR_CYAN = "\x1b[36m";
		public static COLOR_DARK = "\x1b[2m";
		public static COLOR_DARK_BLUE = "\x1b[34m";
		public static COLOR_DARK_CYAN = "\x1b[36m";
		public static COLOR_DARK_GREEN = "\x1b[32m";
		public static COLOR_DARK_GREY = "\x1b[90m";
		public static COLOR_DARK_MAGENTA = "\x1b[35m";
		public static COLOR_DARK_PINK = "\x1b[35m";
		public static COLOR_DARK_RED = "\x1b[31m";
		public static COLOR_DARK_YELLOW = "\x1b[33m";
		public static COLOR_DEFAULT = "\x1b[39m";
		public static COLOR_GREEN = "\x1b[32m";
		public static COLOR_MAGENTA = "\x1b[35m";
		public static COLOR_PINK = "\x1b[35m";
		public static COLOR_RED = "\x1b[31m";
		public static COLOR_WHITE = "\x1b[97m";
		public static COLOR_YELLOW = "\x1b[33m";

		public static COLOR_RESET = "\x1b[0m";

		public static BACKGROUND_BLACK = "\x1b[40m";
		public static BACKGROUND_BRIGHT_BLUE = "\x1b[104m";
		public static BACKGROUND_BRIGHT_CYAN = "\x1b[106m";
		public static BACKGROUND_BRIGHT_GREEN = "\x1b[102m";
		public static BACKGROUND_BRIGHT_GREY = "\x1b[47m";
		public static BACKGROUND_BRIGHT_MAGENTA = "\x1b[105m";
		public static BACKGROUND_BRIGHT_RED = "\x1b[101m";
		public static BACKGROUND_BRIGHT_YELLOW = "\x1b[103m";
		public static BACKGROUND_DARK_BLUE = "\x1b[44m";
		public static BACKGROUND_DARK_CYAN = "\x1b[46m";
		public static BACKGROUND_DARK_GREEN = "\x1b[42m";
		public static BACKGROUND_DARK_GREY = "\x1b[100m";
		public static BACKGROUND_DARK_MAGENTA = "\x1b[45m";
		public static BACKGROUND_DARK_RED = "\x1b[41m";
		public static BACKGROUND_DARK_YELLOW = "\x1b[43m";
		public static BACKGROUND_DEFAULT = "\x1b[49m";
		public static BACKGROUND_WHITE = "\x1b[107m";
//# /!CLIENT



//# !CLIENT
		public static disableColors():void
		{
			var p = /^COLOR_|BACKGROUND_/;
			for (var field in Log)
			{
				if (p.test(field))
					Log[field] = "";
			}
		}
//# /!CLIENT



//# CLIENT
		public static logError(...values:any[]):void
		{
			if (!Log.enabled || typeof console == "undefined" || typeof console.error == "undefined")
				return;
//# IE8
			if (Browser.isOldBrowser())
			{
				for (var i = 0; i < values.length; ++i)
				{
					if (typeof values[i] == "object" && !(values[i] instanceof Error))
						values[i] = Json.encode(values[i], true);
				}
				console.error(values.join(" "));
				return;
			}
//# /IE8
//# !APP
			if (values.length == 1 && values[0] instanceof Error)
			{
				if (typeof values[0].stack != "undefined" && typeof window["chrome"] == "undefined")
					throw values[0].stack;
				else
					throw values[0];
			}
			else
			{
				try
				{
					console.error.apply(console, values);
				}
				catch(e)
				{
					console.error(values);
				}
			}
//# /!APP
//# APP
			alert(values + "\n\n" + Log.stackTrace(false, 2));
//# /APP
		}
//# /CLIENT



//# !CLIENT
		public static logError(...values:any[]):void
		{
			if (!Log.enabled)
				return;

			for (var i = 0; i < values.length; ++i)
			{
				if (typeof values[i] == "object" && !(values[i] instanceof Error))
					values[i] = Json.encode(values[i], true);
			}

			if (Log.showTimestamps)
				values.unshift(Log.COLOR_BRIGHT_RED + Dates.getNow(false));
			else
				values[0] = Log.COLOR_BRIGHT_RED + values[0];

			values.push(Log.COLOR_RESET);
			console.error.apply(console, values);
		}
//# /!CLIENT



//# PROFILING
//# !CLIENT
		public static logProfiling(...values:any[]):void
		{
			if (!Log.enabled)
				return;

			for (var i = 0; i < values.length; ++i)
			{
				if (typeof values[i] == "object" && !(values[i] instanceof Error))
					values[i] = Json.encode(values[i], true);
			}

			if (Log.showTimestamps)
				values.unshift(Log.COLOR_BRIGHT_PINK + Dates.getNow(false));
			else
				values[0] = Log.COLOR_BRIGHT_PINK + values[0];

			values.push(Log.COLOR_RESET);
			console.error.apply(console, values);
		}
//# /!CLIENT
//# /PROFILING



//# PROFILING
//# !CLIENT
		public static logProfilingLow(...values:any[]):void
		{
			if (!Log.enabled)
				return;

			for (var i = 0; i < values.length; ++i)
			{
				if (typeof values[i] == "object" && !(values[i] instanceof Error))
					values[i] = Json.encode(values[i], true);
			}

			if (Log.showTimestamps)
				values.unshift(Log.COLOR_DARK_PINK + Dates.getNow(false));
			else
				values[0] = Log.COLOR_DARK_PINK + values[0];

			values.push(Log.COLOR_RESET);
			console.error.apply(console, values);
		}
//# /!CLIENT
//# /PROFILING



//# !CLIENT
		public static log(...values:any[]):void
		{
			//# TODO: why are strings sometimes put in apostrophes (when they're not at position 0)?
			if (!Log.enabled)
				return;

			for (var i = 0; i < values.length; ++i)
			{
				if (typeof values[i] == "object")
					values[i] = Json.encode(values[i], true);
			}

			if (Log.showTimestamps)
				values.unshift(Dates.getNow(false));

			console.log.apply(console, values);
		}
//# /!CLIENT



//# CLIENT
		public static log(...values:any[]):void
		{
			if (!Log.enabled || typeof console == "undefined" || typeof console.log == "undefined")
				return;

//# IE8
			if (Browser.isOldBrowser())
			{
				for (var i = 0; i < values.length; ++i)
				{
					if (typeof values[i] == "object")
						values[i] = Json.encode(values[i], true);
				}
				console.log(values.join(" "));
				return;
			}
//# /IE8
			try
			{
				console.log.apply(console, values);
			}
			catch(e)
			{
				console.log(values);
			}
		}
//# /CLIENT



//# CLIENT
		public static logWarning(...values:any[]):void
		{
			if (!Log.enabled || typeof console == "undefined" || typeof console.warn == "undefined")
				return;
//# IE8
			if (Browser.isOldBrowser())
			{
				for (var i = 0; i < values.length; ++i)
				{
					if (typeof values[i] == "object" && !(values[i] instanceof Error))
						values[i] = Json.encode(values[i], true);
				}
				console.warn(values.join(" "));
				return;
			}
//# /IE8
//# !APP
			if (values.length == 1 && values[0] instanceof Error)
			{
				if (typeof values[0].stack != "undefined" && typeof window["chrome"] == "undefined")
					throw values[0].stack;
				else
					throw values[0];
			}
			else
			{
				try
				{
					console.warn.apply(console, values);
				}
				catch(e)
				{
					console.warn(values);
				}
			}
//# /!APP
//# APP
			alert(values + "\n\n" + Log.stackTrace(false, 2));
//# /APP
		}
//# /CLIENT



//# !CLIENT
		public static logWarning(...values:any[]):void
		{
			if (!Log.enabled)
				return;

			for (var i = 0; i < values.length; ++i)
			{
				if (typeof values[i] == "object" && !(values[i] instanceof Error))
					values[i] = Json.encode(values[i], true);
			}

			if (Log.showTimestamps)
				values.unshift(Log.COLOR_BRIGHT_YELLOW + Dates.getNow(false));
			else
				values[0] = Log.COLOR_BRIGHT_YELLOW + values[0];

			values.push(Log.COLOR_RESET);
			console.log.apply(console, values);
		}
//# /!CLIENT



		/*
			Prinzipiell das gleiche wie log() aber die Ausgabe
			wird niemals in RELEASE Builds angezeigt.
		*/
		public static logDebug(...values:any[]):void
		{
//# !RELEASE
			Log.log.apply(null, values);
//# /!RELEASE
		}



		/*
			Prinzipiell das gleiche wie log() aber die Ausgabe
			wird nur angezeigt wenn das VERBOSE Flak gesetzt ist.
		*/
		public static logVerbose(...values:any[]):void
		{
//# VERBOSE
			Log.log.apply(null, values);
//# /VERBOSE
		}



		/*
			Prinzipiell das gleiche wie log(), wandelt aber immer
			alles Werte in JSON um. Das soll verhindern, dass man
			in der Konsole falsche Werte angezeigt bekommt weil die
			Browser nur Referenzen und keine Snapshots speichern.
			Außerdem werden Ausgaben von dump niemals in RELEASE
			Builds angezeigt.
		*/
		public static dump(...values:any[]):void
		{
//# !RELEASE
			if (!Log.enabled || typeof console == "undefined" || typeof console.log == "undefined")
				return;

			for (var i = 0; i < values.length; ++i)
			{
				if (typeof values[i] == "object")
					values[i] = Json.encode(values[i], true);
			}
			Log.log.apply(null, values);
//# /!RELEASE
		}



		public static stackTrace(
			asError = false,
			skipLines = 0):string
		{
			var e = new Error();
			var stack = e["stack"].split(/\s+at\s+/).slice(skipLines + 1);
			return stack.join("\n");
		}



		public static logStackTrace(
			asError = false,
			skipLines = 0):void
		{
//# !CLIENT
			var prefix = asError ? Log.COLOR_BRIGHT_RED : "";
			var suffix = asError ? Log.COLOR_RESET : "";
			Log.log(prefix + Log.stackTrace(asError) + suffix);
//# /!CLIENT
//# CLIENT
			Log.log(Log.stackTrace(asError));
//# /CLIENT
		}
	}
}



/*
	Bequemlichkeitsfunktion um nicht immer kr3m.util.Log.log schreiben zu müssen.
*/
//# !HIDE_GLOBAL
function log(...values:any[]):void
{
	kr3m.util.Log.log.apply(null, values);
}
//# /!HIDE_GLOBAL



/*
	Bequemlichkeitsfunktion um nicht immer kr3m.util.Log.logDebug schreiben zu müssen.
*/
//# !HIDE_GLOBAL
function logDebug(...values:any[]):void
{
//# !RELEASE
	kr3m.util.Log.logDebug.apply(null, values);
//# /!RELEASE
}
//# /!HIDE_GLOBAL



/*
	Bequemlichkeitsfunktion um nicht immer kr3m.util.Log.logVerbose schreiben zu müssen.
*/
//# !HIDE_GLOBAL
function logVerbose(...values:any[]):void
{
//# VERBOSE
	kr3m.util.Log.logVerbose.apply(null, values);
//# /VERBOSE
}
//# /!HIDE_GLOBAL



/*
	Bequemlichkeitsfunktion um nicht immer kr3m.util.Log.dump schreiben zu müssen.
*/
//# !HIDE_GLOBAL
function dump(...values:any[]):void
{
	kr3m.util.Log.dump.apply(null, values);
}
//# /!HIDE_GLOBAL



/*
	Bequemlichkeitsfunktion um nicht immer kr3m.util.Log.logError schreiben zu müssen.
*/
//# !HIDE_GLOBAL
function logError(...values:any[]):void
{
	kr3m.util.Log.logError.apply(null, values);
}
//# /!HIDE_GLOBAL



//# !CLIENT
function logProfiling(...values:any[]):void
{
//# PROFILING
	kr3m.util.Log.logProfiling.apply(null, values);
//# /PROFILING
}
//# /!CLIENT



/*
	Bequemlichkeitsfunktion um nicht immer kr3m.util.Log.logWarning schreiben zu müssen.
*/
//# !HIDE_GLOBAL
function logWarning(...values:any[]):void
{
	kr3m.util.Log.logWarning.apply(null, values);
}
//# /!HIDE_GLOBAL



//# !CLIENT
function logProfilingLow(...values:any[]):void
{
//# PROFILING
	kr3m.util.Log.logProfilingLow.apply(null, values);
//# /PROFILING
}
//# /!CLIENT



//# !HIDE_GLOBAL
function logFunc(functionName:any, ...params:any[]):void
{
	var text = functionName + "(";
	for (var i = 0; i < params.length; ++i)
		params[i] = kr3m.util.Json.encode(params[i], true);
	text += params.join(", ") + ")";
	kr3m.util.Log.log(text);
}
//# /!HIDE_GLOBAL
