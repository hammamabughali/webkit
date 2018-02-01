/// <reference path="../lib/node.ts"/>

var osLib = require("os");



module kr3m
{
	export var PLATFORM_LINUX = "linux";
	export var PLATFORM_WINDOWS = "win32";

	var cpuUsageAtStartup = osLib.cpus();
	var cpuUsageLastCall = cpuUsageAtStartup;



	/*
		Gibt die Auslastung der einzelnen CPUs des Rechners
		zurück. Für jede CPU wird ein Wert zwischen 0 und 1
		zurück gegeben. Ist sinceLastCall true, wird die Auslastung
		seit dem letzten Aufruf von getCpuUsage als Grundlage
		verwendet. Ist sinceLastCall false, wird die Auslastung
		seit Programmstart als Grundlage verwendet.
	*/
	export function getCpuUsage(sinceLastCall:boolean = false):number[]
	{
		var cpus = osLib.cpus();
		var usage:number[] = [];
		var base = sinceLastCall ? cpuUsageLastCall : cpuUsageAtStartup;
		for (var i = 0; i < cpus.length; ++i)
		{
			var idle = cpus[i].times.idle - base[i].times.idle;
			var total = 0;
			for (var j in cpus[i].times)
				total += cpus[i].times[j] - base[i].times[j];

			var use = total == 0 ? 0 : 1 - (idle / total);
			usage.push(use);
		}
		cpuUsageLastCall = cpus;
		return usage;
	}
}
