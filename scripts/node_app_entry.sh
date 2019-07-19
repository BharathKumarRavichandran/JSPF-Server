#!/bin/sh

sleep 2

echo "#######################################"

echo "Starting kue workers!!!"
nohup node ./src/workers/index.js &

echo "#######################################"

echo "Starting the Node App ....."
# echo "Hosting locally on :- " $(hostname -I)
node ./index.js -b 0.0.0.0:8000

echo "Exiting app .... ";