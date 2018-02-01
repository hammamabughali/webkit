@echo off
cls
call precompiler.bat build -c -t ES5 -o sendEmail.js sendEmail.ts -f DEBUG -f SERVER %*
if %errorlevel% neq 0 exit /b %errorlevel%
cd ..\bin
call node ..\test\sendEmail.js
cd ..\test
