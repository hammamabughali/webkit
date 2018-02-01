#!/bin/bash
pkill -f loopmac.sh
pkill node
cd ../../bin

read -p "Start loopmac script (y/n)?" CONT
if [ "$CONT" = "y" ]; then
  sudo sh loopmac.sh &
  echo "Loop script started";
else
  echo "Loop script stopped";
fi