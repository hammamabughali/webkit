@echo off
cls
call precompiler.bat build -c -o ../../../bin/scripts/databaseMigration.js ../../../src/ts/cuboro/scripts/databaseMigration.ts -f DEBUG -f SERVER -f EXPERIMENTAL -f VERBOSE %*
if %errorlevel% neq 0 exit /b %errorlevel%
cd ..\..\..\bin
node scripts\databaseMigration.js
cd ..\build\windows\scripts