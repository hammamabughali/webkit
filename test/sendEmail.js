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
var osLib = require("os");
var kr3m;
(function (kr3m) {
    kr3m.PLATFORM_LINUX = "linux";
    kr3m.PLATFORM_WINDOWS = "win32";
    var cpuUsageAtStartup = osLib.cpus();
    var cpuUsageLastCall = cpuUsageAtStartup;
    function getCpuUsage(sinceLastCall) {
        if (sinceLastCall === void 0) { sinceLastCall = false; }
        var cpus = osLib.cpus();
        var usage = [];
        var base = sinceLastCall ? cpuUsageLastCall : cpuUsageAtStartup;
        for (var i = 0; i < cpus.length; ++i) {
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
    kr3m.getCpuUsage = getCpuUsage;
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
                if (!Log.enabled)
                    return;
                for (var i = 0; i < values.length; ++i) {
                    if (typeof values[i] == "object" && !(values[i] instanceof Error))
                        values[i] = util.Json.encode(values[i], true);
                }
                if (Log.showTimestamps)
                    values.unshift(Log.COLOR_BRIGHT_RED + util.Dates.getNow(false));
                else
                    values[0] = Log.COLOR_BRIGHT_RED + values[0];
                values.push(Log.COLOR_RESET);
                console.error.apply(console, values);
            };
            Log.log = function () {
                var values = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    values[_i] = arguments[_i];
                }
                if (!Log.enabled)
                    return;
                for (var i = 0; i < values.length; ++i) {
                    if (typeof values[i] == "object")
                        values[i] = util.Json.encode(values[i], true);
                }
                if (Log.showTimestamps)
                    values.unshift(util.Dates.getNow(false));
                console.log.apply(console, values);
            };
            Log.logWarning = function () {
                var values = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    values[_i] = arguments[_i];
                }
                if (!Log.enabled)
                    return;
                for (var i = 0; i < values.length; ++i) {
                    if (typeof values[i] == "object" && !(values[i] instanceof Error))
                        values[i] = util.Json.encode(values[i], true);
                }
                if (Log.showTimestamps)
                    values.unshift(Log.COLOR_BRIGHT_YELLOW + util.Dates.getNow(false));
                else
                    values[0] = Log.COLOR_BRIGHT_YELLOW + values[0];
                values.push(Log.COLOR_RESET);
                console.log.apply(console, values);
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
                var prefix = asError ? Log.COLOR_BRIGHT_RED : "";
                var suffix = asError ? Log.COLOR_RESET : "";
                Log.log(prefix + Log.stackTrace(asError) + suffix);
            };
            Log.enabled = true;
            Log.showTimestamps = true;
            Log.COLOR_BLACK = "\x1b[30m";
            Log.COLOR_BLUE = "\x1b[34m";
            Log.COLOR_BRIGHT = "\x1b[1m";
            Log.COLOR_BRIGHT_BLUE = "\x1b[94m";
            Log.COLOR_BRIGHT_CYAN = "\x1b[96m";
            Log.COLOR_BRIGHT_GREEN = "\x1b[92m";
            Log.COLOR_BRIGHT_GREY = "\x1b[37m";
            Log.COLOR_BRIGHT_MAGENTA = "\x1b[95m";
            Log.COLOR_BRIGHT_PINK = "\x1b[95m";
            Log.COLOR_BRIGHT_RED = "\x1b[91m";
            Log.COLOR_BRIGHT_YELLOW = "\x1b[93m";
            Log.COLOR_CYAN = "\x1b[36m";
            Log.COLOR_DARK = "\x1b[2m";
            Log.COLOR_DARK_BLUE = "\x1b[34m";
            Log.COLOR_DARK_CYAN = "\x1b[36m";
            Log.COLOR_DARK_GREEN = "\x1b[32m";
            Log.COLOR_DARK_GREY = "\x1b[90m";
            Log.COLOR_DARK_MAGENTA = "\x1b[35m";
            Log.COLOR_DARK_PINK = "\x1b[35m";
            Log.COLOR_DARK_RED = "\x1b[31m";
            Log.COLOR_DARK_YELLOW = "\x1b[33m";
            Log.COLOR_DEFAULT = "\x1b[39m";
            Log.COLOR_GREEN = "\x1b[32m";
            Log.COLOR_MAGENTA = "\x1b[35m";
            Log.COLOR_PINK = "\x1b[35m";
            Log.COLOR_RED = "\x1b[31m";
            Log.COLOR_WHITE = "\x1b[97m";
            Log.COLOR_YELLOW = "\x1b[33m";
            Log.COLOR_RESET = "\x1b[0m";
            Log.BACKGROUND_BLACK = "\x1b[40m";
            Log.BACKGROUND_BRIGHT_BLUE = "\x1b[104m";
            Log.BACKGROUND_BRIGHT_CYAN = "\x1b[106m";
            Log.BACKGROUND_BRIGHT_GREEN = "\x1b[102m";
            Log.BACKGROUND_BRIGHT_GREY = "\x1b[47m";
            Log.BACKGROUND_BRIGHT_MAGENTA = "\x1b[105m";
            Log.BACKGROUND_BRIGHT_RED = "\x1b[101m";
            Log.BACKGROUND_BRIGHT_YELLOW = "\x1b[103m";
            Log.BACKGROUND_DARK_BLUE = "\x1b[44m";
            Log.BACKGROUND_DARK_CYAN = "\x1b[46m";
            Log.BACKGROUND_DARK_GREEN = "\x1b[42m";
            Log.BACKGROUND_DARK_GREY = "\x1b[100m";
            Log.BACKGROUND_DARK_MAGENTA = "\x1b[45m";
            Log.BACKGROUND_DARK_RED = "\x1b[41m";
            Log.BACKGROUND_DARK_YELLOW = "\x1b[43m";
            Log.BACKGROUND_DEFAULT = "\x1b[49m";
            Log.BACKGROUND_WHITE = "\x1b[107m";
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
function logProfiling() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
}
function logWarning() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    kr3m.util.Log.logWarning.apply(null, values);
}
function logProfilingLow() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
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
var clusterLib = require("cluster");
var constantsLib = require("constants");
var cryptoLib = require("crypto");
var fsLib = require("fs");
var httpLib = require("http");
var httpsLib = require("https");
var pathLib = require("path");
var querystringLib = require("querystring");
var urlLib = require("url");
var utilLib = require("util");
var v8Lib = require("v8");
function requireOptional(moduleName) {
    try {
        var mod = require(moduleName);
        return mod;
    }
    catch (e) {
        if (clusterLib.isMaster)
            logWarning("module", moduleName, "not found");
        return undefined;
    }
}
if (!utilLib.isPrimitive) {
    logWarning("using utilLib.isPrimitive polyfill");
    utilLib.isPrimitive = function (obj) {
        var t = typeof obj;
        return (t == "string" || t == "number" || t == "boolean" || obj instanceof Date);
    };
}
if (!utilLib.isArray) {
    logWarning("using utilLib.isArray polyfill");
    utilLib.isArray = function (obj) {
        return obj && typeof obj.length == "number";
    };
}
if (!utilLib.isObject) {
    logWarning("using utilLib.isObject polyfill");
    utilLib.isObject = function (obj) {
        return obj && !utilLib.isPrimitive(obj) && !utilLib.isArray(obj);
    };
}
function debug() {
    var objs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objs[_i] = arguments[_i];
    }
    for (var i = 0; i < objs.length; ++i)
        log(utilLib.inspect(objs[i], { depth: null }));
}
function dumpToFile(filePath) {
    var objs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        objs[_i - 1] = arguments[_i];
    }
    var output = "";
    for (var i = 0; i < objs.length; ++i)
        output += utilLib.inspect(objs[i], { depth: null });
    fsLib.writeFile(filePath, output, function () { });
}
function decodeBase64EncodedString(base64) {
    return new Buffer(base64, "base64").toString("utf8");
}
function encodeBase64EncodedString(raw) {
    return new Buffer(raw).toString("base64");
}
function getSha512Base64() {
    var data = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        data[_i] = arguments[_i];
    }
    var algorithm = cryptoLib.createHash("sha512");
    for (var i = 0; i < data.length; ++i)
        algorithm.update(data[i]);
    return algorithm.digest("base64");
}
function getMd5Base64() {
    var data = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        data[_i] = arguments[_i];
    }
    var algorithm = cryptoLib.createHash("md5");
    for (var i = 0; i < data.length; ++i)
        algorithm.update(data[i]);
    return algorithm.digest("base64");
}
function getMd5Hex() {
    var data = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        data[_i] = arguments[_i];
    }
    var algorithm = cryptoLib.createHash("md5");
    for (var i = 0; i < data.length; ++i)
        algorithm.update(data[i]);
    return algorithm.digest("hex");
}
function getMemoryUsed() {
    return process.memoryUsage().heapUsed;
}
function getMemoryAllocated() {
    return process.memoryUsage().rss;
}
function getMemoryUseString() {
    var usage = process.memoryUsage();
    var used = kr3m.util.StringEx.getSizeString(usage.heapUsed);
    var allocated = kr3m.util.StringEx.getSizeString(usage.rss);
    return used + " / " + allocated;
}
if (parseInt(process.version.replace(/^v?(\d+)\..+/, "$1"), 10) < 6)
    throw new Error("Your node.js version is too old, node.js 6 or higher is required!");
var kr3m;
(function (kr3m) {
    var payment;
    (function (payment) {
        var IBANSpecification = (function () {
            function IBANSpecification(countryCode, length, structure) {
                this.countryCode = countryCode;
                this.length = length;
                this.structure = structure;
            }
            IBANSpecification.prototype.validate = function (iban) {
                return this.length == iban.length
                    && this.countryCode === iban.slice(0, 2)
                    && this.checkStructure(iban)
                    && this.mod97(this.iso13616(iban)) == 1;
            };
            IBANSpecification.prototype.checkStructure = function (iban) {
                if (!this.cachedRegex)
                    this.cachedRegex = this.parseStructure(this.structure);
                return this.cachedRegex.test(iban.slice(4));
            };
            IBANSpecification.prototype.iso13616 = function (iban) {
                var A = 'A'.charCodeAt(0), Z = 'Z'.charCodeAt(0);
                iban = iban.toUpperCase();
                iban = iban.substr(4) + iban.substr(0, 4);
                return iban.split("").map(function (n) {
                    var code = n.charCodeAt(0);
                    if (code >= A && code <= Z)
                        return code - A + 10;
                    else
                        return n;
                }).join("");
            };
            IBANSpecification.prototype.mod97 = function (numberString) {
                var remainder = numberString;
                while (remainder.length > 2) {
                    var block = remainder.slice(0, 9);
                    remainder = parseInt(block, 10) % 97 + remainder.slice(block.length);
                }
                return parseInt(remainder, 10) % 97;
            };
            IBANSpecification.prototype.parseStructure = function (structure) {
                var regex = structure.match(/(.{3})/g).map(function (block) {
                    var format;
                    var pattern = block.slice(0, 1);
                    var repeats = parseInt(block.slice(1), 10);
                    switch (pattern) {
                        case "A":
                            format = "0-9A-Za-z";
                            break;
                        case "B":
                            format = "0-9A-Z";
                            break;
                        case "C":
                            format = "A-Za-z";
                            break;
                        case "F":
                            format = "0-9";
                            break;
                        case "L":
                            format = "a-z";
                            break;
                        case "U":
                            format = "A-Z";
                            break;
                        case "W":
                            format = "0-9a-z";
                            break;
                    }
                    return '([' + format + ']{' + repeats + '})';
                });
                return new RegExp('^' + regex.join("") + '$');
            };
            return IBANSpecification;
        }());
        payment.IBANSpecification = IBANSpecification;
    })(payment = kr3m.payment || (kr3m.payment = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var payment;
    (function (payment) {
        var Iban = (function () {
            function Iban() {
            }
            Iban.validate = function (iban) {
                if (typeof iban != "string")
                    return false;
                iban = Iban.getElectronicFormat(iban);
                var countrySpecification = Iban.countrySpecifications[iban.slice(0, 2)];
                return !!countrySpecification && countrySpecification.validate(iban);
            };
            Iban.getCountryCode = function (iban) {
                return iban.slice(0, 2);
            };
            Iban.getBankCode = function (iban) {
                var countryId = iban.slice(0, 2);
                var spec = Iban.countrySpecifications[countryId];
                if (!spec)
                    return "";
                var length = parseInt(spec.structure.slice(1, 3), 10);
                return iban.substring(4, 4 + length).replace(/^0+/, "").trim();
            };
            Iban.getElectronicFormat = function (iban) {
                return iban.trim().replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
            };
            Iban.getPrintFormat = function (iban, separator) {
                if (separator === void 0) { separator = " "; }
                return this.getElectronicFormat(iban).replace(/(.{4})(?!$)/g, "$1" + separator);
            };
            Iban.countrySpecifications = {
                AD: new payment.IBANSpecification("AD", 24, "F04F04A12"),
                AE: new payment.IBANSpecification("AE", 23, "F03F16"),
                AL: new payment.IBANSpecification("AL", 28, "F08A16"),
                AO: new payment.IBANSpecification("AO", 25, "F21"),
                AT: new payment.IBANSpecification("AT", 20, "F05F11"),
                AZ: new payment.IBANSpecification("AZ", 28, "U04A20"),
                BA: new payment.IBANSpecification("BA", 20, "F03F03F08F02"),
                BE: new payment.IBANSpecification("BE", 16, "F03F07F02"),
                BF: new payment.IBANSpecification("BF", 27, "F23"),
                BG: new payment.IBANSpecification("BG", 22, "U04F04F02A08"),
                BH: new payment.IBANSpecification("BH", 22, "U04A14"),
                BI: new payment.IBANSpecification("BI", 16, "F12"),
                BJ: new payment.IBANSpecification("BJ", 28, "F24"),
                BR: new payment.IBANSpecification("BR", 29, "F08F05F10U01A01"),
                CH: new payment.IBANSpecification("CH", 21, "F05A12"),
                CI: new payment.IBANSpecification("CI", 28, "U01F23"),
                CM: new payment.IBANSpecification("CM", 27, "F23"),
                CR: new payment.IBANSpecification("CR", 21, "F03F14"),
                CV: new payment.IBANSpecification("CV", 25, "F21"),
                CY: new payment.IBANSpecification("CY", 28, "F03F05A16"),
                CZ: new payment.IBANSpecification("CZ", 24, "F04F06F10"),
                DE: new payment.IBANSpecification("DE", 22, "F08F10"),
                DK: new payment.IBANSpecification("DK", 18, "F04F09F01"),
                DO: new payment.IBANSpecification("DO", 28, "U04F20"),
                DZ: new payment.IBANSpecification("DZ", 24, "F20"),
                EE: new payment.IBANSpecification("EE", 20, "F02F02F11F01"),
                ES: new payment.IBANSpecification("ES", 24, "F04F04F01F01F10"),
                FI: new payment.IBANSpecification("FI", 18, "F06F07F01"),
                FO: new payment.IBANSpecification("FO", 18, "F04F09F01"),
                FR: new payment.IBANSpecification("FR", 27, "F05F05A11F02"),
                GB: new payment.IBANSpecification("GB", 22, "U04F06F08"),
                GE: new payment.IBANSpecification("GE", 22, "U02F16"),
                GI: new payment.IBANSpecification("GI", 23, "U04A15"),
                GL: new payment.IBANSpecification("GL", 18, "F04F09F01"),
                GR: new payment.IBANSpecification("GR", 27, "F03F04A16"),
                GT: new payment.IBANSpecification("GT", 28, "A04A20"),
                HR: new payment.IBANSpecification("HR", 21, "F07F10"),
                HU: new payment.IBANSpecification("HU", 28, "F03F04F01F15F01"),
                IE: new payment.IBANSpecification("IE", 22, "U04F06F08"),
                IL: new payment.IBANSpecification("IL", 23, "F03F03F13"),
                IR: new payment.IBANSpecification("IR", 26, "F22"),
                IS: new payment.IBANSpecification("IS", 26, "F04F02F06F10"),
                IT: new payment.IBANSpecification("IT", 27, "U01F05F05A12"),
                JO: new payment.IBANSpecification("JO", 30, "A04F22"),
                KW: new payment.IBANSpecification("KW", 30, "U04A22"),
                KZ: new payment.IBANSpecification("KZ", 20, "F03A13"),
                LB: new payment.IBANSpecification("LB", 28, "F04A20"),
                LC: new payment.IBANSpecification("LC", 32, "U04F24"),
                LI: new payment.IBANSpecification("LI", 21, "F05A12"),
                LT: new payment.IBANSpecification("LT", 20, "F05F11"),
                LU: new payment.IBANSpecification("LU", 20, "F03A13"),
                LV: new payment.IBANSpecification("LV", 21, "U04A13"),
                MC: new payment.IBANSpecification("MC", 27, "F05F05A11F02"),
                MD: new payment.IBANSpecification("MD", 24, "U02A18"),
                ME: new payment.IBANSpecification("ME", 22, "F03F13F02"),
                MG: new payment.IBANSpecification("MG", 27, "F23"),
                MK: new payment.IBANSpecification("MK", 19, "F03A10F02"),
                ML: new payment.IBANSpecification("ML", 28, "U01F23"),
                MR: new payment.IBANSpecification("MR", 27, "F05F05F11F02"),
                MT: new payment.IBANSpecification("MT", 31, "U04F05A18"),
                MU: new payment.IBANSpecification("MU", 30, "U04F02F02F12F03U03"),
                MZ: new payment.IBANSpecification("MZ", 25, "F21"),
                NL: new payment.IBANSpecification("NL", 18, "U04F10"),
                NO: new payment.IBANSpecification("NO", 15, "F04F06F01"),
                PK: new payment.IBANSpecification("PK", 24, "U04A16"),
                PL: new payment.IBANSpecification("PL", 28, "F08F16"),
                PS: new payment.IBANSpecification("PS", 29, "U04A21"),
                PT: new payment.IBANSpecification("PT", 25, "F04F04F11F02"),
                QA: new payment.IBANSpecification("QA", 29, "U04A21"),
                RO: new payment.IBANSpecification("RO", 24, "U04A16"),
                RS: new payment.IBANSpecification("RS", 22, "F03F13F02"),
                SA: new payment.IBANSpecification("SA", 24, "F02A18"),
                SE: new payment.IBANSpecification("SE", 24, "F03F16F01"),
                SI: new payment.IBANSpecification("SI", 19, "F05F08F02"),
                SK: new payment.IBANSpecification("SK", 24, "F04F06F10"),
                SM: new payment.IBANSpecification("SM", 27, "U01F05F05A12"),
                SN: new payment.IBANSpecification("SN", 28, "U01F23"),
                ST: new payment.IBANSpecification("ST", 25, "F08F11F02"),
                TL: new payment.IBANSpecification("TL", 23, "F03F14F02"),
                TN: new payment.IBANSpecification("TN", 24, "F02F03F13F02"),
                TR: new payment.IBANSpecification("TR", 26, "F05F01A16"),
                UA: new payment.IBANSpecification("UA", 29, "F25"),
                VG: new payment.IBANSpecification("VG", 24, "U04F16"),
                XK: new payment.IBANSpecification("XK", 20, "F04F10F02")
            };
            return Iban;
        }());
        payment.Iban = Iban;
    })(payment = kr3m.payment || (kr3m.payment = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var payment;
    (function (payment) {
        var Validator = (function () {
            function Validator() {
            }
            Validator.iban = function (text) {
                if (!text)
                    return false;
                return payment.Iban.validate(text);
            };
            Validator.bic = function (text) {
                if (!text)
                    return false;
                if (text.length != 8 && text.length != 11)
                    return false;
                var pat = /^[a-z0-9]+$/i;
                return pat.test(text);
            };
            return Validator;
        }());
        payment.Validator = Validator;
    })(payment = kr3m.payment || (kr3m.payment = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var Class = (function () {
            function Class() {
            }
            Class.getClassNameOfInstance = function (instance) {
                var funcNameRegex = /function (.{1,})\(/;
                var results = (funcNameRegex).exec(instance.constructor.toString());
                return (results && results.length > 1) ? results[1].toString() : "";
            };
            Class.getNameOfClass = function (clss) {
                var funcNameRegex = /function (.{1,})\(/;
                var results = (funcNameRegex).exec(clss.toString());
                return (results && results.length > 1) ? results[1].toString() : "";
            };
            Class.createInstanceOfClass = function (clss, params) {
                if (params === void 0) { params = []; }
                try {
                    clss = (typeof clss == "string") ? eval(clss) : clss;
                    var helper = function () {
                        clss.apply(this, params);
                    };
                    helper.prototype = clss.prototype;
                    return new helper();
                }
                catch (er) {
                    kr3m.util.Log.logDebug(er);
                    return null;
                }
            };
            return Class;
        }());
        util.Class = Class;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    kr3m.VERSION = "1.7.0.7";
})(kr3m || (kr3m = {}));
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
    var services;
    (function (services) {
        var ParamsHelper = (function () {
            function ParamsHelper(rawParameters, deleteUnknownFields) {
                if (deleteUnknownFields === void 0) { deleteUnknownFields = false; }
                this.rawParameters = null;
                this.parameters = null;
                this.useVODefaults = {};
                this.checkNaN = true;
                this.checkEmptyString = false;
                this.emailLowerCase = true;
                this.passwordMd5Hash = true;
                this.rawParameters = kr3m.util.Util.clone(rawParameters);
                this.parameters = rawParameters;
                this.deleteUnknownFields = deleteUnknownFields;
            }
            ParamsHelper.prototype.preCast = function (value, postType) {
                var preType = typeof value;
                try {
                    if (preType == "string") {
                        if (typeof postType == "string") {
                            var matches = postType.match(/^([a-zA-Z0-9\.]+)\[(\d*)\]$/i);
                            if (matches)
                                return this.preCast(value.split(","), postType);
                        }
                        if (typeof postType == "string" && postType.slice(0, 5) == "JSON:")
                            return this.preCast(kr3m.util.Json.decode(value), postType.slice(5));
                        if (postType == "number") {
                            var newNumber = parseFloat(value);
                            if (isNaN(newNumber))
                                return { type: postType, value: undefined };
                            return { type: postType, value: newNumber };
                        }
                        if (postType == "int" || postType == "uint") {
                            var newNumber = parseInt(value, 0);
                            if (isNaN(newNumber))
                                return { type: postType, value: undefined };
                            if (postType == "uint" && newNumber < 0)
                                return { type: postType, value: undefined };
                            return { type: postType, value: newNumber };
                        }
                        if (postType == "boolean" && (value == "true" || value == "false"))
                            return { type: postType, value: value == "true" };
                        if (postType == "email" && this.emailLowerCase)
                            return { type: postType, value: value.toLowerCase() };
                        if (postType == "date") {
                            var newDate = kr3m.util.Dates.getDateFromDateTimeString(value);
                            if (newDate)
                                return { type: postType, value: newDate };
                            newDate = new Date(value);
                            if (!isNaN(newDate.getTime()))
                                return { type: postType, value: newDate };
                            return { type: postType, value: undefined };
                        }
                    }
                    else if (preType == "number") {
                        if (postType == "string")
                            return { type: postType, value: value.toString() };
                    }
                    else if (utilLib.isArray(value)) {
                        var matches = postType.match(/^([a-zA-Z0-9\.]+)\[(\d*)\]$/i);
                        if (matches) {
                            for (var i = 0; i < value.length; ++i)
                                value[i] = this.preCast(value[i], matches[1]).value;
                        }
                    }
                }
                catch (e) {
                }
                return { type: postType, value: value };
            };
            ParamsHelper.prototype.postCast = function (value, type) {
                var valueType = typeof value;
                try {
                    if (valueType == "string") {
                        if (this.passwordMd5Hash && type == "password")
                            return getMd5Base64(value);
                    }
                }
                catch (e) {
                }
                return value;
            };
            ParamsHelper.prototype.matchesType = function (value, desiredType) {
                var metaType = typeof desiredType;
                if (metaType == "string") {
                    if (desiredType == "email")
                        return kr3m.util.Validator.email(value);
                    if (desiredType == "url")
                        return kr3m.util.Validator.url(value);
                    if (desiredType == "dataUrl")
                        return kr3m.util.Validator.dataUrl(value);
                    if (desiredType == "urlOrDataUrl")
                        return kr3m.util.Validator.url(value) || kr3m.util.Validator.dataUrl(value);
                    if (desiredType == "iban")
                        return kr3m.payment.Validator.iban(value);
                    if (desiredType == "deviceid")
                        return kr3m.util.Validator.deviceId(value);
                    if (desiredType == "password")
                        return kr3m.util.Validator.securePassword(value, kr3m.services.ParamsHelper.passwordSecurityLevel);
                    if (desiredType == "username")
                        return kr3m.util.Validator.username(value);
                    var matches = desiredType.match(/^([a-zA-Z0-9\.]+)\[(\d*)\]$/i);
                    if (matches) {
                        if (!utilLib.isArray(value))
                            return false;
                        var expectedLength = kr3m.util.StringEx.parseIntSafe(matches[2]);
                        if (expectedLength > 0 && value.length != expectedLength)
                            return false;
                        for (var i = 0; i < value.length; ++i)
                            if (!this.matchesType(value[i], matches[1]))
                                return false;
                        return true;
                    }
                    if (desiredType == "date")
                        return value instanceof Date;
                    if (kr3m.util.Util.contains(["string", "boolean", "object", "number"], desiredType)) {
                        if (typeof value != desiredType)
                            return false;
                        if (this.checkNaN && desiredType == "number" && isNaN(value))
                            return false;
                        if (this.checkEmptyString && desiredType == "string" && value == "")
                            return false;
                    }
                    else if (kr3m.util.Util.contains(["int", "uint"], desiredType)) {
                        if (typeof value != "number")
                            return false;
                        if (this.checkNaN && isNaN(value))
                            return false;
                        if (value - Math.floor(value) != 0)
                            return false;
                        if (desiredType == "uint" && value < 0)
                            return false;
                    }
                    else if (desiredType == "function") {
                        return typeof value == "function";
                    }
                    else {
                        try {
                            var tempVO = kr3m.util.Class.createInstanceOfClass(desiredType);
                            return this.validateVOInternal(tempVO, this.useVODefaults[desiredType] ? tempVO : {}, value);
                        }
                        catch (e) {
                            return false;
                        }
                    }
                }
                else if (utilLib.isArray(desiredType)) {
                    return kr3m.util.Util.contains(desiredType, value, true);
                }
                else if (metaType == "function") {
                    return desiredType(value);
                }
                else if (utilLib.isRegExp(desiredType)) {
                    return desiredType.test(value);
                }
                return true;
            };
            ParamsHelper.prototype.deleteUnknown = function (compareObj) {
                var newParams = {};
                for (var i in compareObj)
                    kr3m.util.Util.setProperty(newParams, i, kr3m.util.Util.getProperty(this.parameters, i));
                this.parameters = newParams;
            };
            ParamsHelper.prototype.useVODefaultFields = function (voClassName) {
                this.useVODefaults[voClassName] = true;
            };
            ParamsHelper.prototype.validate = function (required, fallbacks) {
                if (fallbacks === void 0) { fallbacks = {}; }
                if (!this.parameters) {
                    logError("parameters not set");
                    return false;
                }
                var value;
                for (var i in required) {
                    value = kr3m.util.Util.getProperty(this.parameters, i);
                    var cast = this.preCast(value, required[i]);
                    required[i] = cast.type;
                    kr3m.util.Util.setProperty(this.parameters, i, cast.value);
                }
                var failed = false;
                for (var i in required) {
                    value = kr3m.util.Util.getProperty(this.parameters, i);
                    if (!this.matchesType(value, required[i])) {
                        if (fallbacks[i] !== undefined) {
                            kr3m.util.Util.setProperty(this.parameters, i, fallbacks[i]);
                        }
                        else {
                            if (utilLib.isRegExp(required[i]))
                                log("parameter", i, "doesn't match expected regex", required[i].toString(), "with", (typeof value), ":", kr3m.util.Json.encode(value));
                            else
                                log("parameter", i, "doesn't match, expected", kr3m.util.Json.encode(required[i]), "but got", (typeof value), ":", kr3m.util.Json.encode(value));
                            failed = true;
                        }
                    }
                }
                if (failed)
                    return false;
                for (var i in required) {
                    value = kr3m.util.Util.getProperty(this.parameters, i);
                    value = this.postCast(value, required[i]);
                    kr3m.util.Util.setProperty(this.parameters, i, value);
                }
                if (this.deleteUnknownFields)
                    this.deleteUnknown(required);
                return true;
            };
            ParamsHelper.prototype.validateVOInternal = function (vo, fallbacks, params) {
                if (!vo) {
                    logError("vo not set");
                    return false;
                }
                if (!params) {
                    logError("parameters not set");
                    return false;
                }
                var value;
                var type;
                for (var i in vo) {
                    type = typeof vo[i];
                    if (type != "function") {
                        value = kr3m.util.Util.getProperty(params, i);
                        var cast = this.preCast(value, type);
                        kr3m.util.Util.setProperty(params, i, cast.value);
                    }
                }
                var failed = false;
                for (var i in vo) {
                    type = typeof vo[i];
                    if (type != "function") {
                        if (!this.matchesType(params[i], type)) {
                            if (fallbacks[i] !== undefined) {
                                kr3m.util.Util.setProperty(params, i, fallbacks[i]);
                            }
                            else {
                                log("vo attribute", i, "doesn't match");
                                failed = true;
                            }
                        }
                    }
                }
                if (failed) {
                    debug(params);
                    return false;
                }
                for (var i in vo) {
                    type = typeof vo[i];
                    if (type != "function") {
                        value = kr3m.util.Util.getProperty(params, i);
                        value = this.postCast(value, type);
                        kr3m.util.Util.setProperty(params, i, value);
                    }
                }
                if (this.deleteUnknownFields)
                    this.deleteUnknown(vo);
                return true;
            };
            ParamsHelper.prototype.validateVO = function (vo, fallbacks) {
                if (fallbacks === void 0) { fallbacks = {}; }
                return this.validateVOInternal(vo, fallbacks, this.parameters);
            };
            ParamsHelper.prototype.transferProperties = function (from, to, fallbacks) {
                if (fallbacks === void 0) { fallbacks = from; }
                for (var i in to) {
                    if (typeof to[i] != "function")
                        to[i] = from[i] || fallbacks[i];
                }
            };
            ParamsHelper.passwordSecurityLevel = kr3m.PASSWORD_SECURITY_NONE;
            return ParamsHelper;
        }());
        services.ParamsHelper = ParamsHelper;
    })(services = kr3m.services || (kr3m.services = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var async;
    (function (async) {
        var If = (function () {
            function If() {
            }
            If.checkCondition = function (condition, callback) {
                if (typeof condition == "function")
                    condition(function (result) { return callback(result ? true : false); });
                else
                    callback(condition ? true : false);
            };
            If.then = function (condition, thenFunc, finallyFunc) {
                kr3m.async.If.checkCondition(condition, function (isTrue) {
                    if (isTrue)
                        thenFunc(function () { return finallyFunc && finallyFunc(); });
                    else
                        finallyFunc && finallyFunc();
                });
            };
            If.thenElse = function (condition, thenFunc, elseFunc, finallyFunc) {
                kr3m.async.If.checkCondition(condition, function (isTrue) {
                    if (isTrue)
                        thenFunc(function () { return finallyFunc && finallyFunc(); });
                    else
                        elseFunc(function () { return finallyFunc && finallyFunc(); });
                });
            };
            return If;
        }());
        async.If = If;
    })(async = kr3m.async || (kr3m.async = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net;
    (function (net) {
        var MimeTypes = (function () {
            function MimeTypes() {
            }
            MimeTypes.getMimeTypeByUrl = function (url, fallbackType) {
                if (fallbackType === void 0) { fallbackType = "application/octet-stream"; }
                var extension = "." + kr3m.util.StringEx.getAfter(url, ".", false).toLowerCase();
                extension = kr3m.util.StringEx.getBefore(extension, "?");
                var contentType = kr3m.net.MimeTypes.contentTypesByExtension[extension] || fallbackType;
                return contentType;
            };
            MimeTypes.getMimeTypeByFileName = function (fileName) {
                var extension = pathLib.extname(fileName).toLowerCase();
                var contentType = kr3m.net.MimeTypes.contentTypesByExtension[extension] || "application/octet-stream";
                return contentType;
            };
            MimeTypes.isImageType = function (contentType) {
                return contentType.substr(0, 6) == "image/";
            };
            MimeTypes.isImage = function (filePathOrUrl) {
                return MimeTypes.isImageType(MimeTypes.getMimeTypeByUrl(filePathOrUrl));
            };
            MimeTypes.isTextType = function (contentType) {
                if (contentType == "text")
                    return true;
                if (contentType.substr(0, 5) == "text/")
                    return true;
                if (contentType == "application/xml")
                    return true;
                return false;
            };
            MimeTypes.isText = function (filePathOrUrl) {
                return MimeTypes.isTextType(MimeTypes.getMimeTypeByUrl(filePathOrUrl));
            };
            MimeTypes.contentTypesByExtension = {
                ".3gp": "video/3gpp",
                ".avi": "video/x-msvideo",
                ".bat": "text/plain",
                ".css": "text/css",
                ".csv": "text/x-csv",
                ".eot": "application/vnd.ms-fontobject",
                ".flv": "video/x-flv",
                ".gif": "image/gif",
                ".html": "text/html",
                ".ico": "image/x-icon",
                ".jpeg": "image/jpeg",
                ".jpg": "image/jpeg",
                ".js": "text/javascript",
                ".json": "text/json",
                ".m3u8": "application/x-mpegURL",
                ".md5anim": "text/plain",
                ".md5mesh": "text/plain",
                ".mov": "video/quicktime",
                ".mp3": "audio/mpeg",
                ".mp4": "video/mp4",
                ".ogg": "audio/ogg",
                ".ogm": "video/ogg",
                ".ogv": "video/ogg",
                ".otf": "application/x-font-opentype",
                ".pdf": "application/pdf",
                ".php": "text/html",
                ".png": "image/png",
                ".svg": "image/svg+xml",
                ".ts": "video/MP2T",
                ".ttf": "application/x-font-truetype",
                ".txt": "text/plain",
                ".wav": "audio/wav",
                ".webm": "video/webm",
                ".wmv": "video/x-ms-wmv",
                ".woff": "application/font-woff",
                ".xml": "text/xml",
                ".zip": "application/zip"
            };
            return MimeTypes;
        }());
        net.MimeTypes = MimeTypes;
    })(net = kr3m.net || (kr3m.net = {}));
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
            Rand.getSecureString = function (length, allowedCharacters, callback) {
                allowedCharacters = allowedCharacters || Rand.CHARS_ALPHA_NUM;
                var bpc = 1;
                var limit = 256;
                while (allowedCharacters.length >= limit) {
                    limit *= 256;
                    ++bpc;
                }
                cryptoLib.randomBytes(bpc * length, function (err, bytes) {
                    if (err) {
                        logError(err);
                        return callback(Rand.getString(length, allowedCharacters));
                    }
                    var alLen = allowedCharacters.length;
                    var result = "";
                    for (var i = 0; i < length; ++i) {
                        var accum = 0;
                        for (var j = 0; j < bpc; ++j)
                            accum = accum * 256 + bytes[i * bpc + j];
                        var c = Math.floor(accum / limit * alLen);
                        result += allowedCharacters.charAt(c);
                    }
                    callback(result);
                });
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
    var util;
    (function (util) {
        var File = (function () {
            function File() {
            }
            File.copyFile = function (sourcePath, targetPath, callback) {
                fsLib.open(sourcePath, "r", function (err, source) {
                    if (err) {
                        logError(err);
                        return callback && callback(false);
                    }
                    fsLib.open(targetPath, "w", function (err, target) {
                        if (err) {
                            logError(err);
                            fsLib.close(source, function () { });
                            return callback && callback(false);
                        }
                        var bufferSize = 1000000;
                        var buffer = Buffer.alloc(bufferSize);
                        var done = function (err) {
                            fsLib.close(target, function (err) {
                                fsLib.close(source, function (err) {
                                    if (err)
                                        logError(err);
                                    callback && callback(!err);
                                });
                            });
                        };
                        kr3m.async.Loop.loop(function (loopDone) {
                            fsLib.read(source, buffer, 0, bufferSize, null, function (err, bytesRead) {
                                if (err)
                                    return done(err);
                                fsLib.write(target, buffer, 0, bytesRead, function (err, bytesWritten) {
                                    if (err)
                                        return done(err);
                                    loopDone(bytesRead >= bufferSize);
                                });
                            });
                        }, function () { return done(); });
                    });
                });
            };
            File.loadJsonFileSync = function (path) {
                try {
                    var content = fsLib.readFileSync(path, { encoding: "utf8" });
                    var obj = util.Json.decode(content);
                    return obj;
                }
                catch (err) {
                    logError(err);
                    return undefined;
                }
            };
            File.loadJsonFile = function (path, callback) {
                fsLib.readFile(path, { encoding: "utf8" }, function (err, data) {
                    try {
                        var obj = util.Json.decode(data);
                        callback(obj);
                    }
                    catch (err) {
                        logError(err);
                        callback(undefined);
                    }
                });
            };
            File.getFileSize = function (path, callback) {
                fsLib.stat(path, function (err, stats) {
                    if (err)
                        return callback(-1);
                    callback(stats.size);
                });
            };
            File.fileExists = function (path, callback) {
                fsLib.stat(path, function (err, stats) {
                    if (err)
                        return callback(false);
                    callback(stats.isFile());
                });
            };
            File.folderExists = function (path, callback) {
                fsLib.stat(path, function (err, stats) {
                    if (err)
                        return callback(false);
                    callback(stats.isDirectory());
                });
            };
            File.deleteFolder = function (folderPath, callback) {
                fsLib.readdir(folderPath, function (err, files) {
                    if (err)
                        return callback(err["code"] == "ENOENT");
                    kr3m.async.Loop.forEach(files, function (file, next) {
                        var path = folderPath + "/" + file;
                        fsLib.stat(path, function (err, stats) {
                            if (err)
                                return callback(false);
                            kr3m.async.If.thenElse(stats.isDirectory(), function (thenDone) {
                                File.deleteFolder(path, function (success) {
                                    if (!success)
                                        return callback(false);
                                    thenDone();
                                });
                            }, function (elseDone) {
                                fsLib.unlink(path, function (err) {
                                    if (err)
                                        return callback(false);
                                    elseDone();
                                });
                            }, next);
                        });
                    }, function () {
                        fsLib.rmdir(folderPath, function (err) {
                            if (err) {
                                logError(err);
                                return callback(false);
                            }
                            callback(true);
                        });
                    });
                });
            };
            File.createFolder = function (folderPath, callback) {
                fsLib.exists(folderPath, function (exists) {
                    if (exists)
                        return callback && callback(true);
                    var parts = folderPath.split(/[\\\/]/);
                    folderPath = "";
                    kr3m.async.Loop.forEach(parts, function (part, next) {
                        if (!part)
                            return next();
                        folderPath = folderPath ? folderPath + "/" + part : part;
                        fsLib.exists(folderPath, function (exists) {
                            if (exists)
                                return next();
                            fsLib.mkdir(folderPath, function (error) {
                                if (error)
                                    return callback && callback(false);
                                next();
                            });
                        });
                    }, function () { return callback && callback(true); });
                });
            };
            File.createFileFolder = function (filePath, callback) {
                var parts = filePath.split(/[\\\/]/);
                if (parts.length < 2)
                    return callback(true);
                var folderPath = parts.slice(0, -1).join("/");
                File.createFolder(folderPath, callback);
            };
            File.getExtension = function (path) {
                var matches = path.match(/\.([^\.\/\\]+)$/);
                return matches ? matches[0].toLowerCase() : "";
            };
            File.getFilenameFromPath = function (path) {
                var matches = path.match(/.*[\\\/](.+)/);
                return matches ? matches[1] : path;
            };
            File.isInFolder = function (path, folderPath) {
                folderPath = folderPath.replace(/\/+$/, "/");
                return path.indexOf(folderPath) == 0;
            };
            File.saveDataUrl = function (dataUrl, filePath, callback) {
                var data = util.StringEx.captureNamed(dataUrl, kr3m.REGEX_DATA_URL, kr3m.REGEX_DATA_URL_GROUPS);
                if (data.encoding != "base64")
                    return callback(kr3m.ERROR_NOT_SUPPORTED);
                var buffer = Buffer.from(data.payload, data.encoding);
                fsLib.writeFile(filePath, buffer, function (err) {
                    if (err)
                        logError(err);
                    callback && callback(err ? kr3m.ERROR_FILE : kr3m.SUCCESS);
                });
            };
            File.getAsDataUrl = function (filePath, callback) {
                fsLib.readFile(filePath, function (err, buffer) {
                    if (err) {
                        logError(err);
                        return callback(undefined);
                    }
                    var base64 = buffer.toString("base64");
                    var mimeType = kr3m.net.MimeTypes.getMimeTypeByFileName(filePath);
                    var dataUrl = "data:" + mimeType + ";base64," + base64;
                    callback(dataUrl);
                });
            };
            File.getAsDataUrlSync = function (filePath) {
                try {
                    var buffer = fsLib.readFileSync(filePath);
                    var base64 = buffer.toString("base64");
                    var mimeType = kr3m.net.MimeTypes.getMimeTypeByFileName(filePath);
                    var dataUrl = "data:" + mimeType + ";base64," + base64;
                    return dataUrl;
                }
                catch (err) {
                    logError(err);
                    return undefined;
                }
            };
            File.resolvePath = function (filePath, relativePath) {
                if (relativePath.indexOf("/") == 0 || relativePath.indexOf(":") == 1)
                    return relativePath;
                var fileName = File.getFilenameFromPath(filePath);
                filePath = filePath.substr(0, filePath.length - fileName.length);
                var result = ((filePath.length > 0) ? filePath + "/" : "") + relativePath;
                result = result.replace(/[\\\/]+/g, "/");
                var oldResult = "";
                while (oldResult != result) {
                    oldResult = result;
                    result = result.replace(/\/([^\/\.])+\/\.\.\//g, "/");
                }
                oldResult = "";
                while (oldResult != result) {
                    oldResult = result;
                    result = result.replace(/\/\.\//g, "/");
                }
                return result;
            };
            File.getTempFilePath = function (callback) {
                var folder = osLib.tmpdir();
                kr3m.async.Loop.loop(function (loopDone) {
                    var tempPath = folder + "/" + util.Rand.getString(16);
                    fsLib.exists(tempPath, function (exists) {
                        if (exists)
                            return loopDone(true);
                        callback(tempPath);
                    });
                });
            };
            File.crawl = function (folderPath, func, options) {
                options = options || {};
                options.wantFiles = options.wantFiles === undefined ? true : options.wantFiles;
                options.wantFolders = options.wantFolders === undefined ? true : options.wantFolders;
                options.recursive = options.recursive === undefined ? true : options.recursive;
                var rootPath = fsLib.realpathSync(folderPath);
                if (!rootPath)
                    return;
                var pendingFolders = ["."];
                while (pendingFolders.length > 0) {
                    var currentFolder = pendingFolders.shift();
                    var folderFiles = fsLib.readdirSync(rootPath + "/" + currentFolder);
                    for (var i = 0; i < folderFiles.length; ++i) {
                        var relativePath = currentFolder == "." ? folderFiles[i] : currentFolder + "/" + folderFiles[i];
                        var absolutePath = fsLib.realpathSync(rootPath + "/" + relativePath);
                        var matches = !options.pattern || options.pattern.test(relativePath);
                        var stats = fsLib.statSync(absolutePath);
                        if (stats.isDirectory()) {
                            if (options.recursive)
                                pendingFolders.push(relativePath);
                            if (options.wantFolders && matches)
                                func(relativePath, true, absolutePath);
                        }
                        else {
                            if (options.wantFiles && matches)
                                func(relativePath, false, absolutePath);
                        }
                    }
                }
            };
            File.crawlAsync = function (folderPath, func, options, callback) {
                options = options || {};
                options.wantFiles = options.wantFiles === undefined ? true : options.wantFiles;
                options.wantFolders = options.wantFolders === undefined ? true : options.wantFolders;
                options.recursive = options.recursive === undefined ? true : options.recursive;
                fsLib.realpath(folderPath, function (err, rootPath) {
                    if (!rootPath)
                        return callback && callback();
                    var pendingFolders = ["."];
                    kr3m.async.Loop.loop(function (nextFolder) {
                        if (pendingFolders.length == 0)
                            return callback && callback();
                        var currentFolder = pendingFolders.shift();
                        fsLib.readdir(rootPath + "/" + currentFolder, function (err, folderFiles) {
                            kr3m.async.Loop.forEach(folderFiles, function (folderFile, nextFile) {
                                var relativePath = currentFolder == "." ? folderFile : currentFolder + "/" + folderFile;
                                fsLib.realpath(rootPath + "/" + relativePath, function (err, absolutePath) {
                                    var matches = !options.pattern || options.pattern.test(relativePath);
                                    fsLib.stat(absolutePath, function (err, stats) {
                                        if (stats.isDirectory()) {
                                            if (options.recursive)
                                                pendingFolders.push(relativePath);
                                            if (options.wantFolders && matches)
                                                return func(relativePath, nextFile, true, absolutePath);
                                        }
                                        else {
                                            if (options.wantFiles && matches)
                                                return func(relativePath, nextFile, false, absolutePath);
                                        }
                                        nextFile();
                                    });
                                });
                            }, nextFolder);
                        });
                    });
                });
            };
            File.getSubFolders = function (folder, recursive, callback) {
                var subFolders = [];
                File.crawlAsync(folder, function (relativePath, next) {
                    subFolders.push(relativePath);
                    next();
                }, { wantFiles: false, wantFolders: true, recursive: recursive }, function () { return callback(subFolders); });
            };
            File.getFileSizes = function () {
                var folder = arguments[0];
                var pattern = arguments.length > 2 ? arguments[1] : undefined;
                var callback = arguments[arguments.length - 1];
                var sizes = {};
                File.crawlAsync(folder, function (relativePath, next) {
                    File.getFileSize(folder + "/" + relativePath, function (size) {
                        sizes[relativePath] = size;
                        next();
                    });
                }, { wantFiles: true, wantFolders: false, recursive: true, pattern: pattern }, function () { return callback(sizes); });
            };
            return File;
        }());
        util.File = File;
    })(util = kr3m.util || (kr3m.util = {}));
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
        var Queue = (function () {
            function Queue(autoRun, parallelCount) {
                if (autoRun === void 0) { autoRun = false; }
                if (parallelCount === void 0) { parallelCount = 1; }
                this.pending = [];
                this.callbacks = [];
                this.runningCount = 0;
                this.autoRun = autoRun;
                this.parallelCount = parallelCount;
            }
            Queue.prototype.setParallelCount = function (parallelCount) {
                this.parallelCount = parallelCount;
            };
            Queue.prototype.getLength = function () {
                return this.pending.length;
            };
            Object.defineProperty(Queue.prototype, "length", {
                get: function () {
                    return this.pending.length;
                },
                enumerable: true,
                configurable: true
            });
            Queue.prototype.clear = function () {
                this.pending = [];
            };
            Queue.prototype.push = function (func) {
                this.pending.push(func);
                if (this.autoRun)
                    this.start();
            };
            Queue.prototype.add = function (func) {
                this.push(func);
            };
            Queue.prototype.unshift = function (func) {
                this.pending.unshift(func);
                if (this.autoRun)
                    this.start();
            };
            Queue.prototype.addCallback = function (callback) {
                this.callbacks.push(callback);
            };
            Queue.prototype.callCallbacks = function () {
                for (var i = 0; i < this.callbacks.length; ++i)
                    this.callbacks[i]();
                this.callbacks = [];
            };
            Queue.prototype.isRunning = function () {
                return this.runningCount > 0;
            };
            Queue.prototype.run = function () {
                this.start();
            };
            Queue.prototype.start = function () {
                var _this = this;
                if (this.runningCount < this.parallelCount) {
                    var currentFunc = this.pending.shift();
                    if (currentFunc) {
                        ++this.runningCount;
                        currentFunc(function () {
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
            return Queue;
        }());
        async.Queue = Queue;
    })(async = kr3m.async || (kr3m.async = {}));
})(kr3m || (kr3m = {}));
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
var kr3m;
(function (kr3m) {
    var cache;
    (function (cache) {
        var files;
        (function (files) {
            var Abstract = (function (_super) {
                __extends(Abstract, _super);
                function Abstract() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return Abstract;
            }(kr3m.model.EventDispatcher));
            files.Abstract = Abstract;
        })(files = cache.files || (cache.files = {}));
    })(cache = kr3m.cache || (kr3m.cache = {}));
})(kr3m || (kr3m = {}));
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
    var net;
    (function (net) {
        var HttpRequest = (function () {
            function HttpRequest(url, params, method) {
                if (method === void 0) { method = HttpRequest.HTTP_POST; }
                this.headers = {};
                this.rejectSelfSigned = true;
                this.followRedirection = true;
                this.arrayHandling = kr3m.util.ArrayHandling.ToString;
                this.convertTextFiles = true;
                this.url = url;
                this.params = params;
                this.method = method;
            }
            HttpRequest.prototype.getUrl = function () {
                return this.url;
            };
            HttpRequest.prototype.getMethod = function () {
                return this.method;
            };
            HttpRequest.prototype.setBody = function (body, contentType) {
                this.body = body;
                this.contentType = contentType;
                if (this.method == "POST")
                    this.params = null;
            };
            HttpRequest.prototype.setHttpAuth = function (user, password) {
                this.auth = user + ":" + password;
            };
            HttpRequest.prototype.setHeaders = function (headers) {
                this.headers = headers || {};
            };
            HttpRequest.prototype.setHeader = function (name, value) {
                this.headers[name] = value;
            };
            HttpRequest.prototype.addHeader = function (name, value) {
                this.setHeader(name, value);
            };
            HttpRequest.prototype.setParams = function (params) {
                this.params = params;
            };
            HttpRequest.prototype.rejectSelfSignedCertificates = function (value) {
                if (value === void 0) { value = true; }
                this.rejectSelfSigned = value;
            };
            HttpRequest.prototype.setTimeout = function (timeout, timeoutCallback) {
                this.timeout = timeout;
                this.timeoutCallback = timeoutCallback;
            };
            HttpRequest.prototype.send = function (callback, errorCallback) {
                var _this = this;
                var urlObj = kr3m.util.Url.parse(this.url);
                var options = {
                    agent: false,
                    hostname: urlObj.domain,
                    protocol: urlObj.protocol ? urlObj.protocol + ":" : "http:",
                    port: urlObj.port || undefined,
                    path: kr3m.util.Url.getPath(urlObj),
                    method: this.method,
                    rejectUnauthorized: this.rejectSelfSigned,
                    headers: {}
                };
                if (this.auth)
                    options.auth = this.auth;
                for (var i in this.headers)
                    options.headers[i] = this.headers[i];
                if (this.method == "POST" && this.params) {
                    this.body = querystringLib.stringify(this.params);
                    options.headers["Content-Length"] = this.body.length;
                    this.contentType = "application/x-www-form-urlencoded";
                }
                else if (this.method == "GET") {
                    if (this.params)
                        options.path = kr3m.util.Url.addParameters(options.path, this.params, this.arrayHandling);
                }
                if (this.body)
                    options.headers["Content-Length"] = this.body.length;
                if (this.contentType)
                    options.headers["Content-Type"] = this.contentType;
                var lib = options.protocol == "https:" ? httpsLib : httpLib;
                var request = lib.request(options, function (response) {
                    var contentType = response.headers["content-type"] || "";
                    var binContent = new Buffer(0);
                    response.on("data", function (chunk) {
                        binContent = Buffer.concat([binContent, chunk]);
                    });
                    response.on("end", function () {
                        if (response.statusCode >= 200 && response.statusCode < 300) {
                            if (_this.convertTextFiles && net.MimeTypes.isTextType(contentType))
                                return callback && callback(binContent.toString("utf8"), contentType, response.headers);
                            else
                                return callback && callback(binContent, contentType, response.headers);
                        }
                        if ((response.statusCode == 301 || response.statusCode == 302)
                            && _this.followRedirection && response.headers.location) {
                            _this.url = response.headers.location;
                            _this.send(callback, errorCallback);
                            return;
                        }
                        if (errorCallback)
                            return errorCallback(binContent.toString(), response.statusCode, response.headers, binContent.toString());
                        logError("HttpRequest to " + _this.url + " returned with code", response.statusCode);
                        logError(response.headers);
                        logError(binContent.toString());
                    });
                });
                if (this.timeout) {
                    request.setTimeout(this.timeout, function () {
                        request.abort();
                        _this.timeoutCallback && _this.timeoutCallback();
                    });
                }
                request.on("abort", function () {
                    var errorMessage = "HttpRequest to " + _this.url + " was aborted";
                    if (_this.timeout)
                        errorMessage = "HttpRequest to " + _this.url + " timed out";
                    errorMessage += _this.url;
                    if (errorCallback)
                        return errorCallback(errorMessage, -2, {}, "");
                    logWarning(errorMessage);
                });
                request.on("error", function (err) {
                    if (errorCallback)
                        return errorCallback(err.message || err.toString(), -1, {}, "");
                    logError("HttpRequest to " + _this.url + " returned with error");
                    logError(err);
                });
                if (this.body)
                    request.write(this.body);
                request.end();
            };
            HttpRequest.download = function (url, filePath, callback, errorCallback) {
                var request = new HttpRequest(url, null, "GET");
                request.send(function (response, mimeType) {
                    fsLib.writeFile(filePath, response, function (err) {
                        if (err)
                            return errorCallback && errorCallback();
                        callback && callback();
                    });
                }, function () { return errorCallback && errorCallback(); });
            };
            HttpRequest.HTTP_POST = "POST";
            HttpRequest.HTTP_GET = "GET";
            return HttpRequest;
        }());
        net.HttpRequest = HttpRequest;
    })(net = kr3m.net || (kr3m.net = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var cache;
    (function (cache) {
        var files;
        (function (files) {
            var Downloads = (function (_super) {
                __extends(Downloads, _super);
                function Downloads() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.downloads = {};
                    _this.listeners = {};
                    _this.ttl = 60000;
                    return _this;
                }
                Downloads.getInstance = function () {
                    if (!Downloads.instance)
                        Downloads.instance = new Downloads();
                    return Downloads.instance;
                };
                Downloads.prototype.callListeners = function (url, content, mimeType) {
                    if (!this.listeners[url])
                        return;
                    var listeners = this.listeners[url];
                    delete this.listeners[url];
                    for (var i = 0; i < listeners.length; ++i)
                        listeners[i](content, mimeType);
                };
                Downloads.prototype.getNewerFile = function (url, ttl, callback) {
                    var _this = this;
                    var threshold = Date.now() - ttl;
                    var download = this.downloads[url];
                    if (download && download.downloaded >= threshold)
                        return callback(download.data, download.mimeType);
                    if (this.listeners[url]) {
                        this.listeners[url].push(callback);
                        return;
                    }
                    this.listeners[url] = [callback];
                    var request = new kr3m.net.HttpRequest(url, null, "GET");
                    request.convertTextFiles = false;
                    logVerbose("downloading", url);
                    if (download && download.lastModified)
                        request.setHeader("If-Modified-Since", new Date(download.lastModified).toUTCString());
                    request.send(function (content, mimeType, headers) {
                        logVerbose("downloaded", url);
                        var lastModified = headers["last-modified"] ? new Date(headers["last-modified"]).getTime() : 0;
                        _this.downloads[url] =
                            {
                                data: content,
                                mimeType: mimeType,
                                downloaded: Date.now(),
                                lastModified: lastModified
                            };
                        _this.callListeners(url, content, mimeType);
                    }, function (errorMessage, statusCode, headers, errorBody) {
                        if (statusCode == 304) {
                            download.downloaded = Date.now();
                            if (headers["last-modified"])
                                download.lastModified = new Date(headers["last-modified"]).getTime();
                            return _this.callListeners(url, download.data, download.mimeType);
                        }
                        logDebug("download error", url, statusCode, errorMessage);
                        _this.downloads[url] =
                            {
                                data: null,
                                mimeType: null,
                                downloaded: Date.now(),
                                lastModified: 0
                            };
                        _this.callListeners(url, null, null);
                    });
                };
                Downloads.prototype.getFile = function (url, callback) {
                    this.getNewerFile(url, this.ttl, callback);
                };
                Downloads.prototype.getTextFile = function (url, callback) {
                    this.getFile(url, function (raw) {
                        var content = raw ? raw.toString("utf8") : "";
                        content = kr3m.util.StringEx.stripBom(content);
                        callback(content);
                    });
                };
                Downloads.prototype.getModified = function (url, callback) {
                    callback(this.downloads[url] ? new Date(this.downloads[url].downloaded) : undefined);
                };
                Downloads.prototype.setDirty = function (url, callback) {
                    if (this.downloads[url])
                        this.downloads[url].downloaded = 0;
                    callback && callback();
                };
                return Downloads;
            }(files.Abstract));
            files.Downloads = Downloads;
        })(files = cache.files || (cache.files = {}));
    })(cache = kr3m.cache || (kr3m.cache = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var async;
    (function (async) {
        var CriticalSectionReadWrite = (function () {
            function CriticalSectionReadWrite(limitWrite, limitRead) {
                if (limitWrite === void 0) { limitWrite = 1; }
                if (limitRead === void 0) { limitRead = 0; }
                this.currentRead = 0;
                this.pendingRead = [];
                this.currentWrite = 0;
                this.pendingWrite = [];
                this.limitRead = limitRead;
                this.limitWrite = limitWrite;
            }
            CriticalSectionReadWrite.prototype.setLimits = function (limitWrite, limitRead) {
                this.limitRead = limitRead;
                this.limitWrite = limitWrite;
            };
            CriticalSectionReadWrite.prototype.check = function () {
                if (this.pendingWrite.length > 0) {
                    if (this.currentRead > 0)
                        return;
                    if (this.limitWrite > 0 && this.currentWrite >= this.limitWrite)
                        return;
                    ++this.currentWrite;
                    var func = this.pendingWrite.shift();
                    func(this.exitWrite.bind(this));
                    return;
                }
                if (this.pendingRead.length > 0) {
                    if (this.currentWrite > 0)
                        return;
                    if (this.limitRead > 0 && this.currentRead >= this.limitRead)
                        return;
                    ++this.currentRead;
                    var func = this.pendingRead.shift();
                    func(this.exitRead.bind(this));
                    return;
                }
            };
            CriticalSectionReadWrite.prototype.exitWrite = function () {
                --this.currentWrite;
                this.check();
            };
            CriticalSectionReadWrite.prototype.exitRead = function () {
                --this.currentRead;
                this.check();
            };
            CriticalSectionReadWrite.prototype.enterWrite = function (func) {
                this.pendingWrite.push(func);
                this.check();
            };
            CriticalSectionReadWrite.prototype.enterRead = function (func) {
                this.pendingRead.push(func);
                this.check();
            };
            CriticalSectionReadWrite.prototype.hasPending = function () {
                return this.pendingWrite.length + this.pendingRead.length > 0;
            };
            CriticalSectionReadWrite.prototype.isEmpty = function () {
                return this.currentWrite + this.currentRead <= 0;
            };
            CriticalSectionReadWrite.prototype.getCurrentCount = function () {
                return this.currentWrite + this.currentRead;
            };
            CriticalSectionReadWrite.prototype.getPendingCount = function () {
                return this.pendingWrite.length + this.pendingRead.length;
            };
            CriticalSectionReadWrite.prototype.getLimitRead = function () {
                return this.limitRead;
            };
            CriticalSectionReadWrite.prototype.getLimitWrite = function () {
                return this.limitWrite;
            };
            return CriticalSectionReadWrite;
        }());
        async.CriticalSectionReadWrite = CriticalSectionReadWrite;
    })(async = kr3m.async || (kr3m.async = {}));
})(kr3m || (kr3m = {}));
var zLib = require("zlib");
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var FWPollMeta = (function () {
            function FWPollMeta() {
                this.listeners = [];
            }
            return FWPollMeta;
        }());
        var FWEventMeta = (function () {
            function FWEventMeta() {
                this.lastCalled = {};
                this.listeners = [];
            }
            return FWEventMeta;
        }());
        var FolderWatcher = (function () {
            function FolderWatcher() {
            }
            FolderWatcher.getTimestamps = function (path, recursive, callback) {
                util.File.folderExists(path, function (exists) {
                    if (!exists)
                        return callback({});
                    var timestamps = {};
                    util.File.crawlAsync(path, function (relativePath, next, isFolder, absolutePath) {
                        fsLib.stat(absolutePath, function (err, stats) {
                            if (err)
                                return next();
                            timestamps[relativePath] = stats.mtime.getTime();
                            next();
                        });
                    }, { wantFiles: true, wantFolders: false, recursive: recursive }, function () {
                        callback(timestamps);
                    });
                });
            };
            FolderWatcher.poll = function () {
                var metas = FolderWatcher.pollRecursive ? FolderWatcher.pollMetaRecursive : FolderWatcher.pollMetaFlat;
                var paths = Object.keys(metas);
                if (FolderWatcher.pollNext < paths.length) {
                    var path = paths[FolderWatcher.pollNext];
                    var meta = metas[path];
                    if (!meta.files) {
                        ++FolderWatcher.pollNext;
                        setTimeout(FolderWatcher.poll, 10);
                        return;
                    }
                    var changed = [];
                    FolderWatcher.getTimestamps(path, FolderWatcher.pollRecursive, function (timestamps) {
                        for (var file in timestamps) {
                            if (meta.files[file] != timestamps[file])
                                changed.push(file);
                            delete meta.files[file];
                        }
                        for (var file in meta.files)
                            changed.push(file);
                        meta.files = timestamps;
                        for (var i = 0; i < changed.length; ++i) {
                            for (var j = 0; j < meta.listeners.length; ++j)
                                meta.listeners[j](changed[i]);
                        }
                        ++FolderWatcher.pollNext;
                        setTimeout(FolderWatcher.poll, 100);
                    });
                }
                else {
                    FolderWatcher.pollNext = 0;
                    FolderWatcher.pollRecursive = !FolderWatcher.pollRecursive;
                    setTimeout(FolderWatcher.poll, 10);
                }
            };
            FolderWatcher.watchPolling = function (realPath, listener, recursive) {
                var metas = recursive ? FolderWatcher.pollMetaRecursive : FolderWatcher.pollMetaFlat;
                if (!metas[realPath])
                    metas[realPath] = new FWPollMeta();
                var meta = metas[realPath];
                meta.listeners.push(listener);
                if (meta.listeners.length > 1)
                    return;
                if (!FolderWatcher.polling) {
                    FolderWatcher.polling = true;
                    FolderWatcher.poll();
                }
                FolderWatcher.getTimestamps(realPath, recursive, function (files) {
                    meta.files = files;
                });
            };
            FolderWatcher.handleEvent = function (path, eventType, fileName) {
                var meta = FolderWatcher.eventsMeta[path];
                if (!meta)
                    return;
                var now = Date.now();
                var threshold = now - 1000;
                var changedFiles = {};
                kr3m.async.If.thenElse(fileName, function (thenDone) {
                    changedFiles[fileName] = now;
                    thenDone();
                }, function (elseDone) {
                    FolderWatcher.getTimestamps(path, false, function (timestamps) {
                        for (fileName in timestamps) {
                            if (timestamps[fileName] > threshold)
                                changedFiles[fileName] = timestamps[fileName];
                        }
                        elseDone();
                    });
                }, function () {
                    for (fileName in changedFiles) {
                        if ((meta.lastCalled[fileName] || 0) <= threshold) {
                            for (var i = 0; i < meta.listeners.length; ++i)
                                meta.listeners[i].listener(meta.listeners[i].prefix + fileName);
                        }
                        meta.lastCalled[fileName] = now;
                    }
                });
            };
            FolderWatcher.watchEvents = function (realPath, listener, recursive) {
                var paths = [realPath];
                kr3m.async.If.then(recursive, function (thenDone) {
                    util.File.getSubFolders(realPath, true, function (subFolders) {
                        paths = subFolders.map(function (subFolder) { return realPath + "/" + subFolder; });
                        paths.unshift(realPath);
                        thenDone();
                    });
                }, function () {
                    for (var i = 0; i < paths.length; ++i) {
                        if (!FolderWatcher.eventsMeta[paths[i]])
                            FolderWatcher.eventsMeta[paths[i]] = new FWEventMeta();
                        var prefix = paths[i].slice(realPath.length + 1);
                        if (prefix)
                            prefix += "/";
                        FolderWatcher.eventsMeta[paths[i]].listeners.push({ prefix: prefix, listener: listener });
                        if (FolderWatcher.eventsMeta[paths[i]].listeners.length == 1) {
                            var options = { persistent: false, recursive: false, enconding: "utf8" };
                            fsLib.watch(paths[i], options, FolderWatcher.handleEvent.bind(null, paths[i]));
                        }
                    }
                });
            };
            FolderWatcher.watch = function (folderPath, listener, recursive) {
                if (recursive === void 0) { recursive = true; }
                fsLib.realpath(folderPath, function (err, realPath) {
                    if (!realPath)
                        return;
                    if (FolderWatcher.usePolling)
                        FolderWatcher.watchPolling(realPath, listener, recursive);
                    else
                        FolderWatcher.watchEvents(realPath, listener, recursive);
                });
            };
            FolderWatcher.pollMetaFlat = {};
            FolderWatcher.pollMetaRecursive = {};
            FolderWatcher.eventsMeta = {};
            FolderWatcher.pollNext = 0;
            FolderWatcher.pollRecursive = false;
            FolderWatcher.polling = false;
            FolderWatcher.usePolling = false;
            return FolderWatcher;
        }());
        util.FolderWatcher = FolderWatcher;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var cache;
    (function (cache) {
        var files;
        (function (files) {
            var LfMeta = (function () {
                function LfMeta() {
                    this.loading = false;
                    this.delay = new kr3m.async.Delayed();
                }
                return LfMeta;
            }());
            var LocalFiles = (function (_super) {
                __extends(LocalFiles, _super);
                function LocalFiles() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.cs = new kr3m.async.CriticalSectionReadWrite();
                    _this.metaData = {};
                    _this.watched = {};
                    return _this;
                }
                LocalFiles.getInstance = function () {
                    if (!LocalFiles.instance)
                        LocalFiles.instance = new LocalFiles();
                    return LocalFiles.instance;
                };
                LocalFiles.prototype.watchFileFolder = function (filePath, callback) {
                    var _this = this;
                    fsLib.realpath(filePath, function (err, realPath) {
                        if (err) {
                            logError("could not watch file", filePath);
                            return callback();
                        }
                        var folderPath = realPath.split(/[\/\\]/).slice(0, -1).join("/");
                        if (_this.watched[folderPath])
                            return callback();
                        _this.watched[folderPath] = true;
                        kr3m.util.FolderWatcher.watch(folderPath, function (changedPath) {
                            fsLib.realpath(folderPath + "/" + changedPath, function (err, realPath) {
                                if (!err)
                                    _this.forgetFile(realPath);
                            });
                        }, false);
                        callback();
                    });
                };
                LocalFiles.prototype.reloadFile = function (path, callback) {
                    var _this = this;
                    fsLib.stat(path, function (err, stats) {
                        if (!stats || stats.isDirectory())
                            return callback(null);
                        fsLib.readFile(path, function (err, file) {
                            if (err) {
                                logError("loading error", err);
                                return callback(null);
                            }
                            _this.watchFileFolder(path, function () {
                                var event = {
                                    content: file,
                                    modified: stats.mtime,
                                    path: path
                                };
                                _this.dispatch(LocalFiles.EVENT_LOAD, event);
                                callback(event.content, event.modified);
                            });
                        });
                    });
                };
                LocalFiles.prototype.deflate = function (path, callback) {
                    var _this = this;
                    this.getEncodedFile(path, "none", function (unencoded, encoding, modified) {
                        if (!unencoded)
                            return callback(undefined, undefined);
                        zLib.deflate(unencoded, function (err, encoded) {
                            if (err) {
                                logError(err);
                                return callback(undefined, undefined);
                            }
                            var event = {
                                encodedContent: encoded,
                                encoding: encoding,
                                modified: modified,
                                path: path,
                                rawContent: unencoded
                            };
                            _this.dispatch(LocalFiles.EVENT_ENCODE, event);
                            callback(event.encodedContent, event.modified);
                        });
                    });
                };
                LocalFiles.prototype.gzip = function (path, callback) {
                    var _this = this;
                    this.getEncodedFile(path, "none", function (unencoded, encoding, modified) {
                        if (!unencoded)
                            return callback(undefined, undefined);
                        zLib.gzip(unencoded, function (err, encoded) {
                            if (err) {
                                logError(err);
                                return callback(undefined, undefined);
                            }
                            var event = {
                                encodedContent: encoded,
                                encoding: encoding,
                                modified: modified,
                                path: path,
                                rawContent: unencoded
                            };
                            _this.dispatch(LocalFiles.EVENT_ENCODE, event);
                            callback(event.encodedContent, event.modified);
                        });
                    });
                };
                LocalFiles.prototype.none = function (path, callback) {
                    this.reloadFile(path, callback);
                };
                LocalFiles.prototype.forgetFile = function (path) {
                    if (!this.metaData[path])
                        return;
                    for (var i = 0; i < LocalFiles.ENCODINGS.length; ++i) {
                        var md = this.metaData[path][LocalFiles.ENCODINGS[i]];
                        md.delay.reset(false);
                        md.loading = false;
                        md.modified = new Date();
                    }
                    var event = {
                        path: path
                    };
                    this.dispatch(LocalFiles.EVENT_FORGET, event);
                };
                LocalFiles.prototype.getEncodedFile = function (path, encoding, callback) {
                    var _this = this;
                    if (!this.metaData[path]) {
                        this.metaData[path] = {};
                        for (var i = 0; i < LocalFiles.ENCODINGS.length; ++i)
                            this.metaData[path][LocalFiles.ENCODINGS[i]] = new LfMeta();
                    }
                    this.metaData[path][encoding].delay.call(function () {
                        callback(_this.metaData[path][encoding].file, encoding != "none" ? encoding : null, _this.metaData[path][encoding].modified);
                    });
                    if (!this.metaData[path][encoding].loading) {
                        var encodeFunc = this[encoding].bind(this);
                        this.metaData[path][encoding].loading = true;
                        encodeFunc(path, function (file, modified) {
                            _this.metaData[path][encoding].file = file;
                            _this.metaData[path][encoding].modified = modified;
                            _this.metaData[path][encoding].delay.execute();
                        });
                    }
                };
                LocalFiles.prototype.getFile = function () {
                    var _this = this;
                    var acceptedEncodings = arguments.length > 2 ? arguments[1] : [];
                    var callback = arguments[arguments.length - 1];
                    var path = arguments[0];
                    this.cs.enterRead(function (exit) {
                        fsLib.realpath(path, function (err, realPath) {
                            if (err)
                                return callback(undefined, undefined, undefined);
                            acceptedEncodings = kr3m.util.Util.intersect(acceptedEncodings, LocalFiles.ENCODINGS);
                            acceptedEncodings.push("none");
                            var requestEvent = {
                                acceptedEncodings: acceptedEncodings,
                                path: realPath
                            };
                            _this.dispatch(LocalFiles.EVENT_REQUEST, requestEvent);
                            _this.getEncodedFile(requestEvent.path, requestEvent.acceptedEncodings[0], function (content, encoding, modified) {
                                exit();
                                var deliverEvent = {
                                    content: content,
                                    encoding: encoding,
                                    modified: modified,
                                    path: requestEvent.path
                                };
                                _this.dispatch(LocalFiles.EVENT_DELIVER, deliverEvent);
                                callback(deliverEvent.content, deliverEvent.encoding, deliverEvent.modified);
                            });
                        });
                    });
                };
                LocalFiles.prototype.getTextFile = function (path, callback) {
                    this.getFile(path, function (raw) {
                        var content = raw ? raw.toString("utf8") : "";
                        content = kr3m.util.StringEx.stripBom(content);
                        callback(content);
                    });
                };
                LocalFiles.prototype.getModified = function (path, callback) {
                    var _this = this;
                    this.cs.enterRead(function (exit) {
                        fsLib.realpath(path, function (err, realPath) {
                            kr3m.async.If.thenElse(_this.metaData[realPath], function (thenDone) {
                                var modified = _this.metaData[realPath]["none"].modified;
                                exit();
                                callback(modified);
                            }, function (elseDone) {
                                fsLib.stat(realPath, function (err, stats) {
                                    var modified = err ? undefined : stats.mtime;
                                    exit();
                                    callback(modified);
                                });
                            });
                        });
                    });
                };
                LocalFiles.prototype.setDirty = function (path, callback) {
                    var _this = this;
                    this.cs.enterWrite(function (exit) {
                        fsLib.realpath(path, function (err, realPath) {
                            if (!err)
                                _this.forgetFile(realPath);
                            exit();
                            callback && callback();
                        });
                    });
                };
                LocalFiles.prototype.fileExists = function (path, callback) {
                    var _this = this;
                    this.cs.enterRead(function (exit) {
                        fsLib.realpath(path, function (err, realPath) {
                            if (err)
                                return callback(false);
                            if (_this.metaData[realPath])
                                return callback(true);
                            kr3m.util.File.fileExists(realPath, function (exists) {
                                exit();
                                callback(exists);
                            });
                        });
                    });
                };
                LocalFiles.EVENT_DELIVER = "deliver";
                LocalFiles.EVENT_ENCODE = "encode";
                LocalFiles.EVENT_FORGET = "forget";
                LocalFiles.EVENT_LOAD = "load";
                LocalFiles.EVENT_REQUEST = "request";
                LocalFiles.ENCODINGS = ["deflate", "gzip", "none"];
                return LocalFiles;
            }(files.Abstract));
            files.LocalFiles = LocalFiles;
        })(files = cache.files || (cache.files = {}));
    })(cache = kr3m.cache || (kr3m.cache = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var cache;
    (function (cache) {
        var files;
        (function (files) {
            var Smart = (function (_super) {
                __extends(Smart, _super);
                function Smart(downloads, localFiles) {
                    var _this = _super.call(this) || this;
                    _this.downloads = downloads;
                    _this.localFiles = localFiles;
                    return _this;
                }
                Smart.getInstance = function () {
                    if (!Smart.instance)
                        Smart.instance = new Smart(files.Downloads.getInstance(), files.LocalFiles.getInstance());
                    return Smart.instance;
                };
                Smart.prototype.isRemote = function (path) {
                    var parts = kr3m.util.Url.parse(path);
                    return !!parts.protocol;
                };
                Smart.prototype.getSub = function (path) {
                    return this.isRemote(path) ? this.downloads : this.localFiles;
                };
                Smart.prototype.getFile = function (path, callback) {
                    this.getSub(path).getFile(path, callback);
                };
                Smart.prototype.getTextFile = function (path, callback) {
                    this.getSub(path).getTextFile(path, callback);
                };
                Smart.prototype.getModified = function (path, callback) {
                    this.getSub(path).getModified(path, callback);
                };
                Smart.prototype.setDirty = function (path, callback) {
                    this.getSub(path).setDirty(path, callback);
                };
                return Smart;
            }(files.Abstract));
            files.Smart = Smart;
        })(files = cache.files || (cache.files = {}));
    })(cache = kr3m.cache || (kr3m.cache = {}));
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
                    if (value === null || value === undefined)
                        util.Log.logWarning("unknown token:", tokenParts[0]);
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
    var html;
    (function (html_1) {
        var Helper = (function () {
            function Helper() {
            }
            Helper.prototype.processCode = function (code, tokens, locFunc, locParseFunc) {
                if (tokens) {
                    if (locParseFunc)
                        code = locParseFunc(code, tokens);
                    else
                        code = kr3m.util.Tokenizer.get(code, tokens);
                }
                if (locFunc && !locParseFunc)
                    code = code.replace(/loc\(\s*([\w_-]+)\s*\)/gm, function (match, p1) { return locFunc(p1, tokens); });
                return code;
            };
            Helper.prototype.getNextNode = function (code, offset) {
                if (offset === void 0) { offset = 0; }
                for (var i = offset; i < code.length; ++i) {
                    if (code.charAt(i) == "<") {
                        var quote = "";
                        for (var j = i + 1; j < code.length; ++j) {
                            var t = code.charAt(j);
                            switch (t) {
                                case ">":
                                    if (!quote)
                                        return [code.slice(i, j + 1), i];
                                    break;
                                case "'":
                                case "\"":
                                    if (quote) {
                                        if (quote == t)
                                            quote = "";
                                    }
                                    else {
                                        quote = t;
                                    }
                                    break;
                            }
                        }
                        return [code.slice(i), i];
                    }
                }
                return [null, -1];
            };
            Helper.prototype.getNodeTag = function (node) {
                var matches = node.match(/^<\/?(.+?)\b/);
                return matches ? matches[1].toLowerCase() : null;
            };
            Helper.prototype.stripTags = function (code, keepTags, stripAttributes) {
                if (keepTags === void 0) { keepTags = []; }
                if (stripAttributes === void 0) { stripAttributes = true; }
                var offset = 0;
                while (true) {
                    var _a = this.getNextNode(code, offset), node = _a[0], offset = _a[1];
                    if (!node)
                        break;
                    var tag = this.getNodeTag(node);
                    if (keepTags.indexOf(tag) >= 0) {
                        if (stripAttributes) {
                            var newNode = "<";
                            if (node.charAt(1) == "/")
                                newNode += "/";
                            newNode += tag;
                            if (node.charAt(node.length - 2) == "/")
                                newNode += "/";
                            newNode += ">";
                            code = code.slice(0, offset) + newNode + code.slice(offset + node.length);
                            offset += newNode.length;
                        }
                        else {
                            offset += node.length;
                        }
                    }
                    else {
                        code = code.slice(0, offset) + code.slice(offset + node.length);
                    }
                }
                return code;
            };
            Helper.prototype.extractImageUrls = function (code) {
                var pat = /<img [^>]*src=["']([^'"]+)['"][^>]*>/ig;
                var matches;
                var urls = [];
                while (matches = pat.exec(code))
                    urls.push(matches[1]);
                return urls;
            };
            Helper.prototype.stripComments = function (html) {
                var pat = /\<\!\-\-.*?\-\-\>/g;
                return html.replace(pat, "");
            };
            Helper.prototype.getBody = function (code, tokens, locFunc) {
                var matchResult = code.match(/<body[^>]*>([\s\S]*)<\/body>/im);
                code = matchResult ? matchResult[1] : code;
                return this.processCode(code, tokens, locFunc);
            };
            Helper.prototype.renderElement = function (tag, attributes) {
                var code = "<" + tag;
                var attrText = kr3m.util.StringEx.joinAssoc(attributes, '" ', '="');
                if (attrText != "")
                    code += attrText + '"';
                code += "/>";
                return code;
            };
            Helper.prototype.getTemplateKey = function (templateUrl) {
                return templateUrl.replace(/[^\w\d]/g, "_");
            };
            Helper.prototype.wrapHtml = function (bodyContent) {
                return Helper.DOCTYPE + "\n<html><head/><body>" + bodyContent + "</body></html>";
            };
            Helper.prototype.renderAsTable = function (rows, escape) {
                if (escape === void 0) { escape = true; }
                var html = "<table>";
                var keys = [];
                var e = escape ? kr3m.util.Util.encodeHtml : function (t) { return t; };
                for (var i = 0; i < rows.length; ++i)
                    keys = kr3m.util.Util.merge(keys, Object.keys(rows[i]));
                html += "<tr>";
                for (var i = 0; i < keys.length; ++i)
                    html += "<th>" + keys[i] + "</th>";
                html += "</tr>";
                for (var i = 0; i < rows.length; ++i) {
                    html += "<tr>";
                    for (var j = 0; j < keys.length; ++j) {
                        var value = rows[i][keys[j]] ? e(rows[i][keys[j]].toString()) : "";
                        html += "<td>" + value + "</td>";
                    }
                    html += "</tr>";
                }
                html += "</table>";
                return html;
            };
            Helper.prototype.getRedirectUrl = function (htmlCode) {
                var headerParts = htmlCode.match(/(<head(?:\s+[^>]*)>)([\s\S]*)(<\/head>)/i);
                if (!headerParts)
                    return "";
                var metaParts = headerParts[2].match(/<meta\s+.+?\s*\/?>/gi);
                if (!metaParts)
                    return "";
                for (var i = 0; i < metaParts.length; ++i) {
                    var attributes = metaParts[i].match(/<meta.*(http-equiv)=["'](refresh)["'].*(content)=["'](\d+);\s+url=([^"']*)["'].*\/?>/i);
                    if (attributes)
                        return attributes[5];
                }
                return "";
            };
            Helper.prototype.consoleToHtml = function (consoleText) {
                var mappedStyles = {
                    "100": "background-color:#808080",
                    "101": "background-color:#FF0000",
                    "102": "background-color:#00FF00",
                    "103": "background-color:#FFFF00",
                    "104": "background-color:#0000FF",
                    "105": "background-color:#FF00FF",
                    "106": "background-color:#00FFFF",
                    "107": "background-color:#FFFFFF",
                    "30": "color:#000000",
                    "31": "color:#800000",
                    "32": "color:#008000",
                    "33": "color:#808000",
                    "34": "color:#000080",
                    "35": "color:#800080",
                    "36": "color:#008080",
                    "37": "color:#C0C0C0",
                    "40": "background-color:#000000",
                    "41": "background-color:#800000",
                    "42": "background-color:#008000",
                    "43": "background-color:#808000",
                    "44": "background-color:#000080",
                    "45": "background-color:#800080",
                    "46": "background-color:#008080",
                    "47": "background-color:#C0C0C0",
                    "90": "color:#808080",
                    "91": "color:#FF0000",
                    "92": "color:#00FF00",
                    "93": "color:#FFFF00",
                    "94": "color:#0000FF",
                    "95": "color:#FF00FF",
                    "96": "color:#00FFFF",
                    "97": "color:#FFFFFF"
                };
                var html = kr3m.util.Util.encodeHtml(consoleText)
                    .replace(/\r/g, "")
                    .replace(/\x1b\[0m/g, "</font>")
                    .replace(/(?:\x1b\[\d+m)+/g, function (match) {
                    var codes = match.match(/\d+/g);
                    var styles = codes.map(function (code) { return mappedStyles[code] || ""; });
                    return "<font style='" + styles.join(";") + "'>";
                });
                html = "<div style='background-color:#000000; color:#C0C0C0; margin:10px; padding:5px; word-wrap:break-word; white-space:pre; overflow-x:scroll;'>" + html + "</div>";
                return html;
            };
            Helper.DOCTYPE = "<!DOCTYPE html>";
            return Helper;
        }());
        html_1.Helper = Helper;
    })(html = kr3m.html || (kr3m.html = {}));
})(kr3m || (kr3m = {}));
var nodemailerLib = require("nodemailer");
var smtpTransportLib = require("nodemailer-smtp-transport");
var kr3m;
(function (kr3m) {
    var mail;
    (function (mail) {
        var Email2Config = (function () {
            function Email2Config() {
                this.transport = "direct";
                this.defaultSender = "no-reply@kr3m.com";
                this.smtpHost = "localhost";
                this.smtpPort = 25;
            }
            return Email2Config;
        }());
        mail.Email2Config = Email2Config;
    })(mail = kr3m.mail || (kr3m.mail = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var mail;
    (function (mail) {
        var Email2 = (function () {
            function Email2(to, subject, from) {
                this.cache = kr3m.cache.files.Smart.getInstance();
                this.queue = new kr3m.async.Queue(true);
                this.knownCids = {};
                this.freeCid = 0;
                this.status = kr3m.SUCCESS;
                this.options =
                    {
                        from: from,
                        to: to,
                        subject: subject,
                        attachments: []
                    };
            }
            Email2.init = function (config) {
                var self = kr3m.mail.Email2;
                self.config = config;
                switch (config.transport) {
                    case self.TRANSPORT_DIRECT:
                        self.transport = nodemailerLib.createTransport();
                        break;
                    case self.TRANSPORT_SMTP:
                        self.transport = nodemailerLib.createTransport(smtpTransportLib({ host: self.config.smtpHost, port: self.config.smtpPort, secure: false, requiresAuth: false, ignoreTLS: true }));
                        break;
                }
                this.delay.execute();
            };
            Email2.prototype.setTextBody = function (text) {
                this.options.text = text;
                return this;
            };
            Email2.prototype.setHtmlBody = function (html) {
                this.options.html = html;
                return this;
            };
            Email2.prototype.attachFile = function (pathOrUrl, fileName) {
                var _this = this;
                fileName = fileName || kr3m.util.File.getFilenameFromPath(pathOrUrl);
                var cid = this.knownCids[pathOrUrl];
                if (cid === undefined) {
                    cid = this.freeCid++;
                    this.knownCids[pathOrUrl] = cid;
                    this.queue.unshift(function (next) {
                        _this.cache.getFile(pathOrUrl, function (content) {
                            if (!content) {
                                logError("could not load email attachment", pathOrUrl);
                                _this.status = kr3m.ERROR_INPUT;
                                return next();
                            }
                            _this.options.attachments.push({
                                filename: fileName,
                                content: content,
                                cid: cid.toString()
                            });
                            next();
                        });
                    });
                }
                return cid;
            };
            Email2.prototype.replaceImages = function (template, templatePath, callback) {
                var _this = this;
                template = template.replace(/\<img\b[^\>]*src=["']([^"']*)["']/gi, function (match, p1) {
                    if (_this.cache.isRemote(templatePath))
                        var realPath = kr3m.util.Url.merge(templatePath, p1);
                    else
                        var realPath = kr3m.util.File.resolvePath(templatePath, p1);
                    var fileName = kr3m.util.File.getFilenameFromPath(realPath);
                    var cid = _this.attachFile(realPath, fileName);
                    return match.replace(p1, "cid:" + cid);
                });
                callback(template);
            };
            Email2.prototype.setTemplate = function (templatePathOrUrl, tokens, locFunc) {
                var _this = this;
                this.queue.push(function (next) {
                    _this.cache.getFile(templatePathOrUrl, function (templateBuffer) {
                        if (!templateBuffer) {
                            logError("error while loading email template from", templatePathOrUrl);
                            _this.options.html = "error while loading email template";
                            _this.status = kr3m.ERROR_INPUT;
                            return next();
                        }
                        var template = templateBuffer.toString("utf8");
                        var helper = new kr3m.html.Helper();
                        template = helper.getBody(template, tokens, locFunc);
                        _this.replaceImages(template, templatePathOrUrl, function (template) {
                            _this.options.html = template;
                            next();
                        });
                    });
                });
                return this;
            };
            Email2.prototype.send = function (callback) {
                var _this = this;
                this.queue.push(function (next) {
                    kr3m.mail.Email2.delay.call(function () {
                        if (_this.status != kr3m.SUCCESS) {
                            callback && callback(_this.status);
                            return next();
                        }
                        _this.options.from = _this.options.from || kr3m.mail.Email2.config.defaultSender;
                        kr3m.mail.Email2.transport.sendMail(_this.options, function (err, result) {
                            if (err) {
                                if (!callback)
                                    logError("email send error:", err);
                                else
                                    callback(kr3m.ERROR_EXTERNAL);
                            }
                            else {
                                callback && callback(_this.status);
                            }
                            next();
                        });
                    });
                });
            };
            Email2.prototype.print = function (callback) {
                var _this = this;
                this.queue.push(function (nextInQueue) {
                    kr3m.mail.Email2.delay.call(function () {
                        _this.options.from = _this.options.from || kr3m.mail.Email2.config.defaultSender;
                        debug(_this);
                        callback && callback(kr3m.SUCCESS);
                        nextInQueue();
                    });
                });
            };
            Email2.delay = new kr3m.async.Delayed();
            Email2.TRANSPORT_DIRECT = "direct";
            Email2.TRANSPORT_SMTP = "smtp";
            return Email2;
        }());
        mail.Email2 = Email2;
    })(mail = kr3m.mail || (kr3m.mail = {}));
})(kr3m || (kr3m = {}));
log(" START SCRIPT");
var emailConfig = new kr3m.mail.Email2Config();
log(" emailConfig : ", emailConfig);
kr3m.mail.Email2.init(emailConfig);
var emailHammam = new kr3m.mail.Email2("hammam.abu.ghali@mailinator.com", "test test email");
emailHammam.setTemplate("public/cas/email/default.html");
emailHammam.send(function (status) {
    log(" send mail fertig", status);
});
