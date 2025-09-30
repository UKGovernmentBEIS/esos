package gov.uk.esos.keycloak.user.api.provider;

import gov.uk.esos.keycloak.user.api.controller.DatabaseLockController;
import gov.uk.esos.keycloak.user.api.repository.DatabaseLockRepository;
import gov.uk.esos.keycloak.user.api.service.DatabaseLockService;
import gov.uk.esos.keycloak.user.api.service.UserSessionService;
import jakarta.persistence.EntityManager;
import org.keycloak.connections.jpa.JpaConnectionProvider;
import org.keycloak.models.KeycloakSession;
import org.keycloak.services.resource.RealmResourceProvider;

public class DatabaseLockResourceProvider implements RealmResourceProvider {

    private final DatabaseLockController databaseLockController;

    public DatabaseLockResourceProvider(KeycloakSession session) {
        EntityManager entityManager = session.getProvider(JpaConnectionProvider.class).getEntityManager();

        UserSessionService userSessionService = new UserSessionService(session);
        DatabaseLockRepository databaseLockRepository = new DatabaseLockRepository(entityManager);
        DatabaseLockService databaseLockService =
                new DatabaseLockService(databaseLockRepository, userSessionService);

        databaseLockController = new DatabaseLockController(databaseLockService);
    }

    @Override
    public Object getResource() {
        return databaseLockController;
    }

    @Override
    public void close() {
    }

}
