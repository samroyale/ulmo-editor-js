#!/usr/bin/env bash

if [ "$1" == "clean" ]; then
    docker-compose rm -f db
    rm -rf db/data
fi

docker-compose up --build