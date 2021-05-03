#!/bin/bash
set -o xtrace

echo "STARTING GITHUB ACTION"

sudo cp ./wortopia.de.service /etc/systemd/system
sudo systemctl daemon-reload

npm install
git checkout package-lock.json

./migrate.sh prod

sudo service wortopia.de restart

echo "DONE GITHUB ACTION"
