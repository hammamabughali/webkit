@echo off
cls
call precompiler.bat build -c -t ES5 -o databaseMigration.js databaseMigration.ts -f DEBUG -f SERVER %*
if %errorlevel% neq 0 exit /b %errorlevel%
node ..\test\databaseMigration.js
