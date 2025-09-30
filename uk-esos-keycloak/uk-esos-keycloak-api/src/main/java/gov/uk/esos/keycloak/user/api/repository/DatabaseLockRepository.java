package gov.uk.esos.keycloak.user.api.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;

public class DatabaseLockRepository {
    private static final Integer MIGRATION_ID = 2000;

    private final EntityManager entityManager;

    public DatabaseLockRepository(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public void writeLockForMigration() {
        entityManager
                .createNativeQuery("insert into public.databasechangeloglock (id, locked) values (:id, true)")
                .setParameter("id", MIGRATION_ID)
                .executeUpdate();
    }

    public boolean isDataBaseLockedForMigration() {
        try {
            entityManager
                .createNativeQuery("select locked from public.databasechangeloglock where id = :id")
                .setParameter("id", MIGRATION_ID)
                .getSingleResult();
            return true;
        } catch (NoResultException e) {
            return false;
        }
    }

    // Lock table due to insert race condition just to avoid the error log of constraint violation.
    public void obtainLock() {
        entityManager
                .createNativeQuery("select 1 from public.databasechangeloglock for update")
                .getSingleResult();
    }

    public void unlock() {
        entityManager
                .createNativeQuery("delete from public.databasechangeloglock where id = :id and locked = true")
                .setParameter("id", MIGRATION_ID)
                .executeUpdate();
    }

}
