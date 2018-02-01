echo off
cls
cd ..\..\src\ts\kr3m\ui2\cms\embed\less
call css.bat
cd ..\..\..\..\..\..\..\build\windows
call precompiler.bat build ..\..\src\ts\cuboro\cms\cms.ts -o ..\..\bin\public\cms\cms.js -g -c -f CLIENT -f DEBUG -f DESKTOP -f LOCALHOST %*
call incBuildnumber.bat
