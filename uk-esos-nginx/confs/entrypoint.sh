#!/bin/bash

rm -f /etc/nginx/conf.d/default.conf

if [[ $ORCHESTRATOR == 'ecs' ]]; then
	sed -i '/listen/i \ \ \ \ resolver\ 169\.254\.169\.253\ valid\=10s\;' /etc/nginx/conf.d/esos.net.conf
elif [[ $ORCHESTRATOR == 'swarm' ]]; then
        sed -i '/listen/i \ \ \ \ resolver\ 127\.0\.0\.11\ valid\=10s\;' /etc/nginx/conf.d/esos.net.conf
fi

sed -i "s/REPLACE_ME_WITH_FQDN/$FQDN/g" /etc/nginx/conf.d/esos.net.conf
sed -i "s/REPLACE_ME_WITH_COOKIES/$COOKIES/g" /etc/nginx/conf.d/esos.net.conf
sed -i "s/REPLACE_ME_WITH_DASHBOARD/$DASHBOARD/g" /etc/nginx/conf.d/esos.net.conf
sed -i "s/REPLACE_ME_WITH_KEYCLOAK/$KEYCLOAK/g" /etc/nginx/conf.d/esos.net.conf
sed -i "s/REPLACE_ME_WITH_APP_API/$APP_API/g" /etc/nginx/conf.d/esos.net.conf
sed -i "s/REPLACE_ME_WITH_APP_WEB/$APP_WEB/g" /etc/nginx/conf.d/esos.net.conf

exec nginx -g 'daemon off;'
