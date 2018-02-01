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
    kr3m.REGEX_DATA_URL = /^data:([^;]+);base64,(.+)$/;
    kr3m.REGEX_DATA_URL_GROUPS = ["mimeType", "payload"];
    kr3m.REGEX_DEVICE_ID = /^[A-Z]+:/;
    kr3m.REGEX_EMAIL = /^[0-9a-zA-Z\._\-]+@[0-9a-zA-Z][0-9a-zA-Z\-\.]+\.[a-zA-Z]+$/;
    kr3m.REGEX_FLOAT = /^\-?\d+[,\.]?\d*$/;
    kr3m.REGEX_INTEGER = /^\-?\d+$/;
    kr3m.REGEX_LOCALE = /^([a-z][a-z])[_\-]?([A-Z][A-Z])$/;
    kr3m.REGEX_LOCALE_GROUPS = ["languageId", "countryId"];
    kr3m.REGEX_URL = /^(?:(\w+)\:)?(?:\/\/(?:(\w+):(\w+)@)?([^\/:#?]+)(?::(\d+))?)?([^\?#]*)(?:\?([^#]*))?(?:#(.*))?$/;
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
            StringEx.splitNoEmpty = function (text, seperator) {
                if (seperator === void 0) { seperator = ","; }
                var result = text.split(seperator);
                for (var i = 0; i < result.length; ++i) {
                    if (!result[i])
                        result.splice(i--, 1);
                }
                return result;
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
            StringEx.getUnitString = function (value, units) {
                var result = "";
                for (var unit in units) {
                    var amount = value % units[unit];
                    if (amount > 0)
                        result = amount + unit + " " + result;
                    value = Math.floor(value / units[unit]);
                }
                return result || "0" + (Object.keys(units)[0] || "");
            };
            StringEx.bigNumber = function (value) {
                var units = { "": 1000, k: 1000, M: 1000, G: 1000, T: 1000, P: 1000, E: 1000, Z: 1000, Y: 1000, ALOT: 100000000 };
                return StringEx.getUnitString(value, units);
            };
            StringEx.getSizeString = function (size, useDual) {
                if (useDual === void 0) { useDual = true; }
                var units = useDual
                    ? { B: 1024, kB: 1024, MB: 1024, GB: 1024, TB: 1024, PB: 1024, EB: 1024, ZB: 1024, YB: 1024, ALOT: 100000000 }
                    : { B: 1000, kB: 1000, MB: 1000, GB: 1000, TB: 1000, PB: 1000, EB: 1000, ZB: 1000, YB: 1000, ALOT: 100000000 };
                return StringEx.getUnitString(size, units);
            };
            StringEx.getDurationString = function (duration) {
                var units = { ms: 1000, s: 60, m: 60, h: 24, d: 7, w: 52, y: 100, centuries: 10, millenia: 1000, ages: 100000000 };
                return StringEx.getUnitString(duration, units);
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
            Util.reverse = function (values) {
                values = values.slice();
                var m = Math.floor(values.length / 2);
                var e = values.length - 1;
                for (var i = 0; i < m; ++i)
                    _a = [values[e - i], values[i]], values[i] = _a[0], values[e - i] = _a[1];
                return values;
                var _a;
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
            Util.getBy = function (objects, propertyName, propertyValue, offset) {
                if (offset === void 0) { offset = 0; }
                var pos = Util.findBy(objects, propertyName, propertyValue, offset);
                return pos >= 0 ? objects[pos] : undefined;
            };
            Util.findBy = function (objects, propertyName, propertyValue, offset) {
                if (offset === void 0) { offset = 0; }
                if (!objects)
                    return -1;
                for (var i = offset; i < objects.length; ++i) {
                    if (Util.getProperty(objects[i], propertyName) == propertyValue)
                        return i;
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
            Log.logWarning = Log.log;
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
    var ui;
    (function (ui) {
        var Element = (function () {
            function Element(parentElement, domQuery, htmlTag, attributes) {
                if (parentElement === void 0) { parentElement = null; }
                if (domQuery === void 0) { domQuery = ""; }
                if (htmlTag === void 0) { htmlTag = "div"; }
                if (attributes === void 0) { attributes = {}; }
                this.scaleFactor = 1.0;
                this.listeningForTouches = false;
                this.touches = [];
                this.parent = null;
                this.validatePropagation = true;
                this.delayStage = new kr3m.async.Delayed();
                this.children = [];
                this.htmlTag = htmlTag;
                this.createAttributes = attributes;
                this.dom = domQuery ? $(domQuery) : this.create();
                if (parentElement && parentElement instanceof kr3m.ui.Element)
                    parentElement.addChild(this);
                else
                    this.parent = parentElement;
            }
            Element.getFreeId = function () {
                return "ID_" + kr3m.ui.Element.NEXT_FREE_ID++;
            };
            Element.prototype.callOnStage = function (callback) {
                this.delayStage.call(callback);
            };
            Element.prototype.create = function () {
                var attributesText = "";
                for (var key in this.createAttributes)
                    attributesText += " " + key + '="' + this.createAttributes[key] + '"';
                return $('<' + this.htmlTag + attributesText + '></' + this.htmlTag + '>');
            };
            Element.prototype.scrollIntoView = function (alignWithTop) {
                if (alignWithTop === void 0) { alignWithTop = true; }
                this.dom[0].scrollIntoView(alignWithTop);
            };
            Element.prototype.scrollToBottom = function () {
                this.dom.scrollTop(this.dom[0].scrollHeight);
            };
            Element.prototype.getTag = function () {
                return this.dom.prop("tagName");
            };
            Element.prototype.addClass = function (className) {
                this.dom.addClass(className);
            };
            Element.prototype.removeClass = function (className) {
                this.dom.removeClass(className);
            };
            Element.prototype.hasClass = function (className) {
                return this.dom.hasClass(className);
            };
            Element.prototype.getClasses = function () {
                return this.dom.attr("class").split(" ");
            };
            Element.prototype.remove = function () {
                this.dom.remove();
                this.onRemovedFromStage();
            };
            Element.prototype.detach = function () {
                this.dom.detach();
                this.onRemovedFromStage();
            };
            Element.prototype.getId = function () {
                return this.dom.attr("id");
            };
            Element.prototype.setId = function (id) {
                this.dom.attr("id", id);
            };
            Element.prototype.setName = function (name) {
                this.dom.attr("name", name);
            };
            Element.prototype.getName = function () {
                return this.dom.attr("name");
            };
            Element.prototype.isInFullScreen = function () {
                var domElement = this.dom.get(0);
                var fieldNames = [
                    "fullscreenElement",
                    "mozFullScreenElement",
                    "webkitFullscreenElement"
                ];
                for (var i = 0; i < fieldNames.length; ++i) {
                    if (document[fieldNames[i]] == domElement)
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
                var d = this.dom.get(0);
                for (var i = 0; i < funcNames.length; ++i) {
                    var func = d[funcNames[i]];
                    if (func) {
                        func.call(d);
                        return true;
                    }
                }
                kr3m.util.Log.logError("fullscreen mode not supported in this browser");
                return false;
            };
            Element.prototype.exitFullscreen = function () {
                var funcNames = [
                    "exitFullScreen",
                    "exitFullscreen",
                    "webkitExitFullscreen",
                    "webkitExitFullScreen",
                    "mozCancelFullscreen",
                    "mozCancelFullScreen",
                    "msExitFullscreen",
                    "msExitFullScreen"
                ];
                for (var i = 0; i < funcNames.length; ++i) {
                    var func = document[funcNames[i]];
                    if (func) {
                        func.call(document);
                        return true;
                    }
                }
                return false;
            };
            Element.prototype.resetVoValue = function () {
            };
            Element.prototype.getVoValue = function () {
                return null;
            };
            Element.prototype.setVoValue = function (value) {
            };
            Element.prototype.toggle = function () {
                this.setVisible(!this.isVisible());
            };
            Element.prototype.setVisible = function (visible) {
                if (visible)
                    this.show();
                else
                    this.hide();
            };
            Element.prototype.show = function () {
                this.dom.show();
            };
            Element.prototype.hide = function () {
                this.dom.hide();
            };
            Element.prototype.isVisible = function () {
                return this.dom.is(":visible");
            };
            Element.prototype.fadeIn = function (durationOrCallback, callback) {
                this.dom.fadeIn(durationOrCallback, callback);
            };
            Element.prototype.fadeOut = function (durationOrCallback, callback) {
                this.dom.fadeOut(durationOrCallback, callback);
            };
            Element.prototype.validate = function () {
                var result = kr3m.ui.Element.VALID;
                for (var i = 0; i < this.children.length; ++i) {
                    if (!this.children[i].validatePropagation)
                        continue;
                    var validState = this.children[i].validate();
                    if (validState != kr3m.ui.Element.VALID)
                        result = validState;
                }
                return result;
            };
            Element.prototype.isValid = function () {
                return this.validate() == kr3m.ui.Element.VALID;
            };
            Element.prototype.getApp = function () {
                var iter = this.parent;
                while (iter) {
                    if (iter instanceof kr3m.app.Application)
                        return iter;
                    else
                        iter = iter.parent;
                }
                return null;
            };
            Element.prototype.getTrackingPart = function () {
                return null;
            };
            Element.prototype.getTrackingId = function () {
                var parts = [];
                var iter = this;
                while (iter) {
                    if (iter instanceof Element) {
                        var part = iter.getTrackingPart();
                        if (part)
                            parts.splice(0, 0, part);
                    }
                    iter = iter.parent;
                }
                return parts.join('/');
            };
            Element.prototype.onAddedToStage = function () {
                this.delayStage.execute();
            };
            Element.prototype.addChild = function (child) {
                child.parent = this;
                this.children.push(child);
                this.dom.append(child.dom);
                child.onAddedToStage();
            };
            Element.prototype.addChildAt = function (child, index) {
                index = Math.min(this.children.length, Math.max(0, index));
                if (index == 0)
                    return this.prependChild(child);
                else if (index == this.children.length)
                    return this.addChild(child);
                child.parent = this;
                var childAfter = this.children[index];
                this.children.splice(index, 0, child);
                child.dom.insertBefore(childAfter.dom);
                child.onAddedToStage();
            };
            Element.prototype.prependChild = function (child) {
                child.parent = this;
                this.children.unshift(child);
                this.dom.prepend(child.dom);
                child.onAddedToStage();
            };
            Element.prototype.onRemovedFromStage = function () {
            };
            Element.prototype.removeChild = function (child) {
                for (var i = 0; i < this.children.length; ++i) {
                    if (this.children[i] == child) {
                        this.children.splice(i, 1);
                        child.dom.detach();
                        child.onRemovedFromStage();
                        child.parent = null;
                        return;
                    }
                }
            };
            Element.prototype.isChild = function (child) {
                for (var i = 0; i < this.children.length; ++i)
                    if (this.children[i] == child)
                        return true;
                return false;
            };
            Element.prototype.getChildCount = function () {
                return this.children.length;
            };
            Element.prototype.getChildByPosition = function (position) {
                return this.children[position];
            };
            Element.prototype.getChildrenOfClass = function (cls, recursive) {
                if (recursive === void 0) { recursive = false; }
                var result = [];
                for (var i = 0; i < this.children.length; ++i) {
                    if (this.children[i] instanceof cls)
                        result.push(this.children[i]);
                    if (recursive)
                        result = result.concat(this.children[i].getChildrenOfClass(cls, true));
                }
                return result;
            };
            Element.prototype.removeAllChildren = function (removeHtmlToo) {
                if (removeHtmlToo === void 0) { removeHtmlToo = true; }
                while (this.children.length > 0)
                    this.removeChild(this.children[0]);
                if (removeHtmlToo)
                    this.dom.empty();
            };
            Element.prototype.onSize = function (width, height) {
                for (var i = 0; i < this.children.length; ++i)
                    this.children[i].onSize(width, height);
            };
            Element.prototype.onOrientation = function (isPortrait) {
                for (var i = 0; i < this.children.length; ++i)
                    this.children[i].onOrientation(isPortrait);
            };
            Element.prototype.scale = function (factor) {
                var value, values = {};
                value = "scale(" + factor + "," + factor + ")";
                values["transform"] = value;
                values["-ms-transform"] = value;
                values["-webkit-transform"] = value;
                value = "left top";
                values["transform-origin"] = value;
                values["-ms-transform-origin"] = value;
                values["-webkit-transform-origin"] = value;
                this.dom.css(values);
                this.scaleFactor = factor;
            };
            Element.prototype.animate = function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                return this.dom.animate.apply(this.dom, params);
            };
            Element.prototype.css = function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                return this.dom.css.apply(this.dom, params);
            };
            Element.prototype.getTotalScaleFactor = function () {
                var result = 1;
                var temp = this;
                while (temp && temp instanceof Element) {
                    result *= temp.scaleFactor;
                    temp = temp.parent;
                }
                return result;
            };
            Element.prototype.setAttribute = function (name, value) {
                this.dom.attr(name, value);
            };
            Element.prototype.removeAttribute = function (name) {
                this.dom.removeAttr(name);
            };
            Element.prototype.setProperty = function (name, value) {
                this.dom.prop(name, value);
            };
            Element.prototype.getAttribute = function (name) {
                return this.dom.attr(name);
            };
            Element.prototype.getHeight = function (withMargin) {
                if (withMargin === void 0) { withMargin = false; }
                return this.dom.outerHeight(withMargin);
            };
            Element.prototype.getWidth = function (withMargin) {
                if (withMargin === void 0) { withMargin = false; }
                return this.dom.outerWidth(withMargin);
            };
            Element.prototype.getWindowHeight = function () {
                return $(window).height();
            };
            Element.prototype.getWindowWidth = function () {
                return $(window).width();
            };
            Element.prototype.setWidth = function (width) {
                this.dom.css("width", width);
            };
            Element.prototype.setHeight = function (height) {
                this.dom.css("height", height);
            };
            Element.prototype.trigger = function () {
                this.dom.trigger.apply(this.dom, arguments);
            };
            Element.prototype.click = function () {
                var event = document.createEvent("MouseEvents");
                event.initEvent("click", true, true);
                this.dom.get(0).dispatchEvent(event);
            };
            Element.prototype.on = function (eventName, handler) {
                if (kr3m.util.Util.contains(["swipeleft", "swiperight", "swipedown", "swipeup"], eventName))
                    this.listenForTouch();
                this.dom.on(eventName, handler);
            };
            Element.prototype.one = function (eventName, handler) {
                if (kr3m.util.Util.contains(["swipeleft", "swiperight", "swipedown", "swipeup"], eventName))
                    this.listenForTouch();
                this.dom.one(eventName, handler);
            };
            Element.prototype.off = function (eventName, handler) {
                this.dom.off(eventName, handler);
            };
            Element.prototype.getParentOfClass = function (cls) {
                var temp = this.parent;
                while (temp) {
                    if (temp instanceof cls)
                        return temp;
                    temp = temp.parent;
                }
                return null;
            };
            Element.prototype.getRootOfClass = function (cls) {
                var temp = this.parent;
                var root = null;
                while (temp) {
                    if (temp instanceof cls)
                        root = temp;
                    temp = temp.parent;
                }
                return root;
            };
            Element.prototype.getSiblingOfClass = function (cls) {
                if (!this.parent || !(this.parent instanceof kr3m.ui.Element))
                    return null;
                for (var i = 0; i < this.parent.children.length; ++i) {
                    if (this.parent.children[i] instanceof cls)
                        return this.parent.children[i];
                }
                return null;
            };
            Element.prototype.getSiblingsOfClass = function (cls) {
                if (!this.parent || !(this.parent instanceof kr3m.ui.Element))
                    return null;
                var siblings = [];
                for (var i = 0; i < this.parent.children.length; ++i) {
                    if (this.parent.children[i] instanceof cls)
                        siblings.push(this.parent.children[i]);
                }
                return siblings;
            };
            Element.prototype.enable = function () {
                this.dom.prop("disabled", false);
                this.removeClass("disabled");
            };
            Element.prototype.disable = function () {
                this.dom.prop("disabled", true);
                this.addClass("disabled");
            };
            Element.prototype.setEnabled = function (enabled) {
                if (enabled)
                    this.enable();
                else
                    this.disable();
            };
            Element.prototype.isEnabled = function () {
                return !this.hasClass("disabled");
            };
            Element.prototype.isDisabled = function () {
                return this.hasClass("disabled");
            };
            Element.prototype.bindToDom = function (dom, parentElement) {
                if (this.parent)
                    this.parent.removeChild(this);
                this.dom = dom;
                parentElement.addChild(this);
            };
            Element.prototype.bindElement = function (domId, elementClass) {
                if (elementClass === void 0) { elementClass = kr3m.ui.Element; }
                var params = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    params[_i - 2] = arguments[_i];
                }
                var oldDom = this.dom.find("#" + domId);
                if (oldDom.length != 1)
                    return null;
                var htmlParams = oldDom.data("params");
                if (typeof htmlParams != "undefined")
                    params = params.concat(eval("[" + htmlParams + "]"));
                params.splice(0, 0, null);
                var newElement = kr3m.util.Class.createInstanceOfClass(elementClass, params);
                newElement.dom = oldDom;
                this.children.push(newElement);
                newElement.parent = this;
                newElement.onAddedToStage();
                return newElement;
            };
            Element.prototype.replaceElement = function (domId, elementClass) {
                if (elementClass === void 0) { elementClass = kr3m.ui.Element; }
                var params = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    params[_i - 2] = arguments[_i];
                }
                var oldDom = this.dom.find("#" + domId);
                if (oldDom.length != 1)
                    return null;
                var htmlParams = oldDom.data("params");
                if (typeof htmlParams != "undefined")
                    params = params.concat(eval("[" + htmlParams + "]"));
                params.splice(0, 0, null);
                var newElement = kr3m.util.Class.createInstanceOfClass(elementClass, params);
                oldDom.replaceWith(newElement.dom);
                newElement.dom.attr("id", domId);
                var oldClassesValue = oldDom.attr("class");
                if (oldClassesValue) {
                    var oldClasses = oldClassesValue.split(/\s+/);
                    for (var i = 0; i < oldClasses.length; ++i)
                        newElement.addClass(oldClasses[i]);
                }
                this.children.push(newElement);
                newElement.parent = this;
                newElement.onAddedToStage();
                return newElement;
            };
            Element.prototype.setElementText = function (domId, text) {
                var dom = this.dom.find("#" + domId);
                dom.text(text);
            };
            Element.prototype.setElementHtml = function (domId, html) {
                var dom = this.dom.find("#" + domId);
                dom.html(html);
            };
            Element.prototype.setElementVisible = function (domId, visible) {
                var dom = this.dom.find("#" + domId);
                if (visible)
                    dom.show();
                else
                    dom.hide();
            };
            Element.prototype.setElementAttribute = function (domId, attribute, value) {
                var dom = this.dom.find("#" + domId);
                dom.attr(attribute, value);
            };
            Element.prototype.setInnerHtml = function (html) {
                this.dom.html(html);
            };
            Element.prototype.getInnerHtml = function () {
                return this.dom.html();
            };
            Element.prototype.findChildren = function (selector) {
                var result = [];
                for (var i = 0; i < this.children.length; ++i) {
                    if (this.children[i].dom.is(selector))
                        result.push(this.children[i]);
                    result = result.concat(this.children[i].findChildren(selector));
                }
                return result;
            };
            Element.prototype.isAttachedTo = function (element) {
                var temp = this.parent;
                while (temp) {
                    if (temp == element)
                        return true;
                    temp = temp.parent;
                }
                return false;
            };
            Element.registerVoClass = function (id, doReplace, elementClass) {
                var parameters = [];
                for (var _i = 3; _i < arguments.length; _i++) {
                    parameters[_i - 3] = arguments[_i];
                }
                var item = {
                    id: id,
                    doReplace: doReplace,
                    elementClass: elementClass,
                    parameters: parameters
                };
                kr3m.ui.Element.registeredVoClasses[id] = item;
            };
            Element.prototype.autoFindVoFields = function () {
                var _this = this;
                this.autoVoFields = {};
                var doms = this.dom.find("[id]");
                doms.each(function (i, obj) {
                    var id = obj.id;
                    var registered = kr3m.ui.Element.registeredVoClasses[id];
                    if (!registered)
                        return;
                    var func = registered.doReplace ? _this.replaceElement : _this.bindElement;
                    var params = [id, registered.elementClass].concat(registered.parameters);
                    var field = func.apply(_this, params);
                    _this.autoVoFields[id] = field;
                });
            };
            Element.prototype.autoResetVo = function () {
                if (!this.autoVoFields)
                    this.autoFindVoFields();
                for (var id in this.autoVoFields)
                    this.autoVoFields[id].resetVoValue();
            };
            Element.prototype.autoSetVo = function (vo) {
                if (!this.autoVoFields)
                    this.autoFindVoFields();
                for (var i in vo) {
                    if (typeof vo[i] != "function") {
                        var field = this.autoVoFields[i];
                        if (field)
                            field.setVoValue(vo[i]);
                    }
                }
            };
            Element.prototype.autoGetVo = function () {
                if (!this.autoVoFields)
                    this.autoFindVoFields();
                var vo = {};
                for (var id in this.autoVoFields)
                    vo[id] = this.autoVoFields[id].getVoValue();
                return vo;
            };
            Element.prototype.focus = function () {
                this.dom.focus();
            };
            Element.prototype.blur = function () {
                this.dom.blur();
            };
            Element.prototype.listenForTouch = function () {
                if (this.listeningForTouches)
                    return;
                this.listeningForTouches = true;
                this.on("touchstart", this.translateTouchEvent.bind(this, this.touchStart.bind(this)));
                this.on("touchmove", this.translateTouchEvent.bind(this, this.touchMove.bind(this)));
                this.on("touchend", this.translateTouchEvent.bind(this, this.touchEnd.bind(this)));
                this.on("touchcancel", this.translateTouchEvent.bind(this, this.touchEnd.bind(this)));
                this.on("touchleave", this.translateTouchEvent.bind(this, this.touchEnd.bind(this)));
            };
            Element.prototype.touchStart = function (touch) {
                this.touches.push({
                    id: touch.identifier,
                    sx: touch.pageX,
                    sy: touch.pageY,
                    x: touch.pageX,
                    y: touch.pageY
                });
            };
            Element.prototype.touchMove = function (touch) {
                var myTouch = kr3m.util.Util.getBy(this.touches, "id", touch.identifier);
                myTouch.x = touch.pageX;
                myTouch.y = touch.pageY;
            };
            Element.prototype.touchEnd = function (touch) {
                var myTouch = kr3m.util.Util.removeBy(this.touches, "id", touch.identifier)[0];
                var dx = touch.pageX - myTouch.sx;
                var dy = touch.pageY - myTouch.sy;
                var dxa = Math.abs(dx);
                var dya = Math.abs(dy);
                var max = Math.max(dxa, dya);
                if (max > 10) {
                    if (dxa > dya)
                        this.trigger(dx > 0 ? "swiperight" : "swipeleft");
                    else
                        this.trigger(dy > 0 ? "swipedown" : "swipeup");
                }
            };
            Element.prototype.translateTouchEvent = function (handler, rawEvent) {
                var te = rawEvent.originalEvent;
                for (var i = 0; i < te.changedTouches.length; ++i)
                    handler(te.changedTouches[i]);
            };
            Element.VALID = "VALID";
            Element.NEXT_FREE_ID = 1;
            Element.registeredVoClasses = {};
            return Element;
        }());
        ui.Element = Element;
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var async;
    (function (async) {
        var Loop = (function () {
            function Loop() {
            }
            Loop.loop = function (innerLoop, callback) {
                var innerHelper = function (again) {
                    if (again || again === undefined)
                        innerLoop(innerHelper);
                    else if (callback)
                        callback();
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
                var innerHelper = function () {
                    --runningCount;
                    if (i < count) {
                        ++runningCount;
                        loopFunc(i++, innerHelper);
                    }
                    else if (callback && runningCount == 0) {
                        callback();
                    }
                };
                for (var j = 0; j < runningCountInitial; ++j)
                    innerHelper();
            };
            Loop.forEach = function (values, loopFunc, callback, parallelCount) {
                if (parallelCount === void 0) { parallelCount = 1; }
                if (!values || values.length == 0)
                    return callback && callback();
                var i = 0;
                var runningCount = Math.min(parallelCount, values.length);
                var runningCountInitial = runningCount;
                var innerHelper = function () {
                    --runningCount;
                    if (i < values.length) {
                        ++runningCount;
                        loopFunc(values[i++], innerHelper, i - 1);
                    }
                    else if (callback && runningCount == 0) {
                        callback();
                    }
                };
                for (var j = 0; j < runningCountInitial; ++j)
                    innerHelper();
            };
            Loop.forEachAssoc = function (valuesMap, loopFunc, callback, parallelCount) {
                if (parallelCount === void 0) { parallelCount = 1; }
                if (!valuesMap)
                    return callback && callback();
                var keys = Object.keys(valuesMap);
                kr3m.async.Loop.forEach(keys, function (key, loopDone) {
                    loopFunc(key, valuesMap[key], loopDone);
                }, callback, parallelCount);
            };
            Loop.forEachBatch = function (values, batchSize, loopFunc, callback, parallelCount) {
                if (parallelCount === void 0) { parallelCount = 1; }
                if (!values || values.length == 0)
                    return callback && callback();
                var i = 0;
                var runningCount = Math.min(parallelCount, Math.ceil(values.length / batchSize));
                var runningCountInitial = runningCount;
                var innerHelper = function () {
                    --runningCount;
                    if (i < values.length) {
                        ++runningCount;
                        var batch = values.slice(i, i + batchSize);
                        i += batch.length;
                        loopFunc(batch, innerHelper, i - batch.length);
                    }
                    else if (callback && runningCount == 0) {
                        callback();
                    }
                };
                for (var j = 0; j < runningCountInitial; ++j)
                    innerHelper();
            };
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
                this.androidVersion = "";
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
                    if (/OS 10_/i.test(ua))
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
                if (/Arora/.test(ua)) {
                    this.arora = true;
                }
                else if (/Edge\/\d+/.test(ua)) {
                    this.edge = true;
                }
                else if (/Chrome/.test(ua)) {
                    this.chrome = true;
                }
                else if (/CriOS/.test(ua)) {
                    this.iOSChrome = true;
                }
                else if (/Epiphany/.test(ua)) {
                    this.epiphany = true;
                }
                else if (/Firefox/.test(ua)) {
                    this.firefox = true;
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
            Url.parse = function (url) {
                var parts = new UrlParts();
                if (!url)
                    return parts;
                var isFile = url.slice(0, 8) == "file:///";
                if (isFile)
                    url = url.slice(7);
                parts = util.StringEx.captureNamed(url, kr3m.REGEX_URL, kr3m.REGEX_URL_GROUPS);
                if (isFile)
                    parts["protocol"] = "file";
                return parts || new UrlParts();
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
                if (location.search.indexOf('force-mobile') > -1)
                    return true;
                if (location.search.indexOf('force-iphone') > -1)
                    return true;
                var device = util.Device.getInstance();
                return !device.desktop;
            };
            Browser.isTablet = function () {
                if (location.search.indexOf('force-tablet') > -1)
                    return true;
                if (location.search.indexOf('force-ipad') > -1)
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
                if (location.search.indexOf('force-iphone') > -1)
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
                if ((location.search.indexOf('force-ios') > -1) ||
                    (location.search.indexOf('force-ios9') > -1) ||
                    (location.search.indexOf('force-ios10') > -1))
                    return true;
                return device.iOS;
            };
            Browser.isIOs9 = function () {
                var device = util.Device.getInstance();
                if (location.search.indexOf('force-ios9') > -1)
                    return true;
                return device.iOS9;
            };
            Browser.isIOs10 = function () {
                var device = util.Device.getInstance();
                if (location.search.indexOf('force-ios10') > -1)
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
                var elem = document.createElement('canvas');
                var isSupported = !!(elem.getContext && elem.getContext('2d'));
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
    kr3m.VERSION = "1.6.19.17";
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
    if (tokens === void 0) { tokens = null; }
    if (seperator === void 0) { seperator = "##"; }
    return kr3m.util.Tokenizer.get(text, tokens, seperator);
}
function setToken(name, value) {
    kr3m.util.Tokenizer.setToken(name, value);
}
var kr3m;
(function (kr3m) {
    var xml;
    (function (xml_1) {
        var Parser = (function () {
            function Parser() {
                this.S = { " ": true, "\n": true, "\t": true };
                this.NW = { " ": true, "\n": true, "\t": true, "<": true, ">": true, "=": true, "\"": true, "'": true };
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
                this.items = [];
                this.sortFunc = sortFunc;
            }
            SortedList.prototype.clear = function () {
                this.items = [];
            };
            SortedList.prototype.push = function (value) {
                this.add(value);
            };
            SortedList.prototype.add = function (value) {
                var pos = kr3m.algorithms.search.bisectInsertPos(this.items, value, this.sortFunc);
                this.items.splice(pos, 0, value);
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
            SortedList.prototype.toArray = function () {
                return this.items.slice();
            };
            SortedList.prototype.splice = function (offset, deleteCount) {
                var newElements = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    newElements[_i - 2] = arguments[_i];
                }
                this.items.splice(offset, deleteCount);
                for (var i = 0; i < newElements.length; ++i)
                    this.add(newElements[i]);
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
            SortedList.prototype.get = function (i) {
                return this.items[i];
            };
            SortedList.prototype.set = function (i, value) {
                this.items[i] = value;
                this.items.sort(this.sortFunc);
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
            PriorityQueue.prototype.add = function (func, priority) {
                if (priority === void 0) { priority = 0; }
                this.pending.add({ p: priority, f: func });
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
                callFunc(helper);
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
            Ajax.call = function (url, callback, type, errorCallback) {
                type = type || Ajax.getTypeFromUrl(url) || "json";
                var request = Ajax.getXMLHttpRequestObject();
                if (type == "json")
                    request.overrideMimeType("application/json");
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
                if (type == "json")
                    request.overrideMimeType("application/json");
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
                if (type == "json")
                    request.overrideMimeType("application/json");
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
                this.queue.add(function (next) {
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
            Localization.setRaw = function (id, text, language) {
                language = language || Localization.language;
                var tempModule = Localization.getModule(language);
                tempModule[id] = text;
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
                if (typeof dateObj == "string" || typeof dateObj == "number")
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
                        to.items[i] = from.items[i];
                }
                Localization.dropModule(fromName);
            };
            Localization.addJSONModule = function (texts, language, callback, moduleName) {
                language = language || Localization.language;
                var tempModule = Localization.getModule(language, moduleName);
                for (var id in texts)
                    tempModule.items[id] = texts[id];
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
                language = language || Localization.language;
                var tempModule = Localization.getModule(language, moduleName);
                var texts = xmlDoc.getElementsByTagName("text");
                for (var i = 0; i < texts.length; ++i) {
                    var key = texts[i].id;
                    var value = texts[i].innerHTML.replace(/^\s*\<\!\[CDATA\[([\s\S]*?)\]\]\>\s*$/i, "$1");
                    tempModule.items[key] = value;
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
                    tempModule.items[key] = value;
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
            Localization.modules = {};
            return Localization;
        }());
        util.Localization = Localization;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
kr3m.util.Tokenizer.setFormatter("loc", kr3m.util.Localization.get);
kr3m.util.Tokenizer.setFormatter("date", kr3m.util.Localization.getFormattedDate.bind(null, kr3m.FORMAT_DATE));
kr3m.util.Tokenizer.setFormatter("time", kr3m.util.Localization.getFormattedDate.bind(null, kr3m.FORMAT_TIME));
kr3m.util.Tokenizer.setFormatter("dateTime", kr3m.util.Localization.getFormattedDate.bind(null, kr3m.FORMAT_DATETIME));
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
var kr3m;
(function (kr3m) {
    var app;
    (function (app) {
        var Application = (function () {
            function Application() {
                this.lastIsPortrait = null;
                this.lastWindowWidth = -1;
                this.lastWindowHeight = -1;
                this.delayed = new kr3m.async.Delayed();
            }
            Application.prototype.callDelayed = function (callback) {
                this.delayed.call(callback);
            };
            Application.prototype.getProtocol = function () {
                var matchResult = this.config.appUrl.match(/.+:\/\//);
                if (matchResult)
                    return matchResult[0];
                else
                    return window.location.protocol + "//";
            };
            Application.prototype.checkConfigDefaults = function () {
                this.config.appUrl = this.config.appUrl || window.location.href;
                if (this.config.appUrl.substr(this.config.appUrl.length - 1) == '/')
                    this.config.appUrl = this.config.appUrl.substr(0, this.config.appUrl.length - 1);
                this.config.domQuery = this.config.domQuery || "#kr3m";
            };
            Application.prototype.getUserLanguage = function () {
                if (location.search && location.search != "") {
                    var params = kr3m.util.StringEx.splitAssoc(location.search.substr(1));
                    if (typeof params.lang != "undefined")
                        return params.lang;
                }
                var browserLanguages = kr3m.util.Browser.getLanguagePreferences();
                for (var i = 0; i < browserLanguages.length; ++i) {
                    if (kr3m.util.Util.contains(this.config.supportedLanguages, browserLanguages[i]))
                        return browserLanguages[i];
                }
                return this.config.fallbackLanguage;
            };
            Application.prototype.getUserCountry = function () {
                if (location.search && location.search != "") {
                    var params = kr3m.util.StringEx.splitAssoc(location.search.substr(1));
                    if (typeof params.country != "undefined")
                        return params.country;
                }
                var browserCountries = kr3m.util.Browser.getCountryPreferences();
                if (browserCountries.length > 0)
                    return browserCountries[0];
                return "DE";
            };
            Application.prototype.initLocalization = function () {
                var c = this.config;
                if (!c.supportedLanguages) {
                    c.supportedLanguages = [];
                    if (c.language
                        && c.language.length == 2)
                        c.supportedLanguages.push(c.language);
                    if (c.fallbackLanguage
                        && c.fallbackLanguage.length == 2
                        && c.fallbackLanguage != c.language)
                        c.supportedLanguages.push(c.fallbackLanguage);
                    if (c.supportedLanguages.length == 0)
                        c.supportedLanguages.push("de");
                }
                if (c.supportedLanguages.length == 0)
                    kr3m.util.Log.logError("supportedLanguages is empty");
                if (!c.language)
                    c.language = "auto";
                if (c.language != "auto" && !kr3m.util.Util.contains(c.supportedLanguages, c.language))
                    kr3m.util.Log.logDebug("supportedLanguages", c.supportedLanguages, "doesn't contain language", c.language);
                if (!c.fallbackLanguage) {
                    if (kr3m.util.Util.contains(c.supportedLanguages, "en"))
                        c.fallbackLanguage = "en";
                    else
                        c.fallbackLanguage = c.supportedLanguages[0];
                }
                if (!kr3m.util.Util.contains(c.supportedLanguages, c.fallbackLanguage))
                    kr3m.util.Log.logDebug("supportedLanguages", c.supportedLanguages, "doesn't contain fallbackLanguage", c.fallbackLanguage);
                c.localizationPath = c.localizationPath || "xml";
                c.localizationFileExtension = c.localizationFileExtension || "xml";
                if (c.language == "auto")
                    c.language = this.getUserLanguage();
                if (c.country == "auto")
                    c.country = this.getUserCountry();
                if (!kr3m.util.Util.contains(c.supportedLanguages, c.language))
                    c.language = c.fallbackLanguage;
                var loca = kr3m.util.Localization;
                loca.country = c.country || "DE";
                loca.fallback = c.fallbackLanguage;
                loca.language = c.language;
            };
            Application.prototype.run = function (config) {
                this.config = config;
                this.checkConfigDefaults();
                this.base = new kr3m.ui.Element(this, this.config.domQuery);
                if (this.base.dom.get().length == 0) {
                    kr3m.util.Log.logError("domQuery was given but dom element", this.config.domQuery, "was not found");
                    return;
                }
                this.base.dom.empty();
                this.initLocalization();
                this.preload();
            };
            Application.prototype.removeFromStage = function () {
                this.base.removeAllChildren(true);
            };
            Application.prototype.loadLocalizationFiles = function (callback) {
                var loca = kr3m.util.Localization;
                var join = new kr3m.async.Join();
                if (this.config.localizationFileExtension == "xml") {
                    loca.addXMLModuleFromUrl(this.config.localizationPath + "/lang_" + loca.language + ".xml", loca.language, join.getCallback());
                    if (this.config.language != loca.fallback)
                        loca.addXMLModuleFromUrl(this.config.localizationPath + "/lang_" + loca.fallback + ".xml", loca.fallback, join.getCallback());
                }
                else if (this.config.localizationFileExtension == "json") {
                    loca.addJSONModuleFromUrl(this.config.localizationPath + "/lang_" + loca.language + ".json", loca.language, join.getCallback());
                    if (this.config.language != loca.fallback)
                        loca.addJSONModuleFromUrl(this.config.localizationPath + "/lang_" + loca.fallback + ".json", loca.fallback, join.getCallback());
                }
                join.addCallback(callback);
            };
            Application.prototype.preload = function () {
                var _this = this;
                this.loadLocalizationFiles(function () {
                    var onCheckWindowSize = _this.checkWindowSize.bind(_this);
                    setInterval(onCheckWindowSize, 200);
                    window.addEventListener("resize", onCheckWindowSize);
                    if (!getDevice().desktop)
                        window.addEventListener("orientationchange", onCheckWindowSize);
                    _this.delayed.execute();
                    _this.onPreloaded();
                });
            };
            Application.prototype.onPreloaded = function () {
            };
            Application.prototype.getParentIFrameWindow = function () {
                if (window.parent)
                    return window.parent;
                return null;
            };
            Application.prototype.isRunningInIFrame = function () {
                return window.self !== window.top;
            };
            Application.prototype.checkWindowSize = function (forceUpdate) {
                if (forceUpdate === void 0) { forceUpdate = false; }
                var win = $(window);
                var width = win.width();
                var height = win.height();
                var isPortrait = width < height;
                if (forceUpdate || this.lastWindowWidth != width || this.lastWindowHeight != height) {
                    this.onSize(width, height);
                    this.lastWindowWidth = width;
                    this.lastWindowHeight = height;
                }
                if (forceUpdate || this.lastIsPortrait === null || this.lastIsPortrait != isPortrait) {
                    this.onOrientation(isPortrait);
                    this.lastIsPortrait = isPortrait;
                }
            };
            Application.prototype.onSize = function (width, height) {
                this.base.onSize(width, height);
            };
            Application.prototype.onOrientation = function (isPortrait) {
                this.base.onOrientation(isPortrait);
            };
            Application.prototype.getCurrentDeepLink = function () {
                return this.config.appUrl;
            };
            Application.prototype.getShareText = function () {
                return kr3m.util.Localization.get("SMB_SHARE");
            };
            Application.prototype.getShareTitle = function () {
                return kr3m.util.Localization.get("SMB_SHARE_TITLE");
            };
            Application.prototype.getShareUrl = function () {
                return this.config.appUrl;
            };
            Application.prototype.countUserAction = function () {
            };
            Application.prototype.getImageUrl = function () {
                return "img/";
            };
            return Application;
        }());
        app.Application = Application;
    })(app = kr3m.app || (kr3m.app = {}));
})(kr3m || (kr3m = {}));
var omni;
(function (omni) {
    omni.VERSION = "1.0.2.33";
})(omni || (omni = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var FormButton = (function (_super) {
            __extends(FormButton, _super);
            function FormButton(parent, caption, handler) {
                var _this = _super.call(this, parent, null, "button") || this;
                _this.callOnStage(function () {
                    if (caption)
                        _this.setText(caption);
                    _this.handler = handler;
                    _this.on("click", function () {
                        if (_this.handler && _this.isEnabled())
                            _this.handler();
                    });
                });
                return _this;
            }
            FormButton.prototype.setText = function (text) {
                this.dom.text(text);
            };
            FormButton.prototype.setClickHandler = function (handler) {
                this.handler = handler;
            };
            return FormButton;
        }(kr3m.ui.Element));
        ui.FormButton = FormButton;
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var omni;
(function (omni) {
    var ui;
    (function (ui) {
        var CloseButton = (function (_super) {
            __extends(CloseButton, _super);
            function CloseButton(parent, clickListener) {
                var _this = _super.call(this, parent, "X", clickListener) || this;
                _this.addClass("closeButton");
                return _this;
            }
            return CloseButton;
        }(kr3m.ui.FormButton));
        ui.CloseButton = CloseButton;
    })(ui = omni.ui || (omni.ui = {}));
})(omni || (omni = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var Anchor = (function (_super) {
            __extends(Anchor, _super);
            function Anchor(parent, caption, url, attributes) {
                var _this = this;
                attributes = attributes || {};
                attributes.href = url ? url : "";
                _this = _super.call(this, parent, null, "a", attributes) || this;
                if (caption)
                    _this.setInnerHtml(caption);
                return _this;
            }
            Anchor.prototype.select = function () {
                this.addClass("selected");
            };
            Anchor.prototype.deselect = function () {
                this.removeClass("selected");
            };
            Anchor.prototype.setSelected = function (selected) {
                if (selected)
                    this.select();
                else
                    this.deselect();
            };
            Anchor.prototype.setTarget = function (target) {
                this.setAttribute("target", target);
            };
            Anchor.prototype.setUrl = function (url) {
                this.setAttribute("href", url);
            };
            return Anchor;
        }(kr3m.ui.Element));
        ui.Anchor = Anchor;
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var omni;
(function (omni) {
    var ui;
    (function (ui) {
        var DownloadButton = (function (_super) {
            __extends(DownloadButton, _super);
            function DownloadButton(parent, fileName, url) {
                var _this = _super.call(this, parent, fileName, url) || this;
                _this.addClass("downloadButton");
                _this.setAttribute("download", fileName);
                return _this;
            }
            return DownloadButton;
        }(kr3m.ui.Anchor));
        ui.DownloadButton = DownloadButton;
    })(ui = omni.ui || (omni.ui = {}));
})(omni || (omni = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var ScreenManager = (function (_super) {
            __extends(ScreenManager, _super);
            function ScreenManager(parent, className) {
                if (className === void 0) { className = "screenManager"; }
                var _this = _super.call(this, parent, null, "div", { "class": className }) || this;
                _this.history = [];
                _this.changeListeners = [];
                _this.subManagers = [];
                _this.maxHistorySize = 20;
                return _this;
            }
            ScreenManager.prototype.addChild = function (child) {
                if (child instanceof kr3m.ui.Screen) {
                    var childName = child.getName();
                    for (var i = 0; i < this.children.length; ++i) {
                        if (this.children[i] instanceof kr3m.ui.Screen) {
                            if (childName == this.children[i].getName()) {
                                kr3m.util.Log.logError("Warning: screen with name " + childName + " already exists");
                            }
                        }
                    }
                }
                _super.prototype.addChild.call(this, child);
                if (child instanceof kr3m.ui.Screen)
                    child.hide();
            };
            ScreenManager.prototype.onAddedToStage = function () {
                _super.prototype.onAddedToStage.call(this);
                var parentManager = this.getParentOfClass(kr3m.ui.ScreenManager);
                if (parentManager)
                    parentManager.subManagers.push(this);
            };
            ScreenManager.prototype.onRemovedFromStage = function () {
                var parentManager = this.getParentOfClass(kr3m.ui.ScreenManager);
                if (parentManager)
                    kr3m.util.Util.remove(parentManager.subManagers, this);
                _super.prototype.onRemovedFromStage.call(this);
            };
            ScreenManager.prototype.allScreensAdded = function () {
                kr3m.util.Log.log("ScreenManager.allScreensAdded is deprecated and obsolete");
            };
            ScreenManager.prototype.getScreenNames = function () {
                var result = [];
                for (var i = 0; i < this.children.length; ++i) {
                    if (this.children[i] instanceof kr3m.ui.Screen) {
                        var childScreen = this.children[i];
                        result.push(childScreen.getName());
                    }
                }
                return result;
            };
            ScreenManager.prototype.updateHistory = function () {
                if (this.currentScreen) {
                    this.history.push(this.currentScreen);
                    while (this.history.length > this.maxHistorySize)
                        this.history.shift();
                }
            };
            ScreenManager.prototype.showFirstScreen = function () {
                if (this.children.length > 0)
                    this.showScreen(this.children[0]);
            };
            ScreenManager.prototype.getFirstScreen = function () {
                if (this.children.length > 0)
                    return this.children[0];
                return null;
            };
            ScreenManager.prototype.showPreviousScreen = function () {
                if (this.history.length > 0) {
                    this.showScreen(this.history.pop());
                    this.history.pop();
                }
            };
            ScreenManager.prototype.getPreviousScreen = function () {
                if (this.history.length > 0)
                    return this.history[this.history.length - 1];
                else
                    return null;
            };
            ScreenManager.prototype.popPreviousScreen = function () {
                if (this.history.length > 0)
                    return this.history.pop();
                else
                    return null;
            };
            ScreenManager.prototype.showScreen = function (screen, data) {
                if (data === void 0) { data = null; }
                if (this.currentScreen && this.currentScreen == screen) {
                    this.currentScreen.onRefresh(data);
                    return;
                }
                if (this.currentScreen)
                    this.currentScreen.hide();
                var found = false;
                for (var i = 0; i < this.children.length; ++i) {
                    var child = this.children[i];
                    if (child == screen) {
                        this.updateHistory();
                        this.currentScreen = child;
                        this.currentScreen.show();
                        this.currentScreen.onRefresh(data);
                        found = true;
                        break;
                    }
                }
                if (!found)
                    kr3m.util.Log.logError("screen " + screen.getName() + " not found");
                else
                    this.notifyChangeListeners();
            };
            ScreenManager.prototype.removeAllChildren = function (removeHtmlToo) {
                if (removeHtmlToo === void 0) { removeHtmlToo = true; }
                this.currentScreen = null;
                _super.prototype.removeAllChildren.call(this, removeHtmlToo);
            };
            ScreenManager.prototype.showScreenByName = function (screenName, data) {
                if (data === void 0) { data = null; }
                var screen = this.getScreenByName(screenName);
                if (screen)
                    this.showScreen(screen, data);
                else
                    kr3m.util.Log.logError("screen " + screenName + " not found");
            };
            ScreenManager.prototype.showScreenRecursive = function (screenName, data) {
                if (data === void 0) { data = null; }
                if (this.currentScreen && this.currentScreen.getName() == screenName)
                    return;
                var pos = this.findPositionOfScreen(screenName);
                if (pos.length > 0) {
                    this.showPosition(pos, data);
                }
            };
            ScreenManager.prototype.getParentScreenName = function () {
                var screen = this.getParentOfClass(kr3m.ui.Screen);
                return screen ? screen.getName() : null;
            };
            ScreenManager.prototype.getSubManagerByScreenName = function (screenName) {
                for (var i = 0; i < this.subManagers.length; ++i)
                    if (this.subManagers[i].getParentScreenName() == screenName)
                        return this.subManagers[i];
                return null;
            };
            ScreenManager.prototype.getCurrentPosition = function () {
                var pos = [];
                var temp = this.getRootOfClass(kr3m.ui.ScreenManager) || this;
                while (temp) {
                    var screen = temp.getCurrentScreen();
                    if (!screen)
                        break;
                    var name = screen.getName();
                    pos.push(name);
                    temp = this.getSubManagerByScreenName(name);
                }
                return pos;
            };
            ScreenManager.prototype.findPositionOfScreen = function (screenName) {
                var pos = [];
                var root = this.getRootOfClass(kr3m.ui.ScreenManager) || this;
                var workset = [root];
                while (workset.length > 0) {
                    var temp = workset.shift();
                    if (temp.hasScreenWithName(screenName)) {
                        pos.unshift(screenName);
                        while (temp) {
                            var screenName = temp.getParentScreenName();
                            if (!screenName)
                                break;
                            pos.unshift(screenName);
                            temp = temp.getParentOfClass(kr3m.ui.ScreenManager);
                        }
                    }
                    else {
                        workset = workset.concat(temp.subManagers);
                    }
                }
                return pos;
            };
            ScreenManager.prototype.showPosition = function (position, data) {
                if (data === void 0) { data = null; }
                var temp = this.getRootOfClass(kr3m.ui.ScreenManager) || this;
                while (temp && position.length > 0) {
                    var screenName = position.shift();
                    var isLast = position.length == 0;
                    temp.showScreenByName(screenName, isLast ? data : null);
                    temp = temp.getSubManagerByScreenName(screenName);
                }
            };
            ScreenManager.prototype.hasScreenWithName = function (name) {
                return this.getScreenByName(name) != null;
            };
            ScreenManager.prototype.getScreenByName = function (name) {
                for (var i = 0; i < this.children.length; ++i) {
                    var child = this.children[i];
                    if (child instanceof kr3m.ui.Screen) {
                        var childScreen = child;
                        if (childScreen.getName() == name)
                            return childScreen;
                    }
                }
                return null;
            };
            ScreenManager.prototype.getScreenByNameRecursive = function (name) {
                var pos = this.findPositionOfScreen(name);
                if (pos.length == 0)
                    return null;
                var temp = this.getRootOfClass(kr3m.ui.ScreenManager) || this;
                while (temp && pos.length > 0) {
                    var screenName = pos.shift();
                    if (pos.length == 0)
                        return temp.getScreenByName(screenName);
                    temp = temp.getSubManagerByScreenName(screenName);
                }
                return null;
            };
            ScreenManager.prototype.getCurrentScreen = function () {
                return this.currentScreen;
            };
            ScreenManager.prototype.getCurrentScreenName = function () {
                return this.currentScreen ? this.currentScreen.getName() : null;
            };
            ScreenManager.prototype.removeChild = function (child) {
                _super.prototype.removeChild.call(this, child);
                for (var i = 0; i < this.history.length; ++i) {
                    if (this.history[i] == child) {
                        this.history.splice(i, 1);
                        --i;
                    }
                }
            };
            ScreenManager.prototype.addChangeListener = function (listener) {
                this.changeListeners.push(listener);
            };
            ScreenManager.prototype.notifyChangeListeners = function () {
                if (!this.currentScreen)
                    return;
                var screenName = this.currentScreen.getName();
                for (var i = 0; i < this.changeListeners.length; ++i)
                    this.changeListeners[i](screenName);
            };
            return ScreenManager;
        }(kr3m.ui.Element));
        ui.ScreenManager = ScreenManager;
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var Screen = (function (_super) {
            __extends(Screen, _super);
            function Screen(parent, name, attributes) {
                if (attributes === void 0) { attributes = { "class": "screen" }; }
                var _this = _super.call(this, parent, null, "div", attributes) || this;
                _this.firstTransition = true;
                _this.name = name;
                return _this;
            }
            Screen.prototype.getTrackingPart = function () {
                return this.name;
            };
            Screen.prototype.getName = function () {
                return this.name;
            };
            Screen.prototype.setName = function (name) {
                this.name = name;
            };
            Screen.prototype.show = function () {
                if (this.firstTransition) {
                    this.dom.show();
                    this.firstTransition = false;
                }
                else {
                    this.transitionIn();
                }
            };
            Screen.prototype.transitionIn = function () {
                this.dom.show();
                this.onTransitionInComplete();
            };
            Screen.prototype.onTransitionInComplete = function () {
            };
            Screen.prototype.hide = function () {
                if (this.firstTransition) {
                    this.dom.hide();
                    this.firstTransition = false;
                }
                else {
                    if (this.isVisible())
                        this.transitionOut();
                    else
                        this.dom.hide();
                }
            };
            Screen.prototype.transitionOut = function () {
                this.dom.hide();
                this.onTransitionOutComplete();
            };
            Screen.prototype.onTransitionOutComplete = function () {
            };
            Screen.prototype.getManager = function () {
                return this.parent;
            };
            Screen.prototype.onRefresh = function (data) {
                if (data === void 0) { data = null; }
            };
            Screen.prototype.showScreen = function (screenName, data) {
                if (data === void 0) { data = null; }
                var manager = this.getManager();
                if (manager)
                    manager.showScreenRecursive(screenName, data);
            };
            return Screen;
        }(kr3m.ui.Element));
        ui.Screen = Screen;
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var omni;
(function (omni) {
    var AbstractScreen = (function (_super) {
        __extends(AbstractScreen, _super);
        function AbstractScreen(manager, name) {
            var _this = _super.call(this, manager, name) || this;
            _this.downloadUrls = [];
            _this.hotkeyListeners = {};
            _this.fileName = "download";
            _this.clickBlocker = new kr3m.ui.Element(_this);
            _this.clickBlocker.addClass("clickBlocker");
            _this.clickBlocker.hide();
            _this.downloadButtons = new kr3m.ui.Element(_this);
            _this.downloadButtons.addClass("downloadButtons");
            _this.downloadButtons.hide();
            $(window.document.body).on("keydown", _this.onKeyDown.bind(_this));
            return _this;
        }
        AbstractScreen.prototype.setFileName = function (name) {
            document.title = name;
            this.fileName = kr3m.util.StringEx.getBefore(name, ".", false);
        };
        AbstractScreen.prototype.onKeyDown = function (evt) {
            if (!this.isVisible())
                return true;
            if (this.popupElement) {
                if (evt.keyCode == 27) {
                    this.closeAsPopup(this.popupElement);
                    return false;
                }
            }
            if (!evt.ctrlKey)
                return true;
            var listeners = this.hotkeyListeners[evt.key];
            if (!listeners)
                return true;
            for (var i = 0; i < listeners.length; ++i)
                listeners[i]();
            return false;
        };
        AbstractScreen.prototype.onHotkey = function (key, listener) {
            var listeners = this.hotkeyListeners[key];
            if (!listeners) {
                listeners = [];
                this.hotkeyListeners[key] = listeners;
            }
            listeners.push(listener);
        };
        AbstractScreen.prototype.showAsPopup = function (element) {
            if (this.popupElement)
                return;
            this.popupElement = element;
            this.clickBlocker.show();
            element.show();
            setTimeout(function () {
                var width = element.getWidth();
                var height = element.getHeight();
                var winWidth = $(window).width();
                var winHeight = $(window).height();
                var x = Math.floor((winWidth - width) / 2);
                var y = Math.floor((winHeight - height) / 2);
                element.css({ position: "fixed", top: y, left: x });
            }, 1);
        };
        AbstractScreen.prototype.closeAsPopup = function (element) {
            if (this.popupElement != element)
                return;
            element.hide();
            this.clickBlocker.hide();
            this.popupElement = null;
        };
        AbstractScreen.prototype.handleDroppedFiles = function (files) {
        };
        AbstractScreen.prototype.clearDownloads = function () {
            var _this = this;
            this.downloadButtons.removeAllChildren();
            new omni.ui.CloseButton(this.downloadButtons, function () { return _this.closeAsPopup(_this.downloadButtons); });
            for (var i = 0; i < this.downloadUrls.length; ++i)
                URL.revokeObjectURL(this.downloadUrls[i]);
            this.downloadUrls = [];
        };
        AbstractScreen.prototype.addDownloadUrl = function (fileName, url) {
            this.downloadUrls.push(url);
            new omni.ui.DownloadButton(this.downloadButtons, fileName, url);
            this.showAsPopup(this.downloadButtons);
        };
        AbstractScreen.prototype.addDownload = function (fileName, data, mimeType) {
            var blob = new Blob([data], { type: mimeType });
            var url = URL.createObjectURL(blob);
            this.addDownloadUrl(fileName, url);
        };
        return AbstractScreen;
    }(kr3m.ui.Screen));
    omni.AbstractScreen = AbstractScreen;
})(omni || (omni = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var Button = (function (_super) {
            __extends(Button, _super);
            function Button(parent, caption, className, handler) {
                if (caption === void 0) { caption = ""; }
                if (className === void 0) { className = ""; }
                if (handler === void 0) { handler = null; }
                var _this = _super.call(this, parent, null, "div", { tabindex: "0" }) || this;
                _this.callOnStage(function () {
                    if (caption != "")
                        _this.setHtml(caption);
                    if (className != "")
                        _this.addClass(className);
                    _this.handler = handler;
                    _this.on("click", function (event) {
                        if (_this.handler && _this.isEnabled())
                            _this.handler(event);
                    });
                    if (!_this.getAttribute("tabindex"))
                        _this.setAttribute("tabindex", "0");
                });
                return _this;
            }
            Button.prototype.setText = function (text) {
                this.dom.text(text);
            };
            Button.prototype.setHtml = function (html) {
                this.dom.html(html);
            };
            Button.prototype.select = function () {
                this.addClass("selected");
            };
            Button.prototype.deselect = function () {
                this.removeClass("selected");
            };
            Button.prototype.setSelected = function (selected) {
                if (selected)
                    this.select();
                else
                    this.deselect();
            };
            Button.prototype.isSelected = function () {
                return this.hasClass("selected");
            };
            Button.prototype.setClickHandler = function (handler) {
                this.handler = handler;
            };
            return Button;
        }(kr3m.ui.Element));
        ui.Button = Button;
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var ex;
        (function (ex) {
            var AutoCompletePopup = (function (_super) {
                __extends(AutoCompletePopup, _super);
                function AutoCompletePopup(parent, clickCallback, optionsUnescaped) {
                    if (optionsUnescaped === void 0) { optionsUnescaped = false; }
                    var _this = _super.call(this, null) || this;
                    _this.optionButtons = [];
                    _this.hideTimer = null;
                    _this.optionsUnescaped = false;
                    _this.clickCallback = clickCallback;
                    _this.optionsUnescaped = optionsUnescaped;
                    parent.dom.wrap("<span class='autoCompletePopupParent' style='position:relative; margin:0px; padding:0px;'></span>");
                    _this.dom.insertBefore(parent.dom);
                    _this.parent = parent;
                    _this.onAddedToStage();
                    _this.addClass("autoCompletePopup");
                    _this.setAttribute("tabindex", "0");
                    _this.dom.css({
                        "position": "absolute",
                        "z-index": 1000
                    });
                    parent.on("keydown", _this.onKeyDown.bind(_this));
                    parent.on("blur", _this.onBlur.bind(_this));
                    parent.on("focus", _this.onFocus.bind(_this));
                    _this.on("keydown", _this.onKeyDown.bind(_this));
                    _this.hide();
                    return _this;
                }
                AutoCompletePopup.prototype.onFocus = function () {
                    this.stopHideTimer();
                };
                AutoCompletePopup.prototype.onBlur = function () {
                    this.startHideTimer();
                };
                AutoCompletePopup.prototype.startHideTimer = function () {
                    var _this = this;
                    if (this.hideTimer === null) {
                        this.hideTimer = setTimeout(function () {
                            _this.hide();
                            _this.hideTimer = null;
                        }, 100);
                    }
                };
                AutoCompletePopup.prototype.stopHideTimer = function () {
                    if (this.hideTimer !== null) {
                        clearTimeout(this.hideTimer);
                        this.hideTimer = null;
                    }
                };
                AutoCompletePopup.prototype.onKeyDown = function (event) {
                    switch (event.key) {
                        case "Esc":
                            this.parent.focus();
                            this.hide();
                            event.preventDefault();
                            break;
                        case "Enter":
                            this.parent.focus();
                            this.hide();
                            event.preventDefault();
                            if (this.selected < this.optionButtons.length)
                                this.clickCallback(this.optionButtons[this.selected].dom.text());
                            break;
                        case "ArrowUp":
                        case "Up":
                            this.moveSelection(-1);
                            event.preventDefault();
                            break;
                        case "ArrowDown":
                        case "Down":
                            this.moveSelection(1);
                            event.preventDefault();
                            break;
                    }
                };
                AutoCompletePopup.prototype.moveSelection = function (delta) {
                    if (this.optionButtons.length == 0)
                        return;
                    if ((delta < 0) && (this.selected == 0))
                        return this.parent.focus();
                    this.selected = (this.selected + delta) % this.optionButtons.length;
                    for (var i = 0; i < this.optionButtons.length; ++i) {
                        if (i == this.selected) {
                            this.optionButtons[i].addClass("selected");
                            this.optionButtons[i].focus();
                        }
                        else {
                            this.optionButtons[i].removeClass("selected");
                        }
                    }
                };
                AutoCompletePopup.prototype.setOptions = function (options) {
                    this.removeAllChildren();
                    this.optionButtons = [];
                    this.selected = -1;
                    for (var i = 0; i < options.length; ++i) {
                        var button = new kr3m.ui.Button(this, options[i], "option", this.onClicked.bind(this, options[i]));
                        button.on("focus", this.onFocus.bind(this));
                        button.on("blur", this.onBlur.bind(this));
                        if (this.optionsUnescaped)
                            button.setText(options[i]);
                        this.optionButtons.push(button);
                    }
                    this.showOnClicked();
                };
                AutoCompletePopup.prototype.showOnClicked = function () {
                    if (this.optionButtons.length > 0)
                        this.show();
                    else
                        this.hide();
                };
                AutoCompletePopup.prototype.onClicked = function (option) {
                    this.hide();
                    this.parent.focus();
                    this.clickCallback(option);
                };
                return AutoCompletePopup;
            }(kr3m.ui.Element));
            ex.AutoCompletePopup = AutoCompletePopup;
        })(ex = ui.ex || (ui.ex = {}));
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var Editbox = (function (_super) {
            __extends(Editbox, _super);
            function Editbox(parent, className, flags) {
                if (className === void 0) { className = ""; }
                if (flags === void 0) { flags = []; }
                var _this = _super.call(this, parent, null, "input", { type: flags.indexOf(Editbox.FLAG_PASSWORD) >= 0 ? "password" : "text" }) || this;
                if (className)
                    _this.addClass(className);
                _this.callToActionText = "";
                _this.flags = flags;
                _this.filter = null;
                _this.changeListeners = [];
                _this.changeFunc = null;
                _this.oldText = "";
                return _this;
            }
            Editbox.prototype.onAddedToStage = function () {
                var _this = this;
                setTimeout(function () {
                    _super.prototype.onAddedToStage.call(_this);
                    if (_this.dom.attr("type") == "password" && !_this.hasFlag(Editbox.FLAG_PASSWORD))
                        _this.flags.push(Editbox.FLAG_PASSWORD);
                    if (_this.callToActionText == "") {
                        var placeholder = _this.dom.attr("placeholder");
                        if (placeholder && placeholder != "") {
                            _this.setCallToActionText(placeholder);
                            _this.dom.removeAttr("placeholder");
                        }
                    }
                    _this.dom.on("blur", _this.onFocusOut.bind(_this));
                    _this.dom.on("focus", _this.onFocusIn.bind(_this));
                    _this.checkState();
                    if (_this.changeListeners.length > 0)
                        _this.startChecking();
                    _this.updateChangeCheckStatus();
                });
            };
            Editbox.prototype.onRemovedFromStage = function () {
                this.dom.off("blur", this.onFocusOut.bind(this));
                this.dom.off("focus", this.onFocusIn.bind(this));
                _super.prototype.onRemovedFromStage.call(this);
                this.updateChangeCheckStatus();
            };
            Editbox.prototype.enableAutoComplete = function (searchFunc, showDropdownOnClick, optionsUnscaped) {
                var _this = this;
                if (showDropdownOnClick === void 0) { showDropdownOnClick = false; }
                if (optionsUnscaped === void 0) { optionsUnscaped = false; }
                if (!this.autoCompletePopup) {
                    this.autoCompletePopup = new kr3m.ui.ex.AutoCompletePopup(this, function (option) {
                        _this.lastACOption = option;
                        _this.setText(option);
                        if (_this.changeFunc)
                            _this.changeFunc(null);
                    }, optionsUnscaped);
                    this.lastACOption = this.getText();
                    this.addChangeListener(function (newValue) {
                        if (newValue == _this.lastACOption)
                            return;
                        _this.lastACOption = newValue;
                        searchFunc(newValue, _this.autoCompletePopup.setOptions.bind(_this.autoCompletePopup));
                    });
                    if (showDropdownOnClick)
                        this.on("click", function () { return _this.autoCompletePopup.showOnClicked(); });
                }
            };
            Editbox.prototype.turnIntoPasswordEdit = function () {
                if (this.dom.attr("type") == "password")
                    return;
                this.dom.attr("type", "password");
            };
            Editbox.prototype.turnIntoTextEdit = function () {
                if (this.dom.attr("type") == "text")
                    return;
                this.dom.attr("type", "text");
            };
            Editbox.prototype.removeFlag = function (flag) {
                for (var i = 0; i < this.flags.length; ++i) {
                    if (this.flags[i] == flag) {
                        this.flags.splice(i, 1);
                        break;
                    }
                }
                if (flag == Editbox.FLAG_PASSWORD && !this.callToActionVisible())
                    this.turnIntoTextEdit();
            };
            Editbox.prototype.addFlag = function (flag) {
                if (!this.hasFlag(flag)) {
                    this.flags.push(flag);
                    if (flag == Editbox.FLAG_PASSWORD && !this.callToActionVisible())
                        this.turnIntoPasswordEdit();
                }
            };
            Editbox.prototype.hasFlag = function (flag) {
                for (var i = 0; i < this.flags.length; ++i) {
                    if (this.flags[i] == flag)
                        return true;
                }
                return false;
            };
            Editbox.prototype.callToActionVisible = function () {
                return this.hasClass("callToAction");
            };
            Editbox.prototype.showCallToAction = function () {
                this.addClass("callToAction");
                this.dom.val(this.callToActionText);
                if (this.hasFlag(Editbox.FLAG_PASSWORD))
                    this.turnIntoTextEdit();
            };
            Editbox.prototype.hideCallToAction = function () {
                this.removeClass("callToAction");
                if (this.hasFlag(Editbox.FLAG_PASSWORD))
                    this.turnIntoPasswordEdit();
            };
            Editbox.prototype.checkState = function () {
                var text = this.dom.val();
                if (!this.hasFocus && (this.callToActionText != "" && (text == "" || text == this.callToActionText)))
                    this.showCallToAction();
                else
                    this.hideCallToAction();
            };
            Editbox.prototype.validate = function () {
                var text = this.getText();
                if (this.hasFlag(Editbox.FLAG_REQUIRED) && text == "")
                    return Editbox.ERROR_REQUIRED;
                if (!this.isEmpty() && this.hasFlag(Editbox.FLAG_EMAIL) && !kr3m.util.Validator.email(text))
                    return Editbox.ERROR_EMAIL;
                if (this.filter && !this.filter.test(text))
                    return Editbox.ERROR_FILTER;
                return _super.prototype.validate.call(this);
            };
            Editbox.prototype.onFocusIn = function () {
                this.hasFocus = true;
                if (this.callToActionVisible()) {
                    this.dom.val("");
                    this.hideCallToAction();
                }
            };
            Editbox.prototype.onFocusOut = function () {
                this.hasFocus = false;
                this.checkState();
            };
            Editbox.prototype.setText = function (text) {
                this.lastACOption = text;
                this.dom.val(text.toString());
                this.checkState();
            };
            Editbox.prototype.getText = function () {
                var text = this.dom.val();
                return (text != this.callToActionText) ? text : "";
            };
            Editbox.prototype.setMaxLength = function (value) {
                this.dom.attr("maxlength", value);
            };
            Editbox.prototype.isEmpty = function () {
                return this.getText() == "";
            };
            Editbox.prototype.setCallToActionText = function (text) {
                if (this.dom.val() == this.callToActionText)
                    this.dom.val(text);
                this.callToActionText = text;
                this.checkState();
            };
            Editbox.prototype.startChecking = function () {
                if (this.changeFunc)
                    return;
                this.changeFunc = this.checkForChange.bind(this);
                this.on("keydown", this.changeFunc);
                this.on("keyup", this.changeFunc);
            };
            Editbox.prototype.stopChecking = function () {
                if (!this.changeFunc)
                    return;
                this.off("keyup", this.changeFunc);
                this.off("keydown", this.changeFunc);
                this.changeFunc = null;
            };
            Editbox.prototype.checkForChange = function () {
                var text = this.getText();
                if (text != this.oldText) {
                    for (var i = 0; i < this.changeListeners.length; ++i)
                        this.changeListeners[i](text, this.oldText);
                    this.oldText = text;
                }
            };
            Editbox.prototype.updateChangeCheckStatus = function () {
                if (this.parent && this.changeListeners.length > 0) {
                    this.oldText = this.getText();
                    this.startChecking();
                }
                else {
                    this.stopChecking();
                }
            };
            Editbox.prototype.setFilter = function (filter) {
                this.filter = filter;
            };
            Editbox.prototype.disable = function () {
                this.addClass("disabled");
                this.setAttribute("disabled", "disabled");
            };
            Editbox.prototype.enable = function () {
                this.removeClass("disabled");
                this.removeAttribute("disabled");
            };
            Editbox.prototype.addChangeListener = function (listener) {
                if (!kr3m.util.Util.contains(this.changeListeners, listener)) {
                    this.changeListeners.push(listener);
                    this.updateChangeCheckStatus();
                }
            };
            Editbox.prototype.removeChangeListener = function (listener) {
                if (kr3m.util.Util.remove(this.changeListeners, listener))
                    this.updateChangeCheckStatus();
            };
            Editbox.prototype.removeChangeListeners = function () {
                this.changeListeners = [];
                this.updateChangeCheckStatus();
            };
            Editbox.prototype.resetVoValue = function () {
                this.setText("");
            };
            Editbox.prototype.getVoValue = function () {
                return this.getText();
            };
            Editbox.prototype.setVoValue = function (value) {
                this.setText(value);
            };
            Editbox.prototype.selectText = function () {
                this.dom.get(0).setSelectionRange(0, this.getText().length);
            };
            Editbox.prototype.deselectText = function () {
                this.dom.get(0).setSelectionRange(0, 0);
            };
            Editbox.prototype.copyToClipBoard = function () {
                var isVisible = this.isVisible();
                if (!isVisible)
                    this.show();
                this.dom.get(0).select();
                document.execCommand("copy");
                if (!isVisible)
                    this.hide();
            };
            Editbox.prototype.cutToClipBoard = function () {
                var isVisible = this.isVisible();
                if (!isVisible)
                    this.show();
                this.dom.get(0).select();
                document.execCommand("cut");
                if (!isVisible)
                    this.hide();
            };
            Editbox.prototype.pasteFromClipBoard = function () {
                var isVisible = this.isVisible();
                if (!isVisible)
                    this.show();
                this.dom.get(0).select();
                document.execCommand("paste");
                if (!isVisible)
                    this.hide();
            };
            Editbox.FLAG_REQUIRED = "REQUIRED";
            Editbox.FLAG_EMAIL = "EMAIL";
            Editbox.FLAG_PASSWORD = "PASSWORD";
            Editbox.ERROR_REQUIRED = "REQUIRED";
            Editbox.ERROR_EMAIL = "EMAIL";
            Editbox.ERROR_FILTER = "FILTER";
            return Editbox;
        }(kr3m.ui.Element));
        ui.Editbox = Editbox;
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var Cell = (function (_super) {
            __extends(Cell, _super);
            function Cell(parent, attributes) {
                if (attributes === void 0) { attributes = {}; }
                return _super.call(this, parent, null, 'td', attributes) || this;
            }
            Cell.prototype.setText = function (text) {
                this.dom.text(text);
            };
            Cell.prototype.getText = function () {
                return this.dom.text();
            };
            Cell.prototype.setHtml = function (html) {
                this.dom.html(html);
            };
            Cell.prototype.getHtml = function () {
                return this.dom.html();
            };
            return Cell;
        }(kr3m.ui.Element));
        ui.Cell = Cell;
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var CellHeader = (function (_super) {
            __extends(CellHeader, _super);
            function CellHeader(parent, caption, attributes) {
                if (attributes === void 0) { attributes = {}; }
                var _this = _super.call(this, parent, null, 'th', attributes) || this;
                _this.setHtml(caption);
                return _this;
            }
            CellHeader.prototype.setHtml = function (html) {
                this.dom.html(html);
            };
            CellHeader.prototype.getHtml = function () {
                return this.dom.html();
            };
            CellHeader.prototype.setText = function (text) {
                this.dom.text(text.toString());
            };
            CellHeader.prototype.getText = function () {
                return this.dom.text();
            };
            return CellHeader;
        }(kr3m.ui.Element));
        ui.CellHeader = CellHeader;
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var Row = (function (_super) {
            __extends(Row, _super);
            function Row(parent, attributes) {
                if (attributes === void 0) { attributes = {}; }
                return _super.call(this, parent, null, "tr", attributes) || this;
            }
            Row.prototype.addChild = function (child) {
                if (child instanceof kr3m.ui.Cell || child instanceof kr3m.ui.CellHeader) {
                    _super.prototype.addChild.call(this, child);
                }
                else {
                    var cell = new kr3m.ui.Cell(this);
                    cell.addChild(child);
                }
            };
            Row.prototype.removeChild = function (child) {
                if (child instanceof kr3m.ui.Cell || child instanceof kr3m.ui.CellHeader)
                    _super.prototype.removeChild.call(this, child);
                else
                    _super.prototype.removeChild.call(this, child.parent);
            };
            return Row;
        }(kr3m.ui.Element));
        ui.Row = Row;
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var Table = (function (_super) {
            __extends(Table, _super);
            function Table(parent, attributes) {
                if (attributes === void 0) { attributes = {}; }
                return _super.call(this, parent, null, "table", attributes) || this;
            }
            Table.prototype.addHeaders = function () {
                var values = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    values[_i] = arguments[_i];
                }
                var row = new kr3m.ui.Row(this);
                for (var i = 0; i < values.length; ++i)
                    new kr3m.ui.CellHeader(row, values[i] !== undefined ? values[i].toString() : "");
                return row;
            };
            Table.prototype.addEditableHeaders = function (captions, inputListener) {
                var row = new kr3m.ui.Row(this);
                for (var i = 0; i < captions.length; ++i) {
                    var cell = new kr3m.ui.CellHeader(row, "");
                    cell.setHtml(captions[i]);
                    cell.setAttribute("contentEditable", "true");
                    cell.on("input", inputListener.bind(null, i, cell));
                }
                return row;
            };
            Table.prototype.addRow = function () {
                var values = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    values[_i] = arguments[_i];
                }
                var y = this.children.length;
                var row = new kr3m.ui.Row(this, { "class": "row" + y });
                for (var i = 0; i < values.length; ++i) {
                    var cell = new kr3m.ui.Cell(row, { "class": "row" + y + " col" + i });
                    cell.setText(values[i] !== undefined ? values[i].toString() : "");
                }
                return row;
            };
            Table.prototype.addRowHtml = function () {
                var values = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    values[_i] = arguments[_i];
                }
                var y = this.children.length;
                var row = new kr3m.ui.Row(this, { "class": "row" + y });
                for (var i = 0; i < values.length; ++i) {
                    var cell = new kr3m.ui.Cell(row, { "class": "row" + y + " col" + i });
                    cell.setHtml(values[i] !== undefined ? values[i].toString() : "");
                }
                return row;
            };
            Table.prototype.addEditableRow = function (values, inputListener) {
                var y = this.children.length;
                var row = new kr3m.ui.Row(this, { "class": "row" + y });
                for (var i = 0; i < values.length; ++i) {
                    var cell = new kr3m.ui.Cell(row, { "class": "row" + y + " col" + i });
                    cell.setHtml(values[i] !== undefined ? values[i].toString() : "");
                    cell.setAttribute("contentEditable", "true");
                    cell.on("input", inputListener.bind(null, i, cell));
                }
                return row;
            };
            Table.prototype.getCell = function (col, row) {
                for (var i = 0; i < this.children.length; ++i) {
                    if (this.children[i] instanceof kr3m.ui.Row) {
                        if (row == 0) {
                            for (var j = 0; j < this.children[i].children.length; ++j) {
                                if (this.children[i].children[j] instanceof kr3m.ui.Cell) {
                                    if (col == 0) {
                                        return this.children[i].children[j];
                                    }
                                }
                                --col;
                            }
                        }
                        --row;
                    }
                }
                return null;
            };
            Table.prototype.getCellHeader = function (col, row) {
                for (var i = 0; i < this.children.length; ++i) {
                    if (this.children[i] instanceof kr3m.ui.Row) {
                        if (row == 0) {
                            for (var j = 0; j < this.children[i].children.length; ++j) {
                                if (this.children[i].children[j] instanceof kr3m.ui.CellHeader) {
                                    if (col == 0) {
                                        return this.children[i].children[j];
                                    }
                                }
                                --col;
                            }
                        }
                        --row;
                    }
                }
                return null;
            };
            Table.prototype.setData = function (data, firstRowIsHeader) {
                if (firstRowIsHeader === void 0) { firstRowIsHeader = false; }
                this.removeAllChildren();
                this.dom.empty();
                if (data.length == 0)
                    return;
                var y = 0;
                if (firstRowIsHeader) {
                    var row = new kr3m.ui.Row(this, { "class": "row" + y });
                    var x = 0;
                    for (var key in data[y]) {
                        new kr3m.ui.CellHeader(row, data[y][key], { "class": "row" + y + " col" + x });
                        ++x;
                    }
                    ++y;
                }
                for (; y < data.length; ++y) {
                    var row = new kr3m.ui.Row(this, { "class": "row" + y });
                    var x = 0;
                    for (var key in data[y]) {
                        var cell = new kr3m.ui.Cell(row, { "class": "row" + y + " col" + x });
                        cell.setText(data[y][key]);
                        ++x;
                    }
                }
            };
            Table.prototype.setDimensions = function (cols, rows, fillHtml) {
                this.removeAllChildren();
                this.dom.empty();
                for (var y = 0; y < rows; ++y) {
                    var row = new kr3m.ui.Row(this, { "class": "row" + y });
                    for (var x = 0; x < cols; ++x) {
                        var cell = new kr3m.ui.Cell(row, { "class": "row" + y + " col" + x });
                        if (fillHtml)
                            cell.setInnerHtml(fillHtml);
                    }
                }
            };
            Table.prototype.setCellHtml = function (col, row, html) {
                this.dom.find(".row" + row + " .col" + col).html(html);
            };
            return Table;
        }(kr3m.ui.Element));
        ui.Table = Table;
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var omni;
(function (omni) {
    var widgets;
    (function (widgets) {
        var PropertySet = (function (_super) {
            __extends(PropertySet, _super);
            function PropertySet(parent) {
                var _this = _super.call(this, parent) || this;
                _this.editBoxesById = {};
                _this.addClass("propertySet");
                _this.table = new kr3m.ui.Table(_this);
                return _this;
            }
            PropertySet.prototype.add = function (id, captionId) {
                var row = new kr3m.ui.Row(this);
                var cell = new kr3m.ui.Cell(row);
                cell.setText(loc(captionId));
                cell = new kr3m.ui.Cell(row);
                this.editBoxesById[id] = new kr3m.ui.Editbox(cell);
            };
            PropertySet.prototype.setProperties = function (props) {
                for (var id in props) {
                    if (this.editBoxesById[id])
                        this.editBoxesById[id].setText(props[id]);
                }
            };
            PropertySet.prototype.getProperties = function () {
                var props = {};
                for (var id in this.editBoxesById)
                    props[id] = this.editBoxesById[id].getText();
                return props;
            };
            return PropertySet;
        }(kr3m.ui.Element));
        widgets.PropertySet = PropertySet;
    })(widgets = omni.widgets || (omni.widgets = {}));
})(omni || (omni = {}));
var kr3m;
(function (kr3m) {
    var math;
    (function (math) {
        math.RAD_2_DEG = 180 / Math.PI;
        math.DEG_2_RAD = Math.PI / 180;
        math.EPSILON = 1 / 1000000;
        function interpolate(f, a, b) {
            return f * b + (1 - f) * a;
        }
        math.interpolate = interpolate;
        function clamp(value, min, max) {
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = 1; }
            return Math.min(max, Math.max(value, min));
        }
        math.clamp = clamp;
        function sign(value) {
            return value < 0 ? -1 : value > 0 ? 1 : 0;
        }
        math.sign = sign;
    })(math = kr3m.math || (kr3m.math = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var math;
    (function (math) {
        var Matrix = (function () {
            function Matrix(m, n) {
                this.v = [];
                this.m = m;
                this.n = n;
                for (var i = n * m; i > 0; --i)
                    this.v.push(0);
            }
            Matrix.prototype.setIdentity = function () {
                for (var x = 0; x < this.m; ++x)
                    for (var y = 0; y < this.n; ++y)
                        this.v[y * this.m + x] = (x == y) ? 1 : 0;
            };
            Matrix.prototype.copyFrom = function (m) {
                if (this.m != m.m || this.n != m.n)
                    throw new Error("matrix dimensions do not match: " + this.m + "x" + this.n + " != " + m.m + "x" + m.n);
                for (var i = 0; i < this.v.length; ++i)
                    this.v[i] = m.v[i];
            };
            Matrix.prototype.cwCalled = function (func) {
                var m = new Matrix(this.m, this.n);
                m.v = this.v.map(func);
                return m;
            };
            Matrix.prototype.concat = function (m) {
                var c = this.concated(m);
                this.v = c.v;
            };
            Matrix.prototype.transposed = function () {
                var r = new Matrix(this.n, this.m);
                for (var x = 0; x < this.m; ++x)
                    for (var y = 0; y < this.n; ++y)
                        r.v[x * this.n + y] = this.v[y * this.m + x];
                return r;
            };
            Matrix.prototype.plus = function (m) {
                if (this.m != m.m || this.n != m.n)
                    throw new Error("matrix dimensions do not match: " + this.m + "x" + this.n + " != " + m.m + "x" + m.n);
                var r = new Matrix(this.m, this.n);
                for (var i = 0; i < this.v.length; ++i)
                    r.v[i] = this.v[i] + m.v[i];
                return r;
            };
            Matrix.prototype.add = function (m) {
                if (this.m != m.m || this.n != m.n)
                    throw new Error("matrix dimensions do not match: " + this.m + "x" + this.n + " != " + m.m + "x" + m.n);
                for (var i = 0; i < this.v.length; ++i)
                    this.v[i] += m.v[i];
            };
            Matrix.prototype.minus = function (m) {
                if (this.m != m.m || this.n != m.n)
                    throw new Error("matrix dimensions do not match: " + this.m + "x" + this.n + " != " + m.m + "x" + m.n);
                var r = new Matrix(this.m, this.n);
                for (var i = 0; i < this.v.length; ++i)
                    r.v[i] = this.v[i] - m.v[i];
                return r;
            };
            Matrix.prototype.times = function (m) {
                if (this.m != m.m || this.n != m.n)
                    throw new Error("matrix dimensions do not match: " + this.m + "x" + this.n + " != " + m.m + "x" + m.n);
                var r = new Matrix(this.m, this.n);
                for (var i = 0; i < this.v.length; ++i)
                    r.v[i] = this.v[i] * m.v[i];
                return r;
            };
            Matrix.prototype.scaled = function (factor) {
                var r = new Matrix(this.m, this.n);
                for (var i = 0; i < this.v.length; ++i)
                    r.v[i] = this.v[i] * factor;
                return r;
            };
            Matrix.prototype.concated = function (m) {
                if (this.n != m.m)
                    throw new Error("matrix dimensions do not match: " + this.m + "x" + this.n + " can't be concated with " + m.m + "x" + m.n);
                var c = new Matrix(this.m, m.n);
                for (var i = 0; i < this.m; ++i) {
                    for (var j = 0; j < m.n; ++j) {
                        var index = j * c.m + i;
                        c.v[index] = 0;
                        for (var k = 0; k < this.n; ++k)
                            c.v[index] += this.v[k * this.m + i] * m.v[j * m.m + k];
                    }
                }
                return c;
            };
            Matrix.prototype.loadArray = function (values) {
                if (values.length != this.v.length)
                    throw new Error("loadArray values length doesn't match internal matrix v length");
                for (var i = 0; i < values.length; ++i)
                    this.v[i] = values[i];
            };
            Matrix.prototype.toArray = function () {
                return this.v.slice();
            };
            Matrix.prototype.getDump = function () {
                var output = "\n";
                for (var i = 0; i < this.m; ++i) {
                    var line = "|";
                    for (var j = 0; j < this.n; ++j) {
                        line += "\t" + this.v[j * this.m + i];
                    }
                    line += "\t|\n";
                    output += line;
                }
                return output;
            };
            return Matrix;
        }());
        math.Matrix = Matrix;
    })(math = kr3m.math || (kr3m.math = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var math;
    (function (math) {
        var Vector2d = (function () {
            function Vector2d(x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                this.x = x;
                this.y = y;
            }
            Vector2d.prototype.isZero = function () {
                return !(this.x || this.y);
            };
            Vector2d.prototype.clone = function () {
                return new Vector2d(this.x, this.y);
            };
            Vector2d.prototype.add = function (v) {
                this.x += v.x;
                this.y += v.y;
            };
            Vector2d.prototype.accumulate = function (v) {
                this.add(v);
            };
            Vector2d.prototype.plus = function (v) {
                return new Vector2d(this.x + v.x, this.y + v.y);
            };
            Vector2d.prototype.subtract = function (v) {
                this.x -= v.x;
                this.y -= v.y;
            };
            Vector2d.prototype.minus = function (v) {
                return new Vector2d(this.x - v.x, this.y - v.y);
            };
            Vector2d.prototype.scale = function (f) {
                this.x *= f;
                this.y *= f;
            };
            Vector2d.prototype.scaled = function (f) {
                return new Vector2d(this.x * f, this.y * f);
            };
            Vector2d.prototype.normalize = function () {
                var l = this.length();
                if (l != 0) {
                    this.x /= l;
                    this.y /= l;
                }
            };
            Vector2d.prototype.normalized = function () {
                var l = this.length();
                if (l != 0)
                    return new Vector2d(this.x / l, this.y / l);
                else
                    return new Vector2d(0, 0);
            };
            Vector2d.prototype.rotationAngle = function () {
                return Math.atan2(this.y, this.x) * math.RAD_2_DEG;
            };
            Vector2d.prototype.rotate = function (angle) {
                angle *= math.DEG_2_RAD;
                var s = Math.sin(angle);
                var c = Math.cos(angle);
                var x = c * this.x - s * this.y;
                this.y = s * this.x + c * this.y;
                this.x = x;
            };
            Vector2d.prototype.rotated = function (angle) {
                angle *= math.DEG_2_RAD;
                var s = Math.sin(angle);
                var c = Math.cos(angle);
                var x = c * this.x - s * this.y;
                var y = s * this.x + c * this.y;
                return new Vector2d(x, y);
            };
            Vector2d.prototype.ortho = function (cw) {
                if (cw === void 0) { cw = true; }
                return cw ? new Vector2d(-this.y, this.x) : new Vector2d(this.y, -this.x);
            };
            Vector2d.prototype.length = function () {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            };
            Vector2d.prototype.squaredLength = function () {
                return this.x * this.x + this.y * this.y;
            };
            Vector2d.prototype.manhattanLength = function () {
                return Math.abs(this.x) + Math.abs(this.y);
            };
            Vector2d.prototype.diagonalLength = function () {
                return Math.max(Math.abs(this.x), Math.abs(this.y));
            };
            Vector2d.prototype.dot = function (v) {
                return this.x * v.x + this.y * v.y;
            };
            Vector2d.prototype.interpolated = function (f, other) {
                var x = (other.x - this.x) * f + this.x;
                var y = (other.y - this.y) * f + this.y;
                return new Vector2d(x, y);
            };
            Vector2d.prototype.fromRaw = function (raw) {
                return new Vector2d(raw.x || 0, raw.y || 0);
            };
            Vector2d.prototype.toArray = function () {
                return [this.x, this.y];
            };
            Vector2d.prototype.equals = function (v) {
                return Math.abs(this.x - v.x) < kr3m.math.EPSILON && Math.abs(this.y - v.y) < kr3m.math.EPSILON;
            };
            Vector2d.prototype.toString = function () {
                return this.x + ";" + this.y;
            };
            return Vector2d;
        }());
        math.Vector2d = Vector2d;
    })(math = kr3m.math || (kr3m.math = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var math;
    (function (math) {
        var Matrix2x3 = (function (_super) {
            __extends(Matrix2x3, _super);
            function Matrix2x3() {
                var _this = _super.call(this, 2, 3) || this;
                _this.v[0] = 1;
                _this.v[3] = 1;
                return _this;
            }
            Matrix2x3.prototype.setFrom = function (m) {
                for (var i = 0; i < this.v.length; ++i)
                    this.v[i] = m.v[i];
            };
            Matrix2x3.prototype.clone = function () {
                var m = new Matrix2x3();
                for (var i = 0; i < this.v.length; ++i)
                    m.v[i] = this.v[i];
                return m;
            };
            Matrix2x3.prototype.setTranslation = function () {
                if (arguments.length == 2) {
                    var x = arguments[0];
                    var y = arguments[1];
                }
                else {
                    var v = arguments[0];
                    var x = v.x;
                    var y = v.y;
                }
                this.v[0] = 1;
                this.v[2] = 0;
                this.v[4] = x;
                this.v[1] = 0;
                this.v[3] = 1;
                this.v[5] = y;
            };
            Matrix2x3.prototype.translate = function (x, y) {
                this.v[4] += x;
                this.v[5] += y;
            };
            Matrix2x3.prototype.rotate = function (angle) {
                var v = this.v.slice();
                var c = Math.cos(angle * math.DEG_2_RAD);
                var s = Math.sin(angle * math.DEG_2_RAD);
                this.v[0] = c * v[0] - s * v[1];
                this.v[2] = c * v[2] - s * v[3];
                this.v[4] = c * v[4] - s * v[5];
                this.v[1] = s * v[0] + c * v[1];
                this.v[3] = s * v[2] + c * v[3];
                this.v[5] = s * v[4] + c * v[5];
            };
            Matrix2x3.prototype.rotateAround = function (angle, x, y) {
                this.translate(-x, -y);
                this.rotate(angle);
                this.translate(x, y);
            };
            Matrix2x3.prototype.setScale = function () {
                if (arguments.length == 2) {
                    var x = arguments[0];
                    var y = arguments[1];
                }
                else {
                    var v = arguments[0];
                    var x = v.x;
                    var y = v.y;
                }
                this.v[0] = x;
                this.v[2] = 0;
                this.v[4] = 0;
                this.v[1] = 0;
                this.v[3] = y;
                this.v[5] = 0;
            };
            Matrix2x3.prototype.scale = function (x, y) {
                if (y === void 0) { y = x; }
                for (var i = 0; i < this.v.length;) {
                    this.v[i++] *= x;
                    this.v[i++] *= y;
                }
            };
            Matrix2x3.prototype.scaleFrom = function (s, x, y) {
                this.translate(-x, -y);
                this.scale(s);
                this.translate(x, y);
            };
            Matrix2x3.prototype.scaleXYFrom = function (sx, sy, x, y) {
                this.translate(-x, -y);
                this.scale(sx, sy);
                this.translate(x, y);
            };
            Matrix2x3.prototype.scaled = function (factor) {
                var s = new math.Matrix(this.m, this.n);
                for (var i = 0; i < 4; ++i)
                    s.v[i] = this.v[i] * factor;
                s.v[4] = this.v[4];
                s.v[5] = this.v[5];
                return s;
            };
            Matrix2x3.prototype.transposed = function () {
                var t = new math.Matrix(3, 2);
                t.v[0] = this.v[0];
                t.v[3] = this.v[1];
                t.v[1] = this.v[2];
                t.v[4] = this.v[3];
                t.v[2] = this.v[4];
                t.v[5] = this.v[5];
                return t;
            };
            Matrix2x3.prototype.concated2x3 = function (m) {
                var c = new Matrix2x3();
                c.v[0] = this.v[0] * m.v[0] + this.v[2] * m.v[1];
                c.v[2] = this.v[0] * m.v[2] + this.v[2] * m.v[3];
                c.v[4] = this.v[0] * m.v[4] + this.v[2] * m.v[5] + this.v[4];
                c.v[1] = this.v[1] * m.v[0] + this.v[3] * m.v[1];
                c.v[3] = this.v[1] * m.v[2] + this.v[3] * m.v[3];
                c.v[5] = this.v[1] * m.v[4] + this.v[3] * m.v[5] + this.v[5];
                return c;
            };
            Matrix2x3.prototype.concat2x3 = function (m) {
                var r = this.concated2x3(m);
                this.v = r.v;
            };
            Matrix2x3.prototype.applied = function (v) {
                var x = this.v[0] * v.x + this.v[2] * v.y + this.v[4];
                var y = this.v[1] * v.x + this.v[3] * v.y + this.v[5];
                return new math.Vector2d(x, y);
            };
            return Matrix2x3;
        }(math.Matrix));
        math.Matrix2x3 = Matrix2x3;
    })(math = kr3m.math || (kr3m.math = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var geom;
    (function (geom) {
        var AxisAlignedRectangle2d = (function () {
            function AxisAlignedRectangle2d(x, y, w, h) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                if (w === void 0) { w = 0; }
                if (h === void 0) { h = 0; }
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;
            }
            AxisAlignedRectangle2d.prototype.intersects = function (aaR) {
                if (aaR.x > this.x + this.w)
                    return false;
                if (aaR.y > this.y + this.h)
                    return false;
                if (aaR.x + aaR.w < this.x)
                    return false;
                if (aaR.y + aaR.h < this.y)
                    return false;
                return true;
            };
            AxisAlignedRectangle2d.prototype.contains = function (aaR) {
                if (aaR.x + aaR.w > this.x + this.w)
                    return false;
                if (aaR.y + aaR.h > this.y + this.h)
                    return false;
                if (aaR.x < this.x)
                    return false;
                if (aaR.y < this.y)
                    return false;
                return true;
            };
            AxisAlignedRectangle2d.prototype.getArea = function () {
                return this.w * this.h;
            };
            AxisAlignedRectangle2d.prototype.clip = function (aaR) {
                var x = Math.max(this.x, aaR.x);
                var y = Math.max(this.y, aaR.y);
                var w = Math.min(this.right(), aaR.right()) - x;
                var h = Math.min(this.bottom(), aaR.bottom()) - y;
                aaR.x = x;
                aaR.y = y;
                aaR.w = Math.max(0, w);
                aaR.h = Math.max(0, h);
            };
            AxisAlignedRectangle2d.prototype.merge = function (aaR) {
                var x = Math.min(this.x, aaR.x);
                var y = Math.min(this.y, aaR.y);
                var w = Math.max(this.right(), aaR.right()) - x;
                var h = Math.max(this.bottom(), aaR.bottom()) - y;
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;
            };
            AxisAlignedRectangle2d.prototype.round = function () {
                this.x = Math.floor(this.x);
                this.y = Math.floor(this.y);
                this.w = Math.ceil(this.w);
                this.h = Math.ceil(this.h);
            };
            AxisAlignedRectangle2d.prototype.transformedBounds = function (transform) {
                var p = [
                    new kr3m.math.Vector2d(this.x, this.y),
                    new kr3m.math.Vector2d(this.x + this.w, this.y),
                    new kr3m.math.Vector2d(this.x, this.y + this.h),
                    new kr3m.math.Vector2d(this.x + this.w, this.y + this.h)
                ];
                for (var i = 0; i < 4; ++i)
                    p[i] = transform.applied(p[i]);
                var x = Math.min(p[0].x, p[1].x, p[2].x, p[3].x);
                var y = Math.min(p[0].y, p[1].y, p[2].y, p[3].y);
                var w = Math.max(p[0].x, p[1].x, p[2].x, p[3].x) - x;
                var h = Math.max(p[0].y, p[1].y, p[2].y, p[3].y) - y;
                return new AxisAlignedRectangle2d(x, y, w, h);
            };
            AxisAlignedRectangle2d.prototype.boundPoints = function (points) {
                if (points.length == 0) {
                    this.x = 0;
                    this.y = 0;
                    this.w = 0;
                    this.h = 0;
                    return;
                }
                var x1 = points[0].x;
                var x2 = points[0].x;
                var y1 = points[0].y;
                var y2 = points[0].y;
                for (var i = 1; i < points.length; ++i) {
                    x1 = Math.min(x1, points[i].x);
                    x2 = Math.max(x2, points[i].x);
                    y1 = Math.min(y1, points[i].y);
                    y2 = Math.max(y2, points[i].y);
                }
                this.x = x1;
                this.y = y1;
                this.w = x2 - x1 + 1;
                this.h = y2 - y1 + 1;
            };
            AxisAlignedRectangle2d.prototype.clone = function () {
                return new AxisAlignedRectangle2d(this.x, this.y, this.w, this.h);
            };
            AxisAlignedRectangle2d.prototype.left = function () {
                return this.x;
            };
            AxisAlignedRectangle2d.prototype.right = function () {
                return this.x + this.w;
            };
            AxisAlignedRectangle2d.prototype.top = function () {
                return this.y;
            };
            AxisAlignedRectangle2d.prototype.bottom = function () {
                return this.y + this.h;
            };
            AxisAlignedRectangle2d.prototype.squeezeLeft = function (amount) {
                this.w -= amount;
            };
            AxisAlignedRectangle2d.prototype.squeezeRight = function (amount) {
                this.x += amount;
                this.w -= amount;
            };
            AxisAlignedRectangle2d.prototype.squeezeDown = function (amount) {
                this.y += amount;
                this.h -= amount;
            };
            AxisAlignedRectangle2d.prototype.squeezeUp = function (amount) {
                this.h -= amount;
            };
            AxisAlignedRectangle2d.prototype.pushLeft = function (amount) {
                this.x -= amount;
            };
            AxisAlignedRectangle2d.prototype.pushRight = function (amount) {
                this.x += amount;
            };
            AxisAlignedRectangle2d.prototype.pushDown = function (amount) {
                this.y += amount;
            };
            AxisAlignedRectangle2d.prototype.pushUp = function (amount) {
                this.y -= amount;
            };
            return AxisAlignedRectangle2d;
        }());
        geom.AxisAlignedRectangle2d = AxisAlignedRectangle2d;
    })(geom = kr3m.geom || (kr3m.geom = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var geom;
    (function (geom) {
        var Point2d = (function (_super) {
            __extends(Point2d, _super);
            function Point2d() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Point2d;
        }(kr3m.math.Vector2d));
        geom.Point2d = Point2d;
    })(geom = kr3m.geom || (kr3m.geom = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var images;
    (function (images) {
        var Color = (function () {
            function Color(r, g, b, a) {
                if (r === void 0) { r = 0; }
                if (g === void 0) { g = 0; }
                if (b === void 0) { b = 0; }
                if (a === void 0) { a = 255; }
                this.r = Math.min(Math.max(Math.floor(r), 0), 255);
                this.g = Math.min(Math.max(Math.floor(g), 0), 255);
                this.b = Math.min(Math.max(Math.floor(b), 0), 255);
                this.a = Math.min(Math.max(Math.floor(a), 0), 255);
            }
            Color.prototype.getTransparent = function (factor) {
                return new kr3m.images.Color(this.r, this.g, this.b, this.a * factor);
            };
            Color.prototype.toNumber = function (littleEndian) {
                if (littleEndian === void 0) { littleEndian = false; }
                if (littleEndian)
                    return (this.a << 24) + (this.b << 16) + (this.g << 8) + this.r;
                else
                    return (this.r << 24) + (this.g << 16) + (this.b << 8) + this.a;
            };
            Color.prototype.toString = function () {
                return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
            };
            Color.getImageDataColor = function (imageData, x, y) {
                var offset = (imageData.width * y + x) * 4;
                var data = imageData.data;
                return new kr3m.images.Color(data[offset], data[offset + 1], data[offset + 2], data[offset + 3]);
            };
            Color.setImageDataColor = function (imageData, x, y, color) {
                var offset = (imageData.width * y + x) * 4;
                var data = imageData.data;
                data[offset] = color.r;
                data[offset + 1] = color.g;
                data[offset + 2] = color.b;
                data[offset + 3] = color.a;
            };
            return Color;
        }());
        images.Color = Color;
        images.COLOR_BLACK = new kr3m.images.Color(0, 0, 0, 255);
        images.COLOR_BLUE = new kr3m.images.Color(0, 0, 255, 255);
        images.COLOR_GREEN = new kr3m.images.Color(0, 255, 0, 255);
        images.COLOR_RED = new kr3m.images.Color(255, 0, 0, 255);
        images.COLOR_WHITE = new kr3m.images.Color(255, 255, 255, 255);
    })(images = kr3m.images || (kr3m.images = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var Canvas = (function (_super) {
            __extends(Canvas, _super);
            function Canvas(parent, width, height, attributes) {
                if (width === void 0) { width = 640; }
                if (height === void 0) { height = 480; }
                if (attributes === void 0) { attributes = {}; }
                var _this = _super.call(this) || this;
                _this.adjustWidth = false;
                _this.adjustHeight = false;
                _this.isFullScreen = false;
                _this.isListening = false;
                _this.frameListeners = [];
                _this.nextFrameListeners = [];
                _this.isFrameRenderingPaused = false;
                _this.width = width;
                _this.adjustWidth = width <= 0;
                if (!_this.adjustWidth)
                    attributes.width = width;
                _this.height = height;
                _this.adjustHeight = height <= 0;
                if (!_this.adjustHeight)
                    attributes.height = height;
                attributes.id = attributes.id || kr3m.ui.Element.getFreeId();
                _this = _super.call(this, parent, null, "canvas", attributes) || this;
                if (!parent) {
                    $("body").append(_this.dom);
                    _this.dom.hide();
                }
                _this.canvas = document.getElementById(attributes.id);
                _this.checkSize();
                return _this;
            }
            Canvas.prototype.setSize = function (width, height) {
                if (this.width != width) {
                    this.width = width;
                    this.adjustWidth = width <= 0;
                    if (!this.adjustWidth)
                        this.setAttribute("width", width);
                }
                if (this.height != height) {
                    this.height = height;
                    this.adjustHeight = height <= 0;
                    if (!this.adjustHeight)
                        this.setAttribute("height", height);
                }
            };
            Canvas.prototype.getSize = function () {
                return [this.width, this.height];
            };
            Canvas.prototype.onCanvasSize = function () {
                this.setAttribute("width", this.width);
                this.setAttribute("height", this.height);
            };
            Canvas.prototype.getNaturalWidth = function () {
                return this.getWidth() || kr3m.util.StringEx.parseIntSafe(this.getAttribute("width"));
            };
            Canvas.prototype.getNaturalHeight = function () {
                return this.getHeight() || kr3m.util.StringEx.parseIntSafe(this.getAttribute("height"));
            };
            Canvas.prototype.checkSize = function () {
                var isFs = this.isInFullScreen();
                if (!this.parent)
                    return;
                var changed = false;
                var par = this.parent.dom.get(0);
                var win = $(window);
                if (this.adjustWidth) {
                    var width = isFs ? win.width() : par.clientWidth;
                    if (width != this.width) {
                        this.width = width;
                        changed = true;
                    }
                }
                if (this.adjustHeight) {
                    var height = isFs ? win.height() : par.clientHeight;
                    if (height != this.height) {
                        this.height = height;
                        changed = true;
                    }
                }
                if (changed)
                    this.onCanvasSize();
            };
            Canvas.prototype.onFrame = function (listener) {
                this.frameListeners.push(listener);
                this.listen();
            };
            Canvas.prototype.onNextFrame = function (listener) {
                this.nextFrameListeners.push(listener);
                this.listen();
            };
            Canvas.prototype.pauseFrameRendering = function () {
                this.isFrameRenderingPaused = true;
            };
            Canvas.prototype.resumeFrameRendering = function () {
                this.isFrameRenderingPaused = false;
            };
            Canvas.prototype.listen = function () {
                var _this = this;
                if (this.isListening)
                    return;
                this.isListening = true;
                var requestFunc = window.requestAnimationFrame || window["webkitRequestAnimationFrame"] || window["mozRequestAnimationFrame"];
                requestFunc = requestFunc || function (callback) { setTimeout(callback, 1000 / 60); };
                this.lastFrameTime = Date.now();
                var tick = function () {
                    _this.checkSize();
                    var now = Date.now();
                    var delta = (now - _this.lastFrameTime) / 1000;
                    _this.lastFrameTime = now;
                    if (!_this.isFrameRenderingPaused) {
                        var nextListeners = _this.nextFrameListeners;
                        _this.nextFrameListeners = [];
                        for (var i = 0; i < nextListeners.length; ++i)
                            nextListeners[i](delta);
                        for (var i = 0; i < _this.frameListeners.length; ++i)
                            _this.frameListeners[i](delta);
                    }
                    requestFunc(tick);
                };
                requestFunc(tick);
            };
            Canvas.prototype.getDataUrl = function (mimeType) {
                if (mimeType === void 0) { mimeType = "image/png"; }
                return this.canvas.toDataURL(mimeType);
            };
            return Canvas;
        }(kr3m.ui.Element));
        ui.Canvas = Canvas;
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var Image = (function (_super) {
            __extends(Image, _super);
            function Image(parent, src, className, attributes) {
                var _this = this;
                attributes = attributes || {};
                attributes["src"] = src || "";
                if (className)
                    attributes["class"] = className;
                _this = _super.call(this, parent, null, "img", attributes) || this;
                return _this;
            }
            Image.prototype.isLoaded = function () {
                return !!this.dom.get(0).naturalWidth;
            };
            Image.prototype.getNaturalWidth = function () {
                return this.dom.get(0).naturalWidth || this.dom.width();
            };
            Image.prototype.getNaturalHeight = function () {
                return this.dom.get(0).naturalHeight || this.dom.height();
            };
            Image.prototype.setUrl = function (url) {
                this.setAttribute("src", url);
            };
            Image.prototype.getUrl = function () {
                return this.getAttribute("src");
            };
            return Image;
        }(kr3m.ui.Element));
        ui.Image = Image;
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var Canvas2d = (function (_super) {
            __extends(Canvas2d, _super);
            function Canvas2d(parent, width, height, attributes) {
                if (width === void 0) { width = 640; }
                if (height === void 0) { height = 480; }
                if (attributes === void 0) { attributes = {}; }
                var _this = _super.call(this, parent, width, height, attributes) || this;
                _this.context = _this.canvas.getContext("2d");
                _this.pixelHelper = _this.context.createImageData(1, 1);
                if (width > 0)
                    _this.lineHelper = _this.context.createImageData(width, 1);
                return _this;
            }
            Canvas2d.prototype.onCanvasSize = function () {
                _super.prototype.onCanvasSize.call(this);
                if (this.context)
                    this.lineHelper = this.context.createImageData(this.width, 1);
            };
            Canvas2d.prototype.drawPath = function (points, color, lineWidth) {
                if (color === void 0) { color = "black"; }
                if (lineWidth === void 0) { lineWidth = 1; }
                if (points.length < 2)
                    return;
                this.context.beginPath();
                this.context.lineWidth = lineWidth;
                this.context.strokeStyle = color.toString();
                this.context.moveTo(points[0].x, points[0].y);
                for (var i = 1; i < points.length; ++i)
                    this.context.lineTo(points[i].x, points[i].y);
                this.context.stroke();
                return this;
            };
            Canvas2d.prototype.drawLine = function (fromX, fromY, toX, toY, color, lineWidth) {
                if (color === void 0) { color = "black"; }
                if (lineWidth === void 0) { lineWidth = 1; }
                this.context.beginPath();
                this.context.lineWidth = lineWidth;
                this.context.strokeStyle = color.toString();
                this.context.moveTo(fromX, fromY);
                this.context.lineTo(toX, toY);
                this.context.stroke();
                return this;
            };
            Canvas2d.prototype.rotate = function (angle) {
                this.context.rotate(angle * 0.01745329251994329576923690768489);
                return this;
            };
            Canvas2d.prototype.resetTransform = function () {
                this.context.setTransform(1, 0, 0, 1, 0, 0);
                return this;
            };
            Canvas2d.prototype.setTransform = function (a, b, c, d, e, f) {
                this.context.setTransform(a, b, c, d, e, f);
                return this;
            };
            Canvas2d.prototype.setTransformMatrix = function (matrix) {
                return this.setTransform(matrix.v[0], matrix.v[1], matrix.v[2], matrix.v[3], matrix.v[4], matrix.v[5]);
            };
            Canvas2d.prototype.transform = function (a, b, c, d, e, f) {
                this.context.transform(a, b, c, d, e, f);
                return this;
            };
            Canvas2d.prototype.fillRectangle = function (x, y, w, h, color) {
                if (color === void 0) { color = "black"; }
                this.context.fillStyle = color.toString();
                this.context.fillRect(x, y, w, h);
                return this;
            };
            Canvas2d.prototype.fill = function (color) {
                if (color === void 0) { color = "white"; }
                return this.fillRectangle(0, 0, this.width, this.height, color);
            };
            Canvas2d.prototype.drawArc = function (x, y, r, a1, a2, color, lineWidth) {
                if (color === void 0) { color = "black"; }
                if (lineWidth === void 0) { lineWidth = 1; }
                a1 *= kr3m.math.DEG_2_RAD;
                a2 *= kr3m.math.DEG_2_RAD;
                this.context.beginPath();
                this.context.lineWidth = lineWidth;
                this.context.strokeStyle = color.toString();
                this.context.arc(x, y, r, a1, a2, false);
                this.context.stroke();
                this.context.closePath();
                return this;
            };
            Canvas2d.prototype.fillCircle = function (x, y, r, color) {
                if (color === void 0) { color = "black"; }
                this.context.beginPath();
                this.context.arc(x, y, r, 0, 2 * Math.PI, false);
                this.context.fillStyle = color.toString();
                this.context.fill();
                this.context.closePath();
                return this;
            };
            Canvas2d.prototype.text = function (text, x, y, color) {
                if (color === void 0) { color = "black"; }
                this.context.fillStyle = color.toString();
                this.context.fillText(text, x, y);
                return this;
            };
            Canvas2d.prototype.fillRect = function (rect, color) {
                if (color === void 0) { color = "black"; }
                this.context.fillStyle = color.toString();
                this.context.fillRect(rect.x, rect.y, rect.w, rect.h);
                return this;
            };
            Canvas2d.prototype.clear = function () {
                this.context.clearRect(0, 0, this.width, this.height);
                return this;
            };
            Canvas2d.prototype.clearRect = function (rect) {
                this.context.clearRect(rect.x, rect.y, rect.w, rect.h);
                return this;
            };
            Canvas2d.prototype.drawRect = function (rect, color, lineWidth) {
                if (color === void 0) { color = "black"; }
                if (lineWidth === void 0) { lineWidth = 1; }
                this.context.beginPath();
                this.context.lineWidth = lineWidth;
                this.context.strokeStyle = color.toString();
                this.context.rect(rect.x, rect.y, rect.w, rect.h);
                this.context.stroke();
                return this;
            };
            Canvas2d.prototype.drawImage = function (source, x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                if (!source)
                    return this;
                if (typeof source == "string")
                    source = document.getElementById(source);
                else if (source instanceof kr3m.ui.Canvas2d)
                    source = source.canvas;
                else if (source instanceof kr3m.ui.Image)
                    source = source.dom.get(0);
                this.context.drawImage(source, x, y);
                return this;
            };
            Canvas2d.prototype.drawImageRect = function (source, sourceRect, targetRect) {
                if (targetRect === void 0) { targetRect = sourceRect; }
                if (!source)
                    return this;
                if (typeof source == "string")
                    source = document.getElementById(source);
                else if (source instanceof kr3m.ui.Canvas2d)
                    source = source.canvas;
                else if (source instanceof kr3m.ui.Image)
                    source = source.dom.get(0);
                try {
                    this.context.drawImage(source, sourceRect.x, sourceRect.y, sourceRect.w, sourceRect.h, targetRect.x, targetRect.y, targetRect.w, targetRect.h);
                }
                catch (e) {
                    logError(sourceRect);
                    logError(targetRect);
                    kr3m.util.Log.logStackTrace();
                }
                return this;
            };
            Canvas2d.prototype.getImageData = function (x, y, w, h) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                if (w === void 0) { w = 0; }
                if (h === void 0) { h = 0; }
                w = w || this.canvas.width;
                h = h || this.canvas.height;
                return this.context.getImageData(x, y, w, h);
            };
            Canvas2d.prototype.putPixel = function (x, y, color) {
                if (color === void 0) { color = kr3m.images.COLOR_BLACK; }
                this.pixelHelper.data[0] = color.r;
                this.pixelHelper.data[1] = color.g;
                this.pixelHelper.data[2] = color.b;
                this.pixelHelper.data[3] = color.a;
                this.context.putImageData(this.pixelHelper, x, y);
                return this;
            };
            Canvas2d.prototype.putLine = function (y, colors) {
                for (var i = 0; i < this.width; ++i) {
                    this.lineHelper.data[i * 4 + 0] = colors[i].r;
                    this.lineHelper.data[i * 4 + 1] = colors[i].g;
                    this.lineHelper.data[i * 4 + 2] = colors[i].b;
                    this.lineHelper.data[i * 4 + 3] = colors[i].a;
                }
                this.context.putImageData(this.lineHelper, 0, y);
                return this;
            };
            Canvas2d.prototype.getPixel = function (x, y) {
                this.pixelHelper = this.context.getImageData(x, y, 1, 1);
                var color = new kr3m.images.Color();
                color.r = this.pixelHelper.data[0];
                color.g = this.pixelHelper.data[1];
                color.b = this.pixelHelper.data[2];
                color.a = this.pixelHelper.data[3];
                return color;
            };
            Canvas2d.prototype.getLine = function (y) {
                this.lineHelper = this.context.getImageData(0, y, this.width, 1);
                var result = [];
                for (var i = 0; i < this.width; ++i) {
                    var color = new kr3m.images.Color();
                    color.r = this.lineHelper.data[i * 4 + 0];
                    color.g = this.lineHelper.data[i * 4 + 1];
                    color.b = this.lineHelper.data[i * 4 + 2];
                    color.a = this.lineHelper.data[i * 4 + 3];
                    result.push(color);
                }
                return result;
            };
            Canvas2d.prototype.setImageData = function (imageData, x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                this.context.putImageData(imageData, x, y);
                return this;
            };
            Canvas2d.prototype.fromDataUrl = function (dataUrl) {
                var _this = this;
                var img = new ui.Image();
                img.on("load", function () { return _this.context.drawImage(img, 0, 0); });
                img.setUrl(dataUrl);
            };
            return Canvas2d;
        }(kr3m.ui.Canvas));
        ui.Canvas2d = Canvas2d;
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var ex;
        (function (ex) {
            var ImageTransformerAbstract = (function (_super) {
                __extends(ImageTransformerAbstract, _super);
                function ImageTransformerAbstract(parent, width, height) {
                    var _this = _super.call(this, parent) || this;
                    _this.matrix = new kr3m.math.Matrix2x3();
                    _this.addClass("imageTransformer");
                    _this.canvas = new kr3m.ui.Canvas2d(_this, width, height);
                    return _this;
                }
                ImageTransformerAbstract.prototype.setSize = function (width, height) {
                    this.canvas.setSize(width, height);
                };
                ImageTransformerAbstract.prototype.getSize = function () {
                    return this.canvas.getSize();
                };
                ImageTransformerAbstract.prototype.setSource = function (sourceUrl) {
                    var _this = this;
                    this.source = new kr3m.ui.Image();
                    this.source.on("load", function () { return _this.reset(); });
                    this.source.setUrl(sourceUrl);
                };
                ImageTransformerAbstract.prototype.draw = function (matrix, initiatedByUser) {
                    if (initiatedByUser === void 0) { initiatedByUser = true; }
                    matrix = matrix || this.matrix;
                    this.canvas.resetTransform();
                    this.canvas.clear();
                    this.canvas.setTransformMatrix(matrix);
                    this.canvas.drawImage(this.source);
                    if (initiatedByUser)
                        this.dom.trigger("change");
                };
                ImageTransformerAbstract.prototype.getDataUrl = function (mimeType) {
                    if (mimeType === void 0) { mimeType = "image/png"; }
                    return this.canvas.getDataUrl(mimeType);
                };
                ImageTransformerAbstract.prototype.reset = function () {
                    this.matrix.setIdentity();
                    var width = this.canvas.getNaturalWidth();
                    var height = this.canvas.getNaturalHeight();
                    var imageWidth = this.source.getNaturalWidth();
                    var imageHeight = this.source.getNaturalHeight();
                    var sx = width / imageWidth;
                    var sy = height / imageHeight;
                    var s = Math.min(sx, sy);
                    this.matrix.scale(s);
                    var ox = (width - imageWidth * s) / 2;
                    var oy = (height - imageHeight * s) / 2;
                    this.matrix.translate(ox, oy);
                    this.draw(this.matrix, false);
                };
                return ImageTransformerAbstract;
            }(kr3m.ui.Element));
            ex.ImageTransformerAbstract = ImageTransformerAbstract;
        })(ex = ui.ex || (ui.ex = {}));
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var ex;
        (function (ex) {
            var ImageTransformerButtons = (function (_super) {
                __extends(ImageTransformerButtons, _super);
                function ImageTransformerButtons(parent, width, height) {
                    var _this = _super.call(this, parent, width, height) || this;
                    _this.moveDeltaX = 10;
                    _this.moveDeltaY = 10;
                    _this.zoomFactor = 1.25;
                    _this.rotateDelta = 5;
                    _this.addClass("imageTransformer");
                    _this.buttons = new kr3m.ui.Element(_this);
                    _this.buttons.addClass("buttons");
                    new kr3m.ui.FormButton(_this.buttons, loc("BUTTON_MOVE_LEFT"), function () { return _this.move(-_this.moveDeltaX, 0); }).addClass("moveLeft");
                    new kr3m.ui.FormButton(_this.buttons, loc("BUTTON_MOVE_UP"), function () { return _this.move(0, -_this.moveDeltaY); }).addClass("moveUp");
                    new kr3m.ui.FormButton(_this.buttons, loc("BUTTON_MOVE_RIGHT"), function () { return _this.move(_this.moveDeltaX, 0); }).addClass("moveRight");
                    new kr3m.ui.FormButton(_this.buttons, loc("BUTTON_MOVE_DOWN"), function () { return _this.move(0, _this.moveDeltaY); }).addClass("moveDown");
                    new kr3m.ui.FormButton(_this.buttons, loc("BUTTON_ZOOM_IN"), function () { return _this.zoom(_this.zoomFactor); }).addClass("zoomIn");
                    new kr3m.ui.FormButton(_this.buttons, loc("BUTTON_ZOOM_OUT"), function () { return _this.zoom(1 / _this.zoomFactor); }).addClass("zoomOut");
                    new kr3m.ui.FormButton(_this.buttons, loc("BUTTON_ROTATE_CCW"), function () { return _this.rotate(-_this.rotateDelta); }).addClass("rotateCcw");
                    new kr3m.ui.FormButton(_this.buttons, loc("BUTTON_ROTATE_CW"), function () { return _this.rotate(_this.rotateDelta); }).addClass("rotateCw");
                    return _this;
                }
                ImageTransformerButtons.prototype.setLocked = function (locked) {
                    this.buttons.setVisible(!locked);
                };
                ImageTransformerButtons.prototype.move = function (deltaX, deltaY) {
                    this.matrix.translate(deltaX, deltaY);
                    this.draw();
                };
                ImageTransformerButtons.prototype.zoom = function (factor) {
                    var x = this.canvas.getNaturalWidth() / 2;
                    var y = this.canvas.getNaturalHeight() / 2;
                    this.matrix.scaleFrom(factor, x, y);
                    this.draw();
                };
                ImageTransformerButtons.prototype.rotate = function (angle) {
                    var x = this.canvas.getNaturalWidth() / 2;
                    var y = this.canvas.getNaturalHeight() / 2;
                    this.matrix.rotateAround(angle, x, y);
                    this.draw();
                };
                return ImageTransformerButtons;
            }(ex.ImageTransformerAbstract));
            ex.ImageTransformerButtons = ImageTransformerButtons;
        })(ex = ui.ex || (ui.ex = {}));
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var omni;
(function (omni) {
    var screens;
    (function (screens) {
        var AdjustImage = (function (_super) {
            __extends(AdjustImage, _super);
            function AdjustImage(manager) {
                var _this = _super.call(this, manager, "adjustImage") || this;
                _this.sizePopup = new kr3m.ui.Element(_this);
                _this.sizePopup.addClass("sizePopup");
                _this.sizePopup.hide();
                var buttons = new kr3m.ui.Element(_this);
                new omni.ui.Button(buttons, "SET_SIZE", function () { return _this.showSizePopup(); });
                new omni.ui.Button(buttons, "SAVE", function () { return _this.save(); });
                _this.transformer = new kr3m.ui.ex.ImageTransformerButtons(_this, 640, 480);
                _this.transformer.addClass("adjustImageTransformer");
                return _this;
            }
            AdjustImage.prototype.showSizePopup = function () {
                var _this = this;
                this.sizePopup.removeAllChildren();
                var propertySet = new omni.widgets.PropertySet(this.sizePopup);
                propertySet.add("width", "WIDTH");
                propertySet.add("height", "HEIGHT");
                var props = {};
                _a = this.transformer.getSize(), props["width"] = _a[0], props["height"] = _a[1];
                propertySet.setProperties(props);
                new omni.ui.CloseButton(this.sizePopup, function () {
                    var props = propertySet.getProperties();
                    var width = parseInt(props["width"], 10);
                    var height = parseInt(props["height"], 10);
                    _this.transformer.setSize(width, height);
                    _this.closeAsPopup(_this.sizePopup);
                });
                this.showAsPopup(this.sizePopup);
                var _a;
            };
            AdjustImage.prototype.save = function () {
                this.clearDownloads();
                var types = ["jpg", "png", "gif"];
                for (var i = 0; i < types.length; ++i) {
                    var dataUrl = this.transformer.getDataUrl("image/" + types[i]);
                    var filename = this.fileName + "." + types[i];
                    this.addDownloadUrl(filename, dataUrl);
                }
            };
            AdjustImage.prototype.handleDroppedFiles = function (files) {
                var _this = this;
                for (var i = 0; i < files.length; ++i) {
                    if (files[i].mimeType.slice(0, 6) == "image/") {
                        this.setFileName(files[i].name);
                        files[i].getDataUrl(function (dataUrl) { return _this.transformer.setSource(dataUrl); });
                        break;
                    }
                }
            };
            return AdjustImage;
        }(omni.AbstractScreen));
        screens.AdjustImage = AdjustImage;
    })(screens = omni.screens || (omni.screens = {}));
})(omni || (omni = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var Textbox = (function (_super) {
            __extends(Textbox, _super);
            function Textbox(parent, text, className, attributes) {
                var _this = this;
                attributes = attributes || {};
                if (className && className != "")
                    attributes["class"] = className;
                _this = _super.call(this, parent, null, "div", attributes) || this;
                _this.setText(text);
                return _this;
            }
            Textbox.prototype.getText = function () {
                return this.dom.text();
            };
            Textbox.prototype.setText = function (text) {
                text = text || "";
                this.dom.text(text.toString());
            };
            Textbox.prototype.setHtml = function (html) {
                html = html || "";
                this.dom.html(html);
            };
            Textbox.prototype.scrollToBottom = function () {
                this.dom.get(0).scrollTop = this.dom.get(0).scrollHeight;
            };
            return Textbox;
        }(kr3m.ui.Element));
        ui.Textbox = Textbox;
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var omni;
(function (omni) {
    var screens;
    (function (screens) {
        var DataUrl = (function (_super) {
            __extends(DataUrl, _super);
            function DataUrl(manager) {
                var _this = _super.call(this, manager, "dataUrl") || this;
                _this.itemContainer = new kr3m.ui.Element(_this);
                new kr3m.ui.Textbox(_this.itemContainer, loc("DROP_FILES_HERE"));
                return _this;
            }
            DataUrl.prototype.handleDroppedFiles = function (files) {
                var _this = this;
                this.itemContainer.removeAllChildren();
                kr3m.async.Loop.forEach(files, function (file, next) {
                    file.getDataUrl(function (url) {
                        new kr3m.ui.Anchor(_this.itemContainer, file.name, url, { target: "_blank", style: "display: block;" });
                        next();
                    });
                });
            };
            return DataUrl;
        }(omni.AbstractScreen));
        screens.DataUrl = DataUrl;
    })(screens = omni.screens || (omni.screens = {}));
})(omni || (omni = {}));
var kr3m;
(function (kr3m) {
    var html;
    (function (html_1) {
        var Helper = (function () {
            function Helper() {
            }
            Helper.prototype.processCode = function (code, tokens, locFunc) {
                if (tokens)
                    code = kr3m.util.Tokenizer.get(code, tokens);
                locFunc = locFunc || kr3m.util["Localization"].get;
                if (locFunc)
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
            Helper.DOCTYPE = "<!DOCTYPE html>";
            return Helper;
        }());
        html_1.Helper = Helper;
    })(html = kr3m.html || (kr3m.html = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var Checkbox = (function (_super) {
            __extends(Checkbox, _super);
            function Checkbox(parent, className) {
                var _this = _super.call(this, parent, null, "input", { type: "checkbox" }) || this;
                if (className)
                    _this.addClass("className");
                return _this;
            }
            Checkbox.prototype.onAddedToStage = function () {
                _super.prototype.onAddedToStage.call(this);
                this.on("change", this.onChange.bind(this));
            };
            Checkbox.prototype.onRemovedFromStage = function () {
                this.off("change", this.onChange.bind(this));
                _super.prototype.onRemovedFromStage.call(this);
            };
            Checkbox.prototype.onChange = function () {
                if (this.isChecked())
                    this.addClass("checked");
                else
                    this.removeClass("checked");
            };
            Checkbox.prototype.isChecked = function () {
                return this.dom.prop("checked");
            };
            Checkbox.prototype.setChecked = function (value) {
                if (value === void 0) { value = true; }
                this.dom.prop("checked", value);
                this.onChange();
            };
            Checkbox.prototype.toggleChecked = function (initiatedByUser) {
                if (initiatedByUser)
                    this.trigger("click");
                else
                    this.setChecked(!this.isChecked());
            };
            return Checkbox;
        }(kr3m.ui.Element));
        ui.Checkbox = Checkbox;
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var Option = (function (_super) {
            __extends(Option, _super);
            function Option(parent, value, text) {
                var _this = _super.call(this, parent, null, "option", { value: value.toString() }) || this;
                _this.dom.text(text.toString());
                return _this;
            }
            Option.prototype.enable = function () {
                _super.prototype.enable.call(this);
                this.dom.get(0).disabled = false;
            };
            Option.prototype.disable = function () {
                _super.prototype.disable.call(this);
                this.dom.get(0).disabled = true;
            };
            return Option;
        }(kr3m.ui.Element));
        ui.Option = Option;
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var DropDown = (function (_super) {
            __extends(DropDown, _super);
            function DropDown(parent, values, className, locaPrefix) {
                var _this = _super.call(this, parent, null, "select", className ? { "class": className } : {}) || this;
                _this.options = [];
                _this.sortValues = false;
                if (values) {
                    if (typeof locaPrefix == "string")
                        _this.setLocalizedValues(values, locaPrefix);
                    else
                        _this.setValues(values);
                }
                return _this;
            }
            DropDown.prototype.setCallToActionText = function (text) {
                this.callToActionText = text;
                this.rebuildList();
            };
            DropDown.prototype.rebuildList = function () {
                this.removeAllChildren();
                if (this.callToActionText) {
                    var cta = new kr3m.ui.Option(this, "", this.callToActionText);
                    cta.disable();
                }
                if (this.sortValues)
                    this.options.sort(function (a, b) { return a.caption.localeCompare(b.caption); });
                for (var i = 0; i < this.options.length; ++i) {
                    var option = new kr3m.ui.Option(this, this.options[i].value, this.options[i].caption);
                    if (this.options[i].disabled)
                        option.disable();
                }
                var list = this.dom.get(0);
                list.selectedIndex = 0;
            };
            DropDown.prototype.addValues = function (values) {
                for (var i in values)
                    this.options.push({ value: i, caption: values[i] });
                this.rebuildList();
            };
            DropDown.prototype.addValue = function (value, caption, disabled) {
                this.options.push({ value: value, caption: caption, disabled: disabled });
                this.rebuildList();
            };
            DropDown.prototype.addOptions = function (values) {
                this.options = this.options.concat(values);
                this.rebuildList();
            };
            DropDown.prototype.clearValues = function () {
                this.options = [];
                this.rebuildList();
            };
            DropDown.prototype.addLocalizedValue = function (value, prefix, disabled) {
                if (prefix === void 0) { prefix = ""; }
                this.options.push({ value: value, caption: kr3m.util.Localization.get(prefix + value), disabled: disabled });
                this.rebuildList();
            };
            DropDown.prototype.addLocalizedValues = function (values, prefix) {
                for (var i in values)
                    this.options.push({ value: values[i], caption: kr3m.util.Localization.get(prefix + values[i]) });
                this.rebuildList();
            };
            DropDown.prototype.setLocalizedValues = function (values, prefix) {
                if (prefix === void 0) { prefix = ""; }
                this.options = [];
                this.addLocalizedValues(values, prefix);
            };
            DropDown.prototype.setValues = function (values) {
                this.options = [];
                this.addValues(values);
            };
            DropDown.prototype.setOptions = function (values) {
                this.options = [];
                this.addOptions(values);
            };
            DropDown.prototype.getSelectedValue = function () {
                var list = this.dom.get(0);
                var option = list.options[list.selectedIndex];
                return option ? option.value : null;
            };
            DropDown.prototype.getSelectedText = function () {
                var list = this.dom.get(0);
                var option = list.options[list.selectedIndex];
                return option ? option.text : null;
            };
            DropDown.prototype.select = function (value) {
                if (value === undefined || value === null)
                    return;
                value = value.toString();
                var list = this.dom.get(0);
                for (var i = 0; i < list.options.length; ++i) {
                    if (list.options[i].value == value) {
                        list.selectedIndex = i;
                        return;
                    }
                }
            };
            DropDown.prototype.selectByText = function (text) {
                var list = this.dom.get(0);
                for (var i = 0; i < list.options.length; ++i) {
                    if (list.options[i].text == text) {
                        list.selectedIndex = i;
                        return;
                    }
                }
            };
            DropDown.prototype.addChangeListener = function (listener) {
                this.dom.on("change", listener);
            };
            DropDown.prototype.removeChangeListeners = function () {
                this.dom.off("change");
            };
            DropDown.prototype.resetVoValue = function () {
                var list = this.dom.get(0);
                var option = list.options[0];
                if (option)
                    this.select(option.value);
            };
            DropDown.prototype.getVoValue = function () {
                return this.getSelectedValue();
            };
            DropDown.prototype.setVoValue = function (value) {
                this.select(value);
            };
            return DropDown;
        }(kr3m.ui.Element));
        ui.DropDown = DropDown;
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var ex;
        (function (ex) {
            var HtmlEditor = (function (_super) {
                __extends(HtmlEditor, _super);
                function HtmlEditor(par) {
                    var _this = _super.call(this, par) || this;
                    _this.showRaw = false;
                    _this.addClass("htmlEditor");
                    _this.addHeader();
                    _this.addDropdowns();
                    _this.addButtons();
                    _this.addContent();
                    return _this;
                }
                HtmlEditor.prototype.addHeader = function () {
                    var _this = this;
                    this.header = new kr3m.ui.Element(this);
                    this.header.addClass("header");
                    var rawCheck = new kr3m.ui.Checkbox(this.header);
                    rawCheck.on("change", function () { return _this.setMode(rawCheck.isChecked()); });
                    var rawLabel = new kr3m.ui.Element(this.header, null, "span");
                    rawLabel.setInnerHtml("Show Raw");
                };
                HtmlEditor.prototype.addDropdowns = function () {
                    var _this = this;
                    this.dropdowns = new kr3m.ui.Element(this);
                    this.dropdowns.addClass("dropdowns");
                    for (var i = 0; i < HtmlEditor.STYLE_LIST_TYPES.length; ++i) {
                        var slt = HtmlEditor.STYLE_LIST_TYPES[i];
                        var dropdown = new kr3m.ui.DropDown(this.dropdowns, slt.values, "styleDropdown");
                        dropdown.on("change", (function (slt, dropdown) {
                            _this.applyFormatting(slt.formatting, dropdown.getSelectedValue());
                            dropdown.select("0");
                        }).bind(null, slt, dropdown));
                        dropdown.select("");
                    }
                };
                HtmlEditor.prototype.addButtons = function () {
                    var _this = this;
                    this.buttons = new kr3m.ui.Element(this);
                    this.buttons.addClass("buttons");
                    for (var i = 0; i < HtmlEditor.STYLE_BUTTON_TYPES.length; ++i) {
                        var sbtt = HtmlEditor.STYLE_BUTTON_TYPES[i];
                        var button = new kr3m.ui.Image(this.buttons, sbtt.iconUrl, "button styleButton");
                        button.on("click", (function (sbtt) { return _this.applyFormatting(sbtt.formatting); }).bind(null, sbtt));
                        button.setAttribute("tabIndex", 0);
                    }
                    for (var i = 0; i < HtmlEditor.INSERT_BUTTON_TYPES.length; ++i) {
                        var ibtt = HtmlEditor.INSERT_BUTTON_TYPES[i];
                        var button = new kr3m.ui.Image(this.buttons, ibtt.iconUrl, "button styleButton");
                        button.on("click", (function (ibtt) {
                            var value = prompt(ibtt.promptText);
                            if (value)
                                _this.applyFormatting(ibtt.formatting, value);
                        }).bind(null, ibtt));
                        button.setAttribute("tabIndex", 0);
                    }
                };
                HtmlEditor.prototype.addContent = function () {
                    this.content = new kr3m.ui.Element(this);
                    this.content.addClass("content");
                    this.content.setAttribute("contenteditable", true);
                    this.content.setAttribute("tabIndex", 0);
                };
                HtmlEditor.prototype.applyFormatting = function (command, value) {
                    if (this.showRaw)
                        return;
                    document.execCommand(command, false, value);
                };
                HtmlEditor.prototype.setMode = function (raw) {
                    if (raw == this.showRaw)
                        return;
                    if (raw)
                        this.content.setInnerHtml(kr3m.util.Util.encodeHtml(this.content.getInnerHtml()));
                    else
                        this.content.setInnerHtml(kr3m.util.Util.decodeHtml(this.content.getInnerHtml()));
                    this.dropdowns.setVisible(!raw);
                    this.buttons.setVisible(!raw);
                    this.showRaw = raw;
                };
                HtmlEditor.prototype.setText = function (text) {
                    this.setHtml(kr3m.util.Util.encodeHtml(text));
                };
                HtmlEditor.prototype.getText = function () {
                    return kr3m.util.Util.decodeHtml(this.getHtml());
                };
                HtmlEditor.prototype.setHtml = function (html) {
                    if (this.showRaw)
                        this.content.setInnerHtml(kr3m.util.Util.encodeHtml(html));
                    else
                        this.content.setInnerHtml(html);
                };
                HtmlEditor.prototype.getHtml = function () {
                    if (this.showRaw)
                        return kr3m.util.Util.decodeHtml(this.content.getInnerHtml());
                    else
                        return this.content.getInnerHtml();
                };
                HtmlEditor.STYLE_LIST_TYPES = [
                    {
                        id: "BLOCK_TYPE",
                        formatting: "formatblock",
                        values: {
                            "0": "- formatting -",
                            "h1": "Title 1 <h1>",
                            "h2": "Title 2 <h2>",
                            "h3": "Title 3 <h3>",
                            "h4": "Title 4 <h4>",
                            "h5": "Title 5 <h5>",
                            "h6": "Subtitle <h6>",
                            "p": "Paragraph <p>",
                            "pre": "Preformatted <pre>"
                        }
                    },
                    {
                        id: "FONT_SIZE",
                        formatting: "fontsize",
                        values: {
                            "0": "- size -",
                            "1": "Very small",
                            "2": "A bit small",
                            "3": "Normal",
                            "4": "Medium-large",
                            "5": "Big",
                            "6": "Very big",
                            "7": "Maximum"
                        }
                    }
                ];
                HtmlEditor.STYLE_BUTTON_TYPES = [
                    { id: "UNDO", formatting: "undo", iconUrl: "data:image/gif;base64,R0lGODlhFgAWAOMKADljwliE33mOrpGjuYKl8aezxqPD+7/I19DV3NHa7P///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARR8MlJq7046807TkaYeJJBnES4EeUJvIGapWYAC0CsocQ7SDlWJkAkCA6ToMYWIARGQF3mRQVIEjkkSVLIbSfEwhdRIH4fh/DZMICe3/C4nBQBADs=" },
                    { id: "REDO", formatting: "redo", iconUrl: "data:image/gif;base64,R0lGODlhFgAWAMIHAB1ChDljwl9vj1iE34Kl8aPD+7/I1////yH5BAEKAAcALAAAAAAWABYAAANKeLrc/jDKSesyphi7SiEgsVXZEATDICqBVJjpqWZt9NaEDNbQK1wCQsxlYnxMAImhyDoFAElJasRRvAZVRqqQXUy7Cgx4TC6bswkAOw==" },
                    { id: "CUT", formatting: "cut", iconUrl: "data:image/gif;base64,R0lGODlhFgAWAIQSAB1ChBFNsRJTySJYwjljwkxwl19vj1dusYODhl6MnHmOrpqbmpGjuaezxrCztcDCxL/I18rL1P///////////////////////////////////////////////////////yH5BAEAAB8ALAAAAAAWABYAAAVu4CeOZGmeaKqubDs6TNnEbGNApNG0kbGMi5trwcA9GArXh+FAfBAw5UexUDAQESkRsfhJPwaH4YsEGAAJGisRGAQY7UCC9ZAXBB+74LGCRxIEHwAHdWooDgGJcwpxDisQBQRjIgkDCVlfmZqbmiEAOw==" },
                    { id: "COPY", formatting: "copy", iconUrl: "data:image/gif;base64,R0lGODlhFgAWAIQcAB1ChBFNsTRLYyJYwjljwl9vj1iE31iGzF6MnHWX9HOdz5GjuYCl2YKl8ZOt4qezxqK63aK/9KPD+7DI3b/I17LM/MrL1MLY9NHa7OPs++bx/Pv8/f///////////////yH5BAEAAB8ALAAAAAAWABYAAAWG4CeOZGmeaKqubOum1SQ/kPVOW749BeVSus2CgrCxHptLBbOQxCSNCCaF1GUqwQbBd0JGJAyGJJiobE+LnCaDcXAaEoxhQACgNw0FQx9kP+wmaRgYFBQNeAoGihCAJQsCkJAKOhgXEw8BLQYciooHf5o7EA+kC40qBKkAAAGrpy+wsbKzIiEAOw==" },
                    { id: "PASTE", formatting: "paste", iconUrl: "data:image/gif;base64,R0lGODlhFgAWAIQUAD04KTRLY2tXQF9vj414WZWIbXmOrpqbmpGjudClFaezxsa0cb/I1+3YitHa7PrkIPHvbuPs+/fvrvv8/f///////////////////////////////////////////////yH5BAEAAB8ALAAAAAAWABYAAAWN4CeOZGmeaKqubGsusPvBSyFJjVDs6nJLB0khR4AkBCmfsCGBQAoCwjF5gwquVykSFbwZE+AwIBV0GhFog2EwIDchjwRiQo9E2Fx4XD5R+B0DDAEnBXBhBhN2DgwDAQFjJYVhCQYRfgoIDGiQJAWTCQMRiwwMfgicnVcAAAMOaK+bLAOrtLUyt7i5uiUhADs=" },
                    { id: "CLEAN", formatting: "removeFormat", iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABGdBTUEAALGPC/xhBQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB9oECQMCKPI8CIIAAAAIdEVYdENvbW1lbnQA9syWvwAAAuhJREFUOMtjYBgFxAB501ZWBvVaL2nHnlmk6mXCJbF69zU+Hz/9fB5O1lx+bg45qhl8/fYr5it3XrP/YWTUvvvk3VeqGXz70TvbJy8+Wv39+2/Hz19/mGwjZzuTYjALuoBv9jImaXHeyD3H7kU8fPj2ICML8z92dlbtMzdeiG3fco7J08foH1kurkm3E9iw54YvKwuTuom+LPt/BgbWf3//sf37/1/c02cCG1lB8f//f95DZx74MTMzshhoSm6szrQ/a6Ir/Z2RkfEjBxuLYFpDiDi6Af///2ckaHBp7+7wmavP5n76+P2ClrLIYl8H9W36auJCbCxM4szMTJac7Kza////R3H1w2cfWAgafPbqs5g7D95++/P1B4+ECK8tAwMDw/1H7159+/7r7ZcvPz4fOHbzEwMDwx8GBgaGnNatfHZx8zqrJ+4VJBh5CQEGOySEua/v3n7hXmqI8WUGBgYGL3vVG7fuPK3i5GD9/fja7ZsMDAzMG/Ze52mZeSj4yu1XEq/ff7W5dvfVAS1lsXc4Db7z8C3r8p7Qjf///2dnZGxlqJuyr3rPqQd/Hhyu7oSpYWScylDQsd3kzvnH738wMDzj5GBN1VIWW4c3KDon7VOvm7S3paB9u5qsU5/x5KUnlY+eexQbkLNsErK61+++VnAJcfkyMTIwffj0QwZbJDKjcETs1Y8evyd48toz8y/ffzv//vPP4veffxpX77z6l5JewHPu8MqTDAwMDLzyrjb/mZm0JcT5Lj+89+Ybm6zz95oMh7s4XbygN3Sluq4Mj5K8iKMgP4f0////fv77//8nLy+7MCcXmyYDAwODS9jM9tcvPypd35pne3ljdjvj26+H2dhYpuENikgfvQeXNmSl3tqepxXsqhXPyc666s+fv1fMdKR3TK72zpix8nTc7bdfhfkEeVbC9KhbK/9iYWHiErbu6MWbY/7//8/4//9/pgOnH6jGVazvFDRtq2VgiBIZrUTIBgCk+ivHvuEKwAAAAABJRU5ErkJggg==" },
                    { id: "BOLD", formatting: "bold", iconUrl: "data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAInhI+pa+H9mJy0LhdgtrxzDG5WGFVk6aXqyk6Y9kXvKKNuLbb6zgMFADs=" },
                    { id: "ITALIC", formatting: "italic", iconUrl: "data:image/gif;base64,R0lGODlhFgAWAKEDAAAAAF9vj5WIbf///yH5BAEAAAMALAAAAAAWABYAAAIjnI+py+0Po5x0gXvruEKHrF2BB1YiCWgbMFIYpsbyTNd2UwAAOw==" },
                    { id: "UNDERLINE", formatting: "underline", iconUrl: "data:image/gif;base64,R0lGODlhFgAWAKECAAAAAF9vj////////yH5BAEAAAIALAAAAAAWABYAAAIrlI+py+0Po5zUgAsEzvEeL4Ea15EiJJ5PSqJmuwKBEKgxVuXWtun+DwxCCgA7" },
                    { id: "ALIGN_LEFT", formatting: "justifyleft", iconUrl: "data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JMGELkGYxo+qzl4nKyXAAAOw==" },
                    { id: "ALIGN_CENTER", formatting: "justifycenter", iconUrl: "data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIfhI+py+0Po5y02ouz3jL4D4JOGI7kaZ5Bqn4sycVbAQA7" },
                    { id: "ALIGN_RIGHT", formatting: "justifyright", iconUrl: "data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JQGDLkGYxouqzl43JyVgAAOw==" },
                    { id: "LIST_NUMBERED", formatting: "insertorderedlist", iconUrl: "data:image/gif;base64,R0lGODlhFgAWAMIGAAAAADljwliE35GjuaezxtHa7P///////yH5BAEAAAcALAAAAAAWABYAAAM2eLrc/jDKSespwjoRFvggCBUBoTFBeq6QIAysQnRHaEOzyaZ07Lu9lUBnC0UGQU1K52s6n5oEADs=" },
                    { id: "LIST_BULLETS", formatting: "insertunorderedlist", iconUrl: "data:image/gif;base64,R0lGODlhFgAWAMIGAAAAAB1ChF9vj1iE33mOrqezxv///////yH5BAEAAAcALAAAAAAWABYAAAMyeLrc/jDKSesppNhGRlBAKIZRERBbqm6YtnbfMY7lud64UwiuKnigGQliQuWOyKQykgAAOw==" },
                    { id: "QUOTE", formatting: "formatblock','blockquote", iconUrl: "data:image/gif;base64,R0lGODlhFgAWAIQXAC1NqjFRjkBgmT9nqUJnsk9xrFJ7u2R9qmKBt1iGzHmOrm6Sz4OXw3Odz4Cl2ZSnw6KxyqO306K63bG70bTB0rDI3bvI4P///////////////////////////////////yH5BAEKAB8ALAAAAAAWABYAAAVP4CeOZGmeaKqubEs2CekkErvEI1zZuOgYFlakECEZFi0GgTGKEBATFmJAVXweVOoKEQgABB9IQDCmrLpjETrQQlhHjINrTq/b7/i8fp8PAQA7" },
                    { id: "INDENT", formatting: "outdent", iconUrl: "data:image/gif;base64,R0lGODlhFgAWAMIHAAAAADljwliE35GjuaezxtDV3NHa7P///yH5BAEAAAcALAAAAAAWABYAAAM2eLrc/jDKCQG9F2i7u8agQgyK1z2EIBil+TWqEMxhMczsYVJ3e4ahk+sFnAgtxSQDqWw6n5cEADs=" },
                    { id: "OUTDENT", formatting: "indent", iconUrl: "data:image/gif;base64,R0lGODlhFgAWAOMIAAAAADljwl9vj1iE35GjuaezxtDV3NHa7P///////////////////////////////yH5BAEAAAgALAAAAAAWABYAAAQ7EMlJq704650B/x8gemMpgugwHJNZXodKsO5oqUOgo5KhBwWESyMQsCRDHu9VOyk5TM9zSpFSr9gsJwIAOw==" }
                ];
                HtmlEditor.INSERT_BUTTON_TYPES = [
                    { id: "HYPERLINK", formatting: "createlink", promptText: "Target URL:", iconUrl: "data:image/gif;base64,R0lGODlhFgAWAOMKAB1ChDRLY19vj3mOrpGjuaezxrCztb/I19Ha7Pv8/f///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARY8MlJq7046827/2BYIQVhHg9pEgVGIklyDEUBy/RlE4FQF4dCj2AQXAiJQDCWQCAEBwIioEMQBgSAFhDAGghGi9XgHAhMNoSZgJkJei33UESv2+/4vD4TAQA7" },
                    { id: "IMAGE", formatting: "insertImage", promptText: "Image URL:", iconUrl: "data:image/gif;base64,R0lGODlhFgAWAOMKAB1ChDRLY19vj3mOrpGjuaezxrCztb/I19Ha7Pv8/f///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARY8MlJq7046827/2BYIQVhHg9pEgVGIklyDEUBy/RlE4FQF4dCj2AQXAiJQDCWQCAEBwIioEMQBgSAFhDAGghGi9XgHAhMNoSZgJkJei33UESv2+/4vD4TAQA7" }
                ];
                return HtmlEditor;
            }(kr3m.ui.Element));
            ex.HtmlEditor = HtmlEditor;
        })(ex = ui.ex || (ui.ex = {}));
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var omni;
(function (omni) {
    var screens;
    (function (screens) {
        var HtmlEditor = (function (_super) {
            __extends(HtmlEditor, _super);
            function HtmlEditor(manager) {
                var _this = _super.call(this, manager, "htmlEditor") || this;
                var buttons = new kr3m.ui.Element(_this);
                new omni.ui.Button(buttons, "SAVE", function () { return _this.save(); });
                _this.editor = new kr3m.ui.ex.HtmlEditor(_this);
                return _this;
            }
            HtmlEditor.prototype.save = function () {
                this.clearDownloads();
                var helper = new kr3m.html.Helper();
                var html = kr3m.util.StringEx.BOM + helper.wrapHtml(this.editor.getHtml());
                this.addDownload(this.fileName + ".html", html, "text/html;charset=utf-8");
            };
            HtmlEditor.prototype.handleDroppedFiles = function (files) {
                var _this = this;
                for (var i = 0; i < files.length; ++i) {
                    if (files[i].mimeType == "text/html") {
                        this.setFileName(files[i].name);
                        files[i].getTextContent(function (content) { return _this.editor.setHtml(content); });
                        break;
                    }
                }
            };
            return HtmlEditor;
        }(omni.AbstractScreen));
        screens.HtmlEditor = HtmlEditor;
    })(screens = omni.screens || (omni.screens = {}));
})(omni || (omni = {}));
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
            }
            Generator.prototype.collectKeys = function () {
                this.keys = [];
                for (var i = 0; i < this.json.length; ++i)
                    this.keys = kr3m.util.Util.merge(this.keys, Object.keys(this.json[i]));
            };
            Generator.prototype.escape = function (value) {
                var text = (value !== undefined && value !== null) ? value.toString() : "";
                var quote = this.quoteAll || text.indexOf(this.seperator) >= 0 || text.indexOf(this.quotation) >= 0 || text.indexOf(this.newLine) >= 0;
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
        function generateString(json) {
            var generator = new Generator();
            return generator.generate(json);
        }
        csv_1.generateString = generateString;
    })(csv = kr3m.csv || (kr3m.csv = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var csv;
    (function (csv) {
        var Parser = (function () {
            function Parser() {
                this.readKeys = true;
                this.seperator = ";";
                this.quotation = "\"";
            }
            Parser.prototype.eat = function () {
                return this.rawCsv.charAt(this.i++);
            };
            Parser.prototype.skipSeperator = function () {
                if (this.rawCsv.charAt(this.i) == this.seperator)
                    ++this.i;
            };
            Parser.prototype.unescape = function (text) {
                var token = this.quotation + this.quotation;
                var pos = -1;
                while ((pos = text.indexOf(token, pos + 1)) >= 0)
                    text = text.slice(0, pos) + text.slice(pos + 1);
                return text;
            };
            Parser.prototype.readRawValue = function () {
                var inQuotes = false;
                var t;
                var start = this.i;
                while (t = this.eat()) {
                    if (t == this.quotation) {
                        if (inQuotes) {
                            if (this.rawCsv.charAt(this.i) != this.quotation) {
                                var end = this.i - 1;
                                this.skipSeperator();
                                this.knownNewLine = this.i;
                                return this.rawCsv.slice(start, end);
                            }
                            else {
                                ++this.i;
                            }
                        }
                        else {
                            inQuotes = true;
                            start = this.i;
                        }
                    }
                    else if (t == this.seperator) {
                        if (!inQuotes) {
                            var end = this.i - 1;
                            return this.rawCsv.slice(start, end);
                        }
                    }
                    else if (t == "\r" || t == "\n") {
                        if (!inQuotes) {
                            --this.i;
                            var unknown = this.knownNewLine != this.i;
                            this.knownNewLine = this.i;
                            return (start < this.i) ? this.rawCsv.slice(start, this.i) : unknown ? "" : undefined;
                        }
                    }
                    else if (!t) {
                        return (start < this.i) ? this.rawCsv.slice(start, this.i - 1) : undefined;
                    }
                }
                return (start < this.i - 1) ? this.rawCsv.slice(start, this.i - 1) : undefined;
            };
            Parser.prototype.skipNewline = function () {
                while (this.rawCsv.charAt(this.i) == "\r" || this.rawCsv.charAt(this.i) == "\n")
                    ++this.i;
            };
            Parser.prototype.readLine = function () {
                this.skipNewline();
                var line = [];
                var value;
                while ((value = this.readRawValue()) !== undefined)
                    line.push(this.unescape(value));
                return line;
            };
            Parser.prototype.parse = function (rawCsv) {
                this.rawCsv = rawCsv;
                this.i = 0;
                this.knownNewLine = -1;
                var result = [];
                var line;
                if (this.readKeys) {
                    var keys = this.readLine();
                    while ((line = this.readLine()).length) {
                        if (line.length != keys.length) {
                            logError(keys);
                            logError(line);
                            throw new Error("syntax error in csv string: value count doesn't match key count");
                        }
                        var obj = {};
                        for (var i = 0; i < keys.length; ++i)
                            kr3m.util.Util.setProperty(obj, keys[i], line[i]);
                        result.push(obj);
                    }
                }
                else {
                    while ((line = this.readLine()).length)
                        result.push(line);
                }
                return result;
            };
            return Parser;
        }());
        csv.Parser = Parser;
        function parseString(rawCsv) {
            var parser = new kr3m.csv.Parser();
            return parser.parse(rawCsv);
        }
        csv.parseString = parseString;
    })(csv = kr3m.csv || (kr3m.csv = {}));
})(kr3m || (kr3m = {}));
var omni;
(function (omni) {
    var ui;
    (function (ui) {
        var Button = (function (_super) {
            __extends(Button, _super);
            function Button(parent, captionId, clickListener) {
                var _this = _super.call(this, parent, loc(captionId), clickListener) || this;
                _this.addClass("button");
                return _this;
            }
            return Button;
        }(kr3m.ui.FormButton));
        ui.Button = Button;
    })(ui = omni.ui || (omni.ui = {}));
})(omni || (omni = {}));
var omni;
(function (omni) {
    var widgets;
    (function (widgets) {
        var PodTable = (function (_super) {
            __extends(PodTable, _super);
            function PodTable(parent) {
                var _this = _super.call(this, parent) || this;
                _this.hiddenColumns = [];
                _this.addClass("podTable");
                _this.setData([]);
                return _this;
            }
            PodTable.prototype.getKeys = function () {
                return this.keys.slice();
            };
            PodTable.prototype.sortBy = function (key, ascending) {
                if (ascending === void 0) { ascending = true; }
                var p = this.keys.indexOf(key);
                if (p < 0)
                    return;
                kr3m.util.Util.sortBy(this.data, p.toString(), ascending);
            };
            PodTable.prototype.getVisibleColumns = function () {
                var cols = [];
                for (var i = 0; i < this.keys.length; ++i) {
                    if (!this.hiddenColumns[i])
                        cols.push(this.keys[i]);
                }
                return cols;
            };
            PodTable.prototype.setVisibleColumns = function (visible) {
                for (var i = 0; i < this.keys.length; ++i)
                    this.hiddenColumns[i] = visible.indexOf(this.keys[i]) < 0;
                this.redraw();
            };
            PodTable.prototype.deleteColumns = function (columns) {
                for (var i = 0; i < columns.length; ++i) {
                    var colId = this.keys.indexOf(columns[i]);
                    if (colId < 0)
                        continue;
                    this.keys.splice(colId, 1);
                    for (var j = 0; j < this.data.length; ++j)
                        this.data[j].splice(colId, 1);
                    if (this.hiddenColumns.length > colId)
                        this.hiddenColumns.splice(colId, 1);
                }
                this.redraw();
            };
            PodTable.prototype.addEditableHeaders = function (captions, inputListener) {
                var escaped = [];
                for (var i = 0; i < captions.length; ++i) {
                    if (!this.hiddenColumns[i])
                        escaped.push(kr3m.util.Util.encodeHtml(captions[i].toString()));
                }
                return _super.prototype.addEditableHeaders.call(this, escaped, inputListener);
            };
            PodTable.prototype.addEditableRow = function (values, inputListener) {
                var escaped = [];
                for (var i = 0; i < values.length; ++i) {
                    if (!this.hiddenColumns[i])
                        escaped.push(kr3m.util.Util.encodeHtml(values[i].toString()));
                }
                return _super.prototype.addEditableRow.call(this, escaped, inputListener);
            };
            PodTable.prototype.redraw = function () {
                this.removeAllChildren();
                this.addEditableHeaders(this.keys, this.onHeaderChanged.bind(this));
                for (var i = 0; i < this.data.length; ++i)
                    this.addEditableRow(this.data[i], this.onValueChanged.bind(this, i));
            };
            PodTable.prototype.adjustOffset = function (offset) {
                for (var i = 0; i <= offset; ++i) {
                    if (this.hiddenColumns[i])
                        ++offset;
                }
                return offset;
            };
            PodTable.prototype.escape = function (text) {
                return text;
            };
            PodTable.prototype.onHeaderChanged = function (offset, cell) {
                offset = this.adjustOffset(offset);
                this.keys[offset] = this.escape(cell.getText());
            };
            PodTable.prototype.onValueChanged = function (row, col, cell) {
                col = this.adjustOffset(col);
                this.data[row][col] = this.escape(cell.getText());
            };
            PodTable.prototype.addKey = function (key) {
                key = key || "col" + this.freeColId++;
                if (kr3m.util.Util.contains(this.keys, key))
                    return;
                this.keys.push(key);
                for (var i = 0; i < this.data.length; ++i)
                    this.data[i].push("");
                this.redraw();
            };
            PodTable.prototype.addEntry = function (newEntry, redraw) {
                if (redraw === void 0) { redraw = true; }
                var entry = [];
                if (newEntry) {
                    for (var i = 0; i < this.keys.length; ++i) {
                        var value = newEntry[this.keys[i]] !== undefined ? newEntry[this.keys[i]] : "";
                        entry.push(value);
                    }
                }
                else {
                    for (var i = 0; i < this.keys.length; ++i)
                        entry.push("");
                }
                this.data.unshift(entry);
                if (redraw)
                    this.redraw();
            };
            PodTable.prototype.upsert = function (newEntry, key) {
                if (key === void 0) { key = "id"; }
                for (var field in newEntry) {
                    if (!kr3m.util.Util.contains(this.keys, field))
                        this.addKey(field);
                }
                var entry = [];
                for (var i = 0; i < this.keys.length; ++i)
                    entry.push(newEntry[this.keys[i]]);
                var p = this.keys.indexOf(key);
                var updated = false;
                for (var i = 0; i < this.data.length; ++i) {
                    if (this.data[i][p] == entry[p]) {
                        for (var j = 0; j < entry.length; ++j) {
                            if (entry[j] !== undefined)
                                this.data[i][j] = entry[j];
                        }
                        updated = true;
                    }
                }
                if (!updated)
                    this.addEntry(newEntry, false);
            };
            PodTable.prototype.collectKeys = function () {
                var u = kr3m.util.Util;
                this.keys = [];
                for (var i = 0; i < this.data.length; ++i) {
                    var rowKeys = Object.keys(this.data[i]);
                    for (var j = 0; j < rowKeys.length; ++j) {
                        var value = u.getProperty(this.data[i], rowKeys[j]);
                        if (typeof value == "object") {
                            if (Array.isArray(value)) {
                                rowKeys[j] += "[]";
                            }
                            else {
                                var subKeys = Object.keys(value).map(function (old) { return rowKeys[j] + "." + old; });
                                rowKeys = rowKeys.slice(0, j).concat(subKeys).concat(rowKeys.slice(j + 1));
                            }
                        }
                    }
                    this.keys = kr3m.util.Util.merge(this.keys, rowKeys);
                }
                for (var i = 0; i < this.keys.length; ++i) {
                    if (this.keys[i].charAt(0) == "_")
                        this.keys.splice(i--, 1);
                    else if (this.keys[i].indexOf("._") >= 0)
                        this.keys.splice(i--, 1);
                }
            };
            PodTable.prototype.unmap = function () {
                var u = kr3m.util.Util;
                for (var i = 0; i < this.data.length; ++i) {
                    var values = [];
                    for (var j = 0; j < this.keys.length; ++j) {
                        if (this.keys[j].slice(-2) == "[]" && Array.isArray(this.data[i]))
                            var value = u.getProperty(this.data[i], this.keys[j].slice(0, -2)).join(", ");
                        else
                            var value = u.getProperty(this.data[i], this.keys[j]);
                        values.push(value);
                    }
                    this.data[i] = values;
                }
            };
            PodTable.prototype.setData = function (data) {
                this.freeColId = 1;
                this.hiddenColumns = [];
                this.data = data;
                this.collectKeys();
                this.unmap();
                this.redraw();
            };
            PodTable.prototype.adjustType = function (value) {
                if (typeof value != "string")
                    return value;
                if (value == "true")
                    return true;
                if (value == "false")
                    return false;
                if (kr3m.util.Validator.isFloat(value)) {
                    var float = parseFloat(value);
                    if (!isNaN(float))
                        return float;
                }
                return value;
            };
            PodTable.prototype.getData = function (flatten) {
                var _this = this;
                if (flatten === void 0) { flatten = true; }
                var U = kr3m.util.Util;
                var result = [];
                for (var i = 0; i < this.data.length; ++i) {
                    var entry = {};
                    for (var j = 0; j < this.keys.length; ++j) {
                        var value = this.data[i][j] !== undefined ? this.data[i][j] : "";
                        if (flatten && this.keys[j].slice(-2) == "[]") {
                            var values = value.split(",").filter(function (v) { return v; }).map(function (v) { return _this.adjustType(v.trim()); });
                            U.setProperty(entry, this.keys[j].slice(0, -2), values);
                        }
                        else {
                            value = this.adjustType(value);
                            if (flatten)
                                U.setProperty(entry, this.keys[j], value);
                            else
                                entry[this.keys[j]] = value;
                        }
                    }
                    result.push(entry);
                }
                return result;
            };
            return PodTable;
        }(kr3m.ui.Table));
        widgets.PodTable = PodTable;
    })(widgets = omni.widgets || (omni.widgets = {}));
})(omni || (omni = {}));
var omni;
(function (omni) {
    var screens;
    (function (screens) {
        var Localization = (function (_super) {
            __extends(Localization, _super);
            function Localization(manager) {
                var _this = _super.call(this, manager, "localization") || this;
                _this.addClass("podTable");
                _this.fileName = "localization";
                var buttons = new kr3m.ui.Element(_this);
                _this.table = new omni.widgets.PodTable(_this);
                new omni.ui.Button(buttons, "NEW", function () { return _this.table.setData([{ id: "APP_TITLE", de: "Anwendungsname" }]); });
                new omni.ui.Button(buttons, "ADD_LANGUAGE", function () { return _this.table.addKey(); });
                new omni.ui.Button(buttons, "ADD_STRING", function () { return _this.table.addEntry(); });
                new omni.ui.Button(buttons, "SAVE", function () { return _this.save(); });
                _this.onHotkey("s", function () { return _this.save(); });
                _this.table.setData([{ id: "APP_TITLE", de: "Anwendungsname" }]);
                return _this;
            }
            Localization.prototype.generateLuaContent = function (data) {
                var lua = kr3m.util.StringEx.BOM;
                if (data.length == 0)
                    return lua;
                for (var lang in data[0]) {
                    if (lang != "id") {
                        var locale = lang.length > 2 ? lang : lang.toLowerCase() + lang.toUpperCase();
                        lua += "if GetLocale() == \"" + locale + "\" then\n";
                        for (var i = 0; i < data.length; ++i)
                            lua += "\t" + data[i].id + " = \"" + data[i][lang] + "\"\n";
                        lua += "end\n\n\n\n";
                    }
                }
                return lua;
            };
            Localization.prototype.save = function () {
                this.clearDownloads();
                var data = this.table.getData();
                data.sort(function (a, b) { return (a.id || "").toLowerCase().localeCompare((b.id || "").toLowerCase()); });
                var byLang = {};
                for (var lang in data[0])
                    byLang[lang] = kr3m.util.Util.gather(data, lang);
                var ids = byLang["id"] || [];
                var count = ids.length;
                for (var lang in byLang) {
                    if (lang == "id")
                        continue;
                    var xml = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<texts>\n";
                    for (var i = 0; i < count; ++i)
                        xml += "\t<text id=\"" + ids[i] + "\"><![CDATA[" + byLang[lang][i] + "]]></text>\n";
                    xml += "</texts>";
                    this.addDownload("lang_" + lang + ".xml", xml, "text/xml;charset=utf-8");
                    var json = {};
                    for (var i = 0; i < count; ++i)
                        json[ids[i]] = byLang[lang][i];
                    this.addDownload("lang_" + lang + ".json", kr3m.util.Json.encodeNice(json), "text/json;charset=utf-8");
                }
                var csv = kr3m.util.StringEx.BOM + kr3m.csv.generateString(data);
                this.addDownload(this.fileName + ".csv", csv, "text/csv;charset=utf-8");
                var lua = this.generateLuaContent(data);
                this.addDownload(this.fileName + ".lua", lua, "text/lua;charset=utf-8");
            };
            Localization.prototype.handleDroppedJson = function (fileName, content, changes, callback) {
                var pat = /^lang_(\w\w)\.json$/i;
                var matches = fileName.match(pat);
                if (!matches)
                    return callback();
                var lang = matches ? matches[1] : "xx";
                var data = kr3m.util.Json.decode(content);
                if (!data)
                    return callback();
                for (var id in data) {
                    var change = kr3m.util.Util.getBy(changes, "id", id);
                    if (!change) {
                        change = { id: id };
                        changes.push(change);
                    }
                    change[lang] = data[id];
                }
                callback();
            };
            Localization.prototype.handleDroppedXml = function (fileName, content, changes, callback) {
                var pat = /^lang_(\w\w)\.xml$/i;
                var matches = fileName.match(pat);
                if (!matches)
                    return callback();
                var lang = matches ? matches[1] : "xx";
                var texts = kr3m.xml.parseString(content);
                if (!texts || !texts.text)
                    return callback();
                texts = texts.text;
                for (var i = 0; i < texts.length; ++i) {
                    var id = texts[i]._attributes.id;
                    var value = texts[i]._data;
                    var change = kr3m.util.Util.getBy(changes, "id", id);
                    if (!change) {
                        change = { id: id };
                        changes.push(change);
                    }
                    change[lang] = value;
                }
                callback();
            };
            Localization.prototype.handleDroppedCsv = function (fileName, content, changes, callback) {
                var pat = /\.csv$/i;
                var matches = fileName.match(pat);
                if (!matches)
                    return callback();
                var data = kr3m.csv.parseString(content);
                if (!data)
                    return callback();
                for (var i = 0; i < data.length; ++i) {
                    var id = data[i].id;
                    var change = kr3m.util.Util.getBy(changes, "id", id);
                    if (!change) {
                        change = { id: id };
                        changes.push(change);
                    }
                    for (var lang in data[i])
                        change[lang] = data[i][lang];
                }
                callback();
            };
            Localization.prototype.handleDroppedFiles = function (files) {
                var _this = this;
                var changes = [];
                kr3m.async.Loop.forEach(files, function (file, next) {
                    file.getTextContent(function (content) {
                        var join = new kr3m.async.Join();
                        _this.handleDroppedJson(file.name, content, changes, join.getCallback());
                        _this.handleDroppedXml(file.name, content, changes, join.getCallback());
                        _this.handleDroppedCsv(file.name, content, changes, join.getCallback());
                        join.addCallback(next);
                    });
                }, function () {
                    for (var i = 0; i < changes.length; ++i)
                        _this.table.upsert(changes[i]);
                    _this.table.sortBy("id");
                    _this.table.redraw();
                });
            };
            return Localization;
        }(omni.AbstractScreen));
        screens.Localization = Localization;
    })(screens = omni.screens || (omni.screens = {}));
})(omni || (omni = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var ex;
        (function (ex) {
            var Checkbox = (function (_super) {
                __extends(Checkbox, _super);
                function Checkbox(parent, label, className) {
                    var _this = _super.call(this, parent, null, "div", { tabindex: "0" }) || this;
                    _this.addClass("checkbox");
                    if (className)
                        _this.addClass(className);
                    _this.box = new kr3m.ui.Element(_this, null, "span", { "class": "box" });
                    _this.label = new kr3m.ui.Textbox(_this, "", "label");
                    if (label)
                        _this.label.setHtml(label);
                    _this.on("click", _this.toggleChecked.bind(_this, true));
                    _this.on("keydown", _this.onKeyDown.bind(_this));
                    return _this;
                }
                Checkbox.prototype.onKeyDown = function (event) {
                    if (event.keyCode == 32)
                        this.toggleChecked(true);
                };
                Checkbox.prototype.getLabel = function () {
                    return this.label.getText();
                };
                Checkbox.prototype.toggleChecked = function (byUser, event) {
                    if (event && event.target["tagName"] == "A")
                        return;
                    if (byUser && this.isDisabled())
                        return;
                    this.setChecked(!this.isChecked());
                    if (byUser)
                        this.dom.trigger("change");
                };
                Checkbox.prototype.setChecked = function (value) {
                    if (value) {
                        this.addClass("checked");
                        this.box.addClass("checked");
                    }
                    else {
                        this.box.removeClass("checked");
                        this.removeClass("checked");
                    }
                };
                Checkbox.prototype.isChecked = function () {
                    return this.hasClass("checked");
                };
                return Checkbox;
            }(kr3m.ui.Element));
            ex.Checkbox = Checkbox;
        })(ex = ui.ex || (ui.ex = {}));
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var ex;
        (function (ex) {
            var CheckboxGroup = (function (_super) {
                __extends(CheckboxGroup, _super);
                function CheckboxGroup(parent, values, className) {
                    var _this = _super.call(this, parent) || this;
                    _this.boxes = {};
                    _this.sortValues = false;
                    _this.addClass("checkboxGroup");
                    if (className)
                        _this.addClass(className);
                    if (values)
                        _this.setValues(values);
                    return _this;
                }
                CheckboxGroup.prototype.setValues = function (values) {
                    this.boxes = {};
                    this.removeAllChildren();
                    var keys = Object.keys(values);
                    if (this.sortValues)
                        keys.sort(function (a, b) { return values[a].localeCompare(values[b]); });
                    for (var i = 0; i < keys.length; ++i) {
                        var box = new kr3m.ui.ex.Checkbox(this, values[keys[i]]);
                        this.boxes[keys[i]] = box;
                    }
                };
                CheckboxGroup.prototype.select = function (values) {
                    for (var i in this.boxes) {
                        var checked = kr3m.util.Util.contains(values, i);
                        this.boxes[i].setChecked(checked);
                    }
                };
                CheckboxGroup.prototype.getSelectedValues = function () {
                    var result = [];
                    for (var i in this.boxes) {
                        if (this.boxes[i].isChecked())
                            result.push(i);
                    }
                    return result;
                };
                return CheckboxGroup;
            }(kr3m.ui.Element));
            ex.CheckboxGroup = CheckboxGroup;
        })(ex = ui.ex || (ui.ex = {}));
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var xml;
    (function (xml) {
        var Generator = (function () {
            function Generator() {
                this.rootElementName = "root";
            }
            Generator.prototype.writeHeader = function () {
                this.xml += "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
            };
            Generator.prototype.indent = function () {
                this.prefix += "  ";
            };
            Generator.prototype.unindent = function () {
                this.prefix = this.prefix.slice(0, -2);
            };
            Generator.prototype.writeAttributes = function (attributes) {
                for (var i in attributes) {
                    var value = attributes[i].replace(/"/g, "\\\"");
                    this.xml += " " + i + "=\"" + value + "\"";
                }
            };
            Generator.prototype.writePrimitive = function (tag, value) {
                var escaped = (typeof value == "string") ? value.replace(/</g, "&lt;").replace(/>/g, "&gt;") : value;
                this.xml += this.prefix + "<" + tag + ">" + escaped + "</" + tag + ">\n";
            };
            Generator.prototype.writeCData = function (node) {
                this.xml += "<![CDATA[" + node._data + "]]>";
            };
            Generator.prototype.writeContent = function (node) {
                for (var tag in node) {
                    if (tag.charAt(0) != "_") {
                        if (node[tag].length !== undefined && typeof node[tag] != "string") {
                            for (var i = 0; i < node[tag].length; ++i) {
                                if (typeof node[tag][i] == "object")
                                    this.writeNode(node[tag][i], tag);
                                else
                                    this.writePrimitive(tag, node[tag][i]);
                            }
                        }
                        else if (typeof node[tag] == "object") {
                            this.writeNode(node[tag], tag);
                        }
                        else {
                            this.writePrimitive(tag, node[tag]);
                        }
                    }
                }
            };
            Generator.prototype.writeNode = function (node, fallbackTag) {
                var tag = node._tag || fallbackTag;
                this.xml += this.prefix + "<" + tag;
                if (node._attributes)
                    this.writeAttributes(node._attributes);
                this.xml += ">";
                if (node._data) {
                    this.writeCData(node);
                }
                else {
                    this.xml += "\n";
                    this.indent();
                    this.writeContent(node);
                    this.unindent();
                    this.xml += this.prefix;
                }
                this.xml += "</" + tag + ">\n";
            };
            Generator.prototype.generate = function (data) {
                if (typeof data != "object")
                    data = { data: data };
                this.prefix = "";
                this.xml = "";
                this.writeHeader();
                this.writeNode(data, this.rootElementName);
                return this.xml;
            };
            return Generator;
        }());
        xml.Generator = Generator;
        function generateString(data) {
            var generator = new Generator();
            return generator.generate(data);
        }
        xml.generateString = generateString;
    })(xml = kr3m.xml || (kr3m.xml = {}));
})(kr3m || (kr3m = {}));
var omni;
(function (omni) {
    var screens;
    (function (screens) {
        var PodTable = (function (_super) {
            __extends(PodTable, _super);
            function PodTable(manager) {
                var _this = _super.call(this, manager, "podTable") || this;
                _this.xmlRootName = "root";
                _this.xmlElementName = "item";
                _this.addClass("podTable");
                _this.fileName = "data";
                _this.tagsPopup = new kr3m.ui.Element(_this);
                _this.tagsPopup.addClass("tagsPopup");
                _this.tagsPopup.hide();
                var buttons = new kr3m.ui.Element(_this);
                _this.table = new omni.widgets.PodTable(_this);
                _this.table.setData([{ col0: "" }]);
                new omni.ui.Button(buttons, "NEW", function () { return _this.table.setData([{ col0: "" }]); });
                new omni.ui.Button(buttons, "ADD_ROW", function () { return _this.table.addEntry(); });
                new omni.ui.Button(buttons, "ADD_COL", function () { return _this.table.addKey(); });
                new omni.ui.Button(buttons, "VISIBLE_COLUMNS", function () { return _this.showHideColumnsPopup(); });
                _this.onHotkey("r", function () { return _this.showHideColumnsPopup(); });
                new omni.ui.Button(buttons, "DELETE_COLUMNS", function () { return _this.showDeleteColumnsPopup(); });
                new omni.ui.Button(buttons, "SAVE", function () { return _this.save(); });
                _this.onHotkey("s", function () { return _this.save(); });
                return _this;
            }
            PodTable.prototype.showHideColumnsPopup = function () {
                var _this = this;
                this.tagsPopup.removeAllChildren();
                var columns = this.table.getKeys();
                var visible = this.table.getVisibleColumns();
                var selected = [];
                for (var i = 0; i < visible.length; ++i)
                    selected.push(columns.indexOf(visible[i]).toString());
                var tags = new kr3m.ui.ex.CheckboxGroup(this.tagsPopup, columns);
                tags.select(selected);
                new omni.ui.CloseButton(this.tagsPopup, function () {
                    selected = tags.getSelectedValues();
                    visible = [];
                    for (var i = 0; i < selected.length; ++i)
                        visible.push(columns[selected[i]]);
                    _this.table.setVisibleColumns(visible);
                    _this.closeAsPopup(_this.tagsPopup);
                });
                this.showAsPopup(this.tagsPopup);
            };
            PodTable.prototype.showDeleteColumnsPopup = function () {
                var _this = this;
                this.tagsPopup.removeAllChildren();
                var columns = this.table.getKeys();
                var tags = new kr3m.ui.ex.CheckboxGroup(this.tagsPopup, columns);
                new omni.ui.CloseButton(this.tagsPopup, function () {
                    var selected = tags.getSelectedValues();
                    var deleted = [];
                    for (var i = 0; i < selected.length; ++i)
                        deleted.push(columns[selected[i]]);
                    _this.table.deleteColumns(deleted);
                    _this.closeAsPopup(_this.tagsPopup);
                });
                this.showAsPopup(this.tagsPopup);
            };
            PodTable.prototype.save = function () {
                this.clearDownloads();
                var data = this.table.getData(true);
                var json = kr3m.util.Json.encodeNice(data);
                this.addDownload(this.fileName + ".json", json, "text/json");
                var rootNode = {};
                rootNode._tag = this.xmlRootName;
                rootNode[this.xmlElementName] = data;
                var xml = kr3m.xml.generateString(rootNode);
                this.addDownload(this.fileName + ".xml", xml, "text/xml");
                var flatData = this.table.getData(false);
                var csv = kr3m.util.StringEx.BOM + kr3m.csv.generateString(flatData);
                this.addDownload(this.fileName + ".csv", csv, "text/csv;charset=utf-8");
            };
            PodTable.prototype.handleDroppedFiles = function (files) {
                var _this = this;
                var pat = /\.(xml|json|csv)$/i;
                kr3m.async.Loop.forEach(files, function (file, next) {
                    var matches = file.name.match(pat);
                    if (!matches)
                        return next();
                    var ext = matches ? matches[1] : "";
                    if (ext != "xml" && ext != "json" && ext != "csv")
                        return next();
                    _this.setFileName(file.name);
                    file.getTextContent(function (content) {
                        if (ext == "json") {
                            var data = kr3m.util.Json.decode(content);
                            if (data)
                                _this.table.setData(data);
                        }
                        else if (ext == "xml") {
                            var data = kr3m.xml.parseString(content);
                            if (data) {
                                for (var i in data) {
                                    if (i.charAt(0) != "_" && typeof data[i].length == "number") {
                                        _this.xmlRootName = data._tag;
                                        _this.xmlElementName = i;
                                        _this.table.setData(data[i]);
                                        return;
                                    }
                                }
                            }
                        }
                        else if (ext == "csv") {
                            var data = kr3m.csv.parseString(content);
                            if (data)
                                _this.table.setData(data);
                        }
                    });
                });
            };
            return PodTable;
        }(omni.AbstractScreen));
        screens.PodTable = PodTable;
    })(screens = omni.screens || (omni.screens = {}));
})(omni || (omni = {}));
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
            MimeTypes.isImage = function (filePathOrUrl) {
                return kr3m.net.MimeTypes.getMimeTypeByUrl(filePathOrUrl).substr(0, 6) == "image/";
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
        var ClientFile = (function () {
            function ClientFile(file, mimeType) {
                this.originalFile = file;
                this.name = file.name;
                this.lastModified = file.lastModifiedDate;
                this.size = file.size;
                this.mimeType = mimeType || file.type;
            }
            ClientFile.prototype.getDataUrl = function (callback) {
                var _this = this;
                if (this.dataUrl)
                    return callback(this.dataUrl);
                var reader = new FileReader();
                reader.onload = function (evt) {
                    _this.dataUrl = evt.target.result;
                    callback(_this.dataUrl);
                };
                reader.readAsDataURL(this.originalFile);
            };
            ClientFile.prototype.getTextContent = function (callback) {
                var _this = this;
                if (this.textContent)
                    return callback(this.textContent);
                var reader = new FileReader();
                reader.onload = function (evt) {
                    _this.textContent = evt.target.result;
                    callback(_this.textContent);
                };
                reader.readAsText(this.originalFile, "UTF-8");
            };
            return ClientFile;
        }());
        util.ClientFile = ClientFile;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var ui;
    (function (ui) {
        var ex;
        (function (ex) {
            var FileDropArea = (function (_super) {
                __extends(FileDropArea, _super);
                function FileDropArea(parent, className, attributes) {
                    if (className === void 0) { className = ""; }
                    if (attributes === void 0) { attributes = {}; }
                    var _this = _super.call(this, parent, null, "div", attributes) || this;
                    _this.dropListeners = [];
                    _this.acceptPattern = /^.+$/;
                    _this.sizeLimit = 1024 * 1024;
                    if (className)
                        _this.addClass(className);
                    _this.on("dragover", _this.handleDragOver.bind(_this));
                    _this.on("drop", _this.handleDrop.bind(_this));
                    return _this;
                }
                FileDropArea.isSupported = function () {
                    return !!(window["File"] && window["FileReader"] && window["FileList"] && window["Blob"]);
                };
                FileDropArea.prototype.accept = function (filter) {
                    filter = "^" + filter.replace(/\*/g, ".+") + "$";
                    this.acceptPattern = new RegExp(filter);
                };
                FileDropArea.prototype.setSizeLimit = function (limit) {
                    this.sizeLimit = limit;
                };
                FileDropArea.prototype.onDrop = function (listener) {
                    this.dropListeners.push(listener);
                };
                FileDropArea.prototype.handleDragOver = function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    evt.originalEvent["dataTransfer"].dropEffect = "copy";
                };
                FileDropArea.prototype.handleDrop = function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    var droppedFiles = [];
                    var files = evt.originalEvent["dataTransfer"].files;
                    for (var i = 0; i < files.length; ++i) {
                        if (this.sizeLimit && this.sizeLimit < files[i].size)
                            continue;
                        var mimeType = files[i].type || kr3m.net.MimeTypes.getMimeTypeByUrl(files[i].name);
                        if (!this.acceptPattern.test(mimeType))
                            continue;
                        droppedFiles.push(new kr3m.util.ClientFile(files[i], mimeType));
                    }
                    if (droppedFiles.length == 0)
                        return;
                    for (var i = 0; i < this.dropListeners.length; ++i)
                        this.dropListeners[i](droppedFiles);
                };
                return FileDropArea;
            }(kr3m.ui.Element));
            ex.FileDropArea = FileDropArea;
        })(ex = ui.ex || (ui.ex = {}));
    })(ui = kr3m.ui || (kr3m.ui = {}));
})(kr3m || (kr3m = {}));
var omni;
(function (omni) {
    var Edit = (function (_super) {
        __extends(Edit, _super);
        function Edit() {
            var _this = _super.call(this) || this;
            _this.callDelayed(function () {
                log("Version", omni.VERSION);
                var dropArea = new kr3m.ui.ex.FileDropArea(_this.base);
                dropArea.addClass("dropArea");
                _this.headerButtons = new kr3m.ui.Element(dropArea);
                _this.headerButtons.addClass("headerButtons");
                new kr3m.ui.Textbox(_this.headerButtons, loc("SELECT_MODE"));
                _this.screens = new kr3m.ui.ScreenManager(dropArea);
                new omni.screens.PodTable(_this.screens);
                new omni.screens.Localization(_this.screens);
                new omni.screens.DataUrl(_this.screens);
                new omni.screens.AdjustImage(_this.screens);
                new omni.screens.HtmlEditor(_this.screens);
                var names = _this.screens.getScreenNames();
                for (var i = 0; i < names.length; ++i) {
                    var captionId = "SCREEN_" + names[i].toUpperCase();
                    var button = new omni.ui.Button(_this.headerButtons, captionId, _this.showScreen.bind(_this, names[i]));
                    button.setAttribute("title", loc("TT_" + captionId));
                }
                dropArea.onDrop(function (files) {
                    var screen = _this.screens.getCurrentScreen();
                    if (screen)
                        screen.handleDroppedFiles(files);
                });
            });
            return _this;
        }
        Edit.prototype.showScreen = function (screenName) {
            this.headerButtons.hide();
            this.screens.showScreenByName(screenName);
        };
        return Edit;
    }(kr3m.app.Application));
    omni.Edit = Edit;
})(omni || (omni = {}));
var client = new omni.Edit();
client.run({ supportedLanguages: ["de"] });
