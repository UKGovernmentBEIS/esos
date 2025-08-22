FROM nginx:1.28
RUN apt-get update
RUN apt-get install -y tzdata
RUN cp /usr/share/zoneinfo/Europe/London /etc/localtime
RUN echo "Europe/London" >  /etc/timezone
COPY ./.nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/uk-esos-main-web/ /usr/share/nginx/html/

# Fix nginx configuration for angular paths
RUN sed -i "s/index  index.html index.htm;/try_files \$uri \$uri\/ \/index.html;/" /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]
