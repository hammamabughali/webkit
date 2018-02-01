#!/bin/bash
for (( ; ; ))
do
	node server.js >> server.log 2>> server.log
	sleep 3
done
