FROM nginx:1.21-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY /nginx/nginx.conf /etc/nginx/
RUN apk add --no-cache bash
RUN apk add nano
RUN mkdir /pages/
COPY /main/templates/nginx_pages/custom502.html /pages/