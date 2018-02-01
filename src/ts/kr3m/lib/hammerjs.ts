/// <reference path="../lib/external/hammerjs/hammerjs.d.ts"/>

//# DEBUG
if (!Hammer.HAS_TOUCHEVENTS && !Hammer.HAS_POINTEREVENTS)
Hammer.plugins.showTouches();

if (!Hammer.HAS_TOUCHEVENTS && !Hammer.HAS_POINTEREVENTS)
Hammer.plugins.fakeMultitouch();
//# /DEBUG
