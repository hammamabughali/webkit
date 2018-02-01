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
var cuboro;
(function (cuboro) {
    cuboro.VERSION = "0.83.0.0";
    cuboro.DB_VERSION = "0.80.0.108";
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    cuboro.RATING_VALUES = [1, 2, 3, 4, 5];
    cuboro.RATING_THRESHOLD = 10;
    cuboro.ERROR_IS_NOT_TRACK_OWNER = "ERROR_IS_NOT_TRACK_OWNER";
    cuboro.ERROR_TRACK_IS_PUBLISHED = "ERROR_TRACK_IS_PUBLISHED";
    cuboro.ERROR_TRACK_NAME_NOT_OVERWRITTEN = "ERROR_TRACK_NAME_NOT_OVERWRITTEN";
    cuboro.ERROR_CANT_RATE_OWN_TRACKS = "ERROR_CANT_RATE_OWN_TRACKS";
})(cuboro || (cuboro = {}));
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
            Log.disableColors = function () {
                var p = /^COLOR_|BACKGROUND_/;
                for (var field in Log) {
                    if (p.test(field))
                        Log[field] = "";
                }
            };
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
    kr3m.VERSION = "1.7.1.11";
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
    var util;
    (function (util) {
        var Factory = (function () {
            function Factory() {
                this.mapping = {};
                if (!Factory.instance)
                    Factory.instance = this;
            }
            Factory.getInstance = function () {
                if (!Factory.instance)
                    Factory.instance = new Factory();
                return Factory.instance;
            };
            Factory.prototype.addMapping = function (from, to) {
                this.mapping[from.toString()] = to;
            };
            Factory.prototype.map = function (cls) {
                return this.mapping[cls.toString()] || cls;
            };
            Factory.prototype.createInstance = function (cls) {
                var params = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    params[_i - 1] = arguments[_i];
                }
                var mapped = this.map(cls);
                function helper() {
                    mapped.apply(this, params);
                }
                helper.prototype = mapped.prototype;
                return new helper();
            };
            return Factory;
        }());
        util.Factory = Factory;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
function factory(cls) {
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
    }
    var fact = kr3m.util.Factory.getInstance();
    return fact.createInstance.apply(fact, [cls].concat(params));
}
var cuboro;
(function (cuboro) {
    var tables;
    (function (tables) {
        var RegionAdminVO = (function () {
            function RegionAdminVO(rawData) {
                if (rawData) {
                    for (var i in rawData) {
                        if (cuboro.tables.RegionAdminVO.isColumnName(i))
                            this[i] = rawData[i];
                    }
                }
            }
            RegionAdminVO.isColumnName = function (name) {
                return (["regionId", "userId"]).indexOf(name) >= 0;
            };
            RegionAdminVO.getColumnNames = function () {
                return ["regionId", "userId"];
            };
            RegionAdminVO.buildFrom = function (raw) {
                var helper = new kr3m.services.ParamsHelper(raw);
                if (!helper.validate({ "regionId": "string", "userId": "number" }, {}))
                    return null;
                var foreignKeyNames = ["regionId", "userId"];
                var vo = new cuboro.tables.RegionAdminVO();
                var copyFields = ["regionId", "userId"];
                for (var i = 0; i < copyFields.length; ++i) {
                    vo[copyFields[i]] = raw[copyFields[i]];
                    if (!vo[copyFields[i]] && kr3m.util.Util.contains(foreignKeyNames, copyFields[i]))
                        vo[copyFields[i]] = null;
                }
                return vo;
            };
            RegionAdminVO.prototype.wrapErrorCallback = function (errorCallback, functionName) {
                if (!errorCallback)
                    return errorCallback;
                var newCallback = function (errorMessage) {
                    errorCallback("cuboro.tables.RegionAdminVO." + functionName + " - " + errorMessage);
                };
                return newCallback;
            };
            RegionAdminVO.prototype.postLoad = function () {
            };
            RegionAdminVO.prototype.preStore = function () {
            };
            RegionAdminVO.prototype.postStore = function () {
            };
            RegionAdminVO.prototype.insert = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "insert");
                this.preStore();
                db.insert("region_admins", this, function () {
                    _this.postStore();
                    callback && callback();
                }, errorCallback);
            };
            RegionAdminVO.prototype.upsert = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "upsert");
                this.preStore();
                db.upsert("region_admins", this, function () {
                    _this.postStore();
                    callback && callback();
                }, null, errorCallback);
            };
            RegionAdminVO.prototype.update = function (whereKeys, callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "update");
                this.preStore();
                db.update("region_admins", this, function () {
                    _this.postStore();
                    callback && callback();
                }, whereKeys, errorCallback);
            };
            RegionAdminVO.prototype["delete"] = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "delete");
                db.deleteBatch("region_admins", this, callback, errorCallback);
            };
            RegionAdminVO.prototype.getRegion = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getRegion");
                var sql = "SELECT * FROM `region_variants` WHERE `id` = ? LIMIT 0,1";
                sql = db.escape(sql, [this.regionId]);
                db.fetchRow(sql, function (data) {
                    if (!data)
                        return callback(undefined);
                    data.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.RegionVariantVO).prototype;
                    data.postLoad();
                    callback(data);
                }, errorCallback);
            };
            RegionAdminVO.prototype.getUser = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getUser");
                var sql = "SELECT * FROM `users` WHERE `id` = ? LIMIT 0,1";
                sql = db.escape(sql, [this.userId]);
                db.fetchRow(sql, function (data) {
                    if (!data)
                        return callback(undefined);
                    data.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.UserVO).prototype;
                    data.postLoad();
                    callback(data);
                }, errorCallback);
            };
            RegionAdminVO.REGION_ID_MAX_LENGTH = 32;
            RegionAdminVO.REGION_ID_MAX_LENGTH_SECURE = 16;
            return RegionAdminVO;
        }());
        tables.RegionAdminVO = RegionAdminVO;
    })(tables = cuboro.tables || (cuboro.tables = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var tables;
    (function (tables) {
        var UserVO = (function () {
            function UserVO(rawData) {
                this.lastRegionId = "MAIN";
                if (rawData) {
                    for (var i in rawData) {
                        if (cuboro.tables.UserVO.isColumnName(i))
                            this[i] = rawData[i];
                    }
                }
            }
            UserVO.isColumnName = function (name) {
                return (["id", "imageUrl", "lastRegionId", "name"]).indexOf(name) >= 0;
            };
            UserVO.getColumnNames = function () {
                return ["id", "imageUrl", "lastRegionId", "name"];
            };
            UserVO.buildFrom = function (raw) {
                var helper = new kr3m.services.ParamsHelper(raw);
                if (!helper.validate({ "id": "number", "imageUrl": "string", "lastRegionId": "string", "name": "string" }, { "lastRegionId": "MAIN" }))
                    return null;
                var foreignKeyNames = ["lastRegionId"];
                var vo = new cuboro.tables.UserVO();
                var copyFields = ["id", "imageUrl", "lastRegionId", "name"];
                for (var i = 0; i < copyFields.length; ++i) {
                    vo[copyFields[i]] = raw[copyFields[i]];
                    if (!vo[copyFields[i]] && kr3m.util.Util.contains(foreignKeyNames, copyFields[i]))
                        vo[copyFields[i]] = null;
                }
                return vo;
            };
            UserVO.prototype.wrapErrorCallback = function (errorCallback, functionName) {
                if (!errorCallback)
                    return errorCallback;
                var newCallback = function (errorMessage) {
                    errorCallback("cuboro.tables.UserVO." + functionName + " - " + errorMessage);
                };
                return newCallback;
            };
            UserVO.prototype.postLoad = function () {
            };
            UserVO.prototype.preStore = function () {
            };
            UserVO.prototype.postStore = function () {
            };
            UserVO.prototype.insert = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "insert");
                this.preStore();
                db.insert("users", this, function (insertedId) {
                    _this.id = insertedId;
                    _this.postStore();
                    callback && callback(insertedId);
                }, errorCallback);
            };
            UserVO.prototype.upsert = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "upsert");
                this.preStore();
                db.upsert("users", this, function (insertedId) {
                    _this.id = insertedId || _this.id;
                    _this.postStore();
                    callback && callback(insertedId);
                }, null, errorCallback);
            };
            UserVO.prototype.update = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "update");
                this.preStore();
                db.update("users", this, function () {
                    _this.postStore();
                    callback && callback();
                }, "id", errorCallback);
            };
            UserVO.prototype["delete"] = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "delete");
                var where = db.escape("id = ?", [this.id]);
                db.deleteBatch("users", where, callback, errorCallback);
            };
            UserVO.prototype.getLastRegion = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getLastRegion");
                var sql = "SELECT * FROM `region_variants` WHERE `id` = ? LIMIT 0,1";
                sql = db.escape(sql, [this.lastRegionId]);
                db.fetchRow(sql, function (data) {
                    if (!data)
                        return callback(undefined);
                    data.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.RegionVariantVO).prototype;
                    data.postLoad();
                    callback(data);
                }, errorCallback);
            };
            UserVO.prototype.getComments = function () {
                var u = kr3m.util.Util;
                var whereObj = u.getFirstOfType(arguments, "object", 0, 0);
                var whereString = whereObj ? db.where(whereObj) : u.getFirstOfType(arguments, "string", 0, 0);
                var where = whereString ? " AND (" + whereString.replace(/\bWHERE\b/i, "") + ") " : "";
                var offset = u.getFirstOfType(arguments, "number", 0, 0);
                var limit = u.getFirstOfType(arguments, "number", 0, 1);
                var limits = (offset !== undefined && limit !== undefined) ? db.escape(" LIMIT ?, ?", [offset, limit]) : "";
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "getComments");
                var sql = "SELECT * FROM `comments` WHERE `userId` = ? " + where + limits;
                sql = db.escape(sql, [this.id]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CommentVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            UserVO.prototype.getRegionAdmins = function () {
                var u = kr3m.util.Util;
                var whereObj = u.getFirstOfType(arguments, "object", 0, 0);
                var whereString = whereObj ? db.where(whereObj) : u.getFirstOfType(arguments, "string", 0, 0);
                var where = whereString ? " AND (" + whereString.replace(/\bWHERE\b/i, "") + ") " : "";
                var offset = u.getFirstOfType(arguments, "number", 0, 0);
                var limit = u.getFirstOfType(arguments, "number", 0, 1);
                var limits = (offset !== undefined && limit !== undefined) ? db.escape(" LIMIT ?, ?", [offset, limit]) : "";
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "getRegionAdmins");
                var sql = "SELECT * FROM `region_admins` WHERE `userId` = ? " + where + limits;
                sql = db.escape(sql, [this.id]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.RegionAdminVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            UserVO.prototype.getReportscomment = function () {
                var u = kr3m.util.Util;
                var whereObj = u.getFirstOfType(arguments, "object", 0, 0);
                var whereString = whereObj ? db.where(whereObj) : u.getFirstOfType(arguments, "string", 0, 0);
                var where = whereString ? " AND (" + whereString.replace(/\bWHERE\b/i, "") + ") " : "";
                var offset = u.getFirstOfType(arguments, "number", 0, 0);
                var limit = u.getFirstOfType(arguments, "number", 0, 1);
                var limits = (offset !== undefined && limit !== undefined) ? db.escape(" LIMIT ?, ?", [offset, limit]) : "";
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "getReportscomment");
                var sql = "SELECT * FROM `reportscomment` WHERE `userId` = ? " + where + limits;
                sql = db.escape(sql, [this.id]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.ReportscommentVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            UserVO.prototype.getTracks = function () {
                var u = kr3m.util.Util;
                var whereObj = u.getFirstOfType(arguments, "object", 0, 0);
                var whereString = whereObj ? db.where(whereObj) : u.getFirstOfType(arguments, "string", 0, 0);
                var where = whereString ? " AND (" + whereString.replace(/\bWHERE\b/i, "") + ") " : "";
                var offset = u.getFirstOfType(arguments, "number", 0, 0);
                var limit = u.getFirstOfType(arguments, "number", 0, 1);
                var limits = (offset !== undefined && limit !== undefined) ? db.escape(" LIMIT ?, ?", [offset, limit]) : "";
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "getTracks");
                var sql = "SELECT * FROM `tracks` WHERE `ownerId` = ? " + where + limits;
                sql = db.escape(sql, [this.id]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.TrackVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            UserVO.IMAGE_URL_MAX_LENGTH = 500;
            UserVO.IMAGE_URL_MAX_LENGTH_SECURE = 250;
            UserVO.LAST_REGION_ID_MAX_LENGTH = 32;
            UserVO.LAST_REGION_ID_MAX_LENGTH_SECURE = 16;
            UserVO.NAME_MAX_LENGTH = 200;
            UserVO.NAME_MAX_LENGTH_SECURE = 100;
            return UserVO;
        }());
        tables.UserVO = UserVO;
    })(tables = cuboro.tables || (cuboro.tables = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var tables;
    (function (tables) {
        var ReportscommentVO = (function () {
            function ReportscommentVO(rawData) {
                this.createdWehn = new Date();
                if (rawData) {
                    for (var i in rawData) {
                        if (cuboro.tables.ReportscommentVO.isColumnName(i))
                            this[i] = rawData[i];
                    }
                }
            }
            ReportscommentVO.isColumnName = function (name) {
                return (["commentId", "createdWehn", "id", "userId"]).indexOf(name) >= 0;
            };
            ReportscommentVO.getColumnNames = function () {
                return ["commentId", "createdWehn", "id", "userId"];
            };
            ReportscommentVO.buildFrom = function (raw) {
                var helper = new kr3m.services.ParamsHelper(raw);
                if (!helper.validate({ "commentId": "number", "createdWehn": "Date", "id": "number", "userId": "number" }, { "createdWehn": "CURRENT_TIMESTAMP" }))
                    return null;
                var foreignKeyNames = ["commentId", "userId"];
                var vo = new cuboro.tables.ReportscommentVO();
                var copyFields = ["commentId", "createdWehn", "id", "userId"];
                for (var i = 0; i < copyFields.length; ++i) {
                    vo[copyFields[i]] = raw[copyFields[i]];
                    if (!vo[copyFields[i]] && kr3m.util.Util.contains(foreignKeyNames, copyFields[i]))
                        vo[copyFields[i]] = null;
                }
                return vo;
            };
            ReportscommentVO.prototype.wrapErrorCallback = function (errorCallback, functionName) {
                if (!errorCallback)
                    return errorCallback;
                var newCallback = function (errorMessage) {
                    errorCallback("cuboro.tables.ReportscommentVO." + functionName + " - " + errorMessage);
                };
                return newCallback;
            };
            ReportscommentVO.prototype.postLoad = function () {
            };
            ReportscommentVO.prototype.preStore = function () {
            };
            ReportscommentVO.prototype.postStore = function () {
            };
            ReportscommentVO.prototype.insert = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "insert");
                this.preStore();
                db.insert("reportscomment", this, function (insertedId) {
                    _this.id = insertedId;
                    _this.postStore();
                    callback && callback(insertedId);
                }, errorCallback);
            };
            ReportscommentVO.prototype.upsert = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "upsert");
                this.preStore();
                db.upsert("reportscomment", this, function (insertedId) {
                    _this.id = insertedId || _this.id;
                    _this.postStore();
                    callback && callback(insertedId);
                }, null, errorCallback);
            };
            ReportscommentVO.prototype.update = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "update");
                this.preStore();
                db.update("reportscomment", this, function () {
                    _this.postStore();
                    callback && callback();
                }, "id", errorCallback);
            };
            ReportscommentVO.prototype["delete"] = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "delete");
                var where = db.escape("id = ?", [this.id]);
                db.deleteBatch("reportscomment", where, callback, errorCallback);
            };
            ReportscommentVO.prototype.getComment = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getComment");
                var sql = "SELECT * FROM `comments` WHERE `id` = ? LIMIT 0,1";
                sql = db.escape(sql, [this.commentId]);
                db.fetchRow(sql, function (data) {
                    if (!data)
                        return callback(undefined);
                    data.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CommentVO).prototype;
                    data.postLoad();
                    callback(data);
                }, errorCallback);
            };
            ReportscommentVO.prototype.getUser = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getUser");
                var sql = "SELECT * FROM `users` WHERE `id` = ? LIMIT 0,1";
                sql = db.escape(sql, [this.userId]);
                db.fetchRow(sql, function (data) {
                    if (!data)
                        return callback(undefined);
                    data.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.UserVO).prototype;
                    data.postLoad();
                    callback(data);
                }, errorCallback);
            };
            return ReportscommentVO;
        }());
        tables.ReportscommentVO = ReportscommentVO;
    })(tables = cuboro.tables || (cuboro.tables = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var tables;
    (function (tables) {
        var CommentVO = (function () {
            function CommentVO(rawData) {
                this.createdWhen = new Date();
                if (rawData) {
                    for (var i in rawData) {
                        if (cuboro.tables.CommentVO.isColumnName(i))
                            this[i] = rawData[i];
                    }
                }
            }
            CommentVO.isColumnName = function (name) {
                return (["comment", "createdWhen", "id", "trackId", "userId"]).indexOf(name) >= 0;
            };
            CommentVO.getColumnNames = function () {
                return ["comment", "createdWhen", "id", "trackId", "userId"];
            };
            CommentVO.buildFrom = function (raw) {
                var helper = new kr3m.services.ParamsHelper(raw);
                if (!helper.validate({ "comment": "string", "createdWhen": "Date", "id": "number", "trackId": "number", "userId": "number" }, { "createdWhen": "CURRENT_TIMESTAMP" }))
                    return null;
                var foreignKeyNames = ["trackId", "userId"];
                var vo = new cuboro.tables.CommentVO();
                var copyFields = ["comment", "createdWhen", "id", "trackId", "userId"];
                for (var i = 0; i < copyFields.length; ++i) {
                    vo[copyFields[i]] = raw[copyFields[i]];
                    if (!vo[copyFields[i]] && kr3m.util.Util.contains(foreignKeyNames, copyFields[i]))
                        vo[copyFields[i]] = null;
                }
                return vo;
            };
            CommentVO.prototype.wrapErrorCallback = function (errorCallback, functionName) {
                if (!errorCallback)
                    return errorCallback;
                var newCallback = function (errorMessage) {
                    errorCallback("cuboro.tables.CommentVO." + functionName + " - " + errorMessage);
                };
                return newCallback;
            };
            CommentVO.prototype.postLoad = function () {
            };
            CommentVO.prototype.preStore = function () {
            };
            CommentVO.prototype.postStore = function () {
            };
            CommentVO.prototype.insert = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "insert");
                this.preStore();
                db.insert("comments", this, function (insertedId) {
                    _this.id = insertedId;
                    _this.postStore();
                    callback && callback(insertedId);
                }, errorCallback);
            };
            CommentVO.prototype.upsert = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "upsert");
                this.preStore();
                db.upsert("comments", this, function (insertedId) {
                    _this.id = insertedId || _this.id;
                    _this.postStore();
                    callback && callback(insertedId);
                }, null, errorCallback);
            };
            CommentVO.prototype.update = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "update");
                this.preStore();
                db.update("comments", this, function () {
                    _this.postStore();
                    callback && callback();
                }, "id", errorCallback);
            };
            CommentVO.prototype["delete"] = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "delete");
                var where = db.escape("id = ?", [this.id]);
                db.deleteBatch("comments", where, callback, errorCallback);
            };
            CommentVO.prototype.getTrack = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getTrack");
                var sql = "SELECT * FROM `tracks` WHERE `id` = ? LIMIT 0,1";
                sql = db.escape(sql, [this.trackId]);
                db.fetchRow(sql, function (data) {
                    if (!data)
                        return callback(undefined);
                    data.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.TrackVO).prototype;
                    data.postLoad();
                    callback(data);
                }, errorCallback);
            };
            CommentVO.prototype.getUser = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getUser");
                var sql = "SELECT * FROM `users` WHERE `id` = ? LIMIT 0,1";
                sql = db.escape(sql, [this.userId]);
                db.fetchRow(sql, function (data) {
                    if (!data)
                        return callback(undefined);
                    data.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.UserVO).prototype;
                    data.postLoad();
                    callback(data);
                }, errorCallback);
            };
            CommentVO.prototype.getReportscomment = function () {
                var u = kr3m.util.Util;
                var whereObj = u.getFirstOfType(arguments, "object", 0, 0);
                var whereString = whereObj ? db.where(whereObj) : u.getFirstOfType(arguments, "string", 0, 0);
                var where = whereString ? " AND (" + whereString.replace(/\bWHERE\b/i, "") + ") " : "";
                var offset = u.getFirstOfType(arguments, "number", 0, 0);
                var limit = u.getFirstOfType(arguments, "number", 0, 1);
                var limits = (offset !== undefined && limit !== undefined) ? db.escape(" LIMIT ?, ?", [offset, limit]) : "";
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "getReportscomment");
                var sql = "SELECT * FROM `reportscomment` WHERE `commentId` = ? " + where + limits;
                sql = db.escape(sql, [this.id]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.ReportscommentVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            CommentVO.prototype.getReportscommentByUserId = function (userId, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getReportscommentByUserId");
                var sql = "SELECT * FROM `reportscomment` WHERE `commentId` = ? AND `userId` = ? LIMIT 0,1";
                sql = db.escape(sql, [this.id, userId]);
                db.fetchRow(sql, function (data) {
                    if (!data)
                        return callback(undefined);
                    data.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.ReportscommentVO).prototype;
                    data.postLoad();
                    callback(data);
                }, errorCallback);
            };
            CommentVO.COMMENT_MAX_LENGTH = 65535;
            CommentVO.COMMENT_MAX_LENGTH_SECURE = 32767;
            return CommentVO;
        }());
        tables.CommentVO = CommentVO;
    })(tables = cuboro.tables || (cuboro.tables = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var tables;
    (function (tables) {
        var TrackVO = (function () {
            function TrackVO(rawData) {
                this.createdWhen = new Date();
                this.isEducational = false;
                this.isPublished = false;
                this.lastSavedWhen = new Date();
                this.previousId = null;
                this.regionId = "MAIN";
                if (rawData) {
                    for (var i in rawData) {
                        if (cuboro.tables.TrackVO.isColumnName(i))
                            this[i] = rawData[i];
                    }
                }
            }
            TrackVO.isColumnName = function (name) {
                return (["createdWhen", "data", "id", "imageUrl", "isEducational", "isPublished", "lastSavedWhen", "name", "ownerId", "previousId", "regionId", "scoreTotal"]).indexOf(name) >= 0;
            };
            TrackVO.getColumnNames = function () {
                return ["createdWhen", "data", "id", "imageUrl", "isEducational", "isPublished", "lastSavedWhen", "name", "ownerId", "previousId", "regionId", "scoreTotal"];
            };
            TrackVO.buildFrom = function (raw) {
                var helper = new kr3m.services.ParamsHelper(raw);
                if (!helper.validate({ "createdWhen": "Date", "data": "string", "id": "number", "imageUrl": "string", "isEducational": "boolean", "isPublished": "boolean", "lastSavedWhen": "Date", "name": "string", "ownerId": "number", "previousId": "number", "regionId": "string", "scoreTotal": "number" }, { "createdWhen": "CURRENT_TIMESTAMP", "isEducational": "false", "isPublished": "false", "lastSavedWhen": "CURRENT_TIMESTAMP", "previousId": null, "regionId": "MAIN" }))
                    return null;
                var foreignKeyNames = ["ownerId", "previousId", "regionId"];
                var vo = new cuboro.tables.TrackVO();
                var copyFields = ["createdWhen", "data", "id", "imageUrl", "isEducational", "isPublished", "lastSavedWhen", "name", "ownerId", "previousId", "regionId", "scoreTotal"];
                for (var i = 0; i < copyFields.length; ++i) {
                    vo[copyFields[i]] = raw[copyFields[i]];
                    if (!vo[copyFields[i]] && kr3m.util.Util.contains(foreignKeyNames, copyFields[i]))
                        vo[copyFields[i]] = null;
                }
                return vo;
            };
            TrackVO.prototype.wrapErrorCallback = function (errorCallback, functionName) {
                if (!errorCallback)
                    return errorCallback;
                var newCallback = function (errorMessage) {
                    errorCallback("cuboro.tables.TrackVO." + functionName + " - " + errorMessage);
                };
                return newCallback;
            };
            TrackVO.prototype.postLoad = function () {
                var autoUpdateFields = ["lastSavedWhen"];
                var oldValues = {};
                for (var i = 0; i < autoUpdateFields.length; ++i) {
                    var field = autoUpdateFields[i];
                    oldValues[field] = this[field];
                }
                Object.defineProperty(this, "__oldAutoUpdateFieldValues", { value: oldValues, enumerable: false });
            };
            TrackVO.prototype.preStore = function () {
                var autoUpdateFields = ["lastSavedWhen"];
                if (!this["__oldAutoUpdateFieldValues"])
                    Object.defineProperty(this, "__oldAutoUpdateFieldValues", { value: {}, enumerable: false });
                for (var i = 0; i < autoUpdateFields.length; ++i) {
                    var field = autoUpdateFields[i];
                    if (this[field] == this["__oldAutoUpdateFieldValues"][field])
                        delete this[field];
                    else
                        this["__oldAutoUpdateFieldValues"][field] = this[field];
                }
            };
            TrackVO.prototype.postStore = function () {
                var autoUpdateFields = ["lastSavedWhen"];
                for (var i = 0; i < autoUpdateFields.length; ++i) {
                    var field = autoUpdateFields[i];
                    this[field] = this["__oldAutoUpdateFieldValues"][field];
                }
            };
            TrackVO.prototype.insert = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "insert");
                this.preStore();
                db.insert("tracks", this, function (insertedId) {
                    _this.id = insertedId;
                    _this.postStore();
                    callback && callback(insertedId);
                }, errorCallback);
            };
            TrackVO.prototype.upsert = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "upsert");
                this.preStore();
                db.upsert("tracks", this, function (insertedId) {
                    _this.id = insertedId || _this.id;
                    _this.postStore();
                    callback && callback(insertedId);
                }, null, errorCallback);
            };
            TrackVO.prototype.update = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "update");
                this.preStore();
                db.update("tracks", this, function () {
                    _this.postStore();
                    callback && callback();
                }, "id", errorCallback);
            };
            TrackVO.prototype["delete"] = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "delete");
                var where = db.escape("id = ?", [this.id]);
                db.deleteBatch("tracks", where, callback, errorCallback);
            };
            TrackVO.prototype.getOwner = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getOwner");
                var sql = "SELECT * FROM `users` WHERE `id` = ? LIMIT 0,1";
                sql = db.escape(sql, [this.ownerId]);
                db.fetchRow(sql, function (data) {
                    if (!data)
                        return callback(undefined);
                    data.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.UserVO).prototype;
                    data.postLoad();
                    callback(data);
                }, errorCallback);
            };
            TrackVO.prototype.getPrevious = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getPrevious");
                var sql = "SELECT * FROM `tracks` WHERE `id` = ? LIMIT 0,1";
                sql = db.escape(sql, [this.previousId]);
                db.fetchRow(sql, function (data) {
                    if (!data)
                        return callback(undefined);
                    data.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.TrackVO).prototype;
                    data.postLoad();
                    callback(data);
                }, errorCallback);
            };
            TrackVO.prototype.getRegion = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getRegion");
                var sql = "SELECT * FROM `region_variants` WHERE `id` = ? LIMIT 0,1";
                sql = db.escape(sql, [this.regionId]);
                db.fetchRow(sql, function (data) {
                    if (!data)
                        return callback(undefined);
                    data.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.RegionVariantVO).prototype;
                    data.postLoad();
                    callback(data);
                }, errorCallback);
            };
            TrackVO.prototype.getComments = function () {
                var u = kr3m.util.Util;
                var whereObj = u.getFirstOfType(arguments, "object", 0, 0);
                var whereString = whereObj ? db.where(whereObj) : u.getFirstOfType(arguments, "string", 0, 0);
                var where = whereString ? " AND (" + whereString.replace(/\bWHERE\b/i, "") + ") " : "";
                var offset = u.getFirstOfType(arguments, "number", 0, 0);
                var limit = u.getFirstOfType(arguments, "number", 0, 1);
                var limits = (offset !== undefined && limit !== undefined) ? db.escape(" LIMIT ?, ?", [offset, limit]) : "";
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "getComments");
                var sql = "SELECT * FROM `comments` WHERE `trackId` = ? " + where + limits;
                sql = db.escape(sql, [this.id]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CommentVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            TrackVO.prototype.getCompetitions = function () {
                var u = kr3m.util.Util;
                var whereObj = u.getFirstOfType(arguments, "object", 0, 0);
                var whereString = whereObj ? db.where(whereObj) : u.getFirstOfType(arguments, "string", 0, 0);
                var where = whereString ? " AND (" + whereString.replace(/\bWHERE\b/i, "") + ") " : "";
                var offset = u.getFirstOfType(arguments, "number", 0, 0);
                var limit = u.getFirstOfType(arguments, "number", 0, 1);
                var limits = (offset !== undefined && limit !== undefined) ? db.escape(" LIMIT ?, ?", [offset, limit]) : "";
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "getCompetitions");
                var sql = "SELECT * FROM `competitions` WHERE `baseTrackId` = ? " + where + limits;
                sql = db.escape(sql, [this.id]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CompetitionVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            TrackVO.prototype.getTracks = function () {
                var u = kr3m.util.Util;
                var whereObj = u.getFirstOfType(arguments, "object", 0, 0);
                var whereString = whereObj ? db.where(whereObj) : u.getFirstOfType(arguments, "string", 0, 0);
                var where = whereString ? " AND (" + whereString.replace(/\bWHERE\b/i, "") + ") " : "";
                var offset = u.getFirstOfType(arguments, "number", 0, 0);
                var limit = u.getFirstOfType(arguments, "number", 0, 1);
                var limits = (offset !== undefined && limit !== undefined) ? db.escape(" LIMIT ?, ?", [offset, limit]) : "";
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "getTracks");
                var sql = "SELECT * FROM `tracks` WHERE `previousId` = ? " + where + limits;
                sql = db.escape(sql, [this.id]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.TrackVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            TrackVO.DATA_MAX_LENGTH = 4294967295;
            TrackVO.DATA_MAX_LENGTH_SECURE = 2147483647;
            TrackVO.IMAGE_URL_MAX_LENGTH = 65535;
            TrackVO.IMAGE_URL_MAX_LENGTH_SECURE = 32767;
            TrackVO.NAME_MAX_LENGTH = 200;
            TrackVO.NAME_MAX_LENGTH_SECURE = 100;
            TrackVO.REGION_ID_MAX_LENGTH = 32;
            TrackVO.REGION_ID_MAX_LENGTH_SECURE = 16;
            return TrackVO;
        }());
        tables.TrackVO = TrackVO;
    })(tables = cuboro.tables || (cuboro.tables = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var tables;
    (function (tables) {
        var CompetitionVO = (function () {
            function CompetitionVO(rawData) {
                this.baseTrackId = null;
                this.enabled = true;
                this.fixedParticipants = false;
                this.isPublic = false;
                this.layers = 9;
                this.mayApply = false;
                this.minScore = 0;
                if (rawData) {
                    for (var i in rawData) {
                        if (cuboro.tables.CompetitionVO.isColumnName(i))
                            this[i] = rawData[i];
                    }
                }
            }
            CompetitionVO.isColumnName = function (name) {
                return (["baseTrackId", "enabled", "ends", "fixedParticipants", "id", "isPublic", "layers", "mayApply", "minScore", "nameInternal", "regionId", "starts"]).indexOf(name) >= 0;
            };
            CompetitionVO.getColumnNames = function () {
                return ["baseTrackId", "enabled", "ends", "fixedParticipants", "id", "isPublic", "layers", "mayApply", "minScore", "nameInternal", "regionId", "starts"];
            };
            CompetitionVO.buildFrom = function (raw) {
                var helper = new kr3m.services.ParamsHelper(raw);
                if (!helper.validate({ "baseTrackId": "number", "enabled": "boolean", "ends": "Date", "fixedParticipants": "boolean", "id": "number", "isPublic": "boolean", "layers": "number", "mayApply": "boolean", "minScore": "number", "nameInternal": "string", "regionId": "string", "starts": "Date" }, { "baseTrackId": null, "enabled": "true", "fixedParticipants": "false", "isPublic": "false", "layers": "9", "mayApply": "false", "minScore": "0" }))
                    return null;
                var foreignKeyNames = ["baseTrackId", "regionId"];
                var vo = new cuboro.tables.CompetitionVO();
                var copyFields = ["baseTrackId", "enabled", "ends", "fixedParticipants", "id", "isPublic", "layers", "mayApply", "minScore", "nameInternal", "regionId", "starts"];
                for (var i = 0; i < copyFields.length; ++i) {
                    vo[copyFields[i]] = raw[copyFields[i]];
                    if (!vo[copyFields[i]] && kr3m.util.Util.contains(foreignKeyNames, copyFields[i]))
                        vo[copyFields[i]] = null;
                }
                return vo;
            };
            CompetitionVO.prototype.wrapErrorCallback = function (errorCallback, functionName) {
                if (!errorCallback)
                    return errorCallback;
                var newCallback = function (errorMessage) {
                    errorCallback("cuboro.tables.CompetitionVO." + functionName + " - " + errorMessage);
                };
                return newCallback;
            };
            CompetitionVO.prototype.postLoad = function () {
            };
            CompetitionVO.prototype.preStore = function () {
            };
            CompetitionVO.prototype.postStore = function () {
            };
            CompetitionVO.prototype.insert = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "insert");
                this.preStore();
                db.insert("competitions", this, function (insertedId) {
                    _this.id = insertedId;
                    _this.postStore();
                    callback && callback(insertedId);
                }, errorCallback);
            };
            CompetitionVO.prototype.upsert = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "upsert");
                this.preStore();
                db.upsert("competitions", this, function (insertedId) {
                    _this.id = insertedId || _this.id;
                    _this.postStore();
                    callback && callback(insertedId);
                }, null, errorCallback);
            };
            CompetitionVO.prototype.update = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "update");
                this.preStore();
                db.update("competitions", this, function () {
                    _this.postStore();
                    callback && callback();
                }, "id", errorCallback);
            };
            CompetitionVO.prototype["delete"] = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "delete");
                var where = db.escape("id = ?", [this.id]);
                db.deleteBatch("competitions", where, callback, errorCallback);
            };
            CompetitionVO.prototype.getBaseTrack = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getBaseTrack");
                var sql = "SELECT * FROM `tracks` WHERE `id` = ? LIMIT 0,1";
                sql = db.escape(sql, [this.baseTrackId]);
                db.fetchRow(sql, function (data) {
                    if (!data)
                        return callback(undefined);
                    data.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.TrackVO).prototype;
                    data.postLoad();
                    callback(data);
                }, errorCallback);
            };
            CompetitionVO.prototype.getRegion = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getRegion");
                var sql = "SELECT * FROM `region_variants` WHERE `id` = ? LIMIT 0,1";
                sql = db.escape(sql, [this.regionId]);
                db.fetchRow(sql, function (data) {
                    if (!data)
                        return callback(undefined);
                    data.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.RegionVariantVO).prototype;
                    data.postLoad();
                    callback(data);
                }, errorCallback);
            };
            CompetitionVO.NAME_INTERNAL_MAX_LENGTH = 128;
            CompetitionVO.NAME_INTERNAL_MAX_LENGTH_SECURE = 64;
            CompetitionVO.REGION_ID_MAX_LENGTH = 16;
            CompetitionVO.REGION_ID_MAX_LENGTH_SECURE = 8;
            return CompetitionVO;
        }());
        tables.CompetitionVO = CompetitionVO;
    })(tables = cuboro.tables || (cuboro.tables = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var tables;
    (function (tables) {
        var RegionVariantVO = (function () {
            function RegionVariantVO(rawData) {
                if (rawData) {
                    for (var i in rawData) {
                        if (cuboro.tables.RegionVariantVO.isColumnName(i))
                            this[i] = rawData[i];
                    }
                }
            }
            RegionVariantVO.isColumnName = function (name) {
                return (["id", "languageIds", "regionId"]).indexOf(name) >= 0;
            };
            RegionVariantVO.getColumnNames = function () {
                return ["id", "languageIds", "regionId"];
            };
            RegionVariantVO.buildFrom = function (raw) {
                var helper = new kr3m.services.ParamsHelper(raw);
                if (!helper.validate({ "id": "string", "languageIds": "string", "regionId": "string" }, {}))
                    return null;
                var foreignKeyNames = [];
                var vo = new cuboro.tables.RegionVariantVO();
                var copyFields = ["id", "languageIds", "regionId"];
                for (var i = 0; i < copyFields.length; ++i) {
                    vo[copyFields[i]] = raw[copyFields[i]];
                    if (!vo[copyFields[i]] && kr3m.util.Util.contains(foreignKeyNames, copyFields[i]))
                        vo[copyFields[i]] = null;
                }
                return vo;
            };
            RegionVariantVO.prototype.wrapErrorCallback = function (errorCallback, functionName) {
                if (!errorCallback)
                    return errorCallback;
                var newCallback = function (errorMessage) {
                    errorCallback("cuboro.tables.RegionVariantVO." + functionName + " - " + errorMessage);
                };
                return newCallback;
            };
            RegionVariantVO.prototype.postLoad = function () {
            };
            RegionVariantVO.prototype.preStore = function () {
            };
            RegionVariantVO.prototype.postStore = function () {
            };
            RegionVariantVO.prototype.checkId = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "checkId");
                if (this.id)
                    return callback(false);
                kr3m.async.Loop.loop(function (loopDone) {
                    kr3m.util.Rand.getSecureString(32, null, function (secureValue) {
                        _this.id = secureValue;
                        db.fetchOne(db.escape("SELECT id FROM region_variants WHERE id = ? LIMIT 0,1;", [_this.id]), function (dummy) { return loopDone(!!dummy); }, errorCallback);
                    });
                }, function () { return callback(true); });
            };
            RegionVariantVO.prototype.insert = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "insert");
                var retries = 3;
                kr3m.async.Loop.loop(function (loopDone) {
                    _this.checkId(function (wasGenerated) {
                        _this.preStore();
                        db.insert("region_variants", _this, function () {
                            _this.postStore();
                            callback && callback();
                        }, function (errorMessage) {
                            if (!wasGenerated || retries <= 0 || errorMessage.indexOf("ER_DUP_ENTRY") < 0) {
                                if (errorCallback)
                                    return errorCallback(errorMessage);
                                logError(errorMessage);
                                return callback && callback();
                            }
                            logWarning(errorMessage);
                            logWarning("retrying");
                            --retries;
                            loopDone(true);
                        });
                    });
                });
            };
            RegionVariantVO.prototype.upsert = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "upsert");
                var retries = 3;
                kr3m.async.Loop.loop(function (loopDone) {
                    _this.checkId(function (wasGenerated) {
                        _this.preStore();
                        db.upsert("region_variants", _this, function () {
                            _this.postStore();
                            callback && callback();
                        }, null, function (errorMessage) {
                            if (!wasGenerated || retries <= 0 || errorMessage.indexOf("ER_DUP_ENTRY") < 0) {
                                if (errorCallback)
                                    return errorCallback(errorMessage);
                                logError(errorMessage);
                                return callback && callback();
                            }
                            logWarning(errorMessage);
                            logWarning("retrying");
                            --retries;
                            loopDone(true);
                        });
                    });
                });
            };
            RegionVariantVO.prototype.update = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "update");
                this.preStore();
                db.update("region_variants", this, function () {
                    _this.postStore();
                    callback && callback();
                }, "id", errorCallback);
            };
            RegionVariantVO.prototype["delete"] = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "delete");
                var where = db.escape("id = ?", [this.id]);
                db.deleteBatch("region_variants", where, callback, errorCallback);
            };
            RegionVariantVO.prototype.getCompetitions = function () {
                var u = kr3m.util.Util;
                var whereObj = u.getFirstOfType(arguments, "object", 0, 0);
                var whereString = whereObj ? db.where(whereObj) : u.getFirstOfType(arguments, "string", 0, 0);
                var where = whereString ? " AND (" + whereString.replace(/\bWHERE\b/i, "") + ") " : "";
                var offset = u.getFirstOfType(arguments, "number", 0, 0);
                var limit = u.getFirstOfType(arguments, "number", 0, 1);
                var limits = (offset !== undefined && limit !== undefined) ? db.escape(" LIMIT ?, ?", [offset, limit]) : "";
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "getCompetitions");
                var sql = "SELECT * FROM `competitions` WHERE `regionId` = ? " + where + limits;
                sql = db.escape(sql, [this.id]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CompetitionVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            RegionVariantVO.prototype.getCompetitionsByEnabled = function () {
                var u = kr3m.util.Util;
                var enabled = u.getFirstOfType(arguments, "boolean", 0, 0);
                var whereObj = u.getFirstOfType(arguments, "object", 0, 0);
                var whereString = whereObj ? db.where(whereObj) : u.getFirstOfType(arguments, "string", 0, 0);
                var where = whereString ? " AND (" + whereString.replace(/\bWHERE\b/i, "") + ") " : "";
                var offset = u.getFirstOfType(arguments, "number", 1, 0);
                var limit = u.getFirstOfType(arguments, "number", 1, 1);
                var limits = (offset !== undefined && limit !== undefined) ? db.escape(" LIMIT ?, ?", [offset, limit]) : "";
                var callback = u.getFirstOfType(arguments, "function", 1, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 1, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "getCompetitionsByEnabled");
                var sql = "SELECT * FROM `competitions` WHERE `regionId` = ? AND `enabled` = ? " + where + limits;
                sql = db.escape(sql, [this.id, enabled]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CompetitionVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            RegionVariantVO.prototype.getRegionAdmins = function () {
                var u = kr3m.util.Util;
                var whereObj = u.getFirstOfType(arguments, "object", 0, 0);
                var whereString = whereObj ? db.where(whereObj) : u.getFirstOfType(arguments, "string", 0, 0);
                var where = whereString ? " AND (" + whereString.replace(/\bWHERE\b/i, "") + ") " : "";
                var offset = u.getFirstOfType(arguments, "number", 0, 0);
                var limit = u.getFirstOfType(arguments, "number", 0, 1);
                var limits = (offset !== undefined && limit !== undefined) ? db.escape(" LIMIT ?, ?", [offset, limit]) : "";
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "getRegionAdmins");
                var sql = "SELECT * FROM `region_admins` WHERE `regionId` = ? " + where + limits;
                sql = db.escape(sql, [this.id]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.RegionAdminVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            RegionVariantVO.prototype.getRegionAdminByUserId = function (userId, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getRegionAdminByUserId");
                var sql = "SELECT * FROM `region_admins` WHERE `regionId` = ? AND `userId` = ? LIMIT 0,1";
                sql = db.escape(sql, [this.id, userId]);
                db.fetchRow(sql, function (data) {
                    if (!data)
                        return callback(undefined);
                    data.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.RegionAdminVO).prototype;
                    data.postLoad();
                    callback(data);
                }, errorCallback);
            };
            RegionVariantVO.prototype.getRegionDomains = function () {
                var u = kr3m.util.Util;
                var whereObj = u.getFirstOfType(arguments, "object", 0, 0);
                var whereString = whereObj ? db.where(whereObj) : u.getFirstOfType(arguments, "string", 0, 0);
                var where = whereString ? " AND (" + whereString.replace(/\bWHERE\b/i, "") + ") " : "";
                var offset = u.getFirstOfType(arguments, "number", 0, 0);
                var limit = u.getFirstOfType(arguments, "number", 0, 1);
                var limits = (offset !== undefined && limit !== undefined) ? db.escape(" LIMIT ?, ?", [offset, limit]) : "";
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "getRegionDomains");
                var sql = "SELECT * FROM `region_domains` WHERE `regionId` = ? " + where + limits;
                sql = db.escape(sql, [this.id]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.RegionDomainVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            RegionVariantVO.prototype.getTracks = function () {
                var u = kr3m.util.Util;
                var whereObj = u.getFirstOfType(arguments, "object", 0, 0);
                var whereString = whereObj ? db.where(whereObj) : u.getFirstOfType(arguments, "string", 0, 0);
                var where = whereString ? " AND (" + whereString.replace(/\bWHERE\b/i, "") + ") " : "";
                var offset = u.getFirstOfType(arguments, "number", 0, 0);
                var limit = u.getFirstOfType(arguments, "number", 0, 1);
                var limits = (offset !== undefined && limit !== undefined) ? db.escape(" LIMIT ?, ?", [offset, limit]) : "";
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "getTracks");
                var sql = "SELECT * FROM `tracks` WHERE `regionId` = ? " + where + limits;
                sql = db.escape(sql, [this.id]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.TrackVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            RegionVariantVO.prototype.getUsers = function () {
                var u = kr3m.util.Util;
                var whereObj = u.getFirstOfType(arguments, "object", 0, 0);
                var whereString = whereObj ? db.where(whereObj) : u.getFirstOfType(arguments, "string", 0, 0);
                var where = whereString ? " AND (" + whereString.replace(/\bWHERE\b/i, "") + ") " : "";
                var offset = u.getFirstOfType(arguments, "number", 0, 0);
                var limit = u.getFirstOfType(arguments, "number", 0, 1);
                var limits = (offset !== undefined && limit !== undefined) ? db.escape(" LIMIT ?, ?", [offset, limit]) : "";
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "getUsers");
                var sql = "SELECT * FROM `users` WHERE `lastRegionId` = ? " + where + limits;
                sql = db.escape(sql, [this.id]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.UserVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            RegionVariantVO.ID_MAX_LENGTH = 32;
            RegionVariantVO.ID_MAX_LENGTH_SECURE = 16;
            RegionVariantVO.LANGUAGE_IDS_MAX_LENGTH = 256;
            RegionVariantVO.LANGUAGE_IDS_MAX_LENGTH_SECURE = 128;
            RegionVariantVO.REGION_ID_MAX_LENGTH = 2;
            RegionVariantVO.REGION_ID_MAX_LENGTH_SECURE = 1;
            return RegionVariantVO;
        }());
        tables.RegionVariantVO = RegionVariantVO;
    })(tables = cuboro.tables || (cuboro.tables = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var tables;
    (function (tables) {
        var RegionDomainVO = (function () {
            function RegionDomainVO(rawData) {
                if (rawData) {
                    for (var i in rawData) {
                        if (cuboro.tables.RegionDomainVO.isColumnName(i))
                            this[i] = rawData[i];
                    }
                }
            }
            RegionDomainVO.isColumnName = function (name) {
                return (["name", "regionId"]).indexOf(name) >= 0;
            };
            RegionDomainVO.getColumnNames = function () {
                return ["name", "regionId"];
            };
            RegionDomainVO.buildFrom = function (raw) {
                var helper = new kr3m.services.ParamsHelper(raw);
                if (!helper.validate({ "name": "string", "regionId": "string" }, {}))
                    return null;
                var foreignKeyNames = ["regionId"];
                var vo = new cuboro.tables.RegionDomainVO();
                var copyFields = ["name", "regionId"];
                for (var i = 0; i < copyFields.length; ++i) {
                    vo[copyFields[i]] = raw[copyFields[i]];
                    if (!vo[copyFields[i]] && kr3m.util.Util.contains(foreignKeyNames, copyFields[i]))
                        vo[copyFields[i]] = null;
                }
                return vo;
            };
            RegionDomainVO.prototype.wrapErrorCallback = function (errorCallback, functionName) {
                if (!errorCallback)
                    return errorCallback;
                var newCallback = function (errorMessage) {
                    errorCallback("cuboro.tables.RegionDomainVO." + functionName + " - " + errorMessage);
                };
                return newCallback;
            };
            RegionDomainVO.prototype.postLoad = function () {
            };
            RegionDomainVO.prototype.preStore = function () {
            };
            RegionDomainVO.prototype.postStore = function () {
            };
            RegionDomainVO.prototype.checkName = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "checkName");
                if (this.name)
                    return callback(false);
                kr3m.async.Loop.loop(function (loopDone) {
                    kr3m.util.Rand.getSecureString(200, null, function (secureValue) {
                        _this.name = secureValue;
                        db.fetchOne(db.escape("SELECT name FROM region_domains WHERE name = ? LIMIT 0,1;", [_this.name]), function (dummy) { return loopDone(!!dummy); }, errorCallback);
                    });
                }, function () { return callback(true); });
            };
            RegionDomainVO.prototype.insert = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "insert");
                var retries = 3;
                kr3m.async.Loop.loop(function (loopDone) {
                    _this.checkName(function (wasGenerated) {
                        _this.preStore();
                        db.insert("region_domains", _this, function () {
                            _this.postStore();
                            callback && callback();
                        }, function (errorMessage) {
                            if (!wasGenerated || retries <= 0 || errorMessage.indexOf("ER_DUP_ENTRY") < 0) {
                                if (errorCallback)
                                    return errorCallback(errorMessage);
                                logError(errorMessage);
                                return callback && callback();
                            }
                            logWarning(errorMessage);
                            logWarning("retrying");
                            --retries;
                            loopDone(true);
                        });
                    });
                });
            };
            RegionDomainVO.prototype.upsert = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "upsert");
                var retries = 3;
                kr3m.async.Loop.loop(function (loopDone) {
                    _this.checkName(function (wasGenerated) {
                        _this.preStore();
                        db.upsert("region_domains", _this, function () {
                            _this.postStore();
                            callback && callback();
                        }, null, function (errorMessage) {
                            if (!wasGenerated || retries <= 0 || errorMessage.indexOf("ER_DUP_ENTRY") < 0) {
                                if (errorCallback)
                                    return errorCallback(errorMessage);
                                logError(errorMessage);
                                return callback && callback();
                            }
                            logWarning(errorMessage);
                            logWarning("retrying");
                            --retries;
                            loopDone(true);
                        });
                    });
                });
            };
            RegionDomainVO.prototype.update = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "update");
                this.preStore();
                db.update("region_domains", this, function () {
                    _this.postStore();
                    callback && callback();
                }, "name", errorCallback);
            };
            RegionDomainVO.prototype["delete"] = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "delete");
                var where = db.escape("name = ?", [this.name]);
                db.deleteBatch("region_domains", where, callback, errorCallback);
            };
            RegionDomainVO.prototype.getRegion = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getRegion");
                var sql = "SELECT * FROM `region_variants` WHERE `id` = ? LIMIT 0,1";
                sql = db.escape(sql, [this.regionId]);
                db.fetchRow(sql, function (data) {
                    if (!data)
                        return callback(undefined);
                    data.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.RegionVariantVO).prototype;
                    data.postLoad();
                    callback(data);
                }, errorCallback);
            };
            RegionDomainVO.NAME_MAX_LENGTH = 200;
            RegionDomainVO.NAME_MAX_LENGTH_SECURE = 100;
            RegionDomainVO.REGION_ID_MAX_LENGTH = 32;
            RegionDomainVO.REGION_ID_MAX_LENGTH_SECURE = 16;
            return RegionDomainVO;
        }());
        tables.RegionDomainVO = RegionDomainVO;
    })(tables = cuboro.tables || (cuboro.tables = {}));
})(cuboro || (cuboro = {}));
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
    var dojo;
    (function (dojo) {
        var GridQueryResponse = (function () {
            function GridQueryResponse(items, identifier, numRows, label, sort) {
                this.items = items;
                this.identifier = identifier;
                this.numRows = numRows;
                this.label = label;
                this.sort = sort;
            }
            GridQueryResponse.prototype.map = function (mapper) {
                return new GridQueryResponse(this.items.map(mapper), this.identifier, this.numRows, this.label, this.sort);
            };
            GridQueryResponse.prototype.mapAsync = function (mapper, callback) {
                var _this = this;
                var items = [];
                kr3m.async.Loop.forEach(this.items, function (value, next) {
                    mapper(value, function (u) {
                        if (u)
                            items.push(u);
                        next();
                    });
                }, function () { return callback(new GridQueryResponse(items, _this.identifier, _this.numRows, _this.label, _this.sort)); });
            };
            return GridQueryResponse;
        }());
        dojo.GridQueryResponse = GridQueryResponse;
    })(dojo = kr3m.dojo || (kr3m.dojo = {}));
})(kr3m || (kr3m = {}));
var cuboro;
(function (cuboro) {
    var tables;
    (function (tables) {
        var RegionDomainsTable = (function () {
            function RegionDomainsTable() {
            }
            RegionDomainsTable.prototype.isColumnName = function (name) {
                return (["name", "regionId"]).indexOf(name) >= 0;
            };
            RegionDomainsTable.prototype.getColumnNames = function () {
                return ["name", "regionId"];
            };
            RegionDomainsTable.prototype.buildOrdering = function (ordering) {
                var parts = [];
                var ascDescRe = /^asc|desc$/i;
                for (var i = 0; i < ordering.length; ++i) {
                    if (this.isColumnName(ordering[i]))
                        parts.push(db.escapeId(ordering[i]));
                    else if (ascDescRe.test(ordering[i]) && parts.length > 0)
                        parts[parts.length - 1] += " " + ordering[i].toUpperCase();
                }
                return parts.length > 0 ? " ORDER BY " + parts.join(", ") : "";
            };
            RegionDomainsTable.prototype.getCount = function () {
                var u = kr3m.util.Util;
                var where = u.getFirstOfType(arguments, "string", 0, 0) || "1";
                where = where.replace(/^\s*where\s*/i, " ");
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                var sql = "SELECT COUNT(*) FROM `region_domains` WHERE " + where;
                db.fetchOne(sql, callback, errorCallback);
            };
            RegionDomainsTable.prototype.wrapErrorCallback = function (errorCallback, functionName) {
                if (!errorCallback)
                    return errorCallback;
                var newCallback = function (errorMessage) {
                    errorCallback("cuboro.tables.RegionDomainVO." + functionName + " - " + errorMessage);
                };
                return newCallback;
            };
            RegionDomainsTable.prototype.get = function () {
                var u = kr3m.util.Util;
                var whereSql = u.getFirstOfType(arguments, "string", 0, 0) || "1";
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "get");
                var sql = "SELECT * FROM `region_domains` WHERE " + whereSql;
                var ordering = u.getFirstOfType(arguments, "object", 0, 0) || [];
                if (ordering.length > 0)
                    sql += this.buildOrdering(ordering);
                var offset = u.getFirstOfType(arguments, "number", 0, 0) || 0;
                var limit = u.getFirstOfType(arguments, "number", 0, 1) || 0;
                if (limit > 0)
                    sql += db.escape(" LIMIT ?, ?", [offset, limit]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.RegionDomainVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            RegionDomainsTable.prototype.getIterative = function (where, dataCallback, doneCallback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getIterative");
                where = where.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT * FROM `region_domains` WHERE " + where;
                db.queryIterative(sql, function (rows, nextBatch) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.RegionDomainVO).prototype;
                        rows[i].postLoad();
                    }
                    dataCallback(rows, nextBatch);
                }, doneCallback, 20, errorCallback);
            };
            RegionDomainsTable.prototype.updateRaw = function (rows, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "updateRaw");
                db.updateBatch("region_domains", rows, callback, db.defaultBatchSize, "id", errorCallback);
            };
            RegionDomainsTable.prototype.fetchPage = function (where, orderBy, joins, offset, limit, callback) {
                db.fetchPage("region_domains", where, orderBy, joins, offset, limit, function (rows, totalCount) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.RegionDomainVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows, totalCount);
                });
            };
            RegionDomainsTable.prototype.fetchCol = function () {
                var u = kr3m.util.Util;
                var colName = u.getFirstOfType(arguments, "string", 0, 0);
                var whereSql = u.getFirstOfType(arguments, "string", 0, 1) || "1";
                var offset = u.getFirstOfType(arguments, "number", 0, 0) || 0;
                var limit = u.getFirstOfType(arguments, "number", 0, 1) || 0;
                var ordering = u.getFirstOfType(arguments, "object", 0, 1) || [];
                var distinct = u.getFirstOfType(arguments, "boolean", 0, 0) || false;
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchCol");
                if (!this.isColumnName(colName)) {
                    var error = "invalid column name for table region_domains: " + colName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var limitSql = (limit > 0 || offset > 0) ? " LIMIT " + offset + ", " + (offset + limit) : "";
                var orderSql = this.buildOrdering(ordering);
                var distinctSql = distinct ? "DISTINCT " : "";
                var sql = "SELECT " + distinctSql + "`" + colName + "` FROM `region_domains` WHERE " + whereSql + orderSql + limitSql;
                db.fetchCol(sql, callback, errorCallback);
            };
            RegionDomainsTable.prototype.fetchOne = function (colName, whereSql, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchOne");
                if (!this.isColumnName(colName)) {
                    var error = "invalid column name for table region_domains: " + colName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback(undefined);
                }
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT `" + colName + "` FROM `region_domains` WHERE " + whereSql + " LIMIT 1;";
                db.fetchOne(sql, callback, errorCallback);
            };
            RegionDomainsTable.prototype.fetchPairs = function (keyName, valueName, whereSql, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchPairs");
                if (!this.isColumnName(keyName)) {
                    var error = "invalid column name for table region_domains: " + keyName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                if (!this.isColumnName(valueName)) {
                    var error = "invalid column name for table region_domains: " + valueName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                if (keyName == valueName)
                    valueName += "` AS `_" + valueName;
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT `" + keyName + "`, `" + valueName + "` FROM `region_domains` WHERE " + whereSql;
                db.fetchPairs(sql, callback, errorCallback);
            };
            RegionDomainsTable.prototype.deleteWhere = function (where, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "deleteWhere");
                db.deleteBatch("region_domains", where, callback, errorCallback);
            };
            RegionDomainsTable.prototype.getTableName = function () {
                return "region_domains";
            };
            RegionDomainsTable.prototype.getDojo = function (params, callback, conditions, escapeArgs, errorCallback) {
                var _this = this;
                if (conditions === void 0) { conditions = []; }
                if (escapeArgs === void 0) { escapeArgs = []; }
                errorCallback = this.wrapErrorCallback(errorCallback, "getDojo");
                var columnNames = this.getColumnNames();
                var offset = params.start || 0;
                var limit = params.count || 20;
                var sort = params.sort || "name";
                for (var i = 0; i < columnNames.length; ++i) {
                    if (params.hasOwnProperty(columnNames[i]) && params[columnNames[i]]) {
                        conditions.push("`" + columnNames[i] + "` = ?");
                        escapeArgs.push(params[columnNames[i]]);
                    }
                }
                var where = db.escape(conditions.join(" AND "), escapeArgs);
                if (where == "")
                    where = "1";
                var ordering = [];
                if (sort.substring(0, 1) == "-")
                    ordering.push(sort, "ASC");
                else
                    ordering.push(sort, "DESC");
                this.getCount(where, function (count) {
                    _this.get(where, offset, limit, ordering, function (vos) { return callback(new kr3m.dojo.GridQueryResponse(vos, "name", count, "name", sort)); }, errorCallback);
                }, errorCallback);
            };
            RegionDomainsTable.prototype.upsertBatch = function (vos, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "upsertBatch");
                vos = vos.slice();
                var noNameVos = [];
                for (var i = 0; i < vos.length; ++i) {
                    if (!vos[i].name) {
                        noNameVos.push(vos[i]);
                        vos.splice(i--, 1);
                    }
                }
                for (var i = 0; i < vos.length; ++i)
                    vos[i].preStore();
                db.upsertBatch("region_domains", vos, function () {
                    for (var i = 0; i < vos.length; ++i)
                        vos[i].postStore();
                    kr3m.async.Loop.forEach(noNameVos, function (noNameVo, next) {
                        noNameVo.upsert(next);
                    }, function () { return callback && callback(); });
                }, db.defaultBatchSize, null, errorCallback);
            };
            RegionDomainsTable.prototype.updateBatch = function (vos, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "updateBatch");
                for (var i = 0; i < vos.length; ++i) {
                    if (!vos[i].name) {
                        if (errorCallback)
                            return errorCallback("some vos are missing their name attribute in updateBatch call");
                        throw new Error("some vos are missing their name attribute in updateBatch call");
                    }
                }
                for (var i = 0; i < vos.length; ++i)
                    vos[i].preStore();
                db.updateBatch("region_domains", vos, function () {
                    for (var i = 0; i < vos.length; ++i)
                        vos[i].postStore();
                    callback && callback();
                }, db.defaultBatchSize, "name", errorCallback);
            };
            RegionDomainsTable.prototype.insertBatch = function (vos, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "insertBatch");
                vos = vos.slice();
                var noNameVos = [];
                for (var i = 0; i < vos.length; ++i) {
                    if (!vos[i].name) {
                        noNameVos.push(vos[i]);
                        vos.splice(i--, 1);
                    }
                }
                for (var i = 0; i < vos.length; ++i)
                    vos[i].preStore();
                db.insertBatch("region_domains", vos, function () {
                    for (var i = 0; i < vos.length; ++i)
                        vos[i].postStore();
                    kr3m.async.Loop.forEach(noNameVos, function (noNameVo, next) {
                        noNameVo.insert(next);
                    }, function () { return callback && callback(); });
                }, db.defaultBatchSize, errorCallback);
            };
            RegionDomainsTable.prototype.getFreeName = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "getFreeName");
                var name;
                kr3m.async.Loop.loop(function (loopDone) {
                    kr3m.util.Rand.getSecureString(200, null, function (secString) {
                        name = secString;
                        _this.getByName(name, function (dummy) { return loopDone(!!dummy); }, errorCallback);
                    });
                }, function () { return callback(name); });
            };
            RegionDomainsTable.prototype.getByNames = function (names, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getByNames");
                if (names.length == 0)
                    return callback({});
                var sql = "SELECT * FROM `region_domains` WHERE `name` IN (?)";
                sql = db.escape(sql, [names]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.RegionDomainVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(kr3m.util.Util.arrayToAssoc(rows, "name"));
                }, errorCallback);
            };
            RegionDomainsTable.prototype.getByName = function (name, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getByName");
                var sql = "SELECT * FROM `region_domains` WHERE `name` = ? LIMIT 0,1";
                sql = db.escape(sql, [name]);
                db.fetchRow(sql, function (row) {
                    if (!row)
                        return callback(undefined);
                    row.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.RegionDomainVO).prototype;
                    row.postLoad();
                    callback(row);
                }, errorCallback);
            };
            RegionDomainsTable.prototype.getByRegionId = function (regionId, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "finderName");
                var sql = "SELECT * FROM `region_domains` WHERE `regionId` = ?";
                sql = db.escape(sql, [regionId]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.RegionDomainVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            return RegionDomainsTable;
        }());
        tables.RegionDomainsTable = RegionDomainsTable;
    })(tables = cuboro.tables || (cuboro.tables = {}));
})(cuboro || (cuboro = {}));
var tRegionDomains = new cuboro.tables.RegionDomainsTable();
var cuboro;
(function (cuboro) {
    var tables;
    (function (tables) {
        var RegionVariantsTable = (function () {
            function RegionVariantsTable() {
            }
            RegionVariantsTable.prototype.isColumnName = function (name) {
                return (["id", "languageIds", "regionId"]).indexOf(name) >= 0;
            };
            RegionVariantsTable.prototype.getColumnNames = function () {
                return ["id", "languageIds", "regionId"];
            };
            RegionVariantsTable.prototype.buildOrdering = function (ordering) {
                var parts = [];
                var ascDescRe = /^asc|desc$/i;
                for (var i = 0; i < ordering.length; ++i) {
                    if (this.isColumnName(ordering[i]))
                        parts.push(db.escapeId(ordering[i]));
                    else if (ascDescRe.test(ordering[i]) && parts.length > 0)
                        parts[parts.length - 1] += " " + ordering[i].toUpperCase();
                }
                return parts.length > 0 ? " ORDER BY " + parts.join(", ") : "";
            };
            RegionVariantsTable.prototype.getCount = function () {
                var u = kr3m.util.Util;
                var where = u.getFirstOfType(arguments, "string", 0, 0) || "1";
                where = where.replace(/^\s*where\s*/i, " ");
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                var sql = "SELECT COUNT(*) FROM `region_variants` WHERE " + where;
                db.fetchOne(sql, callback, errorCallback);
            };
            RegionVariantsTable.prototype.wrapErrorCallback = function (errorCallback, functionName) {
                if (!errorCallback)
                    return errorCallback;
                var newCallback = function (errorMessage) {
                    errorCallback("cuboro.tables.RegionVariantVO." + functionName + " - " + errorMessage);
                };
                return newCallback;
            };
            RegionVariantsTable.prototype.get = function () {
                var u = kr3m.util.Util;
                var whereSql = u.getFirstOfType(arguments, "string", 0, 0) || "1";
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "get");
                var sql = "SELECT * FROM `region_variants` WHERE " + whereSql;
                var ordering = u.getFirstOfType(arguments, "object", 0, 0) || [];
                if (ordering.length > 0)
                    sql += this.buildOrdering(ordering);
                var offset = u.getFirstOfType(arguments, "number", 0, 0) || 0;
                var limit = u.getFirstOfType(arguments, "number", 0, 1) || 0;
                if (limit > 0)
                    sql += db.escape(" LIMIT ?, ?", [offset, limit]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.RegionVariantVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            RegionVariantsTable.prototype.getIterative = function (where, dataCallback, doneCallback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getIterative");
                where = where.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT * FROM `region_variants` WHERE " + where;
                db.queryIterative(sql, function (rows, nextBatch) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.RegionVariantVO).prototype;
                        rows[i].postLoad();
                    }
                    dataCallback(rows, nextBatch);
                }, doneCallback, 20, errorCallback);
            };
            RegionVariantsTable.prototype.updateRaw = function (rows, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "updateRaw");
                db.updateBatch("region_variants", rows, callback, db.defaultBatchSize, "id", errorCallback);
            };
            RegionVariantsTable.prototype.fetchPage = function (where, orderBy, joins, offset, limit, callback) {
                db.fetchPage("region_variants", where, orderBy, joins, offset, limit, function (rows, totalCount) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.RegionVariantVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows, totalCount);
                });
            };
            RegionVariantsTable.prototype.fetchCol = function () {
                var u = kr3m.util.Util;
                var colName = u.getFirstOfType(arguments, "string", 0, 0);
                var whereSql = u.getFirstOfType(arguments, "string", 0, 1) || "1";
                var offset = u.getFirstOfType(arguments, "number", 0, 0) || 0;
                var limit = u.getFirstOfType(arguments, "number", 0, 1) || 0;
                var ordering = u.getFirstOfType(arguments, "object", 0, 1) || [];
                var distinct = u.getFirstOfType(arguments, "boolean", 0, 0) || false;
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchCol");
                if (!this.isColumnName(colName)) {
                    var error = "invalid column name for table region_variants: " + colName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var limitSql = (limit > 0 || offset > 0) ? " LIMIT " + offset + ", " + (offset + limit) : "";
                var orderSql = this.buildOrdering(ordering);
                var distinctSql = distinct ? "DISTINCT " : "";
                var sql = "SELECT " + distinctSql + "`" + colName + "` FROM `region_variants` WHERE " + whereSql + orderSql + limitSql;
                db.fetchCol(sql, callback, errorCallback);
            };
            RegionVariantsTable.prototype.fetchOne = function (colName, whereSql, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchOne");
                if (!this.isColumnName(colName)) {
                    var error = "invalid column name for table region_variants: " + colName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback(undefined);
                }
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT `" + colName + "` FROM `region_variants` WHERE " + whereSql + " LIMIT 1;";
                db.fetchOne(sql, callback, errorCallback);
            };
            RegionVariantsTable.prototype.fetchPairs = function (keyName, valueName, whereSql, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchPairs");
                if (!this.isColumnName(keyName)) {
                    var error = "invalid column name for table region_variants: " + keyName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                if (!this.isColumnName(valueName)) {
                    var error = "invalid column name for table region_variants: " + valueName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                if (keyName == valueName)
                    valueName += "` AS `_" + valueName;
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT `" + keyName + "`, `" + valueName + "` FROM `region_variants` WHERE " + whereSql;
                db.fetchPairs(sql, callback, errorCallback);
            };
            RegionVariantsTable.prototype.deleteWhere = function (where, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "deleteWhere");
                db.deleteBatch("region_variants", where, callback, errorCallback);
            };
            RegionVariantsTable.prototype.getTableName = function () {
                return "region_variants";
            };
            RegionVariantsTable.prototype.getDojo = function (params, callback, conditions, escapeArgs, errorCallback) {
                var _this = this;
                if (conditions === void 0) { conditions = []; }
                if (escapeArgs === void 0) { escapeArgs = []; }
                errorCallback = this.wrapErrorCallback(errorCallback, "getDojo");
                var columnNames = this.getColumnNames();
                var offset = params.start || 0;
                var limit = params.count || 20;
                var sort = params.sort || "id";
                for (var i = 0; i < columnNames.length; ++i) {
                    if (params.hasOwnProperty(columnNames[i]) && params[columnNames[i]]) {
                        conditions.push("`" + columnNames[i] + "` = ?");
                        escapeArgs.push(params[columnNames[i]]);
                    }
                }
                var where = db.escape(conditions.join(" AND "), escapeArgs);
                if (where == "")
                    where = "1";
                var ordering = [];
                if (sort.substring(0, 1) == "-")
                    ordering.push(sort, "ASC");
                else
                    ordering.push(sort, "DESC");
                this.getCount(where, function (count) {
                    _this.get(where, offset, limit, ordering, function (vos) { return callback(new kr3m.dojo.GridQueryResponse(vos, "id", count, "id", sort)); }, errorCallback);
                }, errorCallback);
            };
            RegionVariantsTable.prototype.upsertBatch = function (vos, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "upsertBatch");
                vos = vos.slice();
                var noIdVos = [];
                for (var i = 0; i < vos.length; ++i) {
                    if (!vos[i].id) {
                        noIdVos.push(vos[i]);
                        vos.splice(i--, 1);
                    }
                }
                for (var i = 0; i < vos.length; ++i)
                    vos[i].preStore();
                db.upsertBatch("region_variants", vos, function () {
                    for (var i = 0; i < vos.length; ++i)
                        vos[i].postStore();
                    kr3m.async.Loop.forEach(noIdVos, function (noIdVo, next) {
                        noIdVo.upsert(next);
                    }, function () { return callback && callback(); });
                }, db.defaultBatchSize, null, errorCallback);
            };
            RegionVariantsTable.prototype.updateBatch = function (vos, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "updateBatch");
                for (var i = 0; i < vos.length; ++i) {
                    if (!vos[i].id) {
                        if (errorCallback)
                            return errorCallback("some vos are missing their id attribute in updateBatch call");
                        throw new Error("some vos are missing their id attribute in updateBatch call");
                    }
                }
                for (var i = 0; i < vos.length; ++i)
                    vos[i].preStore();
                db.updateBatch("region_variants", vos, function () {
                    for (var i = 0; i < vos.length; ++i)
                        vos[i].postStore();
                    callback && callback();
                }, db.defaultBatchSize, "id", errorCallback);
            };
            RegionVariantsTable.prototype.insertBatch = function (vos, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "insertBatch");
                vos = vos.slice();
                var noIdVos = [];
                for (var i = 0; i < vos.length; ++i) {
                    if (!vos[i].id) {
                        noIdVos.push(vos[i]);
                        vos.splice(i--, 1);
                    }
                }
                for (var i = 0; i < vos.length; ++i)
                    vos[i].preStore();
                db.insertBatch("region_variants", vos, function () {
                    for (var i = 0; i < vos.length; ++i)
                        vos[i].postStore();
                    kr3m.async.Loop.forEach(noIdVos, function (noIdVo, next) {
                        noIdVo.insert(next);
                    }, function () { return callback && callback(); });
                }, db.defaultBatchSize, errorCallback);
            };
            RegionVariantsTable.prototype.getFreeId = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "getFreeId");
                var id;
                kr3m.async.Loop.loop(function (loopDone) {
                    kr3m.util.Rand.getSecureString(32, null, function (secString) {
                        id = secString;
                        _this.getById(id, function (dummy) { return loopDone(!!dummy); }, errorCallback);
                    });
                }, function () { return callback(id); });
            };
            RegionVariantsTable.prototype.getByIds = function (ids, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getByIds");
                if (ids.length == 0)
                    return callback({});
                var sql = "SELECT * FROM `region_variants` WHERE `id` IN (?)";
                sql = db.escape(sql, [ids]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.RegionVariantVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(kr3m.util.Util.arrayToAssoc(rows, "id"));
                }, errorCallback);
            };
            RegionVariantsTable.prototype.getById = function (id, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getById");
                var sql = "SELECT * FROM `region_variants` WHERE `id` = ? LIMIT 0,1";
                sql = db.escape(sql, [id]);
                db.fetchRow(sql, function (row) {
                    if (!row)
                        return callback(undefined);
                    row.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.RegionVariantVO).prototype;
                    row.postLoad();
                    callback(row);
                }, errorCallback);
            };
            return RegionVariantsTable;
        }());
        tables.RegionVariantsTable = RegionVariantsTable;
    })(tables = cuboro.tables || (cuboro.tables = {}));
})(cuboro || (cuboro = {}));
var tRegionVariants = new cuboro.tables.RegionVariantsTable();
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
    var model;
    (function (model) {
        var Context = (function () {
            function Context() {
                this.customValues = {};
            }
            Context.prototype.need = function (options, callback, errorCallback) {
                callback();
            };
            Context.prototype.setCustomValue = function (name, value) {
                this.customValues[name] = value;
            };
            Context.prototype.getCustomValue = function (name) {
                return this.customValues[name];
            };
            return Context;
        }());
        model.Context = Context;
    })(model = kr3m.model || (kr3m.model = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        net2.HTTP_SUCCESS = 200;
        net2.HTTP_MOVED_PERMANENTLY = 301;
        net2.HTTP_MOVED_TEMPORARILY = 302;
        net2.HTTP_NOT_MODIFIED = 304;
        net2.HTTP_ERROR_INVALID_HTTP_REQUEST = 400;
        net2.HTTP_ERROR_AUTH = 401;
        net2.HTTP_ERROR_DENIED = 403;
        net2.HTTP_ERROR_NOT_FOUND = 404;
        net2.HTTP_ERROR_INTERNAL = 500;
        net2.HTTP_ERROR_CURRENTLY_UNAVAILABLE = 503;
        net2.PORT_HTTP = 80;
        net2.PORT_HTTPS = 443;
        net2.RELAY_PASSWORD = "Hamster";
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
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
    var net2;
    (function (net2) {
        var configs;
        (function (configs) {
            var Localization = (function () {
                function Localization() {
                    this.filePath = "public/xml";
                    this.extension = "xml";
                    this.locales = ["de"];
                    this.fallbackLocale = "de";
                }
                return Localization;
            }());
            configs.Localization = Localization;
        })(configs = net2.configs || (net2.configs = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var localizations;
        (function (localizations) {
            var Abstract = (function (_super) {
                __extends(Abstract, _super);
                function Abstract(config) {
                    var _this = _super.call(this) || this;
                    _this.config = config;
                    _this.formatters = {};
                    return _this;
                }
                Abstract.prototype.setFormatter = function (name, formatter) {
                    this.formatters[name] = formatter;
                };
                Abstract.prototype.getHash = function (context, callback) {
                    var _this = this;
                    context.need({ locales: true }, function () {
                        var locales = kr3m.util.Util.intersect(context.locales, _this.config.locales);
                        var locale = locales[0] || _this.config.locales[0] || _this.config.fallbackLocale;
                        callback(locale);
                    }, function () { return callback(_this.config.fallbackLocale); });
                };
                Abstract.prototype.getLoadOrder = function (context, callback) {
                    var _this = this;
                    this.getHash(context, function (hash) {
                        var locales = [];
                        locales.push(hash);
                        locales.push(hash.slice(0, 2));
                        locales.push(_this.config.fallbackLocale);
                        locales = kr3m.util.Util.removeDuplicates(locales);
                        locales.reverse();
                        callback(locales);
                    });
                };
                return Abstract;
            }(kr3m.model.EventDispatcher));
            localizations.Abstract = Abstract;
        })(localizations = net2.localizations || (net2.localizations = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var async;
    (function (async) {
        var Flags = (function () {
            function Flags() {
                this.flags = {};
                this.metas = [];
                this.setConstraints = {};
                this.clearConstraints = {};
                this.ignored = [];
            }
            Flags.prototype.ignore = function () {
                var names = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    names[_i] = arguments[_i];
                }
                for (var i = 0; i < names.length; ++i) {
                    if (this.ignored.indexOf(names[i]) < 0)
                        this.ignored.push(names[i]);
                }
                for (var i = 0; i < this.metas.length; ++i) {
                    var ignored = kr3m.util.Util.intersect(names, this.metas[i].names);
                    if (ignored.length > 0)
                        this.metas.splice(i--, 1);
                }
            };
            Flags.prototype.unignore = function () {
                var names = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    names[_i] = arguments[_i];
                }
                this.ignored = this.ignored.filter(function (name) { return names.indexOf(name) < 0; });
            };
            Flags.prototype.getSet = function () {
                var _this = this;
                var names = Object.keys(this.flags);
                names = names.filter(function (name) { return _this.flags[name]; });
                return names;
            };
            Flags.prototype.isSet = function (name) {
                return this.flags[name] || false;
            };
            Flags.prototype.forEach = function (func) {
                var _this = this;
                var names = Object.keys(this.flags);
                names = names.filter(function (name) { return _this.flags[name]; });
                for (var i = 0; i < names.length; ++i)
                    func(names[i]);
            };
            Flags.prototype.areSet = function () {
                var names = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    names[_i] = arguments[_i];
                }
                for (var i = 0; i < names.length; ++i) {
                    if (!this.flags[names[i]])
                        return false;
                }
                return true;
            };
            Flags.prototype.onSet = function (names, listener) {
                if (typeof names == "string")
                    names = [names];
                var ignored = kr3m.util.Util.intersect(names, this.ignored);
                if (ignored.length > 0)
                    return;
                var hasAll = true;
                for (var i = 0; i < names.length; ++i) {
                    if (!this.flags[names[i]]) {
                        hasAll = false;
                        break;
                    }
                }
                if (hasAll)
                    listener();
                var item = {
                    names: typeof names == "string" ? [names] : names,
                    isOnce: false,
                    isClear: false,
                    listener: listener
                };
                this.metas.push(item);
            };
            Flags.prototype.onceSet = function (names, listener) {
                if (typeof names == "string")
                    names = [names];
                var ignored = kr3m.util.Util.intersect(names, this.ignored);
                if (ignored.length > 0)
                    return;
                var hasAll = true;
                for (var i = 0; i < names.length; ++i) {
                    if (!this.flags[names[i]]) {
                        hasAll = false;
                        break;
                    }
                }
                if (hasAll)
                    return listener();
                var item = {
                    names: typeof names == "string" ? [names] : names,
                    isOnce: true,
                    isClear: false,
                    listener: listener
                };
                this.metas.push(item);
            };
            Flags.prototype.offSet = function (names, listener) {
                if (typeof names == "string")
                    names = [names];
                for (var i = 0; i < this.metas.length; ++i) {
                    if (!this.metas[i].isClear) {
                        var inter = kr3m.util.Util.intersect(this.metas[i].names, names);
                        if (inter.length == names.length) {
                            if (!listener || listener == this.metas[i].listener)
                                this.metas.splice(i--, 1);
                        }
                    }
                }
            };
            Flags.prototype.onClear = function (names, listener) {
                if (typeof names == "string")
                    names = [names];
                var item = {
                    names: typeof names == "string" ? [names] : names,
                    isOnce: false,
                    isClear: true,
                    listener: listener
                };
                this.metas.push(item);
            };
            Flags.prototype.onceClear = function (names, listener) {
                if (typeof names == "string")
                    names = [names];
                var item = {
                    names: typeof names == "string" ? [names] : names,
                    isOnce: true,
                    isClear: true,
                    listener: listener
                };
                this.metas.push(item);
            };
            Flags.prototype.offClear = function (names, listener) {
                if (typeof names == "string")
                    names = [names];
                for (var i = 0; i < this.metas.length; ++i) {
                    if (this.metas[i].isClear) {
                        var inter = kr3m.util.Util.intersect(this.metas[i].names, names);
                        if (inter.length == names.length) {
                            if (!listener || listener == this.metas[i].listener)
                                this.metas.splice(i--, 1);
                        }
                    }
                }
            };
            Flags.prototype.dispatch = function (setNames, clearedNames) {
                var allSetNames;
                for (var i = 0; i < this.metas.length; ++i) {
                    var names = this.metas[i].isClear ? clearedNames : setNames;
                    var inter = kr3m.util.Util.intersect(this.metas[i].names, names);
                    if (inter.length > 0) {
                        allSetNames = allSetNames || this.getSet();
                        inter = kr3m.util.Util.intersect(this.metas[i].names, allSetNames);
                        if (inter.length == this.metas[i].names.length) {
                            this.metas[i].listener();
                            if (this.metas[i].isOnce)
                                this.metas.splice(i--, 1);
                        }
                    }
                }
            };
            Flags.prototype.set = function () {
                var names = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    names[_i] = arguments[_i];
                }
                var setNames = [];
                for (var i = 0; i < names.length; ++i) {
                    if (!this.flags[names[i]])
                        setNames.push(names[i]);
                    this.flags[names[i]] = true;
                }
                var runLoop = true;
                while (runLoop) {
                    runLoop = false;
                    for (var name in this.setConstraints) {
                        if (!this.flags[name]) {
                            var inter = kr3m.util.Util.intersect(this.setConstraints[name], setNames);
                            if (inter.length > 0) {
                                for (var i = 0; i < this.setConstraints[name].length; ++i) {
                                    if (!this.flags[this.setConstraints[name][i]])
                                        break;
                                }
                                if (i >= this.setConstraints[name].length) {
                                    this.flags[name] = true;
                                    setNames.push(name);
                                    runLoop = true;
                                }
                            }
                        }
                    }
                }
                this.dispatch(setNames, []);
            };
            Flags.prototype.clear = function () {
                var names = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    names[_i] = arguments[_i];
                }
                var clearedNames = [];
                for (var i = 0; i < names.length; ++i) {
                    if (this.flags[names[i]])
                        clearedNames.push(names[i]);
                    this.flags[names[i]] = false;
                }
                var runLoop = true;
                while (runLoop) {
                    runLoop = false;
                    for (var name in this.clearConstraints) {
                        if (this.flags[name]) {
                            var inter = kr3m.util.Util.intersect(this.clearConstraints[name], clearedNames);
                            if (inter.length > 0) {
                                this.flags[name] = false;
                                clearedNames.push(name);
                                runLoop = true;
                            }
                        }
                    }
                }
                this.dispatch([], clearedNames);
            };
            Flags.prototype.clearAll = function () {
                var _this = this;
                var names = Object.keys(this.flags);
                names = names.filter(function (name) { return _this.flags[name]; });
                this.clear.apply(this, names);
            };
            Flags.prototype.addSetConstraint = function (name, otherNames, addClearConstraint) {
                if (addClearConstraint === void 0) { addClearConstraint = false; }
                this.setConstraints[name] = otherNames;
                if (addClearConstraint)
                    this.addClearConstraint(name, otherNames);
            };
            Flags.prototype.addClearConstraint = function (name, otherNames) {
                this.clearConstraints[name] = otherNames;
            };
            return Flags;
        }());
        async.Flags = Flags;
    })(async = kr3m.async || (kr3m.async = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var Cookie = (function () {
            function Cookie(name, value, expires, isHttpOnly) {
                if (isHttpOnly === void 0) { isHttpOnly = false; }
                this.name = name;
                this.value = value;
                this.expires = expires;
                this.isHttpOnly = isHttpOnly;
            }
            Cookie.prototype.toString = function () {
                var result = this.name + "=" + encodeURIComponent(this.value) + "; Path=/";
                if (this.expires)
                    result += "; Expires=" + this.expires.toUTCString();
                if (this.isHttpOnly)
                    result += "; HttpOnly";
                return result;
            };
            return Cookie;
        }());
        net2.Cookie = Cookie;
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var Headers = (function () {
            function Headers() {
                this.data = {};
            }
            Headers.prototype.set = function (name, value) {
                if (Headers.DUPLICATES.indexOf(name) < 0) {
                    this.data[name] = value;
                    return;
                }
                if (this.data[name] === undefined)
                    this.data[name] = value;
                else if (typeof this.data[name] == "string")
                    this.data[name] = [this.data[name], value];
                else
                    this.data[name].push(value);
            };
            Headers.prototype.setRaw = function (raw) {
                for (var name in raw)
                    this.set(name, raw[name]);
            };
            Headers.prototype.get = function (name) {
                if (this.data[name] === undefined)
                    return undefined;
                return typeof this.data[name] == "string" ? this.data[name] : this.data[name][0];
            };
            Headers.prototype.getRaw = function () {
                return this.data;
            };
            Headers.prototype["delete"] = function (name) {
                delete this.data[name];
            };
            Headers.prototype.forEach = function (func) {
                for (var name in this.data) {
                    if (typeof this.data[name] == "string") {
                        func(name, this.data[name]);
                    }
                    else {
                        for (var i = 0; i < this.data[name].length; ++i)
                            func(name, this.data[name][i]);
                    }
                }
            };
            Headers.DUPLICATES = ["Set-Cookie"];
            return Headers;
        }());
        net2.Headers = Headers;
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var UploadedFile = (function () {
            function UploadedFile() {
            }
            UploadedFile.prototype.saveAs = function (filePath, callback) {
                fsLib.writeFile(filePath, this.data, function (err) { return callback && callback(!err); });
            };
            UploadedFile.prototype.saveIn = function (directoryPath, callback) {
                var filePath = directoryPath + "/" + this.fileName;
                filePath = filePath.replace(/[\/\\]+/g, "/");
                fsLib.writeFile(filePath, this.data, function (err) { return callback && callback(!err); });
            };
            return UploadedFile;
        }());
        net2.UploadedFile = UploadedFile;
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var Binary = (function () {
            function Binary() {
            }
            Binary.indexOf = function (needle, haystack, offset) {
                if (offset === void 0) { offset = 0; }
                if (!needle || !haystack)
                    return -1;
                while (offset + needle.length <= haystack.length) {
                    for (var i = 0; i < needle.length; ++i) {
                        if (needle[i] != haystack[offset + i])
                            break;
                    }
                    if (i >= needle.length)
                        return offset;
                    ++offset;
                }
                return -1;
            };
            Binary.getNextSplitPart = function (buffer, seperator, offset) {
                if (offset === void 0) { offset = 0; }
                if (!buffer || buffer.length == 0 || !seperator || seperator.length == 0)
                    return null;
                var pos = Binary.indexOf(seperator, buffer, offset);
                if (pos == -1) {
                    if (offset < buffer.length)
                        return buffer.slice(offset);
                    else
                        return null;
                }
                return buffer.slice(offset, pos);
            };
            Binary.split = function (buffer, seperator) {
                var result = [];
                var offset = 0;
                var pos = offset;
                while (true) {
                    pos = Binary.indexOf(seperator, buffer, offset);
                    if (pos > -1) {
                        if (pos > offset)
                            result.push(buffer.slice(offset, pos));
                        offset = pos + seperator.length;
                        pos = offset;
                    }
                    else {
                        break;
                    }
                }
                if (offset < buffer.length)
                    result.push(buffer.slice(offset));
                return result;
            };
            return Binary;
        }());
        util.Binary = Binary;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var Device = (function () {
            function Device(globals) {
                globals = globals || {};
                this.checkOS(globals);
                this.checkBrowser(globals);
                this.checkDevice(globals);
                this.checkTablet(globals);
                this.mobile = !this.desktop && !this.tablet;
            }
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
    var net2;
    (function (net2) {
        var Request = (function () {
            function Request(rawRequest) {
                var _this = this;
                this.rawRequest = rawRequest;
                this.flags = new kr3m.async.Flags();
                this.flags.onceSet("parseMessageParts", function () { return _this.parseMessageParts(); });
            }
            Request.prototype.getUserIp = function () {
                if (this.rawRequest.headers["x-real-ip"])
                    return this.rawRequest.headers["x-real-ip"];
                if (this.rawRequest.headers["x-forwarded-for"])
                    return this.rawRequest.headers["x-forwarded-for"].split(/\s*,\s*/)[0];
                if (this.rawRequest.connection.remoteAddress)
                    return this.rawRequest.connection.remoteAddress;
                if (this.rawRequest.socket.remoteAddress)
                    return this.rawRequest.socket.remoteAddress;
                if (this.rawRequest.connection.socket && this.rawRequest.connection.socket.remoteAddress)
                    return this.rawRequest.connection.socket.remoteAddress;
                logError("could not determine user ip address");
                return undefined;
            };
            Request.prototype.getMethod = function () {
                return this.rawRequest.method;
            };
            Request.prototype.getRaw = function () {
                return this.rawRequest;
            };
            Request.prototype.getBinaryContent = function (callback) {
                var _this = this;
                if (this.content)
                    return callback(this.content);
                var content;
                this.rawRequest.on("data", function (data) { return content = content ? Buffer.concat([content, data]) : data; });
                this.rawRequest.on("end", function () {
                    _this.content = content;
                    callback(_this.content);
                });
            };
            Request.prototype.getContent = function (callback) {
                this.getBinaryContent(function (content) {
                    callback(content ? content.toString("utf-8") : "");
                });
            };
            Request.prototype.parsePartHeaders = function (part) {
                var lineSeperator = Buffer.from("\r\n");
                var valueSeperator = Buffer.from(":");
                var headers = new net2.Headers();
                var content;
                var offset = 0;
                while (true) {
                    var line = kr3m.util.Binary.getNextSplitPart(part, lineSeperator, offset);
                    if (!line)
                        break;
                    offset += line.length + lineSeperator.length;
                    var parts = kr3m.util.Binary.split(line, valueSeperator);
                    if (parts && parts.length >= 2) {
                        var field = parts[0].toString();
                        var value = "";
                        for (var i = 1; i < parts.length; ++i)
                            value += parts[i].toString();
                        headers[field] = value.trim();
                    }
                    else {
                        content = part.slice(offset);
                        break;
                    }
                }
                return [headers, content];
            };
            Request.prototype.getContentParts = function (dataCallback, callback) {
                var _this = this;
                var contentType = this.rawRequest.headers["content-type"] || "";
                if (!contentType)
                    return callback && callback();
                this.getBinaryContent(function (content) {
                    var matches = contentType.match(/multipart\/form\-data; boundary=(\S+)/);
                    if (matches) {
                        var seperator = Buffer.from("--" + matches[1]);
                        var parts = kr3m.util.Binary.split(content, seperator);
                        for (var i = 0; i < parts.length; ++i) {
                            if (i < parts.length - 1)
                                var part = parts[i].slice(2, parts[i].length - 2);
                            else
                                var part = parts[i].slice(2);
                            var _a = _this.parsePartHeaders(part), headers = _a[0], content = _a[1];
                            dataCallback(headers, content);
                        }
                    }
                    else {
                        dataCallback(new net2.Headers(), content);
                    }
                    callback && callback();
                });
            };
            Request.prototype.parseMessageParts = function () {
                var _this = this;
                this.formValues = {};
                var uploadedFiles = [];
                this.getContentParts(function (partHeaders, partContent) {
                    var disposition = partHeaders["Content-Disposition"] || "";
                    var matchesFile = disposition.match(/form-data; name="(.*?)"; filename="(.*?)"/);
                    if (matchesFile) {
                        var file = new net2.UploadedFile();
                        file.fileName = kr3m.util.File.getFilenameFromPath(matchesFile[2]);
                        file.inputName = matchesFile[1];
                        file.data = partContent;
                        file.mimeType = partHeaders["Content-Type"];
                        uploadedFiles.push(file);
                        return;
                    }
                    var matchesInput = disposition.match(/form-data; name="(.*?)"/);
                    if (matchesInput) {
                        _this.formValues[matchesInput[1]] = partContent.toString("utf8");
                        return;
                    }
                    var contentType = _this.rawRequest.headers["content-type"] || "";
                    var matchesForm = contentType.match(/application\/x\-www\-form\-urlencoded(?:; charset=(\S+))?/);
                    if (matchesForm) {
                        var encoding = matchesForm[1] || "ascii";
                        var values = kr3m.util.StringEx.splitAssoc(partContent.toString(encoding), "&", "=", decodeURIComponent);
                        for (var name in values)
                            _this.formValues[name] = values[name];
                        return;
                    }
                    logWarning("unhandled request part content");
                    debug("partHeaders", partHeaders);
                    debug("partContent", partContent.toString());
                    debug("request.headers", _this.rawRequest.headers);
                }, function () {
                    _this.uploadedFiles = uploadedFiles;
                    _this.flags.set("uploadedFiles", "formValues");
                });
            };
            Request.prototype.getUploadedFiles = function (callback) {
                var _this = this;
                this.flags.onceSet("uploadedFiles", function () { return callback(_this.uploadedFiles); });
                this.flags.set("parseMessageParts");
            };
            Request.prototype.getFormValues = function (callback) {
                var _this = this;
                this.flags.onceSet("formValues", function () { return callback(_this.formValues); });
                this.flags.set("parseMessageParts");
            };
            Request.prototype.isSecure = function () {
                return this.rawRequest.socket.encrypted;
            };
            Request.prototype.getHeader = function (name) {
                return this.rawRequest.headers[name];
            };
            Request.prototype.getHeaders = function () {
                var headers = new net2.Headers();
                headers.setRaw(this.rawRequest.headers);
                return headers;
            };
            Request.prototype.getCookies = function () {
                if (this.cookies)
                    return this.cookies;
                this.cookies = {};
                var rawCookies = this.rawRequest.headers["cookie"] || "";
                var rawCookieValues = kr3m.util.StringEx.splitAssoc(rawCookies, "; ", "=");
                for (var name in rawCookieValues)
                    this.cookies[name] = new net2.Cookie(name, rawCookieValues[name]);
                return this.cookies;
            };
            Request.prototype.getCookie = function (name) {
                return this.getCookies()[name];
            };
            Request.prototype.getCookieValue = function (name) {
                var cookie = this.getCookie(name);
                return cookie ? cookie.value : undefined;
            };
            Request.prototype.getIfModified = function () {
                var rawText = this.rawRequest.headers["if-modified-since"];
                return rawText ? new Date(rawText) : undefined;
            };
            Request.prototype.getUri = function () {
                var uri = urlLib.parse(this.rawRequest.url).pathname;
                uri = decodeURIComponent(uri);
                uri = uri.replace(/\/\/+/g, "/").replace(/\.\.+/g, ".");
                uri = kr3m.util.StringEx.getBefore(uri, "#");
                uri = kr3m.util.StringEx.getBefore(uri, "?");
                return uri;
            };
            Request.prototype.getLocation = function () {
                var isSecure = this.isSecure();
                var url = isSecure ? "https://" : "http://";
                url += this.getHost();
                var port = this.getPortSuffix();
                if (port)
                    url += ":" + port;
                url += this.getUri();
                var query = this.getQueryText();
                if (query)
                    url += "?" + query;
                return url;
            };
            Request.prototype.getQueryText = function () {
                var query = kr3m.util.StringEx.getAfter(this.rawRequest.url, "?");
                return (query == this.rawRequest.url) ? "" : query;
            };
            Request.prototype.getQueryValues = function () {
                var text = this.getQueryText();
                var values = kr3m.util.StringEx.splitAssoc(text);
                for (var name in values)
                    values[name] = decodeURIComponent(values[name]);
                return values;
            };
            Request.prototype.getQueryValue = function (name) {
                return this.getQueryValues()[name];
            };
            Request.prototype.getReferer = function () {
                if (!this.rawRequest.headers.referer)
                    return "";
                var parts = urlLib.parse(this.rawRequest.headers.referer);
                return parts.hostname;
            };
            Request.prototype.getOrigin = function () {
                return this.rawRequest.headers.origin || "";
            };
            Request.prototype.getHost = function () {
                if (!this.rawRequest.headers.host)
                    return "";
                return this.rawRequest.headers.host.replace(/:\d+/, "");
            };
            Request.prototype.getPort = function () {
                return this.rawRequest.socket.localPort;
            };
            Request.prototype.getPortSuffix = function () {
                if (!this.rawRequest.headers.host)
                    return "";
                return this.rawRequest.headers.host.replace(/\D/g, "");
            };
            Request.prototype.getUserAgent = function () {
                return this.rawRequest.headers["user-agent"] || "";
            };
            Request.prototype.getLocales = function () {
                var languageHeader = this.rawRequest.headers["accept-language"];
                if (!languageHeader)
                    return [];
                var locales = kr3m.util.StringEx.captureNamedGlobal(languageHeader, /\b([a-z][a-z])[_-]?([A-Z][A-Z])?\b/g, ["languageId", "countryId"]);
                return locales.map(function (locale) { return locale.languageId + (locale.countryId || ""); });
            };
            Request.prototype.getLanguages = function () {
                var locales = this.getLocales();
                var languageIds = locales.map(function (locale) { return locale.slice(0, 2); });
                languageIds = kr3m.util.Util.removeDuplicates(languageIds);
                return languageIds;
            };
            Request.prototype.getDevice = function () {
                if (this.device)
                    return this.device;
                var globals = {
                    document: {
                        documentElement: {},
                        createElement: function (tag) { return null; }
                    },
                    localStorage: {},
                    navigator: {
                        userAgent: this.getUserAgent()
                    },
                    window: {}
                };
                this.device = new kr3m.util.Device(globals);
                return this.device;
            };
            return Request;
        }());
        net2.Request = Request;
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
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
    var net2;
    (function (net2) {
        var Response = (function () {
            function Response(rawResponse) {
                this.rawResponse = rawResponse;
                this.isFlushed = false;
                this.headers = new net2.Headers();
                this.cookies = {};
            }
            Response.prototype.setHeader = function (name, value) {
                this.headers.set(name, value);
            };
            Response.prototype.setHeaders = function (headers) {
                var _this = this;
                headers.forEach(function (name, value) { return _this.headers.set(name, value); });
            };
            Response.prototype.getHeaders = function () {
                var headers = new net2.Headers();
                this.headers.forEach(function (name, value) { return headers.set(name, value); });
                return headers;
            };
            Response.prototype.setContent = function (data, mimeType, encoding) {
                if (mimeType === void 0) { mimeType = "text/plain; charset=utf-8"; }
                if (encoding === void 0) { encoding = "utf8"; }
                this.data = data;
                this.encoding = encoding;
                this.headers.set("Content-Type", mimeType);
            };
            Response.prototype.setCookie = function (name, value, expires, isHttpOnly) {
                if (isHttpOnly === void 0) { isHttpOnly = false; }
                this.cookies[name] = new net2.Cookie(name, value, expires, isHttpOnly);
            };
            Response.prototype.getCookie = function (name) {
                return this.cookies[name];
            };
            Response.prototype.getCookieValue = function (name) {
                return this.cookies[name] ? this.cookies[name].value : undefined;
            };
            Response.prototype.disableBrowserCaching = function () {
                this.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
                this.headers.set("Expires", "0");
                this.headers.set("Pragma", "no-cache");
                this.headers["delete"]("ETag");
                this.headers["delete"]("Last-Modified");
            };
            Response.prototype.cacheUntil = function (date) {
                this.headers.set("Cache-Control", "public");
                this.headers.set("Expires", date.toUTCString());
                this.headers["delete"]("Pragma");
            };
            Response.prototype.cacheFor = function (duration) {
                var date = new Date(Date.now() + duration);
                this.cacheUntil(date);
                this.headers.set("Cache-Control", "max-age=" + Math.floor(duration / 1000));
            };
            Response.prototype.setLastModified = function (date) {
                this.headers.set("Last-Modified", date.toUTCString());
            };
            Response.prototype.tag = function (tagContent, isWeak) {
                if (isWeak === void 0) { isWeak = false; }
                this.headers.set("ETag", (isWeak ? "W/" : "") + "\"" + tagContent.replace(/"/g, "\\\"") + "\"");
            };
            Response.prototype.redirect = function (newLocation, isPermanent) {
                if (isPermanent === void 0) { isPermanent = false; }
                this.headers.set("Location", newLocation);
                this.flush(isPermanent ? net2.HTTP_MOVED_PERMANENTLY : net2.HTTP_MOVED_TEMPORARILY);
            };
            Response.prototype.addAccessControl = function (originUrl, isVarying) {
                if (originUrl === void 0) { originUrl = "*"; }
                if (isVarying === void 0) { isVarying = false; }
                if (originUrl != "*") {
                    var urlObj = kr3m.util.Url.parse(originUrl);
                    originUrl = urlObj.protocol + "://" + urlObj.domain;
                }
                this.headers.set("Access-Control-Allow-Origin", originUrl);
                if (isVarying)
                    this.headers.set("Vary", "Origin");
            };
            Response.prototype.flush = function (httpCode) {
                if (httpCode === void 0) { httpCode = net2.HTTP_SUCCESS; }
                if (this.isFlushed) {
                    logError("flushing flushed response");
                    kr3m.util.Log.logStackTrace(true);
                    return;
                }
                this.isFlushed = true;
                var cookieHeaders = [];
                for (var cookieName in this.cookies)
                    cookieHeaders.push(this.cookies[cookieName].toString());
                if (cookieHeaders.length > 0)
                    this.rawResponse.setHeader("Set-Cookie", cookieHeaders);
                this.rawResponse.writeHead(httpCode, this.headers.getRaw());
                if (this.data)
                    this.rawResponse.write(this.data, this.encoding);
                this.rawResponse.end();
            };
            return Response;
        }());
        net2.Response = Response;
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var routers;
        (function (routers) {
            var Abstract = (function () {
                function Abstract() {
                }
                return Abstract;
            }());
            routers.Abstract = Abstract;
        })(routers = net2.routers || (net2.routers = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var Session = (function (_super) {
            __extends(Session, _super);
            function Session(id, lastUpdated, values) {
                if (lastUpdated === void 0) { lastUpdated = 0; }
                if (values === void 0) { values = {}; }
                var _this = _super.call(this) || this;
                _this.id = id;
                _this.lastUpdated = lastUpdated;
                _this.values = values;
                _this.dirty = false;
                _this.released = false;
                return _this;
            }
            Session.prototype.setDirty = function () {
                this.dirty = true;
                this.dispatch(Session.EVENT_DIRTY);
            };
            Session.prototype.isDirty = function () {
                return this.dirty;
            };
            Session.prototype.release = function () {
                this.released = true;
                this.dispatch(Session.EVENT_RELEASE);
            };
            Session.prototype.isReleased = function () {
                return this.released;
            };
            Session.prototype.getValue = function (name) {
                return this.values[name];
            };
            Session.prototype.getValuesJson = function () {
                return kr3m.util.Json.encode(this.values);
            };
            Session.prototype.setValue = function (name, value) {
                this.values[name] = value;
                this.dispatch(Session.EVENT_SET);
                this.setDirty();
            };
            Session.prototype.deleteValue = function (name) {
                delete this.values[name];
                this.dispatch(Session.EVENT_DELETE);
                this.setDirty();
            };
            Session.prototype.getExpiry = function () {
                return new Date(this.lastUpdated + Session.timeToLive);
            };
            Session.EVENT_DELETE = "delete";
            Session.EVENT_DESTROY = "destroy";
            Session.EVENT_DIRTY = "dirty";
            Session.EVENT_SET = "set";
            Session.EVENT_RELEASE = "release";
            Session.timeToLive = 60 * 60 * 1000;
            return Session;
        }(kr3m.model.EventDispatcher));
        net2.Session = Session;
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var sessionmanagers;
        (function (sessionmanagers) {
            var Abstract = (function () {
                function Abstract() {
                }
                return Abstract;
            }());
            sessionmanagers.Abstract = Abstract;
        })(sessionmanagers = net2.sessionmanagers || (net2.sessionmanagers = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var Context = (function (_super) {
            __extends(Context, _super);
            function Context(rawRequest, rawResponse, config, router, localization, sessionManager) {
                var _this = _super.call(this) || this;
                _this.environment = {};
                _this.documentRoot = "public";
                _this.request = new net2.Request(rawRequest);
                _this.response = new net2.Response(rawResponse);
                _this.config = config;
                _this.router = router;
                _this.localization = localization;
                _this.sessionManager = sessionManager;
                return _this;
            }
            Context.prototype.getCurrentUri = function () {
                return this.currentUri ? this.currentUri : this.request.getUri();
            };
            Context.prototype.getLoc = function (callback) {
                this.localization.getLoc(this, callback);
            };
            Context.prototype.getSyncParseFunc = function (callback) {
                this.localization.getSyncParseFunc(this, callback);
            };
            Context.prototype.setRedirectHandler = function (handler) {
                this.redirectHandler = handler;
            };
            Context.prototype.setCurrentUri = function (uri) {
                this.currentUri = uri;
            };
            Context.prototype.redirect = function (toUri) {
                this.currentUri = toUri;
                if (this.redirectHandler)
                    this.redirectHandler();
                else
                    logError("redirecting to", toUri, "but no redirect handler is set");
            };
            Context.prototype.need = function (options, callback, errorCallback) {
                var _this = this;
                _super.prototype.need.call(this, options, function () {
                    _this.checkLocales(options, function () {
                        _this.checkSession(options, function () {
                            callback();
                        }, errorCallback);
                    }, errorCallback);
                }, errorCallback);
            };
            Context.prototype.checkLocales = function (options, callback, errorCallback) {
                if (!options.locales)
                    return callback();
                if (this.locales)
                    return callback();
                var locales = this.request.getLocales();
                if (locales.length > 0) {
                    this.locales = locales;
                    return callback();
                }
                errorCallback && errorCallback("locales");
            };
            Context.prototype.checkSession = function (options, callback, errorCallback) {
                var _this = this;
                if (!options.session)
                    return callback();
                if (this.session)
                    return callback();
                if (!this.sessionManager)
                    return errorCallback && errorCallback("session");
                this.sessionManager.get(this, function (session) {
                    if (!session)
                        return errorCallback && errorCallback("session");
                    _this.session = session;
                    callback();
                });
            };
            Context.prototype.redirectToError = function () {
                this.redirect("/error.html");
            };
            Context.prototype.setError = function (httpCode, callback, content, mimeType, encoding) {
                if (encoding === void 0) { encoding = "utf8"; }
                this.setRedirectHandler(callback);
                this.error = null;
                this.flush(httpCode, content, mimeType, encoding);
            };
            Context.prototype.flush = function (httpCode, content, mimeType, encoding) {
                var _this = this;
                if (httpCode === void 0) { httpCode = net2.HTTP_SUCCESS; }
                if (encoding === void 0) { encoding = "utf8"; }
                kr3m.async.If.then(this.session, function (thenDone) { return _this.sessionManager.release(_this, _this.session, thenDone); }, function () {
                    if ((httpCode < 200 || httpCode >= 400) && !_this.error) {
                        _this.error = { httpCode: httpCode, content: content, mimeType: mimeType, encoding: encoding };
                        return _this.redirectToError();
                    }
                    if (content) {
                        if (typeof content == "string") {
                            mimeType = mimeType || "text/plain; charset=utf-8";
                        }
                        else if (content instanceof Buffer) {
                            mimeType = mimeType || "application/octet-stream";
                        }
                        else {
                            content = kr3m.util.Json.encode(content);
                            mimeType = mimeType || "application/json; charset=utf-8";
                        }
                        _this.response.setContent(content, mimeType, encoding);
                    }
                    _this.response.flush(_this.error ? _this.error.httpCode : httpCode);
                });
            };
            return Context;
        }(kr3m.model.Context));
        net2.Context = Context;
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var cuboro;
(function (cuboro) {
    var Context = (function (_super) {
        __extends(Context, _super);
        function Context() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Context.prototype.need = function (options, callback, errorCallback) {
            var _this = this;
            this.checkRegionVariant(options, function () {
                _super.prototype.need.call(_this, options, callback, errorCallback);
            }, errorCallback);
        };
        Context.prototype.checkRegionVariant = function (options, callback, errorCallback) {
            var _this = this;
            if (!options.region)
                return callback();
            if (this.region)
                return callback();
            var domainName = this.request.getHost() || this.request.getOrigin() || this.request.getReferer();
            tRegionDomains.getByName(domainName, function (domain) {
                var regionId = domain ? domain.regionId : "MAIN";
                tRegionVariants.getById(regionId, function (region) {
                    if (!region)
                        return errorCallback && errorCallback("region");
                    _this.region = region;
                    return callback();
                });
            });
        };
        return Context;
    }(kr3m.net2.Context));
    cuboro.Context = Context;
})(cuboro || (cuboro = {}));
var kr3m;
(function (kr3m) {
    var csv;
    (function (csv_1) {
        var Generator = (function () {
            function Generator() {
                this.seperator = ";";
                this.quotation = "\"";
                this.newLine = "\n";
                this.writeHeaders = true;
                this.quoteAll = false;
                this.hiddenColumns = [];
            }
            Generator.prototype.collectKeys = function () {
                this.keys = [];
                for (var i = 0; i < this.json.length; ++i)
                    this.keys = kr3m.util.Util.merge(this.keys, Object.keys(this.json[i]));
                this.keys = kr3m.util.Util.difference(this.keys, this.hiddenColumns);
            };
            Generator.prototype.escape = function (value) {
                var text = (value !== undefined && value !== null) ? value.toString() : "";
                var quote = this.quoteAll
                    || text.indexOf(this.seperator) >= 0
                    || text.indexOf(this.quotation) >= 0
                    || text.indexOf(this.newLine) >= 0;
                if (quote) {
                    var reg = new RegExp(this.quotation, "g");
                    text = text.replace(reg, this.quotation + this.quotation);
                    text = this.quotation + text + this.quotation;
                }
                return text;
            };
            Generator.prototype.generate = function (json) {
                this.json = json;
                var csv = "";
                this.collectKeys();
                if (this.writeHeaders) {
                    var parts = [];
                    for (var j = 0; j < this.keys.length; ++j)
                        parts.push(this.escape(this.keys[j]));
                    csv += parts.join(this.seperator) + this.newLine;
                }
                for (var i = 0; i < json.length; ++i) {
                    var parts = [];
                    for (var j = 0; j < this.keys.length; ++j)
                        parts.push(this.escape(json[i][this.keys[j]]));
                    csv += parts.join(this.seperator) + this.newLine;
                }
                return csv;
            };
            return Generator;
        }());
        csv_1.Generator = Generator;
        function generateString(json, options) {
            var generator = new Generator();
            if (options) {
                generator.hiddenColumns = options.hiddenColumns || generator.hiddenColumns;
            }
            return generator.generate(json);
        }
        csv_1.generateString = generateString;
        function generateLocalFile(path, json, callback) {
            var encoded = kr3m.util.StringEx.BOM + generateString(json);
            kr3m.util.File.createFileFolder(path, function (success) {
                if (!success)
                    return callback(false);
                fsLib.writeFile(path, encoded, { encoding: "utf8" }, function (err) {
                    if (err)
                        logError(err);
                    callback(!err);
                });
            });
        }
        csv_1.generateLocalFile = generateLocalFile;
        function appendToLocalFile(path, json, callback) {
            var generator = new Generator();
            generator.writeHeaders = false;
            var encoded = generator.generate(json);
            fsLib.appendFile(path, encoded, { encoding: "utf8" }, function (err) {
                if (err)
                    logError(err);
                callback(!err);
            });
        }
        csv_1.appendToLocalFile = appendToLocalFile;
    })(csv = kr3m.csv || (kr3m.csv = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var db;
    (function (db) {
        var Database = (function () {
            function Database(config) {
                this.config = config;
            }
            return Database;
        }());
        db.Database = Database;
    })(db = kr3m.db || (kr3m.db = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var db;
    (function (db) {
        var MapReduceWorkset = (function () {
            function MapReduceWorkset() {
                this.data = {};
                this.emitMap = this.emitMapFunc.bind(this);
                this.emitReduce = this.emitReduceFunc.bind(this);
            }
            MapReduceWorkset.prototype.emitMapFunc = function (key, item) {
                if (typeof this.data[key] == "undefined")
                    this.data[key] = { mappedItems: [], reducedItems: [] };
                this.data[key].mappedItems.push(item);
            };
            MapReduceWorkset.prototype.emitReduceFunc = function (key, item) {
                this.data[key].reducedItems.push(item);
            };
            MapReduceWorkset.prototype.map = function (rawData, mapFunc) {
                for (var i = 0; i < rawData.length; ++i)
                    mapFunc(rawData[i], this.emitMap);
            };
            MapReduceWorkset.prototype.mapSimple = function (rawData, mapFunc) {
                for (var i = 0; i < rawData.length; ++i) {
                    var _a = mapFunc(rawData[i]), key = _a[0], mappedItem = _a[1];
                    if (typeof this.data[key] == "undefined")
                        this.data[key] = { mappedItems: [], reducedItems: [] };
                    this.data[key].mappedItems.push(mappedItem);
                }
            };
            MapReduceWorkset.prototype.mapAsync = function (rawData, mapFunc, callback) {
                var _this = this;
                kr3m.async.Loop.forEach(rawData, function (rawItem, loopCallback) {
                    mapFunc(rawItem, _this.emitMap, loopCallback);
                }, callback);
            };
            MapReduceWorkset.prototype.reduce = function (reduceFunc) {
                for (var i in this.data) {
                    if (this.data[i].mappedItems.length > 0) {
                        reduceFunc(i, this.data[i].mappedItems, this.emitReduce);
                        if (this.data[i].reducedItems.length > 1) {
                            this.data[i].mappedItems = this.data[i].reducedItems;
                            this.data[i].reducedItems = [];
                            reduceFunc(i, this.data[i].mappedItems, this.emitReduce);
                        }
                        this.data[i].mappedItems = [];
                    }
                }
            };
            MapReduceWorkset.prototype.reduceSimple = function (reduceFunc) {
                for (var i in this.data) {
                    if (this.data[i].mappedItems.length > 0) {
                        this.data[i].reducedItems.push(reduceFunc(i, this.data[i].mappedItems));
                        if (this.data[i].reducedItems.length > 1) {
                            this.data[i].mappedItems = this.data[i].reducedItems;
                            this.data[i].reducedItems = [];
                            this.data[i].reducedItems.push(reduceFunc(i, this.data[i].mappedItems));
                        }
                        this.data[i].mappedItems = [];
                    }
                }
            };
            MapReduceWorkset.prototype.reduceAsync = function (reduceFunc, callback) {
                var _this = this;
                kr3m.async.Loop.forEachAssoc(this.data, function (rawKey, rawValue, loopCallback) {
                    if (rawValue.mappedItems.length == 0)
                        return loopCallback();
                    reduceFunc(rawKey, rawValue.mappedItems, _this.emitReduce, function () {
                        if (rawValue.reducedItems.length == 0) {
                            rawValue.mappedItems = [];
                            return loopCallback();
                        }
                        rawValue.mappedItems = rawValue.reducedItems;
                        rawValue.reducedItems = [];
                        reduceFunc(rawKey, rawValue.mappedItems, _this.emitReduce, function () {
                            rawValue.mappedItems = [];
                            loopCallback();
                        });
                    });
                }, callback);
            };
            MapReduceWorkset.prototype.flushKeys = function (keys) {
                var result = [];
                for (var i = 0; i < keys.length; ++i) {
                    if (!this.data[keys[i]])
                        continue;
                    for (var j = 0; j < this.data[keys[i]].reducedItems.length; ++j)
                        result.push(this.data[keys[i]].reducedItems[j]);
                    delete this.data[keys[i]];
                }
                return result;
            };
            MapReduceWorkset.prototype.flushArray = function () {
                var result = [];
                for (var i in this.data) {
                    for (var j = 0; j < this.data[i].reducedItems.length; ++j)
                        result.push(this.data[i].reducedItems[j]);
                }
                return result;
            };
            MapReduceWorkset.prototype.flushAssoc = function () {
                var result = {};
                for (var i in this.data) {
                    if (this.data[i].reducedItems.length > 0)
                        result[i] = this.data[i].reducedItems[0];
                }
                return result;
            };
            return MapReduceWorkset;
        }());
        db.MapReduceWorkset = MapReduceWorkset;
    })(db = kr3m.db || (kr3m.db = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var db;
    (function (db) {
        var MySqlDbConfig = (function () {
            function MySqlDbConfig() {
                this.host = "localhost";
                this.user = "root";
                this.password = "";
                this.database = "";
                this.multipleStatements = true;
                this.connectionLimit = 10;
                this.supportBigNumbers = false;
            }
            return MySqlDbConfig;
        }());
        db.MySqlDbConfig = MySqlDbConfig;
    })(db = kr3m.db || (kr3m.db = {}));
})(kr3m || (kr3m = {}));
var mysqlLib = requireOptional("mysql");
var kr3m;
(function (kr3m) {
    var sql;
    (function (sql_1) {
        var Generator = (function () {
            function Generator(connectionPool) {
                this.connectionPool = connectionPool;
            }
            Generator.prototype.escapeValue = function (value) {
                if (typeof value == "boolean")
                    return value ? "'true'" : "'false'";
                if ((value === undefined) || (value === null))
                    return 'NULL';
                return this.connectionPool.escape(value);
            };
            Generator.prototype.escape = function (sql, values) {
                if (Array.isArray(values)) {
                    var parts = sql.split("?");
                    if (parts.length != values.length + 1) {
                        logWarning("questionmark count and value count in SQL statement do not match");
                        logWarning(sql);
                        logWarning(values);
                    }
                    for (var i = 0; i < values.length; ++i)
                        parts.splice(i * 2 + 1, 0, this.escapeValue(values[i]));
                    sql = parts.join("");
                }
                else {
                    var keys = Object.keys(values);
                    keys.sort(function (a, b) { return b.length - a.length; });
                    for (var i = 0; i < keys.length; ++i)
                        sql = kr3m.util.StringEx.literalReplace(sql, ":" + keys[i], this.escapeValue(values[keys[i]]));
                }
                return sql;
            };
            Generator.prototype.escapeId = function (id) {
                return this.connectionPool.escapeId(id);
            };
            Generator.prototype.escapeObject = function (obj) {
                var result = {};
                for (var i in obj) {
                    if (typeof obj[i] != "function")
                        result[i] = this.escapeValue(obj[i]);
                }
                return result;
            };
            Generator.prototype.where = function (obj, tableName) {
                if (typeof obj == "string")
                    return " WHERE " + obj.replace(/^\s*WHERE\s*/i, "");
                var escaped = this.escapeObject(obj);
                var keys = Object.keys(escaped);
                if (keys.length == 0)
                    return " WHERE 1 ";
                var fields = keys.map(function (key) { return "`" + key + "`"; });
                if (tableName)
                    fields = fields.map(function (field) { return "`" + tableName + "`." + field; });
                var parts = [];
                for (var i = 0; i < keys.length; ++i) {
                    if (Array.isArray(obj[keys[i]])) {
                        if (obj[keys[i]].length > 0) {
                            parts.push(fields[i] + " IN (" + escaped[keys[i]] + ")");
                        }
                        else {
                            logWarning("field", fields[i], "in sql where has an empty array value:", obj);
                            parts.push("0");
                        }
                    }
                    else if (obj[keys[i]] === null) {
                        parts.push(fields[i] + " IS NULL");
                    }
                    else {
                        parts.push(fields[i] + " = " + escaped[keys[i]]);
                    }
                }
                return " WHERE " + parts.join(" AND ");
            };
            Generator.prototype.fetchPage = function (tableName, where, orderBy, joins, offset, limit) {
                var sql = "SELECT * FROM `" + tableName + "`";
                var countSql = "SELECT COUNT(*) FROM `" + tableName + "`";
                var whereSql = this.where(where);
                var limitSql = this.escape(" LIMIT ?, ?", [offset, limit]);
                var joinSql = "";
                for (var i = 0; i < joins.length; ++i) {
                    joinSql += " LEFT JOIN `" + joins[i].tableName;
                    joinSql += "` ON `" + tableName + "`.`" + joins[i].localCol + "` = `";
                    joinSql += joins[i].tableName + "`.`" + joins[i].foreignCol + "`";
                }
                var orderSql = "";
                if (orderBy.length > 0) {
                    orderSql = " ORDER BY ";
                    orderSql += orderBy.map(function (o) { return "`" + o.col + "` " + (o.asc ? "ASC" : "DESC"); }).join(" ");
                }
                var result = {
                    sql: sql + joinSql + whereSql + orderSql + limitSql,
                    countSql: countSql + joinSql + whereSql
                };
                return result;
            };
            Generator.prototype.insert = function (tableName, obj) {
                var item = this.escapeObject(obj);
                var sql = "INSERT INTO `" + tableName;
                sql += "` (`" + kr3m.util.StringEx.joinKeys(item, "`,`") + "`) VALUES (";
                sql += kr3m.util.StringEx.joinValues(item) + ");";
                return sql;
            };
            Generator.prototype.insertBatch = function (tableName, objects) {
                if (objects.length == 0)
                    return "";
                var keys = {};
                for (var i = 0; i < objects.length; ++i) {
                    for (var j in objects[i]) {
                        if (typeof objects[i][j] != "function")
                            keys[j] = true;
                    }
                }
                var sql = "INSERT INTO `" + tableName;
                sql += "` (`" + kr3m.util.StringEx.joinKeys(keys, "`,`") + "`) VALUES ";
                var parts = [];
                for (var i = 0; i < objects.length; ++i) {
                    var item = {};
                    for (var j in keys) {
                        if (typeof objects[i][j] == "undefined")
                            item[j] = '';
                        else
                            item[j] = this.escapeValue(objects[i][j]);
                    }
                    parts.push("(" + kr3m.util.StringEx.joinValues(item) + ")");
                }
                sql += parts.join();
                return sql;
            };
            Generator.prototype.replace = function (tableName, obj) {
                var item = this.escapeObject(obj);
                var sql = "REPLACE INTO `" + tableName;
                sql += "` (`" + kr3m.util.StringEx.joinKeys(item, "`,`") + "`) VALUES (";
                sql += kr3m.util.StringEx.joinValues(item) + ");";
                return sql;
            };
            Generator.prototype.replaceBatch = function (tableName, objects) {
                if (objects.length == 0)
                    return "";
                var keys = {};
                for (var i = 0; i < objects.length; ++i) {
                    for (var j in objects[i])
                        keys[j] = true;
                }
                var sql = "REPLACE INTO `" + tableName;
                sql += "` (`" + kr3m.util.StringEx.joinKeys(keys, "`,`") + "`) VALUES ";
                var parts = [];
                for (var i = 0; i < objects.length; ++i) {
                    var item = {};
                    for (var j in keys) {
                        if (typeof objects[i][j] == "undefined")
                            item[j] = '';
                        else
                            item[j] = this.escapeValue(objects[i][j]);
                    }
                    parts.push("(" + kr3m.util.StringEx.joinValues(item) + ")");
                }
                sql += parts.join();
                return sql;
            };
            Generator.prototype.updateField = function (tableName, field, value, where) {
                var sql = "UPDATE `" + tableName + "` SET `";
                sql += field;
                sql += "` = ? ";
                sql = this.escape(sql, [value]);
                sql += " WHERE " + where.replace(/^\s*WHERE\s*/i, "");
                return sql;
            };
            Generator.prototype.getKeyValues = function (obj, indexCol) {
                var keyValues = {};
                var keys = typeof indexCol == "string" ? [indexCol] : indexCol;
                for (var i = 0; i < keys.length; ++i)
                    keyValues[keys[i]] = obj[keys[i]];
                return keyValues;
            };
            Generator.prototype.update = function (tableName, obj, indexCol) {
                if (indexCol === void 0) { indexCol = "id"; }
                var item = this.escapeObject(obj);
                var sql = "UPDATE `" + tableName + "` SET `";
                sql += kr3m.util.StringEx.joinAssoc(item, ", `", "` =");
                sql += this.where(this.getKeyValues(obj, indexCol));
                sql += ";\n";
                return sql;
            };
            Generator.prototype.truncate = function (tableName) {
                var sql = "TRUNCATE `" + tableName + "`;";
                return sql;
            };
            Generator.prototype["delete"] = function (tableName, obj) {
                if (obj["id"]) {
                    var sql = "DELETE FROM `" + tableName + "` WHERE id = ? LIMIT 1;";
                    sql = this.escape(sql, [obj["id"]]);
                    return sql;
                }
                else {
                    var item = this.escapeObject(obj);
                    var sql = "DELETE FROM `" + tableName + "` WHERE `";
                    sql += kr3m.util.StringEx.joinAssoc(item, " AND `", "` = ");
                    sql += " LIMIT 1;";
                    return sql;
                }
            };
            Generator.prototype.deleteBatch = function (tableName, where) {
                if (typeof where != "string") {
                    var parts = [];
                    for (var i in where) {
                        if (typeof where[i] != "function")
                            parts.push("`" + i + "` = " + this.escapeValue(where[i]));
                    }
                    where = parts.join(" AND ");
                }
                else {
                    where = where.replace(/^\s*where\s*/i, "");
                }
                var sql = "DELETE FROM `" + tableName + "` WHERE " + where;
                return sql;
            };
            Generator.prototype.dropTable = function (tableName) {
                var sql = "SET FOREIGN_KEY_CHECKS=0; DROP TABLE " + tableName + "; SET FOREIGN_KEY_CHECKS=1;";
                return sql;
            };
            return Generator;
        }());
        sql_1.Generator = Generator;
    })(sql = kr3m.sql || (kr3m.sql = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var db;
    (function (db) {
        var MySqlDb = (function (_super) {
            __extends(MySqlDb, _super);
            function MySqlDb(config) {
                var _this = _super.call(this, config) || this;
                _this.defaultBatchSize = 100;
                _this.castBooleans = true;
                _this.nextQueryLogColor = "";
                if (typeof config.multipleStatements == "undefined")
                    config.multipleStatements = true;
                if (typeof config.connectionLimit == "undefined")
                    config.connectionLimit = 10;
                if (typeof config.supportBigNumbers == "undefined")
                    config.supportBigNumbers = false;
                _this.connectionPool = mysqlLib.createPool(config);
                _this.generator = new kr3m.sql.Generator(_this.connectionPool);
                return _this;
            }
            MySqlDb.prototype.getGenerator = function () {
                return new kr3m.sql.Generator(this.connectionPool);
            };
            MySqlDb.prototype.release = function (callback) {
                this.connectionPool.end(callback);
            };
            MySqlDb.prototype.escapeValue = function (value) {
                return this.generator.escapeValue(value);
            };
            MySqlDb.prototype.escape = function (sql, values) {
                return this.generator.escape(sql, values);
            };
            MySqlDb.prototype.escapeId = function (id) {
                return this.generator.escapeId(id);
            };
            MySqlDb.prototype.escapeObject = function (obj) {
                return this.generator.escapeObject(obj);
            };
            MySqlDb.prototype.where = function (obj, tableName) {
                return this.generator.where(obj, tableName);
            };
            MySqlDb.prototype.fetchPage = function (tableName, where, orderBy, joins, offset, limit, callback) {
                var _this = this;
                var scripts = this.generator.fetchPage(tableName, where, orderBy, joins, offset, limit);
                this.fetchAll(scripts.sql, function (rows) {
                    _this.fetchOne(scripts.countSql, function (totalCount) {
                        callback(rows, totalCount);
                    });
                });
            };
            MySqlDb.prototype.fetchAll = function (sql, callback, errorCallback) {
                this.query(sql, function (rows) {
                    rows = rows || [];
                    callback(rows);
                }, errorCallback);
            };
            MySqlDb.prototype.fetchRow = function (sql, callback, errorCallback) {
                this.fetchAll(sql, function (rows) {
                    callback(rows.length > 0 ? rows[0] : null);
                }, errorCallback);
            };
            MySqlDb.prototype.fetchCol = function (sql, callback, errorCallback) {
                this.fetchAll(sql, function (rows) {
                    var result = [];
                    for (var i = 0; i < rows.length; ++i) {
                        for (var j in rows[i]) {
                            result.push(rows[i][j]);
                            break;
                        }
                    }
                    callback(result);
                }, errorCallback);
            };
            MySqlDb.prototype.fetchOne = function (sql, callback, errorCallback) {
                this.fetchAll(sql, function (rows) {
                    for (var i in rows[0])
                        return callback(rows[0][i]);
                    callback(null);
                }, errorCallback);
            };
            MySqlDb.prototype.fetchPairs = function (sql, callback, errorCallback) {
                this.fetchAll(sql, function (rows) {
                    var pairs = {};
                    for (var i = 0; i < rows.length; ++i) {
                        var first = true;
                        var key;
                        for (var j in rows[i]) {
                            if (first) {
                                key = rows[i][j];
                                first = false;
                            }
                            else {
                                pairs[key] = rows[i][j];
                                break;
                            }
                        }
                    }
                    callback(pairs);
                }, errorCallback);
            };
            MySqlDb.prototype.fetchAssoc = function (sql, callback, keyCol, errorCallback) {
                this.fetchAll(sql, function (rows) {
                    var result = {};
                    for (var i = 0; i < rows.length; ++i) {
                        if (keyCol) {
                            result[rows[i][keyCol]] = rows[i];
                        }
                        else {
                            for (var j in rows[i]) {
                                result[rows[i][j]] = rows[i];
                                break;
                            }
                        }
                    }
                    callback(result);
                }, errorCallback);
            };
            MySqlDb.prototype.insert = function (tableName, obj, callback, errorCallback) {
                var sql = this.generator.insert(tableName, obj);
                this.query(sql, function (result) {
                    callback && callback(typeof result != "undefined" ? result.insertId : null);
                }, errorCallback);
            };
            MySqlDb.prototype.insertBatch = function (tableName, objects, callback, batchSize, errorCallback) {
                var _this = this;
                batchSize = batchSize || this.defaultBatchSize;
                kr3m.async.Loop.forEachBatch(objects, batchSize, function (batch, nextBatch) {
                    var sql = _this.generator.insertBatch(tableName, batch);
                    _this.query(sql, function (result) { return nextBatch(); }, errorCallback);
                }, callback);
            };
            MySqlDb.prototype.replace = function (tableName, obj, callback, errorCallback) {
                var sql = this.generator.replace(tableName, obj);
                this.query(sql, function (result) {
                    callback && callback(typeof result != "undefined" ? result.insertId : null);
                }, errorCallback);
            };
            MySqlDb.prototype.replaceBatch = function (tableName, objects, callback, batchSize, errorCallback) {
                var _this = this;
                batchSize = batchSize || this.defaultBatchSize;
                kr3m.async.Loop.forEachBatch(objects, batchSize, function (batch, nextBatch) {
                    var sql = _this.generator.replaceBatch(tableName, batch);
                    _this.query(sql, function (result) { return nextBatch(); }, errorCallback);
                }, callback);
            };
            MySqlDb.prototype.updateField = function (tableName, field, value, where, callback, errorCallback) {
                var sql = this.generator.updateField(tableName, field, value, where);
                this.query(sql, function (result) { return callback && callback(); }, errorCallback);
            };
            MySqlDb.prototype.update = function (tableName, obj, callback, indexCol, errorCallback) {
                if (indexCol === void 0) { indexCol = "id"; }
                var sql = this.generator.update(tableName, obj, indexCol);
                this.query(sql, function (result) { return callback && callback(result && result.affectedRows == 1); }, errorCallback);
            };
            MySqlDb.prototype.updateBatch = function (tableName, objects, callback, batchSize, indexCol, errorCallback) {
                var _this = this;
                if (indexCol === void 0) { indexCol = "id"; }
                batchSize = batchSize || this.defaultBatchSize;
                var keys = typeof indexCol == "string" ? [indexCol] : indexCol;
                kr3m.async.Loop.forEachBatch(objects, batchSize, function (batch, nextBatch) {
                    var sql = "";
                    for (var i = 0; i < batch.length; ++i)
                        sql += _this.generator.update(tableName, batch[i], indexCol);
                    _this.query(sql, function (result) { return nextBatch(); }, errorCallback);
                }, callback);
            };
            MySqlDb.prototype.buildUpdateSql = function (escapedItem, colOptions) {
                if (!colOptions)
                    return "`" + kr3m.util.StringEx.joinAssoc(escapedItem, ", `", "` = ");
                var parts = [];
                for (var i in escapedItem) {
                    var method = "overwrite";
                    if (colOptions[i] && colOptions[i].method)
                        method = colOptions[i].method;
                    switch (method) {
                        case "accumulate":
                            parts.push("`" + i + "` = `" + i + "` + " + escapedItem[i]);
                            break;
                        default:
                            parts.push("`" + i + "` = " + escapedItem[i]);
                            break;
                    }
                }
                return parts.join(", ");
            };
            MySqlDb.prototype.upsert = function (tableName, obj, callback, colOptions, errorCallback) {
                var item = this.escapeObject(obj);
                var sql = "INSERT INTO `" + tableName;
                sql += "` (`" + kr3m.util.StringEx.joinKeys(item, "`,`") + "`) VALUES (";
                sql += kr3m.util.StringEx.joinValues(item) + ") ";
                sql += " ON DUPLICATE KEY UPDATE ";
                sql += this.buildUpdateSql(item, colOptions);
                sql += ";";
                this.query(sql, function (result) {
                    callback && callback(result ? result.insertId : null);
                }, errorCallback);
            };
            MySqlDb.prototype.upsertBatch = function (tableName, objects, callback, batchSize, colOptions, errorCallback) {
                var _this = this;
                batchSize = batchSize || this.defaultBatchSize;
                kr3m.async.Loop.forEachBatch(objects, batchSize, function (batch, nextBatch) {
                    var sql = "";
                    for (var i = 0; i < batch.length; ++i) {
                        var item = _this.escapeObject(batch[i]);
                        sql += "INSERT INTO `" + tableName;
                        sql += "` (`" + kr3m.util.StringEx.joinKeys(item, "`,`") + "`) VALUES (";
                        sql += kr3m.util.StringEx.joinValues(item) + ") ";
                        sql += " ON DUPLICATE KEY UPDATE ";
                        sql += _this.buildUpdateSql(item, colOptions);
                        sql += ";\n";
                    }
                    _this.query(sql, function (result) { return nextBatch(); }, errorCallback);
                }, callback);
            };
            MySqlDb.prototype.truncate = function (tableName, callback, errorCallback) {
                var sql = this.generator.truncate(tableName);
                this.query(sql, function (result) {
                    callback && callback();
                }, errorCallback);
            };
            MySqlDb.prototype["delete"] = function (tableName, obj, callback, errorCallback) {
                var sql = this.generator["delete"](tableName, obj);
                this.query(sql, function (result) { return callback && callback(); }, errorCallback);
            };
            MySqlDb.prototype.deleteBatch = function (tableName, where, callback, errorCallback) {
                var sql = this.generator.deleteBatch(tableName, where);
                this.query(sql, function (result) { return callback && callback(result ? result.affectedRows : 0); }, errorCallback);
            };
            MySqlDb.prototype.dropTable = function (tableName, callback, errorCallback) {
                logWarning("dropping table", tableName, "on database", this.config.database);
                var sql = this.generator.dropTable(tableName);
                this.query(sql, callback, errorCallback);
            };
            MySqlDb.prototype.dropAllTables = function (callback, errorCallback) {
                var _this = this;
                logWarning("dropping all tables on database", this.config.database);
                this.getTableNames(function (tableNames) {
                    kr3m.async.Loop.forEach(tableNames, function (tableName, next) {
                        _this.dropTable(tableName, next, errorCallback);
                    }, callback);
                }, errorCallback);
            };
            MySqlDb.prototype.renameTable = function (oldTableName, newTableName, callback, errorCallback) {
                var sql = "RENAME `" + oldTableName + "` TO `" + newTableName + "`;";
                this.query(sql, function () { return callback && callback(); }, errorCallback);
            };
            MySqlDb.prototype.getTableNames = function (callback, errorCallback) {
                var sql = "SHOW TABLES";
                this.fetchCol(sql, callback, errorCallback);
            };
            MySqlDb.prototype.getTableColumns = function (tableName, callback, errorCallback) {
                var sql = "SHOW FULL COLUMNS FROM `" + tableName + "`";
                this.fetchAll(sql, callback, errorCallback);
            };
            MySqlDb.prototype.getTableColumn = function (tableName, columnName, callback, errorCallback) {
                this.getTableColumns(tableName, function (columns) {
                    for (var i = 0; i < columns.length; ++i) {
                        if (columns[i].Field == columnName)
                            return callback(columns[i]);
                    }
                    callback(null);
                }, errorCallback);
            };
            MySqlDb.prototype.getStatus = function (callback) {
                this.query("SHOW ENGINE INNODB STATUS", function (result) { return callback(result[0].Status); });
            };
            MySqlDb.prototype.getTableIndexes = function (tableName, callback, errorCallback) {
                var sql = "SHOW INDEXES FROM `" + tableName + "`";
                this.fetchAll(sql, function (rawIndexes) {
                    var mapped = {};
                    for (var i = 0; i < rawIndexes.length; ++i) {
                        var name = rawIndexes[i].Key_name;
                        if (!mapped[name])
                            mapped[name] = { name: name, parts: [], unique: rawIndexes[i].Non_unique == 0 };
                        mapped[name].parts.push(rawIndexes[i].Column_name);
                    }
                    var indexes = [];
                    for (var j in mapped)
                        indexes.push(mapped[j]);
                    kr3m.util.Util.sortBy(indexes, "name");
                    callback(indexes);
                }, errorCallback);
            };
            MySqlDb.prototype.getTableConstraints = function (tableName, callback, errorCallback) {
                var sql = "SELECT CONSTRAINT_NAME AS `name`, TABLE_NAME AS `table`, COLUMN_NAME AS `column`, REFERENCED_TABLE_NAME AS `foreignTable`, REFERENCED_COLUMN_NAME AS `foreignColumn` " +
                    "FROM information_schema.KEY_COLUMN_USAGE " +
                    "WHERE TABLE_SCHEMA = '" + this.config.database + "' " +
                    "AND TABLE_NAME = '" + tableName + "' " +
                    "AND referenced_column_name IS NOT NULL";
                this.fetchAll(sql, function (constraints) {
                    kr3m.util.Util.sortBy(constraints, "column");
                    callback(constraints);
                }, errorCallback);
            };
            MySqlDb.prototype.getTableForeignConstraints = function (tableName, callback, errorCallback) {
                var sql = "SELECT TABLE_NAME AS `table`, COLUMN_NAME AS `column`, REFERENCED_TABLE_NAME AS `foreignTable`, REFERENCED_COLUMN_NAME AS `foreignColumn` " +
                    "FROM information_schema.KEY_COLUMN_USAGE " +
                    "WHERE TABLE_SCHEMA = '" + this.config.database + "' " +
                    "AND REFERENCED_TABLE_NAME = '" + tableName + "' " +
                    "AND referenced_column_name IS NOT NULL";
                this.fetchAll(sql, function (constraints) {
                    kr3m.util.Util.sortBy(constraints, "foreignTable");
                    callback(constraints);
                }, errorCallback);
            };
            MySqlDb.prototype.analyseTable = function (tableName, callback, errorCallback) {
                var sql = "SELECT * FROM `" + tableName + "` PROCEDURE ANALYSE ()";
                this.fetchAll(sql, callback, errorCallback);
            };
            MySqlDb.prototype.getTableScript = function (tableName, callback, errorCallback) {
                var sql = "SHOW CREATE TABLE `" + tableName + "`";
                this.fetchRow(sql, function (row) {
                    callback(row["Create Table"]);
                }, errorCallback);
            };
            MySqlDb.prototype.createUser = function () {
                var _this = this;
                var first = kr3m.util.Util.getFirstOfType.bind(null, arguments);
                var user = arguments[0];
                var password = arguments[1];
                var callback = first("function", 0, 0);
                var errorCallback = first("function", 0, 1);
                var hosts = first("object", 0, 0) || ["%", "localhost", "127.0.0.1", "::1"];
                var sql = "CREATE USER ?@? IDENTIFIED BY ?;";
                sql = hosts.map(function (host) { return _this.escape(sql, [user, host, password]); }).join("\n");
                this.query(sql, callback, errorCallback);
            };
            MySqlDb.prototype.dropUser = function () {
                var _this = this;
                var first = kr3m.util.Util.getFirstOfType.bind(null, arguments);
                var user = arguments[0];
                var callback = first("function", 0, 0);
                var errorCallback = first("function", 0, 1);
                var hosts = first("object", 0, 0) || ["%", "localhost", "127.0.0.1", "::1"];
                var sql = "DROP USER ?@?;";
                sql = hosts.map(function (host) { return _this.escape(sql, [user, host]); }).join("\n");
                this.query(sql, callback, errorCallback);
            };
            MySqlDb.prototype.grantAllPrivileges = function () {
                var _this = this;
                var first = kr3m.util.Util.getFirstOfType.bind(null, arguments);
                var dababaseName = arguments[0];
                var user = arguments[1];
                var callback = first("function", 0, 0);
                var errorCallback = first("function", 0, 1);
                var hosts = first("object", 0, 0) || ["%", "localhost", "127.0.0.1", "::1"];
                var sql = "\n\t\t\t\tGRANT USAGE ON *.* TO :user@:host WITH\n\t\t\t\t\tMAX_QUERIES_PER_HOUR 0\n\t\t\t\t\tMAX_CONNECTIONS_PER_HOUR 0\n\t\t\t\t\tMAX_UPDATES_PER_HOUR 0\n\t\t\t\t\tMAX_USER_CONNECTIONS 0;\n\n\t\t\t\tGRANT ALL PRIVILEGES ON `" + dababaseName + "`.* TO :user@:host;\n\t\t\t";
                sql = hosts.map(function (host) { return _this.escape(sql, { user: user, host: host }); }).join("\n");
                sql += "\nFLUSH PRIVILEGES;";
                this.query(sql, callback, errorCallback);
            };
            MySqlDb.prototype.doesUserExist = function (user, callback, errorCallback) {
                var sql = "SELECT COUNT(*) FROM `mysql`.`user` WHERE `User` = ?";
                sql = this.escape(sql, [user]);
                this.fetchOne(sql, function (count) { return callback(count > 0); }, errorCallback);
            };
            MySqlDb.prototype.getAllUserDetails = function (callback, errorCallback) {
                var sql = "SELECT * FROM `mysql`.`user`";
                this.fetchAll(sql, function (rawData) {
                    rawData.forEach(function (rd) { return delete rd.Password; });
                    callback(rawData);
                }, errorCallback);
            };
            MySqlDb.prototype.getUserDetails = function (user, callback, errorCallback) {
                var sql = this.escape("SELECT * FROM `mysql`.`user` WHERE `User` = ?", [user]);
                this.fetchAll(sql, function (rawData) {
                    rawData.forEach(function (rd) { return delete rd.Password; });
                    callback(rawData);
                }, errorCallback);
            };
            MySqlDb.prototype.doesDatabaseExist = function (database, callback, errorCallback) {
                var sql = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?;";
                sql = this.escape(sql, [database]);
                this.fetchOne(sql, function (name) { return callback(!!name); }, errorCallback);
            };
            MySqlDb.prototype.getAllDatabaseNames = function (callback, errorCallback) {
                this.fetchCol("SHOW DATABASES", callback, errorCallback);
            };
            MySqlDb.prototype.getDatabase = function () {
                var first = kr3m.util.Util.getFirstOfType.bind(null, arguments);
                var callback = first("function", 0, 0);
                var errorCallback = first("function", 0, 1);
                var config = kr3m.util.Util.clone(this.config);
                config.database = arguments[0];
                if (arguments.length > 3) {
                    config.user = arguments[1];
                    config.password = arguments[2];
                }
                callback(new MySqlDb(config));
            };
            MySqlDb.prototype.createDatabase = function (database, callback, errorCallback) {
                var sql = "CREATE DATABASE IF NOT EXISTS " + database + " COLLATE utf8_general_ci";
                this.query(sql, callback, errorCallback);
            };
            MySqlDb.prototype.dropDatabase = function (database, callback, errorCallback) {
                logWarning("dropping database", database);
                var sql = "DROP DATABASE " + database + ";";
                this.query(sql, callback, errorCallback);
            };
            MySqlDb.prototype.getDatabaseSize = function (callback, errorCallback) {
                var sql = "\n\t\t\t\tSELECT SUM(data_length) AS `dataSize`, SUM(index_length) AS `indexSize`\n\t\t\t\tFROM information_schema.tables\n\t\t\t\tWHERE table_schema = ?\n\t\t\t";
                sql = this.escape(sql, [this.config.database]);
                this.fetchRow(sql, function (row) {
                    callback(row.dataSize + row.indexSize, row.dataSize, row.indexSize);
                }, errorCallback);
            };
            MySqlDb.prototype.getTableSize = function (tableName, callback, errorCallback) {
                var sql = "\n\t\t\t\tSELECT data_length, index_length\n\t\t\t\tFROM information_schema.tables\n\t\t\t\tWHERE table_schema = ? AND table_name = ?\n\t\t\t";
                sql = this.escape(sql, [this.config.database, tableName]);
                this.fetchRow(sql, function (row) {
                    callback(row.data_length + row.index_length, row.data_length, row.index_length);
                }, errorCallback);
            };
            MySqlDb.prototype.getTableSizes = function (callback, errorCallback) {
                var sql = "\n\t\t\t\tSELECT table_name, data_length + index_length\n\t\t\t\tFROM information_schema.tables\n\t\t\t\tWHERE table_schema = ?\n\t\t\t";
                sql = this.escape(sql, [this.config.database]);
                this.fetchPairs(sql, callback, errorCallback);
            };
            MySqlDb.prototype.getConnectionLimit = function () {
                return this.config.connectionLimit;
            };
            MySqlDb.prototype.castType = function (field, next) {
                if (field.type == "STRING") {
                    var value = field.string();
                    if (this.castBooleans) {
                        if (value === "true")
                            return true;
                        if (value === "false")
                            return false;
                    }
                    return value;
                }
                return next();
            };
            MySqlDb.prototype.query = function (sql, callback, errorCallback) {
                var _this = this;
                var nextQueryLogColor = this.nextQueryLogColor;
                this.nextQueryLogColor = "";
                this.connectionPool.getConnection(function (err, connection) {
                    if (err) {
                        if (errorCallback)
                            return errorCallback("error while connecting to MySql database\n" + sql + "\n" + err.toString());
                        logError("error while connecting to MySql database");
                        logError(sql);
                        logError(err);
                        return callback && callback(undefined);
                    }
                    if (nextQueryLogColor)
                        log(nextQueryLogColor, sql, kr3m.util.Log.COLOR_RESET);
                    var options = {
                        sql: sql,
                        typeCast: _this.castType.bind(_this)
                    };
                    connection.query(options, function (err, result) {
                        if (err) {
                            if (errorCallback) {
                                connection.release();
                                return errorCallback("an error (" + err.code + ") occured in SQL script: " + sql);
                            }
                            logError("an error (" + err.code + ") occured in SQL script:");
                            logError(sql);
                            connection.release();
                            return callback && callback(undefined);
                        }
                        connection.release();
                        callback && callback(result);
                    });
                });
            };
            MySqlDb.prototype.queryIterative = function (sql, dataCallback, doneCallback, batchSize, errorCallback) {
                var _this = this;
                batchSize = batchSize || this.defaultBatchSize;
                var nextQueryLogColor = this.nextQueryLogColor;
                this.nextQueryLogColor = "";
                this.connectionPool.getConnection(function (err, connection) {
                    if (err) {
                        if (errorCallback)
                            return errorCallback("error while connecting to MySql database\n" + sql + "\n" + err.toString());
                        logError("error while connecting to MySql database");
                        logError(sql);
                        logError(err);
                        return doneCallback && doneCallback();
                    }
                    if (nextQueryLogColor)
                        log(nextQueryLogColor, sql, kr3m.util.Log.COLOR_RESET);
                    var inErrorState = false;
                    var batch = [];
                    var options = {
                        sql: sql,
                        typeCast: _this.castType.bind(_this)
                    };
                    var query = connection.query(options);
                    query.on("error", function (err) {
                        inErrorState = true;
                        if (errorCallback)
                            return errorCallback("an error (" + err.code + ") occured in SQL script: " + sql);
                        logError("an error (" + err.code + ") occured in SQL script:");
                        logError(sql);
                    }).on("result", function (row) {
                        batch.push(row);
                        if (batch.length == batchSize) {
                            connection.pause();
                            dataCallback(batch, function (abort) {
                                if (abort) {
                                    connection.release();
                                    doneCallback && doneCallback();
                                }
                                else {
                                    batch = [];
                                    connection.resume();
                                }
                            });
                        }
                    }).on("end", function () {
                        connection.release();
                        if (!inErrorState) {
                            if (batch.length == 0)
                                return doneCallback && doneCallback();
                            dataCallback(batch, function () { return doneCallback && doneCallback(); });
                        }
                    });
                });
            };
            MySqlDb.prototype.mapReduce = function (sql, mapFunc, reduceFunc, callback, errorCallback) {
                var workset = new kr3m.db.MapReduceWorkset();
                this.queryIterative(sql, function (rows, queryCallback) {
                    workset.map(rows, mapFunc);
                    workset.reduce(reduceFunc);
                    queryCallback();
                }, function () { return callback(workset.flushAssoc()); }, this.defaultBatchSize, errorCallback);
            };
            MySqlDb.prototype.mapReduceSimple = function (sql, mapFunc, reduceFunc, callback, errorCallback) {
                var workset = new kr3m.db.MapReduceWorkset();
                this.queryIterative(sql, function (rows, queryCallback) {
                    workset.mapSimple(rows, mapFunc);
                    workset.reduceSimple(reduceFunc);
                    queryCallback();
                }, function () { return callback(workset.flushAssoc()); }, this.defaultBatchSize, errorCallback);
            };
            MySqlDb.prototype.mapReduceFlush = function (sql, mapFunc, reduceFunc, flushFunc, callback, batchSize, errorCallback) {
                batchSize = batchSize || this.defaultBatchSize;
                var threshold = 2 * batchSize;
                var access = [];
                var reduceFunc2 = function (key, mappedItems, emit) {
                    reduceFunc(key, mappedItems, function (key, reducedItem) {
                        emit(key, reducedItem);
                        kr3m.util.Util.remove(access, key);
                        access.unshift(key);
                    });
                };
                var workset = new kr3m.db.MapReduceWorkset();
                this.queryIterative(sql, function (rows, queryCallback) {
                    workset.map(rows, mapFunc);
                    workset.reduce(reduceFunc2);
                    if (access.length <= threshold)
                        return queryCallback();
                    var flushKeys = access.slice(-batchSize);
                    access = access.slice(0, -batchSize);
                    var rowsToFlush = workset.flushKeys(flushKeys);
                    flushFunc(rowsToFlush, queryCallback);
                }, function () { return flushFunc(workset.flushArray(), callback); }, batchSize, errorCallback);
            };
            MySqlDb.prototype.mapReduceAsync = function (sql, mapFunc, reduceFunc, callback, errorCallback) {
                var workset = new kr3m.db.MapReduceWorkset();
                this.queryIterative(sql, function (rows, queryCallback) {
                    workset.mapAsync(rows, mapFunc, function () {
                        workset.reduceAsync(reduceFunc, queryCallback);
                    });
                }, function () { return callback(workset.flushAssoc()); }, this.defaultBatchSize, errorCallback);
            };
            MySqlDb.prototype.exportCSV = function (sql, filePath, callback) {
                var func = kr3m.csv.generateLocalFile;
                this.queryIterative(sql, function (rows, nextBatch) {
                    func(filePath, rows, function (success) {
                        if (!success)
                            return callback && callback(false);
                        func = kr3m.csv.appendToLocalFile;
                        nextBatch();
                    });
                }, function () { return callback && callback(true); });
            };
            return MySqlDb;
        }(kr3m.db.Database));
        db.MySqlDb = MySqlDb;
    })(db = kr3m.db || (kr3m.db = {}));
})(kr3m || (kr3m = {}));
var db;
var cuboro;
(function (cuboro) {
    var vo;
    (function (vo) {
        var User = (function () {
            function User(user, isAdmin) {
                if (user) {
                    this.id = user.id;
                    this.name = user.name;
                    this.imageUrl = user.imageUrl;
                    this.isAdmin = isAdmin;
                }
            }
            return User;
        }());
        vo.User = User;
    })(vo = cuboro.vo || (cuboro.vo = {}));
})(cuboro || (cuboro = {}));
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
var cas;
(function (cas) {
    var Backend = (function () {
        function Backend(gameId, secretKey, backendUrl) {
            this.gameId = gameId;
            this.secretKey = secretKey;
            this.backendUrl = backendUrl || "https://cas-dev.das-onlinespiel.de/backend";
        }
        Backend.prototype.callService = function (params, callback, errorCallback) {
            var request = new kr3m.net.HttpRequest(this.backendUrl, params, "POST");
            request.send(function (response) {
                callback(kr3m.util.Json.decode(response));
            }, errorCallback);
        };
        Backend.prototype.verifyUser = function (userId, token, callback, errorCallback) {
            var params = { action: "verifyUser", gameId: this.gameId, secret: this.secretKey, userId: userId, token: token };
            this.callService(params, function (response) {
                if (!response)
                    return callback(false);
                callback(response.verified);
            }, errorCallback);
        };
        Backend.prototype.getUser = function () {
            var first = kr3m.util.Util.getFirstOfType.bind(null, arguments);
            var userId = first("number");
            var token = first("string");
            var callback = first("function", 0, 0);
            var errorCallback = first("function", 0, 1);
            var params = { action: "getUser", gameId: this.gameId, secret: this.secretKey, userId: userId, token: token };
            this.callService(params, function (response) {
                if (!response)
                    return callback(null);
                callback(response.user);
            }, errorCallback);
        };
        return Backend;
    }());
    cas.Backend = Backend;
})(cas || (cas = {}));
var cuboro;
(function (cuboro) {
    var models;
    (function (models) {
        var User = (function () {
            function User() {
                this.casBackend = new cas.Backend("zonVmeCVwn8hWGzMWuGM", "hu823ji9sdioAS9fdsHJDAS");
            }
            User.prototype.getFromContext = function (context, callback) {
                context.need({ session: true }, function () {
                    var user = context.session.getValue("user");
                    callback(user);
                }, function () { return callback(undefined); });
            };
            User.prototype.login = function (context, casUserId, casToken, callback) {
                this.casBackend.getUser(casUserId, casToken, function (casUser) {
                    if (!casUser)
                        return callback(undefined, kr3m.ERROR_DENIED);
                    context.need({ session: true, region: true }, function () {
                        var user = new cuboro.tables.UserVO();
                        user.id = casUser.id;
                        user.name = casUser.name;
                        user.imageUrl = casUser.imageUrl;
                        user.lastRegionId = context.region.id;
                        user.upsert(function () {
                            var vo = new cuboro.vo.User(user);
                            context.session.setValue("user", vo);
                            callback(vo, kr3m.SUCCESS);
                        }, function () { return callback(undefined, kr3m.ERROR_DATABASE); });
                    }, function () { return callback(undefined, kr3m.ERROR_INTERNAL); });
                }, function () { return callback(undefined, kr3m.ERROR_EXTERNAL); });
            };
            User.prototype.logout = function (context, callback) {
                context.need({ session: true }, function () {
                    context.session.deleteValue("user");
                    callback(kr3m.SUCCESS);
                }, function () { return callback(kr3m.ERROR_INTERNAL); });
            };
            return User;
        }());
        models.User = User;
    })(models = cuboro.models || (cuboro.models = {}));
})(cuboro || (cuboro = {}));
var mUser = new cuboro.models.User();
var cuboro;
(function (cuboro) {
    var tables;
    (function (tables) {
        var CommentsTable = (function () {
            function CommentsTable() {
            }
            CommentsTable.prototype.isColumnName = function (name) {
                return (["comment", "createdWhen", "id", "trackId", "userId"]).indexOf(name) >= 0;
            };
            CommentsTable.prototype.getColumnNames = function () {
                return ["comment", "createdWhen", "id", "trackId", "userId"];
            };
            CommentsTable.prototype.buildOrdering = function (ordering) {
                var parts = [];
                var ascDescRe = /^asc|desc$/i;
                for (var i = 0; i < ordering.length; ++i) {
                    if (this.isColumnName(ordering[i]))
                        parts.push(db.escapeId(ordering[i]));
                    else if (ascDescRe.test(ordering[i]) && parts.length > 0)
                        parts[parts.length - 1] += " " + ordering[i].toUpperCase();
                }
                return parts.length > 0 ? " ORDER BY " + parts.join(", ") : "";
            };
            CommentsTable.prototype.getCount = function () {
                var u = kr3m.util.Util;
                var where = u.getFirstOfType(arguments, "string", 0, 0) || "1";
                where = where.replace(/^\s*where\s*/i, " ");
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                var sql = "SELECT COUNT(*) FROM `comments` WHERE " + where;
                db.fetchOne(sql, callback, errorCallback);
            };
            CommentsTable.prototype.wrapErrorCallback = function (errorCallback, functionName) {
                if (!errorCallback)
                    return errorCallback;
                var newCallback = function (errorMessage) {
                    errorCallback("cuboro.tables.CommentVO." + functionName + " - " + errorMessage);
                };
                return newCallback;
            };
            CommentsTable.prototype.get = function () {
                var u = kr3m.util.Util;
                var whereSql = u.getFirstOfType(arguments, "string", 0, 0) || "1";
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "get");
                var sql = "SELECT * FROM `comments` WHERE " + whereSql;
                var ordering = u.getFirstOfType(arguments, "object", 0, 0) || [];
                if (ordering.length > 0)
                    sql += this.buildOrdering(ordering);
                var offset = u.getFirstOfType(arguments, "number", 0, 0) || 0;
                var limit = u.getFirstOfType(arguments, "number", 0, 1) || 0;
                if (limit > 0)
                    sql += db.escape(" LIMIT ?, ?", [offset, limit]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CommentVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            CommentsTable.prototype.getIterative = function (where, dataCallback, doneCallback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getIterative");
                where = where.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT * FROM `comments` WHERE " + where;
                db.queryIterative(sql, function (rows, nextBatch) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CommentVO).prototype;
                        rows[i].postLoad();
                    }
                    dataCallback(rows, nextBatch);
                }, doneCallback, 20, errorCallback);
            };
            CommentsTable.prototype.updateRaw = function (rows, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "updateRaw");
                db.updateBatch("comments", rows, callback, db.defaultBatchSize, "id", errorCallback);
            };
            CommentsTable.prototype.fetchPage = function (where, orderBy, joins, offset, limit, callback) {
                db.fetchPage("comments", where, orderBy, joins, offset, limit, function (rows, totalCount) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CommentVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows, totalCount);
                });
            };
            CommentsTable.prototype.fetchCol = function () {
                var u = kr3m.util.Util;
                var colName = u.getFirstOfType(arguments, "string", 0, 0);
                var whereSql = u.getFirstOfType(arguments, "string", 0, 1) || "1";
                var offset = u.getFirstOfType(arguments, "number", 0, 0) || 0;
                var limit = u.getFirstOfType(arguments, "number", 0, 1) || 0;
                var ordering = u.getFirstOfType(arguments, "object", 0, 1) || [];
                var distinct = u.getFirstOfType(arguments, "boolean", 0, 0) || false;
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchCol");
                if (!this.isColumnName(colName)) {
                    var error = "invalid column name for table comments: " + colName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var limitSql = (limit > 0 || offset > 0) ? " LIMIT " + offset + ", " + (offset + limit) : "";
                var orderSql = this.buildOrdering(ordering);
                var distinctSql = distinct ? "DISTINCT " : "";
                var sql = "SELECT " + distinctSql + "`" + colName + "` FROM `comments` WHERE " + whereSql + orderSql + limitSql;
                db.fetchCol(sql, callback, errorCallback);
            };
            CommentsTable.prototype.fetchOne = function (colName, whereSql, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchOne");
                if (!this.isColumnName(colName)) {
                    var error = "invalid column name for table comments: " + colName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback(undefined);
                }
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT `" + colName + "` FROM `comments` WHERE " + whereSql + " LIMIT 1;";
                db.fetchOne(sql, callback, errorCallback);
            };
            CommentsTable.prototype.fetchPairs = function (keyName, valueName, whereSql, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchPairs");
                if (!this.isColumnName(keyName)) {
                    var error = "invalid column name for table comments: " + keyName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                if (!this.isColumnName(valueName)) {
                    var error = "invalid column name for table comments: " + valueName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                if (keyName == valueName)
                    valueName += "` AS `_" + valueName;
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT `" + keyName + "`, `" + valueName + "` FROM `comments` WHERE " + whereSql;
                db.fetchPairs(sql, callback, errorCallback);
            };
            CommentsTable.prototype.deleteWhere = function (where, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "deleteWhere");
                db.deleteBatch("comments", where, callback, errorCallback);
            };
            CommentsTable.prototype.getTableName = function () {
                return "comments";
            };
            CommentsTable.prototype.getDojo = function (params, callback, conditions, escapeArgs, errorCallback) {
                var _this = this;
                if (conditions === void 0) { conditions = []; }
                if (escapeArgs === void 0) { escapeArgs = []; }
                errorCallback = this.wrapErrorCallback(errorCallback, "getDojo");
                var columnNames = this.getColumnNames();
                var offset = params.start || 0;
                var limit = params.count || 20;
                var sort = params.sort || "id";
                for (var i = 0; i < columnNames.length; ++i) {
                    if (params.hasOwnProperty(columnNames[i]) && params[columnNames[i]]) {
                        conditions.push("`" + columnNames[i] + "` = ?");
                        escapeArgs.push(params[columnNames[i]]);
                    }
                }
                var where = db.escape(conditions.join(" AND "), escapeArgs);
                if (where == "")
                    where = "1";
                var ordering = [];
                if (sort.substring(0, 1) == "-")
                    ordering.push(sort, "ASC");
                else
                    ordering.push(sort, "DESC");
                this.getCount(where, function (count) {
                    _this.get(where, offset, limit, ordering, function (vos) { return callback(new kr3m.dojo.GridQueryResponse(vos, "id", count, "id", sort)); }, errorCallback);
                }, errorCallback);
            };
            CommentsTable.prototype.upsertBatch = function (vos, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "upsertBatch");
                for (var i = 0; i < vos.length; ++i)
                    vos[i].preStore();
                db.upsertBatch("comments", vos, function () {
                    for (var i = 0; i < vos.length; ++i)
                        vos[i].postStore();
                    callback && callback();
                }, db.defaultBatchSize, null, errorCallback);
            };
            CommentsTable.prototype.insertBatch = function (vos, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "insertBatch");
                for (var i = 0; i < vos.length; ++i)
                    vos[i].preStore();
                db.insertBatch("comments", vos, function () {
                    for (var i = 0; i < vos.length; ++i)
                        vos[i].postStore();
                    callback && callback();
                }, db.defaultBatchSize, errorCallback);
            };
            CommentsTable.prototype.getByIds = function (ids, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getByIds");
                if (ids.length == 0)
                    return callback({});
                var sql = "SELECT * FROM `comments` WHERE `id` IN (?)";
                sql = db.escape(sql, [ids]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CommentVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(kr3m.util.Util.arrayToAssoc(rows, "id"));
                }, errorCallback);
            };
            CommentsTable.prototype.getById = function (id, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getById");
                var sql = "SELECT * FROM `comments` WHERE `id` = ? LIMIT 0,1";
                sql = db.escape(sql, [id]);
                db.fetchRow(sql, function (row) {
                    if (!row)
                        return callback(undefined);
                    row.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CommentVO).prototype;
                    row.postLoad();
                    callback(row);
                }, errorCallback);
            };
            CommentsTable.prototype.getByTrackId = function (trackId, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "finderName");
                var sql = "SELECT * FROM `comments` WHERE `trackId` = ?";
                sql = db.escape(sql, [trackId]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CommentVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            CommentsTable.prototype.getByUserId = function (userId, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "finderName");
                var sql = "SELECT * FROM `comments` WHERE `userId` = ?";
                sql = db.escape(sql, [userId]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CommentVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            return CommentsTable;
        }());
        tables.CommentsTable = CommentsTable;
    })(tables = cuboro.tables || (cuboro.tables = {}));
})(cuboro || (cuboro = {}));
var tComments = new cuboro.tables.CommentsTable();
var cuboro;
(function (cuboro) {
    var tables;
    (function (tables) {
        var TracksTable = (function () {
            function TracksTable() {
            }
            TracksTable.prototype.isColumnName = function (name) {
                return (["createdWhen", "data", "id", "imageUrl", "isEducational", "isPublished", "lastSavedWhen", "name", "ownerId", "previousId", "regionId", "scoreTotal"]).indexOf(name) >= 0;
            };
            TracksTable.prototype.getColumnNames = function () {
                return ["createdWhen", "data", "id", "imageUrl", "isEducational", "isPublished", "lastSavedWhen", "name", "ownerId", "previousId", "regionId", "scoreTotal"];
            };
            TracksTable.prototype.buildOrdering = function (ordering) {
                var parts = [];
                var ascDescRe = /^asc|desc$/i;
                for (var i = 0; i < ordering.length; ++i) {
                    if (this.isColumnName(ordering[i]))
                        parts.push(db.escapeId(ordering[i]));
                    else if (ascDescRe.test(ordering[i]) && parts.length > 0)
                        parts[parts.length - 1] += " " + ordering[i].toUpperCase();
                }
                return parts.length > 0 ? " ORDER BY " + parts.join(", ") : "";
            };
            TracksTable.prototype.getCount = function () {
                var u = kr3m.util.Util;
                var where = u.getFirstOfType(arguments, "string", 0, 0) || "1";
                where = where.replace(/^\s*where\s*/i, " ");
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                var sql = "SELECT COUNT(*) FROM `tracks` WHERE " + where;
                db.fetchOne(sql, callback, errorCallback);
            };
            TracksTable.prototype.wrapErrorCallback = function (errorCallback, functionName) {
                if (!errorCallback)
                    return errorCallback;
                var newCallback = function (errorMessage) {
                    errorCallback("cuboro.tables.TrackVO." + functionName + " - " + errorMessage);
                };
                return newCallback;
            };
            TracksTable.prototype.get = function () {
                var u = kr3m.util.Util;
                var whereSql = u.getFirstOfType(arguments, "string", 0, 0) || "1";
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "get");
                var sql = "SELECT * FROM `tracks` WHERE " + whereSql;
                var ordering = u.getFirstOfType(arguments, "object", 0, 0) || [];
                if (ordering.length > 0)
                    sql += this.buildOrdering(ordering);
                var offset = u.getFirstOfType(arguments, "number", 0, 0) || 0;
                var limit = u.getFirstOfType(arguments, "number", 0, 1) || 0;
                if (limit > 0)
                    sql += db.escape(" LIMIT ?, ?", [offset, limit]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.TrackVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            TracksTable.prototype.getIterative = function (where, dataCallback, doneCallback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getIterative");
                where = where.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT * FROM `tracks` WHERE " + where;
                db.queryIterative(sql, function (rows, nextBatch) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.TrackVO).prototype;
                        rows[i].postLoad();
                    }
                    dataCallback(rows, nextBatch);
                }, doneCallback, 20, errorCallback);
            };
            TracksTable.prototype.updateRaw = function (rows, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "updateRaw");
                db.updateBatch("tracks", rows, callback, db.defaultBatchSize, "id", errorCallback);
            };
            TracksTable.prototype.fetchPage = function (where, orderBy, joins, offset, limit, callback) {
                db.fetchPage("tracks", where, orderBy, joins, offset, limit, function (rows, totalCount) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.TrackVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows, totalCount);
                });
            };
            TracksTable.prototype.fetchCol = function () {
                var u = kr3m.util.Util;
                var colName = u.getFirstOfType(arguments, "string", 0, 0);
                var whereSql = u.getFirstOfType(arguments, "string", 0, 1) || "1";
                var offset = u.getFirstOfType(arguments, "number", 0, 0) || 0;
                var limit = u.getFirstOfType(arguments, "number", 0, 1) || 0;
                var ordering = u.getFirstOfType(arguments, "object", 0, 1) || [];
                var distinct = u.getFirstOfType(arguments, "boolean", 0, 0) || false;
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchCol");
                if (!this.isColumnName(colName)) {
                    var error = "invalid column name for table tracks: " + colName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var limitSql = (limit > 0 || offset > 0) ? " LIMIT " + offset + ", " + (offset + limit) : "";
                var orderSql = this.buildOrdering(ordering);
                var distinctSql = distinct ? "DISTINCT " : "";
                var sql = "SELECT " + distinctSql + "`" + colName + "` FROM `tracks` WHERE " + whereSql + orderSql + limitSql;
                db.fetchCol(sql, callback, errorCallback);
            };
            TracksTable.prototype.fetchOne = function (colName, whereSql, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchOne");
                if (!this.isColumnName(colName)) {
                    var error = "invalid column name for table tracks: " + colName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback(undefined);
                }
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT `" + colName + "` FROM `tracks` WHERE " + whereSql + " LIMIT 1;";
                db.fetchOne(sql, callback, errorCallback);
            };
            TracksTable.prototype.fetchPairs = function (keyName, valueName, whereSql, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchPairs");
                if (!this.isColumnName(keyName)) {
                    var error = "invalid column name for table tracks: " + keyName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                if (!this.isColumnName(valueName)) {
                    var error = "invalid column name for table tracks: " + valueName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                if (keyName == valueName)
                    valueName += "` AS `_" + valueName;
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT `" + keyName + "`, `" + valueName + "` FROM `tracks` WHERE " + whereSql;
                db.fetchPairs(sql, callback, errorCallback);
            };
            TracksTable.prototype.deleteWhere = function (where, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "deleteWhere");
                db.deleteBatch("tracks", where, callback, errorCallback);
            };
            TracksTable.prototype.getTableName = function () {
                return "tracks";
            };
            TracksTable.prototype.getDojo = function (params, callback, conditions, escapeArgs, errorCallback) {
                var _this = this;
                if (conditions === void 0) { conditions = []; }
                if (escapeArgs === void 0) { escapeArgs = []; }
                errorCallback = this.wrapErrorCallback(errorCallback, "getDojo");
                var columnNames = this.getColumnNames();
                var offset = params.start || 0;
                var limit = params.count || 20;
                var sort = params.sort || "id";
                for (var i = 0; i < columnNames.length; ++i) {
                    if (params.hasOwnProperty(columnNames[i]) && params[columnNames[i]]) {
                        conditions.push("`" + columnNames[i] + "` = ?");
                        escapeArgs.push(params[columnNames[i]]);
                    }
                }
                var where = db.escape(conditions.join(" AND "), escapeArgs);
                if (where == "")
                    where = "1";
                var ordering = [];
                if (sort.substring(0, 1) == "-")
                    ordering.push(sort, "ASC");
                else
                    ordering.push(sort, "DESC");
                this.getCount(where, function (count) {
                    _this.get(where, offset, limit, ordering, function (vos) { return callback(new kr3m.dojo.GridQueryResponse(vos, "id", count, "id", sort)); }, errorCallback);
                }, errorCallback);
            };
            TracksTable.prototype.upsertBatch = function (vos, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "upsertBatch");
                for (var i = 0; i < vos.length; ++i)
                    vos[i].preStore();
                db.upsertBatch("tracks", vos, function () {
                    for (var i = 0; i < vos.length; ++i)
                        vos[i].postStore();
                    callback && callback();
                }, db.defaultBatchSize, null, errorCallback);
            };
            TracksTable.prototype.insertBatch = function (vos, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "insertBatch");
                for (var i = 0; i < vos.length; ++i)
                    vos[i].preStore();
                db.insertBatch("tracks", vos, function () {
                    for (var i = 0; i < vos.length; ++i)
                        vos[i].postStore();
                    callback && callback();
                }, db.defaultBatchSize, errorCallback);
            };
            TracksTable.prototype.getFreeName = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "getFreeName");
                var name;
                kr3m.async.Loop.loop(function (loopDone) {
                    kr3m.util.Rand.getSecureString(200, null, function (secString) {
                        name = secString;
                        _this.getByName(name, function (dummy) { return loopDone(!!dummy); }, errorCallback);
                    });
                }, function () { return callback(name); });
            };
            TracksTable.prototype.getByCreatedWhen = function (createdWhen, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "finderName");
                var sql = "SELECT * FROM `tracks` WHERE `createdWhen` = ?";
                sql = db.escape(sql, [createdWhen]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.TrackVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            TracksTable.prototype.getByIds = function (ids, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getByIds");
                if (ids.length == 0)
                    return callback({});
                var sql = "SELECT * FROM `tracks` WHERE `id` IN (?)";
                sql = db.escape(sql, [ids]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.TrackVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(kr3m.util.Util.arrayToAssoc(rows, "id"));
                }, errorCallback);
            };
            TracksTable.prototype.getById = function (id, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getById");
                var sql = "SELECT * FROM `tracks` WHERE `id` = ? LIMIT 0,1";
                sql = db.escape(sql, [id]);
                db.fetchRow(sql, function (row) {
                    if (!row)
                        return callback(undefined);
                    row.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.TrackVO).prototype;
                    row.postLoad();
                    callback(row);
                }, errorCallback);
            };
            TracksTable.prototype.getByNames = function (names, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getByNames");
                if (names.length == 0)
                    return callback({});
                var sql = "SELECT * FROM `tracks` WHERE `name` IN (?)";
                sql = db.escape(sql, [names]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.TrackVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(kr3m.util.Util.arrayToAssoc(rows, "name"));
                }, errorCallback);
            };
            TracksTable.prototype.getByName = function (name, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getByName");
                var sql = "SELECT * FROM `tracks` WHERE `name` = ? LIMIT 0,1";
                sql = db.escape(sql, [name]);
                db.fetchRow(sql, function (row) {
                    if (!row)
                        return callback(undefined);
                    row.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.TrackVO).prototype;
                    row.postLoad();
                    callback(row);
                }, errorCallback);
            };
            TracksTable.prototype.getByOwnerId = function (ownerId, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "finderName");
                var sql = "SELECT * FROM `tracks` WHERE `ownerId` = ?";
                sql = db.escape(sql, [ownerId]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.TrackVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            TracksTable.prototype.getByPreviousId = function (previousId, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "finderName");
                var sql = "SELECT * FROM `tracks` WHERE `previousId` = ?";
                sql = db.escape(sql, [previousId]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.TrackVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            TracksTable.prototype.getByRegionId = function (regionId, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "finderName");
                var sql = "SELECT * FROM `tracks` WHERE `regionId` = ?";
                sql = db.escape(sql, [regionId]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.TrackVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            return TracksTable;
        }());
        tables.TracksTable = TracksTable;
    })(tables = cuboro.tables || (cuboro.tables = {}));
})(cuboro || (cuboro = {}));
var tTracks = new cuboro.tables.TracksTable();
var cuboro;
(function (cuboro) {
    var vo;
    (function (vo) {
        var Comment = (function () {
            function Comment(comment, user) {
                this.comment = comment.comment;
                this.createdWhen = comment.createdWhen;
                this.trackId = comment.trackId;
                this.userId = comment.userId;
                this.name = user.name;
                this.id = comment.id;
            }
            return Comment;
        }());
        vo.Comment = Comment;
    })(vo = cuboro.vo || (cuboro.vo = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var vo;
    (function (vo) {
        var gallery;
        (function (gallery) {
            var Filters = (function () {
                function Filters() {
                    this.offset = 0;
                    this.limit = 20;
                    this.sortBy = "rating";
                    this.own = false;
                    this.edu = false;
                }
                return Filters;
            }());
            gallery.Filters = Filters;
        })(gallery = vo.gallery || (vo.gallery = {}));
    })(vo = cuboro.vo || (cuboro.vo = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var models;
    (function (models) {
        var Comment = (function () {
            function Comment() {
            }
            Comment.prototype.saveTrackComment = function (usreId, trackId, comment, callback) {
                var commentVo = new cuboro.tables.CommentVO();
                commentVo.comment = comment;
                commentVo.trackId = trackId;
                commentVo.userId = usreId;
                commentVo.upsert(function () { return callback(true, kr3m.SUCCESS); }, function () { return callback(false, kr3m.ERROR_DATABASE); });
            };
            Comment.prototype.getTrackComment = function (trackId, callback) {
                tTracks.getById(trackId, function (track) {
                    track.getComments(function (comments) {
                        kr3m.util.Util.sortBy(comments, "createdWhen");
                        var userIds = kr3m.util.Util.gatherUnique(comments, "userId");
                        tUsers.getByIds(userIds, function (usersById) {
                            var vos = comments.map(function (comment) { return new cuboro.vo.Comment(comment, usersById[comment.userId]); });
                            kr3m.util.Util.sortBy(vos, 'createdWhen', false);
                            callback(vos, kr3m.SUCCESS);
                        });
                    });
                });
            };
            Comment.prototype.reportAbuse = function (context, reporterUser, commentId, callback) {
                tComments.getById(commentId, function (comment) {
                    if (!comment)
                        callback(false, kr3m.ERROR_EMPTY_DATA);
                    var report = new cuboro.tables.ReportscommentVO();
                    report.userId = reporterUser.id;
                    report.commentId = comment.id;
                    report.insert(function (inserId) {
                        mMail.sendReportAbuse(context, reporterUser, comment, function (isSend) {
                            callback(true, kr3m.SUCCESS);
                        });
                    }, function (error) {
                        callback(false, kr3m.ERROR_DATABASE);
                    });
                }, function (error) {
                    callback(false, kr3m.ERROR_DATABASE);
                });
            };
            return Comment;
        }());
        models.Comment = Comment;
    })(models = cuboro.models || (cuboro.models = {}));
})(cuboro || (cuboro = {}));
var mComment = new cuboro.models.Comment();
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
var cuboro;
(function (cuboro) {
    var services;
    (function (services) {
        var Abstract = (function () {
            function Abstract() {
            }
            return Abstract;
        }());
        services.Abstract = Abstract;
    })(services = cuboro.services || (cuboro.services = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var services;
    (function (services) {
        var Comment = (function (_super) {
            __extends(Comment, _super);
            function Comment() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Comment.prototype.saveTrackComment = function (context, params, callback) {
                var helper = new kr3m.services.ParamsHelper(params);
                if (!helper.validate({ trackId: "uint", comment: "string" }))
                    return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));
                mUser.getFromContext(context, function (user) {
                    if (!user)
                        return callback(new kr3m.services.CallbackResult(kr3m.ERROR_DENIED));
                    mComment.saveTrackComment(user.id, params.trackId, params.comment, function (status, isSaved) { return callback(new kr3m.services.CallbackResult(isSaved, status)); });
                });
            };
            Comment.prototype.getTrackComment = function (context, params, callback) {
                var helper = new kr3m.services.ParamsHelper(params);
                if (!helper.validate({ trackId: "uint" }))
                    return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));
                mComment.getTrackComment(params.trackId, function (status, comment) { return callback(new kr3m.services.CallbackResult(comment, status)); });
            };
            Comment.prototype.reportAbuse = function (context, params, callback) {
                var helper = new kr3m.services.ParamsHelper(params);
                if (!helper.validate({ commentId: "uint" }))
                    return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));
                mUser.getFromContext(context, function (user) {
                    if (!user)
                        return callback(new kr3m.services.CallbackResult(kr3m.ERROR_DENIED));
                    mComment.reportAbuse(context, user, params.commentId, function (status, isReportAbused) { return callback(new kr3m.services.CallbackResult(isReportAbused, status)); });
                });
            };
            return Comment;
        }(services.Abstract));
        services.Comment = Comment;
    })(services = cuboro.services || (cuboro.services = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var tables;
    (function (tables) {
        var LocalizationVO = (function () {
            function LocalizationVO(rawData) {
                if (rawData) {
                    for (var i in rawData) {
                        if (cuboro.tables.LocalizationVO.isColumnName(i))
                            this[i] = rawData[i];
                    }
                }
            }
            LocalizationVO.isColumnName = function (name) {
                return (["field", "itemId", "itemType", "locale", "text"]).indexOf(name) >= 0;
            };
            LocalizationVO.getColumnNames = function () {
                return ["field", "itemId", "itemType", "locale", "text"];
            };
            LocalizationVO.buildFrom = function (raw) {
                var helper = new kr3m.services.ParamsHelper(raw);
                if (!helper.validate({ "field": "string", "itemId": "number", "itemType": "string", "locale": "string", "text": "string" }, {}))
                    return null;
                var foreignKeyNames = [];
                var vo = new cuboro.tables.LocalizationVO();
                var copyFields = ["field", "itemId", "itemType", "locale", "text"];
                for (var i = 0; i < copyFields.length; ++i) {
                    vo[copyFields[i]] = raw[copyFields[i]];
                    if (!vo[copyFields[i]] && kr3m.util.Util.contains(foreignKeyNames, copyFields[i]))
                        vo[copyFields[i]] = null;
                }
                return vo;
            };
            LocalizationVO.prototype.wrapErrorCallback = function (errorCallback, functionName) {
                if (!errorCallback)
                    return errorCallback;
                var newCallback = function (errorMessage) {
                    errorCallback("cuboro.tables.LocalizationVO." + functionName + " - " + errorMessage);
                };
                return newCallback;
            };
            LocalizationVO.prototype.postLoad = function () {
            };
            LocalizationVO.prototype.preStore = function () {
            };
            LocalizationVO.prototype.postStore = function () {
            };
            LocalizationVO.prototype.insert = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "insert");
                this.preStore();
                db.insert("localizations", this, function () {
                    _this.postStore();
                    callback && callback();
                }, errorCallback);
            };
            LocalizationVO.prototype.upsert = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "upsert");
                this.preStore();
                db.upsert("localizations", this, function () {
                    _this.postStore();
                    callback && callback();
                }, null, errorCallback);
            };
            LocalizationVO.prototype.update = function (whereKeys, callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "update");
                this.preStore();
                db.update("localizations", this, function () {
                    _this.postStore();
                    callback && callback();
                }, whereKeys, errorCallback);
            };
            LocalizationVO.prototype["delete"] = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "delete");
                db.deleteBatch("localizations", this, callback, errorCallback);
            };
            LocalizationVO.FIELD_MAX_LENGTH = 32;
            LocalizationVO.FIELD_MAX_LENGTH_SECURE = 16;
            LocalizationVO.ITEM_TYPE_MAX_LENGTH = 32;
            LocalizationVO.ITEM_TYPE_MAX_LENGTH_SECURE = 16;
            LocalizationVO.LOCALE_MAX_LENGTH = 4;
            LocalizationVO.LOCALE_MAX_LENGTH_SECURE = 2;
            LocalizationVO.TEXT_MAX_LENGTH = 65535;
            LocalizationVO.TEXT_MAX_LENGTH_SECURE = 32767;
            return LocalizationVO;
        }());
        tables.LocalizationVO = LocalizationVO;
    })(tables = cuboro.tables || (cuboro.tables = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var tables;
    (function (tables) {
        var LocalizationsTable = (function () {
            function LocalizationsTable() {
            }
            LocalizationsTable.prototype.isColumnName = function (name) {
                return (["field", "itemId", "itemType", "locale", "text"]).indexOf(name) >= 0;
            };
            LocalizationsTable.prototype.getColumnNames = function () {
                return ["field", "itemId", "itemType", "locale", "text"];
            };
            LocalizationsTable.prototype.buildOrdering = function (ordering) {
                var parts = [];
                var ascDescRe = /^asc|desc$/i;
                for (var i = 0; i < ordering.length; ++i) {
                    if (this.isColumnName(ordering[i]))
                        parts.push(db.escapeId(ordering[i]));
                    else if (ascDescRe.test(ordering[i]) && parts.length > 0)
                        parts[parts.length - 1] += " " + ordering[i].toUpperCase();
                }
                return parts.length > 0 ? " ORDER BY " + parts.join(", ") : "";
            };
            LocalizationsTable.prototype.getCount = function () {
                var u = kr3m.util.Util;
                var where = u.getFirstOfType(arguments, "string", 0, 0) || "1";
                where = where.replace(/^\s*where\s*/i, " ");
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                var sql = "SELECT COUNT(*) FROM `localizations` WHERE " + where;
                db.fetchOne(sql, callback, errorCallback);
            };
            LocalizationsTable.prototype.wrapErrorCallback = function (errorCallback, functionName) {
                if (!errorCallback)
                    return errorCallback;
                var newCallback = function (errorMessage) {
                    errorCallback("cuboro.tables.LocalizationVO." + functionName + " - " + errorMessage);
                };
                return newCallback;
            };
            LocalizationsTable.prototype.get = function () {
                var u = kr3m.util.Util;
                var whereSql = u.getFirstOfType(arguments, "string", 0, 0) || "1";
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "get");
                var sql = "SELECT * FROM `localizations` WHERE " + whereSql;
                var ordering = u.getFirstOfType(arguments, "object", 0, 0) || [];
                if (ordering.length > 0)
                    sql += this.buildOrdering(ordering);
                var offset = u.getFirstOfType(arguments, "number", 0, 0) || 0;
                var limit = u.getFirstOfType(arguments, "number", 0, 1) || 0;
                if (limit > 0)
                    sql += db.escape(" LIMIT ?, ?", [offset, limit]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.LocalizationVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            LocalizationsTable.prototype.getIterative = function (where, dataCallback, doneCallback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getIterative");
                where = where.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT * FROM `localizations` WHERE " + where;
                db.queryIterative(sql, function (rows, nextBatch) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.LocalizationVO).prototype;
                        rows[i].postLoad();
                    }
                    dataCallback(rows, nextBatch);
                }, doneCallback, 20, errorCallback);
            };
            LocalizationsTable.prototype.updateRaw = function (rows, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "updateRaw");
                db.updateBatch("localizations", rows, callback, db.defaultBatchSize, "id", errorCallback);
            };
            LocalizationsTable.prototype.fetchPage = function (where, orderBy, joins, offset, limit, callback) {
                db.fetchPage("localizations", where, orderBy, joins, offset, limit, function (rows, totalCount) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.LocalizationVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows, totalCount);
                });
            };
            LocalizationsTable.prototype.fetchCol = function () {
                var u = kr3m.util.Util;
                var colName = u.getFirstOfType(arguments, "string", 0, 0);
                var whereSql = u.getFirstOfType(arguments, "string", 0, 1) || "1";
                var offset = u.getFirstOfType(arguments, "number", 0, 0) || 0;
                var limit = u.getFirstOfType(arguments, "number", 0, 1) || 0;
                var ordering = u.getFirstOfType(arguments, "object", 0, 1) || [];
                var distinct = u.getFirstOfType(arguments, "boolean", 0, 0) || false;
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchCol");
                if (!this.isColumnName(colName)) {
                    var error = "invalid column name for table localizations: " + colName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var limitSql = (limit > 0 || offset > 0) ? " LIMIT " + offset + ", " + (offset + limit) : "";
                var orderSql = this.buildOrdering(ordering);
                var distinctSql = distinct ? "DISTINCT " : "";
                var sql = "SELECT " + distinctSql + "`" + colName + "` FROM `localizations` WHERE " + whereSql + orderSql + limitSql;
                db.fetchCol(sql, callback, errorCallback);
            };
            LocalizationsTable.prototype.fetchOne = function (colName, whereSql, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchOne");
                if (!this.isColumnName(colName)) {
                    var error = "invalid column name for table localizations: " + colName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback(undefined);
                }
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT `" + colName + "` FROM `localizations` WHERE " + whereSql + " LIMIT 1;";
                db.fetchOne(sql, callback, errorCallback);
            };
            LocalizationsTable.prototype.fetchPairs = function (keyName, valueName, whereSql, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchPairs");
                if (!this.isColumnName(keyName)) {
                    var error = "invalid column name for table localizations: " + keyName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                if (!this.isColumnName(valueName)) {
                    var error = "invalid column name for table localizations: " + valueName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                if (keyName == valueName)
                    valueName += "` AS `_" + valueName;
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT `" + keyName + "`, `" + valueName + "` FROM `localizations` WHERE " + whereSql;
                db.fetchPairs(sql, callback, errorCallback);
            };
            LocalizationsTable.prototype.deleteWhere = function (where, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "deleteWhere");
                db.deleteBatch("localizations", where, callback, errorCallback);
            };
            LocalizationsTable.prototype.getTableName = function () {
                return "localizations";
            };
            LocalizationsTable.prototype.upsertBatch = function (vos, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "upsertBatch");
                for (var i = 0; i < vos.length; ++i)
                    vos[i].preStore();
                db.upsertBatch("localizations", vos, function () {
                    for (var i = 0; i < vos.length; ++i)
                        vos[i].postStore();
                    callback && callback();
                }, db.defaultBatchSize, null, errorCallback);
            };
            LocalizationsTable.prototype.insertBatch = function (vos, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "insertBatch");
                for (var i = 0; i < vos.length; ++i)
                    vos[i].preStore();
                db.insertBatch("localizations", vos, function () {
                    for (var i = 0; i < vos.length; ++i)
                        vos[i].postStore();
                    callback && callback();
                }, db.defaultBatchSize, errorCallback);
            };
            LocalizationsTable.prototype.getByLocale = function (locale, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "finderName");
                var sql = "SELECT * FROM `localizations` WHERE `locale` = ?";
                sql = db.escape(sql, [locale]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.LocalizationVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            LocalizationsTable.prototype.getByLocaleItemType = function (locale, itemType, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "finderName");
                var sql = "SELECT * FROM `localizations` WHERE `locale` = ? AND `itemType` = ?";
                sql = db.escape(sql, [locale, itemType]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.LocalizationVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            LocalizationsTable.prototype.getByLocaleItemTypeItemId = function (locale, itemType, itemId, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "finderName");
                var sql = "SELECT * FROM `localizations` WHERE `locale` = ? AND `itemType` = ? AND `itemId` = ?";
                sql = db.escape(sql, [locale, itemType, itemId]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.LocalizationVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            LocalizationsTable.prototype.getByLocaleItemTypeItemIdField = function (locale, itemType, itemId, field, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getByLocaleItemTypeItemIdField");
                var sql = "SELECT * FROM `localizations` WHERE `locale` = ? AND `itemType` = ? AND `itemId` = ? AND `field` = ? LIMIT 0,1";
                sql = db.escape(sql, [locale, itemType, itemId, field]);
                db.fetchRow(sql, function (row) {
                    if (!row)
                        return callback(undefined);
                    row.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.LocalizationVO).prototype;
                    row.postLoad();
                    callback(row);
                }, errorCallback);
            };
            return LocalizationsTable;
        }());
        tables.LocalizationsTable = LocalizationsTable;
    })(tables = cuboro.tables || (cuboro.tables = {}));
})(cuboro || (cuboro = {}));
var tLocalizations = new cuboro.tables.LocalizationsTable();
var cuboro;
(function (cuboro) {
    var vo;
    (function (vo) {
        var Competition = (function () {
            function Competition(competition) {
                this.id = competition.id;
            }
            return Competition;
        }());
        vo.Competition = Competition;
    })(vo = cuboro.vo || (cuboro.vo = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var models;
    (function (models) {
        var LocaMeta = (function () {
            function LocaMeta() {
            }
            return LocaMeta;
        }());
        var Localization = (function () {
            function Localization() {
            }
            Localization.prototype.getItemMeta = function (items) {
                if (!items || items.length == 0)
                    return undefined;
                if (items[0] instanceof cuboro.vo.Competition) {
                    var meta = {
                        itemType: "competition",
                        idField: "id",
                        fields: ["title", "description", "prize"],
                        tableName: "competitions"
                    };
                    return meta;
                }
                return undefined;
            };
            Localization.prototype.locItems = function (context, items, callback) {
                var meta = this.getItemMeta(items);
                if (!meta)
                    return callback();
                context.localization.getLoadOrder(context, function (locales) {
                    var itemIds = items.map(function (item) { return item[meta.idField]; });
                    var where = db.where({
                        locale: locales,
                        itemType: meta.itemType,
                        itemId: itemIds
                    });
                    tLocalizations.get(where, function (localizations) {
                        var itemTexts = kr3m.util.Util.bucketByRecursive(localizations, "itemId", "locale");
                        for (var itemId in itemTexts) {
                            for (var locale in itemTexts[itemId])
                                itemTexts[itemId][locale] = kr3m.util.Util.arrayToPairs(itemTexts[itemId][locale], "field", "text");
                        }
                        for (var i = 0; i < items.length; ++i) {
                            if (!itemTexts[items[i][meta.idField]])
                                continue;
                            var texts = {};
                            for (var j = 0; j < locales.length; ++j)
                                texts = kr3m.util.Util.mergeAssoc(texts, itemTexts[items[i][meta.idField]][locales[j]]);
                            for (var id in texts)
                                items[i][id] = texts[id];
                        }
                        callback();
                    }, function () { return callback(); });
                });
            };
            return Localization;
        }());
        models.Localization = Localization;
    })(models = cuboro.models || (cuboro.models = {}));
})(cuboro || (cuboro = {}));
var mLoca = new cuboro.models.Localization();
var cuboro;
(function (cuboro) {
    var tables;
    (function (tables) {
        var CompetitionsTable = (function () {
            function CompetitionsTable() {
            }
            CompetitionsTable.prototype.isColumnName = function (name) {
                return (["baseTrackId", "enabled", "ends", "fixedParticipants", "id", "isPublic", "layers", "mayApply", "minScore", "nameInternal", "regionId", "starts"]).indexOf(name) >= 0;
            };
            CompetitionsTable.prototype.getColumnNames = function () {
                return ["baseTrackId", "enabled", "ends", "fixedParticipants", "id", "isPublic", "layers", "mayApply", "minScore", "nameInternal", "regionId", "starts"];
            };
            CompetitionsTable.prototype.buildOrdering = function (ordering) {
                var parts = [];
                var ascDescRe = /^asc|desc$/i;
                for (var i = 0; i < ordering.length; ++i) {
                    if (this.isColumnName(ordering[i]))
                        parts.push(db.escapeId(ordering[i]));
                    else if (ascDescRe.test(ordering[i]) && parts.length > 0)
                        parts[parts.length - 1] += " " + ordering[i].toUpperCase();
                }
                return parts.length > 0 ? " ORDER BY " + parts.join(", ") : "";
            };
            CompetitionsTable.prototype.getCount = function () {
                var u = kr3m.util.Util;
                var where = u.getFirstOfType(arguments, "string", 0, 0) || "1";
                where = where.replace(/^\s*where\s*/i, " ");
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                var sql = "SELECT COUNT(*) FROM `competitions` WHERE " + where;
                db.fetchOne(sql, callback, errorCallback);
            };
            CompetitionsTable.prototype.wrapErrorCallback = function (errorCallback, functionName) {
                if (!errorCallback)
                    return errorCallback;
                var newCallback = function (errorMessage) {
                    errorCallback("cuboro.tables.CompetitionVO." + functionName + " - " + errorMessage);
                };
                return newCallback;
            };
            CompetitionsTable.prototype.get = function () {
                var u = kr3m.util.Util;
                var whereSql = u.getFirstOfType(arguments, "string", 0, 0) || "1";
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "get");
                var sql = "SELECT * FROM `competitions` WHERE " + whereSql;
                var ordering = u.getFirstOfType(arguments, "object", 0, 0) || [];
                if (ordering.length > 0)
                    sql += this.buildOrdering(ordering);
                var offset = u.getFirstOfType(arguments, "number", 0, 0) || 0;
                var limit = u.getFirstOfType(arguments, "number", 0, 1) || 0;
                if (limit > 0)
                    sql += db.escape(" LIMIT ?, ?", [offset, limit]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CompetitionVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            CompetitionsTable.prototype.getIterative = function (where, dataCallback, doneCallback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getIterative");
                where = where.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT * FROM `competitions` WHERE " + where;
                db.queryIterative(sql, function (rows, nextBatch) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CompetitionVO).prototype;
                        rows[i].postLoad();
                    }
                    dataCallback(rows, nextBatch);
                }, doneCallback, 20, errorCallback);
            };
            CompetitionsTable.prototype.updateRaw = function (rows, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "updateRaw");
                db.updateBatch("competitions", rows, callback, db.defaultBatchSize, "id", errorCallback);
            };
            CompetitionsTable.prototype.fetchPage = function (where, orderBy, joins, offset, limit, callback) {
                db.fetchPage("competitions", where, orderBy, joins, offset, limit, function (rows, totalCount) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CompetitionVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows, totalCount);
                });
            };
            CompetitionsTable.prototype.fetchCol = function () {
                var u = kr3m.util.Util;
                var colName = u.getFirstOfType(arguments, "string", 0, 0);
                var whereSql = u.getFirstOfType(arguments, "string", 0, 1) || "1";
                var offset = u.getFirstOfType(arguments, "number", 0, 0) || 0;
                var limit = u.getFirstOfType(arguments, "number", 0, 1) || 0;
                var ordering = u.getFirstOfType(arguments, "object", 0, 1) || [];
                var distinct = u.getFirstOfType(arguments, "boolean", 0, 0) || false;
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchCol");
                if (!this.isColumnName(colName)) {
                    var error = "invalid column name for table competitions: " + colName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var limitSql = (limit > 0 || offset > 0) ? " LIMIT " + offset + ", " + (offset + limit) : "";
                var orderSql = this.buildOrdering(ordering);
                var distinctSql = distinct ? "DISTINCT " : "";
                var sql = "SELECT " + distinctSql + "`" + colName + "` FROM `competitions` WHERE " + whereSql + orderSql + limitSql;
                db.fetchCol(sql, callback, errorCallback);
            };
            CompetitionsTable.prototype.fetchOne = function (colName, whereSql, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchOne");
                if (!this.isColumnName(colName)) {
                    var error = "invalid column name for table competitions: " + colName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback(undefined);
                }
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT `" + colName + "` FROM `competitions` WHERE " + whereSql + " LIMIT 1;";
                db.fetchOne(sql, callback, errorCallback);
            };
            CompetitionsTable.prototype.fetchPairs = function (keyName, valueName, whereSql, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchPairs");
                if (!this.isColumnName(keyName)) {
                    var error = "invalid column name for table competitions: " + keyName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                if (!this.isColumnName(valueName)) {
                    var error = "invalid column name for table competitions: " + valueName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                if (keyName == valueName)
                    valueName += "` AS `_" + valueName;
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT `" + keyName + "`, `" + valueName + "` FROM `competitions` WHERE " + whereSql;
                db.fetchPairs(sql, callback, errorCallback);
            };
            CompetitionsTable.prototype.deleteWhere = function (where, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "deleteWhere");
                db.deleteBatch("competitions", where, callback, errorCallback);
            };
            CompetitionsTable.prototype.getTableName = function () {
                return "competitions";
            };
            CompetitionsTable.prototype.getDojo = function (params, callback, conditions, escapeArgs, errorCallback) {
                var _this = this;
                if (conditions === void 0) { conditions = []; }
                if (escapeArgs === void 0) { escapeArgs = []; }
                errorCallback = this.wrapErrorCallback(errorCallback, "getDojo");
                var columnNames = this.getColumnNames();
                var offset = params.start || 0;
                var limit = params.count || 20;
                var sort = params.sort || "id";
                for (var i = 0; i < columnNames.length; ++i) {
                    if (params.hasOwnProperty(columnNames[i]) && params[columnNames[i]]) {
                        conditions.push("`" + columnNames[i] + "` = ?");
                        escapeArgs.push(params[columnNames[i]]);
                    }
                }
                var where = db.escape(conditions.join(" AND "), escapeArgs);
                if (where == "")
                    where = "1";
                var ordering = [];
                if (sort.substring(0, 1) == "-")
                    ordering.push(sort, "ASC");
                else
                    ordering.push(sort, "DESC");
                this.getCount(where, function (count) {
                    _this.get(where, offset, limit, ordering, function (vos) { return callback(new kr3m.dojo.GridQueryResponse(vos, "id", count, "id", sort)); }, errorCallback);
                }, errorCallback);
            };
            CompetitionsTable.prototype.upsertBatch = function (vos, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "upsertBatch");
                for (var i = 0; i < vos.length; ++i)
                    vos[i].preStore();
                db.upsertBatch("competitions", vos, function () {
                    for (var i = 0; i < vos.length; ++i)
                        vos[i].postStore();
                    callback && callback();
                }, db.defaultBatchSize, null, errorCallback);
            };
            CompetitionsTable.prototype.insertBatch = function (vos, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "insertBatch");
                for (var i = 0; i < vos.length; ++i)
                    vos[i].preStore();
                db.insertBatch("competitions", vos, function () {
                    for (var i = 0; i < vos.length; ++i)
                        vos[i].postStore();
                    callback && callback();
                }, db.defaultBatchSize, errorCallback);
            };
            CompetitionsTable.prototype.getByBaseTrackId = function (baseTrackId, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "finderName");
                var sql = "SELECT * FROM `competitions` WHERE `baseTrackId` = ?";
                sql = db.escape(sql, [baseTrackId]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CompetitionVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            CompetitionsTable.prototype.getByIds = function (ids, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getByIds");
                if (ids.length == 0)
                    return callback({});
                var sql = "SELECT * FROM `competitions` WHERE `id` IN (?)";
                sql = db.escape(sql, [ids]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CompetitionVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(kr3m.util.Util.arrayToAssoc(rows, "id"));
                }, errorCallback);
            };
            CompetitionsTable.prototype.getById = function (id, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getById");
                var sql = "SELECT * FROM `competitions` WHERE `id` = ? LIMIT 0,1";
                sql = db.escape(sql, [id]);
                db.fetchRow(sql, function (row) {
                    if (!row)
                        return callback(undefined);
                    row.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CompetitionVO).prototype;
                    row.postLoad();
                    callback(row);
                }, errorCallback);
            };
            CompetitionsTable.prototype.getByRegionId = function (regionId, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "finderName");
                var sql = "SELECT * FROM `competitions` WHERE `regionId` = ?";
                sql = db.escape(sql, [regionId]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CompetitionVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            CompetitionsTable.prototype.getByRegionIdEnabled = function (regionId, enabled, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "finderName");
                var sql = "SELECT * FROM `competitions` WHERE `regionId` = ? AND `enabled` = ?";
                sql = db.escape(sql, [regionId, enabled]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CompetitionVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            return CompetitionsTable;
        }());
        tables.CompetitionsTable = CompetitionsTable;
    })(tables = cuboro.tables || (cuboro.tables = {}));
})(cuboro || (cuboro = {}));
var tCompetitions = new cuboro.tables.CompetitionsTable();
var cuboro;
(function (cuboro) {
    var models;
    (function (models) {
        var Competition = (function () {
            function Competition() {
            }
            Competition.prototype.getCurrentlyActive = function (context, callback) {
                context.need({ region: true }, function () {
                    var now = new Date();
                    var where = db.escape("`regionId` = ? AND `enabled` = 'true' AND `starts` < ? AND `ends` > ?", [context.region.id, now, now]);
                    tCompetitions.get(where, function (competitions) {
                        var vos = competitions.map(function (competition) { return new cuboro.vo.Competition(competition); });
                        mLoca.locItems(context, vos, function () { return callback(vos, kr3m.SUCCESS); });
                    }, function () { return callback(undefined, kr3m.ERROR_DATABASE); });
                }, function () { return callback(undefined, kr3m.ERROR_INTERNAL); });
            };
            return Competition;
        }());
        models.Competition = Competition;
    })(models = cuboro.models || (cuboro.models = {}));
})(cuboro || (cuboro = {}));
var mCompetition = new cuboro.models.Competition();
var cuboro;
(function (cuboro) {
    var services;
    (function (services) {
        var Competition = (function (_super) {
            __extends(Competition, _super);
            function Competition() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Competition.prototype.getCurrentlyActive = function (context, params, callback) {
                mCompetition.getCurrentlyActive(context, function (competitions, status) { return callback(new kr3m.services.CallbackResult(status, competitions)); });
            };
            return Competition;
        }(services.Abstract));
        services.Competition = Competition;
    })(services = cuboro.services || (cuboro.services = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var vo;
    (function (vo) {
        var EvaluationData = (function () {
            function EvaluationData() {
                this.scoreCubes = 0;
                this.scoreTotal = 0;
                this.scoreTrack = [0, 0, 0, 0, 0];
                this.scoreSubstructure = 0;
                this.cubes = 0;
                this.track = [0, 0, 0, 0, 0];
                this.substructure = 0;
            }
            return EvaluationData;
        }());
        vo.EvaluationData = EvaluationData;
    })(vo = cuboro.vo || (cuboro.vo = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var vo;
    (function (vo) {
        var TrackData = (function () {
            function TrackData() {
                this.evaluation = new cuboro.vo.EvaluationData();
            }
            return TrackData;
        }());
        vo.TrackData = TrackData;
    })(vo = cuboro.vo || (cuboro.vo = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var vo;
    (function (vo) {
        var Track = (function () {
            function Track(track, owner) {
                this.data = new cuboro.vo.TrackData();
                this.id = track.id;
                this.name = track.name;
                this.lastSavedWhen = track.lastSavedWhen;
                this.scoreTotal = track.scoreTotal;
                this.imageUrl = track.imageUrl;
                this.owner = new vo.User(owner);
                this.data = kr3m.util.Json.decode(track.data);
            }
            return Track;
        }());
        vo.Track = Track;
    })(vo = cuboro.vo || (cuboro.vo = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var vo;
    (function (vo) {
        var gallery;
        (function (gallery) {
            var Page = (function () {
                function Page() {
                }
                return Page;
            }());
            gallery.Page = Page;
        })(gallery = vo.gallery || (vo.gallery = {}));
    })(vo = cuboro.vo || (cuboro.vo = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var models;
    (function (models) {
        var Gallery = (function () {
            function Gallery() {
            }
            Gallery.prototype.getPage = function (context, filters, callback) {
                switch (filters.sortBy) {
                    case "rating":
                        var ordering = ["scoreTotal", "DESC", "createdWhen", "ASC"];
                        break;
                    case "age":
                        var ordering = ["createdWhen", "DESC"];
                        break;
                    default:
                        return callback(undefined, kr3m.ERROR_INPUT);
                }
                context.need({ region: true }, function () {
                    var where = db.escape("`regionId` = ?", [context.region.id]);
                    mUser.getFromContext(context, function (user) {
                        if (filters.edu) {
                            where = db.where({ isPublished: true, isEducational: true }) + " AND " + where;
                        }
                        else {
                            var orParts = [];
                            if (!user || !filters.own)
                                orParts.push("`isPublished` = 'true'");
                            if (filters.own && user)
                                orParts.push(db.escape("`ownerId` = ?", [user.id]));
                            where += " AND (" + orParts.join(" OR ") + ")";
                        }
                        tTracks.get(where, filters.offset, filters.limit, ordering, function (tracks) {
                            var page = new cuboro.vo.gallery.Page();
                            page.usedFilters = filters;
                            var userIds = tracks.map(function (track) { return track.ownerId; });
                            tUsers.getByIds(userIds, function (usersById) {
                                page.tracks = tracks.map(function (track) { return new cuboro.vo.Track(track, usersById[track.ownerId]); });
                                tTracks.getCount(where, function (totalCount) {
                                    page.totalCount = totalCount;
                                    callback(page, kr3m.SUCCESS);
                                });
                            });
                        });
                    });
                }, function () { return callback(undefined, kr3m.ERROR_INTERNAL); });
            };
            return Gallery;
        }());
        models.Gallery = Gallery;
    })(models = cuboro.models || (cuboro.models = {}));
})(cuboro || (cuboro = {}));
var mGallery = new cuboro.models.Gallery();
var cuboro;
(function (cuboro) {
    var services;
    (function (services) {
        var Gallery = (function (_super) {
            __extends(Gallery, _super);
            function Gallery() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Gallery.prototype.getPage = function (context, params, callback) {
                var helper = new kr3m.services.ParamsHelper(params);
                if (!helper.validate({ filters: "cuboro.vo.gallery.Filters" }))
                    return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));
                mGallery.getPage(context, params.filters, function (page, status) { return callback(new kr3m.services.CallbackResult(status, page)); });
            };
            return Gallery;
        }(services.Abstract));
        services.Gallery = Gallery;
    })(services = cuboro.services || (cuboro.services = {}));
})(cuboro || (cuboro = {}));
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
                if (locParseFunc)
                    code = locParseFunc(code, tokens);
                else if (tokens)
                    code = kr3m.util.Tokenizer.get(code, tokens);
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
            Helper.prototype.getBody = function (code, tokens, locFunc, locParseFunc) {
                var matchResult = code.match(/<body[^>]*>([\s\S]*)<\/body>/im);
                code = matchResult ? matchResult[1] : code;
                return this.processCode(code, tokens, locFunc, locParseFunc);
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
            Email2.prototype.setTemplate = function (templatePathOrUrl, tokens, locParseFunc) {
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
                        template = helper.getBody(template, tokens, null, locParseFunc);
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
var cuboro;
(function (cuboro) {
    var models;
    (function (models) {
        var Mail = (function () {
            function Mail() {
            }
            Mail.prototype.sendEcard = function (context, trackId, recepienEMail, recepienName, sendEmail, sendName, sendMessage, callback) {
                context.getLoc(function (loc) {
                    context.getSyncParseFunc(function (locParse) {
                        var tokens = {
                            BODY: loc("EMAIL_ECARD_BODY"),
                            SENDERNAME: sendName,
                            RECEPIENNAME: recepienName,
                            TRACKURL: "../../../track/" + trackId + ".png",
                            HREFURL: context.request.getOrigin() + "/track/" + trackId + ".png",
                            SENDERMESSAGE: sendMessage
                        };
                        var subject = loc("EMAIL_ECARD_SUBJECT", tokens);
                        var body = loc("EMAIL_ECARD_BODY", tokens);
                        tokens["BODY"] = body;
                        var email = new kr3m.mail.Email2(recepienEMail, subject);
                        email.setTemplate("public/templates/email/ecard/default.html", tokens, locParse);
                        email.send(function (status) {
                            if (status != kr3m.SUCCESS)
                                callback(false, status);
                            else
                                callback(true, status);
                        });
                    });
                });
            };
            Mail.prototype.sendContact = function (context, senderEmail, senderName, message, callback) {
                context.getLoc(function (loc) {
                    context.getSyncParseFunc(function (locParse) {
                        var tokens = { BODY: message };
                        var subject = loc("EMAIL_CONTACT_SUBJECT", tokens);
                        var email = new kr3m.mail.Email2(context.config.email.defaultSender, subject);
                        email.setTemplate("public/templates/email/ecard/default.html", tokens, locParse);
                        email.send(function (status) {
                            if (status != kr3m.SUCCESS)
                                callback(false, status);
                            else
                                callback(true, status);
                        });
                    });
                });
            };
            Mail.prototype.sendReportAbuse = function (context, reporterUser, comment, callback) {
                comment.getUser(function (commentUser) {
                    if (!commentUser)
                        return callback(false, kr3m.ERROR_EMPTY_DATA);
                    comment.getTrack(function (track) {
                        if (!track)
                            return callback(false, kr3m.ERROR_EMPTY_DATA);
                        context.getLoc(function (loc) {
                            context.getSyncParseFunc(function (locParse) {
                                var tokens = {
                                    BODY: loc("EMAIL_REPORT_BODY"),
                                    BAHNNAME: track.name,
                                    RPORTERUSERNAME: reporterUser.id,
                                    COMMENTURL: "",
                                    COMMENTUSER: commentUser.name,
                                    COMMENT: comment.comment
                                };
                                var subject = loc("EMAIL_ECARD_SUBJECT", tokens);
                                var body = loc("EMAIL_REPORT_BODY", tokens);
                                tokens["BODY"] = body;
                                var email = new kr3m.mail.Email2(context.config.email.defaultSender, subject);
                                email.setTemplate("public/templates/email/ecard/default.html", tokens, locParse);
                                email.send(function (status) {
                                    if (status != kr3m.SUCCESS)
                                        callback(false, status);
                                    else
                                        callback(true, status);
                                });
                            });
                        });
                    }, function (error) {
                        callback(false, kr3m.ERROR_DATABASE);
                    });
                }, function (error) {
                    callback(false, kr3m.ERROR_DATABASE);
                });
            };
            return Mail;
        }());
        models.Mail = Mail;
    })(models = cuboro.models || (cuboro.models = {}));
})(cuboro || (cuboro = {}));
var mMail = new cuboro.models.Mail();
var cuboro;
(function (cuboro) {
    var services;
    (function (services) {
        var Mail = (function (_super) {
            __extends(Mail, _super);
            function Mail() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Mail.prototype.sendEcard = function (context, params, callback) {
                var helper = new kr3m.services.ParamsHelper(params);
                if (!helper.validate({ trackId: "uint", recipienEmail: "string", recipienName: "string", senderEmail: "string", senderName: "string", message: "string" }))
                    return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));
                mMail.sendEcard(context, params.trackId, params.recipienEmail, params.recipienName, params.senderEmail, params.senderName, params.message, function (status, isSent) { return callback(new kr3m.services.CallbackResult(isSent, status)); });
            };
            Mail.prototype.sendContact = function (context, params, callback) {
                var helper = new kr3m.services.ParamsHelper(params);
                if (!helper.validate({ senderName: "string", senderEmail: "string", message: "string" }))
                    return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));
                mMail.sendContact(context, params.senderEmail, params.senderName, params.message, function (status, isSent) { return callback(new kr3m.services.CallbackResult(isSent, status)); });
            };
            return Mail;
        }(services.Abstract));
        services.Mail = Mail;
    })(services = cuboro.services || (cuboro.services = {}));
})(cuboro || (cuboro = {}));
var childProcessLib = require("child_process");
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var Pdf = (function () {
            function Pdf(options) {
                this.options = options;
                this.cliOptions = [];
                this.tempFiles = [];
                this.errors = [];
                this.options = this.options || {};
            }
            Pdf.prototype.loadFile = function (htmlFilePath, callback) {
                var _this = this;
                fsLib.readFile(htmlFilePath, { encoding: "utf-8" }, function (err, content) {
                    if (err) {
                        _this.errors.push(err);
                        return callback("");
                    }
                    var helper = new kr3m.html.Helper();
                    var result = helper.processCode(content, _this.options.tokens, _this.options.loc, _this.options.locParse);
                    callback(result);
                });
            };
            Pdf.prototype.setBody = function (html) {
                this.bodyContent = html;
                this.bodyPath = null;
            };
            Pdf.prototype.setBodyFromFile = function (filePath) {
                this.bodyContent = null;
                this.bodyPath = filePath;
            };
            Pdf.prototype.setHeader = function (html) {
                this.headerContent = html;
                this.headerPath = null;
            };
            Pdf.prototype.setHeaderFromFile = function (filePath) {
                this.headerContent = null;
                this.headerPath = filePath;
            };
            Pdf.prototype.setFooter = function (html) {
                this.footerContent = html;
                this.footerPath = null;
            };
            Pdf.prototype.setFooterFromFile = function (filePath) {
                this.footerContent = null;
                this.footerPath = filePath;
            };
            Pdf.prototype.writeTempFile = function (nextToFilePath, content, callback, extension) {
                var _this = this;
                if (extension === void 0) { extension = ".html"; }
                var tempFilePath = "";
                kr3m.async.Loop.loop(function (loopDone) {
                    tempFilePath = nextToFilePath + "_" + util.Rand.getString(4) + extension;
                    fsLib.exists(tempFilePath, loopDone);
                }, function () {
                    _this.tempFiles.push(tempFilePath);
                    content = util.StringEx.stripBom(content);
                    if (content.indexOf(kr3m.html.Helper.DOCTYPE) < 0)
                        content = kr3m.html.Helper.DOCTYPE + "\n" + content;
                    fsLib.writeFile(tempFilePath, util.StringEx.BOM + content, { encoding: "utf-8" }, function (err) {
                        if (err)
                            _this.errors.push(err);
                        callback(tempFilePath);
                    });
                });
            };
            Pdf.prototype.processHeader = function (callback) {
                var _this = this;
                if (!this.headerPath && !this.headerContent)
                    return callback();
                kr3m.async.If.then(this.headerPath, function (thenDone) {
                    _this.loadFile(_this.headerPath, function (content) {
                        _this.headerContent = content;
                        thenDone();
                    });
                }, function () {
                    _this.writeTempFile(_this.headerPath || _this.outputPath, _this.headerContent, function (tempFile) {
                        _this.cliOptions.push(" --header-html \"" + tempFile + "\"");
                        callback();
                    });
                });
            };
            Pdf.prototype.processFooter = function (callback) {
                var _this = this;
                if (!this.footerPath && !this.footerContent)
                    return callback();
                kr3m.async.If.then(this.footerPath, function (thenDone) {
                    _this.loadFile(_this.footerPath, function (content) {
                        _this.footerContent = content;
                        thenDone();
                    });
                }, function () {
                    _this.writeTempFile(_this.footerPath || _this.outputPath, _this.footerContent, function (tempFile) {
                        _this.cliOptions.push(" --footer-html \"" + tempFile + "\"");
                        callback();
                    });
                });
            };
            Pdf.prototype.processBody = function (callback) {
                var _this = this;
                if (!this.bodyPath && !this.bodyContent)
                    return callback();
                kr3m.async.If.then(this.bodyPath, function (thenDone) {
                    _this.loadFile(_this.bodyPath, function (content) {
                        _this.bodyContent = content;
                        thenDone();
                    });
                }, function () {
                    _this.writeTempFile(_this.bodyPath || _this.outputPath, _this.bodyContent, function (tempFile) {
                        _this.cliOptions.push("\"" + tempFile + "\" \"" + _this.outputPath + "\"");
                        callback();
                    });
                });
            };
            Pdf.prototype.save = function (outputPath, callback) {
                var _this = this;
                if (this.outputPath) {
                    logError("kr3m.util.Pdf.save() was called while saving operation is in progress");
                    return callback(false);
                }
                this.outputPath = outputPath;
                this.errors = [];
                this.cliOptions = ["wkhtmltopdf --encoding utf-8"];
                this.processHeader(function () {
                    _this.processFooter(function () {
                        _this.processBody(function () {
                            var commandline = _this.cliOptions.join(" ");
                            childProcessLib.exec(commandline, function (error, stdout, stderr) {
                                if (error)
                                    _this.errors.push(error);
                                _this.deleteTempFiles(function () {
                                    _this.outputPath = null;
                                    if (_this.errors.length > 0)
                                        logError(_this.errors.length, "error(s) occured while generating pdf", _this.outputPath);
                                    for (var i = 0; i < _this.errors.length; ++i)
                                        logError(_this.errors[i]);
                                    callback(_this.errors.length == 0);
                                });
                            });
                        });
                    });
                });
            };
            Pdf.prototype.deleteTempFiles = function (callback) {
                var _this = this;
                kr3m.async.Loop.forEach(this.tempFiles, function (tempFile, loopDone) {
                    fsLib.unlink(tempFile, function (err) {
                        if (err)
                            logError(err);
                        loopDone();
                    });
                }, function () {
                    _this.tempFiles = [];
                    callback();
                });
            };
            Pdf.generateFromTemplate = function (templatePath, outputPath, tokens, callback, locParse) {
                var pdf = new Pdf({ tokens: tokens, locParse: locParse });
                pdf.setBodyFromFile(templatePath);
                pdf.save(outputPath, callback);
            };
            Pdf.generateFromContent = function (content, outputPath, callback) {
                var pdf = new Pdf();
                pdf.setBody(content);
                pdf.save(outputPath, callback);
            };
            return Pdf;
        }());
        util.Pdf = Pdf;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
var cuboro;
(function (cuboro) {
    var models;
    (function (models) {
        var Pdf = (function () {
            function Pdf() {
            }
            Pdf.prototype.dateFormat = function () {
                var d = new Date();
                var dFormate = d.getFullYear() + ""
                    + (d.getMonth() + 1) + ""
                    + d.getDate() + ""
                    + d.getHours() + ""
                    + d.getMinutes() + ""
                    + d.getSeconds();
                return dFormate;
            };
            Pdf.prototype.generateUniqueRandomName = function (prefixName, callback) {
                var name = prefixName + this.dateFormat() + kr3m.util.Rand.getInt(1, 999);
                callback(name, kr3m.SUCCESS);
            };
            Pdf.prototype.generatePdf = function (context, bodyTemplatePath, outputPath, tokens, callback) {
                context.getSyncParseFunc(function (locParse) {
                    var options = {
                        locParse: locParse,
                        tokens: tokens
                    };
                    var pdf = new kr3m.util.Pdf(options);
                    pdf.setHeaderFromFile("public/templates/pdf/header.html");
                    pdf.setBodyFromFile(bodyTemplatePath);
                    pdf.setFooterFromFile("public/templates/pdf/footer.html");
                    pdf.save(outputPath, callback);
                });
            };
            return Pdf;
        }());
        models.Pdf = Pdf;
    })(models = cuboro.models || (cuboro.models = {}));
})(cuboro || (cuboro = {}));
var mPdf = new cuboro.models.Pdf();
var cuboro;
(function (cuboro) {
    var tables;
    (function (tables) {
        var UsersTable = (function () {
            function UsersTable() {
            }
            UsersTable.prototype.isColumnName = function (name) {
                return (["id", "imageUrl", "lastRegionId", "name"]).indexOf(name) >= 0;
            };
            UsersTable.prototype.getColumnNames = function () {
                return ["id", "imageUrl", "lastRegionId", "name"];
            };
            UsersTable.prototype.buildOrdering = function (ordering) {
                var parts = [];
                var ascDescRe = /^asc|desc$/i;
                for (var i = 0; i < ordering.length; ++i) {
                    if (this.isColumnName(ordering[i]))
                        parts.push(db.escapeId(ordering[i]));
                    else if (ascDescRe.test(ordering[i]) && parts.length > 0)
                        parts[parts.length - 1] += " " + ordering[i].toUpperCase();
                }
                return parts.length > 0 ? " ORDER BY " + parts.join(", ") : "";
            };
            UsersTable.prototype.getCount = function () {
                var u = kr3m.util.Util;
                var where = u.getFirstOfType(arguments, "string", 0, 0) || "1";
                where = where.replace(/^\s*where\s*/i, " ");
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                var sql = "SELECT COUNT(*) FROM `users` WHERE " + where;
                db.fetchOne(sql, callback, errorCallback);
            };
            UsersTable.prototype.wrapErrorCallback = function (errorCallback, functionName) {
                if (!errorCallback)
                    return errorCallback;
                var newCallback = function (errorMessage) {
                    errorCallback("cuboro.tables.UserVO." + functionName + " - " + errorMessage);
                };
                return newCallback;
            };
            UsersTable.prototype.get = function () {
                var u = kr3m.util.Util;
                var whereSql = u.getFirstOfType(arguments, "string", 0, 0) || "1";
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "get");
                var sql = "SELECT * FROM `users` WHERE " + whereSql;
                var ordering = u.getFirstOfType(arguments, "object", 0, 0) || [];
                if (ordering.length > 0)
                    sql += this.buildOrdering(ordering);
                var offset = u.getFirstOfType(arguments, "number", 0, 0) || 0;
                var limit = u.getFirstOfType(arguments, "number", 0, 1) || 0;
                if (limit > 0)
                    sql += db.escape(" LIMIT ?, ?", [offset, limit]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.UserVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            UsersTable.prototype.getIterative = function (where, dataCallback, doneCallback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getIterative");
                where = where.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT * FROM `users` WHERE " + where;
                db.queryIterative(sql, function (rows, nextBatch) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.UserVO).prototype;
                        rows[i].postLoad();
                    }
                    dataCallback(rows, nextBatch);
                }, doneCallback, 20, errorCallback);
            };
            UsersTable.prototype.updateRaw = function (rows, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "updateRaw");
                db.updateBatch("users", rows, callback, db.defaultBatchSize, "id", errorCallback);
            };
            UsersTable.prototype.fetchPage = function (where, orderBy, joins, offset, limit, callback) {
                db.fetchPage("users", where, orderBy, joins, offset, limit, function (rows, totalCount) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.UserVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows, totalCount);
                });
            };
            UsersTable.prototype.fetchCol = function () {
                var u = kr3m.util.Util;
                var colName = u.getFirstOfType(arguments, "string", 0, 0);
                var whereSql = u.getFirstOfType(arguments, "string", 0, 1) || "1";
                var offset = u.getFirstOfType(arguments, "number", 0, 0) || 0;
                var limit = u.getFirstOfType(arguments, "number", 0, 1) || 0;
                var ordering = u.getFirstOfType(arguments, "object", 0, 1) || [];
                var distinct = u.getFirstOfType(arguments, "boolean", 0, 0) || false;
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchCol");
                if (!this.isColumnName(colName)) {
                    var error = "invalid column name for table users: " + colName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var limitSql = (limit > 0 || offset > 0) ? " LIMIT " + offset + ", " + (offset + limit) : "";
                var orderSql = this.buildOrdering(ordering);
                var distinctSql = distinct ? "DISTINCT " : "";
                var sql = "SELECT " + distinctSql + "`" + colName + "` FROM `users` WHERE " + whereSql + orderSql + limitSql;
                db.fetchCol(sql, callback, errorCallback);
            };
            UsersTable.prototype.fetchOne = function (colName, whereSql, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchOne");
                if (!this.isColumnName(colName)) {
                    var error = "invalid column name for table users: " + colName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback(undefined);
                }
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT `" + colName + "` FROM `users` WHERE " + whereSql + " LIMIT 1;";
                db.fetchOne(sql, callback, errorCallback);
            };
            UsersTable.prototype.fetchPairs = function (keyName, valueName, whereSql, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchPairs");
                if (!this.isColumnName(keyName)) {
                    var error = "invalid column name for table users: " + keyName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                if (!this.isColumnName(valueName)) {
                    var error = "invalid column name for table users: " + valueName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                if (keyName == valueName)
                    valueName += "` AS `_" + valueName;
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT `" + keyName + "`, `" + valueName + "` FROM `users` WHERE " + whereSql;
                db.fetchPairs(sql, callback, errorCallback);
            };
            UsersTable.prototype.deleteWhere = function (where, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "deleteWhere");
                db.deleteBatch("users", where, callback, errorCallback);
            };
            UsersTable.prototype.getTableName = function () {
                return "users";
            };
            UsersTable.prototype.getDojo = function (params, callback, conditions, escapeArgs, errorCallback) {
                var _this = this;
                if (conditions === void 0) { conditions = []; }
                if (escapeArgs === void 0) { escapeArgs = []; }
                errorCallback = this.wrapErrorCallback(errorCallback, "getDojo");
                var columnNames = this.getColumnNames();
                var offset = params.start || 0;
                var limit = params.count || 20;
                var sort = params.sort || "id";
                for (var i = 0; i < columnNames.length; ++i) {
                    if (params.hasOwnProperty(columnNames[i]) && params[columnNames[i]]) {
                        conditions.push("`" + columnNames[i] + "` = ?");
                        escapeArgs.push(params[columnNames[i]]);
                    }
                }
                var where = db.escape(conditions.join(" AND "), escapeArgs);
                if (where == "")
                    where = "1";
                var ordering = [];
                if (sort.substring(0, 1) == "-")
                    ordering.push(sort, "ASC");
                else
                    ordering.push(sort, "DESC");
                this.getCount(where, function (count) {
                    _this.get(where, offset, limit, ordering, function (vos) { return callback(new kr3m.dojo.GridQueryResponse(vos, "id", count, "id", sort)); }, errorCallback);
                }, errorCallback);
            };
            UsersTable.prototype.upsertBatch = function (vos, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "upsertBatch");
                for (var i = 0; i < vos.length; ++i)
                    vos[i].preStore();
                db.upsertBatch("users", vos, function () {
                    for (var i = 0; i < vos.length; ++i)
                        vos[i].postStore();
                    callback && callback();
                }, db.defaultBatchSize, null, errorCallback);
            };
            UsersTable.prototype.updateBatch = function (vos, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "updateBatch");
                for (var i = 0; i < vos.length; ++i)
                    vos[i].preStore();
                db.updateBatch("users", vos, function () {
                    for (var i = 0; i < vos.length; ++i)
                        vos[i].postStore();
                    callback && callback();
                }, db.defaultBatchSize, "id", errorCallback);
            };
            UsersTable.prototype.insertBatch = function (vos, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "insertBatch");
                for (var i = 0; i < vos.length; ++i)
                    vos[i].preStore();
                db.insertBatch("users", vos, function () {
                    for (var i = 0; i < vos.length; ++i)
                        vos[i].postStore();
                    callback && callback();
                }, db.defaultBatchSize, errorCallback);
            };
            UsersTable.prototype.getByIds = function (ids, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getByIds");
                if (ids.length == 0)
                    return callback({});
                var sql = "SELECT * FROM `users` WHERE `id` IN (?)";
                sql = db.escape(sql, [ids]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.UserVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(kr3m.util.Util.arrayToAssoc(rows, "id"));
                }, errorCallback);
            };
            UsersTable.prototype.getById = function (id, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getById");
                var sql = "SELECT * FROM `users` WHERE `id` = ? LIMIT 0,1";
                sql = db.escape(sql, [id]);
                db.fetchRow(sql, function (row) {
                    if (!row)
                        return callback(undefined);
                    row.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.UserVO).prototype;
                    row.postLoad();
                    callback(row);
                }, errorCallback);
            };
            UsersTable.prototype.getByLastRegionId = function (lastRegionId, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "finderName");
                var sql = "SELECT * FROM `users` WHERE `lastRegionId` = ?";
                sql = db.escape(sql, [lastRegionId]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.UserVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            return UsersTable;
        }());
        tables.UsersTable = UsersTable;
    })(tables = cuboro.tables || (cuboro.tables = {}));
})(cuboro || (cuboro = {}));
var tUsers = new cuboro.tables.UsersTable();
var cuboro;
(function (cuboro) {
    var vo;
    (function (vo) {
        var History = (function () {
            function History() {
            }
            return History;
        }());
        vo.History = History;
    })(vo = cuboro.vo || (cuboro.vo = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var models;
    (function (models) {
        var Track = (function () {
            function Track() {
            }
            Track.prototype.load = function (trackId, callback) {
                tTracks.getById(trackId, function (track) {
                    if (!track)
                        return callback(undefined, kr3m.ERROR_INPUT);
                    track.getOwner(function (owner) {
                        var vo = new cuboro.vo.Track(track, owner);
                        callback(vo, kr3m.SUCCESS);
                    });
                }, function () { return callback(undefined, kr3m.ERROR_DATABASE); });
            };
            Track.prototype.save = function (userId, trackData, name, overwrite, previousId, callback) {
                tUsers.getById(userId, function (user) {
                    if (!user)
                        return callback(undefined, kr3m.ERROR_INTERNAL);
                    tTracks.getByName(name, function (track) {
                        if (track) {
                            if (track.ownerId != userId)
                                return callback(undefined, cuboro.ERROR_IS_NOT_TRACK_OWNER);
                            if (track.isPublished)
                                return callback(undefined, cuboro.ERROR_TRACK_IS_PUBLISHED);
                            if (!overwrite)
                                return callback(undefined, cuboro.ERROR_TRACK_NAME_NOT_OVERWRITTEN);
                        }
                        else {
                            track = new cuboro.tables.TrackVO();
                            track.ownerId = userId;
                        }
                        track.name = name;
                        track.data = kr3m.util.Json.encode(trackData);
                        track.lastSavedWhen = new Date();
                        track.scoreTotal = trackData.evaluation.scoreTotal;
                        if (previousId)
                            track.previousId = previousId;
                        track.upsert(function () {
                            var vo = new cuboro.vo.Track(track, user);
                            callback(vo, kr3m.SUCCESS);
                        }, function () { return callback(undefined, kr3m.ERROR_DATABASE); });
                    });
                });
            };
            Track.prototype.saveImageTrack = function (userId, name, trackId, trackImage, callback) {
                tUsers.getById(userId, function (user) {
                    if (!user)
                        return callback(undefined, kr3m.ERROR_INTERNAL);
                    tTracks.getByName(name, function (track) {
                        if (track) {
                            if (track.ownerId != userId)
                                return callback(undefined, cuboro.ERROR_IS_NOT_TRACK_OWNER);
                        }
                        else {
                            track = new cuboro.tables.TrackVO();
                            track.ownerId = userId;
                        }
                        var filePath = "public/track/" + trackId + ".png";
                        var fileUrl = "track/" + trackId + ".png";
                        kr3m.util.File.saveDataUrl(trackImage, filePath, function (status) {
                            if (status == kr3m.SUCCESS) {
                                track.imageUrl = fileUrl;
                                track.upsert(function () {
                                    callback(fileUrl, kr3m.SUCCESS);
                                }, function () { return callback(undefined, kr3m.ERROR_DATABASE); });
                            }
                            else
                                callback("", status);
                        });
                    });
                });
            };
            Track.prototype["delete"] = function (userId, trackId, callback) {
                tTracks.getById(trackId, function (track) {
                    if (!track)
                        return callback(kr3m.ERROR_INPUT);
                    if (track.ownerId != userId)
                        return callback(kr3m.ERROR_DENIED);
                    track["delete"](function () { return callback(kr3m.SUCCESS); }, function () { return callback(kr3m.ERROR_DATABASE); });
                });
            };
            Track.prototype.publish = function (userId, trackId, name, callback) {
                tTracks.getById(trackId, function (track) {
                    if (!track)
                        return callback(kr3m.ERROR_INPUT);
                    if (track.ownerId != userId)
                        return callback(kr3m.ERROR_DENIED);
                    track.isPublished = true;
                    track.name = name;
                    track.update(function () { return callback(kr3m.SUCCESS); }, function () { return callback(kr3m.ERROR_DATABASE); });
                });
            };
            Track.prototype.unpublish = function (userId, trackId, callback) {
                tTracks.getById(trackId, function (track) {
                    if (!track)
                        return callback(kr3m.ERROR_INPUT);
                    if (track.ownerId != userId)
                        return callback(kr3m.ERROR_DENIED);
                    track.isPublished = false;
                    track.update(function () { return callback(kr3m.SUCCESS); }, function () { return callback(kr3m.ERROR_DATABASE); });
                });
            };
            Track.prototype.isNameUnique = function (trackId, newName, callback) {
                var where = 'id != ? AND isPublished = ? AND name = ?';
                where = db.escape(where, [trackId, true, newName]);
                tTracks.getCount(where, function (count) { return callback(count == 0, kr3m.SUCCESS); }, function () { return callback(false, kr3m.ERROR_DATABASE); });
            };
            Track.prototype.isPublished = function (trackId, callback) {
                tTracks.getById(trackId, function (track) {
                    if (!track)
                        return callback(undefined, kr3m.ERROR_INPUT);
                    callback(track.isPublished, kr3m.SUCCESS);
                });
            };
            Track.prototype.printPdf = function (context, trackId, screenshot, callback) {
                var _this = this;
                tTracks.getById(trackId, function (track) {
                    if (!track)
                        return callback(kr3m.ERROR_EMPTY_DATA);
                    track.getComments(function (comments) {
                        mPdf.generateUniqueRandomName("Track_", function (fileName) {
                            var savePath = "public/pdf/" + fileName + ".pdf";
                            var callbackUrl = "pdf/" + fileName + ".pdf";
                            var bodyTemplate = "public/templates/pdf/body.html";
                            var commentToPdf = '<ul style="width: 300px">';
                            kr3m.async.Loop.forEach(comments, function (comment, next, i) {
                                comment.getUser(function (user) {
                                    commentToPdf += '<li>' + user.name + " : " + comment.comment + '</li>';
                                    next();
                                });
                            }, function () {
                                commentToPdf += "</ul>";
                                var data = kr3m.util.Json.decode(track.data);
                                var cubes = [];
                                for (var i = 0; i < data['cubes'].length; i++)
                                    cubes.push(kr3m.util.Json.decode(data['cubes'][i]));
                                var cubesAsso = kr3m.util.Util.bucketBy(cubes, 'key');
                                var cubesAssoIdCount = [];
                                Object.keys(cubesAsso).forEach(function (v, i, arr) {
                                    var cubeAssozIdCount = { "cubeId": v, "count": cubesAsso[v].length, "countId": v.replace('cube_', '') };
                                    cubesAssoIdCount.push(cubeAssozIdCount);
                                });
                                kr3m.util.Util.sortBy(cubesAssoIdCount, "cubeId", true);
                                var cubesAssoIdCountLength = cubesAssoIdCount.length;
                                var colCounter = 0;
                                var colPerRow = 7;
                                var cubesHtml = "<div class='divTable' style='width: 100%;' border='0'>";
                                for (var i = 0; i < cubesAssoIdCount.length; i++) {
                                    if ((i % colPerRow) == 0) {
                                        cubesHtml += "<div class=\"divTableRow\">";
                                    }
                                    if ((i % colPerRow) >= 0) {
                                        ++colCounter;
                                        cubesHtml += '<div class="divTableCell"><div class="cubeinfo"><span class="spanCounterCuber">' + cubesAssoIdCount[i]['count'] + 'x</span><span>' + cubesAssoIdCount[i]['countId'] + '</span></div><img height="140" width="140" style="margin-top: 3px;" src="img/pdf/' + cubesAssoIdCount[i]['cubeId'] + '.png"></div>';
                                    }
                                    if (colCounter == colPerRow || i == cubesAssoIdCountLength - 1) {
                                        cubesHtml += "</div>";
                                        colCounter = 0;
                                    }
                                }
                                cubesHtml += "</div>";
                                var layersHtml = "";
                                for (var layerIndex = 0; layerIndex < 9; layerIndex++) {
                                    if (layerIndex == 6)
                                        layersHtml += '<div style="page-break-before: always;"></div>';
                                    layersHtml += '<div class="ldivTable" ><span style="background-color:#cfcfcf;font-family: Arial; font-size: 22px;">' + (layerIndex + 1) + '</span>';
                                    for (var rowIndex = 0; rowIndex < 12; rowIndex++) {
                                        layersHtml += "<div class=\"divTableRow\">";
                                        for (var colIndex = 0; colIndex < 12; colIndex++) {
                                            var cubeData = _this.isCellInMap(cubes, { "x": colIndex, "y": layerIndex, "z": rowIndex });
                                            if (cubeData != null)
                                                layersHtml += '<div class="ldivTableCell" style="background-color: black; color: white;">' + cubeData["key"].replace('cube_', '') + '</div>';
                                            else
                                                layersHtml += '<div class="ldivTableCell">&nbsp;</div>';
                                        }
                                        layersHtml += "</div>";
                                    }
                                    layersHtml += "</div>";
                                }
                                var setsHtml = "";
                                for (var i = 0; i < data['sets'].length; i++)
                                    setsHtml += '<img src="img/pdf/sets/' + data['sets'][i] + '.png">';
                                var tokens = {
                                    TRACKNAME: track.name,
                                    DATE: new Date(),
                                    SCREENSHOT: screenshot,
                                    PDF_CUBES_NUMBERS: data['evaluation']['cubes'],
                                    PDF_CUBES_NUMBERS_SCORE: data['evaluation']['scoreCubes'],
                                    PDF_TRACK_ELEMENTS: data['evaluation']['track'][0],
                                    PDF_TRACK_ELEMENTS_SCORE: data['evaluation']['scoreTrack'][0],
                                    PDF_TRACK_2_ELEMENTS: data['evaluation']['track'][1],
                                    PDF_TRACK_3_ELEMENTS: data['evaluation']['track'][2],
                                    PDF_TRACK_4_ELEMENTS: data['evaluation']['track'][3],
                                    PDF_TRACK_2_ELEMENTS_SCORE: data['evaluation']['scoreTrack'][1],
                                    PDF_TRACK_3_ELEMENTS_SCORE: data['evaluation']['scoreTrack'][2],
                                    PDF_TRACK_4_ELEMENTS_SCORE: data['evaluation']['scoreTrack'][3],
                                    PDF_TRACK_PLUS_UNDER_ELEMENTS: data['evaluation']['substructure'],
                                    PDF_TRACK_PLUS_UNDER_ELEMENTS_SCORE: data['evaluation']['scoreSubstructure'],
                                    PDF_TRACK_SCORETOTAL: data['evaluation']['scoreTotal'],
                                    PDF_CUBE_TABLE: cubesHtml,
                                    PDF_LAYER_TABLE: layersHtml,
                                    PDF_YOUR_USED_SETS: setsHtml,
                                    PDF_COMMENTS: commentToPdf
                                };
                                mPdf.generatePdf(context, bodyTemplate, savePath, tokens, function (success) {
                                    if (!success)
                                        return callback(null);
                                    else
                                        callback(callbackUrl);
                                });
                            });
                        });
                    }, function (error) { return callback(kr3m.ERROR_DATABASE); });
                });
            };
            Track.prototype.isCellInMap = function (cubes, map) {
                for (var i = 0; i < cubes.length; i++) {
                    if (JSON.stringify(map) === JSON.stringify(cubes[i]['map']))
                        return cubes[i];
                }
                return null;
            };
            Track.prototype.getHistory = function (trackId, callback) {
                var previousVos = [];
                var forwardVos = [];
                var history = new cuboro.vo.History();
                history.previousTracks = previousVos;
                history.forwardTracks = forwardVos;
                tTracks.getById(trackId, function (track) {
                    if (!track)
                        return callback(history, kr3m.ERROR_EMPTY_DATA);
                    var tmp = track;
                    kr3m.async.Loop.loop(function (next) {
                        tmp.getPrevious(function (previous) {
                            if (!previous) {
                                next(false);
                            }
                            else {
                                history.previousTracks.push(new cuboro.vo.Track(previous, null));
                                tmp = previous;
                                next(true);
                            }
                        }, function (error) { return callback(history, kr3m.ERROR_EMPTY_DATA); });
                    }, function () {
                        track.getTracks(function (forwads) {
                            for (var i = 0; i < forwads.length; i++)
                                history.forwardTracks.push(new cuboro.vo.Track(forwads[i], null));
                            callback(history, kr3m.SUCCESS);
                        });
                    });
                }, function (error) { return callback(history, kr3m.ERROR_DATABASE); });
            };
            return Track;
        }());
        models.Track = Track;
    })(models = cuboro.models || (cuboro.models = {}));
})(cuboro || (cuboro = {}));
var mTrack = new cuboro.models.Track();
var cuboro;
(function (cuboro) {
    var services;
    (function (services) {
        var Pdf = (function (_super) {
            __extends(Pdf, _super);
            function Pdf() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Pdf.prototype.printPdf = function (context, params, callback) {
                var helper = new kr3m.services.ParamsHelper(params);
                if (!helper.validate({ trackId: "uint", screenshot: "string" }))
                    return callback(kr3m.ERROR_PARAMS);
                mTrack.printPdf(context, params.trackId, params.screenshot, callback);
            };
            return Pdf;
        }(services.Abstract));
        services.Pdf = Pdf;
    })(services = cuboro.services || (cuboro.services = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var services;
    (function (services) {
        var Track = (function (_super) {
            __extends(Track, _super);
            function Track() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Track.prototype.generateUniqueRandomName = function (context, params, callback) {
                var helper = new kr3m.services.ParamsHelper(params);
                if (!helper.validate({ namePrefix: "string" }))
                    return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));
                mPdf.generateUniqueRandomName(params.namePrefix, function (name, status) {
                    callback(new kr3m.services.CallbackResult(status, name));
                });
            };
            Track.prototype.load = function (context, params, callback) {
                var helper = new kr3m.services.ParamsHelper(params);
                if (!helper.validate({ trackId: "uint" }))
                    return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));
                mTrack.load(params.trackId, function (track, status) { return callback(new kr3m.services.CallbackResult(status, track)); });
            };
            Track.prototype.save = function (context, params, callback) {
                var helper = new kr3m.services.ParamsHelper(params);
                if (!helper.validate({ trackData: "object", name: "string", overwrite: "boolean" }))
                    return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));
                mUser.getFromContext(context, function (user) {
                    if (!user)
                        return callback(new kr3m.services.CallbackResult(kr3m.ERROR_DENIED));
                    mTrack.save(user.id, params.trackData, params.name, params.overwrite, params.previousId, function (track, status) {
                        callback(new kr3m.services.CallbackResult(status, track));
                    });
                });
            };
            Track.prototype.saveTrackImage = function (context, params, callback) {
                var helper = new kr3m.services.ParamsHelper(params);
                if (!helper.validate({ trackId: "number", name: "string", trackImage: "string" }))
                    return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));
                mUser.getFromContext(context, function (user) {
                    if (!user)
                        return callback(new kr3m.services.CallbackResult(kr3m.ERROR_DENIED));
                    mTrack.saveImageTrack(user.id, params.name, params.trackId, params.trackImage, function (imageUrl, status) {
                        callback(new kr3m.services.CallbackResult(status, imageUrl));
                    });
                });
            };
            Track.prototype["delete"] = function (context, params, callback) {
                var helper = new kr3m.services.ParamsHelper(params);
                if (!helper.validate({ trackId: "uint" }))
                    return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));
                mUser.getFromContext(context, function (user) {
                    if (!user)
                        return callback(new kr3m.services.CallbackResult(kr3m.ERROR_DENIED));
                    mTrack["delete"](user.id, params.trackId, function (status) { return callback(new kr3m.services.CallbackResult(status)); });
                });
            };
            Track.prototype.publish = function (context, params, callback) {
                var helper = new kr3m.services.ParamsHelper(params);
                if (!helper.validate({ trackId: "uint", name: "string" }))
                    return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));
                mUser.getFromContext(context, function (user) {
                    if (!user)
                        return callback(new kr3m.services.CallbackResult(kr3m.ERROR_DENIED));
                    mTrack.publish(user.id, params.trackId, params.name, function (status) { return callback(new kr3m.services.CallbackResult(status)); });
                });
            };
            Track.prototype.unpublish = function (context, params, callback) {
                var helper = new kr3m.services.ParamsHelper(params);
                if (!helper.validate({ trackId: "uint" }))
                    return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));
                mUser.getFromContext(context, function (user) {
                    if (!user)
                        return callback(new kr3m.services.CallbackResult(kr3m.ERROR_DENIED));
                    mTrack.unpublish(user.id, params.trackId, function (status) { return callback(new kr3m.services.CallbackResult(status)); });
                });
            };
            Track.prototype.isNameUnique = function (context, params, callback) {
                var helper = new kr3m.services.ParamsHelper(params);
                if (!helper.validate({ trackId: "uint", newName: "string" }))
                    return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));
                mTrack.isNameUnique(params.trackId, params.newName, function (isUnique, status) {
                    callback(new kr3m.services.CallbackResult(status, isUnique));
                });
            };
            Track.prototype.isPublished = function (context, params, callback) {
                var helper = new kr3m.services.ParamsHelper(params);
                if (!helper.validate({ trackId: "uint" }))
                    return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));
                mTrack.isPublished(params.trackId, function (isPublished, status) {
                    callback(new kr3m.services.CallbackResult(status, isPublished));
                });
            };
            Track.prototype.getHistory = function (context, params, callback) {
                var helper = new kr3m.services.ParamsHelper(params);
                if (!helper.validate({ trackId: "uint" }))
                    return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));
                mTrack.getHistory(params.trackId, function (status, history) { return callback(new kr3m.services.CallbackResult(history, status)); });
            };
            return Track;
        }(services.Abstract));
        services.Track = Track;
    })(services = cuboro.services || (cuboro.services = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var services;
    (function (services) {
        var User = (function (_super) {
            __extends(User, _super);
            function User() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            User.prototype.login = function (context, params, callback) {
                var helper = new kr3m.services.ParamsHelper(params);
                if (!helper.validate({ casUserId: "uint", casToken: "string" }))
                    return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));
                mUser.login(context, params.casUserId, params.casToken, function (user, status) { return callback(new kr3m.services.CallbackResult(status, user)); });
            };
            User.prototype.logout = function (context, params, callback) {
                mUser.logout(context, function (status) { return callback(new kr3m.services.CallbackResult(status)); });
            };
            return User;
        }(services.Abstract));
        services.User = User;
    })(services = cuboro.services || (cuboro.services = {}));
})(cuboro || (cuboro = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var handlers;
        (function (handlers) {
            var Abstract = (function (_super) {
                __extends(Abstract, _super);
                function Abstract(uriPattern) {
                    var _this = _super.call(this) || this;
                    _this.uriPattern = uriPattern;
                    return _this;
                }
                Abstract.prototype.accepts = function (context) {
                    return true;
                };
                Abstract.prototype.checkAuth = function (context, realm, user, password, callback) {
                    var match = user + ":" + password;
                    var auth = context.request.getHeader("authorization") || "";
                    var authDataBase64 = auth.substring(5);
                    var authData = decodeBase64EncodedString(authDataBase64);
                    if (authData == match)
                        return callback();
                    context.response.setHeader("WWW-Authenticate", "Basic realm=\"" + realm + "\"");
                    context.flush(net2.HTTP_ERROR_AUTH);
                };
                return Abstract;
            }(kr3m.model.EventDispatcher));
            handlers.Abstract = Abstract;
        })(handlers = net2.handlers || (net2.handlers = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var handlers;
        (function (handlers) {
            var AjaxGateway = (function (_super) {
                __extends(AjaxGateway, _super);
                function AjaxGateway(uriPattern) {
                    if (uriPattern === void 0) { uriPattern = /^\/gateway$/; }
                    var _this = _super.call(this, uriPattern) || this;
                    _this.handlers = {};
                    return _this;
                }
                AjaxGateway.prototype.on = function (serviceName, handler) {
                    this.handlers[serviceName] = handler;
                };
                AjaxGateway.prototype.registerObject = function (obj) {
                    var className = kr3m.util.Class.getClassNameOfInstance(obj);
                    for (var i in obj) {
                        if (typeof obj[i] == "function")
                            this.on(className + "." + i, obj[i].bind(obj));
                    }
                };
                AjaxGateway.prototype.registerClass = function (clas) {
                    var className = kr3m.util.Class.getNameOfClass(clas);
                    for (var i in clas) {
                        if (typeof clas[i] == "function")
                            this.on(className + "." + i, clas[i]);
                    }
                };
                AjaxGateway.prototype.getService = function (context, callback) {
                    context.request.getContent(function (content) {
                        if (!content)
                            return callback(null, null);
                        var match = content.match(/method=([^&]+)&/);
                        var serviceName = match ? match[1] : null;
                        if (!serviceName)
                            return callback(null, null);
                        match = content.match(/payload=([^&]*)/);
                        var params = null;
                        try {
                            if (match)
                                params = kr3m.util.Json.decode(decodeURIComponent(match[1]));
                        }
                        catch (exc) {
                            logWarning("failed to decode payload '" + content + "'", exc);
                        }
                        callback(serviceName, params);
                    });
                };
                AjaxGateway.prototype.handle = function (context) {
                    var _this = this;
                    context.response.disableBrowserCaching();
                    this.getService(context, function (serviceName, params) {
                        logVerbose("-->", serviceName, params);
                        var handler = _this.handlers[serviceName];
                        if (!handler) {
                            logDebug("ajax call for unknown service", serviceName, params);
                            return context.flush(500, "unknown service \"" + serviceName + "\"");
                        }
                        handler(context, params, function (response) {
                            logVerbose("<--", serviceName, response);
                            var json = kr3m.util.Json.encode(response);
                            context.flush(200, json, "text/json; charset=utf-8");
                        });
                    });
                };
                return AjaxGateway;
            }(handlers.Abstract));
            handlers.AjaxGateway = AjaxGateway;
        })(handlers = net2.handlers || (net2.handlers = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var cuboro;
(function (cuboro) {
    var handlers;
    (function (handlers) {
        var Gateway = (function (_super) {
            __extends(Gateway, _super);
            function Gateway() {
                var _this = _super.call(this, /^\/gateway$/) || this;
                _this.registerObject(new cuboro.services.Comment());
                _this.registerObject(new cuboro.services.Competition());
                _this.registerObject(new cuboro.services.Gallery());
                _this.registerObject(new cuboro.services.Mail());
                _this.registerObject(new cuboro.services.Pdf());
                _this.registerObject(new cuboro.services.Track());
                _this.registerObject(new cuboro.services.User());
                return _this;
            }
            return Gateway;
        }(kr3m.net2.handlers.AjaxGateway));
        handlers.Gateway = Gateway;
    })(handlers = cuboro.handlers || (cuboro.handlers = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var handlers;
    (function (handlers) {
        var Language = (function (_super) {
            __extends(Language, _super);
            function Language() {
                return _super.call(this, /\/lang_[a-z][a-z](?:[A-Z][A-Z])?\.json$/) || this;
            }
            Language.prototype.handle = function (context) {
                context.localization.getTexts(context, function (texts) {
                    var json = kr3m.util.Json.encode(texts);
                    context.flush(200, json, "application/json; charset=utf-8");
                });
            };
            return Language;
        }(kr3m.net2.handlers.Abstract));
        handlers.Language = Language;
    })(handlers = cuboro.handlers || (cuboro.handlers = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var tables;
    (function (tables) {
        var AdminSettingVO = (function () {
            function AdminSettingVO(rawData) {
                this.id = "";
                this.lastModifiedWhen = new Date();
                this.value = "";
                if (rawData) {
                    for (var i in rawData) {
                        if (cuboro.tables.AdminSettingVO.isColumnName(i))
                            this[i] = rawData[i];
                    }
                }
            }
            AdminSettingVO.isColumnName = function (name) {
                return (["id", "lastModifiedWhen", "value"]).indexOf(name) >= 0;
            };
            AdminSettingVO.getColumnNames = function () {
                return ["id", "lastModifiedWhen", "value"];
            };
            AdminSettingVO.buildFrom = function (raw) {
                var helper = new kr3m.services.ParamsHelper(raw);
                if (!helper.validate({ "id": "string", "lastModifiedWhen": "Date", "value": "string" }, { "id": "", "lastModifiedWhen": "CURRENT_TIMESTAMP", "value": "" }))
                    return null;
                var foreignKeyNames = [];
                var vo = new cuboro.tables.AdminSettingVO();
                var copyFields = ["id", "lastModifiedWhen", "value"];
                for (var i = 0; i < copyFields.length; ++i) {
                    vo[copyFields[i]] = raw[copyFields[i]];
                    if (!vo[copyFields[i]] && kr3m.util.Util.contains(foreignKeyNames, copyFields[i]))
                        vo[copyFields[i]] = null;
                }
                return vo;
            };
            AdminSettingVO.prototype.wrapErrorCallback = function (errorCallback, functionName) {
                if (!errorCallback)
                    return errorCallback;
                var newCallback = function (errorMessage) {
                    errorCallback("cuboro.tables.AdminSettingVO." + functionName + " - " + errorMessage);
                };
                return newCallback;
            };
            AdminSettingVO.prototype.postLoad = function () {
                var autoUpdateFields = ["lastModifiedWhen"];
                var oldValues = {};
                for (var i = 0; i < autoUpdateFields.length; ++i) {
                    var field = autoUpdateFields[i];
                    oldValues[field] = this[field];
                }
                Object.defineProperty(this, "__oldAutoUpdateFieldValues", { value: oldValues, enumerable: false });
            };
            AdminSettingVO.prototype.preStore = function () {
                var autoUpdateFields = ["lastModifiedWhen"];
                if (!this["__oldAutoUpdateFieldValues"])
                    Object.defineProperty(this, "__oldAutoUpdateFieldValues", { value: {}, enumerable: false });
                for (var i = 0; i < autoUpdateFields.length; ++i) {
                    var field = autoUpdateFields[i];
                    if (this[field] == this["__oldAutoUpdateFieldValues"][field])
                        delete this[field];
                    else
                        this["__oldAutoUpdateFieldValues"][field] = this[field];
                }
            };
            AdminSettingVO.prototype.postStore = function () {
                var autoUpdateFields = ["lastModifiedWhen"];
                for (var i = 0; i < autoUpdateFields.length; ++i) {
                    var field = autoUpdateFields[i];
                    this[field] = this["__oldAutoUpdateFieldValues"][field];
                }
            };
            AdminSettingVO.prototype.checkId = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "checkId");
                if (this.id)
                    return callback(false);
                kr3m.async.Loop.loop(function (loopDone) {
                    kr3m.util.Rand.getSecureString(128, null, function (secureValue) {
                        _this.id = secureValue;
                        db.fetchOne(db.escape("SELECT id FROM admin_settings WHERE id = ? LIMIT 0,1;", [_this.id]), function (dummy) { return loopDone(!!dummy); }, errorCallback);
                    });
                }, function () { return callback(true); });
            };
            AdminSettingVO.prototype.insert = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "insert");
                var retries = 3;
                kr3m.async.Loop.loop(function (loopDone) {
                    _this.checkId(function (wasGenerated) {
                        _this.preStore();
                        db.insert("admin_settings", _this, function () {
                            _this.postStore();
                            callback && callback();
                        }, function (errorMessage) {
                            if (!wasGenerated || retries <= 0 || errorMessage.indexOf("ER_DUP_ENTRY") < 0) {
                                if (errorCallback)
                                    return errorCallback(errorMessage);
                                logError(errorMessage);
                                return callback && callback();
                            }
                            logWarning(errorMessage);
                            logWarning("retrying");
                            --retries;
                            loopDone(true);
                        });
                    });
                });
            };
            AdminSettingVO.prototype.upsert = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "upsert");
                var retries = 3;
                kr3m.async.Loop.loop(function (loopDone) {
                    _this.checkId(function (wasGenerated) {
                        _this.preStore();
                        db.upsert("admin_settings", _this, function () {
                            _this.postStore();
                            callback && callback();
                        }, null, function (errorMessage) {
                            if (!wasGenerated || retries <= 0 || errorMessage.indexOf("ER_DUP_ENTRY") < 0) {
                                if (errorCallback)
                                    return errorCallback(errorMessage);
                                logError(errorMessage);
                                return callback && callback();
                            }
                            logWarning(errorMessage);
                            logWarning("retrying");
                            --retries;
                            loopDone(true);
                        });
                    });
                });
            };
            AdminSettingVO.prototype.update = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "update");
                this.preStore();
                db.update("admin_settings", this, function () {
                    _this.postStore();
                    callback && callback();
                }, "id", errorCallback);
            };
            AdminSettingVO.prototype["delete"] = function (callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "delete");
                var where = db.escape("id = ?", [this.id]);
                db.deleteBatch("admin_settings", where, callback, errorCallback);
            };
            AdminSettingVO.ID_MAX_LENGTH = 128;
            AdminSettingVO.ID_MAX_LENGTH_SECURE = 64;
            AdminSettingVO.VALUE_MAX_LENGTH = 128;
            AdminSettingVO.VALUE_MAX_LENGTH_SECURE = 64;
            return AdminSettingVO;
        }());
        tables.AdminSettingVO = AdminSettingVO;
    })(tables = cuboro.tables || (cuboro.tables = {}));
})(cuboro || (cuboro = {}));
var cuboro;
(function (cuboro) {
    var tables;
    (function (tables) {
        var AdminSettingsTable = (function () {
            function AdminSettingsTable() {
            }
            AdminSettingsTable.prototype.isColumnName = function (name) {
                return (["id", "lastModifiedWhen", "value"]).indexOf(name) >= 0;
            };
            AdminSettingsTable.prototype.getColumnNames = function () {
                return ["id", "lastModifiedWhen", "value"];
            };
            AdminSettingsTable.prototype.buildOrdering = function (ordering) {
                var parts = [];
                var ascDescRe = /^asc|desc$/i;
                for (var i = 0; i < ordering.length; ++i) {
                    if (this.isColumnName(ordering[i]))
                        parts.push(db.escapeId(ordering[i]));
                    else if (ascDescRe.test(ordering[i]) && parts.length > 0)
                        parts[parts.length - 1] += " " + ordering[i].toUpperCase();
                }
                return parts.length > 0 ? " ORDER BY " + parts.join(", ") : "";
            };
            AdminSettingsTable.prototype.getCount = function () {
                var u = kr3m.util.Util;
                var where = u.getFirstOfType(arguments, "string", 0, 0) || "1";
                where = where.replace(/^\s*where\s*/i, " ");
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                var sql = "SELECT COUNT(*) FROM `admin_settings` WHERE " + where;
                db.fetchOne(sql, callback, errorCallback);
            };
            AdminSettingsTable.prototype.wrapErrorCallback = function (errorCallback, functionName) {
                if (!errorCallback)
                    return errorCallback;
                var newCallback = function (errorMessage) {
                    errorCallback("cuboro.tables.AdminSettingVO." + functionName + " - " + errorMessage);
                };
                return newCallback;
            };
            AdminSettingsTable.prototype.get = function () {
                var u = kr3m.util.Util;
                var whereSql = u.getFirstOfType(arguments, "string", 0, 0) || "1";
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "get");
                var sql = "SELECT * FROM `admin_settings` WHERE " + whereSql;
                var ordering = u.getFirstOfType(arguments, "object", 0, 0) || [];
                if (ordering.length > 0)
                    sql += this.buildOrdering(ordering);
                var offset = u.getFirstOfType(arguments, "number", 0, 0) || 0;
                var limit = u.getFirstOfType(arguments, "number", 0, 1) || 0;
                if (limit > 0)
                    sql += db.escape(" LIMIT ?, ?", [offset, limit]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.AdminSettingVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows);
                }, errorCallback);
            };
            AdminSettingsTable.prototype.getIterative = function (where, dataCallback, doneCallback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getIterative");
                where = where.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT * FROM `admin_settings` WHERE " + where;
                db.queryIterative(sql, function (rows, nextBatch) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.AdminSettingVO).prototype;
                        rows[i].postLoad();
                    }
                    dataCallback(rows, nextBatch);
                }, doneCallback, 20, errorCallback);
            };
            AdminSettingsTable.prototype.updateRaw = function (rows, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "updateRaw");
                db.updateBatch("admin_settings", rows, callback, db.defaultBatchSize, "id", errorCallback);
            };
            AdminSettingsTable.prototype.fetchPage = function (where, orderBy, joins, offset, limit, callback) {
                db.fetchPage("admin_settings", where, orderBy, joins, offset, limit, function (rows, totalCount) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.AdminSettingVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(rows, totalCount);
                });
            };
            AdminSettingsTable.prototype.fetchCol = function () {
                var u = kr3m.util.Util;
                var colName = u.getFirstOfType(arguments, "string", 0, 0);
                var whereSql = u.getFirstOfType(arguments, "string", 0, 1) || "1";
                var offset = u.getFirstOfType(arguments, "number", 0, 0) || 0;
                var limit = u.getFirstOfType(arguments, "number", 0, 1) || 0;
                var ordering = u.getFirstOfType(arguments, "object", 0, 1) || [];
                var distinct = u.getFirstOfType(arguments, "boolean", 0, 0) || false;
                var callback = u.getFirstOfType(arguments, "function", 0, 0);
                var errorCallback = u.getFirstOfType(arguments, "function", 0, 1);
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchCol");
                if (!this.isColumnName(colName)) {
                    var error = "invalid column name for table admin_settings: " + colName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var limitSql = (limit > 0 || offset > 0) ? " LIMIT " + offset + ", " + (offset + limit) : "";
                var orderSql = this.buildOrdering(ordering);
                var distinctSql = distinct ? "DISTINCT " : "";
                var sql = "SELECT " + distinctSql + "`" + colName + "` FROM `admin_settings` WHERE " + whereSql + orderSql + limitSql;
                db.fetchCol(sql, callback, errorCallback);
            };
            AdminSettingsTable.prototype.fetchOne = function (colName, whereSql, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchOne");
                if (!this.isColumnName(colName)) {
                    var error = "invalid column name for table admin_settings: " + colName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback(undefined);
                }
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT `" + colName + "` FROM `admin_settings` WHERE " + whereSql + " LIMIT 1;";
                db.fetchOne(sql, callback, errorCallback);
            };
            AdminSettingsTable.prototype.fetchPairs = function (keyName, valueName, whereSql, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "fetchPairs");
                if (!this.isColumnName(keyName)) {
                    var error = "invalid column name for table admin_settings: " + keyName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                if (!this.isColumnName(valueName)) {
                    var error = "invalid column name for table admin_settings: " + valueName;
                    if (errorCallback)
                        return errorCallback(error);
                    logError(error);
                    return callback([]);
                }
                if (keyName == valueName)
                    valueName += "` AS `_" + valueName;
                whereSql = whereSql.replace(/^\s*where\s*/i, " ");
                var sql = "SELECT `" + keyName + "`, `" + valueName + "` FROM `admin_settings` WHERE " + whereSql;
                db.fetchPairs(sql, callback, errorCallback);
            };
            AdminSettingsTable.prototype.deleteWhere = function (where, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "deleteWhere");
                db.deleteBatch("admin_settings", where, callback, errorCallback);
            };
            AdminSettingsTable.prototype.getTableName = function () {
                return "admin_settings";
            };
            AdminSettingsTable.prototype.getDojo = function (params, callback, conditions, escapeArgs, errorCallback) {
                var _this = this;
                if (conditions === void 0) { conditions = []; }
                if (escapeArgs === void 0) { escapeArgs = []; }
                errorCallback = this.wrapErrorCallback(errorCallback, "getDojo");
                var columnNames = this.getColumnNames();
                var offset = params.start || 0;
                var limit = params.count || 20;
                var sort = params.sort || "id";
                for (var i = 0; i < columnNames.length; ++i) {
                    if (params.hasOwnProperty(columnNames[i]) && params[columnNames[i]]) {
                        conditions.push("`" + columnNames[i] + "` = ?");
                        escapeArgs.push(params[columnNames[i]]);
                    }
                }
                var where = db.escape(conditions.join(" AND "), escapeArgs);
                if (where == "")
                    where = "1";
                var ordering = [];
                if (sort.substring(0, 1) == "-")
                    ordering.push(sort, "ASC");
                else
                    ordering.push(sort, "DESC");
                this.getCount(where, function (count) {
                    _this.get(where, offset, limit, ordering, function (vos) { return callback(new kr3m.dojo.GridQueryResponse(vos, "id", count, "id", sort)); }, errorCallback);
                }, errorCallback);
            };
            AdminSettingsTable.prototype.upsertBatch = function (vos, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "upsertBatch");
                vos = vos.slice();
                var noIdVos = [];
                for (var i = 0; i < vos.length; ++i) {
                    if (!vos[i].id) {
                        noIdVos.push(vos[i]);
                        vos.splice(i--, 1);
                    }
                }
                for (var i = 0; i < vos.length; ++i)
                    vos[i].preStore();
                db.upsertBatch("admin_settings", vos, function () {
                    for (var i = 0; i < vos.length; ++i)
                        vos[i].postStore();
                    kr3m.async.Loop.forEach(noIdVos, function (noIdVo, next) {
                        noIdVo.upsert(next);
                    }, function () { return callback && callback(); });
                }, db.defaultBatchSize, null, errorCallback);
            };
            AdminSettingsTable.prototype.updateBatch = function (vos, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "updateBatch");
                for (var i = 0; i < vos.length; ++i) {
                    if (!vos[i].id) {
                        if (errorCallback)
                            return errorCallback("some vos are missing their id attribute in updateBatch call");
                        throw new Error("some vos are missing their id attribute in updateBatch call");
                    }
                }
                for (var i = 0; i < vos.length; ++i)
                    vos[i].preStore();
                db.updateBatch("admin_settings", vos, function () {
                    for (var i = 0; i < vos.length; ++i)
                        vos[i].postStore();
                    callback && callback();
                }, db.defaultBatchSize, "id", errorCallback);
            };
            AdminSettingsTable.prototype.insertBatch = function (vos, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "insertBatch");
                vos = vos.slice();
                var noIdVos = [];
                for (var i = 0; i < vos.length; ++i) {
                    if (!vos[i].id) {
                        noIdVos.push(vos[i]);
                        vos.splice(i--, 1);
                    }
                }
                for (var i = 0; i < vos.length; ++i)
                    vos[i].preStore();
                db.insertBatch("admin_settings", vos, function () {
                    for (var i = 0; i < vos.length; ++i)
                        vos[i].postStore();
                    kr3m.async.Loop.forEach(noIdVos, function (noIdVo, next) {
                        noIdVo.insert(next);
                    }, function () { return callback && callback(); });
                }, db.defaultBatchSize, errorCallback);
            };
            AdminSettingsTable.prototype.getFreeId = function (callback, errorCallback) {
                var _this = this;
                errorCallback = this.wrapErrorCallback(errorCallback, "getFreeId");
                var id;
                kr3m.async.Loop.loop(function (loopDone) {
                    kr3m.util.Rand.getSecureString(128, null, function (secString) {
                        id = secString;
                        _this.getById(id, function (dummy) { return loopDone(!!dummy); }, errorCallback);
                    });
                }, function () { return callback(id); });
            };
            AdminSettingsTable.prototype.getByIds = function (ids, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getByIds");
                if (ids.length == 0)
                    return callback({});
                var sql = "SELECT * FROM `admin_settings` WHERE `id` IN (?)";
                sql = db.escape(sql, [ids]);
                db.fetchAll(sql, function (rows) {
                    for (var i = 0; i < rows.length; ++i) {
                        rows[i].__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.AdminSettingVO).prototype;
                        rows[i].postLoad();
                    }
                    callback(kr3m.util.Util.arrayToAssoc(rows, "id"));
                }, errorCallback);
            };
            AdminSettingsTable.prototype.getById = function (id, callback, errorCallback) {
                errorCallback = this.wrapErrorCallback(errorCallback, "getById");
                var sql = "SELECT * FROM `admin_settings` WHERE `id` = ? LIMIT 0,1";
                sql = db.escape(sql, [id]);
                db.fetchRow(sql, function (row) {
                    if (!row)
                        return callback(undefined);
                    row.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.AdminSettingVO).prototype;
                    row.postLoad();
                    callback(row);
                }, errorCallback);
            };
            return AdminSettingsTable;
        }());
        tables.AdminSettingsTable = AdminSettingsTable;
    })(tables = cuboro.tables || (cuboro.tables = {}));
})(cuboro || (cuboro = {}));
var tAdminSettings = new cuboro.tables.AdminSettingsTable();
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
    var net2;
    (function (net2) {
        var handlers;
        (function (handlers) {
            var Status = (function (_super) {
                __extends(Status, _super);
                function Status(uriPattern, logFilePath) {
                    if (uriPattern === void 0) { uriPattern = /^\/status$/; }
                    if (logFilePath === void 0) { logFilePath = "server.log"; }
                    var _this = _super.call(this, uriPattern) || this;
                    _this.logFilePath = logFilePath;
                    return _this;
                }
                Status.prototype.getUptime = function () {
                    var duration = Math.floor(process.uptime() * 1000);
                    return kr3m.util.StringEx.getDurationString(duration);
                };
                Status.prototype.getLogTail = function (callback) {
                    fsLib.readFile(this.logFilePath, { encoding: "utf8" }, function (err, content) {
                        if (err)
                            return callback("", 0);
                        var lines = content.split(/\r?\n/);
                        var tail = lines.slice(-200).join("\n");
                        callback(tail, content.length);
                    });
                };
                Status.prototype.getStatus = function (callback) {
                    var status = {};
                    status["Server"] = status["Server"] || {};
                    status["Server"]["Framework Version"] = kr3m.VERSION;
                    status["Server"]["Local Time"] = kr3m.util.Dates.getDateTimeString(new Date(), false);
                    status["Server"]["Uptime"] = this.getUptime();
                    status["Server"]["CPU Count"] = osLib.cpus().length;
                    status["Server"]["CPU Usage"] = kr3m.getCpuUsage().map(function (usage) { return (usage * 100).toFixed(2) + "%"; }).join(", ");
                    status["Server"]["Process Memory Usage"] = getMemoryUseString();
                    status["Server"]["Build"] = "Debug";
                    callback(status);
                };
                Status.prototype.getStatusHtml = function (callback) {
                    var _this = this;
                    this.getStatus(function (status) {
                        _this.getLogTail(function (tail, logSize) {
                            status["Log File"] = status["Log File"] || {};
                            status["Log File"]["File Path"] = _this.logFilePath;
                            status["Log File"]["Total Size"] = kr3m.util.StringEx.getSizeString(logSize);
                            var html = "";
                            for (var group in status) {
                                html += "<b>" + group + "</b><br/>\n";
                                for (var property in status[group])
                                    html += property + " : " + status[group][property] + "<br/>\n";
                                html += "<br/>\n";
                            }
                            if (tail) {
                                var helper = new kr3m.html.Helper();
                                html += helper.consoleToHtml(tail);
                            }
                            callback(html);
                        });
                    });
                };
                Status.prototype.handle = function (context) {
                    var _this = this;
                    this.checkAuth(context, "Minimal Security Area", "kr3m", "nan", function () {
                        _this.getStatusHtml(function (status) {
                            var html = "<!DOCTYPE html><html><head><title>Server Status</title></head><body>" + status + "</body></html>";
                            context.response.disableBrowserCaching();
                            context.flush(200, html, "text/html; charset=utf-8");
                        });
                    });
                };
                return Status;
            }(handlers.Abstract));
            handlers.Status = Status;
        })(handlers = net2.handlers || (net2.handlers = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var cuboro;
(function (cuboro) {
    var handlers;
    (function (handlers) {
        var Status = (function (_super) {
            __extends(Status, _super);
            function Status() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Status.prototype.getStatus = function (callback) {
                _super.prototype.getStatus.call(this, function (status) {
                    var join = new kr3m.async.Join();
                    tAdminSettings.getById("DB_VERSION", join.getCallback("dbVersion"));
                    db.getDatabaseSize(join.getCallback("dbSize"));
                    join.addCallback(function () {
                        status["Server"] = status["Server"] || {};
                        status["Server"]["Version"] = cuboro.VERSION;
                        status["Database"] = status["Database"] || {};
                        status["Database"]["Host"] = db.config.host;
                        status["Database"]["Name"] = db.config.database;
                        status["Database"]["Expected Version"] = cuboro.DB_VERSION;
                        var dbVersion = join.getResult("dbVersion");
                        status["Database"]["Version"] = dbVersion ? dbVersion.value : "-";
                        var dbSize = join.getResult("dbSize");
                        status["Database"]["Size"] = kr3m.util.StringEx.getSizeString(dbSize);
                        callback(status);
                    });
                });
            };
            return Status;
        }(kr3m.net2.handlers.Status));
        handlers.Status = Status;
    })(handlers = cuboro.handlers || (cuboro.handlers = {}));
})(cuboro || (cuboro = {}));
var kr3m;
(function (kr3m) {
    var xml;
    (function (xml) {
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
        xml.Parser = Parser;
        function parseString(rawXml) {
            var parser = new kr3m.xml.Parser();
            return parser.parse(rawXml);
        }
        xml.parseString = parseString;
        function parseLocalFile(path, callback) {
            fsLib.readFile(path, { encoding: "utf8" }, function (err, rawXml) {
                if (err) {
                    logError(err);
                    return callback(undefined);
                }
                callback(parseString(kr3m.util.StringEx.stripBom(rawXml)));
            });
        }
        xml.parseLocalFile = parseLocalFile;
        function parseLocalFileSync(path) {
            try {
                var rawXml = fsLib.readFileSync(path, { encoding: "utf8" });
                return parseString(kr3m.util.StringEx.stripBom(rawXml));
            }
            catch (err) {
                logError(err);
                return undefined;
            }
        }
        xml.parseLocalFileSync = parseLocalFileSync;
    })(xml = kr3m.xml || (kr3m.xml = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var localizations;
        (function (localizations) {
            var Simple = (function (_super) {
                __extends(Simple, _super);
                function Simple(config) {
                    var _this = _super.call(this, config) || this;
                    _this.config = config;
                    _this.cachedTexts = {};
                    _this.timestamps = {};
                    _this.dependencies = {};
                    _this.setFormatter("date", function (value, id, name, texts) { return _this.formatDate("FORMAT_DATE", value, texts); });
                    _this.setFormatter("dateTime", function (value, id, name, texts) { return _this.formatDate("FORMAT_DATETIME", value, texts); });
                    _this.setFormatter("time", function (value, id, name, texts) { return _this.formatDate("FORMAT_TIME", value, texts); });
                    return _this;
                }
                Simple.prototype.loadXml = function (path, callback) {
                    kr3m.xml.parseLocalFile(path, function (xml) {
                        var texts = {};
                        var items = xml.text.length ? xml.text : [xml.text];
                        for (var i = 0; i < items.length; ++i)
                            texts[items[i]._attributes["id"]] = items[i]._data;
                        callback(texts);
                    });
                };
                Simple.prototype.loadJson = function (path, callback) {
                    kr3m.util.File.loadJsonFile(path, callback);
                };
                Simple.prototype.loadFromSource = function (path, callback) {
                    var _this = this;
                    kr3m.util.File.fileExists(path, function (exists) {
                        if (!exists)
                            return callback(undefined);
                        var extension = kr3m.util.File.getExtension(path);
                        switch (extension) {
                            case ".xml":
                                return _this.loadXml(path, callback);
                            case ".json":
                                return _this.loadJson(path, callback);
                            default:
                                return callback(undefined);
                        }
                    });
                };
                Simple.prototype.onLangFileChanged = function (langFile) {
                    var hashes = this.dependencies[langFile] || [];
                    logDebug("language file ", langFile, "has changed, clearing caches", hashes);
                    for (var i = 0; i < hashes.length; ++i)
                        delete this.cachedTexts[hashes[i]];
                };
                Simple.prototype.getSourceFiles = function (context, callback) {
                    var _this = this;
                    this.getLoadOrder(context, function (locales) {
                        var langFiles = locales.map(function (locale) { return _this.config.filePath + "/lang_" + locale + "." + _this.config.extension; });
                        callback(langFiles);
                    });
                };
                Simple.prototype.getTexts = function (context, callback) {
                    var _this = this;
                    this.getHash(context, function (hash) {
                        if (_this.cachedTexts[hash])
                            return callback(_this.cachedTexts[hash]);
                        _this.getSourceFiles(context, function (langFiles) {
                            var join = new kr3m.async.Join();
                            for (var i = 0; i < langFiles.length; ++i)
                                _this.loadFromSource(langFiles[i], join.getCallback(i));
                            join.addCallback(function () {
                                var texts = {};
                                for (var i = 0; i < langFiles.length; ++i) {
                                    var joinTexts = join.getResult(i);
                                    if (!joinTexts) {
                                        logDebug("could not load localization file", langFiles[i]);
                                        continue;
                                    }
                                    texts = kr3m.util.Util.mergeAssoc(texts, joinTexts);
                                    if (!_this.dependencies[langFiles[i]]) {
                                        _this.dependencies[langFiles[i]] = [];
                                        fsLib.watch(langFiles[i], { persistant: false }, _this.onLangFileChanged.bind(_this, langFiles[i]));
                                    }
                                    if (_this.dependencies[langFiles[i]].indexOf(hash) < 0)
                                        _this.dependencies[langFiles[i]].push(hash);
                                }
                                _this.cachedTexts[hash] = texts;
                                _this.timestamps[hash] = Date.now();
                                callback(texts);
                            });
                        });
                    });
                };
                Simple.prototype.getTimestamp = function (context, callback) {
                    var _this = this;
                    this.getHash(context, function (hash) {
                        if (_this.timestamps[hash])
                            return callback(_this.timestamps[hash]);
                        _this.getTexts(context, function () { return callback(_this.timestamps[hash]); });
                    });
                };
                Simple.prototype.getFormattedToken = function (texts, rawId, tokens) {
                    if (!tokens)
                        return "";
                    if (!rawId)
                        return "";
                    var _a = rawId.split(":"), tokenId = _a[0], formatterName = _a[1];
                    if (!tokenId)
                        return "";
                    var value = tokens[tokenId];
                    if (value === undefined)
                        return "";
                    if (formatterName) {
                        if (this.formatters[formatterName])
                            return this.formatters[formatterName](value, tokenId, formatterName, texts);
                        else
                            logDebug("unknown formatter", formatterName);
                    }
                    return value.toString();
                };
                Simple.prototype.getFormattedLoc = function (texts, rawId, tokens) {
                    var _this = this;
                    if (!rawId)
                        return "";
                    var _a = rawId.split(":"), locId = _a[0], formatterName = _a[1];
                    if (!locId)
                        return "";
                    var value = texts[locId];
                    if (value === undefined)
                        logDebug("unknown localization id", locId);
                    else
                        value = value.replace(/\#\#(.+?)\#\#/gi, function (match, tokenId) { return _this.getFormattedToken(texts, tokenId, tokens); });
                    if (formatterName) {
                        if (this.formatters[formatterName])
                            value = this.formatters[formatterName](value, locId, formatterName, texts);
                        else
                            logDebug("unknown formatter", formatterName);
                    }
                    return value;
                };
                Simple.prototype.parseSync = function (texts, text, tokens) {
                    var _this = this;
                    text = text.replace(/\bloc\(([^\)]+)\)/gi, function (match, rawId) { return _this.getFormattedLoc(texts, rawId, tokens); });
                    text = text.replace(/\#\#(.+?)\#\#/gi, function (match, tokenId) { return _this.getFormattedToken(texts, tokenId, tokens); });
                    return text;
                };
                Simple.prototype.parse = function (context, text, tokens, callback) {
                    var _this = this;
                    this.getTexts(context, function (texts) {
                        callback(_this.parseSync(texts, text, tokens));
                    });
                };
                Simple.prototype.getLoc = function (context, callback) {
                    var _this = this;
                    this.getTexts(context, function (texts) {
                        var loc = _this.getFormattedLoc.bind(_this, texts);
                        callback(loc);
                    });
                };
                Simple.prototype.getSyncParseFunc = function (context, callback) {
                    var _this = this;
                    this.getTexts(context, function (texts) {
                        var parseFunc = _this.parseSync.bind(_this, texts);
                        callback(parseFunc);
                    });
                };
                Simple.prototype.getDateTokens = function (dateObj) {
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
                Simple.prototype.formatDate = function (formatId, dateObj, texts) {
                    if (dateObj === null || dateObj == "0000-00-00" || dateObj == "0000-00-00 00:00:00")
                        return "";
                    if (!(dateObj instanceof Date))
                        dateObj = new Date(dateObj);
                    var tokens = this.getDateTokens(dateObj);
                    return this.getFormattedLoc(texts, formatId, tokens);
                };
                return Simple;
            }(localizations.Abstract));
            localizations.Simple = Simple;
        })(localizations = net2.localizations || (net2.localizations = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var cuboro;
(function (cuboro) {
    var Localization = (function (_super) {
        __extends(Localization, _super);
        function Localization() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Localization.prototype.getHash = function (context, callback) {
            var _this = this;
            context.need({ locales: true, region: true }, function () {
                var matches = context.request.getUri().match(/^.*\/lang_([a-z][a-z](?:[A-Z][A-Z])?)\.json\b.*$/);
                var hash = matches ? matches[1] : "";
                kr3m.async.If.then(!hash, function (thenDone) {
                    _super.prototype.getHash.call(_this, context, function (supHash) {
                        hash = supHash;
                        thenDone();
                    });
                }, function () {
                    if (hash.length == 2)
                        hash += context.region.regionId;
                    callback(hash);
                });
            }, function () { return callback(_this.config.fallbackLocale); });
        };
        return Localization;
    }(kr3m.net2.localizations.Simple));
    cuboro.Localization = Localization;
})(cuboro || (cuboro = {}));
var kr3m;
(function (kr3m) {
    var db;
    (function (db_1) {
        var MySqlDbUpdater = (function () {
            function MySqlDbUpdater(db, deltaFolder, settingsTableName) {
                if (deltaFolder === void 0) { deltaFolder = "database"; }
                if (settingsTableName === void 0) { settingsTableName = "admin_settings"; }
                this.db = db;
                this.deltaFolder = deltaFolder;
                this.settingsTableName = settingsTableName;
                this.deltaPattern = /^delta_\d+\.\d+\.\d+\.\d+\.sql$/;
            }
            MySqlDbUpdater.prototype.compareVersion = function (a, b) {
                for (var i = 0; i < a.length; ++i) {
                    if (a[i] != b[i])
                        return a[i] - b[i];
                }
                return 0;
            };
            MySqlDbUpdater.prototype.getCurrentVersion = function (callback) {
                var sql = "SELECT `value` FROM `" + this.settingsTableName + "` WHERE `id` = 'DB_VERSION' LIMIT 1;";
                this.db.fetchOne(sql, callback);
            };
            MySqlDbUpdater.prototype.setCurrentVersion = function (version, callback) {
                var sql = "UPDATE `" + this.settingsTableName + "` SET `value` = ? WHERE `id` = 'DB_VERSION' LIMIT 1;";
                sql = this.db.escape(sql, [version.join(".")]);
                this.db.query(sql, function () { return callback(); });
            };
            MySqlDbUpdater.prototype.getDeltaScripts = function (current, desired, callback) {
                var _this = this;
                var deltaVersions = [];
                kr3m.util.File.crawl(this.deltaFolder, function (relativePath, isFolder, absolutePath) {
                    var deltaVersion = kr3m.util.StringEx.getVersionParts(relativePath.slice(6, -4));
                    if ((_this.compareVersion(current, deltaVersion) < 0) && (_this.compareVersion(deltaVersion, desired) <= 0))
                        deltaVersions.push(deltaVersion);
                }, { wantFolders: false, pattern: this.deltaPattern });
                deltaVersions.sort(function (a, b) { return _this.compareVersion(a, b); });
                var deltas = [];
                kr3m.async.Loop.forEach(deltaVersions, function (deltaVersion, next) {
                    var deltaPath = _this.deltaFolder + "/delta_" + deltaVersion.join(".") + ".sql";
                    fsLib.readFile(deltaPath, "utf-8", function (err, sql) {
                        if (err)
                            throw err;
                        deltas.push({ version: deltaVersion, sql: sql });
                        next();
                    });
                }, function () { return callback(deltas); });
            };
            MySqlDbUpdater.prototype.update = function (desiredVersion, callback) {
                var _this = this;
                if (!clusterLib || !clusterLib.worker)
                    logDebug("checking database version");
                this.getCurrentVersion(function (currentVersion) {
                    if (!currentVersion) {
                        logError("database has no determinable version, aborting update");
                        return callback(kr3m.ERROR_DATABASE);
                    }
                    var current = kr3m.util.StringEx.getVersionParts(currentVersion, 4);
                    var desired = kr3m.util.StringEx.getVersionParts(desiredVersion, 4);
                    if (_this.compareVersion(current, desired) == 0) {
                        if (!clusterLib || !clusterLib.worker)
                            logDebug("database is up to date");
                        return callback(kr3m.SUCCESS);
                    }
                    if (clusterLib && clusterLib.worker) {
                        logWarning("old database version detected in worker, waiting for update");
                        kr3m.async.Loop.loop(function (loopDone) {
                            logVerbose("checking version again");
                            _this.getCurrentVersion(function (currentVersion) {
                                current = kr3m.util.StringEx.getVersionParts(currentVersion, 4);
                                if (_this.compareVersion(current, desired) == 0)
                                    return callback(kr3m.SUCCESS);
                                setTimeout(function () { return loopDone(true); }, 1000);
                            });
                        });
                    }
                    else {
                        _this.getDeltaScripts(current, desired, function (deltas) {
                            kr3m.async.Loop.forEach(deltas, function (delta, next) {
                                logWarning("applying database delta", delta.version.join("."));
                                logWarning(delta.sql);
                                _this.db.query(delta.sql, function () {
                                    logWarning("delta applied", delta.version.join("."));
                                    _this.setCurrentVersion(delta.version, next);
                                }, function (errorMessage) {
                                    logError("error while updating database");
                                    logError(errorMessage);
                                    callback(kr3m.ERROR_DATABASE);
                                });
                            }, function () {
                                _this.getCurrentVersion(function (currentVersion) {
                                    if (currentVersion == desiredVersion) {
                                        logDebug("updated database");
                                        callback(kr3m.SUCCESS);
                                    }
                                    else {
                                        logError("database version still not up to date - some delta files are propably missing");
                                        callback(kr3m.ERROR_DATABASE);
                                    }
                                });
                            });
                        });
                    }
                });
            };
            return MySqlDbUpdater;
        }());
        db_1.MySqlDbUpdater = MySqlDbUpdater;
    })(db = kr3m.db || (kr3m.db = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var mulproc;
    (function (mulproc) {
        function getWorkerName(id) {
            return "W" + ("00" + id).slice(-3);
        }
        mulproc.getWorkerName = getWorkerName;
        function adjustLog(useLogColors) {
            if (useLogColors === void 0) { useLogColors = true; }
            var L = kr3m.util.Log;
            if (!useLogColors)
                L.disableColors();
            var colors = [
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
            console.log = function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                return oldLog.apply(void 0, [prefix].concat(params));
            };
            var oldError = console.error.bind(console);
            console.error = function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                return oldError.apply(void 0, [prefix].concat(params));
            };
        }
        mulproc.adjustLog = adjustLog;
    })(mulproc = kr3m.mulproc || (kr3m.mulproc = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var mulproc;
    (function (mulproc) {
        ;
        var Cluster = (function () {
            function Cluster() {
                var _this = this;
                this.persistantMeta = {};
                this.persistantWorkerTypes = {};
                this.volatileFuncs = {};
                this.volatileCallbacks = {};
                this.listeners = {};
                this.unknownListeners = [];
                this.callbacks = {};
                this.running = false;
                this.suicide = false;
                this.id = Cluster.freeClusterId++;
                if (clusterLib.isMaster)
                    clusterLib.on("message", function (worker, msg) { return _this.handleMessage(msg); });
                else
                    process.on("message", function (msg) { return _this.handleMessage(msg); });
            }
            Cluster.prototype.handleMessage = function (msg) {
                if (!msg || !msg.name || msg.clusterId != this.id)
                    return;
                if (msg.name == Cluster.MSG_CALLBACK)
                    return this.handleCallback(msg);
                this.dispatchMessageEvent(msg);
            };
            Cluster.prototype.handleCallback = function (envelope) {
                var callback = this.callbacks[envelope.callbackId];
                if (callback) {
                    delete this.callbacks[envelope.callbackId];
                    callback(envelope.params);
                }
            };
            Cluster.prototype.buildMessage = function (name, params) {
                var msg = {
                    clusterId: this.id,
                    senderWorkerId: clusterLib.isMaster ? undefined : clusterLib.worker.id,
                    name: name,
                    params: params
                };
                return msg;
            };
            Cluster.prototype.send = function () {
                var msg = arguments[0];
                var workerId = kr3m.util.Util.getFirstOfType(arguments, "number")
                    || kr3m.util.Util.getFirstOfType(arguments, "string");
                var callback = kr3m.util.Util.getFirstOfType(arguments, "function");
                if (callback) {
                    var callbackId = Cluster.freeCallbackId++;
                    this.callbacks[callbackId] = callback;
                    msg.callbackId = callbackId;
                }
                if (clusterLib.isMaster) {
                    if (workerId === undefined) {
                        this.dispatchMessageEvent(msg);
                    }
                    else {
                        if (this.persistantWorkerTypes[workerId] || this.volatileCallbacks[workerId])
                            clusterLib.workers[workerId].send(msg);
                    }
                }
                else {
                    if (workerId === undefined) {
                        process.send(msg);
                    }
                    else {
                        var envelope = this.buildMessage(Cluster.MSG_FORWARD, envelope);
                        process.send(envelope);
                    }
                }
            };
            Cluster.prototype.sendReply = function (msg, response) {
                var reply = this.buildMessage(Cluster.MSG_CALLBACK, response);
                reply.callbackId = msg.callbackId;
                this.send(reply, msg.senderWorkerId);
            };
            Cluster.prototype.dispatchMessageEvent = function (msg) {
                var _this = this;
                var callback;
                var isFirst = true;
                if (msg.callbackId) {
                    callback = function (response) {
                        if (!isFirst)
                            return;
                        isFirst = false;
                        _this.sendReply(msg, response);
                    };
                }
                var listeners = this.listeners[msg.name] || [];
                for (var i = 0; i < listeners.length; ++i)
                    listeners[i](msg, callback);
                if (listeners.length == 0) {
                    for (var i = 0; i < this.unknownListeners.length; ++i)
                        this.unknownListeners[i](msg, callback);
                }
            };
            Cluster.prototype.broadcast = function (name, params) {
                var msg = this.buildMessage(name, params);
                if (clusterLib.isMaster) {
                    for (var id in clusterLib.workers) {
                        if (this.persistantWorkerTypes[id] !== undefined)
                            clusterLib.workers[id].send(msg);
                    }
                    this.dispatchMessageEvent(msg);
                }
                else {
                    var envelope = this.buildMessage(Cluster.MSG_BROADCAST, msg);
                    process.send(envelope);
                }
            };
            Cluster.prototype.sendPersistant = function (persistantType, name, params, callback) {
                var _this = this;
                var msg = this.buildMessage(name, params);
                if (clusterLib.isMaster) {
                    var workerIds = Object.keys(this.persistantWorkerTypes);
                    workerIds = workerIds.filter(function (workerId) { return _this.persistantWorkerTypes[workerId] == persistantType; });
                    if (workerIds.length == 0)
                        return logWarning("unknown persistant type:", persistantType);
                    var workerId = kr3m.util.Rand.getElement(workerIds);
                    this.send(msg, workerId, callback);
                }
                else {
                    var envelope = this.buildMessage(Cluster.MSG_FORWARD_PERSISTANT, msg);
                    envelope.targetPersistantType = persistantType;
                    this.send(envelope, callback);
                }
            };
            Cluster.prototype.on = function (name, listener) {
                if (!this.listeners[name])
                    this.listeners[name] = [];
                this.listeners[name].push(listener);
            };
            Cluster.prototype.onUnknown = function (listener) {
                this.unknownListeners.push(listener);
            };
            Cluster.prototype.setMaster = function (masterFunc) {
                this.masterFunc = masterFunc;
            };
            Cluster.prototype.startPersistantWorker = function (persistantType) {
                var options = this.persistantMeta[persistantType].options;
                var count = options.staggered ? 1 : (options.count || 1);
                for (var i = 0; i < count; ++i) {
                    var worker = clusterLib.fork({ persistantType: persistantType });
                    this.persistantWorkerTypes[worker.id] = persistantType;
                }
            };
            Cluster.prototype.registerPersistant = function (persistantType, options, func) {
                this.persistantMeta[persistantType] = { options: options, func: func };
                if (this.running) {
                    if (clusterLib.isMaster)
                        this.startPersistantWorker(persistantType);
                    else if (process.env.persistantType == persistantType)
                        this.runPersistantWorker(persistantType);
                }
            };
            Cluster.prototype.onWorkerExit = function (worker) {
                if (this.volatileCallbacks[worker.id]) {
                    var errorCallback = this.volatileCallbacks[worker.id].errorCallback;
                    delete this.volatileCallbacks[worker.id];
                    errorCallback && errorCallback("worker exit");
                }
                if (this.persistantWorkerTypes[worker.id] !== undefined) {
                    if (!this.suicide && !worker.suicide) {
                        log(mulproc.getWorkerName(worker.id) + " has exit");
                        var persistantType = this.persistantWorkerTypes[worker.id];
                        log("restarting persistant worker");
                        var newWorker = clusterLib.fork({ persistantType: persistantType });
                        this.persistantWorkerTypes[newWorker.id] = persistantType;
                    }
                    delete this.persistantWorkerTypes[worker.id];
                }
            };
            Cluster.prototype.onWorkerDisconnect = function (worker) {
                if (this.volatileCallbacks[worker.id]) {
                    var errorCallback = this.volatileCallbacks[worker.id].errorCallback;
                    delete this.volatileCallbacks[worker.id];
                    errorCallback && errorCallback("worker disconnected");
                }
                if (this.persistantWorkerTypes[worker.id] !== undefined) {
                    if (!this.suicide && !worker.suicide)
                        log(mulproc.getWorkerName(worker.id) + " has disconnected");
                }
            };
            Cluster.prototype.runMaster = function () {
                var _this = this;
                if (!clusterLib.isMaster)
                    throw new Error("Clusters can only be run from the master process");
                clusterLib.on("disconnect", this.onWorkerDisconnect.bind(this));
                clusterLib.on("exit", this.onWorkerExit.bind(this));
                this.on(Cluster.MSG_BROADCAST, function (msg) { return _this.broadcast(msg.params.name, msg.params.params); });
                this.on(Cluster.MSG_PERSISTANTINIT, this.handlePersistantInitialized.bind(this));
                this.on(Cluster.MSG_VOLATILECALLBACK, this.handleVolatileReturn.bind(this));
                this.on(Cluster.MSG_FORWARD, function (envelope) {
                    var msg = envelope.params;
                    if (envelope.callbackId)
                        _this.send(msg, function (response) { return _this.sendReply(envelope, response); });
                    else
                        _this.send(msg);
                });
                this.on(Cluster.MSG_FORWARD_PERSISTANT, function (envelope) {
                    var msg = envelope.params;
                    if (envelope.callbackId)
                        _this.sendPersistant(envelope.targetPersistantType, msg.name, msg.params, function (response) { return _this.sendReply(envelope, response); });
                    else
                        _this.sendPersistant(envelope.targetPersistantType, msg.name, msg.params);
                });
                for (var persistantType in this.persistantMeta)
                    this.startPersistantWorker(persistantType);
                this.masterFunc && this.masterFunc();
            };
            Cluster.prototype.handlePersistantInitialized = function (msg) {
                var workerId = msg.senderWorkerId;
                var persistantType = this.persistantWorkerTypes[workerId];
                if (persistantType === undefined)
                    return;
                var options = this.persistantMeta[persistantType].options;
                var runningCount = 0;
                var count = options.count || 1;
                if (count < 2)
                    return;
                for (var id in this.persistantWorkerTypes) {
                    if (this.persistantWorkerTypes[id] == persistantType)
                        ++runningCount;
                }
                if (runningCount >= count)
                    return;
                var worker = clusterLib.fork({ persistantType: persistantType });
                this.persistantWorkerTypes[worker.id] = persistantType;
            };
            Cluster.prototype.persistantInitialized = function () {
                var msg = this.buildMessage(Cluster.MSG_PERSISTANTINIT);
                process.send(msg);
            };
            Cluster.prototype.runPersistantWorker = function (persistantType) {
                this.persistantMeta[persistantType].func();
                this.on(Cluster.MSG_SHUTDOWN, function () {
                    process["disconnect"]();
                    setTimeout(function () { return process.exit(0); }, 500);
                });
            };
            Cluster.prototype.runVolatileWorker = function (type, params) {
                this.volatileFuncs[type](params, this.returnVolatile.bind(this));
                this.on(Cluster.MSG_SHUTDOWN, function () {
                    process["disconnect"]();
                    setTimeout(function () { return process.exit(0); }, 500);
                });
            };
            Cluster.prototype.handleVolatileReturn = function (msg) {
                var workerId = msg.senderWorkerId;
                if (this.volatileCallbacks[workerId]) {
                    var callback = this.volatileCallbacks[workerId].callback;
                    delete this.volatileCallbacks[workerId];
                    callback && callback(msg.params);
                }
            };
            Cluster.prototype.returnVolatile = function (response) {
                var msg = this.buildMessage(Cluster.MSG_VOLATILECALLBACK, response);
                process.send(msg);
            };
            Cluster.prototype.registerVolatile = function (volatileType, func) {
                this.volatileFuncs[volatileType] = func;
            };
            Cluster.prototype.runVolatile = function (volatileType, params, callback, errorCallback) {
                log("starting volatile worker", volatileType);
                var workerParams = {
                    volatileType: volatileType,
                    volatileParams: kr3m.util.Json.encode(params)
                };
                var worker = clusterLib.fork(workerParams);
                this.volatileCallbacks[worker.id] = { callback: callback, errorCallback: errorCallback };
            };
            Cluster.prototype.run = function () {
                if (this.running)
                    return;
                this.running = true;
                if (clusterLib.isMaster) {
                    this.runMaster();
                }
                else if (typeof process.env.persistantType == "string") {
                    var persistantType = process.env.persistantType;
                    if (this.persistantMeta[persistantType])
                        this.runPersistantWorker(persistantType);
                }
                else if (typeof process.env.volatileType == "string") {
                    var volatileType = process.env.volatileType;
                    var volatileParams = kr3m.util.Json.decode(process.env.volatileParams);
                    this.runVolatileWorker(volatileType, volatileParams);
                }
            };
            Cluster.prototype.shutdown = function (callback) {
                var _this = this;
                if (!clusterLib.isMaster)
                    return;
                if (this.suicide)
                    return;
                this.suicide = true;
                this.broadcast(Cluster.MSG_SHUTDOWN);
                setTimeout(function () {
                    for (var id in clusterLib.workers) {
                        if (_this.persistantWorkerTypes[id] !== undefined) {
                            log("terminating worker", id);
                            clusterLib.workers[id].kill("SIGTERM");
                        }
                    }
                    setTimeout(function () {
                        for (var id in clusterLib.workers) {
                            if (_this.persistantWorkerTypes[id] !== undefined) {
                                logWarning("killing worker", id);
                                clusterLib.workers[id].kill("SIGKILL");
                            }
                        }
                        callback();
                    }, 1000);
                }, 500);
            };
            Cluster.freeClusterId = 1;
            Cluster.freeCallbackId = 1;
            Cluster.MSG_BROADCAST = "__BROADCAST";
            Cluster.MSG_CALLBACK = "__CALLBACK";
            Cluster.MSG_FORWARD = "__FORWARD";
            Cluster.MSG_FORWARD_PERSISTANT = "__FORWARD_PERSISTANT";
            Cluster.MSG_PERSISTANTINIT = "__PERSISTANTINIT";
            Cluster.MSG_SHUTDOWN = "__SHUTDOWN";
            Cluster.MSG_VOLATILECALLBACK = "__VOLATILECALLBACK";
            return Cluster;
        }());
        mulproc.Cluster = Cluster;
    })(mulproc = kr3m.mulproc || (kr3m.mulproc = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var configs;
        (function (configs) {
            var Http = (function () {
                function Http() {
                    this.port = 80;
                }
                return Http;
            }());
            configs.Http = Http;
        })(configs = net2.configs || (net2.configs = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var configs;
        (function (configs) {
            var Https = (function () {
                function Https() {
                    this.port = 443;
                }
                return Https;
            }());
            configs.Https = Https;
        })(configs = net2.configs || (net2.configs = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var configs;
        (function (configs) {
            var Sandbox = (function () {
                function Sandbox() {
                    this.allowFileAccess = true;
                    this.allowWebAccess = true;
                }
                return Sandbox;
            }());
            configs.Sandbox = Sandbox;
        })(configs = net2.configs || (net2.configs = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var configs;
        (function (configs) {
            var Share = (function () {
                function Share() {
                    this.title = "kr3m Application";
                    this.description = "Eine kr3m Anwendung";
                    this.image = "";
                    this.url = "/";
                }
                return Share;
            }());
            configs.Share = Share;
        })(configs = net2.configs || (net2.configs = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var configs;
        (function (configs) {
            var AppServer = (function () {
                function AppServer() {
                    this.documentRoot = "public";
                    this.http = new configs.Http();
                    this.localization = new configs.Localization();
                    this.sandbox = new configs.Sandbox();
                    this.workerCount = 0;
                    this.forceHttps = false;
                    this.useLogColors = false;
                }
                return AppServer;
            }());
            configs.AppServer = AppServer;
        })(configs = net2.configs || (net2.configs = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var handlers;
        (function (handlers) {
            var FileSystem = (function (_super) {
                __extends(FileSystem, _super);
                function FileSystem(uriPattern) {
                    if (uriPattern === void 0) { uriPattern = /[^\/]$/; }
                    var _this = _super.call(this, uriPattern) || this;
                    _this.cache = kr3m.cache.files.LocalFiles.getInstance();
                    return _this;
                }
                FileSystem.prototype.getResourceRealpath = function (context) {
                    return context.documentRoot + context.getCurrentUri();
                };
                FileSystem.prototype.deliverResource = function (context) {
                    var acceptedEncodings = (context.request.getHeader("accept-encoding") || "").split(/\s*,\s*/).filter(function (e) { return e; });
                    var realPath = this.getResourceRealpath(context);
                    var contentType = kr3m.net.MimeTypes.getMimeTypeByFileName(realPath);
                    if (!kr3m.net.MimeTypes.isTextType(contentType))
                        acceptedEncodings = [];
                    this.cache.getFile(realPath, acceptedEncodings, function (file, encoding, modified) {
                        if (!file)
                            return context.flush(404);
                        modified.setMilliseconds(0);
                        context.response.setLastModified(modified);
                        context.response.cacheFor(365 * 24 * 60 * 60 * 1000);
                        var ifModified = context.request.getIfModified();
                        if (ifModified) {
                            ifModified.setMilliseconds(0);
                            if (ifModified.getTime() >= modified.getTime())
                                return context.flush(304);
                        }
                        if (encoding)
                            context.response.setHeader("Content-Encoding", encoding);
                        context.flush(200, file, contentType, "binary");
                    });
                };
                FileSystem.prototype.handle = function (context) {
                    var _this = this;
                    var resourcePath = this.getResourceRealpath(context);
                    this.cache.fileExists(resourcePath, function (exists) {
                        if (!exists)
                            return context.flush(404);
                        _this.deliverResource(context);
                    });
                };
                return FileSystem;
            }(handlers.Abstract));
            handlers.FileSystem = FileSystem;
        })(handlers = net2.handlers || (net2.handlers = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var vmLib = require("vm");
var kr3m;
(function (kr3m) {
    var javascript;
    (function (javascript) {
        var Script = (function () {
            function Script(code) {
                this.code = code;
                this.precompiled = new vmLib.Script(code);
            }
            Script.prototype.concat = function () {
                var others = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    others[_i] = arguments[_i];
                }
                var code = this.code;
                code += "\n" + others.map(function (other) { return typeof other == "string" ? other : other.code; }).join("\n");
                return new Script(code);
            };
            Script.prototype.getCode = function () {
                return this.code;
            };
            Script.prototype.getPrecompiled = function () {
                return this.precompiled;
            };
            return Script;
        }());
        javascript.Script = Script;
    })(javascript = kr3m.javascript || (kr3m.javascript = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var javascript;
    (function (javascript) {
        var WebLib = (function () {
            function WebLib() {
            }
            WebLib.get = function () {
                var url = arguments[0];
                var params = arguments.length > 2 ? arguments[1] : undefined;
                var callback = arguments[arguments.length - 1];
                var request = new kr3m.net.HttpRequest(url, params, "GET");
                request.send(function (response) { return callback(response.toString(), 200); }, function (errorMessage, statusCode) { return callback("", statusCode); });
            };
            WebLib.getCached = function (url, ttl, callback) {
                var cached = WebLib.cached[url];
                if (cached && cached.updatedWhen + ttl > Date.now())
                    return callback(cached.content, 200);
                var request = new kr3m.net.HttpRequest(url, null, "GET");
                request.setTimeout(WebLib.TIMEOUT_DURATION, function () {
                    logWarning("WebLib.getCached('" + url + "') timed out");
                    callback("", 500);
                });
                request.send(function (response) {
                    var cached = { content: response.toString(), updatedWhen: Date.now() };
                    WebLib.cached[url] = cached;
                    callback(cached.content, 200);
                }, function (errorMessage, statusCode) { return callback("", statusCode); });
            };
            WebLib.post = function () {
                var url = arguments[0];
                var params = arguments.length > 2 ? arguments[1] : undefined;
                var callback = arguments[arguments.length - 1];
                var request = new kr3m.net.HttpRequest(url, params, "POST");
                request.send(function (response) { return callback(response.toString(), 200); }, function (errorMessage, statusCode) { return callback("", statusCode); });
            };
            WebLib.relay = function (url, options, callback) {
                options["url"] = url;
                var json = kr3m.util.Json.encode(options);
                var cipher = cryptoLib.createCipher("aes192", kr3m.net2.RELAY_PASSWORD);
                var relayUrl = cipher.update(json, "utf8", "hex") + cipher.final("hex");
                relayUrl = (options.uriPrefix === undefined ? "/r/" : options.uriPrefix) + relayUrl;
                callback(relayUrl);
            };
            WebLib.cached = {};
            WebLib.TIMEOUT_DURATION = 2000;
            return WebLib;
        }());
        javascript.WebLib = WebLib;
    })(javascript = kr3m.javascript || (kr3m.javascript = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var javascript;
    (function (javascript) {
        var Sandbox = (function () {
            function Sandbox(initialGlobals) {
                this.rpcHandler = {};
                this.rpcDirty = [];
                this.doRpcInit = true;
                this.showScriptCode = false;
                this.context = vmLib.createContext(initialGlobals || {});
            }
            Sandbox.prototype.addRpc = function () {
                var functionName = firstOfType(arguments, "string");
                var validations = firstOfType(arguments, "object", 0, 0);
                var defaults = firstOfType(arguments, "object", 0, 1);
                var handler = firstOfType(arguments, "function");
                var forceCallback = firstOfType(arguments, "boolean") || false;
                if (validations) {
                    var oldHandler = handler;
                    handler = function () {
                        var params = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            params[_i] = arguments[_i];
                        }
                        var helper = new kr3m.services.ParamsHelper(params);
                        if (!helper.validate(validations, defaults))
                            return logWarning("Javascript-Sandbox-Error:", functionName, "called with invalid parameters");
                        oldHandler.apply(void 0, params);
                    };
                }
                this.rpcHandler[functionName] = handler;
                var oldDirty = kr3m.util.Util.getBy(this.rpcDirty, "name", functionName);
                if (!oldDirty)
                    this.rpcDirty.push({ name: functionName, forceCallback: forceCallback });
            };
            Sandbox.prototype.rpcPre = function () {
                if (this.doRpcInit) {
                    this.run(Sandbox.SCRIPT_RPC_PRE);
                    this.doRpcInit = false;
                }
                if (this.rpcDirty.length > 0) {
                    var script = "";
                    for (var i = 0; i < this.rpcDirty.length; ++i) {
                        var moduleParts = this.rpcDirty[i].name.split(".");
                        for (var j = 1; j < moduleParts.length; ++j) {
                            var varName = moduleParts.slice(0, j).join(".");
                            script += "if (typeof " + varName + " == 'undefined')\n\t" + varName + " = {};\n";
                        }
                        script += this.rpcDirty[i].name + " = __cbFunc.bind(null, '" + this.rpcDirty[i].name + "', " + this.rpcDirty[i].forceCallback + ");\n";
                    }
                    this.run(script);
                    this.rpcDirty = [];
                }
            };
            Sandbox.prototype.rpcPost = function (callback) {
                var _this = this;
                kr3m.async.Loop.loop(function (loopDone) {
                    var rpc = _this.getGlobal("__rpc");
                    if (rpc.pending.length == 0)
                        return callback(undefined);
                    var join = new kr3m.async.Join();
                    for (var i = 0; i < rpc.pending.length; ++i) {
                        var p = rpc.pending[i];
                        var func = _this.rpcHandler[p.functionName];
                        if (!func)
                            return callback(new Error("Javascript-Sandbox-Error: " + p.functionName + " is not a valid rpc function name"));
                        if (p.callbackOffsets.length > 0) {
                            join.fork();
                            var helper = join.done.bind(join, i);
                            for (var j = 0; j < p.callbackOffsets.length; ++j)
                                p.params[p.callbackOffsets[j]] = helper.bind(null, j);
                        }
                        else if (p.forceCallback) {
                            join.fork();
                            var helper = join.done.bind(join, i);
                            p.params.push(helper);
                        }
                        func.apply(void 0, p.params);
                    }
                    join.addCallback(function () {
                        var script = "";
                        for (var i = 0; i < rpc.pending.length; ++i) {
                            var p = rpc.pending[i];
                            if (p.callbackOffsets.length > 0) {
                                var results = join.getResults(i);
                                var j = results.shift();
                                script += "__rpcCb(" + p.id + ", " + j + ", " + kr3m.util.Json.encode(results) + ");\n";
                            }
                            else {
                                script += "__rpcCb(" + p.id + ", -1);\n";
                            }
                        }
                        var error = _this.run(script);
                        if (error)
                            return callback(error);
                        loopDone();
                    });
                });
            };
            Sandbox.prototype.runRpc = function (code, callback) {
                this.rpcPre();
                var err = this.run(code);
                if (err)
                    return callback(err);
                this.rpcPost(callback);
            };
            Sandbox.prototype.run = function (code) {
                try {
                    if (code instanceof javascript.Script) {
                        if (this.showScriptCode)
                            log("running sandbox script:\n" + kr3m.util.Log.COLOR_BRIGHT_CYAN + code.getCode() + kr3m.util.Log.COLOR_RESET);
                        code.getPrecompiled().runInContext(this.context);
                    }
                    else {
                        if (this.showScriptCode)
                            log("running sandbox script:\n" + kr3m.util.Log.COLOR_BRIGHT_CYAN + code + kr3m.util.Log.COLOR_RESET);
                        vmLib.runInContext(code, this.context);
                    }
                    return undefined;
                }
                catch (e) {
                    return e;
                }
            };
            Sandbox.prototype.setGlobal = function (varName, value) {
                var script = "var " + varName + " = " + kr3m.util.Json.encode(value);
                this.run(script);
            };
            Sandbox.prototype.getGlobal = function (varName) {
                try {
                    return vmLib.runInContext(varName, this.context);
                }
                catch (e) {
                    return undefined;
                }
            };
            Sandbox.prototype.enableConsole = function () {
                this.run(Sandbox.SCRIPT_CONSOLE);
            };
            Sandbox.prototype.getConsoleOutput = function (reset) {
                if (reset === void 0) { reset = true; }
                var output = this.getGlobal("__consoleLog");
                if (reset)
                    this.setGlobal("__consoleLog", []);
                return output;
            };
            Sandbox.prototype.enableEcho = function () {
                this.run(Sandbox.SCRIPT_ECHO);
            };
            Sandbox.prototype.getEchoOutput = function (reset) {
                if (reset === void 0) { reset = true; }
                var output = this.getGlobal("__echoLog");
                if (reset)
                    this.setGlobal("__echoLog", []);
                output = output.map(function (line) { return line.map(function (obj) { return typeof obj == "string" ? obj : kr3m.util.Json.encode(obj); }); });
                return output;
            };
            Sandbox.prototype.enableKr3mLib = function () {
                this.run(Sandbox.SCRIPT_KR3M_LIB);
            };
            Sandbox.prototype.enableFileAccess = function (readOnly) {
                if (readOnly === void 0) { readOnly = false; }
                this.addRpc("fsLib.readdir", fsLib.readdir.bind(fsLib));
                this.addRpc("fsLib.readFile", fsLib.readFile.bind(fsLib));
                this.addRpc("fsLib.stat", fsLib.stat.bind(fsLib));
                if (!readOnly)
                    this.addRpc("fsLib.writeFile", fsLib.writeFile.bind(fsLib));
            };
            Sandbox.prototype.enableWebAccess = function () {
                for (var method in javascript.WebLib) {
                    if (typeof javascript.WebLib[method] == "function")
                        this.addRpc("webLib." + method, javascript.WebLib[method]);
                }
            };
            Sandbox.SCRIPT_CONSOLE = new javascript.Script("var __consoleLog = [];\r\n\r\n\r\n\r\nfunction Console()\r\n{\r\n\tthis.log = function()\r\n\t{\r\n\t\tvar args = Array.prototype.slice.call(arguments);\r\n\t\tfor (var i = 0; i < args.length; ++i)\r\n\t\t\targs[i] = JSON.stringify(args[i]);\r\n\t\tvar text = args.join(\" \");\r\n\t\t__consoleLog.push({ type : \"out\", text : text});\r\n\t}\r\n\r\n\tthis.error = function()\r\n\t{\r\n\t\tvar args = Array.prototype.slice.call(arguments);\r\n\t\tfor (var i = 0; i < args.length; ++i)\r\n\t\t\targs[i] = JSON.stringify(args[i]);\r\n\t\tvar text = args.join(\" \");\r\n\t\t__consoleLog.push({ type : \"err\", text : text});\r\n\t}\r\n}\r\n\r\n\r\n\r\nvar console = new Console();\r\n");
            Sandbox.SCRIPT_ECHO = new javascript.Script("var __echoLog = [];\r\n\r\n\r\n\r\nfunction echo()\r\n{\r\n\t__echoLog.push(Array.prototype.slice.call(arguments));\r\n}\r\n");
            Sandbox.SCRIPT_KR3M_LIB = new javascript.Script("var kr3m;\r\n(function (kr3m) {\r\n    var async;\r\n    (function (async) {\r\n        var Join = (function () {\r\n            function Join() {\r\n                this.counter = 0;\r\n                this.callbacks = [];\r\n                this.results = {};\r\n            }\r\n            Join.prototype.getResult = function (resultName) {\r\n                var results = this.results[resultName];\r\n                if (results && results.length > 0)\r\n                    return results[0];\r\n                return undefined;\r\n            };\r\n            Join.prototype.getResults = function (resultName) {\r\n                return this.results[resultName] ? this.results[resultName] : undefined;\r\n            };\r\n            Join.prototype.getAllResults = function () {\r\n                return this.results;\r\n            };\r\n            Join.prototype.clearCallbacks = function (runBeforeRemove) {\r\n                if (runBeforeRemove === void 0) { runBeforeRemove = false; }\r\n                if (runBeforeRemove) {\r\n                    for (var i = 0; i < this.callbacks.length; ++i)\r\n                        this.callbacks[i]();\r\n                }\r\n                this.callbacks = [];\r\n            };\r\n            Join.prototype.terminator = function (saveResultName) {\r\n                var results = [];\r\n                for (var _i = 1; _i < arguments.length; _i++) {\r\n                    results[_i - 1] = arguments[_i];\r\n                }\r\n                if (saveResultName !== undefined)\r\n                    this.results[saveResultName] = results;\r\n                --this.counter;\r\n                if (this.counter <= 0) {\r\n                    this.counter = 0;\r\n                    for (var i = 0; i < this.callbacks.length; ++i)\r\n                        this.callbacks[i]();\r\n                    this.callbacks = [];\r\n                }\r\n            };\r\n            Join.prototype.fork = function () {\r\n                ++this.counter;\r\n            };\r\n            Join.prototype.done = function () {\r\n                this.terminator(undefined);\r\n            };\r\n            Join.prototype.getCallback = function (saveResultName) {\r\n                this.fork();\r\n                return this.terminator.bind(this, saveResultName);\r\n            };\r\n            Join.prototype.addCallback = function (callback) {\r\n                if (this.counter > 0)\r\n                    this.callbacks.push(callback);\r\n                else\r\n                    callback();\r\n            };\r\n            return Join;\r\n        }());\r\n        async.Join = Join;\r\n    })(async = kr3m.async || (kr3m.async = {}));\r\n})(kr3m || (kr3m = {}));\r\nvar kr3m;\r\n(function (kr3m) {\r\n    var async;\r\n    (function (async) {\r\n        var Loop = (function () {\r\n            function Loop() {\r\n            }\r\n            Loop.loop = function (innerLoop, callback) {\r\n                if (callback === void 0) { callback = null; }\r\n                var innerHelper = function (again) {\r\n                    if (again || again === undefined)\r\n                        innerLoop(innerHelper);\r\n                    else if (callback)\r\n                        callback();\r\n                };\r\n                innerHelper(true);\r\n            };\r\n            Loop.times = function (count, loopFunc, callback, parallelCount) {\r\n                if (parallelCount === void 0) { parallelCount = 1; }\r\n                if (count < 1)\r\n                    return callback && callback();\r\n                var i = 0;\r\n                var runningCount = Math.min(parallelCount, count);\r\n                var runningCountInitial = runningCount;\r\n                var innerHelper = function () {\r\n                    --runningCount;\r\n                    if (i < count) {\r\n                        ++runningCount;\r\n                        loopFunc(i++, innerHelper);\r\n                    }\r\n                    else if (callback && runningCount == 0) {\r\n                        callback();\r\n                    }\r\n                };\r\n                for (var j = 0; j < runningCountInitial; ++j)\r\n                    innerHelper();\r\n            };\r\n            Loop.forEach = function (values, loopFunc, callback, parallelCount) {\r\n                if (parallelCount === void 0) { parallelCount = 1; }\r\n                if (!values || values.length == 0)\r\n                    return callback && callback();\r\n                var i = 0;\r\n                var runningCount = Math.min(parallelCount, values.length);\r\n                var runningCountInitial = runningCount;\r\n                var innerHelper = function () {\r\n                    --runningCount;\r\n                    if (i < values.length) {\r\n                        ++runningCount;\r\n                        loopFunc(values[i++], innerHelper, i - 1);\r\n                    }\r\n                    else if (callback && runningCount == 0) {\r\n                        callback();\r\n                    }\r\n                };\r\n                for (var j = 0; j < runningCountInitial; ++j)\r\n                    innerHelper();\r\n            };\r\n            Loop.forEachAssoc = function (valuesMap, loopFunc, callback, parallelCount) {\r\n                if (parallelCount === void 0) { parallelCount = 1; }\r\n                if (!valuesMap)\r\n                    return callback && callback();\r\n                var keys = Object.keys(valuesMap);\r\n                kr3m.async.Loop.forEach(keys, function (key, loopDone) {\r\n                    loopFunc(key, valuesMap[key], loopDone);\r\n                }, callback, parallelCount);\r\n            };\r\n            Loop.forEachBatch = function (values, batchSize, loopFunc, callback, parallelCount) {\r\n                if (parallelCount === void 0) { parallelCount = 1; }\r\n                if (!values || values.length == 0)\r\n                    return callback && callback();\r\n                var i = 0;\r\n                var runningCount = Math.min(parallelCount, Math.ceil(values.length / batchSize));\r\n                var runningCountInitial = runningCount;\r\n                var innerHelper = function () {\r\n                    --runningCount;\r\n                    if (i < values.length) {\r\n                        ++runningCount;\r\n                        var batch = values.slice(i, i + batchSize);\r\n                        i += batch.length;\r\n                        loopFunc(batch, innerHelper);\r\n                    }\r\n                    else if (callback && runningCount == 0) {\r\n                        callback();\r\n                    }\r\n                };\r\n                for (var j = 0; j < runningCountInitial; ++j)\r\n                    innerHelper();\r\n            };\r\n            return Loop;\r\n        }());\r\n        async.Loop = Loop;\r\n    })(async = kr3m.async || (kr3m.async = {}));\r\n})(kr3m || (kr3m = {}));\r\nvar kr3m;\r\n(function (kr3m) {\r\n    var util;\r\n    (function (util) {\r\n        var Dates = (function () {\r\n            function Dates() {\r\n            }\r\n            Dates.getDateString = function (date, useUTC) {\r\n                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }\r\n                if (useUTC) {\r\n                    var result = date.getUTCFullYear() + \"-\";\r\n                    var month = date.getUTCMonth() + 1;\r\n                    result += ((month < 10) ? \"0\" + month : \"\" + month);\r\n                    var day = date.getUTCDate();\r\n                    result += \"-\" + ((day < 10) ? \"0\" + day : \"\" + day);\r\n                    return result;\r\n                }\r\n                else {\r\n                    var result = date.getFullYear() + \"-\";\r\n                    var month = date.getMonth() + 1;\r\n                    result += ((month < 10) ? \"0\" + month : \"\" + month);\r\n                    var day = date.getDate();\r\n                    result += \"-\" + ((day < 10) ? \"0\" + day : \"\" + day);\r\n                    return result;\r\n                }\r\n            };\r\n            Dates.getTimeString = function (date, useUTC, addMilliseconds) {\r\n                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }\r\n                if (addMilliseconds === void 0) { addMilliseconds = false; }\r\n                if (useUTC) {\r\n                    var result = \"\";\r\n                    var hours = date.getUTCHours();\r\n                    result += ((hours < 10) ? \"0\" + hours : \"\" + hours);\r\n                    var minutes = date.getUTCMinutes();\r\n                    result += \":\" + ((minutes < 10) ? \"0\" + minutes : \"\" + minutes);\r\n                    var seconds = date.getUTCSeconds();\r\n                    result += \":\" + ((seconds < 10) ? \"0\" + seconds : \"\" + seconds);\r\n                    if (addMilliseconds) {\r\n                        var millis = date.getUTCMilliseconds();\r\n                        result += \".\" + ((millis < 10) ? \"00\" + millis : (millis < 100) ? \"0\" + millis : \"\" + millis);\r\n                    }\r\n                    return result + \"Z\";\r\n                }\r\n                else {\r\n                    var result = \"\";\r\n                    var hours = date.getHours();\r\n                    result += ((hours < 10) ? \"0\" + hours : \"\" + hours);\r\n                    var minutes = date.getMinutes();\r\n                    result += \":\" + ((minutes < 10) ? \"0\" + minutes : \"\" + minutes);\r\n                    var seconds = date.getSeconds();\r\n                    result += \":\" + ((seconds < 10) ? \"0\" + seconds : \"\" + seconds);\r\n                    if (addMilliseconds) {\r\n                        var millis = date.getMilliseconds();\r\n                        result += \".\" + ((millis < 10) ? \"00\" + millis : (millis < 100) ? \"0\" + millis : \"\" + millis);\r\n                    }\r\n                    return result;\r\n                }\r\n            };\r\n            Dates.getDateFromDateTimeString = function (value) {\r\n                if (!value || typeof value != \"string\")\r\n                    return null;\r\n                var matches = value.match(/^(\\d\\d\\d\\d)\\-(\\d\\d)\\-(\\d\\d)(?:T| )(\\d\\d)\\:(\\d\\d)\\:(\\d\\d)(\\.(\\d\\d\\d))?(Z|[\\+\\-]\\d\\d\\:\\d\\d)?$/);\r\n                if (!matches)\r\n                    return null;\r\n                matches[8] = matches[8] || \"0\";\r\n                var date = new Date();\r\n                if (matches[9] == \"Z\") {\r\n                    date.setUTCFullYear(parseInt(matches[1], 10), parseInt(matches[2], 10) - 1, parseInt(matches[3], 10));\r\n                    date.setUTCHours(parseInt(matches[4], 10), parseInt(matches[5], 10), parseInt(matches[6], 10), parseInt(matches[8], 10));\r\n                }\r\n                else if (matches[9] && matches[9].length == 6) {\r\n                    var hourOffset = parseInt(matches[9].slice(1, 3), 10);\r\n                    var minuteOffset = parseInt(matches[9].slice(4, 5), 10);\r\n                    if (matches[9].charAt(0) == \"-\") {\r\n                        hourOffset *= -1;\r\n                        minuteOffset *= -1;\r\n                    }\r\n                    date.setUTCFullYear(parseInt(matches[1], 10), parseInt(matches[2], 10) - 1, parseInt(matches[3], 10));\r\n                    date.setUTCHours(parseInt(matches[4], 10) - hourOffset, parseInt(matches[5], 10) - minuteOffset, parseInt(matches[6], 10), parseInt(matches[8], 10));\r\n                }\r\n                else {\r\n                    date.setFullYear(parseInt(matches[1], 10), parseInt(matches[2], 10) - 1, parseInt(matches[3], 10));\r\n                    date.setHours(parseInt(matches[4], 10), parseInt(matches[5], 10), parseInt(matches[6], 10), parseInt(matches[8], 10));\r\n                }\r\n                return date;\r\n            };\r\n            Dates.getDateFromDateString = function (value) {\r\n                if (!value || typeof value != \"string\")\r\n                    return null;\r\n                var matches = value.match(/^(\\d\\d\\d\\d)\\-(\\d\\d)\\-(\\d\\d)$/);\r\n                if (!matches)\r\n                    return null;\r\n                var date = new Date();\r\n                date.setFullYear(parseInt(matches[1], 10), parseInt(matches[2], 10) - 1, parseInt(matches[3], 10));\r\n                date.setHours(0, 0, 0, 0);\r\n                return date;\r\n            };\r\n            Dates.getDateTimeString = function (date, useUTC, addMilliseconds) {\r\n                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }\r\n                if (addMilliseconds === void 0) { addMilliseconds = false; }\r\n                return this.getDateString(date, useUTC) + \" \" + this.getTimeString(date, useUTC, addMilliseconds);\r\n            };\r\n            Dates.getToday = function (useUTC) {\r\n                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }\r\n                return this.getDateString(new Date(), useUTC);\r\n            };\r\n            Dates.getYesterday = function (useUTC) {\r\n                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }\r\n                var date = new Date();\r\n                date.setUTCDate(date.getUTCDate() - 1);\r\n                return this.getDateString(date, useUTC);\r\n            };\r\n            Dates.getTomorrow = function (useUTC) {\r\n                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }\r\n                var date = new Date();\r\n                date.setUTCDate(date.getUTCDate() + 1);\r\n                return this.getDateString(date, useUTC);\r\n            };\r\n            Dates.getNow = function (useUTC) {\r\n                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }\r\n                return this.getDateTimeString(new Date(), useUTC);\r\n            };\r\n            Dates.areSameDay = function (a, b) {\r\n                if (a.getUTCFullYear() != b.getUTCFullYear())\r\n                    return false;\r\n                if (a.getUTCMonth() != b.getUTCMonth())\r\n                    return false;\r\n                if (a.getUTCDate() != b.getUTCDate())\r\n                    return false;\r\n                return true;\r\n            };\r\n            Dates.getSomeDaysAgo = function (date, count) {\r\n                var newDate = new Date(date.getTime());\r\n                newDate.setUTCDate(newDate.getUTCDate() - count);\r\n                return newDate;\r\n            };\r\n            Dates.getSomeMonthsAgo = function (date, count) {\r\n                var newDate = new Date(date.getTime());\r\n                newDate.setUTCMonth(newDate.getUTCMonth() - count);\r\n                return newDate;\r\n            };\r\n            Dates.getAgeInYears = function (birthday) {\r\n                if (!birthday)\r\n                    return -1;\r\n                var now = new Date();\r\n                var years = now.getFullYear() - birthday.getFullYear();\r\n                var months = now.getMonth() - birthday.getMonth();\r\n                var days = now.getDate() - birthday.getDate();\r\n                var age = years;\r\n                if ((months < 0) || (months == 0 && days < 0))\r\n                    --age;\r\n                return age;\r\n            };\r\n            Dates.max = function () {\r\n                var dates = [];\r\n                for (var _i = 0; _i < arguments.length; _i++) {\r\n                    dates[_i - 0] = arguments[_i];\r\n                }\r\n                if (dates.length == 0)\r\n                    return null;\r\n                var result = dates[0];\r\n                for (var i = 1; i < dates.length; ++i)\r\n                    if (dates[i] > result)\r\n                        result = dates[i];\r\n                return result;\r\n            };\r\n            Dates.min = function () {\r\n                var dates = [];\r\n                for (var _i = 0; _i < arguments.length; _i++) {\r\n                    dates[_i - 0] = arguments[_i];\r\n                }\r\n                if (dates.length == 0)\r\n                    return null;\r\n                var result = dates[0];\r\n                for (var i = 1; i < dates.length; ++i)\r\n                    if (dates[i] < result)\r\n                        result = dates[i];\r\n                return result;\r\n            };\r\n            Dates.getCalendarWeek = function (date, useUTC) {\r\n                if (date === void 0) { date = new Date(); }\r\n                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }\r\n                if (useUTC) {\r\n                    var currentThursday = new Date(date.getTime() + (3 - ((date.getUTCDay() + 6) % 7)) * 86400000);\r\n                    var yearOfThursday = currentThursday.getUTCFullYear();\r\n                    var offset = new Date(0);\r\n                    offset.setUTCFullYear(yearOfThursday, 0, 4);\r\n                    var firstThursday = new Date(offset.getTime() + (3 - ((offset.getUTCDay() + 6) % 7)) * 86400000);\r\n                    var weekNumber = Math.floor(1 + 0.5 + (currentThursday.getTime() - firstThursday.getTime()) / 86400000 / 7);\r\n                    return weekNumber;\r\n                }\r\n                else {\r\n                    var currentThursday = new Date(date.getTime() + (3 - ((date.getDay() + 6) % 7)) * 86400000);\r\n                    var yearOfThursday = currentThursday.getFullYear();\r\n                    var firstThursday = new Date(new Date(yearOfThursday, 0, 4).getTime() + (3 - ((new Date(yearOfThursday, 0, 4).getDay() + 6) % 7)) * 86400000);\r\n                    var weekNumber = Math.floor(1 + 0.5 + (currentThursday.getTime() - firstThursday.getTime()) / 86400000 / 7);\r\n                    return weekNumber;\r\n                }\r\n            };\r\n            Dates.getCalendarWeekYear = function (date, useUTC) {\r\n                if (date === void 0) { date = new Date(); }\r\n                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }\r\n                var year = useUTC ? date.getUTCFullYear() : date.getFullYear();\r\n                var week = Dates.getCalendarWeek(date, useUTC);\r\n                if (week < 52)\r\n                    return year;\r\n                return date.getMonth() > 6 ? year : year - 1;\r\n            };\r\n            Dates.getFirstOfWeek = function (date, useUTC) {\r\n                if (date === void 0) { date = new Date(); }\r\n                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }\r\n                var result = new Date(date.getTime());\r\n                if (useUTC) {\r\n                    result.setUTCDate(result.getUTCDate() - (result.getUTCDay() + 6) % 7);\r\n                    result.setUTCHours(0, 0, 0);\r\n                }\r\n                else {\r\n                    result.setDate(result.getDate() - (result.getDay() + 6) % 7);\r\n                    result.setHours(0, 0, 0);\r\n                }\r\n                return result;\r\n            };\r\n            Dates.getFirstOfMonth = function (date, useUTC) {\r\n                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }\r\n                var result = new Date(date.getTime());\r\n                if (useUTC) {\r\n                    result.setUTCDate(1);\r\n                    result.setUTCHours(0, 0, 0);\r\n                }\r\n                else {\r\n                    result.setDate(1);\r\n                    result.setHours(0, 0, 0);\r\n                }\r\n                return result;\r\n            };\r\n            Dates.getLastOfMonth = function (date, useUTC) {\r\n                if (useUTC === void 0) { useUTC = Dates.USE_UTC; }\r\n                var result = new Date(date.getTime());\r\n                if (useUTC) {\r\n                    result.setUTCDate(1);\r\n                    result.setUTCMonth(result.getUTCMonth() + 1);\r\n                    result.setUTCDate(0);\r\n                    result.setUTCHours(0, 0, 0);\r\n                }\r\n                else {\r\n                    result.setDate(1);\r\n                    result.setMonth(result.getMonth() + 1);\r\n                    result.setDate(0);\r\n                    result.setHours(0, 0, 0);\r\n                }\r\n                return result;\r\n            };\r\n            Dates.areClose = function (a, b, threshold) {\r\n                if (threshold === void 0) { threshold = 1000; }\r\n                if (!a || !b)\r\n                    return false;\r\n                return Math.abs(a.getTime() - b.getTime()) <= threshold;\r\n            };\r\n            Dates.delta = function (date, years, months, days, hours, minutes, seconds, milliSeconds, isCapped) {\r\n                if (years === void 0) { years = 0; }\r\n                if (months === void 0) { months = 0; }\r\n                if (days === void 0) { days = 0; }\r\n                if (hours === void 0) { hours = 0; }\r\n                if (minutes === void 0) { minutes = 0; }\r\n                if (seconds === void 0) { seconds = 0; }\r\n                if (milliSeconds === void 0) { milliSeconds = 0; }\r\n                if (isCapped === void 0) { isCapped = true; }\r\n                var result = new Date(date.getTime());\r\n                result.setUTCFullYear(result.getUTCFullYear() + years);\r\n                if (isCapped) {\r\n                    var oldMonth = result.getUTCMonth();\r\n                    result.setUTCMonth(oldMonth + months);\r\n                    var newMonth = result.getUTCMonth();\r\n                    if ((oldMonth + months) % 12 != newMonth)\r\n                        result.setUTCDate(0);\r\n                }\r\n                else {\r\n                    result.setUTCMonth(result.getUTCMonth() + months);\r\n                }\r\n                result.setUTCDate(result.getUTCDate() + days);\r\n                result.setUTCHours(result.getUTCHours() + hours);\r\n                result.setUTCMinutes(result.getUTCMinutes() + minutes);\r\n                result.setUTCSeconds(result.getUTCSeconds() + seconds);\r\n                result.setUTCMilliseconds(result.getUTCMilliseconds() + milliSeconds);\r\n                return result;\r\n            };\r\n            Dates.USE_UTC = false;\r\n            return Dates;\r\n        }());\r\n        util.Dates = Dates;\r\n    })(util = kr3m.util || (kr3m.util = {}));\r\n})(kr3m || (kr3m = {}));\r\nvar kr3m;\r\n(function (kr3m) {\r\n    var util;\r\n    (function (util) {\r\n        var Log = (function () {\r\n            function Log() {\r\n            }\r\n            ;\r\n            ;\r\n            ;\r\n            ;\r\n            ;\r\n            ;\r\n            ;\r\n            ;\r\n            ;\r\n            ;\r\n            ;\r\n            ;\r\n            ;\r\n            ;\r\n            ;\r\n            ;\r\n            ;\r\n            Log.logError = function () {\r\n                var values = [];\r\n                for (var _i = 0; _i < arguments.length; _i++) {\r\n                    values[_i - 0] = arguments[_i];\r\n                }\r\n                if (!Log.enabled)\r\n                    return;\r\n                for (var i = 0; i < values.length; ++i) {\r\n                    if (typeof values[i] == \"object\" && !(values[i] instanceof Error))\r\n                        values[i] = util.Json.encode(values[i]);\r\n                }\r\n                if (Log.showTimestamps)\r\n                    values.unshift(Log.COLOR_BRIGHT_RED + util.Dates.getNow(false));\r\n                else\r\n                    values[0] = Log.COLOR_BRIGHT_RED + values[0];\r\n                values.push(Log.COLOR_RESET);\r\n                console.error.apply(console, values);\r\n            };\r\n            Log.logWarning = function () {\r\n                var values = [];\r\n                for (var _i = 0; _i < arguments.length; _i++) {\r\n                    values[_i - 0] = arguments[_i];\r\n                }\r\n                if (!Log.enabled)\r\n                    return;\r\n                for (var i = 0; i < values.length; ++i) {\r\n                    if (typeof values[i] == \"object\" && !(values[i] instanceof Error))\r\n                        values[i] = util.Json.encode(values[i]);\r\n                }\r\n                if (Log.showTimestamps)\r\n                    values.unshift(Log.COLOR_BRIGHT_YELLOW + util.Dates.getNow(false));\r\n                else\r\n                    values[0] = Log.COLOR_BRIGHT_YELLOW + values[0];\r\n                values.push(Log.COLOR_RESET);\r\n                console.log.apply(console, values);\r\n            };\r\n            Log.log = function () {\r\n                var values = [];\r\n                for (var _i = 0; _i < arguments.length; _i++) {\r\n                    values[_i - 0] = arguments[_i];\r\n                }\r\n                if (!Log.enabled)\r\n                    return;\r\n                for (var i = 0; i < values.length; ++i) {\r\n                    if (typeof values[i] == \"object\")\r\n                        values[i] = util.Json.encode(values[i]);\r\n                }\r\n                if (Log.showTimestamps)\r\n                    values.unshift(util.Dates.getNow(false));\r\n                console.log.apply(console, values);\r\n            };\r\n            Log.logDebug = function () {\r\n                var values = [];\r\n                for (var _i = 0; _i < arguments.length; _i++) {\r\n                    values[_i - 0] = arguments[_i];\r\n                }\r\n                Log.log.apply(null, values);\r\n            };\r\n            Log.logVerbose = function () {\r\n                var values = [];\r\n                for (var _i = 0; _i < arguments.length; _i++) {\r\n                    values[_i - 0] = arguments[_i];\r\n                }\r\n            };\r\n            Log.dump = function () {\r\n                var values = [];\r\n                for (var _i = 0; _i < arguments.length; _i++) {\r\n                    values[_i - 0] = arguments[_i];\r\n                }\r\n                if (!Log.enabled || typeof console == \"undefined\" || typeof console.log == \"undefined\")\r\n                    return;\r\n                for (var i = 0; i < values.length; ++i) {\r\n                    if (typeof values[i] == \"object\")\r\n                        values[i] = util.Json.encode(values[i]);\r\n                }\r\n                Log.log.apply(null, values);\r\n            };\r\n            Log.stackTrace = function (asError, skipLines) {\r\n                if (asError === void 0) { asError = false; }\r\n                if (skipLines === void 0) { skipLines = 0; }\r\n                var e = new Error();\r\n                var stack = e[\"stack\"].split(/\\s+at\\s+/).slice(skipLines + 1);\r\n                return stack.join(\"\\n\");\r\n            };\r\n            Log.logStackTrace = function (asError, skipLines) {\r\n                if (asError === void 0) { asError = false; }\r\n                if (skipLines === void 0) { skipLines = 0; }\r\n                var prefix = asError ? Log.COLOR_BRIGHT_RED : \"\";\r\n                var suffix = asError ? Log.COLOR_RESET : \"\";\r\n                Log.log(prefix + Log.stackTrace(asError) + suffix);\r\n            };\r\n            Log.enabled = true;\r\n            Log.showTimestamps = true;\r\n            Log.COLOR_BLACK = \"\\x1b[30m\";\r\n            Log.COLOR_BLUE = \"\\x1b[34m\";\r\n            Log.COLOR_BRIGHT = \"\\x1b[1m\";\r\n            Log.COLOR_BRIGHT_BLUE = \"\\x1b[94m\";\r\n            Log.COLOR_BRIGHT_CYAN = \"\\x1b[96m\";\r\n            Log.COLOR_BRIGHT_GREEN = \"\\x1b[92m\";\r\n            Log.COLOR_BRIGHT_GREY = \"\\x1b[37m\";\r\n            Log.COLOR_BRIGHT_MAGENTA = \"\\x1b[95m\";\r\n            Log.COLOR_BRIGHT_PINK = \"\\x1b[95m\";\r\n            Log.COLOR_BRIGHT_RED = \"\\x1b[91m\";\r\n            Log.COLOR_BRIGHT_YELLOW = \"\\x1b[93m\";\r\n            Log.COLOR_CYAN = \"\\x1b[36m\";\r\n            Log.COLOR_DARK = \"\\x1b[2m\";\r\n            Log.COLOR_DARK_BLUE = \"\\x1b[34m\";\r\n            Log.COLOR_DARK_CYAN = \"\\x1b[36m\";\r\n            Log.COLOR_DARK_GREEN = \"\\x1b[32m\";\r\n            Log.COLOR_DARK_GREY = \"\\x1b[90m\";\r\n            Log.COLOR_DARK_MAGENTA = \"\\x1b[35m\";\r\n            Log.COLOR_DARK_PINK = \"\\x1b[35m\";\r\n            Log.COLOR_DARK_RED = \"\\x1b[31m\";\r\n            Log.COLOR_DARK_YELLOW = \"\\x1b[33m\";\r\n            Log.COLOR_DEFAULT = \"\\x1b[39m\";\r\n            Log.COLOR_GREEN = \"\\x1b[32m\";\r\n            Log.COLOR_MAGENTA = \"\\x1b[35m\";\r\n            Log.COLOR_PINK = \"\\x1b[35m\";\r\n            Log.COLOR_RED = \"\\x1b[31m\";\r\n            Log.COLOR_RESET = \"\\x1b[0m\";\r\n            Log.COLOR_WHITE = \"\\x1b[97m\";\r\n            Log.COLOR_YELLOW = \"\\x1b[33m\";\r\n            Log.BACKGROUND_BLACK = \"\\x1b[40m\";\r\n            Log.BACKGROUND_BRIGHT_BLUE = \"\\x1b[104m\";\r\n            Log.BACKGROUND_BRIGHT_CYAN = \"\\x1b[106m\";\r\n            Log.BACKGROUND_BRIGHT_GREEN = \"\\x1b[102m\";\r\n            Log.BACKGROUND_BRIGHT_GREY = \"\\x1b[47m\";\r\n            Log.BACKGROUND_BRIGHT_MAGENTA = \"\\x1b[105m\";\r\n            Log.BACKGROUND_BRIGHT_RED = \"\\x1b[101m\";\r\n            Log.BACKGROUND_BRIGHT_YELLOW = \"\\x1b[103m\";\r\n            Log.BACKGROUND_DARK_BLUE = \"\\x1b[44m\";\r\n            Log.BACKGROUND_DARK_CYAN = \"\\x1b[46m\";\r\n            Log.BACKGROUND_DARK_GREEN = \"\\x1b[42m\";\r\n            Log.BACKGROUND_DARK_GREY = \"\\x1b[100m\";\r\n            Log.BACKGROUND_DARK_MAGENTA = \"\\x1b[45m\";\r\n            Log.BACKGROUND_DARK_RED = \"\\x1b[41m\";\r\n            Log.BACKGROUND_DARK_YELLOW = \"\\x1b[43m\";\r\n            Log.BACKGROUND_DEFAULT = \"\\x1b[49m\";\r\n            Log.BACKGROUND_WHITE = \"\\x1b[107m\";\r\n            return Log;\r\n        }());\r\n        util.Log = Log;\r\n    })(util = kr3m.util || (kr3m.util = {}));\r\n})(kr3m || (kr3m = {}));\r\nfunction log() {\r\n    var values = [];\r\n    for (var _i = 0; _i < arguments.length; _i++) {\r\n        values[_i - 0] = arguments[_i];\r\n    }\r\n    kr3m.util.Log.log.apply(null, values);\r\n}\r\nfunction logDebug() {\r\n    var values = [];\r\n    for (var _i = 0; _i < arguments.length; _i++) {\r\n        values[_i - 0] = arguments[_i];\r\n    }\r\n    kr3m.util.Log.logDebug.apply(null, values);\r\n}\r\nfunction logVerbose() {\r\n    var values = [];\r\n    for (var _i = 0; _i < arguments.length; _i++) {\r\n        values[_i - 0] = arguments[_i];\r\n    }\r\n}\r\nfunction dump() {\r\n    var values = [];\r\n    for (var _i = 0; _i < arguments.length; _i++) {\r\n        values[_i - 0] = arguments[_i];\r\n    }\r\n    kr3m.util.Log.dump.apply(null, values);\r\n}\r\nfunction logError() {\r\n    var values = [];\r\n    for (var _i = 0; _i < arguments.length; _i++) {\r\n        values[_i - 0] = arguments[_i];\r\n    }\r\n    kr3m.util.Log.logError.apply(null, values);\r\n}\r\nfunction logProfiling() {\r\n    var values = [];\r\n    for (var _i = 0; _i < arguments.length; _i++) {\r\n        values[_i - 0] = arguments[_i];\r\n    }\r\n}\r\nfunction logWarning() {\r\n    var values = [];\r\n    for (var _i = 0; _i < arguments.length; _i++) {\r\n        values[_i - 0] = arguments[_i];\r\n    }\r\n    kr3m.util.Log.logWarning.apply(null, values);\r\n}\r\nfunction logProfilingLow() {\r\n    var values = [];\r\n    for (var _i = 0; _i < arguments.length; _i++) {\r\n        values[_i - 0] = arguments[_i];\r\n    }\r\n}\r\nfunction logFunc(functionName) {\r\n    var params = [];\r\n    for (var _i = 1; _i < arguments.length; _i++) {\r\n        params[_i - 1] = arguments[_i];\r\n    }\r\n    var text = functionName + \"(\";\r\n    for (var i = 0; i < params.length; ++i)\r\n        params[i] = kr3m.util.Json.encode(params[i]);\r\n    text += params.join(\", \") + \")\";\r\n    kr3m.util.Log.log(text);\r\n}\r\nvar kr3m;\r\n(function (kr3m) {\r\n    var util;\r\n    (function (util) {\r\n        var Util = (function () {\r\n            function Util() {\r\n            }\r\n            Util.equal = function (obj1, obj2, maxRecursionDepth) {\r\n                if (maxRecursionDepth === void 0) { maxRecursionDepth = 1000; }\r\n                if (maxRecursionDepth < 0)\r\n                    return true;\r\n                if (!obj1 != !obj2)\r\n                    return false;\r\n                if (!obj1 && !obj2)\r\n                    return true;\r\n                --maxRecursionDepth;\r\n                if (typeof obj1 != \"object\" || typeof obj2 != \"object\")\r\n                    return obj1 === obj2;\r\n                if (!obj1 != !obj2)\r\n                    return false;\r\n                if (typeof obj1.equals == \"function\")\r\n                    return obj1.equals(obj2);\r\n                if ((obj1.length || obj2.length) && obj1.length != obj2.length)\r\n                    return false;\r\n                if (obj1 instanceof Date && obj2 instanceof Date)\r\n                    return obj1.getTime() == obj2.getTime();\r\n                for (var i in obj1) {\r\n                    if (!Util.equal(obj1[i], obj2[i], maxRecursionDepth))\r\n                        return false;\r\n                }\r\n                for (var i in obj2) {\r\n                    if (!Util.equal(obj1[i], obj2[i], maxRecursionDepth))\r\n                        return false;\r\n                }\r\n                return true;\r\n            };\r\n            Util.clone = function (obj) {\r\n                if (!obj || typeof obj != \"object\")\r\n                    return obj;\r\n                if (obj instanceof Date)\r\n                    return new Date(obj.getTime());\r\n                var result = typeof obj[\"length\"] != \"undefined\" ? [] : obj[\"__proto__\"] ? Object.create(obj[\"__proto__\"]) : {};\r\n                var keys = Object.keys(obj);\r\n                for (var i = 0; i < keys.length; ++i) {\r\n                    if (typeof obj[keys[i]] == \"object\")\r\n                        result[keys[i]] = Util.clone(obj[keys[i]]);\r\n                    else\r\n                        result[keys[i]] = obj[keys[i]];\r\n                }\r\n                return result;\r\n            };\r\n            Util.encodeHtml = function (text) {\r\n                return text\r\n                    .replace(/&/g, \"&amp;\")\r\n                    .replace(/</g, \"&lt;\")\r\n                    .replace(/>/g, \"&gt;\")\r\n                    .replace(/\"/g, \"&quot;\")\r\n                    .replace(/'/g, \"&#039;\");\r\n            };\r\n            Util.reverse = function (values) {\r\n                values = values.slice();\r\n                var m = Math.floor(values.length / 2);\r\n                var e = values.length - 1;\r\n                for (var i = 0; i < m; ++i)\r\n                    _a = [values[e - i], values[i]], values[i] = _a[0], values[e - i] = _a[1];\r\n                return values;\r\n                var _a;\r\n            };\r\n            Util.decodeHtml = function (text) {\r\n                var tokens = { nbsp: \" \", amp: \"&\", lt: \"<\", gt: \">\", quot: \"\\\"\" };\r\n                text = text.replace(/&(#?\\w+?);/g, function (all, captured) {\r\n                    if (tokens[captured])\r\n                        return tokens[captured];\r\n                    try {\r\n                        if (captured.charAt(0) == \"#\")\r\n                            return String.fromCharCode(parseInt(captured.slice(1)));\r\n                    }\r\n                    catch (e) {\r\n                    }\r\n                    return all;\r\n                });\r\n                return text;\r\n            };\r\n            Util.contains = function (container, target, strict) {\r\n                if (strict === void 0) { strict = false; }\r\n                if (!container || container.length <= 0)\r\n                    return false;\r\n                for (var i = 0; i < container.length; ++i) {\r\n                    if (container[i] === target || (!strict && container[i] == target))\r\n                        return true;\r\n                }\r\n                return false;\r\n            };\r\n            Util.remove = function (container, target, strict) {\r\n                if (strict === void 0) { strict = false; }\r\n                for (var i = 0; i < container.length; ++i) {\r\n                    if (container[i] === target || (!strict && container[i] == target))\r\n                        return container.splice(i, 1)[0];\r\n                }\r\n                return null;\r\n            };\r\n            Util.difference = function (base) {\r\n                var operands = [];\r\n                for (var _i = 1; _i < arguments.length; _i++) {\r\n                    operands[_i - 1] = arguments[_i];\r\n                }\r\n                var result = base.slice(0);\r\n                for (var i = 0; i < result.length; ++i) {\r\n                    for (var j = 0; j < operands.length; ++j) {\r\n                        if (Util.contains(operands[j], result[i])) {\r\n                            result.splice(i--, 1);\r\n                            break;\r\n                        }\r\n                    }\r\n                }\r\n                return result;\r\n            };\r\n            Util.intersect = function () {\r\n                var arrays = [];\r\n                for (var _i = 0; _i < arguments.length; _i++) {\r\n                    arrays[_i - 0] = arguments[_i];\r\n                }\r\n                var result = Util.merge.apply(Util, arrays);\r\n                for (var i = 0; i < result.length; ++i) {\r\n                    for (var j = 0; j < arrays.length; ++j) {\r\n                        if (!Util.contains(arrays[j], result[i])) {\r\n                            result.splice(i--, 1);\r\n                            break;\r\n                        }\r\n                    }\r\n                }\r\n                return result;\r\n            };\r\n            Util.merge = function () {\r\n                var arrays = [];\r\n                for (var _i = 0; _i < arguments.length; _i++) {\r\n                    arrays[_i - 0] = arguments[_i];\r\n                }\r\n                var result = [];\r\n                for (var i = 0; i < arrays.length; ++i) {\r\n                    for (var j in arrays[i]) {\r\n                        if (!Util.contains(result, arrays[i][j]))\r\n                            result.push(arrays[i][j]);\r\n                    }\r\n                }\r\n                return result;\r\n            };\r\n            Util.mergeAssoc = function () {\r\n                var objects = [];\r\n                for (var _i = 0; _i < arguments.length; _i++) {\r\n                    objects[_i - 0] = arguments[_i];\r\n                }\r\n                var result = {};\r\n                for (var i = 0; i < objects.length; ++i) {\r\n                    if (!objects[i])\r\n                        continue;\r\n                    for (var j in objects[i])\r\n                        result[j] = objects[i][j];\r\n                }\r\n                return result;\r\n            };\r\n            Util.getProperty = function (obj, propertyName) {\r\n                var parts = propertyName.split(\".\");\r\n                while (parts.length > 0) {\r\n                    if (!obj)\r\n                        return undefined;\r\n                    obj = obj[parts.shift()];\r\n                }\r\n                return obj;\r\n            };\r\n            Util.getPropertyAndGetter = function (obj, propertyName) {\r\n                if (propertyName == \"\")\r\n                    return obj;\r\n                var parts = propertyName.split(\".\");\r\n                while (parts.length > 0) {\r\n                    if (!obj)\r\n                        return undefined;\r\n                    var prop = parts.shift();\r\n                    if (prop.substr(prop.length - 2, 2) == '()')\r\n                        obj = obj[prop.substr(0, prop.length - 2)]();\r\n                    else\r\n                        obj = obj[prop];\r\n                }\r\n                return obj;\r\n            };\r\n            Util.setProperty = function (obj, name, value) {\r\n                var parts = name.split(\".\");\r\n                while (parts.length > 1) {\r\n                    var key = parts.shift();\r\n                    if (typeof obj[key] == \"undefined\") {\r\n                        var index = parseInt(parts[0], 10);\r\n                        if (isNaN(index)) {\r\n                            obj[key] = {};\r\n                        }\r\n                        else {\r\n                            obj[key] = [];\r\n                            for (var i = -1; i < index; ++i)\r\n                                obj[key].push(undefined);\r\n                        }\r\n                    }\r\n                    obj = obj[key];\r\n                }\r\n                obj[parts[0]] = value;\r\n            };\r\n            Util.getBy = function (objects, propertyName, propertyValue) {\r\n                if (!objects)\r\n                    return undefined;\r\n                for (var i = 0; i < objects.length; ++i) {\r\n                    if (Util.getProperty(objects[i], propertyName) == propertyValue)\r\n                        return objects[i];\r\n                }\r\n                return undefined;\r\n            };\r\n            Util.getAllBy = function (objects, propertyName, propertyValue) {\r\n                if (!objects)\r\n                    return [];\r\n                var results = [];\r\n                for (var i = 0; i < objects.length; ++i) {\r\n                    if (Util.getProperty(objects[i], propertyName) == propertyValue)\r\n                        results.push(objects[i]);\r\n                }\r\n                return results;\r\n            };\r\n            Util.removeBy = function (objects, propertyName, propertyValue) {\r\n                var result = [];\r\n                if (!objects)\r\n                    return result;\r\n                for (var i = 0; i < objects.length; ++i) {\r\n                    if (Util.getProperty(objects[i], propertyName) == propertyValue)\r\n                        result = result.concat(objects.splice(i--, 1));\r\n                }\r\n                return result;\r\n            };\r\n            Util.gather = function (objects, fieldName, filterFunc) {\r\n                if (filterFunc === void 0) { filterFunc = null; }\r\n                var result = [];\r\n                var parts = fieldName.split(\".\");\r\n                if (filterFunc) {\r\n                    for (var i in objects) {\r\n                        if (filterFunc(objects[i])) {\r\n                            var temp = objects[i];\r\n                            for (var j = 0; j < parts.length; ++j)\r\n                                temp = temp[parts[j]];\r\n                            result.push(temp);\r\n                        }\r\n                    }\r\n                }\r\n                else {\r\n                    for (var i in objects) {\r\n                        var temp = objects[i];\r\n                        for (var j = 0; j < parts.length; ++j)\r\n                            temp = temp[parts[j]];\r\n                        result.push(temp);\r\n                    }\r\n                }\r\n                return result;\r\n            };\r\n            Util.gatherUnique = function (objects, fieldName, filterFunc) {\r\n                if (filterFunc === void 0) { filterFunc = null; }\r\n                return Util.removeDuplicates(Util.gather(objects, fieldName, filterFunc));\r\n            };\r\n            Util.removeDuplicates = function (objects) {\r\n                var result = [];\r\n                for (var i = 0; i < objects.length; ++i) {\r\n                    if (result.indexOf(objects[i]) < 0)\r\n                        result.push(objects[i]);\r\n                }\r\n                return result;\r\n            };\r\n            Util.arrayToAssoc = function (data, indexField) {\r\n                if (indexField === void 0) { indexField = \"id\"; }\r\n                var result = {};\r\n                for (var i = 0; i < data.length; ++i)\r\n                    result[data[i][indexField]] = data[i];\r\n                return result;\r\n            };\r\n            Util.arrayToPairs = function (data, indexField, valueField) {\r\n                var result = {};\r\n                for (var i in data)\r\n                    result[data[i][indexField]] = data[i][valueField];\r\n                return result;\r\n            };\r\n            Util.arrayToSet = function (data, trueValue) {\r\n                if (trueValue === void 0) { trueValue = true; }\r\n                var set = {};\r\n                for (var i = 0; i < data.length; ++i)\r\n                    set[data[i]] = trueValue;\r\n                return set;\r\n            };\r\n            Util.assocToArray = function (data) {\r\n                var result = [];\r\n                for (var i in data)\r\n                    result.push(data[i]);\r\n                return result;\r\n            };\r\n            Util.filter = function (value, validValues, fallbackValue) {\r\n                if (fallbackValue === void 0) { fallbackValue = null; }\r\n                for (var i = 0; i < validValues.length; ++i) {\r\n                    if (validValues[i] == value)\r\n                        return value;\r\n                }\r\n                return fallbackValue;\r\n            };\r\n            Util.filterKey = function (key, validKeys, fallbackKey) {\r\n                if (fallbackKey === void 0) { fallbackKey = null; }\r\n                if (typeof validKeys[key] != \"undefined\")\r\n                    return key;\r\n                return fallbackKey;\r\n            };\r\n            Util.sortBy = function () {\r\n                var values = arguments[0];\r\n                var fields;\r\n                if (typeof arguments[1] == \"string\") {\r\n                    fields = {};\r\n                    fields[arguments[1]] = arguments[2] === undefined ? true : arguments[2];\r\n                }\r\n                else {\r\n                    fields = arguments[1];\r\n                }\r\n                for (var i = 0; i < values.length; ++i) {\r\n                    for (var name in fields) {\r\n                        if (Util.getProperty(values[i], name) === undefined) {\r\n                            util.Log.logError(\"property\", name, \"in\", values[i], \"not found while sorting, aborting sort\");\r\n                            break;\r\n                        }\r\n                    }\r\n                }\r\n                values.sort(function (a, b) {\r\n                    for (var name in fields) {\r\n                        var aValue = Util.getProperty(a, name);\r\n                        var bValue = Util.getProperty(b, name);\r\n                        if (aValue < bValue)\r\n                            return fields[name] ? -1 : 1;\r\n                        if (aValue > bValue)\r\n                            return fields[name] ? 1 : -1;\r\n                    }\r\n                    return 0;\r\n                });\r\n            };\r\n            Util.sortAssocByKey = function (data, sortFunc) {\r\n                sortFunc = sortFunc || (function (keyA, keyB) { return keyA.localeCompare(keyB); });\r\n                var keys = Object.keys(data);\r\n                keys.sort(sortFunc);\r\n                var result = {};\r\n                for (var i = 0; i < keys.length; ++i)\r\n                    result[keys[i]] = data[keys[i]];\r\n                return result;\r\n            };\r\n            Util.sortAssocByValue = function (data, sortFunc) {\r\n                sortFunc = sortFunc || (function (valueA, valueB) { return valueA.toString().localeCompare(valueB.toString()); });\r\n                var keys = Object.keys(data);\r\n                keys.sort(function (keyA, keyB) { return sortFunc(data[keyA], data[keyB]); });\r\n                var result = {};\r\n                for (var i = 0; i < keys.length; ++i)\r\n                    result[keys[i]] = data[keys[i]];\r\n                return result;\r\n            };\r\n            Util.sortIndicesBy = function (values, field, ascending) {\r\n                if (ascending === void 0) { ascending = true; }\r\n                var one = ascending ? 1 : -1;\r\n                var results = [];\r\n                for (var i = 0; i < values.length; ++i)\r\n                    results.push(i);\r\n                results.sort(function (a, b) {\r\n                    var aValue = Util.getProperty(values[a], field);\r\n                    var bValue = Util.getProperty(values[b], field);\r\n                    return (aValue > bValue) ? one : (aValue < bValue) ? -one : 0;\r\n                });\r\n                return results;\r\n            };\r\n            Util.bucketBy = function (values, field) {\r\n                var buckets = {};\r\n                for (var i = 0; i < values.length; ++i) {\r\n                    var key = Util.getProperty(values[i], field);\r\n                    if (!buckets[key])\r\n                        buckets[key] = [];\r\n                    buckets[key].push(values[i]);\r\n                }\r\n                return buckets;\r\n            };\r\n            Util.bucketByRecursive = function (values) {\r\n                var fields = [];\r\n                for (var _i = 1; _i < arguments.length; _i++) {\r\n                    fields[_i - 1] = arguments[_i];\r\n                }\r\n                if (fields.length == 0)\r\n                    return undefined;\r\n                var field = fields.shift();\r\n                var buckets = Util.bucketBy(values, field);\r\n                if (fields.length > 0) {\r\n                    for (var id in buckets)\r\n                        buckets[id] = Util.bucketByRecursive.apply(Util, [buckets[id]].concat(fields));\r\n                }\r\n                return buckets;\r\n            };\r\n            Util.bucketAssocBy = function (values, field) {\r\n                var buckets = {};\r\n                for (var i in values) {\r\n                    var key = Util.getProperty(values[i], field);\r\n                    if (!buckets[key])\r\n                        buckets[key] = [];\r\n                    buckets[key].push(values[i]);\r\n                }\r\n                return buckets;\r\n            };\r\n            Util.forEachRecursive = function (obj, func) {\r\n                if (!obj || typeof obj != \"object\")\r\n                    return;\r\n                var workset = Object.keys(obj);\r\n                while (workset.length > 0) {\r\n                    var key = workset.pop();\r\n                    var value = Util.getProperty(obj, key);\r\n                    var type = value ? typeof value : \"null\";\r\n                    switch (type) {\r\n                        case \"object\":\r\n                            var subKeys = Object.keys(value);\r\n                            for (var i = 0; i < subKeys.length; ++i)\r\n                                workset.push(key + \".\" + subKeys[i]);\r\n                            break;\r\n                        default:\r\n                            func(key, value, obj);\r\n                            break;\r\n                    }\r\n                }\r\n            };\r\n            Util.getFirstInstanceOf = function (values, cls, offset, skip) {\r\n                if (offset === void 0) { offset = 0; }\r\n                if (skip === void 0) { skip = 0; }\r\n                for (var i = offset; i < values.length; ++i) {\r\n                    if (values[i] instanceof cls) {\r\n                        if (skip <= 0)\r\n                            return values[i];\r\n                        --skip;\r\n                    }\r\n                }\r\n                return undefined;\r\n            };\r\n            Util.getFirstOfType = function (values, type, offset, skip) {\r\n                if (offset === void 0) { offset = 0; }\r\n                if (skip === void 0) { skip = 0; }\r\n                for (var i = offset; i < values.length; ++i) {\r\n                    if (typeof values[i] == type) {\r\n                        if (skip <= 0)\r\n                            return values[i];\r\n                        --skip;\r\n                    }\r\n                }\r\n                return undefined;\r\n            };\r\n            Util.getAllInstancesOf = function (values, cls, offset) {\r\n                if (offset === void 0) { offset = 0; }\r\n                var result = [];\r\n                for (var i = offset; i < values.length; ++i) {\r\n                    if (values[i] instanceof cls)\r\n                        result.push(values[i]);\r\n                }\r\n                return result;\r\n            };\r\n            Util.getAllOfType = function (values, type, offset) {\r\n                if (offset === void 0) { offset = 0; }\r\n                var result = [];\r\n                for (var i = offset; i < values.length; ++i) {\r\n                    if (typeof values[i] == type)\r\n                        result.push(values[i]);\r\n                }\r\n                return result;\r\n            };\r\n            Util.fill = function (elements, func) {\r\n                var result = [];\r\n                for (var i = 0; i < elements; ++i)\r\n                    result.push(func(i));\r\n                return result;\r\n            };\r\n            return Util;\r\n        }());\r\n        util.Util = Util;\r\n    })(util = kr3m.util || (kr3m.util = {}));\r\n})(kr3m || (kr3m = {}));\r\nvar kr3m;\r\n(function (kr3m) {\r\n    var util;\r\n    (function (util) {\r\n        var Json = (function () {\r\n            function Json() {\r\n            }\r\n            Json.encode = function (obj) {\r\n                return JSON.stringify(obj);\r\n            };\r\n            Json.encodeNice = function (obj, padding) {\r\n                if (padding === void 0) { padding = \"\"; }\r\n                if (typeof obj == \"object\" && !obj[\"toUTCString\"]) {\r\n                    var json = \"\";\r\n                    if (typeof obj.length == \"number\") {\r\n                        if (obj.length === 0)\r\n                            return padding + \"[]\";\r\n                        json += padding + \"[\";\r\n                        for (var i = 0; i < obj.length; ++i)\r\n                            json += \"\\n\" + Json.encodeNice(obj[i], padding + \"\\t\") + \",\";\r\n                        if (obj.length > 0)\r\n                            json = json.slice(0, -1);\r\n                        json += \"\\n\" + padding + \"]\";\r\n                    }\r\n                    else {\r\n                        json += padding + \"{\";\r\n                        for (var ind in obj) {\r\n                            if (typeof obj[ind] == \"object\" && !obj[\"toUTCString\"])\r\n                                json += \"\\n\\t\" + padding + \"\\\"\" + ind + \"\\\":\\n\" + Json.encodeNice(obj[ind], padding + \"\\t\") + \",\";\r\n                            else\r\n                                json += \"\\n\\t\" + padding + \"\\\"\" + ind + \"\\\":\" + Json.encode(obj[ind]) + \",\";\r\n                        }\r\n                        if (json.slice(-1) == \",\")\r\n                            json = json.slice(0, -1);\r\n                        json += \"\\n\" + padding + \"}\";\r\n                    }\r\n                    return json;\r\n                }\r\n                else {\r\n                    return padding + Json.encode(obj);\r\n                }\r\n            };\r\n            Json.escapeSpecialChars = function (json) {\r\n                return json.replace(/[\\u0080-\\uffff]/g, function (char) { return \"\\\\u\" + (\"0000\" + char.charCodeAt(0).toString(16)).slice(-4); });\r\n            };\r\n            Json.reviver = function (key, computed) {\r\n                if (typeof computed == \"string\") {\r\n                    var date = kr3m.util.Dates.getDateFromDateTimeString(computed);\r\n                    if (date)\r\n                        return date;\r\n                }\r\n                return computed;\r\n            };\r\n            Json.isJSON = function (text) {\r\n                if (!text)\r\n                    return false;\r\n                try {\r\n                    JSON.parse(text);\r\n                    return true;\r\n                }\r\n                catch (e) {\r\n                    console.log(\"JSON parsing failed for\");\r\n                    console.log(text);\r\n                    return false;\r\n                }\r\n            };\r\n            Json.decode = function (json) {\r\n                if (!json)\r\n                    return null;\r\n                try {\r\n                    return JSON.parse(json, Json.reviver);\r\n                }\r\n                catch (e) {\r\n                    console.error(json);\r\n                    console.error(e);\r\n                    return null;\r\n                }\r\n            };\r\n            Json.mergeAssoc = function () {\r\n                var jsons = [];\r\n                for (var _i = 0; _i < arguments.length; _i++) {\r\n                    jsons[_i - 0] = arguments[_i];\r\n                }\r\n                var objs = [];\r\n                for (var i = 0; i < jsons.length; ++i)\r\n                    objs.push(Json.decode(jsons[i]));\r\n                var result = util.Util.mergeAssoc.apply(util.Util, objs);\r\n                return Json.encode(result);\r\n            };\r\n            return Json;\r\n        }());\r\n        util.Json = Json;\r\n    })(util = kr3m.util || (kr3m.util = {}));\r\n})(kr3m || (kr3m = {}));\r\n");
            Sandbox.SCRIPT_RPC_PRE = new javascript.Script("var __rpc = {id : 0, pending : []};\r\n\r\n\r\n\r\nfunction __cbFunc(functionName, forceCallback)\r\n{\r\n\tvar params = Array.prototype.slice.call(arguments, 2);\r\n\tvar callbacks = [];\r\n\tvar callbackOffsets = [];\r\n\tfor (var i = 0; i < params.length; ++i)\r\n\t{\r\n\t\tif (typeof params[i] == \"function\")\r\n\t\t{\r\n\t\t\tcallbacks.push(params[i]);\r\n\t\t\tcallbackOffsets.push(i);\r\n\t\t\tparams[i] = null;\r\n\t\t}\r\n\t}\r\n\t__rpc.pending.push(\r\n\t{\r\n\t\tid : ++__rpc.id,\r\n\t\tfunctionName : functionName,\r\n\t\tforceCallback : forceCallback,\r\n\t\tcallbacks : callbacks,\r\n\t\tcallbackOffsets : callbackOffsets,\r\n\t\tparams : params\r\n\t});\r\n}\r\n\r\n\r\n\r\nfunction __rpcCb(id, cbi, responses)\r\n{\r\n\tfor (var i = 0; i < __rpc.pending.length; ++i)\r\n\t{\r\n\t\tif (__rpc.pending[i].id == id)\r\n\t\t{\r\n\t\t\tvar p = __rpc.pending[i];\r\n\t\t\t__rpc.pending.splice(i, 1);\r\n\r\n\t\t\tif (cbi > -1 && cbi < p.callbacks.length)\r\n\t\t\t\tp.callbacks[cbi].apply(null, responses);\r\n\r\n\t\t\treturn;\r\n\t\t}\r\n\t}\r\n}\r\n");
            return Sandbox;
        }());
        javascript.Sandbox = Sandbox;
    })(javascript = kr3m.javascript || (kr3m.javascript = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var handlers;
        (function (handlers) {
            var ServerSideScripting = (function (_super) {
                __extends(ServerSideScripting, _super);
                function ServerSideScripting() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ServerSideScripting.prototype.deliverResource = function (context) {
                    var _this = this;
                    var realPath = context.documentRoot + context.getCurrentUri();
                    var contentType = kr3m.net.MimeTypes.getMimeTypeByFileName(realPath);
                    this.cache.getFile(realPath, [], function (file) {
                        if (!file)
                            return context.flush(404);
                        var content = file.toString("utf8");
                        _this.process(context, content, function (processedContent) {
                            if (content != processedContent)
                                context.response.disableBrowserCaching();
                            else
                                context.response.cacheUntil(new Date(Date.now() + 10 * 60 * 1000));
                            context.flush(200, processedContent, contentType);
                        });
                    });
                };
                return ServerSideScripting;
            }(handlers.FileSystem));
            handlers.ServerSideScripting = ServerSideScripting;
        })(handlers = net2.handlers || (net2.handlers = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var handlers;
        (function (handlers) {
            var ServerSideJavascript = (function (_super) {
                __extends(ServerSideJavascript, _super);
                function ServerSideJavascript() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.locaInitScriptBase = "function loc(id, tokens)\r\n{\r\n\tvar text = _locData[id] || \"\";\r\n\tif (tokens)\r\n\t{\r\n\t\tvar parts = text.split(\"##\");\r\n\t\tfor (var i = 1; i < parts.length; i += 2)\r\n\t\t\tparts[i] = tokens[parts[i]] || \"\";\r\n\t}\r\n\treturn text;\r\n}\r\n";
                    _this.locaInitScripts = {};
                    _this.errorElementCode = "<span style='color: red; font-weight: bold; background-color: yellow; padding: 2px; margin: 5px; border: solid black 1px; display: inline-block;'>\n\t##errorMessage##<br/>\n\t<code>##errorLine##</code>\n</span>";
                    return _this;
                }
                ServerSideJavascript.prototype.buildDummyDocument = function (context) {
                    var doc = {};
                    doc.location = {};
                    doc.location.href = context.request.getLocation();
                    var urlParts = kr3m.util.Url.parse(doc.location.href);
                    doc.location.protocol = urlParts.protocol + ":";
                    doc.location.host = urlParts.domain + ":" + urlParts.port;
                    doc.location.hostname = urlParts.domain;
                    doc.location.port = urlParts.port;
                    doc.location.pathname = urlParts.resource;
                    doc.location.search = urlParts.query ? "?" + urlParts.query : "";
                    doc.location.hash = "";
                    doc.location.username = urlParts.user || "";
                    doc.location.password = urlParts.password || "";
                    doc.location.origin = doc.location.href;
                    return doc;
                };
                ServerSideJavascript.prototype.getLocaleScript = function (context, callback) {
                    var _this = this;
                    if (!context.localization)
                        return callback(undefined);
                    context.localization.getTimestamp(context, function (timestamp) {
                        context.localization.getHash(context, function (hash) {
                            var meta = _this.locaInitScripts[hash];
                            if (meta && meta.timestamp >= timestamp)
                                return callback(meta.script);
                            if (timestamp === undefined)
                                return callback(undefined);
                            context.localization.getTexts(context, function (texts) {
                                texts = texts || {};
                                var scriptCode = "_locData = " + kr3m.util.Json.encode(texts) + "\n" + _this.locaInitScriptBase;
                                var script = new kr3m.javascript.Script(scriptCode);
                                _this.locaInitScripts[hash] = { script: script, timestamp: timestamp };
                                callback(script);
                            });
                        });
                    });
                };
                ServerSideJavascript.prototype.createSandbox = function (context, callback) {
                    var _this = this;
                    var sandbox = new kr3m.javascript.Sandbox();
                    sandbox.enableConsole();
                    sandbox.enableEcho();
                    if (context.config.sandbox && context.config.sandbox.allowFileAccess)
                        sandbox.enableFileAccess();
                    if (context.config.sandbox && context.config.sandbox.allowWebAccess)
                        sandbox.enableWebAccess();
                    context.request.getFormValues(function (formValues) {
                        var queryValues = context.request.getQueryValues();
                        sandbox.setGlobal("params", { POST: formValues, GET: queryValues });
                        var doc = _this.buildDummyDocument(context);
                        sandbox.setGlobal("document", doc);
                        sandbox.setGlobal("location", doc.location);
                        var sbContext = {
                            uriOriginal: context.request.getUri(),
                            uriRedirected: context.getCurrentUri(),
                            error: context.error ?
                                {
                                    httpCode: context.error.httpCode,
                                    content: context.error.content ? context.error.content.toString() : null
                                } : null
                        };
                        sandbox.setGlobal("context", sbContext);
                        _this.getLocaleScript(context, function (localeScript) {
                            if (localeScript)
                                sandbox.run(localeScript);
                            callback(sandbox);
                        });
                    });
                };
                ServerSideJavascript.prototype.processPart = function (context, sandbox, subUri, subContent, callback) {
                    var _this = this;
                    subContent = subContent.replace(/<\?=(.+?)\?>/g, "<script server>echo($1)</script>");
                    var searchPattern = /<script\s+(?:type=["']?serverscript['"]?|server)\s*>((?:[^"']|"[^"]*"|'[^']*')*?)<\/script>/gi;
                    kr3m.async.Loop.loop(function (loopDone) {
                        var matches = searchPattern.exec(subContent);
                        if (!matches)
                            return loopDone(false);
                        var code = matches[1];
                        kr3m.async.If.then(!sandbox, function (thenDone) {
                            _this.createSandbox(context, function (newSandbox) {
                                sandbox = newSandbox;
                                _this.dispatch("sandboxCreated", { handler: _this, sandbox: sandbox });
                                thenDone();
                            });
                        }, function () {
                            sandbox.runRpc(code, function (error) {
                                var consoleOutput = sandbox.getConsoleOutput();
                                var echo = sandbox.getEchoOutput().map(function (line) { return line.join(" "); }).join("");
                                for (var i = 0; i < consoleOutput.length; ++i) {
                                    if (consoleOutput[i].type == "err")
                                        logWarning("js sandbox console:", consoleOutput[i].text);
                                    else
                                        log("js sandbox log:", consoleOutput[i].text);
                                }
                                if (error) {
                                    var errorMessage = error.toString();
                                    var lineNumber = parseInt(error.stack.match(/evalmachine\.\<anonymous\>\:(\d+)/)[1], 10);
                                    var errorLine = code.split(/\r?\n/)[lineNumber - 1].replace(/^\s+/, "");
                                    logWarning("js sandbox error:", error.toString(), "in line", lineNumber, ":", errorLine);
                                    var tokens = {
                                        errorMessage: kr3m.util.Util.encodeHtml(errorMessage),
                                        script: kr3m.util.Util.encodeHtml(code).replace(/\r?\n/g, "<br/>"),
                                        errorLine: errorLine,
                                        lineNumber: lineNumber
                                    };
                                    echo += tokenize(_this.errorElementCode, tokens);
                                }
                                subContent = subContent.slice(0, matches.index) + echo + subContent.slice(searchPattern.lastIndex);
                                searchPattern.lastIndex = matches.index;
                                loopDone(true);
                            });
                        });
                    }, function () { return callback(subContent); });
                };
                ServerSideJavascript.prototype.process = function (context, content, callback) {
                    this.processPart(context, null, context.getCurrentUri(), content, callback);
                };
                return ServerSideJavascript;
            }(handlers.ServerSideScripting));
            handlers.ServerSideJavascript = ServerSideJavascript;
        })(handlers = net2.handlers || (net2.handlers = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var handlers;
        (function (handlers) {
            var Fragment = (function (_super) {
                __extends(Fragment, _super);
                function Fragment(uriPattern) {
                    if (uriPattern === void 0) { uriPattern = /\.html$/i; }
                    var _this = _super.call(this, uriPattern) || this;
                    _this.fragmentInitScript = new kr3m.javascript.Script("function fragment(fragmentPath, params)\r\n{\r\n\tvar html = \"<fragment\";\r\n\tif (params)\r\n\t{\r\n\t\tfor (var name in params)\r\n\t\t\thtml += \" \" + name + \"=\\\"\" + params[name] + \"\\\"\";\r\n\t}\r\n\thtml += \">\" + fragmentPath + \"</fragment>\";\r\n\techo(html);\r\n}\r\n");
                    return _this;
                }
                Fragment.prototype.createSandbox = function (context, callback) {
                    var _this = this;
                    _super.prototype.createSandbox.call(this, context, function (sandbox) {
                        sandbox.run(_this.fragmentInitScript);
                        callback(sandbox);
                    });
                };
                Fragment.prototype.locateFragment = function (context, subUri, fragmentPath, callback) {
                    var filePath = kr3m.util.File.resolvePath(context.documentRoot + subUri, fragmentPath);
                    this.cache.fileExists(filePath, function (exists) { return callback(exists ? filePath : ""); });
                };
                Fragment.prototype.getFragment = function (context, sandbox, subUri, fragmentPath, attributes, callback) {
                    var _this = this;
                    var abort = function (message) { return callback("<div style='font-weight: bold; color: red;'>" + message + "</div>"); };
                    this.locateFragment(context, subUri, fragmentPath, function (realPath) {
                        if (!realPath)
                            return abort("fragment " + fragmentPath + " not found");
                        _this.cache.getTextFile(realPath, function (fragment) {
                            if (!fragment)
                                return abort("fragment file " + realPath + " could not be loaded");
                            fragment = tokenize(fragment, attributes);
                            var newSubUri = kr3m.util.File.resolvePath(subUri, fragmentPath);
                            _this.processPart(context, sandbox, newSubUri, fragment, callback);
                        });
                    });
                };
                Fragment.prototype.processPart = function (context, sandbox, subUri, subContent, callback) {
                    var _this = this;
                    _super.prototype.processPart.call(this, context, sandbox, subUri, subContent, function (subContent) {
                        var searchPattern = /<fragment([^>]*)>([\s\S]*?)<\/fragment>/gi;
                        kr3m.async.Loop.loop(function (loopDone) {
                            var matches = searchPattern.exec(subContent);
                            if (!matches)
                                return callback(subContent);
                            var fragmentPath = matches[2];
                            var rawAttributes = kr3m.util.StringEx.splitNoQuoted(matches[1].trim().replace(/\s+/g, " "), " ")
                                .map(function (attribute) { return ({ name: attribute.replace(/\s*=.*$/, ""), value: attribute.replace(/^[^=]+=\s*["']?(.*?)["']?$/, "$1") }); });
                            var attributes = kr3m.util.Util.arrayToPairs(rawAttributes, "name", "value");
                            _this.getFragment(context, sandbox, subUri, fragmentPath, attributes, function (fragment) {
                                subContent = subContent.slice(0, matches.index) + fragment + subContent.slice(searchPattern.lastIndex);
                                searchPattern.lastIndex = matches.index;
                                loopDone();
                            });
                        });
                    });
                };
                Fragment.prototype.process = function (context, content, callback) {
                    _super.prototype.process.call(this, context, content, function (processed) {
                        if (!context.localization)
                            return callback(processed);
                        context.localization.parse(context, processed, {}, callback);
                    });
                };
                return Fragment;
            }(handlers.ServerSideJavascript));
            handlers.Fragment = Fragment;
        })(handlers = net2.handlers || (net2.handlers = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var handlers;
        (function (handlers) {
            var Relay = (function (_super) {
                __extends(Relay, _super);
                function Relay(uriPattern) {
                    if (uriPattern === void 0) { uriPattern = /^\/r\/\w+$/; }
                    var _this = _super.call(this, uriPattern) || this;
                    _this.cache = kr3m.cache.files.Downloads.getInstance();
                    return _this;
                }
                Relay.prototype.extractOptions = function (context, callback) {
                    try {
                        var decipher = cryptoLib.createDecipher("aes192", kr3m.net2.RELAY_PASSWORD);
                        var uri = context.getCurrentUri();
                        uri = uri.split("/").slice(-1).join("");
                        var json = decipher.update(uri, "hex", "utf8") + decipher.final("utf8");
                        var options = kr3m.util.Json.decode(json);
                        if (!options || !options.url)
                            return callback(undefined);
                        callback(options);
                    }
                    catch (e) {
                        logWarning("error while extracting relay uri", uri);
                        logWarning(e);
                        callback(undefined);
                    }
                };
                Relay.prototype.handle = function (context) {
                    var _this = this;
                    this.extractOptions(context, function (options) {
                        if (!options)
                            return context.flush(404);
                        _this.cache.getNewerFile(options.url, options.cacheDuration || 0, function (content, mimeType) {
                            if (!content)
                                return context.flush(404);
                            context.flush(200, content, mimeType);
                        });
                    });
                };
                return Relay;
            }(handlers.Abstract));
            handlers.Relay = Relay;
        })(handlers = net2.handlers || (net2.handlers = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var handlers;
        (function (handlers) {
            var Wrapper = (function (_super) {
                __extends(Wrapper, _super);
                function Wrapper(uriPattern, handleFunc) {
                    var _this = _super.call(this, uriPattern) || this;
                    _this.uriPattern = uriPattern;
                    _this.handleFunc = handleFunc;
                    return _this;
                }
                Wrapper.prototype.handle = function (context) {
                    this.handleFunc(context);
                };
                return Wrapper;
            }(handlers.Abstract));
            handlers.Wrapper = Wrapper;
        })(handlers = net2.handlers || (net2.handlers = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var HttpServer = (function () {
            function HttpServer(config, listener) {
                this.config = config;
                this.rawServer = httpLib.createServer(listener).listen(this.config.port);
                log("HTTP server listening on port " + this.config.port);
            }
            HttpServer.prototype.shutdown = function (callback) {
                log("HTTP server shutting down");
                this.rawServer.close(function () {
                    log("HTTP server shut down");
                    callback();
                });
            };
            return HttpServer;
        }());
        net2.HttpServer = HttpServer;
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var HttpsServer = (function () {
            function HttpsServer(config, listener) {
                this.config = config;
                var options = {
                    secureProtocol: "SSLv23_method",
                    secureOptions: constantsLib.SSL_OP_NO_SSLv3,
                    key: fsLib.readFileSync(this.config.key, "utf8"),
                    cert: fsLib.readFileSync(this.config.certificate, "utf8")
                };
                if (this.config.intermediate != "")
                    options.ca = this.loadBundle(this.config.intermediate);
                this.rawServer = httpsLib.createServer(options, listener).listen(this.config.port);
                log("HTTPS server listening on port " + this.config.port);
            }
            HttpsServer.prototype.loadBundle = function (bundlePath) {
                var content = fsLib.readFileSync(bundlePath, "utf8");
                var lines = content.split("\n");
                var results = [];
                for (var i = 0; i < lines.length; ++i) {
                    if (lines[i].indexOf("-----BEGIN CERTIFICATE-----") == 0)
                        results.push("");
                    results[results.length - 1] += lines[i] + "\n";
                }
                return results;
            };
            HttpsServer.prototype.shutdown = function (callback) {
                log("HTTPS server shutting down");
                this.rawServer.close(function () {
                    log("HTTPS server shut down");
                    callback();
                });
            };
            return HttpsServer;
        }());
        net2.HttpsServer = HttpsServer;
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var routers;
        (function (routers) {
            var Simple = (function (_super) {
                __extends(Simple, _super);
                function Simple(indexFileName) {
                    if (indexFileName === void 0) { indexFileName = "index.html"; }
                    var _this = _super.call(this) || this;
                    _this.indexFileName = indexFileName;
                    _this.cache = kr3m.cache.files.LocalFiles.getInstance();
                    return _this;
                }
                Simple.prototype.route = function (context, callback) {
                    var uri = context.getCurrentUri();
                    uri = uri.replace(/\/\/+/g, "/");
                    context.setCurrentUri(uri);
                    callback();
                };
                Simple.prototype.reroute = function (context, callback) {
                    var _this = this;
                    var uri = context.getCurrentUri();
                    if (uri.slice(-1) != "/") {
                        var filename = uri.split("/").pop();
                        if (filename.indexOf(".") >= 0)
                            return callback();
                        this.cache.fileExists(context.documentRoot + uri + ".html", function (exists) {
                            if (exists)
                                context.setCurrentUri(uri + ".html");
                            callback();
                        });
                        return;
                    }
                    this.cache.fileExists(context.documentRoot + uri + this.indexFileName, function (exists) {
                        if (exists) {
                            context.setCurrentUri(uri + _this.indexFileName);
                            return callback();
                        }
                        context.setCurrentUri(uri.slice(0, -1));
                        _this.reroute(context, callback);
                    });
                };
                return Simple;
            }(routers.Abstract));
            routers.Simple = Simple;
        })(routers = net2.routers || (net2.routers = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var sessionmanagers;
        (function (sessionmanagers) {
            var MySql = (function (_super) {
                __extends(MySql, _super);
                function MySql(db, tableName) {
                    if (tableName === void 0) { tableName = "sessions"; }
                    var _this = _super.call(this) || this;
                    _this.db = db;
                    _this.tableName = tableName;
                    _this.sessionCookieName = "kr3mN2Id";
                    _this.idLength = 32;
                    if (!clusterLib.worker)
                        _this.deleteOldSessions();
                    return _this;
                }
                MySql.prototype.deleteOldSessions = function () {
                    var _this = this;
                    var threshold = Date.now() - net2.Session.timeToLive;
                    var where = this.db.escape("`lastUpdated` < ?", [threshold]);
                    this.db.deleteBatch(this.tableName, where, function (deletedCount) {
                        if (deletedCount > 0)
                            logDebug("deleted", deletedCount, "old sessions");
                        setTimeout(function () { return _this.deleteOldSessions(); }, net2.Session.timeToLive / 2);
                    });
                };
                MySql.prototype.getSql = function (sessionId) {
                    var sql = "SELECT * FROM `" + this.tableName + "` WHERE `id` = ?";
                    sql = this.db.escape(sql, [sessionId]);
                    return sql;
                };
                MySql.prototype.getFreeSessionId = function (callback, errorCallback) {
                    var _this = this;
                    var id;
                    kr3m.async.Loop.loop(function (loopDone) {
                        kr3m.util.Rand.getSecureString(_this.idLength, null, function (secString) {
                            id = secString;
                            var sql = _this.getSql(id);
                            _this.db.fetchOne(sql, function (dummy) { return loopDone(!!dummy); }, errorCallback);
                        });
                    }, function () { return callback(id); });
                };
                MySql.prototype.buildSession = function (row, dirty) {
                    var values = row.valuesJson ? kr3m.util.Json.decode(row.valuesJson) : {};
                    var session = new net2.Session(row.id, row.lastUpdated, values);
                    session.setDirty();
                    return session;
                };
                MySql.prototype.get = function (context, callback) {
                    var _this = this;
                    var sessionId = context.request.getCookieValue(this.sessionCookieName) || "";
                    var sql = this.getSql(sessionId);
                    this.db.fetchRow(sql, function (row) {
                        if (row && !row.isDestroyed)
                            return callback(_this.buildSession(row, true));
                        _this.getFreeSessionId(function (sessionId) {
                            row = { id: sessionId, lastUpdated: Date.now() };
                            _this.db.insert(_this.tableName, row, function () {
                                callback(_this.buildSession(row, false));
                            }, function () { return callback(undefined); });
                        }, function () { return callback(undefined); });
                    });
                };
                MySql.prototype.handleReleasedChange = function (session) {
                    var row = {
                        id: session.id,
                        lastUpdated: Date.now(),
                        valuesJson: session.getValuesJson()
                    };
                    this.db.update(this.tableName, row);
                };
                MySql.prototype.release = function (context, session, callback) {
                    var _this = this;
                    session.release();
                    session.on(net2.Session.EVENT_DIRTY, function () { return _this.handleReleasedChange(session); });
                    context.response.setCookie(this.sessionCookieName, session.id, session.getExpiry(), true);
                    if (!session.isDirty())
                        return callback();
                    var row = {
                        id: session.id,
                        lastUpdated: Date.now(),
                        valuesJson: session.getValuesJson()
                    };
                    this.db.update(this.tableName, row, callback);
                };
                MySql.prototype.regenerate = function (context, session, callback) {
                    this.getFreeSessionId(function (newId) {
                        session.id = newId;
                        session.setDirty();
                        callback();
                    });
                };
                MySql.prototype.destroy = function (context, session, callback) {
                    var sql = "UPDATE `" + this.tableName + "` SET `isDestroyed` = 'true' WHERE `id` = ? LIMIT 1;";
                    sql = this.db.escape(sql, [session.id]);
                    this.db.query(sql, function () { return callback(); });
                };
                MySql.TABLE_CREATE_SCRIPT = "CREATE TABLE `sessions` (\r\n  `id` varchar(32) NOT NULL DEFAULT '',\r\n  `lastUpdated` bigint(20) UNSIGNED NOT NULL,\r\n  `isDestroyed` enum('false','true') NOT NULL DEFAULT 'false',\r\n  `valuesJson` text NOT NULL\r\n) ENGINE=InnoDB DEFAULT CHARSET=utf8;\r\n\r\n\r\nALTER TABLE `sessions`\r\n  ADD PRIMARY KEY (`id`),\r\n  ADD KEY `lastUpdate` (`lastUpdated`);\r\n";
                return MySql;
            }(sessionmanagers.Abstract));
            sessionmanagers.MySql = MySql;
        })(sessionmanagers = net2.sessionmanagers || (net2.sessionmanagers = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var AppServer = (function () {
            function AppServer(configPath) {
                if (configPath === void 0) { configPath = "config/config.json"; }
                var _this = this;
                this.configPath = configPath;
                this.isShuttingDown = false;
                this.flags = new kr3m.async.Flags();
                this.handlers = [];
                this.contextClass = net2.Context;
                this.cluster = new kr3m.mulproc.Cluster();
                if (clusterLib.isMaster)
                    log("loading config from", configPath);
                kr3m.util.File.loadJsonFile(configPath, function (jsonConfig) {
                    _this.config = new kr3m.net2.configs.AppServer();
                    if (!jsonConfig) {
                        log("config file not found:", configPath);
                        _this.configPath = "";
                    }
                    else {
                        _this.config = kr3m.util.Util.mergeAssocRecursive(_this.config, jsonConfig);
                    }
                    kr3m.mulproc.adjustLog(_this.config.useLogColors);
                    _this.defaultRouter = new kr3m.net2.routers.Simple();
                    _this.defaultLocalization = new kr3m.net2.localizations.Simple(_this.config.localization);
                    _this.flags.set("config");
                });
                process.on("uncaughtException", this.handleUncaughtException.bind(this));
            }
            AppServer.prototype.handleUncaughtException = function (err) {
                logError(err["stack"]);
                logError("[SERVER TERMINATED]");
                process.exit(1);
            };
            AppServer.prototype.terminate = function () {
                log("[SERVER TERMINATED]");
                process.exit(0);
            };
            AppServer.prototype.shutdown = function () {
                var _this = this;
                if (this.isShuttingDown)
                    return;
                this.isShuttingDown = true;
                log("shutdown sequence started");
                var join = new kr3m.async.Join();
                if (this.httpServer)
                    this.httpServer.shutdown(join.getCallback());
                if (this.httpsServer)
                    this.httpsServer.shutdown(join.getCallback());
                this.cluster.shutdown(join.getCallback());
                var killTimer = setTimeout(function () {
                    killTimer = null;
                    log("server shutdown taking too long, forcing process exit");
                    _this.terminate();
                }, 1000);
                killTimer.unref();
                join.addCallback(function () {
                    if (killTimer)
                        clearTimeout(killTimer);
                    log("shutdown sequence completed");
                    _this.terminate();
                });
            };
            AppServer.prototype.shutdownOnFileChange = function (path) {
                var _this = this;
                fsLib.watch(path, function () {
                    log("--------------------------------------------------------");
                    log(path, "changed, shutting down");
                    log("--------------------------------------------------------");
                    _this.shutdown();
                });
            };
            AppServer.prototype.shutdownOnFolderChange = function (path) {
                var _this = this;
                kr3m.util.FolderWatcher.watch(path, function (fileName) {
                    log("--------------------------------------------------------");
                    log(path, "folder changed, shutting down");
                    log("--------------------------------------------------------");
                    _this.shutdown();
                });
            };
            AppServer.prototype.run = function () {
                var _this = this;
                this.flags.onceSet("config", function () {
                    _this.cluster.setMaster(function () {
                        _this.runMaster();
                    });
                    var workerCount = _this.config.workerCount || osLib.cpus().length;
                    _this.cluster.registerPersistant("webserver", { count: workerCount, staggered: true }, function () {
                        _this.runWorker(function () {
                            _this.cluster.persistantInitialized();
                        });
                    });
                    _this.cluster.run();
                });
            };
            AppServer.prototype.runMaster = function () {
                log("--------------------------------------------------------");
                log("starting AppServer master");
                log("--------------------------------------------------------");
                log("kr3m-Framework-Version:", kr3m.VERSION);
                log("--------------------------------------------------------");
                if (this.configPath)
                    this.shutdownOnFileChange(this.configPath);
                this.shutdownOnFileChange(process.argv[1]);
                this.flags.set("master");
            };
            AppServer.prototype.getHandlersOfClass = function (cls) {
                return this.handlers.filter(function (handler) { return handler instanceof cls; });
            };
            AppServer.prototype.addHandler = function (handler) {
                this.handlers.push(handler);
            };
            AppServer.prototype.on = function (uriPattern, listener) {
                this.handlers.push(new kr3m.net2.handlers.Wrapper(uriPattern, listener));
            };
            AppServer.prototype.getHandler = function (context) {
                var bestOffset = -1;
                var bestLength = 0;
                var uri = context.getCurrentUri();
                for (var i = 0; i < this.handlers.length; ++i) {
                    var matches = this.handlers[i].uriPattern.exec(uri);
                    if (matches && matches[0].length > bestLength) {
                        if (this.handlers[i].accepts(context)) {
                            bestLength = matches[0].length;
                            bestOffset = i;
                        }
                    }
                }
                return this.handlers[bestOffset];
            };
            AppServer.prototype.setupContext = function (request, response, callback) {
                var context = new this.contextClass(request, response, this.config, this.defaultRouter, this.defaultLocalization, this.defaultSessionManager);
                context.documentRoot = this.config.documentRoot;
                callback(context);
            };
            AppServer.prototype.handleRequest = function (request, response) {
                var _this = this;
                this.setupContext(request, response, function (context) {
                    if (_this.config.forceHttps && !context.request.isSecure()) {
                        var newLocation = context.request.getLocation();
                        newLocation = newLocation.replace(/^http\:/i, "https:");
                        return context.response.redirect(newLocation);
                    }
                    context.router.route(context, function () {
                        var lastHandler;
                        var retryCount = 0;
                        kr3m.async.Loop.loop(function (next) {
                            context.setRedirectHandler(next);
                            context.router.reroute(context, function () {
                                var handler = _this.getHandler(context);
                                if (!handler) {
                                    logWarning("no handler found for uri", context.getCurrentUri());
                                    return context.flush(404);
                                }
                                retryCount = handler == lastHandler ? retryCount + 1 : 0;
                                if (retryCount > 20) {
                                    logWarning("handler is stuck in endless error loop for uri", context.getCurrentUri());
                                    return context.flush(404);
                                }
                                handler.handle(context);
                            });
                        });
                    });
                });
            };
            AppServer.prototype.runWorker = function (callback) {
                log("starting AppServer worker W" + ("00" + clusterLib.worker.id).slice(-3));
                var listener = this.handleRequest.bind(this);
                if (this.config.http)
                    this.httpServer = new net2.HttpServer(this.config.http, listener);
                if (this.config.https)
                    this.httpsServer = new net2.HttpsServer(this.config.https, listener);
                this.flags.set("worker");
                callback();
            };
            AppServer.prototype.initWithDefaults = function (options, callback) {
                var _this = this;
                options = options || {};
                this.flags.onceSet("config", function () {
                    if (_this.config.mysql) {
                        var dbConfig = kr3m.util.Util.mergeAssoc(new kr3m.db.MySqlDbConfig(), _this.config.mysql);
                        var db = new kr3m.db.MySqlDb(dbConfig);
                        _this.defaultSessionManager = new kr3m.net2.sessionmanagers.MySql(db);
                        _this.flags.set("sessions", "mySql");
                    }
                    if (clusterLib.isMaster)
                        return callback && callback({ db: db });
                    if (!options.noHandlers) {
                        _this.addHandler(new kr3m.net2.handlers.FileSystem());
                        _this.addHandler(new kr3m.net2.handlers.Fragment());
                        _this.addHandler(new kr3m.net2.handlers.Relay());
                        _this.addHandler(new kr3m.net2.handlers.Status());
                        _this.flags.set("handlers");
                    }
                    callback && callback({ db: db });
                });
            };
            return AppServer;
        }());
        net2.AppServer = AppServer;
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var net2;
    (function (net2) {
        var handlers;
        (function (handlers) {
            var Share = (function (_super) {
                __extends(Share, _super);
                function Share(uriPattern) {
                    if (uriPattern === void 0) { uriPattern = /^\/share(\.php|\.html)?$/i; }
                    var _this = _super.call(this, uriPattern) || this;
                    _this.template = "<!DOCTYPE html>\n<html itemscope itemtype=\"http://schema.org/WebPage\">\n\t<head>\n\t\t<title>##title##</title>\n\t\t<meta charset=\"UTF-8\">\n\t\t<meta property=\"og:title\" itemprop=\"name\" name=\"title\" content=\"##title##\"/>\n\t\t<meta property=\"og:description\" itemprop=\"description\" name=\"description\" content=\"##description##\"/>\n\t\t<meta property=\"og:image\" itemprop=\"image\" content=\"##image##\"/>\n\t\t<meta property=\"og:image:width\" content=\"1200\"/>\n\t\t<meta property=\"og:image:height\" content=\"630\"/>\n\t</head>\n\t<body>\n\t\t<script>\n\t\t\ttop.location = \"##url##\";\n\t\t</script>\n\t</body>\n</html>\n";
                    return _this;
                }
                Share.prototype.handle = function (context) {
                    var params = context.request.getQueryValues();
                    for (var name in params) {
                        if (name.slice(0, 2) == "og")
                            params[name.slice(2)] = params[name];
                    }
                    for (var name in params)
                        params[name] = kr3m.util.Util.encodeHtml(params[name]);
                    for (var name in context.config.share)
                        params[name] = params[name] || context.config.share[name] || "";
                    var result = tokenize(this.template, params);
                    context.flush(200, result, "text/html");
                };
                return Share;
            }(kr3m.net2.handlers.Abstract));
            handlers.Share = Share;
        })(handlers = net2.handlers || (net2.handlers = {}));
    })(net2 = kr3m.net2 || (kr3m.net2 = {}));
})(kr3m || (kr3m = {}));
var cuboro;
(function (cuboro) {
    var AppServer = (function (_super) {
        __extends(AppServer, _super);
        function AppServer() {
            var _this = _super.call(this) || this;
            _this.contextClass = cuboro.Context;
            _this.flags.onceSet("config", function () {
                _this.defaultLocalization = new cuboro.Localization(_this.config.localization);
            });
            return _this;
        }
        AppServer.prototype.initMail = function () {
            kr3m.mail.Email2.init(this.config.email);
        };
        AppServer.prototype.initDatabase = function (callback) {
            var _this = this;
            var dbConfig = kr3m.util.Util.mergeAssoc(new kr3m.db.MySqlDbConfig(), this.config.mysql);
            db = new kr3m.db.MySqlDb(dbConfig);
            this.flags.set("sessions");
            var updater = new kr3m.db.MySqlDbUpdater(db);
            updater.update(cuboro.DB_VERSION, function (status) {
                if (status == kr3m.SUCCESS) {
                    _this.defaultSessionManager = new kr3m.net2.sessionmanagers.MySql(db);
                    _this.flags.set("sessions", "mySql");
                    _this.flags.set("mySql");
                    return callback();
                }
                logError("database update check failed with status", status);
                _this.shutdownOnFileChange("server.js");
                _this.shutdownOnFolderChange("database");
            });
        };
        AppServer.prototype.setupContext = function (request, response, callback) {
            _super.prototype.setupContext.call(this, request, response, function (context) {
                context.response.addAccessControl();
                callback(context);
            });
        };
        AppServer.prototype.runMaster = function () {
            var _this = this;
            log("--------------------------------------------------------");
            log("starting AppServer master");
            log("--------------------------------------------------------");
            log("kr3m-Framework-Version:", kr3m.VERSION);
            log("Cuboro-Version:", cuboro.VERSION);
            log("--------------------------------------------------------");
            this.initDatabase(function () {
                _this.shutdownOnFileChange(_this.configPath);
                _this.shutdownOnFileChange(process.argv[1]);
            });
        };
        AppServer.prototype.runWorker = function (callback) {
            var _this = this;
            this.addHandler(new cuboro.handlers.Gateway());
            this.addHandler(new cuboro.handlers.Language());
            this.addHandler(new cuboro.handlers.Status());
            this.addHandler(new kr3m.net2.handlers.FileSystem());
            this.addHandler(new kr3m.net2.handlers.Share());
            _super.prototype.runWorker.call(this, function () {
                _this.initMail();
                _this.initDatabase(function () {
                    callback();
                });
            });
        };
        return AppServer;
    }(kr3m.net2.AppServer));
    cuboro.AppServer = AppServer;
})(cuboro || (cuboro = {}));
var server = new cuboro.AppServer();
server.run();
