#!/bin/bash
set -o xtrace

echo "STARTING GITHUB ACTION"

sudo cp ./wortopia.de.service /etc/systemd/system
sudo systemctl daemon-reload

./migrate.sh prod

npm install

sudo service wortopia restart

echo "DONE GITHUB ACTION"
