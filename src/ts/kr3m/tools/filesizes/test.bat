@cls
call precompiler.bat build -o filesizes.js filesizes.ts -c
if %errorlevel% neq 0 exit /b %errorlevel%
node filesizes.js ../..
