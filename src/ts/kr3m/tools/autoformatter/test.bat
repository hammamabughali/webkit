@cls
call precompiler.bat build -o autoformatter.js autoformatter_main.ts -c
if %errorlevel% neq 0 exit /b %errorlevel%
node autoformatter.js %*
