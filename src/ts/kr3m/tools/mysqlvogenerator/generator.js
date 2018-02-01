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
    kr3m.VERSION = "1.7.1.9";
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
var kr3m;
(function (kr3m) {
    var tools;
    (function (tools) {
        var mysqlvogenerator;
        (function (mysqlvogenerator) {
            mysqlvogenerator.TEMPLATES = {
                TAB_FINDERS: "\t\tpublic ##finderName##(\n\t\t\t##typedParams##,\n\t\t\tcallback:CB<##className##[]>,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"finderName\");\n\t\t\tvar sql = \"SELECT * FROM `##tableName##` WHERE `##keysSql##` = ?\";\n\t\t\tsql = db.escape(sql, [##keysComma##]);\n\t\t\tdb.fetchAll(sql, (rows:any[]) =>\n\t\t\t{\n\t\t\t\tfor (var i = 0; i < rows.length; ++i)\n\t\t\t\t{\n\t\t\t\t\trows[i].__proto__ = kr3m.util.Factory.getInstance().map(##className##).prototype;\n\t\t\t\t\trows[i].postLoad();\n\t\t\t\t}\n\t\t\t\tcallback(rows);\n\t\t\t}, errorCallback);\n\t\t}\n",
                TAB_FINDERS_UNIQUE: "\t\tpublic ##finderName##(\n\t\t\t##typedParams##,\n\t\t\tcallback:CB<##className##>,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"##finderName##\");\n\t\t\tvar sql = \"SELECT * FROM `##tableName##` WHERE `##keysSql##` = ? LIMIT 0,1\";\n\t\t\tsql = db.escape(sql, [##keysComma##]);\n\t\t\tdb.fetchRow(sql, (row) =>\n\t\t\t{\n\t\t\t\tif (!row)\n\t\t\t\t\treturn callback(undefined);\n\n\t\t\t\trow.__proto__ = kr3m.util.Factory.getInstance().map(##className##).prototype;\n\t\t\t\trow.postLoad();\n\t\t\t\tcallback(row);\n\t\t\t}, errorCallback);\n\t\t}\n",
                TAB_FINDERS_UNIQUE_ASSOC: "\t\t/*\n\t\t\tFunction for loading several objects at once based on their\n\t\t\tunique ##keySingular##.\n\n\t\t\tA map is returned that contains all found objects with the\n\t\t\tunique ##keySingular## as a key.\n\t\t*/\n\t\tpublic ##finderName##(\n\t\t\t##typedParams##,\n\t\t\tcallback:(vosBy##keyCapital##:{[##keySingular##:##keyType##]:##className##}) => void,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"##finderName##\");\n\t\t\tif (##keyPlural##.length == 0)\n\t\t\t\treturn callback({});\n\n\t\t\tvar sql = \"SELECT * FROM `##tableName##` WHERE `##keySingular##` IN (?)\";\n\t\t\tsql = db.escape(sql, [##keyPlural##]);\n\t\t\tdb.fetchAll(sql, (rows) =>\n\t\t\t{\n\t\t\t\tfor (var i = 0; i < rows.length; ++i)\n\t\t\t\t{\n\t\t\t\t\trows[i].__proto__ = kr3m.util.Factory.getInstance().map(##className##).prototype;\n\t\t\t\t\trows[i].postLoad();\n\t\t\t\t}\n\t\t\t\tcallback(kr3m.util.Util.arrayToAssoc(rows, \"##keySingular##\"));\n\t\t\t}, errorCallback);\n\t\t}\n",
                TAB_GENERATORS: "\t\tpublic getFree##capitalKey##(\n\t\t\tcallback:(##key##:string) => void,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"getFree##capitalKey##\");\n\t\t\tvar ##key##:string;\n\t\t\tkr3m.async.Loop.loop((loopDone) =>\n\t\t\t{\n\t\t\t\tkr3m.util.Rand.getSecureString(##keyLength##, null, (secString) =>\n\t\t\t\t{\n\t\t\t\t\t##key## = secString;\n\t\t\t\t\tthis.getBy##capitalKey##(##key##, dummy => loopDone(!!dummy), errorCallback);\n\t\t\t\t});\n\t\t\t}, () => callback(##key##));\n\t\t}\n",
                TAB_GENERIC_FUNCTIONS: "\t\tpublic isColumnName(name:string):boolean\n\t\t{\n\t\t\treturn (##columnNames##).indexOf(name) >= 0;\n\t\t}\n\n\n\n\t\tpublic getColumnNames():string[]\n\t\t{\n\t\t\treturn ##columnNames##;\n\t\t}\n\n\n\n\t\t/*\n\t\t\tGenerates an ORDER BY string for mysql from the strings\n\t\t\tgiven in ordering.\n\n\t\t\tThe parameter ordering can contain columnNames of the table\n\t\t\tor \"asc\" / \"desc\" (case is ignored). asc and desc will be\n\t\t\tadded to the last columnName added before the asc / desc\n\t\t\tparameter.\n\n\t\t\tValues that are neither \"asc\", \"desc\" or a columnName will\n\t\t\tbe silently ignored.\n\n\t\t\tExample:\n\t\t\t\ttable.buildOrdering([\"lastName\", \"firstName\", \"ASC\", \"age\", \"DESC\"]);\n\t\t*/\n\t\tpublic buildOrdering(ordering:string[]):string\n\t\t{\n\t\t\tvar parts:string[] = [];\n\t\t\tvar ascDescRe = /^asc|desc$/i;\n\t\t\tfor (var i = 0; i < ordering.length; ++i)\n\t\t\t{\n\t\t\t\tif (this.isColumnName(ordering[i]))\n\t\t\t\t\tparts.push(db.escapeId(ordering[i]));\n\t\t\t\telse if (ascDescRe.test(ordering[i]) && parts.length > 0)\n\t\t\t\t\tparts[parts.length - 1] += \" \" + ordering[i].toUpperCase();\n\t\t\t}\n\t\t\treturn parts.length > 0 ? \" ORDER BY \" + parts.join(\", \") : \"\";\n\t\t}\n\n\n\n\t\tpublic getCount(\n\t\t\twhere:string,\n\t\t\tcallback:NumberCallback,\n\t\t\terrorCallback:ErrorCallback):void;\n\n\t\tpublic getCount(\n\t\t\twhere:string,\n\t\t\tcallback:NumberCallback):void;\n\n\t\tpublic getCount(\n\t\t\tcallback:NumberCallback,\n\t\t\terrorCallback:ErrorCallback):void;\n\n\t\tpublic getCount(\n\t\t\tcallback:NumberCallback):void;\n\n\t\tpublic getCount():void\n\t\t{\n\t\t\tvar u = kr3m.util.Util;\n\n\t\t\tvar where = <string> u.getFirstOfType(arguments, \"string\", 0, 0) || \"1\";\n\t\t\twhere = where.replace(/^\\s*where\\s*/i, \" \");\n\n\t\t\tvar callback = <(count:number) => void> u.getFirstOfType(arguments, \"function\", 0, 0);\n\t\t\tvar errorCallback = <ErrorCallback> u.getFirstOfType(arguments, \"function\", 0, 1);\n\n\t\t\tvar sql = \"SELECT COUNT(*) FROM `##tableName##` WHERE \" + where;\n\t\t\tdb.fetchOne(sql, callback, errorCallback);\n\t\t}\n\n\n\n\t\tprivate wrapErrorCallback(\n\t\t\terrorCallback:ErrorCallback,\n\t\t\tfunctionName:string):ErrorCallback\n\t\t{\n\t\t\tif (!errorCallback)\n\t\t\t\treturn errorCallback;\n\n\t\t\tvar newCallback = (errorMessage) =>\n\t\t\t{\n\t\t\t\terrorCallback(\"##className##.\" + functionName + \" - \" + errorMessage);\n\t\t\t}\n\t\t\treturn newCallback;\n\t\t}\n\n\n\n\t\tpublic get(\n\t\t\twhereSql:string,\n\t\t\toffset:number,\n\t\t\tlimit:number,\n\t\t\tordering:string[],\n\t\t\tcallback:CB<##className##[]>,\n\t\t\terrorCallback:ErrorCallback):void;\n\n\t\tpublic get(\n\t\t\twhereSql:string,\n\t\t\toffset:number,\n\t\t\tlimit:number,\n\t\t\tordering:string[],\n\t\t\tcallback:CB<##className##[]>):void;\n\n\t\tpublic get(\n\t\t\twhereSql:string,\n\t\t\toffset:number,\n\t\t\tlimit:number,\n\t\t\tcallback:CB<##className##[]>,\n\t\t\terrorCallback:ErrorCallback):void;\n\n\t\tpublic get(\n\t\t\twhereSql:string,\n\t\t\toffset:number,\n\t\t\tlimit:number,\n\t\t\tcallback:CB<##className##[]>):void;\n\n\t\tpublic get(\n\t\t\twhereSql:string,\n\t\t\tordering:string[],\n\t\t\tcallback:CB<##className##[]>,\n\t\t\terrorCallback:ErrorCallback):void;\n\n\t\tpublic get(\n\t\t\twhereSql:string,\n\t\t\tordering:string[],\n\t\t\tcallback:CB<##className##[]>):void;\n\n\t\tpublic get(\n\t\t\twhereSql:string,\n\t\t\tcallback:CB<##className##[]>,\n\t\t\terrorCallback:ErrorCallback):void;\n\n\t\tpublic get(\n\t\t\twhereSql:string,\n\t\t\tcallback:CB<##className##[]>):void;\n\n\t\tpublic get(\n\t\t\toffset:number,\n\t\t\tlimit:number,\n\t\t\tcallback:CB<##className##[]>,\n\t\t\terrorCallback:ErrorCallback):void;\n\n\t\tpublic get(\n\t\t\toffset:number,\n\t\t\tlimit:number,\n\t\t\tcallback:CB<##className##[]>):void;\n\n\t\tpublic get(\n\t\t\tcallback:CB<##className##[]>,\n\t\t\terrorCallback:ErrorCallback):void;\n\n\t\tpublic get(\n\t\t\tcallback:CB<##className##[]>):void;\n\n\t\tpublic get():void\n\t\t{\n\t\t\tvar u = kr3m.util.Util;\n\n\t\t\tvar whereSql = <string> u.getFirstOfType(arguments, \"string\", 0, 0) || \"1\";\n\t\t\twhereSql = whereSql.replace(/^\\s*where\\s*/i, \" \");\n\n\t\t\tvar callback = <CB<##className##[]>> u.getFirstOfType(arguments, \"function\", 0, 0);\n\t\t\tvar errorCallback = <ErrorCallback> u.getFirstOfType(arguments, \"function\", 0, 1);\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"get\");\n\n\t\t\tvar sql = \"SELECT * FROM `##tableName##` WHERE \" + whereSql;\n\n\t\t\tvar ordering = <string[]> u.getFirstOfType(arguments, \"object\", 0, 0) || [];\n\t\t\tif (ordering.length > 0)\n\t\t\t\tsql += this.buildOrdering(ordering);\n\n\t\t\tvar offset = <number> u.getFirstOfType(arguments, \"number\", 0, 0) || 0;\n\t\t\tvar limit = <number> u.getFirstOfType(arguments, \"number\", 0, 1) || 0;\n\t\t\tif (limit > 0)\n\t\t\t\tsql += db.escape(\" LIMIT ?, ?\", [offset, limit]);\n\n\t\t\tdb.fetchAll(sql, (rows:any[]) =>\n\t\t\t{\n\t\t\t\tfor (var i = 0; i < rows.length; ++i)\n\t\t\t\t{\n\t\t\t\t\trows[i].__proto__ = kr3m.util.Factory.getInstance().map(##className##).prototype;\n\t\t\t\t\trows[i].postLoad();\n\t\t\t\t}\n\t\t\t\tcallback(rows);\n\t\t\t}, errorCallback);\n\t\t}\n\n\n\n\t\tpublic getIterative(\n\t\t\twhere:string,\n\t\t\tdataCallback:(vos:##className##[], callback:Callback) => void,\n\t\t\tdoneCallback?:Callback,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"getIterative\");\n\t\t\twhere = where.replace(/^\\s*where\\s*/i, \" \");\n\t\t\tvar sql = \"SELECT * FROM `##tableName##` WHERE \" + where;\n\t\t\tdb.queryIterative(sql, (rows, nextBatch) =>\n\t\t\t{\n\t\t\t\tfor (var i = 0; i < rows.length; ++i)\n\t\t\t\t{\n\t\t\t\t\trows[i].__proto__ = kr3m.util.Factory.getInstance().map(##className##).prototype;\n\t\t\t\t\trows[i].postLoad();\n\t\t\t\t}\n\t\t\t\tdataCallback(rows, nextBatch);\n\t\t\t}, doneCallback, 20, errorCallback);\n\t\t}\n\n\n\n\t\t/*\n\t\t\tSaves the given objects into the table without and kind of checking.\n\t\t*/\n\t\tpublic updateRaw(\n\t\t\trows:any[],\n\t\t\tcallback?:Callback,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"updateRaw\");\n\t\t\tdb.updateBatch(\"##tableName##\", rows, callback, db.defaultBatchSize, \"id\", errorCallback);\n\t\t}\n\n\n\n\t\t/*\n\t\t\tCalls the function of the same name from kr3m.db.MySqlDb using this\n\t\t\ttable's name and changing the result elements into VOs before returning\n\t\t\tthem.\n\n\t\t\tCareful: if joins are used, the returned VOs may contain attributes that\n\t\t\taren't defined in the class definition (in Typescript).\n\t\t*/\n\t\tpublic fetchPage(\n\t\t\twhere:Object|string,\n\t\t\torderBy:{col:string, asc:boolean}[],\n\t\t\tjoins:{localCol:string, foreignCol:string, tableName:string}[],\n\t\t\toffset:number, limit:number,\n\t\t\tcallback:(rows:any[], totalCount:number) => void):void\n\t\t{\n\t\t\tdb.fetchPage(\"##tableName##\", where, orderBy, joins, offset, limit, (rows:any[], totalCount:number) =>\n\t\t\t{\n\t\t\t\tfor (var i = 0; i < rows.length; ++i)\n\t\t\t\t{\n\t\t\t\t\trows[i].__proto__ = kr3m.util.Factory.getInstance().map(##className##).prototype;\n\t\t\t\t\trows[i].postLoad();\n\t\t\t\t}\n\t\t\t\tcallback(rows, totalCount);\n\t\t\t});\n\t\t}\n\n\n\n\t\tpublic fetchCol(\n\t\t\tcolName:string,\n\t\t\tdistinct:boolean,\n\t\t\twhereSql:string,\n\t\t\toffset:number,\n\t\t\tlimit:number,\n\t\t\tordering:string[],\n\t\t\tcallback:(col:any[]) => void,\n\t\t\terrorCallback:ErrorCallback):void;\n\n\t\tpublic fetchCol(\n\t\t\tcolName:string,\n\t\t\twhereSql:string,\n\t\t\toffset:number,\n\t\t\tlimit:number,\n\t\t\tordering:string[],\n\t\t\tcallback:(col:any[]) => void,\n\t\t\terrorCallback:ErrorCallback):void;\n\n\t\tpublic fetchCol(\n\t\t\tcolName:string,\n\t\t\tdistinct:boolean,\n\t\t\twhereSql:string,\n\t\t\toffset:number,\n\t\t\tlimit:number,\n\t\t\tordering:string[],\n\t\t\tcallback:(col:any[]) => void):void;\n\n\t\tpublic fetchCol(\n\t\t\tcolName:string,\n\t\t\twhereSql:string,\n\t\t\toffset:number,\n\t\t\tlimit:number,\n\t\t\tordering:string[],\n\t\t\tcallback:(col:any[]) => void):void;\n\n\t\tpublic fetchCol(\n\t\t\tcolName:string,\n\t\t\tdistinct:boolean,\n\t\t\twhereSql:string,\n\t\t\tcallback:(col:any[]) => void,\n\t\t\terrorCallback:ErrorCallback):void;\n\n\t\tpublic fetchCol(\n\t\t\tcolName:string,\n\t\t\twhereSql:string,\n\t\t\tcallback:(col:any[]) => void,\n\t\t\terrorCallback:ErrorCallback):void;\n\n\t\tpublic fetchCol(\n\t\t\tcolName:string,\n\t\t\tdistinct:boolean,\n\t\t\twhereSql:string,\n\t\t\tcallback:(col:any[]) => void):void;\n\n\t\tpublic fetchCol(\n\t\t\tcolName:string,\n\t\t\twhereSql:string,\n\t\t\tcallback:(col:any[]) => void):void;\n\n\t\tpublic fetchCol(\n\t\t\tcolName:string,\n\t\t\tdistinct:boolean,\n\t\t\tcallback:(col:any[]) => void):void;\n\n\t\tpublic fetchCol(\n\t\t\tcolName:string,\n\t\t\tcallback:(col:any[]) => void):void;\n\n\t\tpublic fetchCol():void\n\t\t{\n\t\t\tvar u = kr3m.util.Util;\n\n\t\t\tvar colName = <string> u.getFirstOfType(arguments, \"string\", 0, 0);\n\t\t\tvar whereSql = <string> u.getFirstOfType(arguments, \"string\", 0, 1) || \"1\";\n\t\t\tvar offset = <number> u.getFirstOfType(arguments, \"number\", 0, 0) || 0;\n\t\t\tvar limit = <number> u.getFirstOfType(arguments, \"number\", 0, 1) || 0;\n\t\t\tvar ordering = <string[]> u.getFirstOfType(arguments, \"object\", 0, 1) || [];\n\t\t\tvar distinct = <boolean> u.getFirstOfType(arguments, \"boolean\", 0, 0) || false;\n\t\t\tvar callback = <(col:any[]) => void> u.getFirstOfType(arguments, \"function\", 0, 0);\n\t\t\tvar errorCallback = <ErrorCallback> u.getFirstOfType(arguments, \"function\", 0, 1);\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"fetchCol\");\n\n\t\t\tif (!this.isColumnName(colName))\n\t\t\t{\n\t\t\t\tvar error = \"invalid column name for table ##tableName##: \" + colName;\n\t\t\t\tif (errorCallback)\n\t\t\t\t\treturn errorCallback(error);\n\n\t\t\t\tlogError(error);\n\t\t\t\treturn callback([]);\n\t\t\t}\n\n\t\t\twhereSql = whereSql.replace(/^\\s*where\\s*/i, \" \");\n\t\t\tvar limitSql = (limit > 0 || offset > 0) ? \" LIMIT \" + offset + \", \" + (offset + limit) : \"\";\n\t\t\tvar orderSql = this.buildOrdering(ordering);\n\t\t\tvar distinctSql = distinct ? \"DISTINCT \" : \"\";\n\n\t\t\tvar sql = \"SELECT \" + distinctSql + \"`\" + colName + \"` FROM `##tableName##` WHERE \" + whereSql + orderSql + limitSql;\n\t\t\tdb.fetchCol(sql, callback, errorCallback);\n\t\t}\n\n\n\n\t\tpublic fetchOne(\n\t\t\tcolName:string,\n\t\t\twhereSql:string,\n\t\t\tcallback:AnyCallback,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"fetchOne\");\n\t\t\tif (!this.isColumnName(colName))\n\t\t\t{\n\t\t\t\tvar error = \"invalid column name for table ##tableName##: \" + colName;\n\t\t\t\tif (errorCallback)\n\t\t\t\t\treturn errorCallback(error);\n\n\t\t\t\tlogError(error);\n\t\t\t\treturn callback(undefined);\n\t\t\t}\n\n\t\t\twhereSql = whereSql.replace(/^\\s*where\\s*/i, \" \");\n\t\t\tvar sql = \"SELECT `\" + colName + \"` FROM `##tableName##` WHERE \" + whereSql + \" LIMIT 1;\";\n\t\t\tdb.fetchOne(sql, callback, errorCallback);\n\t\t}\n\n\n\n\t\tpublic fetchPairs(\n\t\t\tkeyName:string,\n\t\t\tvalueName:string,\n\t\t\twhereSql:string,\n\t\t\tcallback:(pairs:{[name:string]:any}) => void,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"fetchPairs\");\n\t\t\tif (!this.isColumnName(keyName))\n\t\t\t{\n\t\t\t\tvar error = \"invalid column name for table ##tableName##: \" + keyName;\n\t\t\t\tif (errorCallback)\n\t\t\t\t\treturn errorCallback(error);\n\n\t\t\t\tlogError(error);\n\t\t\t\treturn callback([]);\n\t\t\t}\n\n\t\t\tif (!this.isColumnName(valueName))\n\t\t\t{\n\t\t\t\tvar error = \"invalid column name for table ##tableName##: \" + valueName;\n\t\t\t\tif (errorCallback)\n\t\t\t\t\treturn errorCallback(error);\n\n\t\t\t\tlogError(error);\n\t\t\t\treturn callback([]);\n\t\t\t}\n\n\t\t\tif (keyName == valueName)\n\t\t\t\tvalueName += \"` AS `_\" + valueName;\n\n\t\t\twhereSql = whereSql.replace(/^\\s*where\\s*/i, \" \");\n\t\t\tvar sql = \"SELECT `\" + keyName + \"`, `\" + valueName + \"` FROM `##tableName##` WHERE \" + whereSql;\n\t\t\tdb.fetchPairs(sql, callback, errorCallback);\n\t\t}\n\n\n\n\t\tpublic deleteWhere(\n\t\t\twhere:Object|string,\n\t\t\tcallback?:(deletedCount:number) => void,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"deleteWhere\");\n\t\t\tdb.deleteBatch(\"##tableName##\", where, callback, errorCallback);\n\t\t}\n\n\n\n\t\tpublic getTableName():string\n\t\t{\n\t\t\treturn \"##tableName##\";\n\t\t}\n",
                TAB_GENERIC_FUNCTIONS_PRIMARY: "\t\t/*\n\t\t\tHandles Dojo requests and returns a matching object.\n\n\t\t\tThe WHERE statement can be extended using conditions\n\t\t\tand escapeArgs.\n\t\t*/\n\t\tpublic getDojo(\n\t\t\tparams:any,\n\t\t\tcallback:(forDojo:kr3m.dojo.GridQueryResponse<##className##>) => void,\n\t\t\tconditions:string[] = [],\n\t\t\tescapeArgs:any[] = [],\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"getDojo\");\n\t\t\tvar columnNames = this.getColumnNames();\n\n\t\t\tvar offset = params.start || 0;\n\t\t\tvar limit = params.count || 20;\n\t\t\tvar sort = params.sort || \"##key##\";\n\n\t\t\tfor (var i = 0; i < columnNames.length; ++i)\n\t\t\t{\n\t\t\t\tif (params.hasOwnProperty(columnNames[i]) && params[columnNames[i]])\n\t\t\t\t{\n\t\t\t\t\tconditions.push(\"`\" + columnNames[i] + \"` = ?\");\n\t\t\t\t\tescapeArgs.push(params[columnNames[i]]);\n\t\t\t\t}\n\t\t\t}\n\t\t\tvar where = db.escape(conditions.join(\" AND \"), escapeArgs);\n\t\t\tif (where == \"\")\n\t\t\t\twhere = \"1\";\n\n\t\t\tvar ordering = [];\n\t\t\tif (sort.substring(0, 1) == \"-\")\n\t\t\t\tordering.push(sort, \"ASC\");\n\t\t\telse\n\t\t\t\tordering.push(sort, \"DESC\");\n\n\t\t\tthis.getCount(where, (count:number) =>\n\t\t\t{\n\t\t\t\tthis.get(where, offset, limit, ordering, (vos:any) => callback(new kr3m.dojo.GridQueryResponse<##className##>(vos, \"##key##\", count, \"##key##\", sort)), errorCallback);\n\t\t\t}, errorCallback);\n\t\t}\n",
                TAB_GENERIC_INSERTS: "\t\tpublic upsertBatch(\n\t\t\tvos:##className##[],\n\t\t\tcallback?:Callback,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"upsertBatch\");\n\t\t\tfor (var i = 0; i < vos.length; ++i)\n\t\t\t\tvos[i].preStore();\n\n\t\t\tdb.upsertBatch(\"##tableName##\", vos, () =>\n\t\t\t{\n\t\t\t\tfor (var i = 0; i < vos.length; ++i)\n\t\t\t\t\tvos[i].postStore();\n\n\t\t\t\tcallback && callback();\n\t\t\t}, db.defaultBatchSize, null, errorCallback);\n\t\t}\n\n\n\n\t\tpublic insertBatch(\n\t\t\tvos:##className##[],\n\t\t\tcallback?:Callback,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"insertBatch\");\n\t\t\tfor (var i = 0; i < vos.length; ++i)\n\t\t\t\tvos[i].preStore();\n\n\t\t\tdb.insertBatch(\"##tableName##\", vos, () =>\n\t\t\t{\n\t\t\t\tfor (var i = 0; i < vos.length; ++i)\n\t\t\t\t\tvos[i].postStore();\n\n\t\t\t\tcallback && callback();\n\t\t\t}, db.defaultBatchSize, errorCallback);\n\t\t}\n",
                TAB_GENERIC_INSERTS_UNIQUE_ASSOC: "\t\tpublic upsertBatch(\n\t\t\tvos:##className##[],\n\t\t\tcallback?:Callback,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"upsertBatch\");\n\t\t\tvos = vos.slice();\n\t\t\tvar no##capitalKey##Vos:##className##[] = [];\n\t\t\tfor (var i = 0; i < vos.length; ++i)\n\t\t\t{\n\t\t\t\tif (!vos[i].##key##)\n\t\t\t\t{\n\t\t\t\t\tno##capitalKey##Vos.push(vos[i]);\n\t\t\t\t\tvos.splice(i--, 1);\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tfor (var i = 0; i < vos.length; ++i)\n\t\t\t\tvos[i].preStore();\n\n\t\t\tdb.upsertBatch(\"##tableName##\", vos, () =>\n\t\t\t{\n\t\t\t\tfor (var i = 0; i < vos.length; ++i)\n\t\t\t\t\tvos[i].postStore();\n\n\t\t\t\tkr3m.async.Loop.forEach(no##capitalKey##Vos, (no##capitalKey##Vo, next) =>\n\t\t\t\t{\n\t\t\t\t\tno##capitalKey##Vo.upsert(next);\n\t\t\t\t}, () => callback && callback());\n\t\t\t}, db.defaultBatchSize, null, errorCallback);\n\t\t}\n\n\n\n\t\tpublic updateBatch(\n\t\t\tvos:##className##[],\n\t\t\tcallback?:Callback,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"updateBatch\");\n\t\t\tfor (var i = 0; i < vos.length; ++i)\n\t\t\t{\n\t\t\t\tif (!vos[i].##key##)\n\t\t\t\t{\n\t\t\t\t\tif (errorCallback)\n\t\t\t\t\t\treturn errorCallback(\"some vos are missing their ##key## attribute in updateBatch call\");\n\n\t\t\t\t\tthrow new Error(\"some vos are missing their ##key## attribute in updateBatch call\");\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tfor (var i = 0; i < vos.length; ++i)\n\t\t\t\tvos[i].preStore();\n\n\t\t\tdb.updateBatch(\"##tableName##\", vos, () =>\n\t\t\t{\n\t\t\t\tfor (var i = 0; i < vos.length; ++i)\n\t\t\t\t\tvos[i].postStore();\n\n\t\t\t\tcallback && callback();\n\t\t\t}, db.defaultBatchSize, \"##key##\", errorCallback);\n\t\t}\n\n\n\n\t\tpublic insertBatch(\n\t\t\tvos:##className##[],\n\t\t\tcallback?:Callback,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"insertBatch\");\n\t\t\tvos = vos.slice();\n\t\t\tvar no##capitalKey##Vos:##className##[] = [];\n\t\t\tfor (var i = 0; i < vos.length; ++i)\n\t\t\t{\n\t\t\t\tif (!vos[i].##key##)\n\t\t\t\t{\n\t\t\t\t\tno##capitalKey##Vos.push(vos[i]);\n\t\t\t\t\tvos.splice(i--, 1);\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tfor (var i = 0; i < vos.length; ++i)\n\t\t\t\tvos[i].preStore();\n\n\t\t\tdb.insertBatch(\"##tableName##\", vos, () =>\n\t\t\t{\n\t\t\t\tfor (var i = 0; i < vos.length; ++i)\n\t\t\t\t\tvos[i].postStore();\n\n\t\t\t\tkr3m.async.Loop.forEach(no##capitalKey##Vos, (no##capitalKey##Vo, next) =>\n\t\t\t\t{\n\t\t\t\t\tno##capitalKey##Vo.insert(next);\n\t\t\t\t}, () => callback && callback());\n\t\t\t}, db.defaultBatchSize, errorCallback);\n\t\t}\n",
                TAB_GENERIC_INSERTS_UNIQUE_NUMBER: "\t\tpublic upsertBatch(\n\t\t\tvos:##className##[],\n\t\t\tcallback?:Callback,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"upsertBatch\");\n\t\t\tfor (var i = 0; i < vos.length; ++i)\n\t\t\t\tvos[i].preStore();\n\n\t\t\tdb.upsertBatch(\"##tableName##\", vos, () =>\n\t\t\t{\n\t\t\t\tfor (var i = 0; i < vos.length; ++i)\n\t\t\t\t\tvos[i].postStore();\n\n\t\t\t\tcallback && callback();\n\t\t\t}, db.defaultBatchSize, null, errorCallback);\n\t\t}\n\n\n\n\t\tpublic updateBatch(\n\t\t\tvos:##className##[],\n\t\t\tcallback?:Callback,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"updateBatch\");\n\t\t\tfor (var i = 0; i < vos.length; ++i)\n\t\t\t\tvos[i].preStore();\n\n\t\t\tdb.updateBatch(\"##tableName##\", vos, () =>\n\t\t\t{\n\t\t\t\tfor (var i = 0; i < vos.length; ++i)\n\t\t\t\t\tvos[i].postStore();\n\n\t\t\t\tcallback && callback();\n\t\t\t}, db.defaultBatchSize, \"##key##\", errorCallback);\n\t\t}\n\n\n\n\t\tpublic insertBatch(\n\t\t\tvos:##className##[],\n\t\t\tcallback?:Callback,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"insertBatch\");\n\t\t\tfor (var i = 0; i < vos.length; ++i)\n\t\t\t\tvos[i].preStore();\n\n\t\t\tdb.insertBatch(\"##tableName##\", vos, () =>\n\t\t\t{\n\t\t\t\tfor (var i = 0; i < vos.length; ++i)\n\t\t\t\t\tvos[i].postStore();\n\n\t\t\t\tcallback && callback();\n\t\t\t}, db.defaultBatchSize, errorCallback);\n\t\t}\n",
                VO: "\t\tpublic static isColumnName(name:string):boolean\n\t\t{\n\t\t\treturn (##copyFields##).indexOf(name) >= 0;\n\t\t}\n\n\n\n\t\tpublic static getColumnNames():string[]\n\t\t{\n\t\t\treturn ##copyFields##;\n\t\t}\n\n\n\n\t\t/*\n\t\t\tBuilds a proper ##resultClassName## class object from\n\t\t\ta POD / JSON object.\n\n\t\t\tIf this is not possible, because some required attributes\n\t\t\tare missing for example, null will be returned.\n\t\t*/\n\t\tpublic static buildFrom(raw:any):##resultClassName##\n\t\t{\n\t\t\tvar helper = new kr3m.services.ParamsHelper(raw);\n\t\t\tif (!helper.validate(##validateObject##, ##validateFallbacks##))\n\t\t\t\treturn null;\n\n\t\t\tvar foreignKeyNames = ##foreignKeyNames##;\n\t\t\tvar vo = new ##resultClassName##();\n\t\t\tvar copyFields = ##copyFields##;\n\t\t\tfor (var i = 0; i < copyFields.length; ++i)\n\t\t\t{\n\t\t\t\tvo[copyFields[i]] = raw[copyFields[i]];\n\t\t\t\tif (!vo[copyFields[i]] && kr3m.util.Util.contains(foreignKeyNames, copyFields[i]))\n\t\t\t\t\tvo[copyFields[i]] = null;\n\t\t\t}\n\t\t\treturn vo;\n\t\t}\n\n\n\n\t\tpublic constructor(rawData?:any)\n\t\t{\n\t\t\tif (rawData)\n\t\t\t{\n\t\t\t\tfor (var i in rawData)\n\t\t\t\t{\n\t\t\t\t\tif (##resultClassName##.isColumnName(i))\n\t\t\t\t\t\tthis[i] = rawData[i];\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\n\n\t\tprivate wrapErrorCallback(\n\t\t\terrorCallback:ErrorCallback,\n\t\t\tfunctionName:string):ErrorCallback\n\t\t{\n\t\t\tif (!errorCallback)\n\t\t\t\treturn errorCallback;\n\n\t\t\tvar newCallback = (errorMessage) =>\n\t\t\t{\n\t\t\t\terrorCallback(\"##resultClassName##.\" + functionName + \" - \" + errorMessage);\n\t\t\t}\n\t\t\treturn newCallback;\n\t\t}\n",
                VO_CRUD: "\t\tpublic insert(\n\t\t\tcallback?:Callback,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"insert\");\n\t\t\tthis.preStore();\n\t\t\tdb.insert(\"##tableName##\", this, () =>\n\t\t\t{\n\t\t\t\tthis.postStore();\n\t\t\t\tcallback && callback();\n\t\t\t}, errorCallback);\n\t\t}\n\n\n\n\t\tpublic upsert(\n\t\t\tcallback?:Callback,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"upsert\");\n\t\t\tthis.preStore();\n\t\t\tdb.upsert(\"##tableName##\", this, () =>\n\t\t\t{\n\t\t\t\tthis.postStore();\n\t\t\t\tcallback && callback();\n\t\t\t}, null, errorCallback);\n\t\t}\n\n\n\n\t\tpublic update(\n\t\t\twhereKeys:string[],\n\t\t\tcallback?:Callback,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"update\");\n\t\t\tthis.preStore();\n\t\t\tdb.update(\"##tableName##\", this, () =>\n\t\t\t{\n\t\t\t\tthis.postStore();\n\t\t\t\tcallback && callback();\n\t\t\t}, whereKeys, errorCallback);\n\t\t}\n\n\n\n\t\tpublic delete(\n\t\t\tcallback?:Callback,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"delete\");\n\t\t\tdb.deleteBatch(\"##tableName##\", this, callback, errorCallback);\n\t\t}\n",
                VO_CRUD_ID: "\t\tprotected check##idNameCapital##(\n\t\t\tcallback:(wasGenerated:boolean) => void,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"check##idNameCapital##\");\n\t\t\tif (this.##idName##)\n\t\t\t\treturn callback(false);\n\n\t\t\tkr3m.async.Loop.loop((loopDone) =>\n\t\t\t{\n\t\t\t\tkr3m.util.Rand.getSecureString(##idLength##, null, (secureValue) =>\n\t\t\t\t{\n\t\t\t\t\tthis.##idName## = secureValue;\n\t\t\t\t\tdb.fetchOne(db.escape(\"SELECT ##idName## FROM ##tableName## WHERE ##idName## = ? LIMIT 0,1;\", [this.##idName##]), dummy => loopDone(!!dummy), errorCallback);\n\t\t\t\t});\n\t\t\t}, () => callback(true));\n\t\t}\n\n\n\n\t\tpublic insert(\n\t\t\tcallback?:Callback,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"insert\");\n\t\t\tvar retries = 3;\n\t\t\tkr3m.async.Loop.loop((loopDone) =>\n\t\t\t{\n\t\t\t\tthis.check##idNameCapital##((wasGenerated) =>\n\t\t\t\t{\n\t\t\t\t\tthis.preStore();\n\t\t\t\t\tdb.insert(\"##tableName##\", this, () =>\n\t\t\t\t\t{\n\t\t\t\t\t\tthis.postStore();\n\t\t\t\t\t\tcallback && callback();\n\t\t\t\t\t}, (errorMessage) =>\n\t\t\t\t\t{\n\t\t\t\t\t\tif (!wasGenerated || retries <= 0 || errorMessage.indexOf(\"ER_DUP_ENTRY\") < 0)\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\tif (errorCallback)\n\t\t\t\t\t\t\t\treturn errorCallback(errorMessage);\n\n\t\t\t\t\t\t\tlogError(errorMessage);\n\t\t\t\t\t\t\treturn callback && callback();\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tlogWarning(errorMessage);\n\t\t\t\t\t\tlogWarning(\"retrying\");\n\t\t\t\t\t\t--retries;\n\t\t\t\t\t\tloopDone(true);\n\t\t\t\t\t});\n\t\t\t\t});\n\t\t\t});\n\t\t}\n\n\n\n\t\tpublic upsert(\n\t\t\tcallback?:Callback,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"upsert\");\n\t\t\tvar retries = 3;\n\t\t\tkr3m.async.Loop.loop((loopDone) =>\n\t\t\t{\n\t\t\t\tthis.check##idNameCapital##((wasGenerated) =>\n\t\t\t\t{\n\t\t\t\t\tthis.preStore();\n\t\t\t\t\tdb.upsert(\"##tableName##\", this, () =>\n\t\t\t\t\t{\n\t\t\t\t\t\tthis.postStore();\n\t\t\t\t\t\tcallback && callback();\n\t\t\t\t\t}, null, (errorMessage) =>\n\t\t\t\t\t{\n\t\t\t\t\t\tif (!wasGenerated || retries <= 0 || errorMessage.indexOf(\"ER_DUP_ENTRY\") < 0)\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\tif (errorCallback)\n\t\t\t\t\t\t\t\treturn errorCallback(errorMessage);\n\n\t\t\t\t\t\t\tlogError(errorMessage);\n\t\t\t\t\t\t\treturn callback && callback();\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tlogWarning(errorMessage);\n\t\t\t\t\t\tlogWarning(\"retrying\");\n\t\t\t\t\t\t--retries;\n\t\t\t\t\t\tloopDone(true);\n\t\t\t\t\t});\n\t\t\t\t});\n\t\t\t});\n\t\t}\n\n\n\n\t\tpublic update(\n\t\t\tcallback?:Callback,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"update\");\n\t\t\tthis.preStore();\n\t\t\tdb.update(\"##tableName##\", this, () =>\n\t\t\t{\n\t\t\t\tthis.postStore();\n\t\t\t\tcallback && callback();\n\t\t\t}, \"##idName##\", errorCallback);\n\t\t}\n\n\n\n\t\tpublic delete(\n\t\t\tcallback?:Callback,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"delete\");\n\t\t\tvar where = db.escape(\"##idName## = ?\", [this.##idName##]);\n\t\t\tdb.deleteBatch(\"##tableName##\", where, callback, errorCallback);\n\t\t}\n",
                VO_CRUD_ID_NUMBER: "\t\tpublic insert(\n\t\t\tcallback?:(inserted##idNameCapital##:##idType##) => void,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"insert\");\n\t\t\tthis.preStore();\n\t\t\tdb.insert(\"##tableName##\", this, (inserted##idNameCapital##:##idType##) =>\n\t\t\t{\n\t\t\t\tthis.##idName## = inserted##idNameCapital##;\n\t\t\t\tthis.postStore();\n\t\t\t\tcallback && callback(inserted##idNameCapital##);\n\t\t\t}, errorCallback);\n\t\t}\n\n\n\n\t\tpublic upsert(\n\t\t\tcallback?:(inserted##idNameCapital##:##idType##) => void,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"upsert\");\n\t\t\tthis.preStore();\n\t\t\tdb.upsert(\"##tableName##\", this, (inserted##idNameCapital##:##idType##) =>\n\t\t\t{\n\t\t\t\tthis.##idName## = inserted##idNameCapital## || this.##idName##;\n\t\t\t\tthis.postStore();\n\t\t\t\tcallback && callback(inserted##idNameCapital##);\n\t\t\t}, null, errorCallback);\n\t\t}\n\n\n\n\t\tpublic update(\n\t\t\tcallback?:Callback,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"update\");\n\t\t\tthis.preStore();\n\t\t\tdb.update(\"##tableName##\", this, () =>\n\t\t\t{\n\t\t\t\tthis.postStore();\n\t\t\t\tcallback && callback();\n\t\t\t}, \"##idName##\", errorCallback);\n\t\t}\n\n\n\n\t\tpublic delete(\n\t\t\tcallback?:Callback,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"delete\");\n\t\t\tvar where = db.escape(\"##idName## = ?\", [this.##idName##]);\n\t\t\tdb.deleteBatch(\"##tableName##\", where, callback, errorCallback);\n\t\t}\n",
                VO_FINDERS: "\t\tpublic ##finderName##(\n\t\t\twhere:string|{[colName:string]:any},\n\t\t\toffset:number,\n\t\t\tlimit:number,\n\t\t\tcallback:CB<##resultClassName##[]>,\n\t\t\terrorCallback:ErrorCallback):void;\n\n\t\tpublic ##finderName##(\n\t\t\twhere:string|{[colName:string]:any},\n\t\t\toffset:number,\n\t\t\tlimit:number,\n\t\t\tcallback:CB<##resultClassName##[]>):void;\n\n\t\tpublic ##finderName##(\n\t\t\twhere:string|{[colName:string]:any},\n\t\t\tcallback:CB<##resultClassName##[]>,\n\t\t\terrorCallback:ErrorCallback):void;\n\n\t\tpublic ##finderName##(\n\t\t\twhere:string|{[colName:string]:any},\n\t\t\tcallback:CB<##resultClassName##[]>):void;\n\n\t\tpublic ##finderName##(\n\t\t\tcallback:CB<##resultClassName##[]>,\n\t\t\terrorCallback:ErrorCallback):void;\n\n\t\tpublic ##finderName##(\n\t\t\tcallback:CB<##resultClassName##[]>):void;\n\n\t\tpublic ##finderName##():void\n\t\t{\n\t\t\tvar u = kr3m.util.Util;\n\n\t\t\tvar whereObj = <{[colName:string]:any}> u.getFirstOfType(arguments, \"object\", 0, 0);\n\t\t\tvar whereString = whereObj ? db.where(whereObj) : <string> u.getFirstOfType(arguments, \"string\", 0, 0);\n\t\t\tvar where = whereString ? \" AND (\" + whereString.replace(/\\bWHERE\\b/i, \"\") + \") \" : \"\";\n\n\t\t\tvar offset = <number> u.getFirstOfType(arguments, \"number\", 0, 0);\n\t\t\tvar limit = <number> u.getFirstOfType(arguments, \"number\", 0, 1);\n\t\t\tvar limits = (offset !== undefined && limit !== undefined) ? db.escape(\" LIMIT ?, ?\", [offset, limit]) : \"\";\n\n\t\t\tvar callback = <CB<##resultClassName##[]>> u.getFirstOfType(arguments, \"function\", 0, 0);\n\t\t\tvar errorCallback = <ErrorCallback> u.getFirstOfType(arguments, \"function\", 0, 1);\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"##finderName##\");\n\n\t\t\tvar sql = \"SELECT * FROM `##constraintForeignTable##` WHERE `##constraintForeignColumn##` = ? \" + where + limits;\n\t\t\tsql = db.escape(sql, [this.##constraintColumn##]);\n\t\t\tdb.fetchAll(sql, (rows) =>\n\t\t\t{\n\t\t\t\tfor (var i = 0; i < rows.length; ++i)\n\t\t\t\t{\n\t\t\t\t\trows[i].__proto__ = kr3m.util.Factory.getInstance().map(##resultClassName##).prototype;\n\t\t\t\t\trows[i].postLoad();\n\t\t\t\t}\n\t\t\t\tcallback(rows);\n\t\t\t}, errorCallback);\n\t\t}\n",
                VO_FINDERS_UNIQUE: "\t\tpublic ##finderName##(\n\t\t\tcallback:CB<##resultClassName##>,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"##finderName##\");\n\t\t\tvar sql = \"SELECT * FROM `##constraintForeignTable##` WHERE `##constraintForeignColumn##` = ? LIMIT 0,1\";\n\t\t\tsql = db.escape(sql, [this.##constraintColumn##]);\n\t\t\tdb.fetchRow(sql, (data) =>\n\t\t\t{\n\t\t\t\tif (!data)\n\t\t\t\t\treturn callback(undefined);\n\n\t\t\t\tdata.__proto__ = kr3m.util.Factory.getInstance().map(##resultClassName##).prototype;\n\t\t\t\tdata.postLoad();\n\t\t\t\tcallback(data);\n\t\t\t}, errorCallback);\n\t\t}\n",
                VO_FOREIGN_FINDERS: "\t\tpublic ##finderName##(##bonusParams##\n\t\t\twhere:string|{[colName:string]:any},\n\t\t\toffset:number,\n\t\t\tlimit:number,\n\t\t\tcallback:CB<##resultClassName##[]>,\n\t\t\terrorCallback:ErrorCallback):void;\n\n\t\tpublic ##finderName##(##bonusParams##\n\t\t\twhere:string|{[colName:string]:any},\n\t\t\toffset:number,\n\t\t\tlimit:number,\n\t\t\tcallback:CB<##resultClassName##[]>):void;\n\n\t\tpublic ##finderName##(##bonusParams##\n\t\t\twhere:string|{[colName:string]:any},\n\t\t\tcallback:CB<##resultClassName##[]>,\n\t\t\terrorCallback:ErrorCallback):void;\n\n\t\tpublic ##finderName##(##bonusParams##\n\t\t\twhere:string|{[colName:string]:any},\n\t\t\tcallback:CB<##resultClassName##[]>):void;\n\n\t\tpublic ##finderName##(##bonusParams##\n\t\t\toffset:number,\n\t\t\tlimit:number,\n\t\t\tcallback:CB<##resultClassName##[]>,\n\t\t\terrorCallback:ErrorCallback):void;\n\n\t\tpublic ##finderName##(##bonusParams##\n\t\t\toffset:number,\n\t\t\tlimit:number,\n\t\t\tcallback:CB<##resultClassName##[]>):void;\n\n\t\tpublic ##finderName##(##bonusParams##\n\t\t\tcallback:CB<##resultClassName##[]>,\n\t\t\terrorCallback:ErrorCallback):void;\n\n\t\tpublic ##finderName##(##bonusParams##\n\t\t\tcallback:CB<##resultClassName##[]>):void;\n\n\t\tpublic ##finderName##():void\n\t\t{\n\t\t\tvar u = kr3m.util.Util;\n\t\t\t##bonusOverloads##\n\t\t\tvar whereObj = <{[colName:string]:any}> u.getFirstOfType(arguments, \"object\", 0, 0);\n\t\t\tvar whereString = whereObj ? db.where(whereObj) : <string> u.getFirstOfType(arguments, \"string\", 0, ##bonusParamsStringCount##);\n\t\t\tvar where = whereString ? \" AND (\" + whereString.replace(/\\bWHERE\\b/i, \"\") + \") \" : \"\";\n\n\t\t\tvar offset = <number> u.getFirstOfType(arguments, \"number\", ##bonusOffset##, 0);\n\t\t\tvar limit = <number> u.getFirstOfType(arguments, \"number\", ##bonusOffset##, 1);\n\t\t\tvar limits = (offset !== undefined && limit !== undefined) ? db.escape(\" LIMIT ?, ?\", [offset, limit]) : \"\";\n\n\t\t\tvar callback = <CB<##resultClassName##[]>> u.getFirstOfType(arguments, \"function\", ##bonusOffset##, 0);\n\t\t\tvar errorCallback = <ErrorCallback> u.getFirstOfType(arguments, \"function\", ##bonusOffset##, 1);\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"##finderName##\");\n\n\t\t\tvar sql = \"SELECT * FROM `##foreignConstraintTable##` WHERE ##foreignConstraintColumn## \" + where + limits;\n\t\t\tsql = db.escape(sql, [this.##foreignConstraintForeignColumn##]);\n\t\t\tdb.fetchAll(sql, (rows) =>\n\t\t\t{\n\t\t\t\tfor (var i = 0; i < rows.length; ++i)\n\t\t\t\t{\n\t\t\t\t\trows[i].__proto__ = kr3m.util.Factory.getInstance().map(##resultClassName##).prototype;\n\t\t\t\t\trows[i].postLoad();\n\t\t\t\t}\n\t\t\t\tcallback(rows);\n\t\t\t}, errorCallback);\n\t\t}\n",
                VO_FOREIGN_FINDERS_UNIQUE: "\t\tpublic ##finderName##(##bonusParams##\n\t\t\tcallback:CB<##resultClassName##>,\n\t\t\terrorCallback?:ErrorCallback):void\n\t\t{\n\t\t\terrorCallback = this.wrapErrorCallback(errorCallback, \"##finderName##\");\n\t\t\tvar sql = \"SELECT * FROM `##foreignConstraintTable##` WHERE ##foreignConstraintColumn## LIMIT 0,1\";\n\t\t\tsql = db.escape(sql, [this.##foreignConstraintForeignColumn##]);\n\t\t\tdb.fetchRow(sql, (data) =>\n\t\t\t{\n\t\t\t\tif (!data)\n\t\t\t\t\treturn callback(undefined);\n\n\t\t\t\tdata.__proto__ = kr3m.util.Factory.getInstance().map(##resultClassName##).prototype;\n\t\t\t\tdata.postLoad();\n\t\t\t\tcallback(data);\n\t\t\t}, errorCallback);\n\t\t}\n",
                VO_PREPOST: "\t\t/*\n\t\t\tWill be called after the class was created and filled\n\t\t\twith content from the database.\n\t\t*/\n\t\tpublic postLoad():void\n\t\t{\n\t\t\t// can be overwritten in derived classes\n\t\t}\n\n\n\n\t\t/*\n\t\t\tWill be called before the class' content will be\n\t\t\twritten into the database.\n\t\t*/\n\t\tpublic preStore():void\n\t\t{\n\t\t\t// can be overwritten in derived classes\n\t\t}\n\n\n\n\t\t/*\n\t\t\tWill be called after the class' content was\n\t\t\twritten into the database.\n\t\t*/\n\t\tpublic postStore():void\n\t\t{\n\t\t\t// can be overwritten in derived classes\n\t\t}\n",
                VO_PREPOST_AUTOUPDATE: "\t\t/*\n\t\t\tWill be called after the class was created and filled\n\t\t\twith content from the database.\n\t\t*/\n\t\tpublic postLoad():void\n\t\t{\n\t\t\tvar autoUpdateFields = ##autoUpdateFields##;\n\t\t\tvar oldValues:{[field:string]:Date} = {};\n\t\t\tfor (var i = 0; i < autoUpdateFields.length; ++i)\n\t\t\t{\n\t\t\t\tvar field = autoUpdateFields[i];\n\t\t\t\toldValues[field] = this[field];\n\t\t\t}\n\t\t\tObject.defineProperty(this, \"__oldAutoUpdateFieldValues\", {value : oldValues, enumerable : false});\n\t\t}\n\n\n\n\t\t/*\n\t\t\tWill be called before the class' content will be\n\t\t\twritten into the database.\n\t\t*/\n\t\tpublic preStore():void\n\t\t{\n\t\t\tvar autoUpdateFields = ##autoUpdateFields##;\n\n\t\t\tif (!this[\"__oldAutoUpdateFieldValues\"])\n\t\t\t\tObject.defineProperty(this, \"__oldAutoUpdateFieldValues\", {value : {}, enumerable : false});\n\n\t\t\tfor (var i = 0; i < autoUpdateFields.length; ++i)\n\t\t\t{\n\t\t\t\tvar field = autoUpdateFields[i];\n\t\t\t\tif (this[field] == this[\"__oldAutoUpdateFieldValues\"][field])\n\t\t\t\t\tdelete this[field];\n\t\t\t\telse\n\t\t\t\t\tthis[\"__oldAutoUpdateFieldValues\"][field] = this[field];\n\t\t\t}\n\t\t}\n\n\n\n\t\t/*\n\t\t\tWill be called after the class' content was\n\t\t\twritten into the database.\n\t\t*/\n\t\tpublic postStore():void\n\t\t{\n\t\t\tvar autoUpdateFields = ##autoUpdateFields##;\n\t\t\tfor (var i = 0; i < autoUpdateFields.length; ++i)\n\t\t\t{\n\t\t\t\tvar field = autoUpdateFields[i];\n\t\t\t\tthis[field] = this[\"__oldAutoUpdateFieldValues\"][field];\n\t\t\t}\n\t\t}\n",
                VO_SET_METHODS: "\t\tpublic get##setNameCapital##():string[]\n\t\t{\n\t\t\treturn this.##setName##.split(\",\").filter(p => p);\n\t\t}\n\n\n\n\t\tpublic has##setNameSingularCapital##(\n\t\t\t##setNameSingularLower##:string):boolean\n\t\t{\n\t\t\tif (##resultClassName##.##setValuesArray##.indexOf(##setNameSingularLower##) < 0)\n\t\t\t\tthrow new Error(\"invalid flag name: \" + ##setNameSingularLower##);\n\n\t\t\tvar ##setName## = this.##setName##.split(\",\").filter(p => p);\n\t\t\treturn ##setName##.indexOf(##setNameSingularLower##) >= 0;\n\t\t}\n\n\n\n\t\tpublic set##setNameSingularCapital##(\n\t\t\t##setNameSingularLower##:string):void\n\t\t{\n\t\t\tif (##resultClassName##.##setValuesArray##.indexOf(##setNameSingularLower##) < 0)\n\t\t\t\tthrow new Error(\"invalid flag name: \" + ##setNameSingularLower##);\n\n\t\t\tvar ##setName## = this.##setName##.split(\",\").filter(p => p);\n\t\t\t##setName##.push(##setNameSingularLower##);\n\t\t\tthis.##setName## = ##setName##.join(\",\");\n\t\t}\n\n\n\n\t\tpublic clear##setNameSingularCapital##(\n\t\t\t##setNameSingularLower##:string):void\n\t\t{\n\t\t\tif (##resultClassName##.##setValuesArray##.indexOf(##setNameSingularLower##) < 0)\n\t\t\t\tthrow new Error(\"invalid flag name: \" + ##setNameSingularLower##);\n\n\t\t\tvar ##setName## = this.##setName##.split(\",\").filter(p => p);\n\t\t\t##setName## = ##setName##.filter(p => p != ##setNameSingularLower##);\n\t\t\tthis.##setName## = ##setName##.join(\",\");\n\t\t}\n"
            };
        })(mysqlvogenerator = tools.mysqlvogenerator || (tools.mysqlvogenerator = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var tools;
    (function (tools) {
        var mysqlvogenerator;
        (function (mysqlvogenerator) {
            var Parameters = (function () {
                function Parameters(args) {
                    this.verbose = false;
                    this.silent = false;
                    this.moduleName = "test";
                    this.targetPath = "";
                    this.dbHost = "localhost";
                    this.dbUser = "root";
                    this.dbPassword = "";
                    this.dbDatabase = "";
                    args = args.slice(2);
                    for (var i = 0; i < args.length; ++i) {
                        switch (args[i]) {
                            case "-v":
                                this.verbose = true;
                                break;
                            case "-s":
                                this.silent = true;
                                break;
                            case "-h":
                                if (i < args.length - 1)
                                    this.dbHost = args[++i];
                                break;
                            case "-u":
                                if (i < args.length - 1)
                                    this.dbUser = args[++i];
                                break;
                            case "-p":
                                if (i < args.length - 1)
                                    this.dbPassword = args[++i];
                                break;
                            case "-m":
                                if (i < args.length - 1)
                                    this.moduleName = args[++i];
                                break;
                            default:
                                if (this.dbDatabase == "")
                                    this.dbDatabase = args[i];
                                else if (this.targetPath == "")
                                    this.targetPath = args[i].replace(/\\/g, "/");
                                break;
                        }
                    }
                    if (this.targetPath != ""
                        && this.targetPath.slice(-1) != "/")
                        this.targetPath += "/";
                }
                return Parameters;
            }());
            mysqlvogenerator.Parameters = Parameters;
        })(mysqlvogenerator = tools.mysqlvogenerator || (tools.mysqlvogenerator = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var tools;
    (function (tools) {
        var autoformatter;
        (function (autoformatter) {
            var languages;
            (function (languages) {
                var Language = (function () {
                    function Language(filePattern) {
                        this.filePattern = filePattern;
                    }
                    Language.prototype.autoformat = function (code, filePath) {
                        return code;
                    };
                    Language.languages = [];
                    return Language;
                }());
                languages.Language = Language;
            })(languages = autoformatter.languages || (autoformatter.languages = {}));
        })(autoformatter = tools.autoformatter || (tools.autoformatter = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var tools;
    (function (tools) {
        var autoformatter;
        (function (autoformatter) {
            var languages;
            (function (languages) {
                var Css = (function (_super) {
                    __extends(Css, _super);
                    function Css() {
                        return _super.call(this, /\.css$/i) || this;
                    }
                    Css.prototype.autoformat = function (code, filePath) {
                        if (code.indexOf("\n") < 0)
                            code = code.replace(/\r/g, "\n");
                        code = kr3m.util.StringEx.stripBom(code);
                        code = code
                            .replace(/\r/g, "")
                            .replace(/[\t ]+\n/g, "\n");
                        return code;
                    };
                    return Css;
                }(languages.Language));
                languages.Css = Css;
            })(languages = autoformatter.languages || (autoformatter.languages = {}));
        })(autoformatter = tools.autoformatter || (tools.autoformatter = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
})(kr3m || (kr3m = {}));
kr3m.tools.autoformatter.languages.Language.languages.push(new kr3m.tools.autoformatter.languages.Css());
var kr3m;
(function (kr3m) {
    var tools;
    (function (tools) {
        var autoformatter;
        (function (autoformatter) {
            var languages;
            (function (languages) {
                var Html = (function (_super) {
                    __extends(Html, _super);
                    function Html() {
                        return _super.call(this, /\.html?$/i) || this;
                    }
                    Html.prototype.autoformat = function (code, filePath) {
                        if (code.indexOf("\n") < 0)
                            code = code.replace(/\r/g, "\n");
                        code = kr3m.util.StringEx.stripBom(code);
                        code = code
                            .replace(/\r/g, "")
                            .replace(/[\t ]+\n/g, "\n");
                        return kr3m.util.StringEx.BOM + code;
                    };
                    return Html;
                }(languages.Language));
                languages.Html = Html;
            })(languages = autoformatter.languages || (autoformatter.languages = {}));
        })(autoformatter = tools.autoformatter || (tools.autoformatter = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
})(kr3m || (kr3m = {}));
kr3m.tools.autoformatter.languages.Language.languages.push(new kr3m.tools.autoformatter.languages.Html());
var kr3m;
(function (kr3m) {
    var tools;
    (function (tools) {
        var autoformatter;
        (function (autoformatter) {
            var languages;
            (function (languages) {
                var Javascript = (function (_super) {
                    __extends(Javascript, _super);
                    function Javascript() {
                        return _super.call(this, /\.js$/i) || this;
                    }
                    Javascript.prototype.autoformat = function (code, filePath) {
                        if (code.indexOf("\n") < 0)
                            code = code.replace(/\r/g, "\n");
                        code = kr3m.util.StringEx.stripBom(code);
                        code = kr3m.util.StringEx.replaceSuccessive(code, /\n(\t*)    /g, "\n$1\t");
                        code = code
                            .replace(/\r/g, "")
                            .replace(/[\t ]+\n/g, "\n")
                            .replace(/if\(/g, "if (")
                            .replace(/for\(/g, "for (")
                            .replace(/while\(/g, "while (")
                            .replace(/switch\(/g, "switch (")
                            .replace(/\n(\t*) +/g, "\n$1")
                            .replace(/\n\t+\n/g, "\n\n")
                            .replace(/\n(\t*)([^\n\t]+)\{\n/g, "\n$1$2\n$1{\n")
                            .replace(/[\t ]+\n/g, "\n");
                        return code;
                    };
                    return Javascript;
                }(languages.Language));
                languages.Javascript = Javascript;
            })(languages = autoformatter.languages || (autoformatter.languages = {}));
        })(autoformatter = tools.autoformatter || (tools.autoformatter = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var tools;
    (function (tools) {
        var autoformatter;
        (function (autoformatter) {
            var languages;
            (function (languages) {
                var Php = (function (_super) {
                    __extends(Php, _super);
                    function Php() {
                        return _super.call(this, /\.php?$/i) || this;
                    }
                    Php.prototype.autoformat = function (code, filePath) {
                        if (code.indexOf("\n") < 0)
                            code = code.replace(/\r/g, "\n");
                        code = kr3m.util.StringEx.stripBom(code);
                        code = kr3m.util.StringEx.replaceSuccessive(code, /\n(\t*)    /g, "\n$1\t");
                        code = code
                            .replace(/\r/g, "")
                            .replace(/if\(/g, "if (")
                            .replace(/for\(/g, "for (")
                            .replace(/while\(/g, "while (")
                            .replace(/switch\(/g, "switch (")
                            .replace(/\n(\t*)([^\n\t]+)\{\n/g, "\n$1$2\n$1{\n")
                            .replace(/([\{\}])\n\n+(\t*\{)/g, "$1\n$2")
                            .replace(/\n+\n(\t*\})/g, "\n$1")
                            .replace(/(\t+)\} else/g, "$1}\n$1else")
                            .replace(/return\s+/g, "return ")
                            .replace(/[\t ]+\n/g, "\n");
                        return code;
                    };
                    return Php;
                }(languages.Language));
                languages.Php = Php;
            })(languages = autoformatter.languages || (autoformatter.languages = {}));
        })(autoformatter = tools.autoformatter || (tools.autoformatter = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
})(kr3m || (kr3m = {}));
kr3m.tools.autoformatter.languages.Language.languages.push(new kr3m.tools.autoformatter.languages.Php());
var kr3m;
(function (kr3m) {
    var tools;
    (function (tools) {
        var autoformatter;
        (function (autoformatter) {
            var languages;
            (function (languages) {
                var Typescript = (function (_super) {
                    __extends(Typescript, _super);
                    function Typescript() {
                        return _super.call(this, /\.ts$/i) || this;
                    }
                    Typescript.prototype.padReferences = function (filePath, lines) {
                        filePath = filePath.replace(/\\/g, "/");
                        var fileParts = filePath.split("/").slice(0, -1);
                        fileParts.reverse();
                        var upCount = 0;
                        var pat = /["'](.+)['"]/;
                        for (var i = 0; i < lines.length; ++i) {
                            var matches = lines[i].match(pat);
                            var file = matches[1];
                            var parts = file.split("/");
                            for (var j = 0; j < parts.length; ++j) {
                                if (parts[j] == "..")
                                    upCount = Math.max(upCount, j + 1);
                            }
                        }
                        for (var i = 0; i < lines.length; ++i) {
                            var matches = lines[i].match(pat);
                            var file = matches[1];
                            var parts = file.split("/");
                            for (var j = 0; j < upCount; ++j) {
                                if (parts[j] != "..")
                                    parts.splice(j, 0, "..", fileParts[j]);
                            }
                            lines[i] = '/// <reference path="' + parts.join("/") + '"/>';
                        }
                    };
                    Typescript.prototype.formatFunctionSignature = function (complete, tabs, funcDef, paramDef, typeDef) {
                        if (complete.length < 100)
                            return complete;
                        var output = tabs + funcDef;
                        paramDef = paramDef.trim();
                        if (paramDef) {
                            var params = kr3m.util.StringEx.splitNoQuoted(paramDef);
                            params = params.map(function (param) { return param.trim(); });
                            paramDef = "\n\t" + tabs + params.join(",\n\t" + tabs);
                        }
                        output += paramDef + typeDef;
                        return output;
                    };
                    Typescript.prototype.autoformat = function (code, filePath) {
                        if (filePath.match(/autoformatter\/languages\/.+\.ts$/i))
                            return code;
                        if (code.indexOf("\n") < 0)
                            code = code.replace(/\r/g, "\n");
                        code = kr3m.util.StringEx.stripBom(code);
                        code = kr3m.util.StringEx.replaceSuccessive(code, /\n(\t*)    /g, "\n$1\t");
                        code = code
                            .replace(/\r/g, "")
                            .replace(/[\t ]+\n/g, "\n")
                            .replace(/if\(/g, "if (")
                            .replace(/for\(/g, "for (")
                            .replace(/while\(/g, "while (")
                            .replace(/switch\(/g, "switch (")
                            .replace(/\)=>/g, ") =>")
                            .replace(/=>([^"'\s])/g, "=> $1")
                            .replace(/\n(\t*) +/g, "\n$1")
                            .replace(/\/\/\/<reference/g, "/// <reference")
                            .replace(/\n\t+\n/g, "\n\n")
                            .replace(/\n(\t*)([^\n\t\/]+)\{\n/g, "\n$1$2\n$1{\n")
                            .replace(/([\{\}])\n\n+(\t*\{)/g, "$1\n$2")
                            .replace(/\n+\n(\t*\})/g, "\n$1")
                            .replace(/(\t+)\} else/g, "$1}\n$1else")
                            .replace(/return\s+/g, "return ")
                            .replace(/[\t ]+\n/g, "\n")
                            .replace(/\n{5,}/g, "\n\n\n\n")
                            .replace(/\n*$/, "\n")
                            .replace(/\{\n+/g, "{\n")
                            .replace(/\n+(\s*)\}/g, "\n$1}")
                            .replace(/(\t*)((?:export\s+)?(?:public|protected|private|function)\s+(?:static\s+)?(?:abstract\s+)?[\w<>:.]+\s*\()([^)]*)(\)\s*\:\s*[^;{]+[;{])/g, this.formatFunctionSignature)
                            .replace(/(\t*)(constructor\s*\()([^)]*)(\)\s*\:\s*[^;{]+[;{])/g, this.formatFunctionSignature);
                        var lines = code.split("\n");
                        for (var i = 0; i < lines.length; ++i) {
                            if (lines[i].indexOf("/// <reference") < 0)
                                break;
                            lines[i] = lines[i].toLowerCase();
                        }
                        if (i > 0) {
                            var includeLines = lines.slice(0, i);
                            this.padReferences(filePath, includeLines);
                            includeLines.sort();
                            for (var j = 0; j < includeLines.length - 1; ++j) {
                                if (includeLines[j] == includeLines[j + 1])
                                    includeLines.splice(j--, 1);
                            }
                            lines = includeLines.concat(lines.slice(i));
                        }
                        code = lines.join("\n");
                        return kr3m.util.StringEx.BOM + code;
                    };
                    return Typescript;
                }(languages.Language));
                languages.Typescript = Typescript;
            })(languages = autoformatter.languages || (autoformatter.languages = {}));
        })(autoformatter = tools.autoformatter || (tools.autoformatter = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
})(kr3m || (kr3m = {}));
kr3m.tools.autoformatter.languages.Language.languages.push(new kr3m.tools.autoformatter.languages.Typescript());
var kr3m;
(function (kr3m) {
    var tools;
    (function (tools) {
        var autoformatter;
        (function (autoformatter) {
            var Parameters = (function () {
                function Parameters() {
                    this.silent = false;
                    var params = kr3m.util.StringEx.getNamedArguments(process.argv, kr3m.tools.autoformatter.Parameters.MAPPING);
                    for (var i in this)
                        this[i] = params[i] || this[i];
                    this.rootPath = params.values[2] || ".";
                }
                Parameters.MAPPING = {};
                return Parameters;
            }());
            autoformatter.Parameters = Parameters;
        })(autoformatter = tools.autoformatter || (tools.autoformatter = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var tools;
    (function (tools) {
        var autoformatter;
        (function (autoformatter) {
            var AutoFormatter = (function () {
                function AutoFormatter() {
                }
                AutoFormatter.prototype.handle = function (path) {
                    var stats = fsLib.statSync(path);
                    if (stats.isDirectory()) {
                        var files = fsLib.readdirSync(path);
                        for (var i = 0; i < files.length; ++i)
                            this.handle((path + "/" + files[i]).replace(/\/\/+/g, "/"));
                    }
                    else {
                        for (var i = 0; i < kr3m.tools.autoformatter.languages.Language.languages.length; ++i) {
                            var language = kr3m.tools.autoformatter.languages.Language.languages[i];
                            if (language.filePattern.test(path)) {
                                if (!this.params.silent)
                                    log(path);
                                var content = fsLib.readFileSync(path, { encoding: "utf-8" });
                                var newContent = language.autoformat(content, path);
                                if (content != newContent)
                                    fsLib.writeFileSync(path, newContent, { encoding: "utf-8" });
                                break;
                            }
                        }
                    }
                };
                AutoFormatter.prototype.runWithParameters = function (params) {
                    this.params = params;
                    this.handle(params.rootPath);
                };
                AutoFormatter.prototype.run = function () {
                    var params = new kr3m.tools.autoformatter.Parameters();
                    this.runWithParameters(params);
                };
                return AutoFormatter;
            }());
            autoformatter.AutoFormatter = AutoFormatter;
        })(autoformatter = tools.autoformatter || (tools.autoformatter = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
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
    var tools;
    (function (tools) {
        var mysqlvogenerator;
        (function (mysqlvogenerator) {
            var subgens;
            (function (subgens) {
                var SubGen = (function () {
                    function SubGen(db, params) {
                        this.db = db;
                        this.params = params;
                        this.output = "";
                        this.references = [];
                        this.addGlobalReference("kr3m/util/factory.ts", ["!CLIENT"]);
                        this.addGlobalReference("kr3m/types.ts", []);
                    }
                    SubGen.prototype.addGlobalReference = function (absPath, conditionals) {
                        var depth = this.params.moduleName.split(".").length;
                        var prefix = "";
                        for (var i = 0; i < depth; ++i)
                            prefix = "../" + prefix;
                        this.references.push({ path: prefix + absPath, conditionals: conditionals });
                    };
                    SubGen.prototype.addLocalReference = function (localPath) {
                        localPath = localPath.toLowerCase();
                        var depth = this.params.moduleName.split(".").length;
                        var modulePath = this.params.moduleName.replace(/\./g, "/");
                        var prefix = "";
                        for (var i = 0; i < depth; ++i)
                            prefix = "../" + prefix;
                        this.references.push({ path: prefix + modulePath + "/" + localPath, conditionals: [] });
                    };
                    SubGen.prototype.logSep = function () {
                        log("-------------------------------------------------------------");
                    };
                    SubGen.prototype.getClassName = function (tableName) {
                        var name = tableName.toLowerCase();
                        name = name.slice(0, 1).toUpperCase() + name.slice(1);
                        var i = name.indexOf("_");
                        while (i >= 0) {
                            if (i <= name.length - 1)
                                name = name.slice(0, i) + name.slice(i + 1, i + 2).toUpperCase() + name.slice(i + 2);
                            else
                                name = name.slice(0, i) + name.slice(i + 1);
                            i = name.indexOf("_");
                        }
                        return name;
                    };
                    SubGen.prototype.generate = function (callback) {
                        callback();
                    };
                    SubGen.prototype.singular = function (name) {
                        if (name.slice(-7).toLowerCase() == "cookies")
                            return name.slice(0, -1);
                        if (name.slice(-3) == "ies")
                            return name.slice(0, -3) + "y";
                        if (name.slice(-1) == "s")
                            return name.slice(0, -1);
                        return name;
                    };
                    SubGen.prototype.plural = function (name) {
                        return name + "s";
                    };
                    SubGen.prototype.generateStart = function () {
                        this.out("/*");
                        this.out("	This file was automatically created using a source code generator.");
                        this.out("	Do not edit this file manually as all changes will be overwritten");
                        this.out("	the next time the generator runs again.");
                        this.out("*/");
                        this.out("\REFERENCEPLACEHOLDER\n");
                        this.out("\n\n");
                    };
                    SubGen.prototype.getPropertyType = function (type) {
                        var pats = kr3m.tools.mysqlvogenerator.subgens.SubGen.typePatterns;
                        for (var i in pats) {
                            for (var j = 0; j < pats[i].length; ++j) {
                                var pat = pats[i][j];
                                if (pat.test(type))
                                    return i;
                            }
                        }
                        log("unknown type: " + type);
                        return "any";
                    };
                    SubGen.prototype.capitalKeys = function (keys) {
                        var result = keys.slice();
                        for (var i = 0; i < result.length; ++i)
                            result[i] = result[i].slice(0, 1).toUpperCase() + result[i].slice(1);
                        return result;
                    };
                    SubGen.prototype.out = function (text, tokens) {
                        this.output += tokenize((text + "\n").replace(/\r/g, ""), tokens);
                    };
                    SubGen.prototype.realpath = function (path) {
                        try {
                            return fsLib.realpathSync(path);
                        }
                        catch (e) {
                            return path;
                        }
                    };
                    SubGen.prototype.removeObsoleteConditionals = function (referenceText) {
                        var allConditionals = this.references.map(function (r) { return r.conditionals; }).reduce(function (t, m) { return t.concat(m); }, []);
                        allConditionals = kr3m.util.Util.removeDuplicates(allConditionals);
                        var oldReferenceText;
                        while (oldReferenceText != referenceText) {
                            oldReferenceText = referenceText;
                            for (var i = 0; i < allConditionals.length; ++i)
                                referenceText = kr3m.util.StringEx.literalReplace(referenceText, "\n/" + "/# /" + allConditionals[i] + "\n/" + "/# " + allConditionals[i], "");
                        }
                        return referenceText;
                    };
                    SubGen.prototype.saveToFile = function (path) {
                        var referenceText = "";
                        if (this.references.length > 0) {
                            referenceText = "\n\n";
                            this.references.sort(function (a, b) { return (a.conditionals.length == b.conditionals.length) ? a.path.localeCompare(b.path) : a.conditionals.length - b.conditionals.length; });
                            var realPath = this.realpath(path);
                            for (var i = 0; i < this.references.length; ++i) {
                                var refPath = kr3m.util.File.resolvePath(path, this.references[i].path);
                                if (realPath == this.realpath(refPath)) {
                                    this.references.splice(i--, 1);
                                    continue;
                                }
                                var doContinue = false;
                                for (var j = 0; j < i; ++j) {
                                    if (this.references[i].path == this.references[j].path) {
                                        this.references[i].conditionals.sort(function (a, b) { return a.localeCompare(b); });
                                        this.references[j].conditionals.sort(function (a, b) { return a.localeCompare(b); });
                                        var inter = kr3m.util.Util.intersect(this.references[i].conditionals, this.references[j].conditionals);
                                        if (kr3m.util.Util.equal(inter, this.references[j].conditionals)) {
                                            this.references.splice(i--, 1);
                                            doContinue = true;
                                            break;
                                        }
                                    }
                                }
                                if (doContinue)
                                    continue;
                                this.references[i].conditionals = this.references[i].conditionals.map(function (c) { return c.toUpperCase(); });
                                for (var j = 0; j < this.references[i].conditionals.length; ++j)
                                    referenceText += "\n/" + "/# " + this.references[i].conditionals[j];
                                referenceText += "\n/// <reference path=\"" + this.references[i].path + "\"/>";
                                for (var j = this.references[i].conditionals.length - 1; j >= 0; --j)
                                    referenceText += "\n/" + "/# /" + this.references[i].conditionals[j];
                            }
                            referenceText = this.removeObsoleteConditionals(referenceText);
                        }
                        this.output = kr3m.util.StringEx.BOM + this.output.replace("REFERENCEPLACEHOLDER", referenceText);
                        if (this.params.verbose)
                            log(this.output);
                        fsLib.writeFileSync(path, this.output);
                        var autoformatter = new kr3m.tools.autoformatter.AutoFormatter();
                        var afParams = new kr3m.tools.autoformatter.Parameters();
                        afParams.rootPath = path;
                        afParams.silent = true;
                        autoformatter.runWithParameters(afParams);
                    };
                    SubGen.typePatterns = {
                        "boolean": [
                            /^enum\((?:'false','true'|'true','false')\)$/
                        ],
                        "string": [
                            /^(varchar\(\d+\))$/,
                            /^(char\(\d+\))$/,
                            /^(enum\(.+\))$/,
                            /^(set\(.+\))$/,
                            /^(tinytext)$/,
                            /^(mediumtext)$/,
                            /^(text)$/,
                            /^(longtext)$/
                        ],
                        "number": [
                            /^(int)\(\d+\)$/,
                            /^(int)\(\d+\) (unsigned)$/,
                            /^(tinyint)\(\d+\)$/,
                            /^(tinyint)\(\d+\) (unsigned)$/,
                            /^(bigint)\(\d+\)$/,
                            /^(bigint)\(\d+\) (unsigned)$/,
                            /^(float)$/
                        ],
                        "Date": [
                            /^(date)$/,
                            /^(datetime)$/,
                            /^(timestamp)$/
                        ],
                        "NodeBuffer": [
                            /^(tinyblob)$/,
                            /^(mediumblob)$/,
                            /^(blob)$/,
                            /^(longblob)$/
                        ]
                    };
                    return SubGen;
                }());
                subgens.SubGen = SubGen;
            })(subgens = mysqlvogenerator.subgens || (mysqlvogenerator.subgens = {}));
        })(mysqlvogenerator = tools.mysqlvogenerator || (tools.mysqlvogenerator = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var tools;
    (function (tools) {
        var mysqlvogenerator;
        (function (mysqlvogenerator) {
            var subgens;
            (function (subgens) {
                var VoGen = (function (_super) {
                    __extends(VoGen, _super);
                    function VoGen(db, params, tableName) {
                        var _this = _super.call(this, db, params) || this;
                        _this.propertyTypes = {};
                        _this.tableName = tableName;
                        _this.addGlobalReference("kr3m/services/paramshelper.ts", ["!CLIENT"]);
                        return _this;
                    }
                    VoGen.prototype.getVOClassName = function (table) {
                        if (table === void 0) { table = null; }
                        table = table || this.tableName;
                        var name = this.singular(_super.prototype.getClassName.call(this, table));
                        return name + "VO";
                    };
                    VoGen.prototype.generateStart = function () {
                        _super.prototype.generateStart.call(this);
                        var className = this.getVOClassName();
                        this.out("module " + this.params.moduleName);
                        this.out("{");
                        this.out("	export class " + className);
                        this.out("	{");
                    };
                    VoGen.prototype.getPropertyComment = function (propType, type) {
                        var pats = kr3m.tools.mysqlvogenerator.subgens.TabGen.typePatterns[propType];
                        if (!pats)
                            return "";
                        for (var j = 0; j < pats.length; ++j) {
                            var pat = pats[j];
                            var matches = type.match(pat);
                            if (matches)
                                return (matches.length > 1) ? " // " + matches.slice(1).join(" ") : "";
                        }
                        return "";
                    };
                    VoGen.prototype.getPropertyDefault = function (type, canBeNull, value) {
                        if (value === null)
                            return canBeNull ? " = null" : "";
                        switch (type) {
                            case "boolean":
                                return " = " + value;
                            case "number":
                                return " = " + value;
                            case "string":
                                return " = \"" + value + "\"";
                            case "Date":
                                if (kr3m.util.Util.contains(["CURRENT_TIMESTAMP", "0000-00-00", "0000-00-00 00:00:00"], value))
                                    return " = new Date()";
                                return " = new Date(\"" + value + "\")";
                        }
                        log("unknown default value for " + type + ": " + value);
                        return "";
                    };
                    VoGen.prototype.generateConstants = function (columns) {
                        var enumPat = /^(enum|set)\((.+)\)$/;
                        var textPat = /^(varchar|char|tinytext|mediumtext|text|longtext)(?:\((\d+)\))?$/;
                        var textLengths = {
                            tinytext: 255,
                            text: 65535,
                            mediumtext: 16777215,
                            longtext: 4294967295
                        };
                        var hasConstants = false;
                        for (var i = 0; i < columns.length; ++i) {
                            var enumMatches = columns[i].Type.match(enumPat);
                            if (enumMatches) {
                                var parts = enumMatches[2].split(",");
                                for (var j = 0; j < parts.length; ++j)
                                    parts[j] = parts[j].slice(1, -1);
                                if (parts.length != 2 || parts[0] != "false" || parts[1] != "true") {
                                    var prefix = columns[i].Field.replace(/([A-Z])/g, "_$1").toUpperCase() + "_";
                                    if (enumMatches[1] == "set" && prefix.slice(-2, -1) == "S")
                                        prefix = prefix.slice(0, -2) + "_";
                                    for (var j = 0; j < parts.length; ++j) {
                                        var constant = prefix + parts[j].toUpperCase();
                                        this.out("\t\tpublic static " + constant + " = \"" + parts[j] + "\";");
                                    }
                                    constant = prefix.slice(0, -1);
                                    if (constant.slice(-1) != "S")
                                        constant += "S";
                                    this.out("\t\tpublic static " + constant + " = [\"" + parts.join("\", \"") + "\"];");
                                    hasConstants = true;
                                    this.out("");
                                }
                            }
                            var textMatches = columns[i].Type.match(textPat);
                            if (textMatches) {
                                var maxLength = textMatches[2] ? parseInt(textMatches[2], 10) : (textLengths[textMatches[1]] || -1);
                                var secureLength = Math.floor(maxLength / 2);
                                var prefix = columns[i].Field.replace(/([A-Z])/g, "_$1").toUpperCase();
                                this.out("\t\tpublic static " + prefix + "_MAX_LENGTH = " + maxLength + ";");
                                this.out("\t\tpublic static " + prefix + "_MAX_LENGTH_SECURE = " + secureLength + ";");
                                hasConstants = true;
                                this.out("");
                            }
                        }
                        if (hasConstants)
                            this.out("\n");
                        return hasConstants;
                    };
                    VoGen.prototype.generateProperties = function (columns) {
                        for (var i = 0; i < columns.length; ++i) {
                            var type = this.getPropertyType(columns[i].Type);
                            this.propertyTypes[columns[i].Field] = type;
                            if (columns[i].Comment != "")
                                this.out("\n" + kr3m.util.StringEx.wrapText(columns[i].Comment, 70, "		// "));
                            var defaultValue = this.getPropertyDefault(type, columns[i].Null == "YES", columns[i].Default);
                            var postComment = this.getPropertyComment(type, columns[i].Type);
                            this.out("\t\tpublic " + columns[i].Field + ":" + type + defaultValue + ";" + postComment);
                        }
                    };
                    VoGen.prototype.generateFinders = function (constraints, callback) {
                        var _this = this;
                        var templates = kr3m.tools.mysqlvogenerator.TEMPLATES;
                        var idPat = /id$/i;
                        kr3m.async.Loop.forEach(constraints, function (constraint, loopCallback) {
                            _this.db.getTableIndexes(constraint.foreignTable, function (indexes) {
                                indexes = indexes.filter(function (index) { return index.parts[0] == constraint.foreignColumn; });
                                kr3m.util.Util.sortBy(indexes, "parts.length", true);
                                var isUnique = indexes[0].parts.length == 1 && indexes[0].unique;
                                var finderName = "get" + _this.capitalKeys([constraint.column])[0];
                                if (idPat.test(finderName))
                                    finderName = finderName.slice(0, -2);
                                var resultClassName = _this.getVOClassName(constraint.foreignTable);
                                _this.addLocalReference(resultClassName + ".ts");
                                resultClassName = _this.params.moduleName + "." + resultClassName;
                                _this.out("\n\n");
                                var tokens = {
                                    finderName: finderName,
                                    resultClassName: resultClassName,
                                    constraintForeignTable: constraint.foreignTable,
                                    constraintForeignColumn: constraint.foreignColumn,
                                    constraintColumn: constraint.column
                                };
                                _this.out(isUnique ? templates.VO_FINDERS_UNIQUE : templates.VO_FINDERS, tokens);
                                loopCallback();
                            });
                        }, callback);
                    };
                    VoGen.prototype.generateForeignFinders = function (foreignConstraints, callback) {
                        var _this = this;
                        var templates = kr3m.tools.mysqlvogenerator.TEMPLATES;
                        var referenceCounts = {};
                        for (var i = 0; i < foreignConstraints.length; ++i)
                            referenceCounts[foreignConstraints[i].table] = referenceCounts[foreignConstraints[i].table] ? referenceCounts[foreignConstraints[i].table] + 1 : 1;
                        kr3m.async.Loop.forEach(foreignConstraints, function (foreignConstraint, next) {
                            _this.db.getTableColumns(foreignConstraint.table, function (foreignColumns) {
                                _this.db.getTableIndexes(foreignConstraint.table, function (indexes) {
                                    indexes = indexes.filter(function (index) { return index.parts[0] == foreignConstraint.column; });
                                    if (indexes.length == 0)
                                        return next();
                                    kr3m.util.Util.sortBy(indexes, "parts.length", true);
                                    var index = indexes[0];
                                    for (var i = 0; i < index.parts.length; ++i) {
                                        var bonusParts = index.parts.slice(1, i + 1);
                                        var isUnique = index.unique && index.parts.length == i + 1;
                                        var finderName = "get";
                                        finderName += _this.capitalKeys(foreignConstraint.table.split("_")).join("");
                                        if (isUnique)
                                            finderName = _this.singular(finderName);
                                        var whereColumns = [foreignConstraint.foreignColumn];
                                        if (referenceCounts[foreignConstraint.table] != 1) {
                                            finderName += "From";
                                            finderName += _this.capitalKeys(foreignConstraint.column.split("_")).join("");
                                        }
                                        if (i > 0) {
                                            finderName += "By";
                                            finderName += _this.capitalKeys(bonusParts).join("");
                                            whereColumns = whereColumns.concat(bonusParts);
                                        }
                                        var resultClassName = _this.getVOClassName(foreignConstraint.table);
                                        _this.addLocalReference(resultClassName + ".ts");
                                        resultClassName = _this.params.moduleName + "." + resultClassName;
                                        _this.out("\n\n");
                                        var bonusParams = [];
                                        var bonusParamsStringCount = 0;
                                        var bonusOverloads = [];
                                        for (var j = 0; j < bonusParts.length; ++j) {
                                            var bonusName = bonusParts[j];
                                            var bonusType = _this.getPropertyType(kr3m.util.Util.getBy(foreignColumns, "Field", bonusName).Type);
                                            if (bonusType == "string")
                                                ++bonusParamsStringCount;
                                            bonusParams.push(bonusName + ":" + bonusType);
                                            bonusOverloads.push("var " + bonusName + " = <" + bonusType + "> u.getFirstOfType(arguments, \"" + bonusType + "\", " + j + ", 0);");
                                        }
                                        var tokens = {
                                            resultClassName: resultClassName,
                                            finderName: finderName,
                                            foreignConstraintColumn: "`" + index.parts.slice(0, i + 1).join("` = ? AND `") + "` = ?",
                                            foreignConstraintTable: foreignConstraint.table,
                                            foreignConstraintForeignColumn: whereColumns.join(", "),
                                            bonusParams: bonusParams.length > 0 ? ("\n\t\t\t" + bonusParams.join(",\n\t\t\t") + ",") : "",
                                            bonusOffset: bonusParams.length,
                                            bonusOverloads: bonusOverloads.join("\n\t\t\t") + "\n\t\t\t",
                                            bonusParamsStringCount: bonusParamsStringCount
                                        };
                                        _this.out(isUnique ? templates.VO_FOREIGN_FINDERS_UNIQUE : templates.VO_FOREIGN_FINDERS, tokens);
                                    }
                                    next();
                                });
                            });
                        }, callback);
                    };
                    VoGen.prototype.checkForDuplicateForeignConstraints = function (foreignConstraints) {
                        for (var i = 1; i < foreignConstraints.length; ++i) {
                            var a = foreignConstraints[i];
                            for (var j = 0; j < i; ++j) {
                                var b = foreignConstraints[j];
                                if (a.table == b.table && a.column == b.column) {
                                    logWarning("table", a.table, "has redundant constraint on column", a.column, "- skipping duplicate");
                                    foreignConstraints.splice(j--, 1);
                                    --i;
                                }
                            }
                        }
                    };
                    VoGen.prototype.checkForDuplicateConstraints = function (constraints) {
                        for (var i = 1; i < constraints.length; ++i) {
                            var a = constraints[i];
                            for (var j = 0; j < i; ++j) {
                                var b = constraints[j];
                                if (a.column == b.column) {
                                    logWarning("table", a.table, "has redundant constraint on column", a.column, "- skipping duplicate");
                                    constraints.splice(j--, 1);
                                    --i;
                                }
                            }
                        }
                    };
                    VoGen.prototype.generateCRUD = function (columns, indexes, constraints) {
                        this.out("\n\n");
                        var templates = kr3m.tools.mysqlvogenerator.TEMPLATES;
                        var copyFields = kr3m.util.Util.gather(columns, "Field");
                        var validateFallbacks = kr3m.util.Util.arrayToPairs(columns, "Field", "Default");
                        for (var i = 0; i < columns.length; ++i) {
                            var field = columns[i].Field;
                            if (validateFallbacks[field] === null && columns[i].Null == "NO")
                                delete validateFallbacks[field];
                        }
                        var foreignKeyNames = kr3m.util.Util.gather(constraints, "column");
                        var autoUpdateFieldNames = columns.filter(function (col) { return col.Extra == "on update CURRENT_TIMESTAMP"; }).map(function (col) { return col.Field; });
                        var tokens = {
                            tableName: this.tableName,
                            resultClassName: this.params.moduleName + "." + this.getVOClassName(),
                            validateObject: kr3m.util.Json.encode(this.propertyTypes),
                            validateFallbacks: kr3m.util.Json.encode(validateFallbacks),
                            copyFields: kr3m.util.Json.encode(copyFields),
                            foreignKeyNames: kr3m.util.Json.encode(foreignKeyNames),
                            autoUpdateFields: kr3m.util.Json.encode(autoUpdateFieldNames)
                        };
                        this.out(templates.VO, tokens);
                        this.out("\n\n");
                        this.out(autoUpdateFieldNames.length > 0 ? templates.VO_PREPOST_AUTOUPDATE : templates.VO_PREPOST, tokens);
                        this.out("\n\n");
                        var primary = kr3m.util.Util.getBy(indexes, "name", "PRIMARY");
                        if (!primary || primary.parts.length != 1)
                            return this.out(templates.VO_CRUD, tokens);
                        var idColumn = kr3m.util.Util.getBy(columns, "Field", primary.parts[0]);
                        var matches = idColumn.Type.match(/(?:var)?char\((\d+)\)/i);
                        tokens.idLength = matches ? matches[1] : "-1";
                        tokens.idName = primary.parts[0];
                        tokens.idType = this.propertyTypes[tokens.idName];
                        tokens.idNameCapital = this.capitalKeys([tokens.idName])[0],
                            this.out(tokens.idType == "number" ? templates.VO_CRUD_ID_NUMBER : templates.VO_CRUD_ID, tokens);
                    };
                    VoGen.prototype.generateSetMethods = function (columns) {
                        var templates = kr3m.tools.mysqlvogenerator.TEMPLATES;
                        for (var i = 0; i < columns.length; ++i) {
                            if (!columns[i].Type.match(/^set\(.+\)$/))
                                continue;
                            this.out("\n\n");
                            var c = columns[i];
                            var tokens = {
                                resultClassName: this.getVOClassName(),
                                setName: c.Field,
                                setNameCapital: this.capitalKeys([c.Field]).join(""),
                                setNameSingularCapital: this.capitalKeys([this.singular(c.Field)]).join(""),
                                setNameSingularLower: this.singular(c.Field),
                                setValuesArray: c.Field.replace(/([A-Z])/g, "_$1").toUpperCase()
                            };
                            this.out(templates.VO_SET_METHODS, tokens);
                        }
                    };
                    VoGen.prototype.generateEnd = function () {
                        this.out("	}");
                        this.out("}");
                    };
                    VoGen.prototype.getFileName = function () {
                        var name = this.singular(this.tableName);
                        return name.toLowerCase().replace(/[^a-z0-9]/g, "") + "vo.ts";
                    };
                    VoGen.prototype.generate = function (callback) {
                        var _this = this;
                        if (this.params.verbose) {
                            this.logSep();
                            log("	" + this.getVOClassName());
                            this.logSep();
                        }
                        else {
                            log(this.getVOClassName());
                        }
                        this.generateStart();
                        this.db.getTableColumns(this.tableName, function (columns) {
                            kr3m.util.Util.sortBy(columns, "Field");
                            _this.generateConstants(columns);
                            _this.generateProperties(columns);
                            _this.db.getTableIndexes(_this.tableName, function (indexes) {
                                indexes.sort(function (a, b) { return a.parts.join(",").localeCompare(b.parts.join(",")); });
                                _this.db.getTableForeignConstraints(_this.tableName, function (foreignConstraints) {
                                    _this.checkForDuplicateForeignConstraints(foreignConstraints);
                                    _this.db.getTableConstraints(_this.tableName, function (constraints) {
                                        _this.checkForDuplicateConstraints(constraints);
                                        _this.out("//" + "# !CLIENT");
                                        _this.generateCRUD(columns, indexes, constraints);
                                        _this.generateFinders(constraints, function () {
                                            _this.generateForeignFinders(foreignConstraints, function () {
                                                _this.generateSetMethods(columns);
                                                _this.out("//" + "# /!CLIENT");
                                                _this.generateEnd();
                                                _this.saveToFile(_this.params.targetPath + _this.getFileName());
                                                callback();
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    };
                    return VoGen;
                }(subgens.SubGen));
                subgens.VoGen = VoGen;
            })(subgens = mysqlvogenerator.subgens || (mysqlvogenerator.subgens = {}));
        })(mysqlvogenerator = tools.mysqlvogenerator || (tools.mysqlvogenerator = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var tools;
    (function (tools) {
        var mysqlvogenerator;
        (function (mysqlvogenerator) {
            var subgens;
            (function (subgens) {
                var ConstGen = (function (_super) {
                    __extends(ConstGen, _super);
                    function ConstGen(db, params, tableName) {
                        var _this = _super.call(this, db, params, tableName) || this;
                        _this.references = [];
                        return _this;
                    }
                    ConstGen.prototype.getFileName = function () {
                        var name = this.singular(this.tableName);
                        return name.toLowerCase().replace(/[^a-z0-9]/g, "") + "const.ts";
                    };
                    ConstGen.prototype.generate = function (callback) {
                        var _this = this;
                        this.generateStart();
                        this.db.getTableColumns(this.tableName, function (columns) {
                            kr3m.util.Util.sortBy(columns, "Field");
                            var hasConstants = _this.generateConstants(columns);
                            if (!hasConstants)
                                return callback();
                            _this.generateEnd();
                            _this.saveToFile(_this.params.targetPath + _this.getFileName());
                            callback();
                        });
                    };
                    return ConstGen;
                }(subgens.VoGen));
                subgens.ConstGen = ConstGen;
            })(subgens = mysqlvogenerator.subgens || (mysqlvogenerator.subgens = {}));
        })(mysqlvogenerator = tools.mysqlvogenerator || (tools.mysqlvogenerator = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var tools;
    (function (tools) {
        var mysqlvogenerator;
        (function (mysqlvogenerator) {
            var subgens;
            (function (subgens) {
                var TabGen = (function (_super) {
                    __extends(TabGen, _super);
                    function TabGen(db, params, tableName) {
                        var _this = _super.call(this, db, params) || this;
                        _this.propertyTypes = {};
                        _this.tableName = tableName;
                        return _this;
                    }
                    TabGen.prototype.getTableClassName = function () {
                        return _super.prototype.getClassName.call(this, this.tableName) + "Table";
                    };
                    TabGen.prototype.getVOClassName = function () {
                        var name = this.singular(_super.prototype.getClassName.call(this, this.tableName));
                        return name + "VO";
                    };
                    TabGen.prototype.generateStart = function () {
                        _super.prototype.generateStart.call(this);
                        var className = this.getTableClassName();
                        this.addLocalReference(this.getVOClassName() + ".ts");
                        this.out("module " + this.params.moduleName);
                        this.out("{");
                        this.out("\texport class " + className);
                        this.out("\t{");
                    };
                    TabGen.prototype.generateProperties = function (columns) {
                        for (var i = 0; i < columns.length; ++i) {
                            var type = this.getPropertyType(columns[i].Type);
                            this.propertyTypes[columns[i].Field] = type;
                        }
                    };
                    TabGen.prototype.generateGenericFunctions = function (columns, indexes, callback) {
                        var templates = kr3m.tools.mysqlvogenerator.TEMPLATES;
                        var className = this.params.moduleName + "." + this.getVOClassName();
                        var tokens = {
                            className: className,
                            tableName: this.tableName,
                            columnNames: kr3m.util.Json.encode(kr3m.util.Util.gather(columns, "Field"))
                        };
                        this.out(templates.TAB_GENERIC_FUNCTIONS, tokens);
                        this.out("\n\n");
                        var primary = kr3m.util.Util.getBy(indexes, "name", "PRIMARY");
                        if (primary && primary.parts.length == 1) {
                            tokens.key = primary.parts[0];
                            tokens.capitalKey = this.capitalKeys([tokens.key])[0];
                            this.out(templates.TAB_GENERIC_FUNCTIONS_PRIMARY, tokens);
                            this.out("\n\n");
                            this.addGlobalReference("kr3m/dojo/gridqueryresponse.ts", []);
                            var primaryCol = kr3m.util.Util.getBy(columns, "Field", primary.parts[0]);
                            var pattern = /(?:var)char\((\d+)\)/i;
                            var matches = primaryCol.Type.match(pattern);
                            if (matches) {
                                tokens.keyLength = matches[1];
                                this.out(templates.TAB_GENERIC_INSERTS_UNIQUE_ASSOC, tokens);
                            }
                            else {
                                var pattern = /(?:big)int/i;
                                var matches = primaryCol.Type.match(pattern);
                                if (matches) {
                                    this.out(templates.TAB_GENERIC_INSERTS_UNIQUE_NUMBER, tokens);
                                }
                                else {
                                    this.out(templates.TAB_GENERIC_INSERTS, tokens);
                                }
                            }
                        }
                        else {
                            this.out(templates.TAB_GENERIC_INSERTS, tokens);
                        }
                        callback();
                    };
                    TabGen.prototype.generateGenerators = function (columns, indexes, callback) {
                        var templates = kr3m.tools.mysqlvogenerator.TEMPLATES;
                        var pattern = /(?:var)char\((\d+)\)/i;
                        for (var i = 0; i < indexes.length; ++i) {
                            if (indexes[i].unique && indexes[i].parts.length == 1) {
                                var column = kr3m.util.Util.getBy(columns, "Field", indexes[i].parts[0]);
                                var matches = column.Type.match(pattern);
                                if (matches) {
                                    var keyLength = matches[1];
                                    var key = indexes[i].parts[0];
                                    var capitalKey = this.capitalKeys([key])[0];
                                    this.out("\n\n");
                                    var tokens = { capitalKey: capitalKey, key: key, keyLength: keyLength };
                                    this.out(templates.TAB_GENERATORS, tokens);
                                }
                            }
                        }
                        callback();
                    };
                    TabGen.prototype.generateFinders = function (indexes, callback) {
                        var templates = kr3m.tools.mysqlvogenerator.TEMPLATES;
                        var finderNames = [];
                        for (var k = 0; k < indexes.length; ++k) {
                            var className = this.params.moduleName + "." + this.getVOClassName();
                            if (indexes[k].unique && indexes[k].parts.length == 1) {
                                var keySingular = indexes[k].parts[0];
                                var keyPlural = this.plural(keySingular);
                                var capitalKey = this.capitalKeys([keyPlural])[0];
                                var finderName = "getBy" + capitalKey;
                                if (!kr3m.util.Util.contains(finderNames, finderName)) {
                                    finderNames.push(finderName);
                                    var tokens = {
                                        finderName: finderName,
                                        typedParams: keyPlural + ":" + this.propertyTypes[keySingular] + "[]",
                                        keyType: this.propertyTypes[keySingular],
                                        className: className,
                                        tableName: this.tableName,
                                        keyPlural: keyPlural,
                                        keyCapital: this.capitalKeys([keySingular])[0],
                                        keySingular: keySingular
                                    };
                                    this.out("\n\n");
                                    this.out(templates.TAB_FINDERS_UNIQUE_ASSOC, tokens);
                                }
                            }
                            for (var i = 0; i < indexes[k].parts.length; ++i) {
                                var isUnique = indexes[k].unique && i == indexes[k].parts.length - 1;
                                var keys = indexes[k].parts.slice(0, i + 1);
                                var capitalKeys = this.capitalKeys(keys);
                                var finderName = "getBy" + capitalKeys.join("");
                                if (kr3m.util.Util.contains(finderNames, finderName))
                                    continue;
                                finderNames.push(finderName);
                                var typedParams = [];
                                var typedParamsPlural = [];
                                for (var j = 0; j < keys.length; ++j) {
                                    typedParams.push(keys[j] + ":" + this.propertyTypes[keys[j]]);
                                    typedParamsPlural.push(this.plural(keys[j]) + ":" + this.propertyTypes[keys[j]] + "[]");
                                }
                                var tokens = {
                                    finderName: finderName,
                                    typedParams: typedParams.join(", "),
                                    className: className,
                                    tableName: this.tableName,
                                    keysComma: keys.join(", "),
                                    keysSql: keys.join("` = ? AND `")
                                };
                                this.out("\n\n");
                                this.out(isUnique ? templates.TAB_FINDERS_UNIQUE : templates.TAB_FINDERS, tokens);
                            }
                        }
                        callback();
                    };
                    TabGen.prototype.generateEnd = function () {
                        this.out("\t}");
                        this.out("}\n\n");
                        this.out("var t" + this.getTableClassName().slice(0, -5) + " = new " + this.params.moduleName + "." + this.getTableClassName() + "();");
                    };
                    TabGen.prototype.getFileName = function () {
                        return this.tableName.toLowerCase().replace(/[^a-z0-9]/g, "") + "table.ts";
                    };
                    TabGen.prototype.generate = function (callback) {
                        var _this = this;
                        if (this.params.verbose) {
                            this.logSep();
                            log("\t" + this.getTableClassName());
                            this.logSep();
                        }
                        else {
                            log(this.getTableClassName());
                        }
                        this.generateStart();
                        this.db.getTableColumns(this.tableName, function (columns) {
                            kr3m.util.Util.sortBy(columns, "Field");
                            _this.db.getTableIndexes(_this.tableName, function (indexes) {
                                indexes.sort(function (a, b) { return a.parts.join(",").localeCompare(b.parts.join(",")); });
                                _this.generateProperties(columns);
                                _this.generateGenericFunctions(columns, indexes, function () {
                                    _this.generateGenerators(columns, indexes, function () {
                                        _this.generateFinders(indexes, function () {
                                            _this.generateEnd();
                                            _this.saveToFile(_this.params.targetPath + _this.getFileName());
                                            callback();
                                        });
                                    });
                                });
                            });
                        });
                    };
                    return TabGen;
                }(kr3m.tools.mysqlvogenerator.subgens.SubGen));
                subgens.TabGen = TabGen;
            })(subgens = mysqlvogenerator.subgens || (mysqlvogenerator.subgens = {}));
        })(mysqlvogenerator = tools.mysqlvogenerator || (tools.mysqlvogenerator = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var tools;
    (function (tools) {
        var mysqlvogenerator;
        (function (mysqlvogenerator) {
            var Generator = (function () {
                function Generator() {
                    this.delay = new kr3m.async.Delayed();
                }
                Generator.prototype.runWithParameters = function (params) {
                    if (params.silent)
                        kr3m.util.Log.enabled = false;
                    log("kr3m MySQL TypeScript VO Generator", kr3m.VERSION);
                    var dbConfig = new kr3m.db.MySqlDbConfig();
                    dbConfig.host = params.dbHost;
                    dbConfig.user = params.dbUser;
                    dbConfig.password = params.dbPassword;
                    dbConfig.database = params.dbDatabase;
                    var db = new kr3m.db.MySqlDb(dbConfig);
                    db.getTableNames(function (tableNames) {
                        kr3m.async.Loop.forEach(tableNames, function (tableName, loopCallback) {
                            var queue = new kr3m.async.Queue(true);
                            queue.add(function (queueCallback) {
                                var constGen = new kr3m.tools.mysqlvogenerator.subgens.ConstGen(db, params, tableName);
                                constGen.generate(queueCallback);
                            });
                            queue.add(function (queueCallback) {
                                var voGen = new kr3m.tools.mysqlvogenerator.subgens.VoGen(db, params, tableName);
                                voGen.generate(queueCallback);
                            });
                            queue.add(function (queueCallback) {
                                var tabGen = new kr3m.tools.mysqlvogenerator.subgens.TabGen(db, params, tableName);
                                tabGen.generate(queueCallback);
                            });
                            queue.add(loopCallback);
                        }, function () {
                            log("DONE");
                            process.exit(0);
                        });
                    });
                };
                Generator.prototype.run = function () {
                    var params = new kr3m.tools.mysqlvogenerator.Parameters(process.argv);
                    this.runWithParameters(params);
                };
                return Generator;
            }());
            mysqlvogenerator.Generator = Generator;
        })(mysqlvogenerator = tools.mysqlvogenerator || (tools.mysqlvogenerator = {}));
    })(tools = kr3m.tools || (kr3m.tools = {}));
})(kr3m || (kr3m = {}));
var generator = new kr3m.tools.mysqlvogenerator.Generator();
generator.run();
