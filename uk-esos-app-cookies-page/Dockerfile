FROM nginx:1.28

RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf

COPY confs/nginx.conf /etc/nginx/nginx.conf
COPY confs/page.conf /etc/nginx/conf.d/page.conf

RUN  mkdir /usr/share/nginx/cookies
COPY index.html /usr/share/nginx/cookies
COPY favicon.ico /usr/share/nginx/cookies
COPY css /usr/share/nginx/cookies/css
COPY assets /usr/share/nginx/cookies/assets
COPY js /usr/share/nginx/cookies/js

CMD ["nginx", "-g", "daemon off;"]
