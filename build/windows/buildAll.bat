echo off
cls

cd ..\..\bin
copy ..\src\ts\kr3m\tools\mysqlvogenerator\generator.js generator.js
call node generator.js cuboro_webkit_2 ..\src\ts\cuboro\tables -m cuboro.tables
del generator.js
cd ..\build\windows

call less.bat

call precompiler.bat build ..\..\src\ts\cuboro\client.ts -o ..\..\bin\public\js\client.js -g -c -t ES5 --lib scripthost,es2015,es2015.iterable,dom -f CLIENT -f DEBUG -f DESKTOP -f LOCALHOST %*

call precompiler.bat build ..\..\src\ts\cuboro\server.ts -o ..\..\bin\server.js -g -c -f SERVER -f DEBUG -f LOCALHOST %*

call incBuildnumber.bat
