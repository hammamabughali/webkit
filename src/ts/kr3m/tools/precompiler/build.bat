@echo off
cls
call precompiler.bat build -c -o precompiler.js precompiler_main.ts -c
if %errorlevel% neq 0 pause
