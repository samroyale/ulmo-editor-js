#!/bin/sh

#API_URL="http://localhost:8081/api"
API_URL="https://ulmo-editor.herokuapp.com/api"

#curl -X POST -d @maps/drops.map.json --header "Content-Type:application/json" $API_URL/maps
#curl -X POST -d @maps/forest.map.json --header "Content-Type:application/json" $API_URL/maps
#curl -X POST -d @maps/lowercave.map.json --header "Content-Type:application/json" $API_URL/maps
#curl -X POST -d @maps/skullcave.map.json --header "Content-Type:application/json" $API_URL/maps
#curl -X POST -d @maps/smallcave.map.json --header "Content-Type:application/json" $API_URL/maps
curl -X POST -d @maps/start.map.json --header "Content-Type:application/json" $API_URL/maps
#curl -X POST -d @maps/uppercave.map.json --header "Content-Type:application/json" $API_URL/maps
