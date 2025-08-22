package uk.gov.esos.api.account.organisation.onboarding.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.testcontainers.junit.jupiter.Testcontainers;
import uk.gov.esos.api.AbstractContainerBaseTest;
import uk.gov.esos.api.account.organisation.onboarding.domain.OnboardingRegistryStatus;
import uk.gov.esos.api.account.organisation.onboarding.domain.OrganisationAccountOnboardingRegistry;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
@Import(ObjectMapper.class)
class OrganisationAccountOnboardingRegistryRepositoryIT extends AbstractContainerBaseTest {

    @Autowired
    private OrganisationAccountOnboardingRegistryRepository repo;

    @Autowired
    private EntityManager entityManager;

    @Test
    void findByEmail() {
        String email = "email";
        String registrationNumber = "registrationNumber";
        OrganisationAccountOnboardingRegistry accountOnboardingRegistry = OrganisationAccountOnboardingRegistry.builder()
            .registrationNumber(registrationNumber)
            .email(email)
            .status(OnboardingRegistryStatus.PENDING)
            .submitterId("submitterId")
            .submissionDate(LocalDateTime.of(2024, 2, 13, 12, 0))
            .build();

        entityManager.persist(accountOnboardingRegistry);
        flushAndClear();

        Optional<OrganisationAccountOnboardingRegistry> result = repo.findByEmail(email);

        assertTrue(result.isPresent());
        assertEquals(accountOnboardingRegistry, result.get());
    }


    @Test
    void findByEmail_empty() {
        String email = "email";

        Optional<OrganisationAccountOnboardingRegistry> result = repo.findByEmail(email);

        assertTrue(result.isEmpty());
    }
    
    @Test
    void findAllByEmailIn() {
        String email1 = "email1";
        String registrationNumber1 = "registrationNumber1";
        String email2 = "email2";
        String registrationNumber2 = "registrationNumber2";
        persistOnboardingRegistryEntries(email1, registrationNumber1, email2, registrationNumber2);
        
        flushAndClear();

        // one email exists
        List<OrganisationAccountOnboardingRegistry> result = repo.findAllByEmailIn(List.of(email1));

        assertThat(result).hasSize(1);
        assertEquals(email1, result.get(0).getEmail());
        
        /// no emails exist
        List<OrganisationAccountOnboardingRegistry> result2 = repo.findAllByEmailIn(List.of("notExistingEmail"));
        assertThat(result2).isEmpty();
    }
    
    @Test
    void findAllByRegistrationNumberIn() {
        String email1 = "email1";
        String registrationNumber1 = "registrationNumber1";
        String email2 = "email2";
        String registrationNumber2 = "registrationNumber2";
        
        persistOnboardingRegistryEntries(email1, registrationNumber1, email2, registrationNumber2);

        // one regNo exists
        List<OrganisationAccountOnboardingRegistry> result = repo.findAllByRegistrationNumberIn(List.of(registrationNumber2));

        assertThat(result).hasSize(1);
        assertEquals(registrationNumber2, result.get(0).getRegistrationNumber());
        
        /// no regNo exist
        List<OrganisationAccountOnboardingRegistry> result2 = repo.findAllByRegistrationNumberIn(List.of("notExistingRegNo"));
        assertThat(result2).isEmpty();
    }

    @Test
    void findByEmailAndRegistrationNumber() {
        String email = "email";
        String registrationNumber = "registrationNumber";
        OrganisationAccountOnboardingRegistry accountOnboardingRegistry = OrganisationAccountOnboardingRegistry.builder()
            .registrationNumber(registrationNumber)
            .email(email)
            .status(OnboardingRegistryStatus.PENDING)
            .submitterId("submitterId")
            .submissionDate(LocalDateTime.of(2024, 2, 13, 12, 0))
            .build();

        entityManager.persist(accountOnboardingRegistry);
        flushAndClear();

        Optional<OrganisationAccountOnboardingRegistry> result = repo.findByEmailAndRegistrationNumber(email, registrationNumber);

        assertTrue(result.isPresent());
        assertEquals(accountOnboardingRegistry, result.get());
    }


    @Test
    void findByEmailAndRegistrationNumber_empty() {
        String email = "email";
        String registrationNumber = "registrationNumber";

        Optional<OrganisationAccountOnboardingRegistry> result = repo.findByEmailAndRegistrationNumber(email, registrationNumber);

        assertTrue(result.isEmpty());
    }


	private void persistOnboardingRegistryEntries(String email1, String registrationNumber1, String email2,
			String registrationNumber2) {
		OrganisationAccountOnboardingRegistry entry1 = OrganisationAccountOnboardingRegistry.builder()
            .registrationNumber(registrationNumber1)
            .email(email1)
            .status(OnboardingRegistryStatus.PENDING)
            .submitterId("submitterId")
            .submissionDate(LocalDateTime.of(2024, 2, 13, 12, 0))
            .build();
        entityManager.persist(entry1);
        
        OrganisationAccountOnboardingRegistry entry2 = OrganisationAccountOnboardingRegistry.builder()
                .registrationNumber(registrationNumber2)
                .email(email2)
                .status(OnboardingRegistryStatus.PENDING)
                .submitterId("submitterId")
                .submissionDate(LocalDateTime.of(2024, 2, 13, 12, 0))
                .build();
        entityManager.persist(entry2);
        
        flushAndClear();
	}

    private void flushAndClear() {
        entityManager.flush();
        entityManager.clear();
    }
}