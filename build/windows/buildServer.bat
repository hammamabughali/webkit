cls
call precompiler.bat build ..\..\src\ts\cuboro\server.ts -o ..\..\bin\server.js -g -c -f SERVER -f DEBUG -f LOCALHOST %*
call incBuildnumber.bat
