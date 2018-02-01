//# LOCALHOST
/// <reference path="../util/log.ts"/>
//# /LOCALHOST



module kr3m.mulproc
{
	export function getWorkerName(id:string):string
	{
		return "W" + ("00" + id).slice(-3);
	}



	export function adjustLog(useLogColors = true):void
	{
		var L = kr3m.util.Log;

		if (!useLogColors)
			L.disableColors();

		var colors =
		[
			L.BACKGROUND_DARK_GREY + L.COLOR_WHITE,
			L.BACKGROUND_DARK_RED + L.COLOR_WHITE,
			L.BACKGROUND_DARK_GREEN + L.COLOR_WHITE,
			L.BACKGROUND_DARK_BLUE + L.COLOR_WHITE,
			L.BACKGROUND_DARK_CYAN + L.COLOR_WHITE,
			L.BACKGROUND_DARK_MAGENTA + L.COLOR_WHITE,
			L.BACKGROUND_DARK_YELLOW + L.COLOR_WHITE
		];

		var prefix = clusterLib.worker
			? colors[clusterLib.worker.id % colors.length] + getWorkerName(clusterLib.worker.id) + L.COLOR_RESET
			: L.BACKGROUND_WHITE + L.COLOR_BLACK + "MSTR" + L.COLOR_RESET;
		var oldLog = console.log.bind(console);
		console.log = (...params:any[]) => oldLog(prefix, ...params);
		var oldError = console.error.bind(console);
		console.error = (...params:any[]) => oldError(prefix, ...params);
	}
}
