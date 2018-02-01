echo off
cls
call css.bat
call precompiler.bat build ..\..\src\omni\main.ts -o ..\..\bin\js\omni.js -c -f CLIENT -f DEBUG -f DESKTOP %*
call incBuildnumber.bat
