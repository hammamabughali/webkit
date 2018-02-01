
echo tsc
node ../../src/ts/kr3m/tools/precompiler/precompiler.js build ../../src/ts/cuboro/server.ts -g -c -o ../../bin/server.js -f SERVER -f DEBUG -f LOCALHOST

date '+%X'