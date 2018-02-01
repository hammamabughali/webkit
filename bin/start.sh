#!/bin/bash
pkill -f loop.sh
pkill node
./loop.sh &
