package gov.uk.esos.keycloak.user.api;


import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;

import java.util.List;

public abstract class AbstractContainerBaseTest {
    @Container
    private static final PostgreSQLContainer<?> POSTGRESQL_CONTAINER = new PostgreSQLContainer<>("postgres")
            .withDatabaseName("keycloak-docker-tests-db")
            .withUsername("inmemory")
            .withPassword("inmemory")
            .withExposedPorts(11111);

    static {
        POSTGRESQL_CONTAINER.setPortBindings(List.of("11111:5432"));
        POSTGRESQL_CONTAINER.start();
    }
}
