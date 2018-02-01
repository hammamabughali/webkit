#!/usr/bin/env bash
echo less
lessc ../../src/less/main.less > ../../bin/public/css/main.css

echo precompiler
node ../../src/ts/kr3m/tools/precompiler/precompiler.js build ../../src/ts/cuboro/client.ts -g -c -t ES5 --lib scripthost,es2015,es2015.iterable,dom -o ../../bin/public/js/client.js -f CLIENT -f DEBUG

date "+%X"