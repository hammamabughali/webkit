var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var kr3m;
(function (kr3m) {
    kr3m.VERSION = "1.7.1.1";
})(kr3m || (kr3m = {}));
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function")
            throw new TypeError("Function.prototype.bind could not be set on legacy browser");
        var aArgs = Array.prototype.slice.call(arguments, 1);
        var fToBind = this;
        var fNOP = function () { };
        var fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}
if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === "[object Array]";
    };
}
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
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
        while (k < len) {
            if (k in O && O[k] === searchElement)
                return k;
            k++;
        }
        return -1;
    };
}
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback, thisArg) {
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
        while (k < len) {
            var kValue;
            if (k in O) {
                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
}
if (!Array.prototype["find"]) {
    Object.defineProperty(Array.prototype, "find", {
        value: function (predicate) {
            if (this == null)
                throw new TypeError("this is null or not defined");
            var o = Object(this);
            var len = o.length >>> 0;
            if (typeof predicate !== "function")
                throw new TypeError("predicate must be a function");
            var thisArg = arguments[1];
            var k = 0;
            while (k < len) {
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o))
                    return kValue;
                k++;
            }
            return undefined;
        }
    });
}
if (!Array.prototype["findIndex"]) {
    Object.defineProperty(Array.prototype, "findIndex", {
        value: function (predicate) {
            if (this == null)
                throw new TypeError("this is null or not defined");
            var o = Object(this);
            var len = o.length >>> 0;
            if (typeof predicate !== "function")
                throw new TypeError("predicate must be a function");
            var thisArg = arguments[1];
            var k = 0;
            while (k < len) {
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o))
                    return k;
                ++k;
            }
            return -1;
        }
    });
}
if (!Array.prototype.filter) {
    Array.prototype.filter = function (fun) {
        'use strict';
        if (this === void 0 || this === null)
            throw new TypeError();
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function")
            throw new TypeError();
        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];
                if (fun.call(thisArg, val, i, t))
                    res.push(val);
            }
        }
        return res;
    };
}
if (typeof Object.create != 'function') {
    Object.create = (function () {
        var Temp = function () { };
        return function (prototype) {
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
if (!Object.keys) {
    Object.keys = (function () {
        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString');
        var dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ];
        var dontEnumsLength = dontEnums.length;
        return function (obj) {
            if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null))
                throw new TypeError('Object.keys called on non-object');
            var result = [];
            for (var prop in obj) {
                if (hasOwnProperty.call(obj, prop))
                    result.push(prop);
            }
            if (hasDontEnumBug) {
                for (var i = 0; i < dontEnumsLength; ++i) {
                    if (hasOwnProperty.call(obj, dontEnums[i]))
                        result.push(dontEnums[i]);
                }
            }
            return result;
        };
    }());
}
if (typeof Element !== "undefined" && !("remove" in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode)
            this.parentNode.removeChild(this);
    };
}
var kr3m;
(function (kr3m) {
    kr3m.ANDROID = "ANDROID";
    kr3m.IOS = "IOS";
    kr3m.MAX_TAB_INDEX = 0x7fff;
    kr3m.PASSWORD_SECURITY_NONE = 0;
    kr3m.PASSWORD_SECURITY_LOW = 1;
    kr3m.PASSWORD_SECURITY_MEDIUM = 2;
    kr3m.PASSWORD_SECURITY_HIGH = 3;
    kr3m.FORMAT_TIME = "FORMAT_TIME";
    kr3m.FORMAT_DATE = "FORMAT_DATE";
    kr3m.FORMAT_DATETIME = "FORMAT_DATETIME";
    kr3m.SUCCESS = "SUCCESS";
    kr3m.ERROR_CANCELLED = "ERROR_CANCELLED";
    kr3m.ERROR_DATABASE = "ERROR_DATABASE";
    kr3m.ERROR_DENIED = "ERROR_DENIED";
    kr3m.ERROR_EMPTY_DATA = "ERROR_EMPTY_DATA";
    kr3m.ERROR_EXPIRED = "ERROR_EXPIRED";
    kr3m.ERROR_EXTERNAL = "ERROR_EXTERNAL";
    kr3m.ERROR_FILE = "ERROR_FILE";
    kr3m.ERROR_INPUT = "ERROR_INPUT";
    kr3m.ERROR_INTERNAL = "ERROR_INTERNAL";
    kr3m.ERROR_FLOOD = "ERROR_FLOOD";
    kr3m.ERROR_NETWORK = "ERROR_NETWORK";
    kr3m.ERROR_NOT_SUPPORTED = "ERROR_NOT_SUPPORTED";
    kr3m.ERROR_NYI = "ERROR_NYI";
    kr3m.ERROR_PARAMS = "ERROR_PARAMS";
    kr3m.ERROR_PARTIAL = "ERROR_PARTIAL";
    kr3m.ERROR_PENDING = "ERROR_PENDING";
    kr3m.ERROR_PERMISSION = "ERROR_PERMISSION";
    kr3m.ERROR_REQUIRED = "ERROR_REQUIRED";
    kr3m.ERROR_TAKEN = "ERROR_TAKEN";
    kr3m.ERROR_TIMEOUT = "ERROR_TIMEOUT";
    kr3m.ERROR_UPLOAD_COUNT = "ERROR_UPLOAD_COUNT";
    kr3m.ERROR_UPLOAD_SIZE = "ERROR_UPLOAD_SIZE";
    kr3m.ERROR_UPLOAD_DIMENSIONS = "ERROR_UPLOAD_DIMENSIONS";
    kr3m.ERROR_UPLOAD_TYPE = "ERROR_UPLOAD_TYPE";
    kr3m.ERROR_VERSIONS = "ERROR_VERSIONS";
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var services;
    (function (services) {
        var CallbackResult = (function () {
            function CallbackResult(status, data) {
                this.status = status;
                this.success = this.status == kr3m.SUCCESS;
                this.data = data;
            }
            return CallbackResult;
        }());
        services.CallbackResult = CallbackResult;
    })(services = kr3m.services || (kr3m.services = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    kr3m.REGEX_CRON = /((\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)(?:\s+(\S+))?)\s+(.+)/;
    kr3m.REGEX_CRON_GROUPS = ["pattern", "minute", "hour", "dayOfMonth", "month", "dayOfWeek", "year", "command"];
    kr3m.REGEX_DATA_URL = /^data:([^;]+)(?:;(base64)),(.+)$/;
    kr3m.REGEX_DATA_URL_GROUPS = ["mimeType", "encoding", "payload"];
    kr3m.REGEX_DEVICE_ID = /^[A-Z]+:/;
    kr3m.REGEX_EMAIL = /^[0-9a-zA-Z\._\-]+@[0-9a-zA-Z][0-9a-zA-Z\-\.]+\.[a-zA-Z]+$/;
    kr3m.REGEX_FLOAT = /^\-?\d+[,\.]?\d*$/;
    kr3m.REGEX_INTEGER = /^\-?\d+$/;
    kr3m.REGEX_LOCALE = /^([a-z][a-z])[_\-]?([A-Z][A-Z])$/;
    kr3m.REGEX_LOCALE_GROUPS = ["languageId", "countryId"];
    kr3m.REGEX_URL = /^(?:(http|https|ftp)\:)?(?:\/\/(?:(\w+):(\w+)@)?([^\/:#?]+)(?::(\d+))?)?([^\?#"':]*)(?:\?([^#"':]*))?(?:#(.*))?$/;
    kr3m.REGEX_URL_GROUPS = ["protocol", "user", "password", "domain", "port", "resource", "query", "hash"];
    kr3m.REGEX_USERNAME = /^[^<>"'&;\/]+$/;
    kr3m.REGEX_WORD_SEPERATORS = /[\s!§*@$%\/\(\)\{\}=\#\[\]\\\?´`\"\'+\:;,\.<>|€\u0000]+/;
    kr3m.REGEX_TIMESTAMP = /^(\d\d\d\d)\-(\d\d)\-(\d\d)(?:T| )(\d\d)\:(\d\d)(?:\:(\d\d)(?:\.(\d\d\d))?)?(Z|[\+\-]\d\d\:\d\d)?$/;
    kr3m.REGEX_TIMESTAMP_GROUPS = ["year", "month", "day", "hours", "minutes", "seconds", "milliseconds", "timezone"];
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var StringEx = (function () {
            function StringEx() {
            }
            StringEx.captureNamed = function (text, regex, groupNames) {
                var matches = text.match(regex);
                if (!matches)
                    return undefined;
                var result = {};
                var l = Math.min(groupNames.length, matches.length - 1);
                for (var i = 0; i < l; ++i)
                    result[groupNames[i]] = matches[i + 1];
                return result;
            };
            StringEx.captureNamedGlobal = function (text, regex, groupNames) {
                var results = [];
                var match = regex.exec(text);
                while (match) {
                    var result = {};
                    var l = Math.min(groupNames.length, match.length - 1);
                    for (var i = 0; i < l; ++i)
                        result[groupNames[i]] = match[i + 1];
                    results.push(result);
                    match = regex.exec(text);
                }
                return results;
            };
            StringEx.stripBom = function (text) {
                if (text.slice(0, StringEx.BOM.length) == StringEx.BOM)
                    return text.slice(StringEx.BOM.length);
                else
                    return text;
            };
            StringEx.splitNoQuoted = function (text, seperator, openingQuotes, closingQuotes) {
                if (seperator === void 0) { seperator = ","; }
                if (openingQuotes === void 0) { openingQuotes = ["\"", "'"]; }
                closingQuotes = closingQuotes || openingQuotes;
                if (openingQuotes.length != closingQuotes.length)
                    throw new Error("openingQuotes.length doesn't match closingQuotes.length");
                var quote = -1;
                var parts = [];
                var offset = 0;
                for (var i = 0; i < text.length; ++i) {
                    if (quote < 0) {
                        if (text.slice(i, i + seperator.length) == seperator) {
                            parts.push(text.slice(offset, i));
                            offset = i + seperator.length;
                            i = offset - 1;
                            continue;
                        }
                        for (var j = 0; j < openingQuotes.length; ++j) {
                            if (text.slice(i, i + openingQuotes[j].length) == openingQuotes[j]) {
                                quote = j;
                                break;
                            }
                        }
                    }
                    else {
                        if (text.slice(i, i + closingQuotes[quote].length) == closingQuotes[quote])
                            quote = -1;
                    }
                }
                if (offset < text.length)
                    parts.push(text.slice(offset));
                return parts;
            };
            StringEx.camelback = function () {
                var values = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    values[_i] = arguments[_i];
                }
                var parts = [];
                for (var i = 0; i < values.length; ++i) {
                    var text = values[i].toString();
                    text = text.replace(/\W+/g, "_");
                    parts = parts.concat(text.split("_"));
                }
                if (parts.length > 0)
                    parts[0] = parts[0].toLowerCase();
                for (var i = 1; i < parts.length; ++i)
                    parts[i] = parts[i].slice(0, 1).toUpperCase() + parts[i].slice(1).toLowerCase();
                return parts.join("");
            };
            StringEx.replaceSuccessive = function (haystack, needle, replacement) {
                var old;
                while (old != haystack) {
                    old = haystack;
                    haystack = haystack.replace(needle, replacement);
                }
                return haystack;
            };
            StringEx.joinAssoc = function (obj, seperator, assignOperator, valueFormatter) {
                if (seperator === void 0) { seperator = "&"; }
                if (assignOperator === void 0) { assignOperator = "="; }
                var keys = Object.keys(obj);
                if (valueFormatter)
                    return keys.map(function (key) { return key + assignOperator + valueFormatter(obj[key]); }).join(seperator);
                else
                    return keys.map(function (key) { return key + assignOperator + obj[key]; }).join(seperator);
            };
            StringEx.splitAssoc = function (text, seperator, assignOperator, valueFormatter) {
                if (seperator === void 0) { seperator = "&"; }
                if (assignOperator === void 0) { assignOperator = "="; }
                var result = {};
                var parts = text.split(seperator);
                for (var i = 0; i < parts.length; ++i) {
                    var pos = parts[i].indexOf(assignOperator);
                    if (pos < 0)
                        continue;
                    var key = parts[i].substring(0, pos);
                    var value = parts[i].substring(pos + assignOperator.length);
                    result[key] = valueFormatter ? valueFormatter(value) : value;
                }
                return result;
            };
            StringEx.joinKeys = function (obj, seperator) {
                if (seperator === void 0) { seperator = ","; }
                var parts = [];
                for (var i in obj)
                    parts.push(i);
                return parts.join(seperator);
            };
            StringEx.joinValues = function (obj, seperator) {
                if (seperator === void 0) { seperator = ","; }
                var parts = [];
                for (var i in obj)
                    parts.push(obj[i]);
                return parts.join(seperator);
            };
            StringEx.getBefore = function (text, needle, fromFront) {
                if (fromFront === void 0) { fromFront = true; }
                var pos = fromFront ? text.indexOf(needle) : text.lastIndexOf(needle);
                return (pos > 0) ? text.substr(0, pos) : text;
            };
            StringEx.getAfter = function (text, needle, fromFront) {
                if (fromFront === void 0) { fromFront = true; }
                var pos = fromFront ? text.indexOf(needle) : text.lastIndexOf(needle);
                return (pos >= 0) ? text.substr(pos + needle.length) : text;
            };
            StringEx.flip = function (test) {
                var result = "";
                for (var i = test.length - 1; i >= 0; --i)
                    result += test.charAt(i);
                return result;
            };
            StringEx.literalReplace = function (haystack, needle, newValue) {
                return haystack.split(needle).join(newValue);
            };
            StringEx.parseIntSafe = function (text, errorResult) {
                if (errorResult === void 0) { errorResult = 0; }
                if (text === null || typeof text === "undefined")
                    return errorResult;
                var value = parseInt(text, 10);
                if (isNaN(value))
                    value = errorResult;
                return value;
            };
            StringEx.parseFloatSafe = function (text, errorResult) {
                if (errorResult === void 0) { errorResult = 0; }
                if (text === null || typeof text === "undefined")
                    return errorResult;
                var value = parseFloat(text.replace(/,/g, "."));
                if (isNaN(value))
                    value = errorResult;
                return value;
            };
            StringEx.format = function (text) {
                var values = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    values[_i - 1] = arguments[_i];
                }
                var result = "";
                var j = 0;
                var specs = { "%": true, "n": true, "j": true, "s": true };
                for (var i = 0; i < text.length; ++i) {
                    var token = text.charAt(i);
                    if (token == "%") {
                        var k = i + 1;
                        do {
                            if (k >= text.length)
                                return result;
                            var spec = text.charAt(k++);
                        } while (!specs[spec]);
                        var options = text.slice(i + 1, k - 1);
                        var matches = options.match(/^([0\-\+hb]*)(\d*)\.?(\d*)([hb])*$/);
                        if (!matches)
                            continue;
                        var padWith = (matches[1].indexOf("0") >= 0) ? "0" : " ";
                        var alignLeft = matches[1].indexOf("-") >= 0;
                        var alignCenter = matches[1].indexOf("+") >= 0;
                        var length = StringEx.parseIntSafe(matches[2]);
                        var precision = StringEx.parseIntSafe(matches[3]);
                        var base = 10;
                        if ((matches[1] && matches[1].indexOf("h") >= 0) || (matches[4] && matches[4].indexOf("h") >= 0))
                            base = 16;
                        else if ((matches[1] && matches[1].indexOf("b") >= 0) || (matches[4] && matches[4].indexOf("b") >= 0))
                            base = 2;
                        var value;
                        switch (spec) {
                            case "%":
                                if (options == "") {
                                    result += "%";
                                    ++i;
                                    continue;
                                }
                                break;
                            case "n":
                                value = (precision > 0 ? values[j++].toFixed(precision) : values[j++]).toString(base);
                                break;
                            case "s":
                                value = values[j++].toString();
                                break;
                            case "j":
                                value = util.Json.encode(values[j++]);
                                break;
                        }
                        value = value || "";
                        if (alignCenter) {
                            var odd = false;
                            while (value.length < length) {
                                if (odd)
                                    value += padWith;
                                else
                                    value = padWith + value;
                                odd = !odd;
                            }
                        }
                        else if (alignLeft) {
                            while (value.length < length)
                                value += padWith;
                        }
                        else {
                            while (value.length < length)
                                value = padWith + value;
                        }
                        result += value;
                        i = k - 1;
                    }
                    else {
                        result += token;
                    }
                }
                return result;
            };
            StringEx.getVersionParts = function (version, padToLength) {
                if (padToLength === void 0) { padToLength = 0; }
                var parts = version.split(".").map(function (part) { return StringEx.parseIntSafe(part); });
                while (parts.length < padToLength)
                    parts.push(0);
                return parts;
            };
            StringEx.splitArguments = function (line) {
                var args = line.split(" ");
                for (var i = 0; i < args.length; ++i) {
                    var token = args[i].slice(0, 1);
                    if (token == "'" || token == '"') {
                        for (var j = i + 1; j < args.length; ++j) {
                            args[i] += " " + args[j];
                            if (args[j].slice(-1) == token)
                                break;
                        }
                        args.splice(i + 1, j - i);
                    }
                    else {
                        args[i] = args[i].trim();
                    }
                    if (args[i] == "")
                        args.splice(i--, 1);
                }
                return args;
            };
            StringEx.getNamedArguments = function (params, mapping) {
                if (mapping === void 0) { mapping = {}; }
                var result = { values: [] };
                for (var i = 0; i < params.length; ++i) {
                    var meta = mapping[params[i]];
                    if (meta) {
                        var name = meta.name || params[i];
                        var count = meta.count || 0;
                        if (count == 0) {
                            result[name] = params[i];
                        }
                        else if (count == 1) {
                            result[name] = params[++i];
                        }
                        else {
                            result[name] = [];
                            for (var j = 0; j < count; ++j)
                                result[name].push(params[++i]);
                        }
                    }
                    else {
                        result.values.push(params[i]);
                    }
                }
                return result;
            };
            StringEx.wrapText = function (text, lineLength, prefix, suffix) {
                if (lineLength === void 0) { lineLength = 80; }
                if (prefix === void 0) { prefix = ""; }
                if (suffix === void 0) { suffix = ""; }
                if (lineLength < 0)
                    return text;
                var words = text.split(" ");
                if (words.length == 0)
                    return text;
                var result = "";
                var line = words[0];
                var count = words.length;
                for (var i = 1; i < count; ++i) {
                    if (line.length + 1 + words[i].length <= lineLength) {
                        line += " " + words[i];
                    }
                    else {
                        result += prefix + line + suffix + "\n";
                        line = words[i];
                    }
                }
                result += prefix + line + suffix;
                return result;
            };
            StringEx.sortCaseIndependant = function (items) {
                items.sort(function (a, b) { return a.trim().localeCompare(b.trim()); });
            };
            StringEx.getUnitString = function (value, units, maxUnits) {
                if (maxUnits === void 0) { maxUnits = 0; }
                if (value == 0)
                    return "0" + (Object.keys(units)[0] || "");
                var parts = [];
                for (var unit in units) {
                    var amount = value % units[unit];
                    if (amount > 0)
                        parts.unshift(amount + unit);
                    value = Math.floor(value / units[unit]);
                }
                if (maxUnits > 0)
                    parts = parts.slice(0, maxUnits);
                return parts.join(" ");
            };
            StringEx.bigNumber = function (value, maxUnits) {
                if (maxUnits === void 0) { maxUnits = 0; }
                var units = { "": 1000, k: 1000, M: 1000, G: 1000, T: 1000, P: 1000, E: 1000, Z: 1000, Y: 1000, ALOT: 100000000 };
                return StringEx.getUnitString(value, units, maxUnits);
            };
            StringEx.getSizeString = function (size, useDual, maxUnits) {
                if (useDual === void 0) { useDual = true; }
                if (maxUnits === void 0) { maxUnits = 0; }
                var units = useDual
                    ? { B: 1024, kB: 1024, MB: 1024, GB: 1024, TB: 1024, PB: 1024, EB: 1024, ZB: 1024, YB: 1024, ALOT: 100000000 }
                    : { B: 1000, kB: 1000, MB: 1000, GB: 1000, TB: 1000, PB: 1000, EB: 1000, ZB: 1000, YB: 1000, ALOT: 100000000 };
                return StringEx.getUnitString(size, units, maxUnits);
            };
            StringEx.getDurationString = function (duration, maxUnits) {
                if (maxUnits === void 0) { maxUnits = 0; }
                var units = { ms: 1000, s: 60, m: 60, h: 24, d: 7, w: 52, y: 100, centuries: 10, millenia: 1000, ages: 100000000 };
                return StringEx.getUnitString(duration, units, maxUnits);
            };
            StringEx.BOM = "\ufeff";
            return StringEx;
        }());
        util.StringEx = StringEx;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var Dates = (function () {
            function Dates() {
            }
            Dates.getDateString = function (date, useUTC) {
                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }
                if (useUTC) {
                    var result = date.getUTCFullYear() + "-";
                    var month = date.getUTCMonth() + 1;
                    result += ((month < 10) ? "0" + month : "" + month);
                    var day = date.getUTCDate();
                    result += "-" + ((day < 10) ? "0" + day : "" + day);
                    return result;
                }
                else {
                    var result = date.getFullYear() + "-";
                    var month = date.getMonth() + 1;
                    result += ((month < 10) ? "0" + month : "" + month);
                    var day = date.getDate();
                    result += "-" + ((day < 10) ? "0" + day : "" + day);
                    return result;
                }
            };
            Dates.getTimeString = function (date, useUTC, addMilliseconds) {
                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }
                if (addMilliseconds === void 0) { addMilliseconds = false; }
                if (useUTC) {
                    var result = "";
                    var hours = date.getUTCHours();
                    result += ((hours < 10) ? "0" + hours : "" + hours);
                    var minutes = date.getUTCMinutes();
                    result += ":" + ((minutes < 10) ? "0" + minutes : "" + minutes);
                    var seconds = date.getUTCSeconds();
                    result += ":" + ((seconds < 10) ? "0" + seconds : "" + seconds);
                    if (addMilliseconds) {
                        var millis = date.getUTCMilliseconds();
                        result += "." + ((millis < 10) ? "00" + millis : (millis < 100) ? "0" + millis : "" + millis);
                    }
                    return result + "Z";
                }
                else {
                    var result = "";
                    var hours = date.getHours();
                    result += ((hours < 10) ? "0" + hours : "" + hours);
                    var minutes = date.getMinutes();
                    result += ":" + ((minutes < 10) ? "0" + minutes : "" + minutes);
                    var seconds = date.getSeconds();
                    result += ":" + ((seconds < 10) ? "0" + seconds : "" + seconds);
                    if (addMilliseconds) {
                        var millis = date.getMilliseconds();
                        result += "." + ((millis < 10) ? "00" + millis : (millis < 100) ? "0" + millis : "" + millis);
                    }
                    return result;
                }
            };
            Dates.getDateFromDateTimeString = function (value) {
                if (!value || typeof value != "string")
                    return null;
                var matches = util.StringEx.captureNamed(value, kr3m.REGEX_TIMESTAMP, kr3m.REGEX_TIMESTAMP_GROUPS);
                if (!matches)
                    return null;
                matches.seconds = matches.seconds || "0";
                matches.milliseconds = matches.milliseconds || "0";
                var date = new Date();
                if (matches.timezone == "Z") {
                    date.setUTCFullYear(parseInt(matches.year, 10), parseInt(matches.month, 10) - 1, parseInt(matches.day, 10));
                    date.setUTCHours(parseInt(matches.hours, 10), parseInt(matches.minutes, 10), parseInt(matches.seconds, 10), parseInt(matches.milliseconds, 10));
                }
                else if (matches.timezone && matches.timezone.length == 6) {
                    var hourOffset = parseInt(matches.timezone.slice(1, 3), 10);
                    var minuteOffset = parseInt(matches.timezone.slice(4, 5), 10);
                    if (matches.timezone.charAt(0) == "-") {
                        hourOffset *= -1;
                        minuteOffset *= -1;
                    }
                    date.setUTCFullYear(parseInt(matches.year, 10), parseInt(matches.month, 10) - 1, parseInt(matches.day, 10));
                    date.setUTCHours(parseInt(matches.hours, 10) - hourOffset, parseInt(matches.minutes, 10) - minuteOffset, parseInt(matches.seconds, 10), parseInt(matches.milliseconds, 10));
                }
                else {
                    date.setFullYear(parseInt(matches.year, 10), parseInt(matches.month, 10) - 1, parseInt(matches.day, 10));
                    date.setHours(parseInt(matches.hours, 10), parseInt(matches.minutes, 10), parseInt(matches.seconds, 10), parseInt(matches.milliseconds, 10));
                }
                return date;
            };
            Dates.getDateFromDateString = function (value) {
                if (!value || typeof value != "string")
                    return null;
                var matches = value.match(/^(\d\d\d\d)\-(\d\d)\-(\d\d)$/);
                if (!matches)
                    return null;
                var date = new Date();
                date.setFullYear(parseInt(matches[1], 10), parseInt(matches[2], 10) - 1, parseInt(matches[3], 10));
                date.setHours(0, 0, 0, 0);
                return date;
            };
            Dates.getDateTimeString = function (date, useUTC, addMilliseconds) {
                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }
                if (addMilliseconds === void 0) { addMilliseconds = false; }
                return this.getDateString(date, useUTC) + " " + this.getTimeString(date, useUTC, addMilliseconds);
            };
            Dates.getToday = function (useUTC) {
                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }
                return this.getDateString(new Date(), useUTC);
            };
            Dates.getYesterday = function (useUTC) {
                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }
                var date = new Date();
                date.setUTCDate(date.getUTCDate() - 1);
                return this.getDateString(date, useUTC);
            };
            Dates.getTomorrow = function (useUTC) {
                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }
                var date = new Date();
                date.setUTCDate(date.getUTCDate() + 1);
                return this.getDateString(date, useUTC);
            };
            Dates.getNow = function (useUTC) {
                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }
                return this.getDateTimeString(new Date(), useUTC);
            };
            Dates.areSameDay = function (a, b) {
                if (a.getUTCFullYear() != b.getUTCFullYear())
                    return false;
                if (a.getUTCMonth() != b.getUTCMonth())
                    return false;
                if (a.getUTCDate() != b.getUTCDate())
                    return false;
                return true;
            };
            Dates.getSomeDaysAgo = function (date, count) {
                var newDate = new Date(date.getTime());
                newDate.setUTCDate(newDate.getUTCDate() - count);
                return newDate;
            };
            Dates.getSomeMonthsAgo = function (date, count) {
                var newDate = new Date(date.getTime());
                newDate.setUTCMonth(newDate.getUTCMonth() - count);
                return newDate;
            };
            Dates.getAgeInYears = function (birthday) {
                if (!birthday)
                    return -1;
                var now = new Date();
                var years = now.getFullYear() - birthday.getFullYear();
                var months = now.getMonth() - birthday.getMonth();
                var days = now.getDate() - birthday.getDate();
                var age = years;
                if ((months < 0) || (months == 0 && days < 0))
                    --age;
                return age;
            };
            Dates.max = function () {
                var dates = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    dates[_i] = arguments[_i];
                }
                if (dates.length == 0)
                    return null;
                var result = dates[0];
                for (var i = 1; i < dates.length; ++i)
                    if (dates[i] > result)
                        result = dates[i];
                return result;
            };
            Dates.min = function () {
                var dates = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    dates[_i] = arguments[_i];
                }
                if (dates.length == 0)
                    return null;
                var result = dates[0];
                for (var i = 1; i < dates.length; ++i)
                    if (dates[i] < result)
                        result = dates[i];
                return result;
            };
            Dates.getCalendarWeek = function (date, useUTC) {
                if (date === void 0) { date = new Date(); }
                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }
                if (useUTC) {
                    var currentThursday = new Date(date.getTime() + (3 - ((date.getUTCDay() + 6) % 7)) * 86400000);
                    var yearOfThursday = currentThursday.getUTCFullYear();
                    var offset = new Date(0);
                    offset.setUTCFullYear(yearOfThursday, 0, 4);
                    var firstThursday = new Date(offset.getTime() + (3 - ((offset.getUTCDay() + 6) % 7)) * 86400000);
                    var weekNumber = Math.floor(1 + 0.5 + (currentThursday.getTime() - firstThursday.getTime()) / 86400000 / 7);
                    return weekNumber;
                }
                else {
                    var currentThursday = new Date(date.getTime() + (3 - ((date.getDay() + 6) % 7)) * 86400000);
                    var yearOfThursday = currentThursday.getFullYear();
                    var firstThursday = new Date(new Date(yearOfThursday, 0, 4).getTime() + (3 - ((new Date(yearOfThursday, 0, 4).getDay() + 6) % 7)) * 86400000);
                    var weekNumber = Math.floor(1 + 0.5 + (currentThursday.getTime() - firstThursday.getTime()) / 86400000 / 7);
                    return weekNumber;
                }
            };
            Dates.getCalendarWeekYear = function (date, useUTC) {
                if (date === void 0) { date = new Date(); }
                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }
                var year = useUTC ? date.getUTCFullYear() : date.getFullYear();
                var week = Dates.getCalendarWeek(date, useUTC);
                if (week < 52)
                    return year;
                return date.getMonth() > 6 ? year : year - 1;
            };
            Dates.getFirstOfWeek = function (date, useUTC) {
                if (date === void 0) { date = new Date(); }
                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }
                var result = new Date(date.getTime());
                if (useUTC) {
                    result.setUTCDate(result.getUTCDate() - (result.getUTCDay() + 6) % 7);
                    result.setUTCHours(0, 0, 0, 0);
                }
                else {
                    result.setDate(result.getDate() - (result.getDay() + 6) % 7);
                    result.setHours(0, 0, 0, 0);
                }
                return result;
            };
            Dates.getFirstOfMonth = function (date, useUTC) {
                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }
                var result = new Date(date.getTime());
                if (useUTC) {
                    result.setUTCDate(1);
                    result.setUTCHours(0, 0, 0, 0);
                }
                else {
                    result.setDate(1);
                    result.setHours(0, 0, 0, 0);
                }
                return result;
            };
            Dates.getLastOfMonth = function (date, useUTC) {
                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }
                var result = new Date(date.getTime());
                if (useUTC) {
                    result.setUTCDate(1);
                    result.setUTCMonth(result.getUTCMonth() + 1);
                    result.setUTCDate(0);
                    result.setUTCHours(0, 0, 0, 0);
                }
                else {
                    result.setDate(1);
                    result.setMonth(result.getMonth() + 1);
                    result.setDate(0);
                    result.setHours(0, 0, 0, 0);
                }
                return result;
            };
            Dates.areClose = function (a, b, threshold) {
                if (threshold === void 0) { threshold = 1000; }
                if (!a || !b)
                    return false;
                return Math.abs(a.getTime() - b.getTime()) <= threshold;
            };
            Dates.getMonthDays = function (date) {
                if (date === void 0) { date = new Date(); }
                var temp = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                return temp.getDate();
            };
            Dates.delta = function (date, years, months, days, hours, minutes, seconds, milliSeconds, isCapped) {
                if (years === void 0) { years = 0; }
                if (months === void 0) { months = 0; }
                if (days === void 0) { days = 0; }
                if (hours === void 0) { hours = 0; }
                if (minutes === void 0) { minutes = 0; }
                if (seconds === void 0) { seconds = 0; }
                if (milliSeconds === void 0) { milliSeconds = 0; }
                if (isCapped === void 0) { isCapped = true; }
                var result = new Date(date.getTime());
                result.setUTCFullYear(result.getUTCFullYear() + years);
                if (isCapped) {
                    var oldMonth = result.getUTCMonth();
                    result.setUTCMonth(oldMonth + months);
                    var newMonth = result.getUTCMonth();
                    if ((oldMonth + months) % 12 != newMonth)
                        result.setUTCDate(0);
                }
                else {
                    result.setUTCMonth(result.getUTCMonth() + months);
                }
                result.setUTCDate(result.getUTCDate() + days);
                result.setUTCHours(result.getUTCHours() + hours);
                result.setUTCMinutes(result.getUTCMinutes() + minutes);
                result.setUTCSeconds(result.getUTCSeconds() + seconds);
                result.setUTCMilliseconds(result.getUTCMilliseconds() + milliSeconds);
                return result;
            };
            Dates.USE_UTC = false;
            return Dates;
        }());
        util.Dates = Dates;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var Util = (function () {
            function Util() {
            }
            Util.equal = function (obj1, obj2, maxRecursionDepth) {
                if (maxRecursionDepth === void 0) { maxRecursionDepth = 1000; }
                if (maxRecursionDepth < 0)
                    return true;
                if (!obj1 != !obj2)
                    return false;
                if (!obj1 && !obj2)
                    return true;
                --maxRecursionDepth;
                if (typeof obj1 != "object" || typeof obj2 != "object")
                    return obj1 === obj2;
                if (!obj1 != !obj2)
                    return false;
                if (typeof obj1.equals == "function")
                    return obj1.equals(obj2);
                if ((obj1.length || obj2.length) && obj1.length != obj2.length)
                    return false;
                if (obj1 instanceof Date && obj2 instanceof Date)
                    return obj1.getTime() == obj2.getTime();
                for (var i in obj1) {
                    if (!Util.equal(obj1[i], obj2[i], maxRecursionDepth))
                        return false;
                }
                for (var i in obj2) {
                    if (!Util.equal(obj1[i], obj2[i], maxRecursionDepth))
                        return false;
                }
                return true;
            };
            Util.fieldsMatch = function (obj1, obj2, fieldNames, strict) {
                if (strict === void 0) { strict = false; }
                if (!obj1 || !obj2)
                    return false;
                if (strict) {
                    for (var i = 0; i < fieldNames.length; ++i) {
                        if (Util.getProperty(obj1, fieldNames[i]) !== Util.getProperty(obj2, fieldNames[i]))
                            return false;
                    }
                }
                else {
                    for (var i = 0; i < fieldNames.length; ++i) {
                        if (Util.getProperty(obj1, fieldNames[i]) != Util.getProperty(obj2, fieldNames[i]))
                            return false;
                    }
                }
                return true;
            };
            Util.clone = function (obj) {
                if (!obj || typeof obj != "object")
                    return obj;
                if (obj instanceof Date)
                    return new Date(obj.getTime());
                var result = typeof obj["length"] == "number" ? [] : obj["__proto__"] ? Object.create(obj["__proto__"]) : {};
                var keys = Object.keys(obj);
                for (var i = 0; i < keys.length; ++i) {
                    if (typeof obj[keys[i]] == "object")
                        result[keys[i]] = Util.clone(obj[keys[i]]);
                    else
                        result[keys[i]] = obj[keys[i]];
                }
                return result;
            };
            Util.encodeHtml = function (text) {
                if (!text)
                    return text;
                text = text
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
                return text;
            };
            Util.decodeHtml = function (text) {
                var tokens = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: "\"" };
                text = text.replace(/&(#?\w+?);/g, function (all, captured) {
                    if (tokens[captured])
                        return tokens[captured];
                    try {
                        if (captured.charAt(0) == "#")
                            return String.fromCharCode(parseInt(captured.slice(1)));
                    }
                    catch (e) {
                    }
                    return all;
                });
                return text;
            };
            Util.reverse = function (values) {
                values = values.slice();
                var m = Math.floor(values.length / 2);
                var e = values.length - 1;
                for (var i = 0; i < m; ++i)
                    _a = [values[e - i], values[i]], values[i] = _a[0], values[e - i] = _a[1];
                return values;
                var _a;
            };
            Util.contains = function (container, target, strict) {
                if (strict === void 0) { strict = false; }
                if (!container || container.length <= 0)
                    return false;
                for (var i = 0; i < container.length; ++i) {
                    if (container[i] === target || (!strict && container[i] == target))
                        return true;
                }
                return false;
            };
            Util.remove = function (container, target, strict) {
                if (strict === void 0) { strict = false; }
                for (var i = 0; i < container.length; ++i) {
                    if (container[i] === target || (!strict && container[i] == target))
                        return container.splice(i, 1)[0];
                }
                return null;
            };
            Util.difference = function (base) {
                var operands = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    operands[_i - 1] = arguments[_i];
                }
                var result = base.slice(0);
                for (var i = 0; i < result.length; ++i) {
                    for (var j = 0; j < operands.length; ++j) {
                        if (Util.contains(operands[j], result[i])) {
                            result.splice(i--, 1);
                            break;
                        }
                    }
                }
                return result;
            };
            Util.intersect = function () {
                var arrays = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    arrays[_i] = arguments[_i];
                }
                var result = Util.merge.apply(Util, arrays);
                for (var i = 0; i < result.length; ++i) {
                    for (var j = 0; j < arrays.length; ++j) {
                        if (!Util.contains(arrays[j], result[i])) {
                            result.splice(i--, 1);
                            break;
                        }
                    }
                }
                return result;
            };
            Util.merge = function () {
                var arrays = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    arrays[_i] = arguments[_i];
                }
                var result = [];
                for (var i = 0; i < arrays.length; ++i) {
                    for (var j in arrays[i]) {
                        if (!Util.contains(result, arrays[i][j]))
                            result.push(arrays[i][j]);
                    }
                }
                return result;
            };
            Util.mergeAssoc = function () {
                var objects = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    objects[_i] = arguments[_i];
                }
                var result = {};
                for (var i = 0; i < objects.length; ++i) {
                    if (!objects[i])
                        continue;
                    for (var j in objects[i])
                        result[j] = objects[i][j];
                }
                return result;
            };
            Util.getProperty = function (obj, propertyName) {
                var parts = propertyName.split(".");
                while (parts.length > 0) {
                    if (!obj)
                        return undefined;
                    obj = obj[parts.shift()];
                }
                return obj;
            };
            Util.getPropertyAndGetter = function (obj, propertyName) {
                if (propertyName == "")
                    return obj;
                var parts = propertyName.split(".");
                while (parts.length > 0) {
                    if (!obj)
                        return undefined;
                    var prop = parts.shift();
                    if (prop.substr(prop.length - 2, 2) == '()')
                        obj = obj[prop.substr(0, prop.length - 2)]();
                    else
                        obj = obj[prop];
                }
                return obj;
            };
            Util.setProperty = function (obj, name, value) {
                var parts = name.split(".");
                while (parts.length > 1) {
                    var key = parts.shift();
                    if (typeof obj[key] == "undefined") {
                        var index = parseInt(parts[0], 10);
                        if (isNaN(index)) {
                            obj[key] = {};
                        }
                        else {
                            obj[key] = [];
                            for (var i = -1; i < index; ++i)
                                obj[key].push(undefined);
                        }
                    }
                    obj = obj[key];
                }
                obj[parts[0]] = value;
            };
            Util.findBy = function (objects, propertyName, propertyValue, offset, strict) {
                if (offset === void 0) { offset = 0; }
                if (strict === void 0) { strict = false; }
                if (!objects)
                    return -1;
                if (strict) {
                    for (var i = offset; i < objects.length; ++i) {
                        if (Util.getProperty(objects[i], propertyName) === propertyValue)
                            return i;
                    }
                }
                else {
                    for (var i = offset; i < objects.length; ++i) {
                        if (Util.getProperty(objects[i], propertyName) == propertyValue)
                            return i;
                    }
                }
                return -1;
            };
            Util.getBy = function (objects, propertyName, propertyValue, offset, strict) {
                if (offset === void 0) { offset = 0; }
                if (strict === void 0) { strict = false; }
                var pos = Util.findBy(objects, propertyName, propertyValue, offset, strict);
                return pos >= 0 ? objects[pos] : undefined;
            };
            Util.mapAssoc = function (values, mapFunc) {
                var assoc = {};
                for (var i = 0; i < values.length; ++i) {
                    var _a = mapFunc(values[i], i), id = _a[0], newValue = _a[1];
                    assoc[id] = newValue;
                }
                return assoc;
            };
            Util.combine = function (keys, values) {
                if (keys.length != values.length)
                    throw new Error("keys.length doesn't match values.length");
                var result = {};
                for (var i = 0; i < keys.length; ++i)
                    result[keys[i]] = values[i];
                return result;
            };
            Util.getAllBy = function (objects, propertyName, propertyValue) {
                if (!objects)
                    return [];
                var results = [];
                for (var i = 0; i < objects.length; ++i) {
                    if (Util.getProperty(objects[i], propertyName) == propertyValue)
                        results.push(objects[i]);
                }
                return results;
            };
            Util.removeBy = function (objects, propertyName, propertyValue) {
                var result = [];
                if (!objects)
                    return result;
                for (var i = 0; i < objects.length; ++i) {
                    if (Util.getProperty(objects[i], propertyName) == propertyValue)
                        result = result.concat(objects.splice(i--, 1));
                }
                return result;
            };
            Util.gather = function (objects, fieldName, filterFunc) {
                var result = [];
                var parts = fieldName.split(".");
                if (filterFunc) {
                    for (var i in objects) {
                        if (filterFunc(objects[i])) {
                            var temp = objects[i];
                            for (var j = 0; j < parts.length; ++j)
                                temp = temp[parts[j]];
                            result.push(temp);
                        }
                    }
                }
                else {
                    for (var i in objects) {
                        var temp = objects[i];
                        for (var j = 0; j < parts.length; ++j)
                            temp = temp[parts[j]];
                        result.push(temp);
                    }
                }
                return result;
            };
            Util.gatherUnique = function (objects, fieldName, filterFunc) {
                return Util.removeDuplicates(Util.gather(objects, fieldName, filterFunc));
            };
            Util.removeDuplicates = function (objects) {
                var result = [];
                for (var i = 0; i < objects.length; ++i) {
                    if (result.indexOf(objects[i]) < 0)
                        result.push(objects[i]);
                }
                return result;
            };
            Util.arrayToAssoc = function (data, indexField) {
                if (indexField === void 0) { indexField = "id"; }
                var result = {};
                for (var i = 0; i < data.length; ++i) {
                    var key = Util.getProperty(data[i], indexField);
                    result[key] = data[i];
                }
                return result;
            };
            Util.arrayToPairs = function (data, indexField, valueField) {
                var result = {};
                for (var i in data) {
                    var key = Util.getProperty(data[i], indexField);
                    var value = Util.getProperty(data[i], valueField);
                    result[key] = value;
                }
                return result;
            };
            Util.arrayToSet = function (data, trueValue) {
                if (trueValue === void 0) { trueValue = true; }
                var set = {};
                for (var i = 0; i < data.length; ++i)
                    set[data[i]] = trueValue;
                return set;
            };
            Util.assocToArray = function (data) {
                var result = [];
                for (var i in data)
                    result.push(data[i]);
                return result;
            };
            Util.filter = function (value, validValues, fallbackValue) {
                if (fallbackValue === void 0) { fallbackValue = null; }
                for (var i = 0; i < validValues.length; ++i) {
                    if (validValues[i] == value)
                        return value;
                }
                return fallbackValue;
            };
            Util.filterKey = function (key, validKeys, fallbackKey) {
                if (fallbackKey === void 0) { fallbackKey = null; }
                if (typeof validKeys[key] != "undefined")
                    return key;
                return fallbackKey;
            };
            Util.filterAssoc = function (obj, func) {
                var result = {};
                for (var name in obj) {
                    if (func(obj[name], name))
                        result[name] = obj[name];
                }
                return result;
            };
            Util.sortBy = function () {
                var values = arguments[0];
                var fields;
                if (typeof arguments[1] == "string") {
                    fields = {};
                    fields[arguments[1]] = arguments[2] === undefined ? true : arguments[2];
                }
                else {
                    fields = arguments[1];
                }
                for (var i = 0; i < values.length; ++i) {
                    for (var name in fields) {
                        if (Util.getProperty(values[i], name) === undefined) {
                            util.Log.logError("property", name, "in", values[i], "not found while sorting, aborting sort");
                            break;
                        }
                    }
                }
                values.sort(function (a, b) {
                    for (var name in fields) {
                        var aValue = Util.getProperty(a, name);
                        var bValue = Util.getProperty(b, name);
                        if (aValue < bValue)
                            return fields[name] ? -1 : 1;
                        if (aValue > bValue)
                            return fields[name] ? 1 : -1;
                    }
                    return 0;
                });
            };
            Util.sortAssocByKey = function (data, sortFunc) {
                sortFunc = sortFunc || (function (keyA, keyB) { return keyA.localeCompare(keyB); });
                var keys = Object.keys(data);
                keys.sort(sortFunc);
                var result = {};
                for (var i = 0; i < keys.length; ++i)
                    result[keys[i]] = data[keys[i]];
                return result;
            };
            Util.sortAssocByValue = function (data, sortFunc) {
                sortFunc = sortFunc || (function (valueA, valueB) { return valueA.toString().localeCompare(valueB.toString()); });
                var keys = Object.keys(data);
                keys.sort(function (keyA, keyB) { return sortFunc(data[keyA], data[keyB]); });
                var result = {};
                for (var i = 0; i < keys.length; ++i)
                    result[keys[i]] = data[keys[i]];
                return result;
            };
            Util.sortIndicesBy = function (values, field, ascending) {
                if (ascending === void 0) { ascending = true; }
                var one = ascending ? 1 : -1;
                var results = [];
                for (var i = 0; i < values.length; ++i)
                    results.push(i);
                results.sort(function (a, b) {
                    var aValue = Util.getProperty(values[a], field);
                    var bValue = Util.getProperty(values[b], field);
                    return (aValue > bValue) ? one : (aValue < bValue) ? -one : 0;
                });
                return results;
            };
            Util.bucketBy = function (values, field) {
                var buckets = {};
                for (var i = 0; i < values.length; ++i) {
                    var key = Util.getProperty(values[i], field);
                    if (!buckets[key])
                        buckets[key] = [];
                    buckets[key].push(values[i]);
                }
                return buckets;
            };
            Util.bucketByRecursive = function (values) {
                var fields = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    fields[_i - 1] = arguments[_i];
                }
                if (fields.length == 0)
                    return undefined;
                var field = fields.shift();
                var buckets = Util.bucketBy(values, field);
                if (fields.length > 0) {
                    for (var id in buckets)
                        buckets[id] = Util.bucketByRecursive.apply(Util, [buckets[id]].concat(fields));
                }
                return buckets;
            };
            Util.bucketAssocBy = function (values, field) {
                var buckets = {};
                for (var i in values) {
                    var key = Util.getProperty(values[i], field);
                    if (!buckets[key])
                        buckets[key] = [];
                    buckets[key].push(values[i]);
                }
                return buckets;
            };
            Util.forEachRecursive = function (obj, func) {
                if (!obj || typeof obj != "object")
                    return;
                var workset = Object.keys(obj);
                while (workset.length > 0) {
                    var key = workset.pop();
                    var value = Util.getProperty(obj, key);
                    var type = value ? typeof value : "null";
                    switch (type) {
                        case "object":
                            var subKeys = Object.keys(value);
                            for (var i = 0; i < subKeys.length; ++i)
                                workset.push(key + "." + subKeys[i]);
                            break;
                        default:
                            func(key, value, obj);
                            break;
                    }
                }
            };
            Util.mergeAssocRecursive = function () {
                var objects = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    objects[_i] = arguments[_i];
                }
                var result = {};
                for (var i = 0; i < objects.length; ++i)
                    Util.forEachRecursive(objects[i], function (key, value) { return Util.setProperty(result, key, value); });
                return result;
            };
            Util.getFirstInstanceOf = function (values, cls, offset, skip) {
                if (offset === void 0) { offset = 0; }
                if (skip === void 0) { skip = 0; }
                for (var i = offset; i < values.length; ++i) {
                    if (values[i] instanceof cls) {
                        if (skip <= 0)
                            return values[i];
                        --skip;
                    }
                }
                return undefined;
            };
            Util.getFirstOfType = function (values, type, offset, skip) {
                if (offset === void 0) { offset = 0; }
                if (skip === void 0) { skip = 0; }
                for (var i = offset; i < values.length; ++i) {
                    if (typeof values[i] == type) {
                        if (skip <= 0)
                            return values[i];
                        --skip;
                    }
                }
                return undefined;
            };
            Util.getAllInstancesOf = function (values, cls, offset) {
                if (offset === void 0) { offset = 0; }
                var result = [];
                for (var i = offset; i < values.length; ++i) {
                    if (values[i] instanceof cls)
                        result.push(values[i]);
                }
                return result;
            };
            Util.getAllOfType = function (values, type, offset) {
                if (offset === void 0) { offset = 0; }
                var result = [];
                for (var i = offset; i < values.length; ++i) {
                    if (typeof values[i] == type)
                        result.push(values[i]);
                }
                return result;
            };
            Util.rearrange = function (values, newOffsets) {
                var result = [];
                for (var i = 0; i < newOffsets.length; ++i)
                    result.push(values[newOffsets[i]]);
                result = result.concat(values.slice(newOffsets.length));
                return result;
            };
            Util.fill = function () {
                var result = [];
                if (typeof arguments[1] == "function") {
                    for (var i = 0; i < arguments[0]; ++i)
                        result.push(arguments[1](i));
                }
                else {
                    for (var i = 0; i < arguments[0]; ++i)
                        result.push(arguments[1]);
                }
                return result;
            };
            return Util;
        }());
        util.Util = Util;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
function firstOfType(values, type, offset, skip) {
    if (offset === void 0) { offset = 0; }
    if (skip === void 0) { skip = 0; }
    return kr3m.util.Util.getFirstOfType(values, type, offset, skip);
}
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var Json = (function () {
            function Json() {
            }
            Json.breakCircular = function (obj) {
                if (!obj || typeof obj != "object" || obj instanceof Date)
                    return obj;
                var found = [];
                var broken = [];
                var workset1 = [obj];
                while (workset1.length > 0) {
                    var current = workset1.shift();
                    found.push(current);
                    for (var key in current) {
                        if (typeof current[key] != "object" || current[key] instanceof Date)
                            continue;
                        if (found.indexOf(current[key]) >= 0)
                            broken.push(current[key]);
                        else
                            workset1.push(current[key]);
                    }
                }
                if (broken.length == 0)
                    return obj;
                var clone = typeof obj["length"] == "number" ? [] : {};
                var workset2 = [{ prefix: "", value: obj }];
                while (workset2.length > 0) {
                    var current = workset2.shift();
                    for (var key in current.value) {
                        if (broken.indexOf(current.value[key]) >= 0) {
                            util.Util.setProperty(clone, current.prefix + key, "[CYCLICAL]");
                            continue;
                        }
                        if (typeof current.value[key] != "object" || current.value[key] instanceof Date)
                            util.Util.setProperty(clone, current.prefix + key, current.value[key]);
                        else
                            workset2.push({ value: current.value[key], prefix: current.prefix + key + "." });
                    }
                }
                return clone;
            };
            Json.encode = function (obj, breakCircular) {
                if (breakCircular === void 0) { breakCircular = false; }
                if (breakCircular)
                    obj = Json.breakCircular(obj);
                return JSON.stringify(obj);
            };
            Json.encodeNice = function (obj, padding, breakCircular) {
                if (padding === void 0) { padding = ""; }
                if (breakCircular === void 0) { breakCircular = false; }
                if (breakCircular)
                    obj = Json.breakCircular(obj);
                if (typeof obj == "object" && !(obj instanceof Date)) {
                    var json = "";
                    if (typeof obj.length == "number") {
                        if (obj.length === 0)
                            return padding + "[]";
                        json += padding + "[";
                        for (var i = 0; i < obj.length; ++i)
                            json += "\n" + Json.encodeNice(obj[i], padding + "\t") + ",";
                        if (obj.length > 0)
                            json = json.slice(0, -1);
                        json += "\n" + padding + "]";
                    }
                    else {
                        json += padding + "{";
                        for (var ind in obj) {
                            if (typeof obj[ind] == "object" && !(obj instanceof Date))
                                json += "\n\t" + padding + "\"" + ind + "\":\n" + Json.encodeNice(obj[ind], padding + "\t") + ",";
                            else
                                json += "\n\t" + padding + "\"" + ind + "\":" + Json.encode(obj[ind]) + ",";
                        }
                        if (json.slice(-1) == ",")
                            json = json.slice(0, -1);
                        json += "\n" + padding + "}";
                    }
                    return json;
                }
                else {
                    return padding + Json.encode(obj);
                }
            };
            Json.escapeSpecialChars = function (json) {
                return json.replace(/[\u0080-\uffff]/g, function (char) { return "\\u" + ("0000" + char.charCodeAt(0).toString(16)).slice(-4); });
            };
            Json.reviver = function (key, computed) {
                if (typeof computed == "string") {
                    var date = kr3m.util.Dates.getDateFromDateTimeString(computed);
                    if (date)
                        return date;
                }
                return computed;
            };
            Json.isJSON = function (text) {
                if (!text)
                    return false;
                try {
                    JSON.parse(text);
                    return true;
                }
                catch (e) {
                    return false;
                }
            };
            Json.decode = function (json) {
                if (!json)
                    return null;
                try {
                    return JSON.parse(json, Json.reviver);
                }
                catch (e) {
                    console.error(json);
                    console.error(e);
                    return null;
                }
            };
            Json.mergeAssoc = function () {
                var jsons = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    jsons[_i] = arguments[_i];
                }
                var objs = jsons.map(function (j) { return Json.decode(j); });
                var result = util.Util.mergeAssoc.apply(util.Util, objs);
                return Json.encode(result);
            };
            return Json;
        }());
        util.Json = Json;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var Log = (function () {
            function Log() {
            }
            Log.logError = function () {
                var values = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    values[_i] = arguments[_i];
                }
                if (!Log.enabled || typeof console == "undefined" || typeof console.error == "undefined")
                    return;
                if (values.length == 1 && values[0] instanceof Error) {
                    if (typeof values[0].stack != "undefined" && typeof window["chrome"] == "undefined")
                        throw values[0].stack;
                    else
                        throw values[0];
                }
                else {
                    try {
                        console.error.apply(console, values);
                    }
                    catch (e) {
                        console.error(values);
                    }
                }
            };
            Log.log = function () {
                var values = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    values[_i] = arguments[_i];
                }
                if (!Log.enabled || typeof console == "undefined" || typeof console.log == "undefined")
                    return;
                try {
                    console.log.apply(console, values);
                }
                catch (e) {
                    console.log(values);
                }
            };
            Log.logWarning = function () {
                var values = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    values[_i] = arguments[_i];
                }
                if (!Log.enabled || typeof console == "undefined" || typeof console.warn == "undefined")
                    return;
                if (values.length == 1 && values[0] instanceof Error) {
                    if (typeof values[0].stack != "undefined" && typeof window["chrome"] == "undefined")
                        throw values[0].stack;
                    else
                        throw values[0];
                }
                else {
                    try {
                        console.warn.apply(console, values);
                    }
                    catch (e) {
                        console.warn(values);
                    }
                }
            };
            Log.logDebug = function () {
                var values = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    values[_i] = arguments[_i];
                }
                Log.log.apply(null, values);
            };
            Log.logVerbose = function () {
                var values = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    values[_i] = arguments[_i];
                }
            };
            Log.dump = function () {
                var values = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    values[_i] = arguments[_i];
                }
                if (!Log.enabled || typeof console == "undefined" || typeof console.log == "undefined")
                    return;
                for (var i = 0; i < values.length; ++i) {
                    if (typeof values[i] == "object")
                        values[i] = util.Json.encode(values[i], true);
                }
                Log.log.apply(null, values);
            };
            Log.stackTrace = function (asError, skipLines) {
                if (asError === void 0) { asError = false; }
                if (skipLines === void 0) { skipLines = 0; }
                var e = new Error();
                var stack = e["stack"].split(/\s+at\s+/).slice(skipLines + 1);
                return stack.join("\n");
            };
            Log.logStackTrace = function (asError, skipLines) {
                if (asError === void 0) { asError = false; }
                if (skipLines === void 0) { skipLines = 0; }
                Log.log(Log.stackTrace(asError));
            };
            Log.enabled = true;
            return Log;
        }());
        util.Log = Log;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
function log() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    kr3m.util.Log.log.apply(null, values);
}
function logDebug() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    kr3m.util.Log.logDebug.apply(null, values);
}
function logVerbose() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
}
function dump() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    kr3m.util.Log.dump.apply(null, values);
}
function logError() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    kr3m.util.Log.logError.apply(null, values);
}
function logWarning() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    kr3m.util.Log.logWarning.apply(null, values);
}
function logFunc(functionName) {
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
    }
    var text = functionName + "(";
    for (var i = 0; i < params.length; ++i)
        params[i] = kr3m.util.Json.encode(params[i], true);
    text += params.join(", ") + ")";
    kr3m.util.Log.log(text);
}
var kr3m;
(function (kr3m) {
    var async;
    (function (async) {
        var Timeout = (function () {
            function Timeout() {
            }
            Timeout.call = function (timeout, callFunc, successCallback, timeoutCallback) {
                timeoutCallback = timeoutCallback || successCallback;
                var hadTimeout = false;
                var timer;
                var helper = function () {
                    if (!hadTimeout) {
                        clearTimeout(timer);
                        successCallback.apply(null, arguments);
                    }
                };
                timer = setTimeout(function () {
                    hadTimeout = true;
                    timeoutCallback();
                }, timeout);
                try {
                    callFunc(helper);
                }
                catch (ex) {
                    kr3m.util.Log.logDebug(ex.toString());
                    hadTimeout = true;
                    clearTimeout(timer);
                    timeoutCallback();
                }
            };
            return Timeout;
        }());
        async.Timeout = Timeout;
    })(async = kr3m.async || (kr3m.async = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        function trySafe(func) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            try {
                func.apply(void 0, params);
            }
            catch (e) {
                util.Log.logError(e);
            }
        }
        util.trySafe = trySafe;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
function trySafe(func) {
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
    }
    try {
        func.apply(void 0, params);
    }
    catch (e) {
        kr3m.util.Log.logError(e);
    }
}
var kr3m;
(function (kr3m) {
    var async;
    (function (async) {
        var Delayed = (function () {
            function Delayed() {
                this.done = false;
                this.pendingCalls = [];
            }
            Delayed.prototype.execute = function () {
                for (var i = 0; i < this.pendingCalls.length; ++i)
                    kr3m.util.trySafe(this.pendingCalls[i].func);
                this.pendingCalls = [];
                this.done = true;
            };
            Delayed.prototype.call = function (func, exclusiveKey, exclusivePriority) {
                if (exclusivePriority === void 0) { exclusivePriority = 0; }
                if (this.done) {
                    func();
                    return;
                }
                if (exclusiveKey) {
                    for (var i = 0; i < this.pendingCalls.length; ++i) {
                        if (this.pendingCalls[i].key == exclusiveKey) {
                            if (this.pendingCalls[i].priority >= exclusivePriority)
                                return;
                            else
                                this.pendingCalls.splice(i--, 1);
                        }
                    }
                }
                this.pendingCalls.push({ func: func, key: exclusiveKey, priority: exclusivePriority });
            };
            Delayed.prototype.isDone = function () {
                return this.done;
            };
            Delayed.prototype.reset = function (flush) {
                if (flush === void 0) { flush = false; }
                this.done = false;
                if (flush)
                    this.pendingCalls = [];
            };
            return Delayed;
        }());
        async.Delayed = Delayed;
    })(async = kr3m.async || (kr3m.async = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var async;
    (function (async) {
        var Loop = (function () {
            function Loop() {
            }
            Loop.loop = function (loopFunc, callback) {
                var counter = 0;
                var innerHelper = function (again) {
                    if (again || again === undefined) {
                        ++counter;
                        if (counter < Loop.MAX_SYNC_ITERATIONS)
                            return loopFunc(innerHelper);
                        counter = 0;
                        setTimeout(innerHelper, 0);
                        return;
                    }
                    callback && callback();
                };
                innerHelper(true);
            };
            Loop.times = function (count, loopFunc, callback, parallelCount) {
                if (parallelCount === void 0) { parallelCount = 1; }
                if (count < 1)
                    return callback && callback();
                var i = 0;
                var runningCount = Math.min(parallelCount, count);
                var runningCountInitial = runningCount;
                var innerHelpers = [];
                var counters = [];
                var innerHelper = function (j) {
                    --runningCount;
                    if (i < count) {
                        ++runningCount;
                        ++counters[j];
                        var myI = i++;
                        if (counters[j] < Loop.MAX_SYNC_ITERATIONS)
                            return loopFunc(innerHelpers[j], myI);
                        counters[j] = 0;
                        setTimeout(function () { return loopFunc(innerHelpers[j], myI); }, 0);
                    }
                    else if (callback && runningCount == 0) {
                        callback();
                    }
                };
                for (var j = 0; j < runningCountInitial; ++j) {
                    counters[j] = 0;
                    innerHelpers[j] = innerHelper.bind(null, j);
                    innerHelpers[j]();
                }
            };
            Loop.forEach = function (values, loopFunc, callback, parallelCount) {
                if (parallelCount === void 0) { parallelCount = 1; }
                if (!values || values.length == 0)
                    return callback && callback();
                var i = 0;
                var runningCount = Math.min(parallelCount, values.length);
                var runningCountInitial = runningCount;
                var innerHelpers = [];
                var counters = [];
                var innerHelper = function (j) {
                    --runningCount;
                    if (i < values.length) {
                        ++runningCount;
                        ++counters[j];
                        var myI = i++;
                        if (counters[j] < Loop.MAX_SYNC_ITERATIONS)
                            return loopFunc(values[myI], innerHelpers[j], myI);
                        counters[j] = 0;
                        setTimeout(function () { return loopFunc(values[myI], innerHelpers[j], myI); }, 0);
                    }
                    else if (callback && runningCount == 0) {
                        callback();
                    }
                };
                for (var j = 0; j < runningCountInitial; ++j) {
                    counters[j] = 0;
                    innerHelpers[j] = innerHelper.bind(null, j);
                    innerHelpers[j]();
                }
            };
            Loop.forEachAssoc = function (valuesMap, loopFunc, callback, parallelCount) {
                if (parallelCount === void 0) { parallelCount = 1; }
                if (!valuesMap)
                    return callback && callback();
                var keys = Object.keys(valuesMap);
                kr3m.async.Loop.forEach(keys, function (key, next) {
                    loopFunc(key, valuesMap[key], next);
                }, callback, parallelCount);
            };
            Loop.forEachBatch = function (values, batchSize, loopFunc, callback, parallelCount) {
                if (parallelCount === void 0) { parallelCount = 1; }
                if (!values || values.length == 0)
                    return callback && callback();
                var i = 0;
                var runningCount = Math.min(parallelCount, Math.ceil(values.length / batchSize));
                var runningCountInitial = runningCount;
                var innerHelpers = [];
                var counters = [];
                var innerHelper = function (j) {
                    --runningCount;
                    if (i < values.length) {
                        ++runningCount;
                        ++counters[j];
                        var myI = i;
                        var batch = values.slice(i, i + batchSize);
                        i += batch.length;
                        if (counters[j] < Loop.MAX_SYNC_ITERATIONS)
                            return loopFunc(batch, innerHelpers[j], myI);
                        counters[j] = 0;
                        setTimeout(function () { return loopFunc(batch, innerHelpers[j], myI); }, 0);
                    }
                    else if (callback && runningCount == 0) {
                        callback();
                    }
                };
                for (var j = 0; j < runningCountInitial; ++j) {
                    counters[j] = 0;
                    innerHelpers[j] = innerHelper.bind(null, j);
                    innerHelpers[j]();
                }
            };
            Loop.MAX_SYNC_ITERATIONS = 200;
            return Loop;
        }());
        async.Loop = Loop;
    })(async = kr3m.async || (kr3m.async = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var AdBlock = (function () {
            function AdBlock() {
            }
            AdBlock.has = function (callback) {
                if (callback)
                    AdBlock.delay.call(function () { return callback(AdBlock.hasBlocker); });
                AdBlock.check();
            };
            AdBlock.check = function () {
                var _this = this;
                if (AdBlock.checking)
                    return;
                if (document.readyState != "complete") {
                    document.addEventListener("readystatechange", function () { return AdBlock.check(); });
                    return;
                }
                AdBlock.checking = true;
                var bait = document.createElement("div");
                bait.setAttribute("class", "pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links");
                bait.setAttribute("style", "width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;");
                document.body.appendChild(bait);
                var i = 5;
                kr3m.async.Loop.loop(function (loopDone) {
                    setTimeout(function () {
                        var found = function () {
                            AdBlock.hasBlocker = true;
                            _this.delay.execute();
                        };
                        if (document.body.getAttribute("abp") !== null)
                            return found();
                        if (bait.offsetParent === null
                            || bait.offsetHeight == 0
                            || bait.offsetLeft == 0
                            || bait.offsetTop == 0
                            || bait.offsetWidth == 0
                            || bait.clientHeight == 0
                            || bait.clientWidth == 0)
                            return found();
                        if (window.getComputedStyle !== undefined) {
                            var styles = window.getComputedStyle(bait, null);
                            if (styles.getPropertyValue("display") == "none"
                                || styles.getPropertyValue("visibility") == "hidden")
                                return found();
                        }
                        loopDone(--i > 0);
                    }, 50);
                }, function () {
                    bait.remove();
                    AdBlock.hasBlocker = false;
                    _this.delay.execute();
                });
            };
            AdBlock.delay = new kr3m.async.Delayed();
            AdBlock.checking = false;
            return AdBlock;
        }());
        util.AdBlock = AdBlock;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var Device = (function () {
            function Device(globals) {
                globals = globals || {};
                globals.document = globals.document || document;
                globals.navigator = globals.navigator || navigator;
                globals.window = globals.window || window;
                try {
                    globals.localStorage = globals.localStorage || localStorage;
                }
                catch (e) {
                }
                this.checkOS(globals);
                this.checkBrowser(globals);
                this.checkDevice(globals);
                this.checkFeatures(globals);
                this.checkAudio(globals);
                this.checkTablet(globals);
                this.mobile = !this.desktop && !this.tablet;
            }
            Device.getInstance = function () {
                var self = Device;
                if (typeof self.instance == "undefined")
                    self.instance = new Device();
                return self.instance;
            };
            Device.prototype.canPlayAudio = function (type) {
                switch (type) {
                    case "ogg":
                        return this.ogg;
                    case "opus":
                        return this.opus;
                    case "mp3":
                        return this.mp3;
                    case "wav":
                        return this.wav;
                    case "m4a":
                        return this.m4a;
                    case "webm":
                        return this.webm;
                }
                return false;
            };
            Device.prototype.checkOS = function (globals) {
                var ua = globals.navigator.userAgent;
                if (/Playstation Vita/.test(ua)) {
                    this.vita = true;
                    this.desktop = false;
                }
                else if (/Kindle/.test(ua) || /\bKF[A-Z][A-Z]+/.test(ua) || /Silk.*Mobile Safari/.test(ua)) {
                    this.kindle = true;
                    this.desktop = false;
                }
                else if (/Android/.test(ua)) {
                    this.android = true;
                    this.desktop = false;
                    this.checkAndroidVersion(globals);
                }
                else if (/CrOS/.test(ua)) {
                    this.chromeOS = true;
                }
                else if (/iP[ao]d|iPhone/i.test(ua)) {
                    this.iOS = true;
                    this.desktop = false;
                    var osVersionMatch = ua.match(/OS (\d+)_/i);
                    if (osVersionMatch)
                        this.iOSVersion = parseInt(osVersionMatch[1], 10);
                    if (/OS 11_/i.test(ua))
                        this.iOS11 = true;
                    else if (/OS 10_/i.test(ua))
                        this.iOS10 = true;
                    else if (/OS 9_/i.test(ua))
                        this.iOS9 = true;
                }
                else if (/Linux/.test(ua)) {
                    this.linux = true;
                }
                else if (/Mac OS/.test(ua)) {
                    this.macOS = true;
                }
                else if (/Windows/.test(ua)) {
                    this.windows = true;
                    if (/Windows Phone/i.test(ua))
                        this.windowsPhone = true;
                }
                if (this.windows || this.macOS || (this.linux && !this.silk) || this.chromeOS)
                    this.desktop = true;
                if (this.windowsPhone || ((/Windows NT/i.test(ua)) && (/Touch/i.test(ua))))
                    this.desktop = false;
            };
            Device.prototype.checkFeatures = function (globals) {
                this.canvas = !!globals.window['CanvasRenderingContext2D'];
                try {
                    this.localStorage = !!globals.localStorage.getItem;
                }
                catch (error) {
                    this.localStorage = false;
                }
                this.file = !!globals.window['File'] && !!globals.window['FileReader'] && !!globals.window['FileList'] && !!globals.window['Blob'];
                this.fileSystem = !!globals.window['requestFileSystem'];
                this.webGL = (function () {
                    try {
                        var canvas = globals.document.createElement('canvas');
                        canvas["screencanvas"] = false;
                        var options = { failIfMajorPerformanceCaveat: true };
                        return (!!globals.window["WebGLRenderingContext"]) && (canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options));
                    }
                    catch (e) {
                        return false;
                    }
                })();
                this.webGL = !!this.webGL;
                if ('ontouchstart' in globals.document.documentElement || (globals.navigator["maxTouchPoints"] && globals.navigator["maxTouchPoints"] > 1))
                    this.touch = true;
                if (globals.navigator.msPointerEnabled || globals.navigator["pointerEnabled"])
                    this.mspointer = true;
                this.pointerLock = 'pointerLockElement' in globals.document || 'mozPointerLockElement' in globals.document || 'webkitPointerLockElement' in globals.document;
                this.quirksMode = (globals.document.compatMode === 'CSS1Compat') ? false : true;
            };
            Device.prototype.checkBrowser = function (globals) {
                var ua = globals.navigator.userAgent;
                if (/Instagram/.test(ua)) {
                    this.inApp = true;
                    this.instagramApp = true;
                }
                else if (/FBAV/.test(ua)) {
                    this.inApp = true;
                    this.fbApp = true;
                }
                else if (/Arora/.test(ua)) {
                    this.arora = true;
                }
                else if (/Edge\/\d+/.test(ua)) {
                    this.edge = true;
                }
                else if (/Chrome/.test(ua)) {
                    this.chrome = true;
                    this.checkChromeVersion(ua);
                }
                else if (/CriOS/.test(ua)) {
                    this.iOSChrome = true;
                    this.checkChromeVersion(ua);
                }
                else if (/Epiphany/.test(ua)) {
                    this.epiphany = true;
                }
                else if (/Firefox/.test(ua)) {
                    this.firefox = true;
                    this.checkFirefoxVersion(ua);
                }
                else if (/AppleWebKit/.test(ua) && this.iOS) {
                    this.mobileSafari = true;
                }
                else if (/MSIE (\d+\.\d+);/.test(ua)) {
                    this.ie = true;
                    this.ieVersion = parseInt(RegExp.$1, 10);
                }
                else if (/Midori/.test(ua)) {
                    this.midori = true;
                }
                else if (/Opera/.test(ua)) {
                    this.opera = true;
                }
                else if (/Safari/.test(ua)) {
                    this.safari = true;
                }
                else if (/Trident\/(\d+\.\d+)(.*)rv:(\d+\.\d+)/.test(ua)) {
                    this.ie = true;
                    this.trident = true;
                    this.tridentVersion = parseInt(RegExp.$1, 10);
                    this.ieVersion = parseInt(RegExp.$3, 10);
                }
                this.silk = /Silk/.test(ua);
                if (globals.navigator['standalone'])
                    this.webApp = true;
                var matches = globals.navigator.userAgent.match(/Android.*AppleWebKit\/([\d.]+)/);
                this.androidStockBrowser = matches ? parseInt(matches[1], 10) < 537 : false;
            };
            Device.prototype.checkDevice = function (globals) {
                this.pixelRatio = globals.window['devicePixelRatio'] || 1;
                this.iPhone = globals.navigator.userAgent.toLowerCase().indexOf('iphone') != -1;
                this.iPhone4 = (this.pixelRatio == 2 && this.iPhone);
                this.iPhone5 = (this.pixelRatio == 2 && this.iPhone && screen.availHeight == 548);
                this.iPad = globals.navigator.userAgent.toLowerCase().indexOf('ipad') != -1;
            };
            Device.prototype.checkAudio = function (globals) {
                this.audioData = !!(globals.window['Audio']);
                this.webAudio = !!globals.window['AudioContext'];
                var audioElement = globals.document.createElement('audio');
                var result = false;
                try {
                    if (result = !!audioElement.canPlayType) {
                        if (audioElement.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''))
                            this.ogg = true;
                        if (audioElement.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, '') || audioElement.canPlayType('audio/opus;').replace(/^no$/, ''))
                            this.opus = true;
                        if (audioElement.canPlayType('audio/mpeg;').replace(/^no$/, ''))
                            this.mp3 = true;
                        if (audioElement.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ''))
                            this.wav = true;
                        if (audioElement.canPlayType('audio/x-m4a;') || audioElement.canPlayType('audio/aac;').replace(/^no$/, ''))
                            this.m4a = true;
                        if (audioElement.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ''))
                            this.webm = true;
                    }
                }
                catch (e) {
                }
            };
            Device.prototype.checkTablet = function (globals) {
                if (this.desktop) {
                    this.tablet = false;
                    return;
                }
                var ua = globals.navigator.userAgent;
                this.tablet = false;
                if (this.iOS && /ipad/i.test(ua))
                    this.tablet = true;
                if (this.android && !/mobile/i.test(ua))
                    this.tablet = true;
                if ((/blackberry/i.test(ua) || /bb10/i.test(ua) || /rim/i.test(ua)) && /tablet/i.test(ua))
                    this.tablet = true;
                if (this.tablet)
                    this.desktop = false;
            };
            Device.prototype.checkAndroidVersion = function (globals) {
                var ua = globals.navigator.userAgent.toLowerCase();
                var match = ua.match(/android\s([0-9\.]*)/);
                if (match) {
                    try {
                        this.androidVersion = match[1];
                    }
                    catch (e) {
                    }
                }
            };
            ;
            Device.prototype.checkChromeVersion = function (ua) {
                var matches = ua.match(/Chrome\/(\d+)/i);
                if (matches)
                    this.chromeVersion = parseInt(matches[1], 10);
            };
            Device.prototype.checkFirefoxVersion = function (ua) {
                var matches = ua.match(/Firefox\/(\d+)/i);
                if (matches) {
                    this.firefoxVersion = parseInt(matches[1], 10);
                    this.firefoxQuantum = this.firefoxVersion > 57;
                }
            };
            return Device;
        }());
        util.Device = Device;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
function getDevice() {
    return kr3m.util.Device.getInstance();
}
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var UrlParts = (function () {
            function UrlParts() {
                this.protocol = "";
                this.user = "";
                this.password = "";
                this.domain = "";
                this.port = "";
                this.resource = "";
                this.query = "";
                this.hash = "";
            }
            return UrlParts;
        }());
        util.UrlParts = UrlParts;
        var ArrayHandling;
        (function (ArrayHandling) {
            ArrayHandling[ArrayHandling["ToString"] = 0] = "ToString";
            ArrayHandling[ArrayHandling["Repeat"] = 1] = "Repeat";
            ArrayHandling[ArrayHandling["RepeatBrackets"] = 2] = "RepeatBrackets";
        })(ArrayHandling = util.ArrayHandling || (util.ArrayHandling = {}));
        var Url = (function () {
            function Url() {
            }
            Url.mergeResource = function (a, b) {
                if (!a)
                    return b;
                if (!b)
                    return a;
                if (b.charAt(0) == "/")
                    return b;
                var parts = a.split("/");
                if (parts.length == 0)
                    return b;
                if (parts.length > 0)
                    parts.pop();
                parts = parts.concat(b.split("/"));
                for (var i = 1; i < parts.length - 1; ++i) {
                    if (!parts[i])
                        parts.splice(i--, 1);
                }
                for (var i = 1; i < parts.length; ++i) {
                    if (parts[i] == "..")
                        parts.splice(--i, 2);
                }
                return parts.join("/");
            };
            Url.splitQuery = function (query, ah) {
                var result = {};
                if (!query)
                    return result;
                var parts = query.split("&");
                switch (ah) {
                    case ArrayHandling.ToString:
                        for (var i = 0; i < parts.length; ++i) {
                            var subParts = parts[i].split("=");
                            var name = subParts[0];
                            var value = decodeURIComponent(subParts[1]);
                            result[name] = value;
                        }
                        break;
                    case ArrayHandling.Repeat:
                        for (var i = 0; i < parts.length; ++i) {
                            var subParts = parts[i].split("=");
                            var name = subParts[0];
                            var value = decodeURIComponent(subParts[1]);
                            if (result[name] === undefined)
                                result[name] = value;
                            else if (typeof result[name] === "string")
                                result[name] = [result[name], value];
                            else
                                result[name].push(value);
                        }
                        break;
                    case ArrayHandling.RepeatBrackets:
                        for (var i = 0; i < parts.length; ++i) {
                            var subParts = parts[i].split("=");
                            var name = subParts[0];
                            var value = decodeURIComponent(subParts[1]);
                            if (name.slice(-2) == "[]") {
                                name = name.slice(0, -2);
                                if (!result[name])
                                    result[name] = [];
                                result[name].push(value);
                            }
                            else {
                                result[name] = value;
                            }
                        }
                        break;
                }
                return result;
            };
            Url.joinQuery = function (params, ah) {
                var parts = [];
                for (var name in params) {
                    if (Array.isArray(params[name])) {
                        switch (ah) {
                            case ArrayHandling.ToString:
                                parts.push(name + "=" + encodeURIComponent(params[name].toString()));
                                break;
                            case ArrayHandling.Repeat:
                                for (var i = 0; i < params[name].length; ++i)
                                    parts.push(name + "=" + encodeURIComponent(params[name][i]));
                                break;
                            case ArrayHandling.RepeatBrackets:
                                for (var i = 0; i < params[name].length; ++i)
                                    parts.push(name + "[]=" + encodeURIComponent(params[name][i]));
                                break;
                        }
                    }
                    else if (params[name] === undefined || params[name] === null) {
                        parts.push(name + "=");
                    }
                    else {
                        parts.push(name + "=" + encodeURIComponent(params[name].toString()));
                    }
                }
                return parts.join("&");
            };
            Url.mergeQuery = function (a, b, ah) {
                if (ah === void 0) { ah = ArrayHandling.ToString; }
                a = a || "";
                b = b || "";
                if (a.charAt(0) == "?")
                    a = a.slice(1);
                if (b.charAt(0) == "?")
                    b = b.slice(1);
                var aParams = Url.splitQuery(a, ah);
                var bParams = Url.splitQuery(b, ah);
                for (var i in bParams)
                    aParams[i] = bParams[i];
                return Url.joinQuery(aParams, ah);
            };
            Url.mergeHash = function (a, b) {
                a = a || "";
                b = b || "";
                if (a.charAt(0) == "#")
                    a = a.slice(1);
                if (b.charAt(0) == "#")
                    b = b.slice(1);
                var params = {};
                var aParts = a.split("&");
                var aId = "";
                for (var i = 0; i < aParts.length; ++i) {
                    var subParts = aParts[i].split("=");
                    if (subParts.length == 1)
                        aId = aId || subParts[0];
                    else if (subParts.length == 2)
                        params[subParts[0]] = subParts[1];
                }
                var bParts = b.split("&");
                var bId = "";
                for (var i = 0; i < bParts.length; ++i) {
                    var subParts = bParts[i].split("=");
                    if (subParts.length == 1)
                        bId = bId || subParts[0];
                    else if (subParts.length == 2)
                        params[subParts[0]] = subParts[1];
                }
                var id = aId || bId || "";
                var paramsString = Url.joinQuery(params, ArrayHandling.ToString);
                return paramsString ? id + "&" + paramsString : id;
            };
            Url.merge = function () {
                var urls = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    urls[_i] = arguments[_i];
                }
                var result = new UrlParts();
                for (var i = 0; i < urls.length; ++i) {
                    var parts = Url.parse(urls[i]);
                    result.protocol = parts.protocol || result.protocol;
                    if (result.user) {
                        result.user = parts.user;
                        result.password = result.password;
                    }
                    if (parts.domain) {
                        result.domain = parts.domain;
                        result.port = parts.port;
                        result.resource = parts.resource;
                    }
                    else {
                        result.resource = Url.mergeResource(result.resource, parts.resource);
                    }
                    result.query = Url.mergeQuery(result.query, parts.query);
                    result.hash = Url.mergeHash(result.hash, parts.hash);
                }
                return Url.format(result);
            };
            Url.getPath = function (parts) {
                var path = parts.resource || "/";
                if (parts.query)
                    path += "?" + parts.query;
                if (parts.hash)
                    path += "#" + parts.hash;
                return path;
            };
            Url.parse = function (url) {
                var parts = new UrlParts();
                if (!url)
                    return parts;
                var isFile = url.slice(0, 8) == "file:///";
                if (isFile)
                    url = url.slice(7);
                var parsed = util.StringEx.captureNamed(url, kr3m.REGEX_URL, kr3m.REGEX_URL_GROUPS);
                if (isFile)
                    parsed["protocol"] = "file";
                for (var i in parsed) {
                    if (parsed[i] !== undefined)
                        parts[i] = parsed[i];
                }
                return parts;
            };
            Url.format = function (parts) {
                var url = "";
                if (parts.protocol)
                    url += parts.protocol + "://";
                if (parts.user)
                    url += parts.user + ":" + parts.password + "@";
                if (parts.domain) {
                    url += parts.domain;
                    if (parts.port)
                        url += ":" + parts.port;
                }
                if (parts.resource) {
                    if (parts.domain && parts.resource.charAt(0) != "/")
                        url += "/";
                    url += parts.resource;
                }
                if (parts.query)
                    url += "?" + parts.query;
                if (parts.hash)
                    url += "#" + parts.hash;
                return url;
            };
            Url.getResourceFromUrl = function (url) {
                return Url.parse(url).resource;
            };
            Url.getQueryParams = function (url, ah) {
                if (ah === void 0) { ah = ArrayHandling.ToString; }
                var parts = Url.parse(url);
                var params = Url.splitQuery(parts.query, ah);
                return params;
            };
            Url.setQueryParams = function (url, params, ah) {
                if (ah === void 0) { ah = ArrayHandling.ToString; }
                var parts = Url.parse(url);
                parts.query = Url.joinQuery(params, ah);
                return Url.format(parts);
            };
            Url.addParameter = function (url, key, value, ah) {
                if (ah === void 0) { ah = ArrayHandling.ToString; }
                var params = Url.getQueryParams(url, ah);
                params[key] = value;
                return Url.setQueryParams(url, params, ah);
            };
            Url.addParameters = function (url, params, ah) {
                if (ah === void 0) { ah = ArrayHandling.ToString; }
                var old = Url.getQueryParams(url, ah);
                for (var i in params)
                    old[i] = params[i];
                return Url.setQueryParams(url, old, ah);
            };
            Url.removeParameter = function (url, key, ah) {
                if (ah === void 0) { ah = ArrayHandling.ToString; }
                var params = Url.getQueryParams(url, ah);
                if (typeof params[key] == "undefined")
                    return url;
                delete params[key];
                return Url.setQueryParams(url, params, ah);
            };
            Url.getMailToUrl = function (to, subject, body, cc, bcc) {
                var receivers = typeof to == "string" ? to : to.join(",");
                var headers = [];
                if (subject)
                    headers.push("subject=" + encodeURIComponent(subject));
                if (body)
                    headers.push("body=" + encodeURIComponent(body));
                if (cc !== undefined)
                    headers.push("cc=" + encodeURIComponent(typeof cc == "string" ? cc : cc.join(",")));
                if (bcc != undefined)
                    headers.push("bcc=" + encodeURIComponent(typeof bcc == "string" ? bcc : bcc.join(",")));
                var url = "mailto:" + receivers;
                if (headers.length > 0)
                    url += "?" + headers.join("&");
                return url;
            };
            return Url;
        }());
        util.Url = Url;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var Browser = (function () {
            function Browser() {
            }
            Browser.hasAdBlock = function (callback) {
                setTimeout(function () { return util.AdBlock.has(callback); }, 1);
            };
            Browser.isMobile = function () {
                if (location.search.indexOf("force-mobile") > -1)
                    return true;
                if (location.search.indexOf("force-iphone") > -1)
                    return true;
                var device = util.Device.getInstance();
                return !device.desktop;
            };
            Browser.isTablet = function () {
                if (location.search.indexOf("force-tablet") > -1)
                    return true;
                if (location.search.indexOf("force-ipad") > -1)
                    return true;
                var device = util.Device.getInstance();
                return device.tablet;
            };
            Browser.isPhone = function () {
                var device = util.Device.getInstance();
                return Browser.isMobile() && !device.tablet;
            };
            Browser.isIPhone = function () {
                var device = util.Device.getInstance();
                if (location.search.indexOf("force-iphone") > -1)
                    return true;
                return device.iPhone;
            };
            Browser.isFirefox = function () {
                var device = util.Device.getInstance();
                return device.firefox;
            };
            Browser.isAndroid = function () {
                var device = util.Device.getInstance();
                return device.android;
            };
            Browser.isAndroidStock = function () {
                var device = util.Device.getInstance();
                return device.androidStockBrowser;
            };
            Browser.isIOs = function () {
                var device = util.Device.getInstance();
                if ((location.search.indexOf("force-ios") > -1) ||
                    (location.search.indexOf("force-ios9") > -1) ||
                    (location.search.indexOf("force-ios10") > -1))
                    return true;
                return device.iOS;
            };
            Browser.isIOs9 = function () {
                var device = util.Device.getInstance();
                if (location.search.indexOf("force-ios9") > -1)
                    return true;
                return device.iOS9;
            };
            Browser.isIOs10 = function () {
                var device = util.Device.getInstance();
                if (location.search.indexOf("force-ios10") > -1)
                    return true;
                return device.iOS10;
            };
            Browser.isInternetExplorer = function () {
                var device = util.Device.getInstance();
                return device.ie;
            };
            Browser.isChrome = function () {
                var device = util.Device.getInstance();
                return device.chrome;
            };
            Browser.isIOSChrome = function () {
                var device = util.Device.getInstance();
                return device.iOSChrome;
            };
            Browser.isSafari = function () {
                var device = util.Device.getInstance();
                return device.safari;
            };
            Browser.supportsClickJacking = function () {
                if (Browser.isInternetExplorer())
                    return false;
                if (Browser.isSafari())
                    return false;
                return true;
            };
            Browser.isOldBrowser = function () {
                var device = util.Device.getInstance();
                return (device.ie && device.ieVersion < 9) ? true : false;
            };
            Browser.getCookie = function (name) {
                var pattern = new RegExp(name + "=([^;]*)");
                var matches = document.cookie.match(pattern);
                return matches ? decodeURIComponent(matches[1]) : null;
            };
            Browser.setCookie = function (name, value, ttlSeconds) {
                if (ttlSeconds === void 0) { ttlSeconds = 30 * 24 * 60 * 60; }
                value = encodeURIComponent(value);
                if (ttlSeconds > 0) {
                    var exDate = new Date();
                    exDate.setTime(exDate.getTime() + ttlSeconds * 1000);
                    value += "; expires=" + exDate.toUTCString();
                }
                document.cookie = name + "=" + value;
            };
            Browser.deleteCookie = function (name) {
                Browser.setCookie(name, "", -1);
            };
            Browser.getHighestSameDomainWindow = function (win) {
                if (win === void 0) { win = window; }
                try {
                    while (win != win.parent && win.document.domain == win.parent.document.domain)
                        win = win.parent;
                }
                catch (e) {
                }
                return win;
            };
            Browser.getQueryValues = function (win) {
                if (win === void 0) { win = window; }
                try {
                    var data = win.location.search;
                    if (!data || data == "")
                        return {};
                    data = data.substr(1);
                    var values = util.StringEx.splitAssoc(data);
                    var result = {};
                    for (var i in values)
                        result[i] = decodeURIComponent(values[i]);
                    return result;
                }
                catch (e) {
                    return {};
                }
            };
            Browser.getQueryValue = function (key, win) {
                if (win === void 0) { win = window; }
                try {
                    var data = win.location.search;
                    if (!data || data == "")
                        return null;
                    data = data.substr(1);
                    var values = util.StringEx.splitAssoc(data);
                    for (var i in values) {
                        if (i == key)
                            return decodeURIComponent(values[i]);
                    }
                    return null;
                }
                catch (e) {
                    return null;
                }
            };
            Browser.removeParam = function (key, win) {
                if (win === void 0) { win = window; }
                var sourceUrl = win.location.href;
                return util.Url.removeParameter(sourceUrl, key);
            };
            Browser.getBaseUrl = function (win) {
                if (win === void 0) { win = window; }
                var url = win.location.href;
                url = util.StringEx.getBefore(url, "?", true);
                url = util.StringEx.getBefore(url, "#", true);
                url = util.StringEx.getBefore(url, "/", false);
                url += "/";
                return url;
            };
            Browser.getLanguagePreferences = function () {
                var languages = navigator.language || navigator["userLanguage"] || "";
                var parts = languages.split(",");
                var result = [];
                for (var i = 0; i < parts.length; ++i) {
                    if (kr3m.REGEX_LOCALE.test(parts[i])) {
                        var lang = parts[i].slice(0, 2);
                        if (!util.Util.contains(result, lang))
                            result.push(lang);
                    }
                }
                return result;
            };
            Browser.getCountryPreferences = function () {
                var languages = navigator.language || navigator["userLanguage"] || "";
                var parts = languages.split(",");
                var result = [];
                for (var i = 0; i < parts.length; ++i) {
                    if (kr3m.REGEX_LOCALE.test(parts[i])) {
                        var country = parts[i].slice(-2);
                        if (!util.Util.contains(result, country))
                            result.push(country);
                    }
                }
                return result;
            };
            Browser.isHtml5Supported = function () {
                var elem = document.createElement("canvas");
                var isSupported = !!(elem.getContext && elem.getContext("2d"));
                return isSupported;
            };
            Browser.isWebAudioAvailable = function () {
                var win = window;
                if (typeof win.AudioContext != "undefined" || typeof win.webkitAudioContext != "undefined")
                    return true;
                return false;
            };
            return Browser;
        }());
        util.Browser = Browser;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var xml;
    (function (xml_1) {
        var Parser = (function () {
            function Parser() {
                this.S = { " ": true, "\n": true, "\r": true, "\t": true };
                this.NW = { " ": true, "\n": true, "\t": true, "<": true, ">": true, "=": true, "\"": true, "'": true, "\r": true };
                this.ESC = { amp: "&", lt: "<", gt: ">", quot: "\"" };
                this.styleAttibutesPattern = /^xs[a-z]+:/;
                this.stripStyleAttributes = true;
            }
            Parser.prototype.eat = function () {
                return this.rawXml.charAt(this.i++);
            };
            Parser.prototype.skipWS = function () {
                while (this.S[this.rawXml.charAt(this.i)])
                    ++this.i;
            };
            Parser.prototype.skipHeader = function () {
                var t = this.eat();
                while (t && t != "<")
                    t = this.eat();
                var found = false;
                if (this.rawXml.slice(this.i, this.i + 4) == "?xml") {
                    var t = this.eat();
                    while (t && t != "<")
                        t = this.eat();
                    found = true;
                }
                --this.i;
                return found;
            };
            Parser.prototype.readWord = function () {
                this.skipWS();
                var start = this.i;
                while (!this.NW[this.rawXml.charAt(this.i)])
                    ++this.i;
                return this.rawXml.slice(start, this.i);
            };
            Parser.prototype.readTill = function (token) {
                var start = this.i;
                var f = token.charAt(0);
                while (1) {
                    var t = this.eat();
                    if (!t)
                        break;
                    if (t == f) {
                        if (this.rawXml.slice(this.i - 1, this.i - 1 + token.length) == token)
                            break;
                    }
                }
                this.i += token.length - 1;
                return this.rawXml.slice(start, this.i - token.length);
            };
            Parser.prototype.readQuoted = function () {
                this.skipWS();
                var q = this.eat();
                return this.readTill(q);
            };
            Parser.prototype.readAttributes = function () {
                var attributes = {};
                while (true) {
                    this.skipWS();
                    var t = this.rawXml.charAt(this.i);
                    if (t == ">" || t == "/")
                        break;
                    var name = this.readWord();
                    this.skipWS();
                    ++this.i;
                    var value = this.readQuoted();
                    if (!this.stripStyleAttributes || !this.styleAttibutesPattern.test(name))
                        attributes[name] = value;
                }
                return attributes;
            };
            Parser.prototype.isNull = function (node) {
                for (var i in node._attributes) {
                    if ((i == "nil" || i.slice(-4) == ":nil") && node._attributes[i] == "true")
                        return true;
                }
                return false;
            };
            Parser.prototype.isPrimitive = function (node) {
                for (var i in node._attributes)
                    return false;
                for (var i in node) {
                    if (i.charAt(0) != "_")
                        return false;
                }
                return true;
            };
            Parser.prototype.fillChildNodes = function (node, nodes) {
                var temp = {};
                for (var i = 0; i < nodes.length; ++i) {
                    if (!temp[nodes[i]._tag])
                        temp[nodes[i]._tag] = [];
                    if (this.isNull(nodes[i]))
                        temp[nodes[i]._tag].push(null);
                    else if (this.isPrimitive(nodes[i]))
                        temp[nodes[i]._tag].push(nodes[i]._data);
                    else
                        temp[nodes[i]._tag].push(nodes[i]);
                }
                for (var tag in temp)
                    node[tag] = (temp[tag].length == 1) ? temp[tag][0] : temp[tag];
            };
            Parser.prototype.readNode = function () {
                var start = this.i;
                this.skipWS();
                ++this.i;
                var node = {};
                _a = this.readWord().match(/(?:([^\:]+)\:)?([^\:]+)/), node._ns = _a[1], node._tag = _a[2];
                if (node._tag.slice(-1) == "/") {
                    node._tag = node._tag.slice(0, -1);
                    this.i += 1;
                    return node;
                }
                node._attributes = this.readAttributes();
                var t = this.eat();
                if (t == "/") {
                    ++this.i;
                    return node;
                }
                var _b = this.readContent(), data = _b[0], nodes = _b[1];
                node._data = data.trim();
                this.fillChildNodes(node, nodes);
                this.skipWS();
                var skip = node._tag.length + (node._ns ? node._ns.length + 4 : 3);
                this.i += skip;
                return node;
                var _a;
            };
            Parser.prototype.readData = function () {
                this.i += 9;
                var start = this.i;
                var l = this.rawXml.length;
                while (this.i < l) {
                    while (this.i < l && this.rawXml.charAt(this.i) != "]")
                        ++this.i;
                    if (this.rawXml.slice(this.i, this.i + 3) == "]]>") {
                        this.i += 3;
                        return this.rawXml.slice(start, this.i - 3);
                    }
                    ++this.i;
                }
                throw new Error("invalid xml syntax - CDATA terminator expected");
            };
            Parser.prototype.unescape = function (escaped) {
                var unescaped = this.ESC[escaped];
                if (unescaped)
                    return unescaped;
                if (escaped.charAt(0) == "#")
                    return String.fromCharCode(parseInt(escaped.slice(1), 8));
                return String.fromCharCode(parseInt(escaped));
            };
            Parser.prototype.skipComment = function () {
                this.readTill("-->");
            };
            Parser.prototype.readContent = function () {
                this.skipWS();
                var content = "";
                var nodes = [];
                while (1) {
                    var t = this.eat();
                    if (!t)
                        break;
                    if (t == "<") {
                        t = this.eat();
                        this.i -= 2;
                        if (t == "!") {
                            if (this.rawXml.slice(this.i, this.i + 4) == "<!--")
                                this.skipComment();
                            else
                                content += this.readData();
                        }
                        else if (t == "/") {
                            break;
                        }
                        else {
                            nodes.push(this.readNode());
                        }
                    }
                    else if (t == "&") {
                        var escaped = this.readTill(";");
                        content += this.unescape(escaped);
                    }
                    else {
                        content += t;
                    }
                }
                return [content, nodes];
            };
            Parser.prototype.parse = function (rawXml) {
                this.rawXml = rawXml;
                this.i = 0;
                if (!this.skipHeader() && this.i > 3)
                    return undefined;
                var _a = this.readContent(), content = _a[0], nodes = _a[1];
                return nodes.length == 1 ? nodes[0] : undefined;
            };
            return Parser;
        }());
        xml_1.Parser = Parser;
        function parseString(rawXml) {
            var parser = new kr3m.xml.Parser();
            return parser.parse(rawXml);
        }
        xml_1.parseString = parseString;
        function parseXml(xml) {
            var rawXml = new XMLSerializer().serializeToString(xml.documentElement);
            return parseString(rawXml);
        }
        xml_1.parseXml = parseXml;
    })(xml = kr3m.xml || (kr3m.xml = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var Ajax = (function () {
            function Ajax() {
            }
            Ajax.getTypeFromUrl = function (url) {
                var resource = util.Url.getResourceFromUrl(url);
                for (var i = 0; i < Ajax.typesByExtension.length; ++i) {
                    var item = Ajax.typesByExtension[i];
                    if (item.pattern.test(resource))
                        return item.type;
                }
                return undefined;
            };
            Ajax.getXMLHttpRequestObject = function () {
                var ref = null;
                if (window.XMLHttpRequest)
                    ref = new XMLHttpRequest();
                else if (window.ActiveXObject)
                    ref = new ActiveXObject("MSXML2.XMLHTTP.3.0");
                return ref;
            };
            Ajax.responseHandler = function (request, callback, type, errorCallback) {
                if (request.readyState != 4)
                    return;
                var status = request.status;
                if (status >= 200 && status < 300) {
                    if (callback) {
                        try {
                            var headers = {};
                            var headerStr = request.getAllResponseHeaders();
                            if (headerStr && (headerStr.length > 0)) {
                                var headerPairs = headerStr.split('\u000d\u000a');
                                for (var i = 0; i < headerPairs.length; ++i) {
                                    var sep = headerPairs[i].indexOf('\u003a\u0020');
                                    if (sep > 0)
                                        headers[headerPairs[i].substr(0, sep)] = headerPairs[i].substr(sep + 2);
                                }
                            }
                            switch (type) {
                                case "json":
                                    callback(util.Json.decode(request.responseText), headers);
                                    break;
                                case "xml":
                                    if (request.responseXML)
                                        return callback(request.responseXML, headers);
                                    if (DOMParser) {
                                        var parser = new DOMParser();
                                        var xml = parser.parseFromString(request.responseText, "text/xml");
                                        return callback(xml, headers);
                                    }
                                    util.Log.logError("error while loading xml file");
                                    callback(null, headers);
                                    break;
                                case "text":
                                    callback(request.responseText, headers);
                                    break;
                                case "binary":
                                    callback(request.response, headers);
                                    break;
                                case "image":
                                    callback(request.response, headers);
                                    break;
                                case "arraybuffer":
                                    callback(request.response, headers);
                                    break;
                                case "xml->json":
                                    callback(kr3m.xml.parseString(request.responseText), headers);
                                    break;
                            }
                        }
                        catch (e) {
                            util.Log.logError(e);
                        }
                    }
                }
                else if (errorCallback) {
                    errorCallback(status);
                }
            };
            Ajax.adjustMimeType = function (request, url, desiredType) {
                if (request instanceof XMLHttpRequest) {
                    switch (desiredType) {
                        case "json":
                            request.overrideMimeType("application/json");
                            break;
                        case "text":
                            request.overrideMimeType("text/plain");
                            break;
                    }
                }
            };
            Ajax.call = function (url, callback, type, errorCallback) {
                type = type || Ajax.getTypeFromUrl(url) || "json";
                var request = Ajax.getXMLHttpRequestObject();
                Ajax.adjustMimeType(request, url, type);
                request.onreadystatechange = Ajax.responseHandler.bind(null, request, callback, type, errorCallback);
                request.open("GET", url, true);
                if (type == "arraybuffer")
                    request.responseType = type;
                request.send();
                return request;
            };
            Ajax.callTimeout = function (url, successCallback, timeoutCallback, timeout, type) {
                if (timeout <= 0) {
                    Ajax.call(url, successCallback, type);
                    return;
                }
                var xhr = null;
                kr3m.async.Timeout.call(timeout, function (callback) {
                    xhr = Ajax.call(url, callback, type);
                }, successCallback, function () {
                    xhr.abort();
                    timeoutCallback();
                });
            };
            Ajax.postCall = function (url, callback, data, type) {
                if (data === void 0) { data = {}; }
                type = type || Ajax.getTypeFromUrl(url) || "json";
                var request = Ajax.getXMLHttpRequestObject();
                var encoded = {};
                for (var i in data)
                    encoded[i] = encodeURIComponent(data[i]);
                Ajax.adjustMimeType(request, url, type);
                var params = util.StringEx.joinAssoc(encoded);
                request.onreadystatechange = Ajax.responseHandler.bind(null, request, callback, type, null);
                request.open("POST", url, true);
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                request.send(params);
                return request;
            };
            Ajax.postCallTimeout = function (url, successCallback, timeoutCallback, timeout, data, type) {
                if (data === void 0) { data = {}; }
                if (timeout <= 0) {
                    Ajax.postCall(url, successCallback, data, type);
                    return;
                }
                var xhr = null;
                kr3m.async.Timeout.call(timeout, function (callback) {
                    xhr = Ajax.postCall(url, callback, data, type);
                }, successCallback, function () {
                    xhr.abort();
                    timeoutCallback();
                });
            };
            Ajax.callService = function (method, data, callback, type, errorCallback) {
                if (data === void 0) { data = {}; }
                var params = "method=" + method + "&payload=" + encodeURIComponent(util.Json.encode(data));
                if (Ajax.serviceUrl)
                    var url = Ajax.serviceUrl + "?_=" + (new Date()).getTime();
                else
                    var url = util.Browser.getBaseUrl() + "gateway?_=" + (new Date()).getTime();
                type = type || Ajax.getTypeFromUrl(url) || "json";
                var request = Ajax.getXMLHttpRequestObject();
                Ajax.adjustMimeType(request, url, type);
                request.onreadystatechange = Ajax.responseHandler.bind(null, request, callback, type, errorCallback);
                request.open("POST", url, true);
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                request.send(params);
                return request;
            };
            Ajax.callServiceUnique = function (method, data, callback, type, errorCallback) {
                if (data === void 0) { data = {}; }
                var oldXhr = Ajax.pendingXhr[method];
                if (oldXhr)
                    oldXhr.abort();
                var xhr = Ajax.callService(method, data, function (response, headers) {
                    delete Ajax.pendingXhr[method];
                    callback && callback(response, headers);
                }, null, errorCallback);
                Ajax.pendingXhr[method] = xhr;
            };
            Ajax.callServiceTimeout = function (method, data, successCallback, timeoutCallback, timeout, type, errorCallback) {
                if (timeout <= 0) {
                    Ajax.callService(method, data, successCallback, type, errorCallback);
                    return;
                }
                var xhr = null;
                kr3m.async.Timeout.call(timeout, function (callback) {
                    xhr = Ajax.callService(method, data, callback, type, errorCallback);
                }, successCallback, function () {
                    xhr.abort();
                    timeoutCallback();
                });
            };
            Ajax.pendingXhr = {};
            Ajax.typesByExtension = [
                { pattern: /\.bmp$/i, type: "image" },
                { pattern: /\.css$/i, type: "text" },
                { pattern: /\.fnt$/i, type: "xml->json" },
                { pattern: /\.gif$/i, type: "image" },
                { pattern: /\.html$/i, type: "text" },
                { pattern: /\.jpeg$/i, type: "image" },
                { pattern: /\.jpg$/i, type: "image" },
                { pattern: /\.js$/i, type: "text" },
                { pattern: /\.json$/i, type: "json" },
                { pattern: /\.md5anim$/i, type: "text" },
                { pattern: /\.md5mesh$/i, type: "text" },
                { pattern: /\.mp3$/i, type: "binary" },
                { pattern: /\.ogg$/i, type: "binary" },
                { pattern: /\.php$/i, type: "json" },
                { pattern: /\.png$/i, type: "image" },
                { pattern: /\.txt$/i, type: "text" },
                { pattern: /\.xml$/i, type: "xml" }
            ];
            return Ajax;
        }());
        util.Ajax = Ajax;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var services;
    (function (services) {
        var AjaxStub = (function () {
            function AjaxStub() {
                this.cache = {};
                this.showServiceCallsInLog = false;
                this.htmlEscapeStrings = true;
                this.timeoutDuration = 0;
                this.cacheDuration = 600000;
            }
            AjaxStub.prototype.cleanResult = function (key, value, result) {
                var type = typeof (value);
                if (type == "string") {
                    var newValue = value;
                    if (this.htmlEscapeStrings)
                        newValue = kr3m.util.Util.encodeHtml(newValue);
                    if (newValue != value)
                        kr3m.util.Util.setProperty(result, key, newValue);
                }
            };
            AjaxStub.prototype.callService = function (serviceName, params, callback, timeoutCallback, errorCallback) {
                var _this = this;
                if (params === void 0) { params = {}; }
                if (this.showServiceCallsInLog) {
                    kr3m.util.Log.log("<== " + serviceName);
                    kr3m.util.Log.log(params);
                }
                kr3m.util.Ajax.callServiceTimeout(serviceName, params, function (result, headers) {
                    kr3m.util.Util.forEachRecursive(result, _this.cleanResult.bind(_this));
                    if (_this.showServiceCallsInLog) {
                        kr3m.util.Log.log("==> " + serviceName);
                        kr3m.util.Log.log(result);
                    }
                    callback && callback(result, headers);
                }, function () {
                    if (_this.showServiceCallsInLog)
                        kr3m.util.Log.log("<== " + serviceName + " [TIMEOUT]");
                    timeoutCallback && timeoutCallback();
                }, this.timeoutDuration, null, errorCallback);
            };
            AjaxStub.prototype.callServiceCached = function (serviceName, params, callback, timeoutCallback, errorCallback) {
                var _this = this;
                if (params === void 0) { params = {}; }
                if (!callback)
                    return this.callService(serviceName, params);
                var key = serviceName + "(" + kr3m.util.Json.encode(params) + ")";
                var item = this.cache[key];
                if (item && item.expires >= new Date())
                    return callback(kr3m.util.Util.clone(item.response));
                this.callService(serviceName, params, function (response) {
                    var expires = new Date();
                    expires.setTime(expires.getTime() + _this.cacheDuration);
                    var item = { expires: expires, response: response };
                    _this.cache[key] = item;
                    callback(kr3m.util.Util.clone(item.response));
                }, timeoutCallback, errorCallback);
            };
            AjaxStub.prototype.clearCache = function (serviceName, params) {
                if (params) {
                    var key = serviceName + "(" + kr3m.util.Json.encode(params) + ")";
                    if (this.cache[key])
                        delete this.cache[key];
                }
                else {
                    serviceName += "(";
                    for (var i in this.cache) {
                        if (i.indexOf(serviceName) == 0)
                            delete this.cache[i];
                    }
                }
            };
            return AjaxStub;
        }());
        services.AjaxStub = AjaxStub;
    })(services = kr3m.services || (kr3m.services = {}));
})(kr3m || (kr3m = {}));
var cuboro;
(function (cuboro) {
    var stubs;
    (function (stubs) {
        var Abstract = (function (_super) {
            __extends(Abstract, _super);
            function Abstract() {
                var _this = _super.call(this) || this;
                _this.htmlEscapeStrings = false;
                return _this;
            }
            return Abstract;
        }(kr3m.services.AjaxStub));
        stubs.Abstract = Abstract;
    })(stubs = cuboro.stubs || (cuboro.stubs = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var stubs;
    (function (stubs) {
        var User = (function (_super) {
            __extends(User, _super);
            function User() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            User.prototype.login = function (casUserId, casToken, callback) {
                var params = { casUserId: casUserId, casToken: casToken };
                this.callService("User.login", params, function (response) { return callback && callback(response.data, response.status); });
            };
            User.prototype.logout = function (callback) {
                var params = {};
                this.callService("User.logout", params, function (response) { return callback && callback(response.status); });
            };
            return User;
        }(stubs.Abstract));
        stubs.User = User;
    })(stubs = cuboro.stubs || (cuboro.stubs = {}));
})(cuboro || (cuboro = {}));
var sUser = new cuboro.stubs.User();
var cuboro;
(function (cuboro) {
    var vo;
    (function (vo) {
        var User = (function () {
            function User() {
            }
            return User;
        }());
        vo.User = User;
    })(vo = cuboro.vo || (cuboro.vo = {}));
})(cuboro || (cuboro = {}));
var kr3m;
(function (kr3m) {
    var model;
    (function (model) {
        var EventDispatcher = (function () {
            function EventDispatcher() {
                this.onListeners = {};
                this.onceListeners = {};
            }
            EventDispatcher.prototype.on = function (eventName, listener, context) {
                if (!this.onListeners[eventName])
                    this.onListeners[eventName] = [];
                var meta = kr3m.util.Util.getBy(this.onListeners[eventName], "context", context, 0, true);
                if (meta) {
                    meta.listeners.push(listener);
                    return;
                }
                this.onListeners[eventName].push({ context: context, listeners: [listener] });
            };
            EventDispatcher.prototype.once = function (eventName, listener, context) {
                if (!this.onceListeners[eventName])
                    this.onceListeners[eventName] = [];
                var meta = kr3m.util.Util.getBy(this.onceListeners[eventName], "context", context, 0, true);
                if (meta) {
                    meta.listeners.push(listener);
                    return;
                }
                this.onceListeners[eventName].push({ context: context, listeners: [listener] });
            };
            EventDispatcher.prototype.off = function () {
                var first = kr3m.util.Util.getFirstOfType.bind(null, arguments);
                var eventName = first("string");
                var listener = first("function");
                var context = first("object");
                var listenerTypes = [this.onListeners, this.onceListeners];
                var eventNames = eventName ? [eventName] : kr3m.util.Util.merge(Object.keys(this.onListeners), Object.keys(this.onceListeners));
                for (var i = 0; i < listenerTypes.length; ++i) {
                    for (var j = 0; j < eventNames.length; ++j) {
                        var metas = listenerTypes[i][eventNames[j]];
                        if (!metas)
                            continue;
                        for (var k = 0; k < metas.length; ++k) {
                            if (context && context !== metas[k].context)
                                continue;
                            if (listener)
                                kr3m.util.Util.remove(metas[k].listeners, listener, true);
                            else
                                metas[k].listeners = [];
                        }
                    }
                }
            };
            EventDispatcher.prototype.dispatch = function (eventName, data, context) {
                if (this.onListeners[eventName]) {
                    for (var i = 0; i < this.onListeners[eventName].length; ++i) {
                        for (var j = 0; j < this.onListeners[eventName][i].listeners.length; ++j)
                            this.onListeners[eventName][i].listeners[j].call(context || this.onListeners[eventName][i].context || this, data);
                    }
                }
                if (this.onceListeners[eventName]) {
                    for (var i = 0; i < this.onceListeners[eventName].length; ++i) {
                        for (var j = 0; j < this.onceListeners[eventName][i].listeners.length; ++j)
                            this.onceListeners[eventName][i].listeners[j].call(context || this.onceListeners[eventName][i].context || this, data);
                    }
                    this.onceListeners[eventName] = [];
                }
            };
            return EventDispatcher;
        }());
        model.EventDispatcher = EventDispatcher;
    })(model = kr3m.model || (kr3m.model = {}));
})(kr3m || (kr3m = {}));
var cuboro;
(function (cuboro) {
    var clientmodels;
    (function (clientmodels) {
        var User = (function (_super) {
            __extends(User, _super);
            function User() {
                var _this = _super.call(this) || this;
                casClient.addEventListener(_this.handleCasEvent.bind(_this));
                return _this;
            }
            User.prototype.handleCasEvent = function (eventName, params) {
                var _this = this;
                switch (eventName) {
                    case cas.EVENT_ONLINE:
                        this.dispatch("login");
                        casClient.getUser(function (casUser) {
                            casClient.getToken(function (casToken) {
                                sUser.login(casUser.id, casToken, function (user, status) {
                                    if (status != kr3m.SUCCESS) {
                                        _this.user = null;
                                        _this.casUser = null;
                                        return;
                                    }
                                    _this.user = user;
                                    _this.casUser = casUser;
                                    _this.dispatch("loggedIn");
                                });
                            });
                        });
                        break;
                    case cas.EVENT_LOGOUT:
                        this.user = null;
                        this.casUser = null;
                        sUser.logout();
                        this.dispatch("logout");
                        break;
                }
            };
            User.prototype.isLoggedIn = function () {
                return !!this.user;
            };
            User.prototype.getUserId = function () {
                return this.isLoggedIn() ? this.user.id : null;
            };
            User.prototype.getUser = function () {
                return this.isLoggedIn() ? this.user : null;
            };
            return User;
        }(kr3m.model.EventDispatcher));
        clientmodels.User = User;
    })(clientmodels = cuboro.clientmodels || (cuboro.clientmodels = {}));
})(cuboro || (cuboro = {}));
var mUser = new cuboro.clientmodels.User();
var kr3m;
(function (kr3m) {
    var ui2;
    (function (ui2) {
        var Element = (function () {
            function Element(parentNode, options) {
                this.children = [];
                this.hidden = false;
                this.options = options || {};
                if (options) {
                    if (options.domNode)
                        this.dom = options.domNode;
                    else if (options.tagName)
                        this.dom = document.createElement(options.tagName);
                    if (options.classes) {
                        if (typeof options.classes == "string")
                            this.addClass.apply(this, options.classes.split(/\s+/));
                        else
                            this.addClass.apply(this, options.classes);
                    }
                    if (options.css)
                        this.setCss(options.css);
                    this.initOptionsAttributes("name", "title", "id");
                }
                if (parentNode) {
                    if (parentNode instanceof Element) {
                        parentNode.append(this, options && options.hidden);
                    }
                    else if (typeof parentNode == "string") {
                        var node = document.getElementById(parentNode);
                        if (node)
                            node.appendChild(this.dom);
                    }
                    else {
                        parentNode.appendChild(this.dom);
                    }
                }
            }
            Element.prototype.getDomElement = function () {
                return this.dom;
            };
            Element.prototype.initOptionsAttributes = function () {
                var names = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    names[_i] = arguments[_i];
                }
                if (!this.options)
                    return;
                for (var i = 0; i < names.length; ++i) {
                    if (this.options[names[i]] !== undefined)
                        this.setAttribute(names[i], this.options[names[i]]);
                }
            };
            Element.prototype.getParentOfClass = function (cls) {
                var temp = this.parentElement;
                while (temp) {
                    if (temp instanceof cls)
                        return temp;
                    temp = temp.parentElement;
                }
                return undefined;
            };
            Element.prototype.append = function (node, hidden) {
                if (hidden === void 0) { hidden = false; }
                node.parentElement = this;
                node.hidden = hidden;
                this.children.push(node);
                if (!hidden)
                    this.dom.appendChild(node.dom);
            };
            Element.prototype.insert = function (node, position, hidden) {
                if (hidden === void 0) { hidden = false; }
                var oldChild = this.children[position];
                if (!oldChild)
                    return this.append(node);
                node.parentElement = this;
                node.hidden = hidden;
                this.children.splice(position, 0, node);
                if (!hidden)
                    this.dom.insertBefore(node.dom, oldChild.dom);
            };
            Element.prototype.insertBefore = function (node, oldNode, hidden) {
                if (hidden === void 0) { hidden = false; }
                var position = this.children.indexOf(oldNode);
                if (position < 0)
                    return this.append(oldNode);
                node.parentElement = this;
                node.hidden = hidden;
                this.children.splice(position, 0, node);
                if (!hidden)
                    this.dom.insertBefore(node.dom, oldNode.dom);
            };
            Element.prototype.prepend = function (node, hidden) {
                if (hidden === void 0) { hidden = false; }
                this.insert(node, 0, hidden);
            };
            Element.prototype.isInFullScreen = function () {
                var fieldNames = [
                    "fullscreenElement",
                    "mozFullScreenElement",
                    "webkitFullscreenElement"
                ];
                for (var i = 0; i < fieldNames.length; ++i) {
                    if (document[fieldNames[i]] == this.dom)
                        return true;
                }
                return false;
            };
            Element.prototype.enterFullscreen = function () {
                var funcNames = [
                    "requestFullScreen",
                    "requestFullscreen",
                    "mozRequestFullScreen",
                    "mozRequestFullscreen",
                    "webkitRequestFullScreen",
                    "webkitRequestFullscreen",
                    "msRequestFullScreen",
                    "msRequestFullscreen"
                ];
                for (var i = 0; i < funcNames.length; ++i) {
                    var func = this.dom[funcNames[i]];
                    if (func) {
                        func.call(this.dom);
                        return true;
                    }
                }
                return false;
            };
            Element.prototype.setCss = function () {
                if (arguments.length == 2) {
                    this.dom.style[arguments[0]] = arguments[1].toString();
                }
                else {
                    var styles = arguments[0];
                    for (var name in styles)
                        this.dom.style[name] = styles[name].toString();
                }
            };
            Element.prototype.removeAttribute = function (name) {
                this.dom.removeAttribute(name);
            };
            Element.prototype.getAttribute = function (name) {
                return this.dom.getAttribute(name);
            };
            Element.prototype.setAttribute = function (name, value) {
                if (value === false)
                    this.dom.removeAttribute(name);
                else if (value === true)
                    this.dom.setAttribute(name, "");
                else
                    this.dom.setAttribute(name, value);
            };
            Element.prototype.setAttributes = function (values) {
                for (var name in values)
                    this.setAttribute(name, values[name]);
            };
            Element.prototype.scrollTo = function () {
                this.dom.scrollIntoView(true);
            };
            Element.prototype.hide = function () {
                if (this.hidden)
                    return;
                this.hidden = true;
                if (this.parentElement) {
                    this.parentElement.dom.removeChild(this.dom);
                }
                else {
                }
            };
            Element.prototype.show = function () {
                if (!this.hidden)
                    return;
                this.hidden = false;
                if (this.parentElement) {
                    var position = this.parentElement.children.indexOf(this) + 1;
                    var sibling = this.parentElement.children[position];
                    while (sibling && sibling.hidden)
                        sibling = this.parentElement.children[++position];
                    if (sibling)
                        this.parentElement.dom.insertBefore(this.dom, sibling.dom);
                    else
                        this.parentElement.dom.appendChild(this.dom);
                }
                else {
                }
            };
            Element.prototype.removeAllChildren = function (clearHtml) {
                if (clearHtml === void 0) { clearHtml = true; }
                this.children = [];
                if (clearHtml)
                    this.dom.innerHTML = "";
            };
            Element.prototype.forEachChild = function (callback) {
                for (var i = 0; i < this.children.length; ++i)
                    callback(this.children[i]);
            };
            Element.prototype.isVisible = function (recursive) {
                if (recursive === void 0) { recursive = true; }
                var node = this.dom;
                while (node) {
                    if (!node)
                        return false;
                    if (getComputedStyle(node).display == "none")
                        return false;
                    if (node == document.body || !recursive)
                        return true;
                    node = node.parentNode;
                }
                return false;
            };
            Element.prototype.addClass = function () {
                var classNames = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    classNames[_i] = arguments[_i];
                }
                (_a = this.dom.classList).add.apply(_a, classNames);
                var _a;
            };
            Element.prototype.removeClass = function () {
                var classNames = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    classNames[_i] = arguments[_i];
                }
                (_a = this.dom.classList).remove.apply(_a, classNames);
                var _a;
            };
            Element.prototype.setClass = function (className, isSet) {
                this.dom.classList.toggle(className, isSet);
            };
            Element.prototype.hasClass = function (className) {
                return this.dom.classList.contains(className);
            };
            Element.prototype.toggleClass = function (className) {
                return this.dom.classList.toggle(className);
            };
            Element.prototype.setId = function (id) {
                this.dom.id = id;
            };
            Element.prototype.getId = function () {
                return this.dom.id;
            };
            Element.prototype.focus = function () {
                this.dom.focus();
            };
            Element.prototype.blur = function () {
                this.dom.blur();
            };
            Element.prototype.setName = function (name) {
                this.dom.setAttribute("name", name);
            };
            Element.prototype.getName = function () {
                return this.dom.getAttribute("name");
            };
            Element.prototype.setHtml = function (html) {
                this.removeAllChildren();
                this.dom.innerHTML = html;
            };
            Element.prototype.setText = function (text) {
                this.setHtml(kr3m.util.Util.encodeHtml(text));
            };
            Element.prototype.getHtml = function () {
                return this.dom.innerHTML;
            };
            Element.prototype.getText = function () {
                return kr3m.util.Util.encodeHtml(this.getHtml());
            };
            Element.prototype.appendHtml = function (html) {
                this.setHtml(this.getHtml() + html);
            };
            Element.prototype.appendText = function (text) {
                this.setHtml(this.getHtml() + kr3m.util.Util.encodeHtml(text));
            };
            Element.prototype.on = function (eventName, listener) {
                this.dom.addEventListener(eventName.toLowerCase(), listener, { capture: false, once: false });
            };
            Element.prototype.once = function (eventName, listener) {
                this.dom.addEventListener(eventName.toLowerCase(), listener, { capture: false, once: true });
            };
            Element.prototype.off = function (eventName, listener) {
                this.dom.removeEventListener(eventName.toLowerCase(), listener, false);
            };
            Element.prototype.dispatch = function (eventName) {
                var event = new Event(eventName);
                this.dom.dispatchEvent(event);
            };
            Element.prototype.trigger = function (eventName) {
                this.dispatch(eventName);
            };
            return Element;
        }());
        ui2.Element = Element;
    })(ui2 = kr3m.ui2 || (kr3m.ui2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var ui2;
    (function (ui2) {
        var Div = (function (_super) {
            __extends(Div, _super);
            function Div(parentNode, options) {
                return _super.call(this, parentNode, kr3m.util.Util.mergeAssoc(options, { tagName: "div" })) || this;
            }
            return Div;
        }(ui2.Element));
        ui2.Div = Div;
    })(ui2 = kr3m.ui2 || (kr3m.ui2 = {}));
})(kr3m || (kr3m = {}));
var cuboro;
(function (cuboro) {
    var cms;
    (function (cms) {
        var Footer = (function (_super) {
            __extends(Footer, _super);
            function Footer(parentElement) {
                var _this = _super.call(this, parentElement) || this;
                _this.addClass("footer");
                return _this;
            }
            return Footer;
        }(kr3m.ui2.Div));
        cms.Footer = Footer;
    })(cms = cuboro.cms || (cuboro.cms = {}));
})(cuboro || (cuboro = {}));
var kr3m;
(function (kr3m) {
    var ui2;
    (function (ui2) {
        var Img = (function (_super) {
            __extends(Img, _super);
            function Img(parentNode, options) {
                var _this = _super.call(this, parentNode, kr3m.util.Util.mergeAssoc(options, { tagName: "img" })) || this;
                _this.initOptionsAttributes("src", "alt", "title");
                if (_this.options.caption) {
                    _this.setAttribute("title", _this.options.title || _this.options.caption);
                    _this.setAttribute("alt", _this.options.alt || _this.options.caption);
                }
                return _this;
            }
            Img.prototype.setSrc = function (src) {
                this.setAttribute("src", src);
            };
            Img.prototype.setUrl = function (url) {
                this.setSrc(url);
            };
            Img.prototype.getSrc = function () {
                return this.getAttribute("src");
            };
            Img.prototype.getUrl = function () {
                return this.getSrc();
            };
            Img.prototype.getNaturalWidth = function () {
                return this.dom.naturalWidth;
            };
            Img.prototype.getNaturalHeight = function () {
                return this.dom.naturalHeight;
            };
            return Img;
        }(ui2.Element));
        ui2.Img = Img;
    })(ui2 = kr3m.ui2 || (kr3m.ui2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var async;
    (function (async) {
        var Dom = (function () {
            function Dom() {
            }
            Dom.addCssFromString = function (css, callback, errorCallback, rootUrl) {
                if (!css)
                    return errorCallback && errorCallback();
                if (rootUrl) {
                    css = css.replace(/url\s*\(\s*["']?(.+?)["']?\s*\)/ig, function (match, url) {
                        return "url('" + kr3m.util.Url.merge(rootUrl, url) + "')";
                    });
                }
                var styleObj = document.createElement("style");
                styleObj.innerHTML = css;
                document.body.appendChild(styleObj);
                callback && callback();
            };
            Dom.addCssLink = function (cssUrl, callback, errorCallback) {
                if (Dom.addedLinks[cssUrl] == kr3m.SUCCESS)
                    return callback();
                if (Dom.addedLinks[cssUrl] == kr3m.ERROR_EXTERNAL)
                    return errorCallback && errorCallback();
                if (Dom.addedLinks[cssUrl] == "LOADING") {
                    setTimeout(function () { return Dom.addCssLink(cssUrl, callback, errorCallback); }, 100);
                    return;
                }
                Dom.addedLinks[cssUrl] = "LOADING";
                var obj = document.createElement("link");
                obj.rel = "stylesheet";
                obj.type = "text\/css";
                obj.onerror = function () {
                    Dom.addedLinks[cssUrl] = kr3m.ERROR_EXTERNAL;
                    errorCallback && errorCallback();
                };
                obj.onload = function () {
                    Dom.addedLinks[cssUrl] = kr3m.SUCCESS;
                    callback && callback();
                };
                document.body.appendChild(obj);
                obj.href = cssUrl;
            };
            Dom.addJsLink = function (jsUrl, callback, errorCallback) {
                if (Dom.addedLinks[jsUrl] == kr3m.SUCCESS)
                    return callback && callback();
                if (Dom.addedLinks[jsUrl] == kr3m.ERROR_EXTERNAL)
                    return errorCallback && errorCallback();
                if (Dom.addedLinks[jsUrl] == "LOADING") {
                    setTimeout(function () { return Dom.addCssLink(jsUrl, callback, errorCallback); }, 100);
                    return;
                }
                Dom.addedLinks[jsUrl] = "LOADING";
                var obj = document.createElement("script");
                obj.type = "text\/javascript";
                obj.onerror = function () {
                    Dom.addedLinks[jsUrl] = kr3m.ERROR_EXTERNAL;
                    errorCallback && errorCallback();
                };
                obj.onload = function () {
                    Dom.addedLinks[jsUrl] = kr3m.SUCCESS;
                    callback && callback();
                };
                document.body.appendChild(obj);
                obj.src = jsUrl;
            };
            Dom.addedLinks = {};
            return Dom;
        }());
        async.Dom = Dom;
    })(async = kr3m.async || (kr3m.async = {}));
})(kr3m || (kr3m = {}));
kr3m.async.Dom.addCssFromString(".tab {\n  border: solid black 2px;\n  font-weight: bold;\n  padding: 10px;\n  text-decoration: none;\n  margin-right: 10px;\n  background-color: white;\n}\n.tab.selected {\n  background-color: yellow;\n}\n.tabContainer {\n  padding: 10px;\n  border-top: solid black 2px;\n  border-bottom: solid black 2px;\n}\n");
var kr3m;
(function (kr3m) {
    var ui2;
    (function (ui2) {
        var cms;
        (function (cms) {
            var CasLoginStatus = (function (_super) {
                __extends(CasLoginStatus, _super);
                function CasLoginStatus() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return CasLoginStatus;
            }(kr3m.ui2.Div));
            cms.CasLoginStatus = CasLoginStatus;
        })(cms = ui2.cms || (ui2.cms = {}));
    })(ui2 = kr3m.ui2 || (kr3m.ui2 = {}));
})(kr3m || (kr3m = {}));
var cuboro;
(function (cuboro) {
    var cms;
    (function (cms) {
        var Header = (function (_super) {
            __extends(Header, _super);
            function Header(parentElement) {
                var _this = _super.call(this, parentElement) || this;
                _this.addClass("header");
                new kr3m.ui2.Img(_this, { src: "../img/logo.png", classes: "logo", css: { "width": "30vw", "margin-left": "30vw" } });
                new kr3m.ui2.cms.CasLoginStatus(_this);
                return _this;
            }
            return Header;
        }(kr3m.ui2.Div));
        cms.Header = Header;
    })(cms = cuboro.cms || (cuboro.cms = {}));
})(cuboro || (cuboro = {}));
var kr3m;
(function (kr3m) {
    var ui2;
    (function (ui2) {
        var ex;
        (function (ex) {
            var ScreenManager = (function (_super) {
                __extends(ScreenManager, _super);
                function ScreenManager(parentNode, options) {
                    var _this = _super.call(this, parentNode, options) || this;
                    _this.addClass("screenManager");
                    return _this;
                }
                ScreenManager.prototype.addScreen = function (name, options) {
                    options = options || {};
                    options.name = name;
                    return new ex.Screen(this, options);
                };
                ScreenManager.prototype.hasScreen = function (name) {
                    for (var i = 0; i < this.children.length; ++i) {
                        if (this.children[i].getName() == name)
                            return true;
                    }
                    return false;
                };
                ScreenManager.prototype.showScreen = function (name, data) {
                    for (var i = 0; i < this.children.length; ++i) {
                        if (this.children[i] instanceof ex.Screen) {
                            var screen = this.children[i];
                            if (screen.getName() == name) {
                                if (screen.firstRefresh)
                                    screen.refreshInit(data);
                                screen.refresh(data);
                                screen.firstRefresh = false;
                                screen.show();
                            }
                            else if (screen.isVisible()) {
                                screen.hide();
                            }
                        }
                    }
                };
                return ScreenManager;
            }(kr3m.ui2.Div));
            ex.ScreenManager = ScreenManager;
        })(ex = ui2.ex || (ui2.ex = {}));
    })(ui2 = kr3m.ui2 || (kr3m.ui2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var ui2;
    (function (ui2) {
        var ex;
        (function (ex) {
            var Screen = (function (_super) {
                __extends(Screen, _super);
                function Screen(manager, options) {
                    var _this = _super.call(this, manager, options) || this;
                    _this.firstRefresh = true;
                    _this.addClass("screen");
                    return _this;
                }
                Screen.prototype.transitionIn = function (callback) {
                    callback && callback();
                };
                Screen.prototype.refreshInit = function (data) {
                };
                Screen.prototype.refresh = function (data) {
                };
                Screen.prototype.show = function () {
                    _super.prototype.show.call(this);
                    this.transitionIn();
                };
                Screen.prototype.transitionOut = function (callback) {
                    callback && callback();
                };
                Screen.prototype.hide = function () {
                    var _this = this;
                    this.transitionOut(function () { return _super.prototype.hide.call(_this); });
                };
                return Screen;
            }(kr3m.ui2.Div));
            ex.Screen = Screen;
        })(ex = ui2.ex || (ui2.ex = {}));
    })(ui2 = kr3m.ui2 || (kr3m.ui2 = {}));
})(kr3m || (kr3m = {}));
var cuboro;
(function (cuboro) {
    var cms;
    (function (cms) {
        var screens;
        (function (screens) {
            var Abstract = (function (_super) {
                __extends(Abstract, _super);
                function Abstract() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return Abstract;
            }(kr3m.ui2.ex.Screen));
            screens.Abstract = Abstract;
        })(screens = cms.screens || (cms.screens = {}));
    })(cms = cuboro.cms || (cuboro.cms = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var cms;
    (function (cms) {
        var screens;
        (function (screens) {
            var Competitions = (function (_super) {
                __extends(Competitions, _super);
                function Competitions(manager) {
                    var _this = _super.call(this, manager, { name: "competitions" }) || this;
                    var div = new kr3m.ui2.Div(_this);
                    div.setText(loc("competitions"));
                    return _this;
                }
                return Competitions;
            }(screens.Abstract));
            screens.Competitions = Competitions;
        })(screens = cms.screens || (cms.screens = {}));
    })(cms = cuboro.cms || (cuboro.cms = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var cms;
    (function (cms) {
        var screens;
        (function (screens) {
            var EduTracks = (function (_super) {
                __extends(EduTracks, _super);
                function EduTracks(manager) {
                    var _this = _super.call(this, manager, { name: "eduTracks" }) || this;
                    var div = new kr3m.ui2.Div(_this);
                    div.setText(loc("eduTracks"));
                    return _this;
                }
                return EduTracks;
            }(screens.Abstract));
            screens.EduTracks = EduTracks;
        })(screens = cms.screens || (cms.screens = {}));
    })(cms = cuboro.cms || (cuboro.cms = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var cms;
    (function (cms) {
        var screens;
        (function (screens) {
            var Login = (function (_super) {
                __extends(Login, _super);
                function Login(manager) {
                    var _this = _super.call(this, manager, { name: "login" }) || this;
                    var div = new kr3m.ui2.Div(_this);
                    div.setText(loc("login"));
                    return _this;
                }
                return Login;
            }(screens.Abstract));
            screens.Login = Login;
        })(screens = cms.screens || (cms.screens = {}));
    })(cms = cuboro.cms || (cuboro.cms = {}));
})(cuboro || (cuboro = {}));
var kr3m;
(function (kr3m) {
    var ui2;
    (function (ui2) {
        var A = (function (_super) {
            __extends(A, _super);
            function A(parentNode, options) {
                var _this = _super.call(this, parentNode, kr3m.util.Util.mergeAssoc(options, { tagName: "a" })) || this;
                _this.initOptionsAttributes("href", "target", "download");
                if (_this.options.caption)
                    _this.setHtml(_this.options.caption);
                return _this;
            }
            A.prototype.setTarget = function (target) {
                this.setAttribute("target", target);
            };
            A.prototype.setUrl = function (url) {
                this.setAttribute("href", url);
            };
            A.prototype.setHref = function (url) {
                this.setUrl(url);
            };
            return A;
        }(ui2.Element));
        ui2.A = A;
    })(ui2 = kr3m.ui2 || (kr3m.ui2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var ui2;
    (function (ui2) {
        var cms;
        (function (cms) {
            var TabContainer = (function (_super) {
                __extends(TabContainer, _super);
                function TabContainer(parentNode, options) {
                    var _this = _super.call(this, parentNode, options) || this;
                    _this.tabs = [];
                    _this.addClass("tabContainer");
                    return _this;
                }
                TabContainer.prototype.addTabs = function (tabNames) {
                    for (var link in tabNames) {
                        var a = new kr3m.ui2.A(null, { caption: tabNames[link], href: "#" + link, classes: "tab" });
                        this.parentElement.insertBefore(a, this);
                        this.tabs.push(a);
                    }
                };
                TabContainer.prototype.showScreen = function (name, data) {
                    _super.prototype.showScreen.call(this, name, data);
                    for (var i = 0; i < this.tabs.length; ++i) {
                        if (this.tabs[i].getAttribute("href") == "#" + name)
                            this.tabs[i].addClass("selected");
                        else
                            this.tabs[i].removeClass("selected");
                    }
                };
                return TabContainer;
            }(kr3m.ui2.ex.ScreenManager));
            cms.TabContainer = TabContainer;
        })(cms = ui2.cms || (ui2.cms = {}));
    })(ui2 = kr3m.ui2 || (kr3m.ui2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var BrowserHistory = (function () {
            function BrowserHistory() {
            }
            BrowserHistory.addUrl = function (url, title, data, targetWindow) {
                if (title === void 0) { title = ""; }
                if (data === void 0) { data = null; }
                if (targetWindow === void 0) { targetWindow = window; }
                targetWindow.history.pushState(data, title, url);
            };
            return BrowserHistory;
        }());
        util.BrowserHistory = BrowserHistory;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var Deeplinking = (function () {
            function Deeplinking() {
            }
            Deeplinking.getCurrent = function (targetWindow) {
                if (targetWindow === void 0) { targetWindow = Deeplinking.targetWindow; }
                var hash = targetWindow.location.hash;
                if (!hash)
                    return "";
                if (hash.charAt(0) == "#")
                    hash = hash.slice(1);
                if (hash.charAt(0) == "!")
                    hash = hash.slice(1);
                return hash;
            };
            Deeplinking.buildUrl = function (link, params) {
                if (link.charAt(0) != "#")
                    link = "#" + link;
                if (!params)
                    return link;
                var result = link;
                for (var i in params)
                    result += "&" + i + "=" + encodeURIComponent(params[i]);
                return result;
            };
            Deeplinking.goTo = function (link, params, targetWindow) {
                if (targetWindow === void 0) { targetWindow = Deeplinking.targetWindow; }
                var url = Deeplinking.buildUrl(link, params);
                targetWindow.location.href = url;
            };
            Deeplinking.getCurrentLink = function (targetWindow) {
                if (targetWindow === void 0) { targetWindow = Deeplinking.targetWindow; }
                var hash = Deeplinking.getCurrent(targetWindow);
                var parts = hash.split("&");
                return parts[0];
            };
            Deeplinking.getCurrentParams = function (targetWindow) {
                if (targetWindow === void 0) { targetWindow = Deeplinking.targetWindow; }
                var hash = Deeplinking.getCurrent(targetWindow);
                var parts = hash.split("&");
                var params = {};
                for (var i = 1; i < parts.length; ++i) {
                    var pos = parts[i].indexOf("=");
                    var key = parts[i].slice(0, pos);
                    var value = parts[i].slice(pos + 1);
                    params[key] = decodeURIComponent(value);
                }
                return params;
            };
            Deeplinking.setParams = function (params, targetWindow) {
                if (targetWindow === void 0) { targetWindow = Deeplinking.targetWindow; }
                var link = Deeplinking.getCurrentLink(targetWindow);
                var oldParams = Deeplinking.getCurrentParams(targetWindow);
                for (var name in params)
                    oldParams[name] = params[name];
                Deeplinking.goTo(link, oldParams);
            };
            Deeplinking.setParam = function (name, value, targetWindow) {
                if (targetWindow === void 0) { targetWindow = Deeplinking.targetWindow; }
                var link = Deeplinking.getCurrentLink(targetWindow);
                var params = Deeplinking.getCurrentParams(targetWindow);
                params[name] = value;
                Deeplinking.goTo(link, params);
            };
            Deeplinking.deleteParam = function (name, targetWindow) {
                if (targetWindow === void 0) { targetWindow = Deeplinking.targetWindow; }
                var link = Deeplinking.getCurrentLink(targetWindow);
                var params = Deeplinking.getCurrentParams(targetWindow);
                delete params[name];
                Deeplinking.goTo(link, params);
            };
            Deeplinking.addDeeplink = function (link) {
                if (!Deeplinking.passiveMode)
                    util.BrowserHistory.addUrl("#" + link, "", null, Deeplinking.targetWindow);
            };
            Deeplinking.setPassiveMode = function (isPassive) {
                Deeplinking.passiveMode = isPassive;
            };
            Deeplinking.addLinkChangeListener = function (listener) {
                Deeplinking.onChange(listener);
            };
            Deeplinking.onChange = function (listener, targetWindow) {
                if (targetWindow === void 0) { targetWindow = Deeplinking.targetWindow; }
                targetWindow.addEventListener("hashchange", function (event) {
                    if (event === void 0) { event = null; }
                    Deeplinking.passiveMode = true;
                    var link = Deeplinking.getCurrentLink();
                    var params = Deeplinking.getCurrentParams();
                    listener(link, params, event);
                    Deeplinking.passiveMode = false;
                }, false);
            };
            Deeplinking.passiveMode = false;
            Deeplinking.targetWindow = window;
            return Deeplinking;
        }());
        util.Deeplinking = Deeplinking;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var Tokenizer = (function () {
            function Tokenizer() {
            }
            Tokenizer.setFormatter = function (name, formatter) {
                Tokenizer.formatters[name] = formatter;
            };
            Tokenizer.setToken = function (name, value) {
                Tokenizer.globalTokens[name] = value;
            };
            Tokenizer.mergeTokens = function (tokensArray) {
                var result = {};
                for (var i in tokensArray) {
                    for (var j in tokensArray[i]) {
                        if (typeof tokensArray[i][j] != "function") {
                            var key = i + "_" + j;
                            key = key.replace(/\W/g, "");
                            key = key.replace(/([a-z])([A-Z])/g, "$1_$2");
                            key = key.replace(/__+/g, "_");
                            key = key.toUpperCase();
                            result[key] = tokensArray[i][j];
                        }
                    }
                }
                return result;
            };
            Tokenizer.get = function (text, tokens, seperator) {
                if (seperator === void 0) { seperator = "##"; }
                tokens = util.Util.mergeAssoc(Tokenizer.globalTokens, tokens);
                var parts = text.split(seperator);
                for (var i = 1; i < parts.length; i += 2) {
                    var tokenParts = parts[i].split(":");
                    if (tokenParts.length < 1)
                        continue;
                    var value = util.Util.getProperty(tokens, tokenParts[0]);
                    if (tokenParts.length > 1) {
                        var formatter = Tokenizer.formatters[tokenParts[1]];
                        if (formatter) {
                            try {
                                value = formatter(value, tokens, tokenParts[0]);
                            }
                            catch (e) {
                                util.Log.logError(e);
                            }
                        }
                        else {
                            util.Log.logWarning("unknown token-formatter:", tokenParts[1]);
                        }
                    }
                    parts[i] = (value !== null) ? value : seperator + parts[i] + seperator;
                }
                return parts.join("");
            };
            Tokenizer.revertValues = function (templateText, tokenizedText, seperator) {
                if (seperator === void 0) { seperator = "##"; }
                var result = {};
                var parts = templateText.split(seperator);
                if (parts.length == 1)
                    return {};
                var startPos = tokenizedText.indexOf(parts[0], startPos);
                if (startPos < 0)
                    return null;
                var endPos = 0;
                for (var i = 0; i < parts.length - 1; i += 2) {
                    startPos += parts[i].length;
                    endPos = (parts[i + 2] != "") ? tokenizedText.indexOf(parts[i + 2], startPos) : tokenizedText.length;
                    if (endPos < 0)
                        return null;
                    result[parts[i + 1]] = tokenizedText.substring(startPos, endPos);
                    startPos = endPos;
                }
                return result;
            };
            Tokenizer.globalTokens = {};
            Tokenizer.formatters = {};
            return Tokenizer;
        }());
        util.Tokenizer = Tokenizer;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
function tokenize(text, tokens, seperator) {
    if (seperator === void 0) { seperator = "##"; }
    return kr3m.util.Tokenizer.get(text, tokens, seperator);
}
function setToken(name, value) {
    kr3m.util.Tokenizer.setToken(name, value);
}
var kr3m;
(function (kr3m) {
    var async;
    (function (async) {
        var Join = (function () {
            function Join() {
                this.counter = 0;
                this.callbacks = [];
                this.results = {};
            }
            Join.prototype.getResult = function (resultName) {
                var results = this.results[resultName];
                if (results && results.length > 0)
                    return results[0];
                return undefined;
            };
            Join.prototype.getResults = function (resultName) {
                return this.results[resultName] ? this.results[resultName] : undefined;
            };
            Join.prototype.getAllResults = function () {
                return this.results;
            };
            Join.prototype.clearCallbacks = function (runBeforeRemove) {
                if (runBeforeRemove === void 0) { runBeforeRemove = false; }
                if (runBeforeRemove) {
                    for (var i = 0; i < this.callbacks.length; ++i)
                        this.callbacks[i]();
                }
                this.callbacks = [];
            };
            Join.prototype.terminator = function (saveResultName) {
                var results = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    results[_i - 1] = arguments[_i];
                }
                if (saveResultName !== undefined)
                    this.results[saveResultName] = results;
                --this.counter;
                if (this.counter <= 0) {
                    this.counter = 0;
                    for (var i = 0; i < this.callbacks.length; ++i)
                        this.callbacks[i]();
                    this.callbacks = [];
                }
            };
            Join.prototype.fork = function (count) {
                if (count === void 0) { count = 1; }
                this.counter += count;
            };
            Join.prototype.done = function (saveResultName) {
                var results = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    results[_i - 1] = arguments[_i];
                }
                this.terminator.apply(this, [saveResultName].concat(results));
            };
            Join.prototype.getCallback = function (saveResultName) {
                this.fork();
                return this.terminator.bind(this, saveResultName);
            };
            Join.prototype.addCallback = function (callback) {
                if (this.counter > 0)
                    this.callbacks.push(callback);
                else
                    callback();
            };
            return Join;
        }());
        async.Join = Join;
    })(async = kr3m.async || (kr3m.async = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var algorithms;
    (function (algorithms) {
        var search;
        (function (search) {
            function bisect(sortedValues, searchValue, compareFunc) {
                var from = 0;
                var to = sortedValues.length;
                var i = -1;
                while (to != from) {
                    i = Math.floor((to - from) / 2) + from;
                    var comp = compareFunc(sortedValues[i], searchValue);
                    if (comp == 0)
                        return i;
                    if (comp > 0)
                        to = i;
                    else
                        from = i + 1;
                }
                return -1;
            }
            search.bisect = bisect;
            function bisectInsertPos(sortedValues, insertValue, compareFunc) {
                var from = 0;
                var to = sortedValues.length;
                var i = 0;
                while (to != from) {
                    i = Math.floor((to - from) / 2) + from;
                    var comp = compareFunc(sortedValues[i], insertValue);
                    if (comp == 0)
                        return i;
                    if (comp > 0)
                        to = i;
                    else
                        from = i + 1;
                }
                if (comp < 0)
                    return i + 1;
                else
                    return i;
            }
            search.bisectInsertPos = bisectInsertPos;
        })(search = algorithms.search || (algorithms.search = {}));
    })(algorithms = kr3m.algorithms || (kr3m.algorithms = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var SortedList = (function () {
            function SortedList(sortFunc) {
                this.sortFunc = sortFunc;
                this.items = [];
            }
            SortedList.prototype.useList = function (items, isSorted) {
                if (isSorted === void 0) { isSorted = true; }
                this.items = items;
                if (!isSorted)
                    this.items.sort(this.sortFunc);
            };
            SortedList.prototype.clear = function () {
                this.items = [];
            };
            SortedList.prototype.insertSortedValues = function () {
                var _this = this;
                var values = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    values[_i] = arguments[_i];
                }
                var insertPositions = values.map(function (value) { return _this.insertIndexOf(value); });
                for (var i = 1; i < insertPositions.length; ++i)
                    insertPositions[i] += i;
                (_a = this.items).push.apply(_a, values);
                var l = insertPositions.length;
                for (var i = this.items.length - 1; i >= 0; --i) {
                    if (i == insertPositions[l - 1]) {
                        this.items[i] = values.pop();
                        --l;
                    }
                    else {
                        this.items[i] = this.items[i - l];
                    }
                }
                var _a;
            };
            SortedList.prototype.insert = function () {
                var values = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    values[_i] = arguments[_i];
                }
                if (this.items.length == 0) {
                    this.items = values.slice();
                    this.items.sort(this.sortFunc);
                    return;
                }
                if ((values.length / this.items.length) > 0.3) {
                    (_a = this.items).push.apply(_a, values);
                    this.items.sort(this.sortFunc);
                    return;
                }
                values.sort(this.sortFunc);
                this.insertSortedValues.apply(this, values);
                var _a;
            };
            SortedList.prototype.insertFrom = function () {
                var lists = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    lists[_i] = arguments[_i];
                }
                for (var i = 0; i < lists.length; ++i)
                    this.insertSortedValues.apply(this, lists[i].items);
            };
            SortedList.prototype.pop = function () {
                return this.items.pop();
            };
            SortedList.prototype.shift = function () {
                return this.items.shift();
            };
            SortedList.prototype.getLength = function () {
                return this.items.length;
            };
            SortedList.prototype.getItem = function (offset) {
                return this.items[offset];
            };
            SortedList.prototype.findIndex = function (matchFunc) {
                return this.items.findIndex(matchFunc);
            };
            SortedList.prototype.find = function (matchFunc) {
                return this.items.find(matchFunc);
            };
            SortedList.prototype.toArray = function (start, end) {
                return this.items.slice(start, end);
            };
            SortedList.prototype.slice = function (start, end) {
                var newList = new SortedList(this.sortFunc);
                newList.useList(this.items.slice(start, end));
                return newList;
            };
            SortedList.prototype.splice = function (offset, deleteCount) {
                var newElements = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    newElements[_i - 2] = arguments[_i];
                }
                this.items.splice(offset, deleteCount);
                this.insert.apply(this, newElements);
            };
            SortedList.prototype.indexOf = function (value) {
                return kr3m.algorithms.search.bisect(this.items, value, this.sortFunc);
            };
            SortedList.prototype.insertIndexOf = function (value) {
                return kr3m.algorithms.search.bisectInsertPos(this.items, value, this.sortFunc);
            };
            SortedList.prototype.contains = function (value) {
                return this.indexOf(value) >= 0;
            };
            return SortedList;
        }());
        util.SortedList = SortedList;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var async;
    (function (async) {
        var PriorityQueue = (function () {
            function PriorityQueue(autoRun, parallelCount) {
                if (autoRun === void 0) { autoRun = false; }
                if (parallelCount === void 0) { parallelCount = 1; }
                this.pending = new kr3m.util.SortedList(function (a, b) { return a.p - b.p; });
                this.callbacks = [];
                this.runningCount = 0;
                this.autoRun = autoRun;
                this.parallelCount = parallelCount;
            }
            PriorityQueue.prototype.setParallelCount = function (parallelCount) {
                this.parallelCount = parallelCount;
            };
            PriorityQueue.prototype.getLength = function () {
                return this.pending.getLength();
            };
            PriorityQueue.prototype.getItem = function (offset) {
                return this.pending.getItem(offset);
            };
            PriorityQueue.prototype.clear = function () {
                this.pending.clear();
            };
            PriorityQueue.prototype.insert = function (func, priority) {
                if (priority === void 0) { priority = 0; }
                this.pending.insert({ p: priority, f: func });
                if (this.autoRun)
                    this.start();
            };
            PriorityQueue.prototype.addCallback = function (callback) {
                this.callbacks.push(callback);
            };
            PriorityQueue.prototype.callCallbacks = function () {
                for (var i = 0; i < this.callbacks.length; ++i)
                    this.callbacks[i]();
                this.callbacks = [];
            };
            PriorityQueue.prototype.isRunning = function () {
                return this.runningCount > 0;
            };
            PriorityQueue.prototype.run = function () {
                this.start();
            };
            PriorityQueue.prototype.start = function () {
                var _this = this;
                if (this.runningCount < this.parallelCount) {
                    var current = this.pending.shift();
                    if (current) {
                        ++this.runningCount;
                        current.f(function () {
                            --_this.runningCount;
                            _this.start();
                        });
                    }
                    else {
                        if (this.runningCount == 0)
                            this.callCallbacks();
                    }
                }
            };
            return PriorityQueue;
        }());
        async.PriorityQueue = PriorityQueue;
    })(async = kr3m.async || (kr3m.async = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var loading;
    (function (loading) {
        var cache;
        (function (cache) {
            var CacheBuster = (function () {
                function CacheBuster() {
                }
                CacheBuster.prototype.applyToUrl = function (url) {
                    var pos = url.indexOf("?");
                    if (pos >= 0) {
                        var query = url.substring(pos + 1);
                        var params = kr3m.util.StringEx.splitAssoc(query);
                        params["_"] = this.getString();
                        url = url.substring(0, pos);
                        url = url + "?" + kr3m.util.StringEx.joinAssoc(params);
                    }
                    else {
                        url = url + "?_=" + this.getString();
                    }
                    return url;
                };
                return CacheBuster;
            }());
            cache.CacheBuster = CacheBuster;
        })(cache = loading.cache || (loading.cache = {}));
    })(loading = kr3m.loading || (kr3m.loading = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var Validator = (function () {
            function Validator() {
            }
            Validator.email = function (text) {
                if (!text)
                    return false;
                return kr3m.REGEX_EMAIL.test(text);
            };
            Validator.date = function (d, m, y) {
                var date = new Date(y, m - 1, d);
                return (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d);
            };
            Validator.username = function (text) {
                if (!text)
                    return false;
                return kr3m.REGEX_USERNAME.test(text);
            };
            Validator.deviceId = function (text) {
                if (!text)
                    return false;
                return kr3m.REGEX_DEVICE_ID.test(text);
            };
            Validator.url = function (text) {
                if (!text)
                    return false;
                return kr3m.REGEX_URL.test(text);
            };
            Validator.dataUrl = function (text) {
                if (!text)
                    return false;
                return kr3m.REGEX_DATA_URL.test(text);
            };
            Validator.isInt = function (text) {
                if (!text)
                    return false;
                return kr3m.REGEX_INTEGER.test(text);
            };
            Validator.isFloat = function (text) {
                if (!text)
                    return false;
                return kr3m.REGEX_FLOAT.test(text);
            };
            Validator.getPasswordSecurity = function (password) {
                var maxLevel = 3;
                for (var i = maxLevel; i >= 0; --i)
                    if (Validator.securePassword(password, i))
                        return i / maxLevel;
                return 0;
            };
            Validator.securePassword = function (password, level) {
                if (level === void 0) { level = kr3m.PASSWORD_SECURITY_LOW; }
                if (password == "")
                    return false;
                if (level <= kr3m.PASSWORD_SECURITY_NONE)
                    return true;
                if (password.length < 4)
                    return false;
                if (level <= kr3m.PASSWORD_SECURITY_LOW)
                    return true;
                if (password.length < 6)
                    return false;
                if (level <= kr3m.PASSWORD_SECURITY_MEDIUM)
                    return true;
                if (password.length < 8)
                    return false;
                var types = { digits: /\d/, capitalLetters: /[A-Z]/, letters: /[a-z]/ };
                var typeCount = { digits: 0, capitalLetters: 0, letters: 0, others: 0 };
                for (var j = 0; j < password.length; ++j) {
                    var token = password.substr(j, 1);
                    var found = false;
                    for (var i in types) {
                        if (types[i].test(token)) {
                            ++typeCount[i];
                            found = true;
                        }
                    }
                    if (!found)
                        ++typeCount.others;
                }
                if (typeCount.digits <= 0
                    || typeCount.capitalLetters <= 0
                    || typeCount.others <= 0)
                    return false;
                return true;
            };
            return Validator;
        }());
        util.Validator = Validator;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var Rand = (function () {
            function Rand() {
            }
            Rand.getInt = function (a, b) {
                if (b === void 0) { b = 0; }
                var from = Math.min(a, b);
                var to = Math.max(a, b);
                return Math.floor(Math.random() * (to - from) + from);
            };
            Rand.getFloat = function (a, b) {
                if (a === void 0) { a = 1; }
                if (b === void 0) { b = 0; }
                var from = Math.min(a, b);
                var to = Math.max(a, b);
                return Math.random() * (to - from) + from;
            };
            Rand.getString = function (length, allowedCharacters) {
                if (length <= 0)
                    return "";
                allowedCharacters = allowedCharacters || Rand.CHARS_ALPHA_NUM;
                var result = "";
                var len = allowedCharacters.length;
                for (var i = 0; i < length; ++i)
                    result += allowedCharacters.charAt(Rand.getInt(len));
                return result;
            };
            Rand.getFunctionName = function () {
                var name = Rand.getString(16, Rand.CHARS_ALPHA);
                while (window[name])
                    name = Rand.getString(16, Rand.CHARS_ALPHA);
                return name;
            };
            Rand.getBool = function (trueChance) {
                if (trueChance === void 0) { trueChance = 0.5; }
                return Math.random() < trueChance;
            };
            Rand.getIndex = function (array) {
                if (array.length == 0)
                    return undefined;
                return Rand.getInt(array.length);
            };
            Rand.getIndexWeighted = function (weights) {
                var total = 0;
                for (var i = 0; i < weights.length; ++i)
                    total += Math.max(weights[i], 0);
                var weight = Rand.getFloat(total);
                for (var i = 0; i < weights.length; ++i) {
                    if (weight <= weights[i])
                        return i;
                    weight -= Math.max(weights[i], 0);
                }
                return undefined;
            };
            Rand.getElement = function (array) {
                if (array.length == 0)
                    return undefined;
                return array[Rand.getIndex(array)];
            };
            Rand.getElementWeighted = function (array, weights) {
                if (array.length == 0)
                    return undefined;
                if (array.length != weights.length)
                    throw new Error("array length and weights length don't match");
                return array[Rand.getIndexWeighted(weights)];
            };
            Rand.getShuffledInts = function (count) {
                var result = [];
                for (var i = 0; i < count; ++i)
                    result.push(i);
                return Rand.shuffleArray(result);
            };
            Rand.shuffleArray = function (arr) {
                var result = arr.slice();
                for (var i = 0; i < result.length - 1; ++i) {
                    var pos = Rand.getInt(i, result.length);
                    var temp = result[i];
                    result[i] = result[pos];
                    result[pos] = temp;
                }
                return result;
            };
            Rand.getTimeStamp = function (a, b) {
                var from = Math.min(a.getTime(), b.getTime());
                var to = Math.max(a.getTime(), b.getTime());
                return new Date(Math.random() * (to - from) + from);
            };
            Rand.getPassword = function (level) {
                if (level === void 0) { level = kr3m.PASSWORD_SECURITY_LOW; }
                var digits = 10;
                do {
                    var password = Rand.getString(digits, Rand.CHARS_PASSWORD);
                } while (!util.Validator.securePassword(password, level));
                return password;
            };
            Rand.CHARS_ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            Rand.CHARS_ALPHA_NUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            Rand.CHARS_PASSWORD = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!§$%&/()=?{[]}#+-_~^<>|\\@,.;:";
            return Rand;
        }());
        util.Rand = Rand;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var loading;
    (function (loading) {
        var cache;
        (function (cache) {
            var CacheBusterAlways = (function (_super) {
                __extends(CacheBusterAlways, _super);
                function CacheBusterAlways() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                CacheBusterAlways.prototype.getString = function () {
                    return "" + kr3m.util.Rand.getInt(0, 2000000000);
                };
                return CacheBusterAlways;
            }(kr3m.loading.cache.CacheBuster));
            cache.CacheBusterAlways = CacheBusterAlways;
        })(cache = loading.cache || (loading.cache = {}));
    })(loading = kr3m.loading || (kr3m.loading = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var loading;
    (function (loading) {
        var Loader2 = (function () {
            function Loader2() {
                this.queue = new kr3m.async.PriorityQueue(true, 4);
                this.loadedCount = 0;
                this.cacheBuster = new loading.cache.CacheBusterAlways();
            }
            Loader2.getInstance = function () {
                if (!Loader2.instance)
                    Loader2.instance = new Loader2();
                return Loader2.instance;
            };
            Loader2.prototype.getLoadedCount = function () {
                return this.loadedCount;
            };
            Loader2.prototype.getQueueLength = function () {
                return this.queue.getLength();
            };
            Loader2.prototype.getPendingByPriority = function () {
                var result = {};
                var len = this.queue.getLength();
                for (var i = 0; i < len; ++i) {
                    var p = this.queue.getItem(i).p;
                    result[p] = (result[p] || 0) + 1;
                }
                return result;
            };
            Loader2.prototype.setMaxParallelDownloads = function (maxParallel) {
                this.queue.setParallelCount(maxParallel);
            };
            Loader2.prototype.setCacheBuster = function (buster) {
                this.cacheBuster = buster;
            };
            Loader2.prototype.getCacheBusterString = function () {
                return this.cacheBuster.getString();
            };
            Loader2.prototype.loadFile = function () {
                var _this = this;
                var U = kr3m.util.Util;
                var url = arguments[0];
                var resultType = U.getFirstOfType(arguments, "string", 1);
                var callback = U.getFirstOfType(arguments, "function");
                var priority = U.getFirstOfType(arguments, "number") || 0;
                var errorCallback = U.getFirstOfType(arguments, "function", 0, 1);
                var loadUrl = this.cacheBuster.applyToUrl(url);
                this.queue.insert(function (next) {
                    resultType = resultType || kr3m.util.Ajax.getTypeFromUrl(url) || "json";
                    if (resultType == "image") {
                        var image = new Image();
                        image.onload = function () {
                            ++_this.loadedCount;
                            next();
                            callback && callback(image);
                        };
                        image.onerror = function () {
                            next();
                            errorCallback && errorCallback();
                        };
                        image.src = loadUrl;
                    }
                    else {
                        kr3m.util.Ajax.call(loadUrl, function (content) {
                            ++_this.loadedCount;
                            next();
                            callback && callback(content);
                        }, resultType, function () {
                            next();
                            errorCallback && errorCallback();
                        });
                    }
                }, priority);
            };
            Loader2.prototype.loadFiles = function () {
                var U = kr3m.util.Util;
                var urls = arguments[0];
                var callback = U.getFirstOfType(arguments, "function");
                var priority = U.getFirstOfType(arguments, "number") || 0;
                var progressListener = U.getFirstOfType(arguments, "function", 0, 1);
                var total = urls.length;
                var done = 0;
                var errors = 0;
                var join = new kr3m.async.Join();
                for (var i = 0; i < urls.length; ++i) {
                    var fileCallback = join.getCallback(urls[i]);
                    this.loadFile(urls[i], priority, function (content) {
                        ++done;
                        progressListener && progressListener(done, errors, total);
                        fileCallback(content);
                    }, function () {
                        ++errors;
                        progressListener && progressListener(done, errors, total);
                        fileCallback(null);
                    });
                }
                join.addCallback(function () { return callback && callback(join.getAllResults()); });
            };
            return Loader2;
        }());
        loading.Loader2 = Loader2;
    })(loading = kr3m.loading || (kr3m.loading = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var Localization = (function () {
            function Localization() {
            }
            Localization.setModuleItem = function (tempModule, id, value) {
                if (value === undefined || value === null)
                    return;
                if (value || Localization.allowEmptyStrings)
                    tempModule.items[id] = value.toString();
            };
            Localization.setRaw = function (id, text, language) {
                language = language || Localization.language;
                var tempModule = Localization.getModule(language);
                Localization.setModuleItem(tempModule, id, text);
            };
            Localization.getRaw = function (id, language) {
                try {
                    var win = window;
                    while (true) {
                        if (win.location.search.match(/\bshowLocIds=true\b/))
                            return id;
                        if (win == top)
                            break;
                        win = win.parent;
                    }
                }
                catch (e) {
                }
                language = language || Localization.language;
                var modules = Localization.modules[language];
                if (modules) {
                    for (var i = 0; i < modules.length; ++i) {
                        var tempModule = modules[i];
                        if (tempModule.items[id] !== undefined)
                            return tempModule.items[id];
                    }
                }
                return undefined;
            };
            Localization.get = function (id, tokens, language) {
                language = language || Localization.language;
                var raw = Localization.getRaw(id, language);
                if (raw !== undefined)
                    return util.Tokenizer.get(raw, tokens);
                if (language != Localization.fallback)
                    return Localization.get(id, tokens, Localization.fallback);
                util.Log.logWarning("missing localization", id, "for language", language);
                return "loc(" + id + ")";
            };
            Localization.cloneLanguage = function (fromLanguage, toLanguage) {
                Localization.modules[toLanguage] = util.Util.clone(Localization.modules[fromLanguage]);
            };
            Localization.getFormattedDate = function (formatId, dateObj, language) {
                if (dateObj === void 0) { dateObj = new Date(); }
                if (dateObj === null || dateObj == "0000-00-00" || dateObj == "0000-00-00 00:00:00")
                    return "";
                if (!(dateObj instanceof Date))
                    dateObj = new Date(dateObj);
                return Localization.get(formatId, Localization.getDateTokens(dateObj), language);
            };
            Localization.getDateTokens = function (dateObj) {
                if (dateObj === void 0) { dateObj = new Date(); }
                var tokens = {};
                tokens.D = dateObj.getDate();
                tokens.DD = (tokens.D < 10) ? "0" + tokens.D : tokens.D;
                tokens.M = dateObj.getMonth() + 1;
                tokens.MM = (tokens.M < 10) ? "0" + tokens.M : tokens.M;
                tokens.YYYY = dateObj.getFullYear();
                tokens.YY = tokens.YYYY % 100;
                tokens.H = dateObj.getHours();
                tokens.HH = (tokens.H < 10) ? "0" + tokens.H : tokens.H;
                tokens.I = dateObj.getMinutes();
                tokens.II = (tokens.I < 10) ? "0" + tokens.I : tokens.I;
                tokens.S = dateObj.getSeconds();
                tokens.SS = (tokens.S < 10) ? "0" + tokens.S : tokens.S;
                return tokens;
            };
            Localization.getDateFromString = function (formatId, text, language) {
                language = language || Localization.language;
                var raw = Localization.getRaw(formatId, language);
                if (!raw)
                    return null;
                var values = util.Tokenizer.revertValues(raw, text);
                if (!values)
                    return null;
                var date = new Date(0);
                for (var i in values) {
                    var value = parseInt(values[i], 0);
                    if (isNaN(value))
                        return null;
                    switch (i) {
                        case "YY":
                            var year = value;
                            if (year > 30)
                                date.setFullYear(year + 1900);
                            else
                                date.setFullYear(year + 2000);
                            break;
                        case "YYYY":
                            date.setFullYear(value);
                            break;
                        case "M":
                        case "MM":
                            date.setMonth(value - 1);
                            break;
                        case "D":
                        case "DD":
                            date.setDate(value);
                            break;
                        case "H":
                        case "HH":
                            date.setHours(value);
                            break;
                        case "I":
                        case "II":
                            date.setMinutes(value);
                            break;
                        case "S":
                        case "SS":
                            date.setSeconds(value);
                            break;
                    }
                }
                return date;
            };
            Localization.getModule = function (language, moduleName) {
                language = language || Localization.language;
                if (Localization.modules[language] == null)
                    Localization.modules[language] = [];
                for (var i = 0; i < Localization.modules[language].length; ++i)
                    if (Localization.modules[language][i].name == moduleName)
                        return Localization.modules[language][i];
                var tempModule = { name: moduleName, items: {} };
                Localization.modules[language].push(tempModule);
                return tempModule;
            };
            Localization.dropModule = function (name) {
                for (var lang in Localization.modules) {
                    if (Localization.modules[lang][name])
                        delete Localization.modules[lang][name];
                }
            };
            Localization.mergeModule = function (fromName, toName) {
                if (fromName == toName)
                    return;
                for (var lang in Localization.modules) {
                    var from = Localization.getModule(lang, fromName);
                    var to = Localization.getModule(lang, toName);
                    for (var i in from.items)
                        Localization.setModuleItem(to, i, from.items[i]);
                }
                Localization.dropModule(fromName);
            };
            Localization.addJSONModule = function (texts, language, callback, moduleName) {
                language = language || Localization.language;
                var tempModule = Localization.getModule(language, moduleName);
                for (var id in texts)
                    Localization.setModuleItem(tempModule, id, texts[id]);
                callback && callback();
            };
            Localization.addJSONModuleFromUrl = function (fileUrl, language, callback, moduleName) {
                language = language || Localization.language;
                var loader = kr3m.loading.Loader2.getInstance();
                loader.loadFile(fileUrl, -1, function (texts) {
                    Localization.addJSONModule(texts, language, callback, moduleName);
                }, function () {
                    util.Log.logError("localization file " + fileUrl + " could not be loaded");
                    callback && callback();
                });
            };
            Localization.addXMLModule = function (xmlDoc, language, callback, moduleName) {
                if (!xmlDoc)
                    return callback && callback();
                language = language || Localization.language;
                var tempModule = Localization.getModule(language, moduleName);
                var texts = xmlDoc.getElementsByTagName("text");
                var device = util.Device.getInstance();
                if (device.ie) {
                    for (var i = 0; i < texts.length; ++i) {
                        var key = texts[i].getAttribute("id");
                        var value = texts[i].childNodes[0].nodeValue;
                        Localization.setModuleItem(tempModule, key, value.replace(/^\s*\<\!\[CDATA\[([\s\S]*?)\]\]\>\s*$/i, "$1"));
                    }
                }
                else {
                    for (var i = 0; i < texts.length; ++i) {
                        var key = texts[i].id;
                        var value = texts[i].innerHTML;
                        tempModule.items[key] = value.replace(/^\s*\<\!\[CDATA\[([\s\S]*?)\]\]\>\s*$/i, "$1");
                        Localization.setModuleItem(tempModule, key, value.replace(/^\s*\<\!\[CDATA\[([\s\S]*?)\]\]\>\s*$/i, "$1"));
                    }
                }
                callback && callback();
            };
            Localization.addXMLModuleFromRawXml = function (rawXml, language, callback, moduleName) {
                language = language || Localization.language;
                var tempModule = Localization.getModule(language, moduleName);
                var xml = kr3m.xml.parseString(rawXml);
                var texts = Array.isArray(xml.text) ? xml.text : [xml.text];
                for (var i = 0; i < texts.length; ++i) {
                    var key = texts[i]._attributes.id;
                    var value = texts[i]._data;
                    Localization.setModuleItem(tempModule, key, value);
                }
                callback && callback();
            };
            Localization.addXMLModuleFromUrl = function (fileUrl, language, callback, moduleName) {
                language = language || Localization.language;
                var loader = kr3m.loading.Loader2.getInstance();
                loader.loadFile(fileUrl, -1, "text", function (xml) {
                    Localization.addXMLModuleFromRawXml(xml, language, callback, moduleName);
                }, function () {
                    util.Log.logError("localization file " + fileUrl + " could not be loaded");
                    callback && callback();
                });
            };
            Localization.fallback = "en";
            Localization.language = "en";
            Localization.allowEmptyStrings = true;
            Localization.modules = {};
            return Localization;
        }());
        util.Localization = Localization;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
kr3m.util.Tokenizer.setFormatter("loc", function (value, tokens, name) { return kr3m.util.Localization.get(value, tokens); });
kr3m.util.Tokenizer.setFormatter("date", function (value, tokens, name) { return kr3m.util.Localization.getFormattedDate(kr3m.FORMAT_DATE, value); });
kr3m.util.Tokenizer.setFormatter("time", function (value, tokens, name) { return kr3m.util.Localization.getFormattedDate(kr3m.FORMAT_TIME, value); });
kr3m.util.Tokenizer.setFormatter("dateTime", function (value, tokens, name) { return kr3m.util.Localization.getFormattedDate(kr3m.FORMAT_DATETIME, value); });
function loc(id, tokens, languageId) {
    return kr3m.util.Localization.get(id, tokens, languageId);
}
function locDate(id, dateObj, languageId) {
    return kr3m.util.Localization.getFormattedDate(id, dateObj, languageId);
}
function initLoc(pathOrUrl, languageId, callback) {
    var ext = pathOrUrl.replace(/^.*\.([^\.]+)$/, "$1").toLowerCase();
    kr3m.util.Localization.language = languageId;
    if (ext == "xml")
        return kr3m.util.Localization.addXMLModuleFromUrl(pathOrUrl, languageId, callback);
    if (ext == "json" || ext == "js")
        return kr3m.util.Localization.addJSONModuleFromUrl(pathOrUrl, languageId, callback);
    callback();
}
var cuboro;
(function (cuboro) {
    var cms;
    (function (cms) {
        var Cms = (function (_super) {
            __extends(Cms, _super);
            function Cms() {
                var _this = _super.call(this, document.body) || this;
                var languageId = kr3m.util.Browser.getQueryValue("lang") || "de";
                initLoc("lang_" + languageId + ".json", languageId, function () {
                    _this.header = new cms.Header(_this);
                    _this.tabs = new kr3m.ui2.cms.TabContainer(_this);
                    _this.footer = new cms.Footer(_this);
                    var login = new cuboro.cms.screens.Login(_this.tabs);
                    new cuboro.cms.screens.EduTracks(_this.tabs);
                    new cuboro.cms.screens.Competitions(_this.tabs);
                    _this.tabs.addTabs({ eduTracks: loc("EDUTRACKS"), competitions: loc("COMPETITIONS") });
                    var link = kr3m.util.Deeplinking.getCurrentLink();
                    var params = kr3m.util.Deeplinking.getCurrentParams();
                    if (!_this.tabs.hasScreen(link))
                        link = "";
                    _this.handleDeeplink(link || login.getName(), params);
                    kr3m.util.Deeplinking.onChange(function (link, params) { return _this.handleDeeplink(link, params); });
                });
                return _this;
            }
            Cms.prototype.handleDeeplink = function (link, params) {
                if (!this.tabs.hasScreen(link))
                    return logWarning("unknown deeplink", link);
                var isLoggedIn = mUser.isLoggedIn();
                if (isLoggedIn) {
                    document.title = loc("APP_TITLE") + " - " + link;
                    this.tabs.showScreen(link, params);
                }
                else {
                    document.title = loc("APP_TITLE");
                    this.tabs.showScreen("login", params);
                }
            };
            return Cms;
        }(kr3m.ui2.Div));
        cms.Cms = Cms;
    })(cms = cuboro.cms || (cuboro.cms = {}));
})(cuboro || (cuboro = {}));
new cuboro.cms.Cms();
