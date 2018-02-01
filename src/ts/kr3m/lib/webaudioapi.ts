/// <reference path="../lib/external/webaudioapi/waa.d.ts"/>

(<any> window).AudioContext = (<any> window).AudioContext || (<any> window).webkitAudioContext;
