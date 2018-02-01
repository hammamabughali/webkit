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
