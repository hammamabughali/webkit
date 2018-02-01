cd ..\..\bin
:start
cls
node server.js
@ if %errorlevel% neq 0 goto errorHandler
goto start
:errorHandler
@ pause
goto start
