#!/bin/bash

# Write ssl cert and key to file for nginx

mkdir -p /var/ssl/
touch /var/ssl/server.crt
touch /var/ssl/server.key

echo $SSL_CRT | sed 's/\\n/\n/g' > /var/ssl/server.crt
echo $SSL_KEY | sed 's/\\n/\n/g' > /var/ssl/server.key
