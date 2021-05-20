# Use Alpine Linux
FROM alpine:latest

# Timezone
ENV TIMEZONE America/Chicago
ENV HOSTNAME=localhost

# Let's roll
RUN	apk update && \
  apk upgrade && \
  apk add --update openssl nginx && \
  apk add --update tzdata && \
  cp /usr/share/zoneinfo/${TIMEZONE} /etc/localtime && \
  echo "${TIMEZONE}" > /etc/timezone && \
  mkdir /etc/nginx/certificates && \
  openssl req \
  -x509 \
  -newkey rsa:2048 \
  -keyout /etc/nginx/certificates/key.pem \
  -out /etc/nginx/certificates/cert.pem \
  -days 365 \
  -nodes \
  -subj /CN="${HOSTNAME}" && \
  mkdir /www && \
  apk del tzdata && \
  rm -rf /var/cache/apk/* && \
  mkdir -p var/run/nginx && \
  touch /var/run/nginx/nginx.pid

COPY ./build /usr/share/nginx/html
COPY etc/nginx.conf /etc/nginx/nginx.conf
COPY etc/common.conf /etc/nginx/common.conf
COPY etc/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY etc/conf.d/ssl.conf /etc/nginx/conf.d/ssl.conf

# Expose volumes
VOLUME ["/etc/nginx/conf.d", "/var/log/nginx", "/www"]

# Expose ports
EXPOSE 80

# Entry point
ENTRYPOINT ["/usr/sbin/nginx", "-g", "daemon off;"]
