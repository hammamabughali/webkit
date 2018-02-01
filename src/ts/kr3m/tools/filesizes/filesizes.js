// Type definitions for Node.js v0.10.1
// Project: http://nodejs.org/
// Definitions by: Microsoft TypeScript <http://typescriptlang.org>, DefinitelyTyped <https://github.com/borisyankov/DefinitelyTyped>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
/// <reference path="../../kr3m/lib/external/node/node.d.pc.ts"/>
var constantsLib = require("constants");
var cryptoLib = require("crypto");
var fsLib = require("fs");
var httpLib = require("http");
var httpsLib = require("https");
var pathLib = require("path");
var querystringLib = require("querystring");
var urlLib = require("url");
var utilLib = require("util");
function debug() {
    var objs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objs[_i - 0] = arguments[_i];
    }
    for (var i = 0; i < objs.length; ++i) {
        console.log(utilLib.inspect(objs[i], { depth: null }));
    }
}
function decodeBase64EncodedString(base64) {
    return new Buffer(base64, 'base64').toString('utf8');
}
function encodeBase64EncodedString(raw) {
    return new Buffer(raw).toString('base64');
}
function getMd5Base64(data) {
    var algorithm = cryptoLib.createHash("md5");
    algorithm.update(data);
    var hash = algorithm.digest("base64");
    return hash;
}
function getMd5Hex(data) {
    var algorithm = cryptoLib.createHash("md5");
    algorithm.update(data);
    var hash = algorithm.digest("hex");
    return hash;
}
function getMemoryUseString() {
    var used = process.memoryUsage().heapUsed;
    if (used > 1073741824)
        return (used / 1073741824).toFixed(1) + " GB";
    if (used > 1048576)
        return (used / 1048576).toFixed(1) + " MB";
    if (used > 1024)
        return (used / 1024).toFixed(1) + " kB";
    return used + " B";
}
/// <reference path="../../kr3m/util/json.pc.ts"/>
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var StringEx = (function () {
            function StringEx() {
            }
            StringEx.stripBom = function (text) {
                if (text.slice(0, kr3m.util.StringEx.BOM.length) == kr3m.util.StringEx.BOM)
                    return text.slice(kr3m.util.StringEx.BOM.length);
                else
                    return text;
            };
            StringEx.literalReplace = function (haystack, needle, newValue) {
                return haystack.split(needle).join(newValue);
            };
            StringEx.replaceSuccessive = function (haystack, needle, newValue) {
                var old = null;
                while (old != haystack) {
                    old = haystack;
                    haystack = haystack.replace(needle, newValue);
                }
                return haystack;
            };
            StringEx.joinAssoc = function (obj, seperator, assignOperator) {
                if (seperator === void 0) { seperator = "&"; }
                if (assignOperator === void 0) { assignOperator = "="; }
                var parts = [];
                for (var i in obj)
                    parts.push(i + assignOperator + obj[i]);
                return parts.join(seperator);
            };
            StringEx.splitAssoc = function (text, seperator, assignOperator) {
                if (seperator === void 0) { seperator = "&"; }
                if (assignOperator === void 0) { assignOperator = "="; }
                var result = {};
                var parts = text.split(seperator);
                var pos;
                var key;
                var value;
                for (var i = 0; i < parts.length; ++i) {
                    pos = parts[i].indexOf(assignOperator);
                    key = parts[i].substring(0, pos);
                    value = parts[i].substring(pos + assignOperator.length);
                    result[key] = value;
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
                if (pos > 0)
                    return text.substr(0, pos);
                else
                    return text;
            };
            StringEx.getAfter = function (text, needle, fromFront) {
                if (fromFront === void 0) { fromFront = true; }
                var pos = fromFront ? text.indexOf(needle) : text.lastIndexOf(needle);
                if (pos >= 0)
                    return text.substr(pos + needle.length);
                else
                    return text;
            };
            StringEx.flip = function (test) {
                var result = "";
                for (var i = 0; i < test.length; ++i)
                    result = test.charAt(i) + result;
                return result;
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
                        var matches = options.match(/^([0\-\+]*)(\d*)\.?(\d*)$/);
                        if (!matches)
                            continue;
                        var padWith = (matches[1].indexOf("0") >= 0) ? "0" : " ";
                        var alignLeft = matches[1].indexOf("-") >= 0;
                        var alignCenter = matches[1].indexOf("+") >= 0;
                        var length = kr3m.util.StringEx.parseIntSafe(matches[2]);
                        var precision = kr3m.util.StringEx.parseIntSafe(matches[3]);
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
                                value = (precision > 0 ? values[j++].toFixed(precision) : values[j++]).toString();
                                break;
                            case "s":
                                value = values[j++].toString();
                                break;
                            case "j":
                                value = kr3m.util.Json.encode(values[j++]);
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
            StringEx.getVersionParts = function (version) {
                var parts = version.split(".");
                for (var i = 0; i < parts.length; ++i)
                    parts[i] = kr3m.util.StringEx.parseIntSafe(parts[i]);
                return parts;
            };
            StringEx.bigNumber = function (value) {
                if (typeof value != "number")
                    return value;
                var suffixes = ["", "k", "M", "G", "T", "P"];
                for (var i = 0; i < suffixes.length; ++i) {
                    if (value < 1000)
                        return value.toFixed(1) + suffixes[i];
                    else
                        value /= 1000;
                }
                value *= 1000;
                return value.toFixed(1) + suffixes[suffixes.length - 1];
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
            StringEx.getSizeString = function (size, useDual) {
                if (useDual === void 0) { useDual = true; }
                if (useDual)
                    var units = { B: 1024, kB: 1024, MB: 1024, GB: 1024, TB: 1024, PB: 1024, EB: 1024, ZB: 1024, YB: 1024, ALOT: 100000000 };
                else
                    var units = { B: 1000, kB: 1000, MB: 1000, GB: 1000, TB: 1000, PB: 1000, EB: 1000, ZB: 1000, YB: 1000, ALOT: 100000000 };
                var result = "";
                for (var unit in units) {
                    var amount = size % units[unit];
                    if (amount > 0)
                        result = amount + unit + " " + result;
                    size = Math.floor(size / units[unit]);
                }
                return result;
            };
            StringEx.getDurationString = function (duration) {
                var units = { ms: 1000, s: 60, m: 60, h: 24, d: 7, w: 52, y: 100, centuries: 10, millenia: 1000, ages: 100000000 };
                var result = "";
                for (var unit in units) {
                    var amount = duration % units[unit];
                    if (amount > 0)
                        result = amount + unit + " " + result;
                    duration = Math.floor(duration / units[unit]);
                }
                return result;
            };
            StringEx.BOM = "\ufeff";
            return StringEx;
        })();
        util.StringEx = StringEx;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var Map = (function () {
            function Map() {
                this.items = {};
            }
            Map.prototype.get = function (key) {
                return this.contains(key) ? this.items[key] : null;
            };
            Map.prototype.getKeyByValue = function (value) {
                for (var i in this.items)
                    if (this.items[i] == value)
                        return i;
                return null;
            };
            Map.prototype.set = function (key, value) {
                this.items[key] = value;
            };
            Map.prototype.unset = function (key) {
                if (this.contains(key))
                    delete this.items[key];
            };
            Map.prototype.isEmpty = function () {
                for (var i in this.items)
                    return false;
                return true;
            };
            Map.prototype.getFirstValue = function () {
                for (var i in this.items)
                    return this.items[i];
                return null;
            };
            Map.prototype.getFirstKey = function () {
                for (var i in this.items)
                    return i;
                return null;
            };
            Map.prototype.contains = function (key) {
                return typeof this.items[key] !== "undefined";
            };
            Map.prototype.forEach = function (callback) {
                for (var i in this.items)
                    callback(this.items[i], i);
            };
            Map.prototype.clone = function () {
                var result = new kr3m.util.Map();
                for (var i in this.items)
                    result.items[i] = this.items[i];
                return result;
            };
            Map.prototype.getKeys = function () {
                return Object.keys(this.items);
            };
            Map.prototype.reset = function () {
                this.items = {};
            };
            Map.prototype.clear = function () {
                this.items = {};
            };
            return Map;
        })();
        util.Map = Map;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var Set = (function () {
            function Set(items) {
                this.items = {};
                if (items) {
                    for (var i = 0; i < items.length; ++i)
                        this.add(items[i]);
                }
            }
            Set.prototype.toArray = function () {
                var result = [];
                for (var i in this.items)
                    result.push(this.items[i]);
                return result;
            };
            Set.prototype.getSize = function () {
                var size = 0;
                for (var i in this.items)
                    ++size;
                return size;
            };
            Set.prototype.join = function (seperator) {
                if (seperator === void 0) { seperator = ","; }
                return Object.keys(this.items).join(seperator);
            };
            Set.prototype.merge = function (s) {
                for (var i in s.items)
                    this.items[i] = s.items[i];
            };
            Set.prototype.isEmpty = function () {
                for (var i in this.items)
                    return false;
                return true;
            };
            Set.prototype.add = function (item) {
                this.items[item.toString()] = item;
            };
            Set.prototype.remove = function (item) {
                if (typeof this.items[item.toString()] !== "undefined")
                    delete this.items[item.toString()];
            };
            Set.prototype.contains = function (item) {
                return typeof this.items[item.toString()] !== "undefined";
            };
            Set.prototype.union = function (s) {
                var result = this.clone();
                for (var i in s.items)
                    result.items[i] = s.items[i];
                return result;
            };
            Set.prototype.difference = function (s) {
                var result = new kr3m.util.Set();
                for (var i in this.items)
                    if (!s.contains(i))
                        result.items[i] = this.items[i];
                return result;
            };
            Set.prototype.intersection = function (s) {
                var result = new kr3m.util.Set();
                for (var i in this.items)
                    if (s.contains(i))
                        result.items[i] = s.items[i];
                return result;
            };
            Set.prototype.forEach = function (callback) {
                for (var i in this.items)
                    callback(this.items[i]);
            };
            Set.prototype.getFirst = function () {
                for (var i in this.items)
                    return this.items[i];
                return undefined;
            };
            Set.prototype.clone = function () {
                var result = new kr3m.util.Set();
                for (var i in this.items)
                    result.items[i] = this.items[i];
                return result;
            };
            return Set;
        })();
        util.Set = Set;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
/// <reference path="../../kr3m/util/log.pc.ts"/>
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
                func.apply(null, params);
            }
            catch (e) {
                kr3m.util.Log.logError(e);
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
        func.apply(null, params);
    }
    catch (e) {
        kr3m.util.Log.logError(e);
    }
}
/// <reference path="../../kr3m/util/log.pc.ts"/>
/// <reference path="../../kr3m/util/map.pc.ts"/>
/// <reference path="../../kr3m/util/set.pc.ts"/>
/// <reference path="../../kr3m/util/trysafe.pc.ts"/>
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var Util = (function () {
            function Util() {
            }
            Util.clone = function (obj) {
                if (!obj || typeof obj != "object")
                    return obj;
                var result = typeof obj.length != "undefined" ? [] : obj.__proto__ ? Object.create(obj.__proto__) : {};
                var keys = Object.keys(obj);
                for (var i = 0; i < keys.length; ++i) {
                    if (typeof obj[keys[i]] == "object")
                        result[keys[i]] = kr3m.util.Util.clone(obj[keys[i]]);
                    else
                        result[keys[i]] = obj[keys[i]];
                }
                return result;
            };
            Util.encodeHtml = function (text) {
                return text
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
            };
            Util.decodeHtml = function (text) {
                var tokens = { amp: "&", lt: "<", gt: ">", quot: "\"" };
                text = text.replace(/&(#?\w+?);/g, function (all, captured) {
                    if (tokens[captured])
                        return tokens[captured];
                    if (captured.charAt(0) == "#")
                        return String.fromCharCode(parseInt(captured.slice(1)));
                    return all;
                });
                return text;
            };
            Util.indexOf = function (needle, haystack, strict) {
                if (strict === void 0) { strict = false; }
                if (!haystack || haystack.length <= 0)
                    return -1;
                for (var i = 0; i < haystack.length; ++i) {
                    if (haystack[i] === needle || (!strict && haystack[i] == needle))
                        return i;
                }
                return -1;
            };
            Util.contains = function (container, target, strict) {
                if (strict === void 0) { strict = false; }
                return kr3m.util.Util.indexOf(target, container, strict) > -1;
            };
            Util.remove = function (container, target, strict) {
                if (strict === void 0) { strict = false; }
                for (var i = 0; i < container.length; ++i) {
                    if (container[i] === target || (!strict && container[i] == target)) {
                        container.splice(i, 1);
                        return target;
                    }
                }
                return null;
            };
            Util.intersect = function () {
                var arrays = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    arrays[_i - 0] = arguments[_i];
                }
                var result = kr3m.util.Util.merge.apply(null, arrays);
                for (var i = 0; i < result.length; ++i) {
                    for (var j = 0; j < arrays.length; ++j) {
                        if (!kr3m.util.Util.contains(arrays[j], result[i])) {
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
                    arrays[_i - 0] = arguments[_i];
                }
                var result = [];
                for (var i = 0; i < arrays.length; ++i)
                    for (var j in arrays[i])
                        if (!kr3m.util.Util.contains(result, arrays[i][j]))
                            result.push(arrays[i][j]);
                return result;
            };
            Util.mergeAssoc = function () {
                var objects = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    objects[_i - 0] = arguments[_i];
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
            Util.setProperty = function (obj, propertyName, value) {
                var parts = propertyName.split(".");
                while (parts.length > 1) {
                    var key = parts.shift();
                    if (typeof obj[key] == "undefined") {
                        var index = kr3m.util.StringEx.parseIntSafe(parts[0], -1);
                        if (index >= 0) {
                            obj[key] = [];
                            for (var i = -1; i < index; ++i)
                                obj[key].push(undefined);
                        }
                        else {
                            obj[key] = {};
                        }
                    }
                    obj = obj[key];
                }
                obj[parts[0]] = value;
            };
            Util.getBy = function (objects, propertyName, propertyValue) {
                if (!objects)
                    return undefined;
                for (var i = 0; i < objects.length; ++i) {
                    if (kr3m.util.Util.getProperty(objects[i], propertyName) == propertyValue)
                        return objects[i];
                }
                return undefined;
            };
            Util.gather = function (objects, fieldName, filterFunc) {
                if (filterFunc === void 0) { filterFunc = null; }
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
                if (filterFunc === void 0) { filterFunc = null; }
                return kr3m.util.Util.removeDuplicates(kr3m.util.Util.gather(objects, fieldName, filterFunc));
            };
            Util.removeDuplicates = function (objects) {
                var result = [];
                var knownValues = {};
                for (var i = 0; i < objects.length; ++i) {
                    if (typeof knownValues[objects[i]] == "undefined") {
                        knownValues[objects[i]] = true;
                        result.push(objects[i]);
                    }
                }
                return result;
            };
            Util.arrayToAssoc = function (data, indexField) {
                if (indexField === void 0) { indexField = "id"; }
                var result = {};
                for (var i = 0; i < data.length; ++i)
                    result[data[i][indexField]] = data[i];
                return result;
            };
            Util.arrayToMap = function (data, indexField) {
                if (indexField === void 0) { indexField = "id"; }
                var result = new kr3m.util.Map();
                for (var i = 0; i < data.length; ++i) {
                    var key = kr3m.util.Util.getProperty(data[i], indexField);
                    result.set(key, data[i]);
                }
                return result;
            };
            Util.arrayToPairs = function (data, indexField, valueField) {
                var result = {};
                for (var i = 0; i < data.length; ++i)
                    result[data[i][indexField]] = data[i][valueField];
                return result;
            };
            Util.arrayToMapPairs = function (data, indexField, valueField) {
                var self = kr3m.util.Util;
                var result = new kr3m.util.Map();
                for (var i = 0; i < data.length; ++i) {
                    var key = self.getProperty(data[i], indexField);
                    var value = self.getProperty(data[i], valueField);
                    result.set(key, value);
                }
                return result;
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
            Util.removeMatching = function (values, matchFunc) {
                for (var i = 0; i < values.length; ++i) {
                    if (matchFunc(values[i])) {
                        values.splice(i, 1);
                        --i;
                    }
                }
            };
            Util.keepMatching = function (values, matchFunc) {
                for (var i = 0; i < values.length; ++i) {
                    if (!matchFunc(values[i])) {
                        values.splice(i, 1);
                        --i;
                    }
                }
            };
            Util.sortBy = function (values, field, ascending) {
                if (ascending === void 0) { ascending = true; }
                var self = kr3m.util.Util;
                var one = ascending ? 1 : -1;
                values.sort(function (a, b) {
                    var aValue = self.getProperty(a, field);
                    var bValue = self.getProperty(b, field);
                    return (aValue > bValue) ? one : (aValue < bValue) ? -one : 0;
                });
            };
            Util.sortIndicesBy = function (values, field, ascending) {
                if (ascending === void 0) { ascending = true; }
                var self = kr3m.util.Util;
                var one = ascending ? 1 : -1;
                var results = [];
                for (var i = 0; i < values.length; ++i)
                    results.push(i);
                results.sort(function (a, b) {
                    var aValue = self.getProperty(values[a], field);
                    var bValue = self.getProperty(values[b], field);
                    return (aValue > bValue) ? one : (aValue < bValue) ? -one : 0;
                });
                return results;
            };
            Util.bucketBy = function (values, field) {
                var buckets = {};
                for (var i = 0; i < values.length; ++i) {
                    var key = kr3m.util.Util.getProperty(values[i], field);
                    if (!buckets[key])
                        buckets[key] = [];
                    buckets[key].push(values[i]);
                }
                return buckets;
            };
            Util.bucketAssocBy = function (values, field) {
                var buckets = {};
                for (var i in values) {
                    var key = kr3m.util.Util.getProperty(values[i], field);
                    if (!buckets[key])
                        buckets[key] = [];
                    buckets[key].push(values[i]);
                }
                return buckets;
            };
            Util.forEachRecursive = function (obj, func) {
                if (!obj || typeof obj != "object")
                    return;
                var self = kr3m.util.Util;
                var workset = Object.keys(obj);
                while (workset.length > 0) {
                    var key = workset.pop();
                    var value = self.getProperty(obj, key);
                    var type = value ? typeof value : "null";
                    switch (type) {
                        case "object":
                            var subKeys = Object.keys(value);
                            for (var i = 0; i < subKeys.length; ++i)
                                workset.push(key + "." + subKeys[i]);
                            break;
                        default:
                            util.trySafe(func, key, value, obj);
                            break;
                    }
                }
            };
            Util.deepCompareDump = function (a, b) {
                if (typeof a != typeof b)
                    kr3m.util.Log.log("types do not match: " + typeof a + " <-> " + typeof b);
                var self = kr3m.util.Util;
                var equal = true;
                var knownProperties = new kr3m.util.Set();
                self.forEachRecursive(a, function (key, aValue) {
                    var bValue = self.getProperty(b, key);
                    if (typeof aValue != typeof bValue) {
                        kr3m.util.Log.log(key + "   types: " + typeof aValue + " <-> " + typeof bValue);
                        equal = false;
                    }
                    else if (typeof aValue != "object" && aValue != bValue) {
                        kr3m.util.Log.log(key + "   values: " + aValue + " <-> " + bValue);
                        equal = false;
                    }
                    knownProperties.add(key);
                });
                self.forEachRecursive(b, function (key, bValue) {
                    if (knownProperties.contains(key))
                        return;
                    var aValue = self.getProperty(a, key);
                    if (typeof aValue != typeof bValue) {
                        kr3m.util.Log.log(key + "   types: " + typeof aValue + " <-> " + typeof bValue);
                        equal = false;
                    }
                    else if (typeof bValue != "object" && aValue != bValue) {
                        kr3m.util.Log.log(key + "   values: " + aValue + " <-> " + bValue);
                        equal = false;
                    }
                    knownProperties.add(key);
                });
                if (equal)
                    kr3m.util.Log.log("objects are equal");
                else
                    kr3m.util.Log.log("objects are not equal");
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
                return null;
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
                return null;
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
            return Util;
        })();
        util.Util = Util;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
/// <reference path="../../kr3m/util/log.pc.ts"/>
/// <reference path="../../kr3m/util/stringex.pc.ts"/>
/// <reference path="../../kr3m/util/util.pc.ts"/>
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var Json = (function () {
            function Json() {
            }
            Json.encode = function (obj) {
                return JSON.stringify(obj);
            };
            Json.reviver = function (key, computed) {
                if (typeof computed == "string") {
                    var matches = computed.match(/^(\d\d\d\d)\-(\d\d)\-(\d\d)T(\d\d)\:(\d\d)\:(\d\d)\.?(\d\d\d)?Z$/);
                    if (matches) {
                        var date = new Date(0);
                        date.setUTCFullYear(kr3m.util.StringEx.parseIntSafe(matches[1]), kr3m.util.StringEx.parseIntSafe(matches[2]) - 1, kr3m.util.StringEx.parseIntSafe(matches[3]));
                        date.setUTCHours(kr3m.util.StringEx.parseIntSafe(matches[4]), kr3m.util.StringEx.parseIntSafe(matches[5]), kr3m.util.StringEx.parseIntSafe(matches[6]), kr3m.util.StringEx.parseIntSafe(matches[7]));
                        return date;
                    }
                }
                return computed;
            };
            Json.isJSON = function (text) {
                try {
                    JSON.parse(text);
                    return true;
                }
                catch (e) {
                    return false;
                }
            };
            Json.decode = function (json) {
                try {
                    return JSON.parse(json, kr3m.util.Json.reviver);
                }
                catch (e) {
                    return null;
                }
            };
            Json.mergeAssoc = function () {
                var jsons = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    jsons[_i - 0] = arguments[_i];
                }
                var objs = [];
                for (var i = 0; i < jsons.length; ++i)
                    objs.push(kr3m.util.Json.decode(jsons[i]));
                var result = kr3m.util.Util.mergeAssoc.apply(null, objs);
                return kr3m.util.Json.encode(result);
            };
            return Json;
        })();
        util.Json = Json;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
/// <reference path="../../kr3m/util/stringex.pc.ts"/>
var kr3m;
(function (kr3m) {
    var util;
    (function (util) {
        var Dates = (function () {
            function Dates() {
            }
            Dates.getDateString = function (date, useUTC) {
                if (useUTC === void 0) { useUTC = true; }
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
            Dates.getTimeString = function (date, useUTC) {
                if (useUTC === void 0) { useUTC = true; }
                if (useUTC) {
                    var result = "";
                    var hours = date.getUTCHours();
                    result += ((hours < 10) ? "0" + hours : "" + hours);
                    var minutes = date.getUTCMinutes();
                    result += ":" + ((minutes < 10) ? "0" + minutes : "" + minutes);
                    var seconds = date.getUTCSeconds();
                    result += ":" + ((seconds < 10) ? "0" + seconds : "" + seconds);
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
                    return result;
                }
            };
            Dates.getDateFromDateTimeString = function (value) {
                var matches = value.match(/^(\d\d\d\d)\-(\d\d)\-(\d\d)\D(\d\d)\:(\d\d)\:(\d\d)(\.(\d\d\d))?(Z)?$/);
                if (!matches)
                    return null;
                var date = new Date();
                if (matches[9] == "Z") {
                    date.setUTCFullYear(kr3m.util.StringEx.parseIntSafe(matches[1]), kr3m.util.StringEx.parseIntSafe(matches[2]) - 1, kr3m.util.StringEx.parseIntSafe(matches[3]));
                    date.setUTCHours(kr3m.util.StringEx.parseIntSafe(matches[4]), kr3m.util.StringEx.parseIntSafe(matches[5]), kr3m.util.StringEx.parseIntSafe(matches[6], kr3m.util.StringEx.parseIntSafe(matches[8])));
                }
                else {
                    date.setFullYear(kr3m.util.StringEx.parseIntSafe(matches[1]), kr3m.util.StringEx.parseIntSafe(matches[2]) - 1, kr3m.util.StringEx.parseIntSafe(matches[3]));
                    date.setHours(kr3m.util.StringEx.parseIntSafe(matches[4]), kr3m.util.StringEx.parseIntSafe(matches[5]), kr3m.util.StringEx.parseIntSafe(matches[6], kr3m.util.StringEx.parseIntSafe(matches[8])));
                }
                return date;
            };
            Dates.getDateTimeString = function (date, useUTC) {
                if (useUTC === void 0) { useUTC = true; }
                return this.getDateString(date, useUTC) + " " + this.getTimeString(date, useUTC);
            };
            Dates.getToday = function (useUTC) {
                if (useUTC === void 0) { useUTC = true; }
                return this.getDateString(new Date(), useUTC);
            };
            Dates.getYesterday = function (useUTC) {
                if (useUTC === void 0) { useUTC = true; }
                var date = new Date();
                date.setUTCDate(date.getUTCDate() - 1);
                return this.getDateString(date, useUTC);
            };
            Dates.getTomorrow = function (useUTC) {
                if (useUTC === void 0) { useUTC = true; }
                var date = new Date();
                date.setUTCDate(date.getUTCDate() + 1);
                return this.getDateString(date, useUTC);
            };
            Dates.getNow = function (useUTC) {
                if (useUTC === void 0) { useUTC = true; }
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
                var years = now.getUTCFullYear() - birthday.getUTCFullYear();
                var months = now.getUTCMonth() - birthday.getUTCMonth();
                var days = now.getUTCDate() - birthday.getUTCDate();
                var age = years;
                if ((months < 0) || (months == 0 && days < 0))
                    --age;
                return age;
            };
            Dates.max = function () {
                var dates = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    dates[_i - 0] = arguments[_i];
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
                    dates[_i - 0] = arguments[_i];
                }
                if (dates.length == 0)
                    return null;
                var result = dates[0];
                for (var i = 1; i < dates.length; ++i)
                    if (dates[i] < result)
                        result = dates[i];
                return result;
            };
            Dates.getFirstOfMonth = function (date, utc) {
                if (utc === void 0) { utc = false; }
                var result = new Date(date.getTime());
                if (utc) {
                    result.setUTCDate(1);
                    result.setUTCHours(0, 0, 0);
                }
                else {
                    result.setDate(1);
                    result.setHours(0, 0, 0);
                }
                return result;
            };
            Dates.getLastOfMonth = function (date, utc) {
                if (utc === void 0) { utc = false; }
                var result = new Date(date.getTime());
                if (utc) {
                    result.setUTCDate(1);
                    result.setUTCMonth(result.getUTCMonth() + 1);
                    result.setUTCDate(0);
                    result.setUTCHours(0, 0, 0);
                }
                else {
                    result.setDate(1);
                    result.setMonth(result.getMonth() + 1);
                    result.setDate(0);
                    result.setHours(0, 0, 0);
                }
                return result;
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
        })();
        util.Dates = Dates;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
/// <reference path="../../kr3m/util/json.pc.ts"/>
/// <reference path="../../kr3m/util/dates.pc.ts"/>
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
                    values[_i - 0] = arguments[_i];
                }
                if (!kr3m.util.Log.enabled)
                    return;
                for (var i = 0; i < values.length; ++i) {
                    if (typeof values[i] == "object" && !(values[i] instanceof Error))
                        values[i] = kr3m.util.Json.encode(values[i]);
                }
                if (kr3m.util.Log.showTimestamps)
                    values.unshift(kr3m.util.Log.COLOR_BRIGHT_RED + kr3m.util.Dates.getNow(false));
                else
                    values[0] = kr3m.util.Log.COLOR_BRIGHT_RED + values[0];
                values.push(kr3m.util.Log.COLOR_RESET);
                console.error.apply(console, values);
            };
            Log.log = function () {
                var values = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    values[_i - 0] = arguments[_i];
                }
                if (!kr3m.util.Log.enabled)
                    return;
                for (var i = 0; i < values.length; ++i) {
                    if (typeof values[i] == "object")
                        values[i] = kr3m.util.Json.encode(values[i]);
                }
                if (kr3m.util.Log.showTimestamps)
                    values.unshift(kr3m.util.Dates.getNow(false));
                console.log.apply(console, values);
            };
            Log.dump = function () {
                var values = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    values[_i - 0] = arguments[_i];
                }
                if (!kr3m.util.Log.enabled || typeof console == "undefined" || typeof console.log == "undefined")
                    return;
                for (var i = 0; i < values.length; ++i) {
                    if (typeof values[i] == "object")
                        values[i] = kr3m.util.Json.encode(values[i]);
                }
                kr3m.util.Log.log.apply(null, values);
            };
            Log.stackTrace = function (asError) {
                if (asError === void 0) { asError = false; }
                var e = new Error();
                return (asError ? "" : "Generated Stacktrace (ignore Error text): ") + e["stack"];
            };
            Log.logStackTrace = function (asError) {
                if (asError === void 0) { asError = false; }
                var prefix = asError ? kr3m.util.Log.COLOR_BRIGHT_RED : "";
                var suffix = asError ? kr3m.util.Log.COLOR_RESET : "";
                kr3m.util.Log.log(prefix + kr3m.util.Log.stackTrace(asError) + suffix);
            };
            Log.enabled = true;
            Log.showTimestamps = false;
            Log.COLOR_RED = "\x1b[31m";
            Log.COLOR_GREEN = "\x1b[32m";
            Log.COLOR_YELLOW = "\x1b[33m";
            Log.COLOR_BLUE = "\x1b[34m";
            Log.COLOR_MAGENTA = "\x1b[35m";
            Log.COLOR_CYAN = "\x1b[36m";
            Log.COLOR_BRIGHT = "\x1b[1m";
            Log.COLOR_RESET = "\x1b[0m";
            Log.COLOR_PINK = "\x1b[35m";
            Log.COLOR_DARK_RED = "\x1b[31m";
            Log.COLOR_DARK_GREEN = "\x1b[32m";
            Log.COLOR_DARK_YELLOW = "\x1b[33m";
            Log.COLOR_DARK_BLUE = "\x1b[34m";
            Log.COLOR_DARK_MAGENTA = "\x1b[35m";
            Log.COLOR_DARK_CYAN = "\x1b[36m";
            Log.COLOR_DARK_PINK = "\x1b[35m";
            Log.COLOR_BRIGHT_RED = "\x1b[31m\x1b[1m";
            Log.COLOR_BRIGHT_GREEN = "\x1b[32m\x1b[1m";
            Log.COLOR_BRIGHT_YELLOW = "\x1b[33m\x1b[1m";
            Log.COLOR_BRIGHT_BLUE = "\x1b[34m\x1b[1m";
            Log.COLOR_BRIGHT_MAGENTA = "\x1b[35m\x1b[1m";
            Log.COLOR_BRIGHT_CYAN = "\x1b[36m\x1b[1m";
            Log.COLOR_BRIGHT_PINK = "\x1b[35m\x1b[1m";
            return Log;
        })();
        util.Log = Log;
    })(util = kr3m.util || (kr3m.util = {}));
})(kr3m || (kr3m = {}));
function log() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i - 0] = arguments[_i];
    }
    kr3m.util.Log.log.apply(null, values);
}
function dump() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i - 0] = arguments[_i];
    }
    kr3m.util.Log.dump.apply(null, values);
}
function logError() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i - 0] = arguments[_i];
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
        params[i] = kr3m.util.Json.encode(params[i]);
    text += params.join(", ") + ")";
    kr3m.util.Log.log(text);
}
/// <reference path="../../../kr3m/lib/node.pc.ts"/>
/// <reference path="../../../kr3m/util/log.pc.ts"/>
/// <reference path="../../../kr3m/util/util.pc.ts"/>
var collected = [];
var ignoreHidden = true;
function getSize(path) {
    var size = 0;
    var files = fsLib.readdirSync(path);
    for (var i = 0; i < files.length; ++i) {
        if (ignoreHidden && files[i].slice(0, 1) == ".")
            continue;
        var subPath = path + "/" + files[i];
        subPath = subPath.replace(/\/\/+/g, "/").replace(/\\/g, "/");
        var stats = fsLib.statSync(subPath);
        if (stats.isDirectory())
            size += getSize(subPath);
        else
            size += stats.size;
    }
    collected.push({ path: path, size: size });
    return size;
}
function output() {
    kr3m.util.Util.sortBy(collected, "SIZE", false);
    for (var i = 0; i < collected.length; ++i)
        log(collected[i].path, collected[i].SIZE);
}
function main() {
    var rootPath = process.argv[2];
    log("collecting filesizes for path " + rootPath);
    getSize(rootPath);
    output();
    log("done");
    process.exit(0);
}
main();
