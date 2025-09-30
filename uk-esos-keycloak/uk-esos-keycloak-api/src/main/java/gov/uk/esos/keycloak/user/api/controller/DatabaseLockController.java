package gov.uk.esos.keycloak.user.api.controller;

import gov.uk.esos.keycloak.user.api.model.DatabaseLockDTO;
import gov.uk.esos.keycloak.user.api.service.DatabaseLockService;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

public class DatabaseLockController {

    private final DatabaseLockService databaseLockService;

    public DatabaseLockController(DatabaseLockService databaseLockService) {
        this.databaseLockService = databaseLockService;
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public DatabaseLockDTO lock() {
        return databaseLockService.lock();
    }

    @DELETE
    public void unlock() {
        databaseLockService.unlock();
    }

}
