FROM nginx:1.15-alpine

RUN apk add openssl \
    && cd /etc/ssl/ \
    && openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx.key -out nginx.crt -batch

COPY ./sites/dev.conf ./sites/prod.conf /etc/nginx/conf.d/


WORKDIR /var/www/app