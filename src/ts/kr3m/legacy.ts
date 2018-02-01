/*
	Checks for existance of all common javascript methods so
	and uses polyfill to create substitudes if they're missing.
	This is usually only required in older browsers or any
	Microsoft stuff.
*/



//# CLIENT
// Function.bind()
if (!Function.prototype.bind)
{
	Function.prototype.bind = function (oThis)
	{
		if (typeof this !== "function")
			throw new TypeError("Function.prototype.bind could not be set on legacy browser");

		var aArgs = Array.prototype.slice.call(arguments, 1);
		var fToBind = this;
		var fNOP = function() {};
		var fBound = function()
		{
			return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
		};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();
		return fBound;
	};
}



// Array.isArray
if (!Array.isArray)
{
	Array.isArray = <any> function(arg)
	{
		return Object.prototype.toString.call(arg) === "[object Array]";
	};
}



// Array.indexOf()
if (!Array.prototype.indexOf)
{
	Array.prototype.indexOf = function(searchElement, fromIndex)
	{
		var k;
		if (this == null)
			throw new TypeError('"this" is null or not defined');

		var O = Object(this);
		var len = O.length >>> 0;
		if (len === 0)
			return -1;

		var n = +fromIndex || 0;
		if (Math.abs(n) === Infinity)
			n = 0;

		if (n >= len)
			return -1;

		k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

		while (k < len)
		{
			if (k in O && O[k] === searchElement)
				return k;
			k++;
		}
		return -1;
	};
}



// Array.forEach()
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Polyfill
if (!Array.prototype.forEach)
{
	Array.prototype.forEach = <any> function(callback, thisArg)
	{
		var T, k;
		if (this == null)
			throw new TypeError(" this is null or not defined");

		var O = Object(this);
		var len = O.length >>> 0;
		if (typeof callback !== "function")
			throw new TypeError(callback + " is not a function");

		if (arguments.length > 1)
			T = thisArg;

		k = 0;
		while (k < len)
		{
			var kValue;
			if (k in O)
			{
				kValue = O[k];
				callback.call(T, kValue, k, O);
			}
			k++;
		}
	};
}



// Array.find
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
if (!Array.prototype["find"])
{
	Object.defineProperty(Array.prototype, "find",
	{
		value: function(predicate)
		{
			if (this == null)
				throw new TypeError("this is null or not defined");

			var o = Object(this);
			var len = o.length >>> 0;
			if (typeof predicate !== "function")
				throw new TypeError("predicate must be a function");

			var thisArg = arguments[1];
			var k = 0;
			while (k < len)
			{
				var kValue = o[k];
				if (predicate.call(thisArg, kValue, k, o))
					return kValue;
				k++;
			}
			return undefined;
		}
	});
}



// Array.findIndex
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
if (!Array.prototype["findIndex"])
{
	Object.defineProperty(Array.prototype, "findIndex",
	{
		value : function(predicate)
		{
			if (this == null)
				throw new TypeError("this is null or not defined");

			var o = Object(this);
			var len = o.length >>> 0;
			if (typeof predicate !== "function")
				throw new TypeError("predicate must be a function");

			var thisArg = arguments[1];
			var k = 0;
			while (k < len)
			{
				var kValue = o[k];
				if (predicate.call(thisArg, kValue, k, o))
					return k;
				++k;
			}
			return -1;
		}
	});
}



// Array.filter
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
if (!Array.prototype.filter)
{
	Array.prototype.filter = function(fun)
	{
		'use strict';
		if (this === void 0 || this === null)
			throw new TypeError();

		var t = Object(this);
		var len = t.length >>> 0;
		if (typeof fun !== "function")
			throw new TypeError();

		var res = [];
		var thisArg = arguments.length >= 2 ? arguments[1] :void 0;
		for (var i = 0; i < len; i++)
		{
			if (i in t)
			{
				var val = t[i];
				if (fun.call(thisArg, val, i, t))
					res.push(val);
			}
		}
		return res;
	};
}



// Object.create
if (typeof Object.create != 'function')
{
	Object.create = (function()
	{
		var Temp = function() {};
		return function (prototype)
		{
			if (arguments.length > 1)
				throw Error('Second argument not supported');
			if (typeof prototype != 'object')
				throw TypeError('Argument must be an object');
			Temp.prototype = prototype;
			var result = new Temp();
			Temp.prototype = null;
			return result;
		};
	})();
}



// Object.keys()
if (!Object.keys)
{
	Object.keys = (function()
	{
		'use strict';
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		var hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString');
		var dontEnums =
		[
			'toString',
			'toLocaleString',
			'valueOf',
			'hasOwnProperty',
			'isPrototypeOf',
			'propertyIsEnumerable',
			'constructor'
		];
		var dontEnumsLength = dontEnums.length;

		return function(obj)
		{
			if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null))
				throw new TypeError('Object.keys called on non-object');

			var result = [];
			for (var prop in obj)
			{
				if (hasOwnProperty.call(obj, prop))
					result.push(prop);
			}

			if (hasDontEnumBug)
			{
				for (var i = 0; i < dontEnumsLength; ++i)
				{
					if (hasOwnProperty.call(obj, dontEnums[i]))
						result.push(dontEnums[i]);
				}
			}
			return result;
		};
	}());
}



// ChildNode.remove
if (typeof Element !== "undefined" && !("remove" in Element.prototype))
{
	Element.prototype.remove = function()
	{
		if (this.parentNode)
			this.parentNode.removeChild(this);
	};
}
//# /CLIENT
