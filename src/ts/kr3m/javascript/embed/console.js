var __consoleLog = [];



function Console()
{
	this.log = function()
	{
		var args = Array.prototype.slice.call(arguments);
		for (var i = 0; i < args.length; ++i)
			args[i] = JSON.stringify(args[i]);
		var text = args.join(" ");
		__consoleLog.push({ type : "out", text : text});
	}

	this.error = function()
	{
		var args = Array.prototype.slice.call(arguments);
		for (var i = 0; i < args.length; ++i)
			args[i] = JSON.stringify(args[i]);
		var text = args.join(" ");
		__consoleLog.push({ type : "err", text : text});
	}
}



var console = new Console();
