FROM nginx:1.28
ENV XAUTH $HOME/.Xauthority

# preparing the software stack
RUN apt-get update
RUN apt-get install -y apache2-utils nano curl
RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf

# copying the minimum configuration
COPY confs/nginx.conf confs/proxy_headers.conf confs/global_security_headers.conf confs/kill_cache.conf /etc/nginx/
COPY confs/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY confs/esos.net.conf /etc/nginx/conf.d/esos.net.conf

ENTRYPOINT ["/bin/bash","/usr/local/bin/entrypoint.sh"]
