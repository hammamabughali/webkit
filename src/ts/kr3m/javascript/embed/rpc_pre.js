var __rpc = {id : 0, pending : []};



function __cbFunc(functionName, forceCallback)
{
	var params = Array.prototype.slice.call(arguments, 2);
	var callbacks = [];
	var callbackOffsets = [];
	for (var i = 0; i < params.length; ++i)
	{
		if (typeof params[i] == "function")
		{
			callbacks.push(params[i]);
			callbackOffsets.push(i);
			params[i] = null;
		}
	}
	__rpc.pending.push(
	{
		id : ++__rpc.id,
		functionName : functionName,
		forceCallback : forceCallback,
		callbacks : callbacks,
		callbackOffsets : callbackOffsets,
		params : params
	});
}



function __rpcCb(id, cbi, responses)
{
	for (var i = 0; i < __rpc.pending.length; ++i)
	{
		if (__rpc.pending[i].id == id)
		{
			var p = __rpc.pending[i];
			__rpc.pending.splice(i, 1);

			if (cbi > -1 && cbi < p.callbacks.length)
				p.callbacks[cbi].apply(null, responses);

			return;
		}
	}
}
