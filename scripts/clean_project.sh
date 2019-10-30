#!/bin/sh

echo "**** This script needs sudo access, run with sudo."
echo "**** This script deletes all of your docker mounted database data and log files, so think before running this script.
"

# Prompt confirmation
echo -n "Are you sure you want to clear all data(mongodb,redis) and logs (Y/n)? "
read answer
if [ "$answer" != "${answer#[Yy]}" ] ;
then

    echo "Removing mongodb data and redis data..."
    sleep 3s
    rm -rf ../docker/data
    
    echo "Removing all logs..."
    sleep 3s
    rm -rf ../storage/logs/*.log

    echo "All data and logs are removed."
    
fi