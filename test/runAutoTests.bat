@echo off
cls
call precompiler.bat build -c -t ES5 -o runAutoTests.js runAutoTests.ts -f DEBUG -f SERVER %*
if %errorlevel% neq 0 exit /b %errorlevel%
node ..\test\runAutoTests.js
