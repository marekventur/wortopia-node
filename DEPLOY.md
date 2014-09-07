=Start Postgres=
mkdir -p /var/lib/postgresql-docker/data
chmod 700 /var/lib/postgresql-docker/data
docker run --name marekventur-postgres -v /var/lib/postgresql-docker/data:/var/lib/postgresql/data -d postgres

=Connect to postgres to setup database and user=
docker run -it --link marekventur-postgres:postgres --rm postgres sh -c 'exec psql -h "$POSTGRES_PORT_5432_TCP_ADDR" -p "$POSTGRES_PORT_5432_TCP_PORT" -U postgres'

create user wortopia;
alter user wortopia with password 'wortopia';
create database wortopia;
grant all on database wortopia to wortopia;
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

=Start NGINX=
docker run -itd --name marekventur-nginx --net host -v ~/workspace/wortopia-node/nginx.conf:/etc/nginx.conf:ro -p "127.0.0.1:80:80" nginx

=Start wortopia=
mkdir /var/log/wortopia
docker run -d --link marekventur-postgres:postgres -p "127.0.0.1:3000:80" -e "SIMPLER_SES_AUTH_TOKEN=abc" -e "TOKEN_SALT=xyz" -v /var/log/wortopia:/var/log/wortopia wortopia