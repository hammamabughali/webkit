echo off
cls
call precompiler.bat build -o compress.js compress_main.ts -c -f DEBUG
if %errorlevel% neq 0 pause
