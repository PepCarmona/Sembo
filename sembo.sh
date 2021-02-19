#!/bin/bash

gnome-terminal -e "bash -c 'node server-side/index.js && exec $SHELL'"
#gnome-terminal -e "bash -c 'http-server client-side && exec $SHELL'"
#xdg-open http://127.0.0.1:8080
xdg-open client-side/index.html
