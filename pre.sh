#!/bin/bash

# Write ssl cert and key to file for nginx
echo $SSL_CRT | sed 's/\\n/\n/g' > /var/ssl/server.crt
echo $SSL_KEY | sed 's/\\n/\n/g' > /var/ssl/server.key
