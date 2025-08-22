package uk.gov.esos.api.account.organisation.onboarding.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.account.organisation.onboarding.domain.OnboardingRegistryStatus;
import uk.gov.esos.api.account.organisation.onboarding.domain.OrganisationAccountOnboardingRegistry;
import uk.gov.esos.api.account.organisation.onboarding.repository.OrganisationAccountOnboardingRegistryRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountOnboardingRegistryQueryServiceTest {

    @InjectMocks
    private OrganisationAccountOnboardingRegistryQueryService queryService;

    @Mock
    private OrganisationAccountOnboardingRegistryRepository repository;

    @Test
    void getRegistrationNumberByEmail() {
        String email = "email";
        String registrationNumber = "registrationNumber";
        OrganisationAccountOnboardingRegistry onboardingRegistry = OrganisationAccountOnboardingRegistry.builder()
            .email(email)
            .registrationNumber(registrationNumber)
            .build();

        when(repository.findByEmail(email)).thenReturn(Optional.of(onboardingRegistry));

        Optional<String> result = queryService.getRegistrationNumberByEmail(email);

        assertTrue(result.isPresent());
        assertEquals(registrationNumber, result.get());
    }

    @Test
    void getRegistrationNumberByEmail_empty() {
        String email = "email";

        when(repository.findByEmail(email)).thenReturn(Optional.empty());

        Optional<String> result = queryService.getRegistrationNumberByEmail(email);

        assertTrue(result.isEmpty());
    }
    
    @Test
    void existsByEmailAndRegistrationNumber() {
        String email = "email";
        String registrationNumber = "registrationNumber";

        when(repository.existsByEmailAndRegistrationNumber(email, registrationNumber))
        	.thenReturn(true);

        boolean result = queryService.existsByEmailAndRegistrationNumber(email, registrationNumber);

        assertTrue(result);
    }
    
    @Test
    void getExistingEmails() {
    	String existingEmail = "test@test.com";
    	List<String> emails = List.of(existingEmail, "jane@doe.com");
    	OrganisationAccountOnboardingRegistry entry = OrganisationAccountOnboardingRegistry.builder()
    			.email(existingEmail)
    			.registrationNumber("AB123456")
    			.status(OnboardingRegistryStatus.PENDING)
    			.build();

        when(repository.findAllByEmailIn(emails)).thenReturn(List.of(entry));

        // Verify
        assertEquals(List.of(existingEmail), queryService.getExistingEmails(emails));
    }
    
    @Test
    void getExistingEmails_empty_list() {
    	List<String> emails = List.of("test@test.com");

        when(repository.findAllByEmailIn(emails)).thenReturn(List.of());

        // Verify
        assertEquals(List.of(), queryService.getExistingEmails(emails));
    }
    
    @Test
    void getExistingRegistrationNumbers() {
    	String existingRegNumber = "AB123456";
    	List<String> regNumbers = List.of(existingRegNumber, "12345678");
    	OrganisationAccountOnboardingRegistry entry = OrganisationAccountOnboardingRegistry.builder()
    			.email("test@test.com")
    			.registrationNumber(existingRegNumber)
    			.status(OnboardingRegistryStatus.PENDING)
    			.build();

        when(repository.findAllByRegistrationNumberIn(regNumbers)).thenReturn(List.of(entry));

        // Verify
        assertEquals(List.of(existingRegNumber), queryService.getExistingRegistrationNumbers(regNumbers));
    }
}