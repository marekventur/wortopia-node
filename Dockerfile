# Make sure to pass in SIMPLER_SES_AUTH_TOKEN and TOKEN_SALT
# Start like this:
# docker run -d --link wortopia-postgres:postgres -p "127.0.0.1:3000:80" -e "SIMPLER_SES_AUTH_TOKEN=abc" -e "TOKEN_SALT=xyz" wortopia

FROM dockerfile/nodejs

WORKDIR /var/www/wortopia

EXPOSE 80

ENV PORT 80
ENV NODE_ENV docker

ADD . /var/www/wortopia

RUN mkdir /var/log/wortopia
VOLUME ['/var/log/wortopia']

CMD ["./start-with-docker.sh"]
