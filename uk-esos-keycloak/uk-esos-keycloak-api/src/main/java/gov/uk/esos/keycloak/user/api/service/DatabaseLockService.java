package gov.uk.esos.keycloak.user.api.service;

import gov.uk.esos.keycloak.user.api.model.DatabaseLockDTO;
import gov.uk.esos.keycloak.user.api.repository.DatabaseLockRepository;

public class DatabaseLockService {

    private final DatabaseLockRepository databaseLockRepository;
    private final UserSessionService userSessionService;

    public DatabaseLockService(DatabaseLockRepository databaseLockRepository,
                               UserSessionService userSessionService) {
        this.databaseLockRepository = databaseLockRepository;
        this.userSessionService = userSessionService;
    }

    /**
     * Attempts to lock the database (by inserting a record on the databasechangeloglock table)
     * for exclusive access during the execution of migration scripts.
     * @return DatabaseLockDTO containing the success status of the operation
     */
    public DatabaseLockDTO lock() {
        userSessionService.getAuthenticatedUser();
        databaseLockRepository.obtainLock();

        boolean locked = databaseLockRepository.isDataBaseLockedForMigration();

        if (!locked) {
            databaseLockRepository.writeLockForMigration();
        }

        return DatabaseLockDTO.builder().success(!locked).build();
    }

    /**
     * Attempts to unlock the database and delete the lock record of databasechangeloglock table.
     */
    public void unlock() {
        userSessionService.getAuthenticatedUser();
        databaseLockRepository.obtainLock();
        databaseLockRepository.unlock();
    }
}
