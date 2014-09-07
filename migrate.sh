#!/bin/bash

node_modules/db-migrate/bin/db-migrate --env $1 --config database.js up
