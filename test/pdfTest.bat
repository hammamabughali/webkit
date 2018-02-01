@echo off
cls
call precompiler.bat build -c -o pdfTest.js pdfTest.ts -f DEBUG -f SERVER %*
if %errorlevel% neq 0 exit /b %errorlevel%
node pdfTest.js
