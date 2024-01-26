#!/bin/bash

if [ "x$PORT" = "x" ]; then
    echo "Please set a variable PORT before running the script"
    echo "Example:"
    echo " PORT=3002 $0"
    exit -1;
fi

docker run -it \
 -v $PWD:/home/node/code \
 -p $PORT:3001 node /bin/bash \
 -c "cd /home/node/code && npm install && npm install -g nodemon && nodemon -c nodemon.json"
