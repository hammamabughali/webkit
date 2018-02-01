@echo off
node ..\..\..\incversion\incversion.js ..\..\src\omni\constants.ts "(export const VERSION = \"\d+\.\d+\.)(\d+)(\.)(\d+)(\";)"
