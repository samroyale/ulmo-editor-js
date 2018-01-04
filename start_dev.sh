#!/usr/bin/env bash

# Starts the dev environment via docker-compose

# Use the 'clean' argument to revert any data changes
if [ "$1" == "clean" ]; then
    docker-compose rm -f db
    rm -rf db/data
fi

docker-compose up --build