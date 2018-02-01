/// <reference path="../src/ts/kr3m/lib/node.ts"/>
/// <reference path="../src/ts/kr3m/util/log.ts"/>
/// <reference path="../src/ts/kr3m/util/util.ts"/>
/// <reference path="../src/ts/kr3m/async/loop.ts"/>

log("start ");

var count = 0;
kr3m.async.Loop.loop((next)=>{

	log(count);
	count++;
    if(count <= 10)
    {
        next(true);
    }
    else
        next(false);

},()=>
{
    log("fertig");
});
