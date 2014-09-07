#!/bin/bash

echo "NEW INSTANCE, STARTED $(date)" >> /var/log/wortopia/migration.log
echo "NEW INSTANCE, STARTED $(date)" >> /var/log/wortopia/app.log

./migrate.sh docker >> /var/log/wortopia/migration.log
node app.js >> /var/log/wortopia/app.log