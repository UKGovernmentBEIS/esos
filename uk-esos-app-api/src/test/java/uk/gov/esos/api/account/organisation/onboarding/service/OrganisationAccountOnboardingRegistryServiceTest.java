package uk.gov.esos.api.account.organisation.onboarding.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Answers;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.account.organisation.onboarding.config.property.EmailBatchProperties;
import uk.gov.esos.api.account.organisation.onboarding.domain.OnboardingRegistryStatus;
import uk.gov.esos.api.account.organisation.onboarding.domain.OrganisationAccountOnboardingRegistry;
import uk.gov.esos.api.account.organisation.onboarding.domain.OrganisationAccountOnboardingRegistryDTO;
import uk.gov.esos.api.account.organisation.onboarding.repository.OrganisationAccountOnboardingRegistryRepository;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.user.core.service.UserNotificationService;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.after;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.timeout;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountOnboardingRegistryServiceTest {

	@InjectMocks
    private OrganisationAccountOnboardingRegistryService service;

	@Mock
	private OrganisationAccountOnboardingRegistryQueryService queryService;
	
	@Mock
	private UserNotificationService userNotificationService;
	
    @Mock
    private OrganisationAccountOnboardingRegistryRepository repository;
    
    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private EmailBatchProperties emailBatchProperties;

    @Test
    void addVerifiedOrganisationAccounts() {
    	String email1 = "email1";
        String registrationNumber1 = "registrationNumber1";
        String email2 = "email2";
        String registrationNumber2 = "registrationNumber2";
        String email3 = "email3";
        String registrationNumber3 = "registrationNumber3";
        AppUser user = AppUser.builder().email(email1).userId("1234").build();
        List<OrganisationAccountOnboardingRegistryDTO> verifiedAccounts = buildVerifiedAccounts(
        		email1, email2, email3, registrationNumber1, registrationNumber2, registrationNumber3);

        when(queryService.getExistingEmails(any())).thenReturn(List.of());
        when(queryService.getExistingRegistrationNumbers(any())).thenReturn(List.of());
        when(emailBatchProperties.getSize()).thenReturn(7);

        service.addOrganisationAccountOnboardingRegistries(verifiedAccounts, user);
        
        verify(repository, times(1)).saveAll(anyList());
        verify(userNotificationService, timeout(500).times(3)).notifyVerifiedAccountUser(any());
    }
    
    @Test
    void addVerifiedOrganisationAccounts_duplicate_values() {
    	String email1 = "email1";
        String registrationNumber1 = "registrationNumber1";
        String email2 = "email1";
        String registrationNumber2 = "registrationNumber2";
        String email3 = "email3";
        String registrationNumber3 = "registrationNumber2";

        AppUser user = AppUser.builder().email(email1).userId("1234").build();
        List<OrganisationAccountOnboardingRegistryDTO> verifiedAccounts = buildVerifiedAccounts(
        		email1, email2, email3, registrationNumber1, registrationNumber2, registrationNumber3);

        BusinessException businessException = assertThrows(BusinessException.class, () ->
                service.addOrganisationAccountOnboardingRegistries(verifiedAccounts, user));

        assertEquals(ErrorCode.DUPLICATE_VALUES_EXIST, businessException.getErrorCode());
        assertThat(businessException.getData()).containsExactly(List.of(email1, registrationNumber2));
        verify(queryService, never()).getExistingEmails(anyList());
        verify(queryService, never()).getExistingRegistrationNumbers(anyList());
        verify(repository, never()).saveAll(anyList());
        verify(userNotificationService, after(100).never()).notifyVerifiedAccountUser(any());
    }
    
    @Test
    void addVerifiedOrganisationAccounts_existing_values() {
    	String email1 = "email1";
        String registrationNumber1 = "registrationNumber1";
        String email2 = "email2";
        String registrationNumber2 = "registrationNumber2";
        String email3 = "email3";
        String registrationNumber3 = "registrationNumber3";

        AppUser user = AppUser.builder().email(email1).userId("1234").build();
        List<OrganisationAccountOnboardingRegistryDTO> verifiedAccounts = buildVerifiedAccounts(
        		email1, email2, email3, registrationNumber1, registrationNumber2, registrationNumber3);

        when(queryService.getExistingEmails(any())).thenReturn(List.of(email2, email3));
        when(queryService.getExistingRegistrationNumbers(any())).thenReturn(List.of(registrationNumber1, registrationNumber3));
        
        BusinessException businessException = assertThrows(BusinessException.class, () ->
                service.addOrganisationAccountOnboardingRegistries(verifiedAccounts, user));

        assertEquals(ErrorCode.VALUES_ALREADY_EXIST, businessException.getErrorCode());
        assertThat(businessException.getData()).containsExactly(List.of(email2, email3, registrationNumber1, registrationNumber3));
        verify(repository, never()).saveAll(anyList());
        verify(userNotificationService, after(100).never()).notifyVerifiedAccountUser(any());
    }

    @Test
    void markAccountOnboardingRegistryAsOnboarded() {
        String email = "user@esos.uk";
        String registrationNumber = "regNumber";

        OrganisationAccountOnboardingRegistry onboardingRegistry = OrganisationAccountOnboardingRegistry.builder()
            .email(email)
            .registrationNumber(registrationNumber)
            .status(OnboardingRegistryStatus.PENDING)
            .build();

        when(repository.findByEmailAndRegistrationNumber(email, registrationNumber))
            .thenReturn(Optional.of(onboardingRegistry));

        // Invoke
        service.markAccountOnboardingRegistryAsOnboarded(email, registrationNumber);

        // Verify
        verify(repository, times(1)).findByEmailAndRegistrationNumber(email, registrationNumber);

        ArgumentCaptor<OrganisationAccountOnboardingRegistry> onboardingRegistryArgumentCaptor = ArgumentCaptor.forClass(OrganisationAccountOnboardingRegistry.class);
        verify(repository, times(1)).save(onboardingRegistryArgumentCaptor.capture());
        OrganisationAccountOnboardingRegistry updatedOnboardingRegistry = onboardingRegistryArgumentCaptor.getValue();
        assertEquals(OnboardingRegistryStatus.ONBOARDED, updatedOnboardingRegistry.getStatus());
    }

    @Test
    void markAccountOnboardingRegistryAsOnboarded_onboarding_registry_not_found() {
        String email = "user@esos.uk";
        String registrationNumber = "regNumber";

        when(repository.findByEmailAndRegistrationNumber(email, registrationNumber))
            .thenReturn(Optional.empty());

        // Invoke
        BusinessException be = assertThrows(BusinessException.class,
            () -> service.markAccountOnboardingRegistryAsOnboarded(email, registrationNumber));
        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.RESOURCE_NOT_FOUND);

        // Verify
        verify(repository, times(1)).findByEmailAndRegistrationNumber(email, registrationNumber);
        verify(repository, never()).save(any(OrganisationAccountOnboardingRegistry.class));

    }

	private List<OrganisationAccountOnboardingRegistryDTO> buildVerifiedAccounts(
			String email1, String email2, String email3, 
			String registrationNumber1, String registrationNumber2, String registrationNumber3) {
		return List.of(
        		OrganisationAccountOnboardingRegistryDTO.builder()
        		.email(email1)
        		.registrationNumber(registrationNumber1)
        		.build(),
        		OrganisationAccountOnboardingRegistryDTO.builder()
        		.email(email2)
        		.registrationNumber(registrationNumber2)
        		.build(),
        		OrganisationAccountOnboardingRegistryDTO.builder()
        		.email(email3)
        		.registrationNumber(registrationNumber3)
        		.build());
	}
}