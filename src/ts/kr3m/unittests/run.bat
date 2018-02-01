@echo off
cls
call node ..\tools\precompiler\precompiler.js build -c allincluded.ts -f DEBUG -f EXPERIMENTAL -f UNITTESTS
if %errorlevel% neq 0 goto errorHandler
node allincluded.js
if %errorlevel% neq 0 goto errorHandler
goto end
:errorHandler
pause
:end
