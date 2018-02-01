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
            return StringEx;
        }());
        StringEx.BOM = "\ufeff";
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
            return Dates;
        }());
        Dates.USE_UTC = false;
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
            return Log;
        }());
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
            return Loop;
        }());
        Loop.MAX_SYNC_ITERATIONS = 200;
        async.Loop = Loop;
    })(async = kr3m.async || (kr3m.async = {}));
})(kr3m || (kr3m = {}));
log("start ");
var count = 0;
kr3m.async.Loop.loop(function (next) {
    log(count);
    count++;
    if (count <= 10) {
        next(true);
    }
    else
        next(false);
}, function () {
    log("fertig");
});
