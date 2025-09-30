Custom rest endpoints are under:

http://localhost:8091/auth/realms/uk-esos/users
http://localhost:8091/auth/realms/uk-esos/database-lock

1. Build project : <p>mvn clean package will produce target/uk-esos-keycloak-api.jar</p>

2. Remove previous deployment artifact: <p>docker exec ${containerId} rm -rf //opt//jboss//keycloak//standalone//deployments//uk-esos-keycloak-api.jar</p>

3. Deploy the new artifact to jboss:
   <p>docker cp uk-esos-keycloak-api.jar {containerId}://opt//jboss//keycloak//standalone//deployments//</p>


