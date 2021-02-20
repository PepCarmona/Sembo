#!/bin/bash

#gnome-terminal -e "bash -c 'node server-side/index.js && exec $SHELL'"
node server-side/index.js &
xdg-open client-side/index.html