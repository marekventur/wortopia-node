# Wortopia implementation in node.js

[![Build Status](https://travis-ci.org/marekventur/wortopia-node.svg?branch=master)](https://travis-ci.org/marekventur/wortopia-node)

## Set up DB
```
sudo -u postgres createuser wortopia -P
sudo -u postgres createdb wortopia -O wortopia
sudo -u postgres createdb wortopia_test -O wortopia
```

```
sudo -u postgres psql wortopia
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

sudo -u postgres psql wortopia_test
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

sudo -u postgres psql wortopia_dev
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

```
./migrate.sh test
./migrate.sh dev
./migrate.sh production
```

Run grunt

```
grunt
```

Start wortopia
```
SIMPLER_SES_AUTH_TOKEN=abc TOKEN_SALT=def node ./app.js | ./node_modules/bunyan/bin/bunyan -o short
```

# Init script

```
apt-get install pipexec # requires debian unstable
```

