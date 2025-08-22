package uk.gov.esos.api.account.organisation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.client.service.CompanyInformationService;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.account.organisation.repository.OrganisationAccountRepository;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
class OrganisationAccountValidationServiceTest {

    @InjectMocks
    private OrganisationAccountValidationService service;

    @Mock
    private OrganisationAccountRepository repository;

    @Mock
    private CompanyInformationService companyInformationService;

    @Test
    void isExistingActiveAccountRegistrationNumber() {
        String registrationNbr = "registrationNbr";

        when(repository.existsByRegistrationNumberAndStatus(registrationNbr, OrganisationAccountStatus.LIVE)).thenReturn(true);

        // Verify
        assertTrue(service.isExistingActiveAccountRegistrationNumber(registrationNbr));
    }

    @Test
    void isExistingActiveAccountRegistrationNumber_null_registration_number() {
        assertFalse(service.isExistingActiveAccountRegistrationNumber(null));
        verifyNoInteractions(repository);
    }

    @Test
    void validateActiveAccountRegistrationNumberExistence_valid() {
        String registrationNbr = "registrationNbr";

        when(repository.existsByRegistrationNumberAndStatus(registrationNbr, OrganisationAccountStatus.LIVE)).thenReturn(false);

        // Invoke
        service.validateActiveAccountRegistrationNumberExistence(registrationNbr);

        // Verify
        verify(repository, times(1)).existsByRegistrationNumberAndStatus(registrationNbr, OrganisationAccountStatus.LIVE);
        verify(companyInformationService, times(1)).getCompanyProfile(registrationNbr);
    }

    @Test
    void validateActiveAccountRegistrationNumberExistence_invalid_throws_exception() {
        String registrationNbr = "registrationNbr";

        when(repository.existsByRegistrationNumberAndStatus(registrationNbr, OrganisationAccountStatus.LIVE)).thenReturn(true);

        // Invoke
        BusinessException ex = assertThrows(BusinessException.class,
            () -> service.validateActiveAccountRegistrationNumberExistence(registrationNbr));

        // Verify
        assertEquals(ErrorCode.ACCOUNT_REGISTRATION_NUMBER_ALREADY_EXISTS, ex.getErrorCode());
        assertThat(ex.getData()).isEqualTo(new Object[]{registrationNbr});

        verify(repository, times(1)).existsByRegistrationNumberAndStatus(registrationNbr, OrganisationAccountStatus.LIVE);
        verify(companyInformationService, times(1)).getCompanyProfile(registrationNbr);
    }

    @Test
    void validateActiveAccountRegistrationNumberExistence_not_found_in_companies_house_exception() {
        String registrationNbr = "registrationNbr";

        doThrow(new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, registrationNbr))
            .when(companyInformationService).getCompanyProfile(registrationNbr);

        // Invoke
        BusinessException ex = assertThrows(BusinessException.class,
            () -> service.validateActiveAccountRegistrationNumberExistence(registrationNbr));

        // Verify
        assertEquals(ErrorCode.RESOURCE_NOT_FOUND, ex.getErrorCode());

        verify(companyInformationService, times(1)).getCompanyProfile(registrationNbr);
        verifyNoInteractions(repository);
    }

    @Test
    void validateActiveAccountRegistrationNumberExistenceForUpdate_null_registration_number() {
        // Invoke
        service.validateActiveAccountRegistrationNumberExistenceForUpdate(null);

        // Verify
        verifyNoInteractions(repository, companyInformationService);
    }

    @Test
    void validateActiveAccountRegistrationNumberExistenceForUpdate_valid_when_no_active_account() {
        String registrationNbr = "registrationNbr";
        OrganisationAccount organisationAccount = OrganisationAccount.builder()
            .registrationNumber(registrationNbr)
            .status(OrganisationAccountStatus.AWAITING_APPROVAL)
            .build();

        when(repository.findAllByRegistrationNumber(registrationNbr)).thenReturn(List.of(organisationAccount));

        // Invoke
        service.validateActiveAccountRegistrationNumberExistenceForUpdate(registrationNbr);

        // Verify
        verify(repository, times(1)).findAllByRegistrationNumber(registrationNbr);
        verify(companyInformationService, times(1)).getCompanyProfile(registrationNbr);
    }

    @Test
    void validateActiveAccountRegistrationNumberExistenceForUpdate_valid_when_no_account() {
        String registrationNbr = "registrationNbr";

        when(repository.findAllByRegistrationNumber(registrationNbr)).thenReturn(List.of());

        // Invoke
        service.validateActiveAccountRegistrationNumberExistenceForUpdate(registrationNbr);

        // Verify
        verify(repository, times(1)).findAllByRegistrationNumber(registrationNbr);
        verify(companyInformationService, times(1)).getCompanyProfile(registrationNbr);
    }

    @Test
    void validateActiveAccountRegistrationNumberExistenceForUpdate_invalid_when_active_account() {
        String registrationNbr = "registrationNbr";
        OrganisationAccount organisationAccount = OrganisationAccount.builder()
            .registrationNumber(registrationNbr)
            .status(OrganisationAccountStatus.LIVE)
            .build();

        when(repository.findAllByRegistrationNumber(registrationNbr)).thenReturn(List.of(organisationAccount));

        // Invoke
        BusinessException ex = assertThrows(BusinessException.class,
            () -> service.validateActiveAccountRegistrationNumberExistenceForUpdate(registrationNbr));

        // Verify
        assertEquals(ErrorCode.ACCOUNT_REGISTRATION_NUMBER_ALREADY_EXISTS, ex.getErrorCode());
        assertThat(ex.getData()).isEqualTo(new Object[]{registrationNbr});

        // Verify
        verify(repository, times(1)).findAllByRegistrationNumber(registrationNbr);
        verify(companyInformationService, times(1)).getCompanyProfile(registrationNbr);
    }

    @Test
    void validateActiveAccountRegistrationNumberExistenceForUpdate_not_found_in_companies_house_exception() {
        String registrationNbr = "registrationNbr";

        doThrow(new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, registrationNbr))
            .when(companyInformationService).getCompanyProfile(registrationNbr);

        // Invoke
        BusinessException ex = assertThrows(BusinessException.class,
            () -> service.validateActiveAccountRegistrationNumberExistenceForUpdate(registrationNbr));

        // Verify
        assertEquals(ErrorCode.RESOURCE_NOT_FOUND, ex.getErrorCode());

        verify(companyInformationService, times(1)).getCompanyProfile(registrationNbr);
        verifyNoInteractions(repository);
    }
}