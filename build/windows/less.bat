@echo off

echo less
call lessc ..\..\src\less\main.less > ..\..\bin\public\css\main.css ||  EXIT /B 1

echo done!