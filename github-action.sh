#!/bin/bash
set -o xtrace

echo "STARTING GITHUB ACTION"

sudo cp ./wortopia.de.service /etc/systemd/system
sudo systemctl daemon-reload

npm install
./node_modules/grunt-cli/bin/grunt

./migrate.sh prod

sudo service wortopia.de restart

echo "DONE GITHUB ACTION"
