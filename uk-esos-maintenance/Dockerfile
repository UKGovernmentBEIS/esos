FROM nginx:1.28
ENV XAUTH $HOME/.Xauthority

RUN apt-get update
RUN apt-get install -y apache2-utils
RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf
COPY confs/nginx.conf confs/kill_cache.conf /etc/nginx/
COPY confs/page.conf /etc/nginx/conf.d/page.conf

COPY uk-esos-maintenance-page-web /usr/share/nginx/maintenance
