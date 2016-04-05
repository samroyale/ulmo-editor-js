#!/bin/sh

API_URL="http://localhost:8081/api"

curl -X POST -d @tilesets/dungeon.json --header "Content-Type:application/json" $API_URL/tilesets
curl -X POST -d @tilesets/earth.json --header "Content-Type:application/json" $API_URL/tilesets
curl -X POST -d @tilesets/grass.json --header "Content-Type:application/json" $API_URL/tilesets
curl -X POST -d @tilesets/objects.json --header "Content-Type:application/json" $API_URL/tilesets
curl -X POST -d @tilesets/water.json --header "Content-Type:application/json" $API_URL/tilesets
curl -X POST -d @tilesets/wood.json --header "Content-Type:application/json" $API_URL/tilesets
