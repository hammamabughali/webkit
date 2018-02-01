@echo off
node ..\..\src\ts\kr3m\tools\incversion\incversion.js ..\..\src\ts\cuboro\version.ts "(export const VERSION = \"\d+\.\d+\.\d+\.)(\d+)(\";)"
