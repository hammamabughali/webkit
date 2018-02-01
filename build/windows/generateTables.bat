echo off
cls
echo generating .ts - files for tables and value objects from existing database structure
cd ..\..\bin
copy ..\src\ts\kr3m\tools\mysqlvogenerator\generator.js generator.js
call node generator.js cuboro_webkit_2 ..\src\ts\cuboro\tables -m cuboro.tables %*
del generator.js
cd ..\build\windows
