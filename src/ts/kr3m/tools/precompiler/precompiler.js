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
    kr3m.VERSION = "1.6.28.6";
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
            Util.getBy = function (objects, propertyName, propertyValue, offset, strict) {
                if (offset === void 0) { offset = 0; }
                if (strict === void 0) { strict = false; }
                var pos = Util.findBy(objects, propertyName, propertyValue, offset, strict);
                return pos >= 0 ? objects[pos] : undefined;
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
            Log.showTimestamps = false;
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
var childProcessLib = require("child_process");
var kr3m;
(function (kr3m) {
    var tools;
    (function (tools) {
        var precompiler;
        (function (precompiler) {
            var Parameters = (function () {
                function Parameters(args) {
                    this.greyOnly = false;
                    this.verbose = false;
                    this.silent = false;
                    this.showComments = false;
                    this.generateDescription = false;
                    this.checkReferenceLoops = false;
                    this.minimize = false;
                    this.flags = {};
                    this.replacements = [];
                    this.unknownParams = [];
                    var args = args.slice(2);
                    for (var i = 0; i < args.length; ++i) {
                        switch (args[i]) {
                            case "-c":
                                this.showComments = true;
                                break;
                            case "-d":
                                this.generateDescription = true;
                                break;
                            case "-m":
                                this.minimize = true;
                                break;
                            case "-s":
                                this.silent = true;
                                break;
                            case "-v":
                                this.verbose = true;
                                break;
                            case "-l":
                                this.checkReferenceLoops = true;
                                break;
                            case "-g":
                                this.greyOnly = true;
                                break;
                            case "-t":
                                if (i < args.length - 1) {
                                    this.target = args[++i];
                                    if (this.target == "ES5") {
                                        this.flags["ES5"] = true;
                                    }
                                    else if (this.target == "ES6") {
                                        this.flags["ES5"] = true;
                                        this.flags["ES6"] = true;
                                    }
                                }
                                break;
                            case "-k":
                                if (i < args.length - 1)
                                    this.kind = args[++i];
                            case "-f":
                                if (i < args.length - 1)
                                    this.flags[args[++i]] = true;
                                break;
                            case "-r":
                                if (i < args.length - 2)
                                    this.replacements.push({ pattern: args[++i], value: args[++i] });
                                break;
                            case "-o":
                                if (i < args.length - 1)
                                    this.targetPath = args[++i];
                                break;
                            default:
                                if (!this.command)
                                    this.command = args[i];
                                else if (!this.sourcePath)
                                    this.sourcePath = args[i];
                                else
                                    this.unknownParams.push(args[i]);
                                break;
                        }
                    }
                    if (!this.targetPath && this.sourcePath)
                        this.targetPath = this.sourcePath.replace(/\.ts$/i, ".js");
                }
                Parameters.prototype.hasFlag = function (flag) {
                    return this.flags[flag];
                };
                return Parameters;
            }());
            precompiler.Parameters = Parameters;
        })(precompiler = tools.precompiler || (tools.precompiler = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
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
    var net;
    (function (net) {
        var MimeTypes = (function () {
            function MimeTypes() {
            }
            MimeTypes.getMimeTypeByUrl = function (url) {
                var extension = "." + kr3m.util.StringEx.getAfter(url, ".", false).toLowerCase();
                extension = kr3m.util.StringEx.getBefore(extension, "?");
                var contentType = kr3m.net.MimeTypes.contentTypesByExtension[extension] || "application/octet-stream";
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
    var tools;
    (function (tools) {
        var precompiler;
        (function (precompiler) {
            var handlers;
            (function (handlers) {
                var Abstract = (function () {
                    function Abstract(params) {
                        this.errorCount = 0;
                        this.warningCount = 0;
                        this.params = params;
                    }
                    Abstract.prototype.hasErrors = function (strict) {
                        if (strict === void 0) { strict = false; }
                        return this.errorCount > 0 || (strict && this.warningCount > 0);
                    };
                    Abstract.prototype.getErrorCount = function (strict) {
                        if (strict === void 0) { strict = false; }
                        return this.errorCount + (strict ? this.warningCount : 0);
                    };
                    Abstract.prototype.getCompiledFileName = function (oldPath) {
                        var extension = kr3m.util.File.getExtension(oldPath);
                        var newPath = oldPath.substr(0, oldPath.length - extension.length);
                        newPath += ".pc.ts";
                        return newPath;
                    };
                    Abstract.prototype.error = function (message) {
                        if (this.currentPath != this.lastPath) {
                            log(this.currentPath);
                            this.lastPath = this.currentPath;
                        }
                        log(kr3m.util.Log.COLOR_BRIGHT_RED + "  " + message + kr3m.util.Log.COLOR_RESET);
                        ++this.errorCount;
                    };
                    Abstract.prototype.warning = function (message) {
                        if (this.currentPath != this.lastPath) {
                            log(this.currentPath);
                            this.lastPath = this.currentPath;
                        }
                        log(kr3m.util.Log.COLOR_BRIGHT_YELLOW + "  " + message + kr3m.util.Log.COLOR_RESET);
                        ++this.warningCount;
                    };
                    Abstract.prototype.deprecated = function (message) {
                        if (this.currentPath != this.lastPath) {
                            log(this.currentPath);
                            this.lastPath = this.currentPath;
                        }
                        log(kr3m.util.Log.COLOR_DARK_CYAN + "  " + message + kr3m.util.Log.COLOR_RESET);
                        ++this.warningCount;
                    };
                    Abstract.prototype.unstable = function (message) {
                        if (this.currentPath != this.lastPath) {
                            log(this.currentPath);
                            this.lastPath = this.currentPath;
                        }
                        log(kr3m.util.Log.COLOR_DARK_PINK + "  " + message + kr3m.util.Log.COLOR_RESET);
                        ++this.warningCount;
                    };
                    Abstract.prototype.comment = function (message) {
                        if (this.currentPath != this.lastPath) {
                            log(this.currentPath);
                            this.lastPath = this.currentPath;
                        }
                        log(kr3m.util.Log.COLOR_DARK_YELLOW + "  " + message + kr3m.util.Log.COLOR_RESET);
                    };
                    Abstract.prototype.handle = function (currentPath, content) {
                        this.currentPath = currentPath;
                    };
                    return Abstract;
                }());
                handlers.Abstract = Abstract;
            })(handlers = precompiler.handlers || (precompiler.handlers = {}));
        })(precompiler = tools.precompiler || (tools.precompiler = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var tools;
    (function (tools) {
        var precompiler;
        (function (precompiler) {
            var handlers;
            (function (handlers) {
                var Clean = (function (_super) {
                    __extends(Clean, _super);
                    function Clean(params) {
                        return _super.call(this, params) || this;
                    }
                    Clean.prototype.handle = function (currentPath, content) {
                        _super.prototype.handle.call(this, currentPath, content);
                        var newFileName = this.getCompiledFileName(currentPath);
                        if (this.params.verbose)
                            log("  deleting file " + newFileName);
                        if (fsLib.existsSync(newFileName))
                            fsLib.unlinkSync(newFileName);
                    };
                    return Clean;
                }(handlers.Abstract));
                handlers.Clean = Clean;
            })(handlers = precompiler.handlers || (precompiler.handlers = {}));
        })(precompiler = tools.precompiler || (tools.precompiler = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var tools;
    (function (tools) {
        var precompiler;
        (function (precompiler) {
            var LineChanges = (function () {
                function LineChanges() {
                    this.changes = [];
                }
                LineChanges.prototype.remove = function (offset, count) {
                    this.changes.push([offset, count]);
                };
                LineChanges.prototype.adjustLine = function (line) {
                    for (var i = 0; i < this.changes.length; ++i) {
                        if (line >= this.changes[i][0])
                            line += this.changes[i][1];
                    }
                    return line;
                };
                return LineChanges;
            }());
            precompiler.LineChanges = LineChanges;
        })(precompiler = tools.precompiler || (tools.precompiler = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var tools;
    (function (tools) {
        var precompiler;
        (function (precompiler) {
            var ParserLine = (function () {
                function ParserLine() {
                }
                return ParserLine;
            }());
            precompiler.ParserLine = ParserLine;
            var Parser = (function () {
                function Parser(source) {
                    this.lines = [];
                    var len = source.length;
                    var lineCount = 1;
                    for (var i = 0; i < len; ++i) {
                        if (source.charAt(i) == "\n") {
                            ++lineCount;
                            continue;
                        }
                        if (source.charAt(i) == "/" && source.charAt(i + 1) == "/" && source.charAt(i + 2) == "#") {
                            var line = new kr3m.tools.precompiler.ParserLine();
                            line.start = i;
                            line.line = lineCount;
                            while (source.charAt(i) && source.charAt(i) != "\n")
                                ++i;
                            line.end = i + 1;
                            line.content = source.slice(line.start + 3, line.end).trim();
                            this.lines.push(line);
                            ++lineCount;
                        }
                    }
                }
                Parser.prototype.getLines = function () {
                    return this.lines;
                };
                return Parser;
            }());
            precompiler.Parser = Parser;
        })(precompiler = tools.precompiler || (tools.precompiler = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var tools;
    (function (tools) {
        var precompiler;
        (function (precompiler) {
            var handlers;
            (function (handlers) {
                var Compile = (function (_super) {
                    __extends(Compile, _super);
                    function Compile(params) {
                        return _super.call(this, params) || this;
                    }
                    Compile.removeByFlags = function (currentPath, content, params) {
                        var parser = new kr3m.tools.precompiler.Parser(content);
                        var lines = parser.getLines();
                        var flagPat = /(!?\w+)/;
                        var lineChanges = new kr3m.tools.precompiler.LineChanges();
                        Compile.lineChanges[currentPath] = lineChanges;
                        for (var i = 0; i < lines.length; ++i) {
                            if (flagPat.test(lines[i].content)) {
                                var positive = lines[i].content.charAt(0) != "!";
                                var flag = positive ? lines[i].content : lines[i].content.slice(1);
                                var hasFlag = params.hasFlag(flag);
                                var keep = (positive && hasFlag) || (!positive && !hasFlag);
                                var search = "/" + lines[i].content;
                                for (var j = i + 1; j < lines.length; ++j) {
                                    if (lines[j].content == search) {
                                        if (keep) {
                                            var offsetDelta = lines[i].end - lines[i].start;
                                            for (var k = i + 1; k < j; ++k) {
                                                lines[k].start -= offsetDelta;
                                                lines[k].end -= offsetDelta;
                                            }
                                            offsetDelta += lines[j].end - lines[j].start;
                                            for (var k = j + 1; k < lines.length; ++k) {
                                                lines[k].start -= offsetDelta;
                                                lines[k].end -= offsetDelta;
                                            }
                                            content = content.slice(0, lines[i].start) + content.slice(lines[i].end, lines[j].start) + content.slice(lines[j].end);
                                            lineChanges.remove(lines[j].line, 1);
                                            lines.splice(j, 1);
                                            lineChanges.remove(lines[i].line, 1);
                                            lines.splice(i, 1);
                                        }
                                        else {
                                            var offsetDelta = lines[j].end - lines[i].start;
                                            content = content.slice(0, lines[i].start) + content.slice(lines[j].end);
                                            lineChanges.remove(lines[i].line, lines[j].line - lines[i].line + 1);
                                            lines.splice(i, j - i + 1);
                                            for (var k = i; k < lines.length; ++k) {
                                                lines[k].start -= offsetDelta;
                                                lines[k].end -= offsetDelta;
                                            }
                                        }
                                        --i;
                                        break;
                                    }
                                }
                            }
                        }
                        return content;
                    };
                    Compile.prototype.adjustReferences = function (content) {
                        var _this = this;
                        var patReference = /\/\/\/\s*<reference\s+path\s*=\s*["']([^"']+)["']\s*\/>/g;
                        content = content.replace(patReference, function (match, captured) {
                            return '/// <reference path="' + _this.getCompiledFileName(captured) + '"/>';
                        });
                        return content;
                    };
                    Compile.prototype.embed = function (currentPath, content) {
                        var _this = this;
                        var patEmbed = /\/\/\#\s+EMBED\((.+?)\)/g;
                        for (var oldContent = ""; oldContent != content; oldContent = content) {
                            content = content.replace(patEmbed, function (match, captured) {
                                var args = captured.split(",");
                                if (args.length < 1)
                                    return match;
                                args = args.map(function (arg) { return arg.trim(); });
                                var path = kr3m.util.File.resolvePath(currentPath, args[0]);
                                try {
                                    var content = fsLib.readFileSync(path, { encoding: "utf8" });
                                }
                                catch (e) {
                                    _this.error("embed path not found: " + path);
                                    var content = "";
                                }
                                content = kr3m.util.StringEx.stripBom(content);
                                var outputType = args[1] || "string";
                                switch (outputType) {
                                    case "string":
                                        return content || "";
                                    case "json":
                                        return kr3m.util.Json.escapeSpecialChars(kr3m.util.Json.encode(content));
                                    case "jsonNoQuotes":
                                        return kr3m.util.Json.escapeSpecialChars(kr3m.util.Json.encode(content)).replace(/^"(.*)"$/, "$1");
                                    case "dataUrl":
                                        return kr3m.util.File.getAsDataUrlSync(path);
                                    default:
                                        logWarning("unknown embed type:", outputType);
                                        return match;
                                }
                            });
                        }
                        return content;
                    };
                    Compile.prototype.replace = function (content) {
                        for (var i = 0; i < this.params.replacements.length; ++i) {
                            var pattern = new RegExp(this.params.replacements[i].pattern, "g");
                            var value = this.params.replacements[i].value;
                            content = content.replace(pattern, value);
                        }
                        return content;
                    };
                    Compile.prototype.checkTscVersion = function (requiredText) {
                        var required = kr3m.util.StringEx.getVersionParts(requiredText);
                        var available = kr3m.util.StringEx.getVersionParts(this.params.tscVersion);
                        for (var i = 0; i < 3; ++i) {
                            if (required[i] < available[i])
                                return;
                            if (required[i] > available[i]) {
                                this.error("ERROR: TSC " + requiredText + " required");
                                return;
                            }
                        }
                    };
                    Compile.prototype.printComments = function (currentPath, content) {
                        if (this.params.showComments) {
                            var parser = new kr3m.tools.precompiler.Parser(content);
                            var lines = parser.getLines();
                            for (var i = 0; i < lines.length; ++i) {
                                var comment = lines[i].content;
                                var tscMatches = comment.match(/TSC\s+(\d+\.\d+\.\d+)/i);
                                if (tscMatches) {
                                    this.checkTscVersion(tscMatches[1]);
                                    continue;
                                }
                                if (comment.substr(0, 5).toUpperCase() == "ERROR")
                                    this.error(comment);
                                else if (comment.substr(0, 5).toUpperCase() == "FIXME")
                                    this.warning(comment);
                                else if (comment.substr(0, 10).toUpperCase() == "DEPRECATED")
                                    this.deprecated(comment);
                                else if (comment.substr(0, 8).toUpperCase() == "UNSTABLE")
                                    this.unstable(comment);
                                else
                                    this.comment(comment);
                            }
                        }
                        return content;
                    };
                    Compile.prototype.handle = function (currentPath, content) {
                        _super.prototype.handle.call(this, currentPath, content);
                        content = this.adjustReferences(content);
                        content = this.embed(currentPath, content);
                        content = this.replace(content);
                        content = this.printComments(currentPath, content);
                        var newFileName = this.getCompiledFileName(currentPath);
                        if (this.params.verbose)
                            log("  writing file " + newFileName);
                        fsLib.writeFileSync(newFileName, content);
                    };
                    Compile.prototype.adjustErrorOutput = function (output) {
                        var errorPattern = /(.+)\.pc\.ts\((\d+),(\d+)\)/g;
                        output = output.replace(errorPattern, function (complete, filePath, lineTxt, colTxt) {
                            var line = parseInt(lineTxt, 10);
                            var column = parseInt(colTxt, 10);
                            try {
                                var realPath = fsLib.realpathSync(filePath + ".ts").replace(/\\/g, "/");
                            }
                            catch (e) {
                                return complete;
                            }
                            var lineChanges = Compile.lineChanges[realPath];
                            line = lineChanges.adjustLine(line);
                            return filePath + ".ts(" + line + "," + column + ")";
                        });
                        return output;
                    };
                    Compile.lineChanges = {};
                    return Compile;
                }(handlers.Abstract));
                handlers.Compile = Compile;
            })(handlers = precompiler.handlers || (precompiler.handlers = {}));
        })(precompiler = tools.precompiler || (tools.precompiler = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var async;
    (function (async) {
        var CriticalSection = (function () {
            function CriticalSection(limit) {
                if (limit === void 0) { limit = 1; }
                this.current = 0;
                this.pending = [];
                this.limit = limit;
            }
            CriticalSection.prototype.setConcurrentLimit = function (limit) {
                this.limit = limit;
            };
            CriticalSection.prototype.check = function () {
                if (!this.isFull() && this.pending.length > 0) {
                    ++this.current;
                    var func = this.pending.shift();
                    func(this.exit.bind(this));
                }
            };
            CriticalSection.prototype.exit = function () {
                --this.current;
                this.check();
            };
            CriticalSection.prototype.enter = function (callback) {
                this.pending.push(callback);
                this.check();
            };
            CriticalSection.prototype.enterTimeout = function (callback, timeout, timeoutCallback) {
                var _this = this;
                if (timeout <= 0 && this.isFull())
                    return timeoutCallback();
                if (!this.isFull())
                    return this.enter(callback);
                var timerId = null;
                var helper = function (exit) {
                    clearTimeout(timerId);
                    callback(exit);
                };
                this.pending.push(helper);
                timerId = setTimeout(function () {
                    kr3m.util.Util.remove(_this.pending, helper);
                    timeoutCallback();
                }, timeout);
                this.check();
            };
            CriticalSection.prototype.hasPending = function () {
                return this.pending.length > 0;
            };
            CriticalSection.prototype.isEmpty = function () {
                return this.current <= 0;
            };
            CriticalSection.prototype.isFull = function () {
                return this.limit > 0 && this.current >= this.limit;
            };
            CriticalSection.prototype.getCurrentCount = function () {
                return this.current;
            };
            CriticalSection.prototype.getPendingCount = function () {
                return this.pending.length;
            };
            CriticalSection.prototype.getLimit = function () {
                return this.limit;
            };
            return CriticalSection;
        }());
        async.CriticalSection = CriticalSection;
    })(async = kr3m.async || (kr3m.async = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var ChildProcess = (function () {
            function ChildProcess(command, args) {
                if (args === void 0) { args = []; }
                this.command = command;
                this.args = args;
                this.running = false;
                this.encoding = "utf8";
            }
            ChildProcess.prototype.getOutputString = function () {
                return this.stdout.toString(this.encoding);
            };
            ChildProcess.prototype.getErrorString = function () {
                return this.stderr.toString(this.encoding);
            };
            ChildProcess.prototype.getOutput = function () {
                return this.stdout;
            };
            ChildProcess.prototype.exec = function (callback) {
                var _this = this;
                if (this.running)
                    return callback(kr3m.ERROR_FLOOD);
                this.running = true;
                ChildProcess.cs.enter(function (exit) {
                    _this.exitCode = 0;
                    _this.error = undefined;
                    _this.stdout = Buffer.alloc(0);
                    _this.stderr = Buffer.alloc(0);
                    var options = {};
                    if (_this.environment)
                        options.env = _this.environment;
                    if (osLib.platform() == kr3m.PLATFORM_WINDOWS)
                        options.shell = true;
                    var args = _this.args.map(function (arg) { return arg.toString(); });
                    var spawn = childProcessLib.spawn(_this.command, args, options);
                    if (_this.stdin)
                        spawn.stdin.write(_this.stdin);
                    spawn.stdout.on("data", function (data) { return _this.stdout = Buffer.concat([_this.stdout, data]); });
                    spawn.stderr.on("data", function (data) { return _this.stderr = Buffer.concat([_this.stderr, data]); });
                    spawn.on("error", function (error) { return _this.error = error; });
                    spawn.on("close", function (exitCode) {
                        exit();
                        _this.exitCode = exitCode;
                        _this.running = false;
                        callback(exitCode == 0 && !_this.error ? kr3m.SUCCESS : kr3m.ERROR_EXTERNAL);
                    });
                });
            };
            ChildProcess.exec = function (commandLine, args, callback) {
                var process = new ChildProcess(commandLine, args);
                process.exec(callback);
                return process;
            };
            ChildProcess.cs = new kr3m.async.CriticalSection(3);
            return ChildProcess;
        }());
        util.ChildProcess = ChildProcess;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
var parserLib = require("./lib/parse-js");
var processLib = require("./lib/process");
var consolidatorLib = require("./lib/consolidator");
var kr3m;
(function (kr3m) {
    var tools;
    (function (tools) {
        var precompiler;
        (function (precompiler) {
            var Precompiler = (function () {
                function Precompiler() {
                }
                Precompiler.addReference = function (references, from, to) {
                    if (references === undefined || references === null)
                        return;
                    if (!references[from])
                        references[from] = [];
                    references[from].push(to);
                };
                Precompiler.prototype.crawl = function (params, handler, references) {
                    var filePath = fsLib.realpathSync(params.sourcePath);
                    filePath = filePath.replace(/\\/g, "/");
                    var pendingFiles = [filePath];
                    var completedFiles = {};
                    var patReference = /\/\/\/\s*<reference\s+path\s*=\s*["']([^"']+)["']\s*\/>/g;
                    while (pendingFiles.length > 0) {
                        var currentFile = pendingFiles.shift();
                        if (!fsLib.existsSync(currentFile))
                            continue;
                        if (!completedFiles[currentFile]) {
                            if (params.verbose)
                                log("processing " + currentFile);
                            completedFiles[currentFile] = true;
                            var stats = fsLib.statSync(currentFile);
                            if (stats.isDirectory()) {
                                logError("Error: file is a directory: " + currentFile);
                                continue;
                            }
                            var content = fsLib.readFileSync(currentFile, "utf-8");
                            content = kr3m.tools.precompiler.handlers.Compile.removeByFlags(currentFile, content, params);
                            content.replace(patReference, function (match, captured) {
                                var relativePath = kr3m.util.File.resolvePath(currentFile, captured);
                                if (fsLib.existsSync(relativePath)) {
                                    pendingFiles.push(relativePath);
                                    kr3m.tools.precompiler.Precompiler.addReference(references, currentFile, relativePath);
                                }
                                return match;
                            });
                            handler.handle(currentFile, content);
                        }
                    }
                };
                Precompiler.prototype.removeRedundantDefines = function (params, callback) {
                    if (!params.kind || params.kind.toLowerCase() != "amd")
                        return callback();
                    log("removing redundant defines from " + params.targetPath);
                    fsLib.readFile(params.targetPath, { encoding: "utf-8" }, function (err, code) {
                        if (err) {
                            logError(err);
                            process.exit(2);
                        }
                        var lines = code.split("\r\n");
                        var defineBlocks = [];
                        for (var i = 0; i < lines.length; ++i) {
                            if (lines[i].slice(0, 8) == "define(\"") {
                                lines[i] = lines[i].replace(/\.pc\"/gi, "\"");
                                for (var j = i + 1; j < lines.length; ++j) {
                                    if (lines[j] == "});") {
                                        defineBlocks.push({ from: i, count: j - i + 1 });
                                        i = j;
                                        break;
                                    }
                                }
                            }
                        }
                        if (defineBlocks.length > 1) {
                            defineBlocks.pop();
                            while (defineBlocks.length > 0) {
                                var block = defineBlocks.pop();
                                lines.splice(block.from, block.count);
                            }
                        }
                        code = lines.join("\r\n");
                        fsLib.writeFile(params.targetPath, code, function (err) {
                            if (err) {
                                logError(err);
                                process.exit(3);
                            }
                            callback();
                        });
                    });
                };
                Precompiler.prototype.minimizeIfWanted = function (params, callback) {
                    if (!params.minimize)
                        return callback();
                    log("minimizing " + params.targetPath);
                    fsLib.readFile(params.targetPath, { encoding: "utf-8" }, function (err, code) {
                        if (err) {
                            logError(err);
                            process.exit(2);
                        }
                        code = parserLib.parse(code);
                        code = processLib.ast_mangle(code);
                        code = processLib.ast_squeeze(code);
                        code = processLib.gen_code(code);
                        fsLib.writeFile(params.targetPath, code, function (err) {
                            if (err) {
                                logError(err);
                                process.exit(3);
                            }
                            callback();
                        });
                    });
                };
                Precompiler.prototype.build = function (params) {
                    var _this = this;
                    log("building " + params.sourcePath);
                    log("precompiling...");
                    var references = params.checkReferenceLoops ? {} : null;
                    var compileHandler = new kr3m.tools.precompiler.handlers.Compile(params);
                    this.crawl(params, compileHandler, references);
                    if (compileHandler.hasErrors()) {
                        var cleanHandler = new kr3m.tools.precompiler.handlers.Clean(params);
                        this.crawl(params, cleanHandler);
                        logError("aborted -", compileHandler.getErrorCount(), "errors found");
                        process.exit(1);
                    }
                    if (references) {
                        logError("checking for reference loops NYI");
                        debug(references);
                    }
                    var args = [];
                    var pcFilePath = compileHandler.getCompiledFileName(params.sourcePath);
                    args.push("--noEmitOnError", "--removeComments", pcFilePath);
                    if (params.targetPath)
                        args.push("--out", params.targetPath);
                    if (params.kind)
                        args.push("-m", params.kind);
                    if (params.generateDescription)
                        args.push("-d");
                    if (params.target)
                        args.push("-t", params.target);
                    args.push.apply(args, params.unknownParams);
                    log("compiling...");
                    var childProcess = new kr3m.util.ChildProcess("tsc", args);
                    childProcess.exec(function (status) {
                        var cleanHandler = new kr3m.tools.precompiler.handlers.Clean(params);
                        _this.crawl(params, cleanHandler);
                        if (status != kr3m.SUCCESS) {
                            var errorOutput = childProcess.getOutputString() + "\n" + childProcess.getErrorString();
                            errorOutput = compileHandler.adjustErrorOutput(errorOutput);
                            logError(errorOutput);
                            var errors = errorOutput.match(/\(\d+,\d+\)\: error TS/g);
                            logError("aborted -", errors ? errors.length : 0, "errors found");
                            process.exit(1);
                        }
                        else {
                            _this.removeRedundantDefines(params, function () {
                                _this.minimizeIfWanted(params, function () {
                                    log(kr3m.util.Log.COLOR_BRIGHT_GREEN + "done" + kr3m.util.Log.COLOR_RESET);
                                });
                            });
                        }
                    });
                };
                Precompiler.prototype.compile = function (params) {
                    log("compiling " + params.sourcePath);
                    var handler = new kr3m.tools.precompiler.handlers.Compile(params);
                    this.crawl(params, handler);
                    log(kr3m.util.Log.COLOR_BRIGHT_GREEN + "done" + kr3m.util.Log.COLOR_RESET);
                };
                Precompiler.prototype.clean = function (params) {
                    log("cleaning for " + params.sourcePath);
                    var handler = new kr3m.tools.precompiler.handlers.Clean(params);
                    this.crawl(params, handler);
                    log(kr3m.util.Log.COLOR_BRIGHT_GREEN + "done" + kr3m.util.Log.COLOR_RESET);
                };
                Precompiler.prototype.showHelpText = function () {
                    log("");
                    log("  Der Precompiler ist ein einfaches Textersetzungsprogramm,");
                    log("  das ausgeführt werden kann, bevor Typescript Dateien an den");
                    log("  tsc Compiler geschickt werden. Das Hauptanwendungsgebiet");
                    log("  besteht darin, Teile des Sourcecodes unter bestimmten");
                    log("  Bedinungen vor dem Compilieren zu entfernen, um z.B. sicher");
                    log("  zu stellen, dass kein Servercode im Clientcode oder kein");
                    log("  Debugcode im Releaseprodukt erscheint.");
                    log("");
                    log("");
                    log("  Mögliche Operationen:");
                    log("");
                    log("    precompiler build SOURCEFILE [-v] [-f FLAG]* [-o OUTPUTFILE]");
                    log("      Führt compile aus gefolgt von einem tsc Aufruf um die");
                    log("      Datei zu kompilieren und anschließend ein clean. Im");
                    log("      Prinzip ist build ein \"Gesamtpaket\".");
                    log("");
                    log("    precompiler compile SOURCEFILE [-v] [-f FLAG]*");
                    log("      Precompiliert die Datei SOURCEFILE und alle von ihr");
                    log("      referenzierten Dateien und speichert das Ergebnis an");
                    log("      der gleichen Stelle als .pc.ts Datei ab.");
                    log("");
                    log("    precompiler clean SOURCEFILE [-v]");
                    log("      Löscht alle beim Vorcompilieren der Datei SOURCEFILE");
                    log("      angelegten .pc.ts Dateien.");
                    log("");
                    log("");
                    log("  Allgemeine Parameter:");
                    log("");
                    log("    -c - Precompiler Kommentare anzeigen");
                    log("    -d - erzeugt zusätzlich eine .d.ts Datei");
                    log("    -f FLAG - setzt FLAG für die Entfernung von Teilen des");
                    log("       Sourcecodes");
                    log("    -g ausschließlich Grau als Ausgabefarbe benutzen");
                    log("    -k KIND - setzt den module kind Paramter");
                    log("    -l prüft auf Schleifen (loops) in den reference Anweisungen");
                    log("    -m - minimiert erzeugte JS-Dateien");
                    log("    -o OUTPUTFILE - speichert das Ergebnis in OUTPUTFILE");
                    log("       statt in der Standarddatei");
                    log("    -r PATTERN VALUE - ersetzt alle mit PATTERN gefundenen");
                    log("       Texte des Sourcecodes durch VALUE");
                    log("    -s - alle Ausgaben unterdrücken");
                    log("    -t TARGET - gibt das Ergebnis in einer anderen Sprachversion");
                    log("       aus, Möglichkeiten für TARGET sind die selben wie für den");
                    log("       gleichen Parameter im tsc");
                    log("    -v Verbose Mode - gibt detailiertere Ausgaben über den");
                    log("       Arbeitsvorgang aus");
                    log("");
                    log("    Alle unbekannten Parameter werden 1:1 an den TSC übergeben");
                    log("");
                    log("");
                };
                Precompiler.prototype.getTscVersion = function (callback) {
                    var childProcess = new kr3m.util.ChildProcess("tsc", ["-v"]);
                    childProcess.exec(function (status) {
                        var matches = childProcess.getOutputString().match(/Version (\d+\.\d+\.\d+)/);
                        callback(matches ? matches[1] : "0.0.0");
                    });
                };
                Precompiler.prototype.runWithParameters = function (params) {
                    var _this = this;
                    this.getTscVersion(function (tscVersion) {
                        params.tscVersion = tscVersion;
                        if (params.silent)
                            kr3m.util.Log.enabled = false;
                        if (params.greyOnly) {
                            for (var i in kr3m.util.Log) {
                                if (i.slice(0, 6) == "COLOR_")
                                    kr3m.util.Log[i] = "";
                            }
                        }
                        log("");
                        log("Kr3m Precompiler " + kr3m.VERSION);
                        log("Typescript Compiler " + params.tscVersion);
                        switch (params.command) {
                            case "build":
                                _this.build(params);
                                break;
                            case "compile":
                                _this.compile(params);
                                break;
                            case "clean":
                                _this.clean(params);
                                break;
                            default:
                                _this.showHelpText();
                                break;
                        }
                    });
                };
                Precompiler.prototype.run = function () {
                    var params = new kr3m.tools.precompiler.Parameters(process.argv);
                    this.runWithParameters(params);
                };
                return Precompiler;
            }());
            precompiler.Precompiler = Precompiler;
        })(precompiler = tools.precompiler || (tools.precompiler = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
})(kr3m || (kr3m = {}));
var precomp = new kr3m.tools.precompiler.Precompiler();
precomp.run();
