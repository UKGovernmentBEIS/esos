#https://www.keycloak.org/server/containers
#https://github.com/keycloak/keycloak/blob/main/quarkus/container/Dockerfile

FROM registry.access.redhat.com/ubi9 AS ubi-micro-build
RUN dnf clean all
RUN dnf update -y
RUN mkdir -p /mnt/rootfs
RUN ulimit -n 1024 && dnf install --installroot /mnt/rootfs curl dos2unix findutils python3 python3-requests --releasever 9 --setopt install_weak_deps=false --nodocs -y
RUN curl -L https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 -o /bin/jq

FROM quay.io/keycloak/keycloak:26.1.0
COPY --from=ubi-micro-build /mnt/rootfs /
COPY --from=ubi-micro-build --chown=1000:0 /bin/jq /bin/jq

USER root
RUN chmod 755 /bin/jq

COPY uk-esos-keycloak-api/target/uk-esos-keycloak-api.jar /opt/keycloak/providers/
COPY uk-esos-keycloak-theme/target/uk-esos-keycloak-theme.jar /opt/keycloak/providers/
COPY uk-esos-one-login-idp-broker/target/uk-esos-one-login-idp-broker.jar /opt/keycloak/providers/
ENV KC_DB=postgres
ENV KC_HTTP_RELATIVE_PATH=/auth
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true
RUN /opt/keycloak/bin/kc.sh build

COPY startup_and_migrate.sh /opt/keycloak/tools/
COPY uk-esos-keycloak-migrate/ /opt/keycloak/tools/migrations/
COPY startup-scripts/ /opt/keycloak/startup-scripts/

RUN chmod +x -R /opt/keycloak/tools/
RUN dos2unix /opt/keycloak/tools/startup_and_migrate.sh
RUN find /opt/keycloak/tools/migrations -type f -print0 | xargs -0 dos2unix

USER 1000
ENTRYPOINT ["/opt/keycloak/tools/startup_and_migrate.sh"]
