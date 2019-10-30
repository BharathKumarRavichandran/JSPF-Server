#!/bin/sh

sleep 20

echo ""
echo ""

echo " ###############################################"
echo ""
echo "    *****   Entering node_app_entry     ***** "
echo "    *****     Starting kue workers      ***** "

nohup node ./src/workers/index.js &

echo "    ***** Starting the Node application *****"
node ./index.js -b 0.0.0.0:8000
echo ""
echo " ###############################################"
echo ""
echo ""

echo "    *****         Exiting app           ***** "
echo " ###############################################"
echo ""
