#!/bin/bash

PORT=${1:-8124}

while true;
    do netstat -an -t tcp | grep $PORT;
    sleep 2;
done