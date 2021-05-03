#!/bin/bash
set -o xtrace

echo "STARTING GITHUB ACTION"

sudo cp ./wortopia.de.service /etc/systemd/system
sudo systemctl daemon-reload

npm install

./migrate.sh prod

sudo service wortopia restart

echo "DONE GITHUB ACTION"
