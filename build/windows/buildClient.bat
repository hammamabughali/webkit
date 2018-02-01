echo off
cls
call less.bat
call precompiler.bat build ..\..\src\ts\cuboro\client.ts -o ..\..\bin\public\js\client.js -g -c -t ES5 --lib scripthost,es2015,es2015.iterable,dom -f CLIENT -f DEBUG -f DESKTOP -f LOCALHOST %*
call incBuildnumber.bat
