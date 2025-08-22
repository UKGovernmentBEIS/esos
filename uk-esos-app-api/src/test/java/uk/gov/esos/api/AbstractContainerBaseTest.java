package uk.gov.esos.api;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;

import java.time.Duration;

public abstract class AbstractContainerBaseTest {
    @Container
    private static final PostgreSQLContainer<?> POSTGRESQL_CONTAINER = new PostgreSQLContainer<>("postgres")
            .withDatabaseName("docker-tests-db").withUsername("inmemory").withPassword("inmemory");

    @Container
    private static final PostgreSQLContainer<?> POSTGRESQL_MIGRATION_CONTAINER = new PostgreSQLContainer<>("postgres")
            .withDatabaseName("docker-migration-tests-db").withUsername("inmemory").withPassword("inmemory");

    @Container
    private static final PostgreSQLContainer<?> POSTGRESQL_REPORTS_EA_CONTAINER = new PostgreSQLContainer<>("postgres")
            .withDatabaseName("docker-report-ea-tests-db").withUsername("inmemory").withPassword("inmemory");

    @Container
    private static final PostgreSQLContainer<?> POSTGRESQL_REPORTS_SEPA_CONTAINER = new PostgreSQLContainer<>("postgres")
            .withDatabaseName("docker-report-sepa-tests-db").withUsername("inmemory").withPassword("inmemory");

    @Container
    private static final PostgreSQLContainer<?> POSTGRESQL_REPORTS_NIEA_CONTAINER = new PostgreSQLContainer<>("postgres")
            .withDatabaseName("docker-report-niea-tests-db").withUsername("inmemory").withPassword("inmemory");

    @Container
    private static final PostgreSQLContainer<?> POSTGRESQL_REPORTS_NRW_CONTAINER = new PostgreSQLContainer<>("postgres")
            .withDatabaseName("docker-report-nrw-tests-db").withUsername("inmemory").withPassword("inmemory");

    @Container
    private static final PostgreSQLContainer<?> POSTGRESQL_REPORTS_OPRED_CONTAINER = new PostgreSQLContainer<>("postgres")
            .withDatabaseName("docker-report-opred-tests-db").withUsername("inmemory").withPassword("inmemory");

    static {
        POSTGRESQL_CONTAINER.start();
        POSTGRESQL_MIGRATION_CONTAINER.start();
        POSTGRESQL_REPORTS_NRW_CONTAINER.start();
        POSTGRESQL_REPORTS_EA_CONTAINER.start();
        POSTGRESQL_REPORTS_SEPA_CONTAINER.start();
        POSTGRESQL_REPORTS_NIEA_CONTAINER.start();
        POSTGRESQL_REPORTS_OPRED_CONTAINER.start();
    }

    @DynamicPropertySource
    static void postgresqlProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRESQL_CONTAINER::getJdbcUrl);
        registry.add("spring.datasource.password", POSTGRESQL_CONTAINER::getPassword);
        registry.add("spring.datasource.username", POSTGRESQL_CONTAINER::getUsername);

        registry.add("migration-datasource.url", POSTGRESQL_MIGRATION_CONTAINER::getJdbcUrl);
        registry.add("migration-datasource.password", POSTGRESQL_MIGRATION_CONTAINER::getPassword);
        registry.add("migration-datasource.username", POSTGRESQL_MIGRATION_CONTAINER::getUsername);

        registry.add("report-datasource-ea.url", POSTGRESQL_REPORTS_EA_CONTAINER::getJdbcUrl);
        registry.add("report-datasource-ea.username", POSTGRESQL_REPORTS_EA_CONTAINER::getPassword);
        registry.add("report-datasource-ea.password", POSTGRESQL_REPORTS_EA_CONTAINER::getUsername);

        registry.add("report-datasource-nrw.url", POSTGRESQL_REPORTS_NRW_CONTAINER::getJdbcUrl);
        registry.add("report-datasource-nrw.username", POSTGRESQL_REPORTS_NRW_CONTAINER::getPassword);
        registry.add("report-datasource-nrw.password", POSTGRESQL_REPORTS_NRW_CONTAINER::getUsername);

        registry.add("report-datasource-sepa.url", POSTGRESQL_REPORTS_SEPA_CONTAINER::getJdbcUrl);
        registry.add("report-datasource-sepa.username", POSTGRESQL_REPORTS_SEPA_CONTAINER::getPassword);
        registry.add("report-datasource-sepa.password", POSTGRESQL_REPORTS_SEPA_CONTAINER::getUsername);

        registry.add("report-datasource-niea.url", POSTGRESQL_REPORTS_NIEA_CONTAINER::getJdbcUrl);
        registry.add("report-datasource-niea.username", POSTGRESQL_REPORTS_NIEA_CONTAINER::getPassword);
        registry.add("report-datasource-niea.password", POSTGRESQL_REPORTS_NIEA_CONTAINER::getUsername);

        registry.add("report-datasource-opred.url", POSTGRESQL_REPORTS_OPRED_CONTAINER::getJdbcUrl);
        registry.add("report-datasource-opred.username", POSTGRESQL_REPORTS_OPRED_CONTAINER::getPassword);
        registry.add("report-datasource-opred.password", POSTGRESQL_REPORTS_OPRED_CONTAINER::getUsername);
    }
}
