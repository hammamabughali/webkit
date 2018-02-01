echo off
cls
call precompiler.bat build -o generator.js generator_main.ts -c -f DEBUG
if %errorlevel% neq 0 pause
