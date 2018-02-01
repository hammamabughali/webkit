@cls
call precompiler.bat build -o incversion.js incversion.ts -c
if %errorlevel% neq 0 pause
