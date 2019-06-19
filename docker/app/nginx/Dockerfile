FROM nginx:1.15-alpine

RUN apk add openssl \
    && cd /etc/ssl/ \
    && openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx.key -out nginx.crt -batch

COPY ./sites/default.conf /etc/nginx/conf.d/default.conf


WORKDIR /var/www/app