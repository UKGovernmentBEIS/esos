package uk.gov.esos.api.account.organisation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.service.AccountContactUpdateService;
import uk.gov.esos.api.authorization.operator.service.OperatorAuthorityService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountActivationServiceTest {

    @InjectMocks
    private OrganisationAccountActivationService accountActivationService;

    @Mock
    private OrganisationAccountQueryService organisationAccountQueryService;

    @Mock
    private OperatorAuthorityService operatorauthorityService;

    @Mock
    private OrganisationAccountStatusUpdateService organisationAccountStatusUpdateService;

    @Mock
    private AccountContactUpdateService accountContactUpdateService;

    @Mock
    private OrganisationAccountValidationService organisationAccountValidationService;

    @Test
    void activateAccount() {
        Long accountId = 1L;
        String user = "user";
        String registrationNbr = "registrationNbr";

        OrganisationAccount account = OrganisationAccount.builder().id(accountId).registrationNumber(registrationNbr).build();

        when(organisationAccountQueryService.getAccountById(accountId)).thenReturn(account);

        //invoke
        accountActivationService.activateAccount(accountId, user);

        //verify
        assertNotNull(account.getAcceptedDate());
        verify(organisationAccountQueryService, times(1)).getAccountById(accountId);
        verify(organisationAccountValidationService, times(1)).validateActiveAccountRegistrationNumberExistenceForUpdate(registrationNbr);
        verify(operatorauthorityService, times(1)).createOperatorAdminAuthority(accountId, user);
        verify(organisationAccountStatusUpdateService, times(1)).handleOrganisationAccountAccepted(accountId);
        verify(accountContactUpdateService, times(1)).assignUserAsPrimaryContact(user, account);
    }

    @Test
    void activateAccount_throws_exception_when_invalid_registration_nbr() {
        Long accountId = 1L;
        String user = "user";
        String registrationNbr = "registrationNbr";

        OrganisationAccount account = OrganisationAccount.builder().id(accountId).registrationNumber(registrationNbr).build();

        when(organisationAccountQueryService.getAccountById(accountId)).thenReturn(account);
        doThrow(new BusinessException(ErrorCode.ACCOUNT_REGISTRATION_NUMBER_ALREADY_EXISTS, registrationNbr))
            .when(organisationAccountValidationService).validateActiveAccountRegistrationNumberExistenceForUpdate(registrationNbr);

        // Invoke
        BusinessException ex = assertThrows(BusinessException.class,
            () -> accountActivationService.activateAccount(accountId, user));

        // Verify
        assertEquals(ErrorCode.ACCOUNT_REGISTRATION_NUMBER_ALREADY_EXISTS, ex.getErrorCode());
        assertThat(ex.getData()).isEqualTo(new Object[]{registrationNbr});

        verify(organisationAccountQueryService, times(1)).getAccountById(accountId);
        verify(organisationAccountValidationService, times(1)).validateActiveAccountRegistrationNumberExistenceForUpdate(registrationNbr);
        verifyNoInteractions(operatorauthorityService, organisationAccountStatusUpdateService, accountContactUpdateService);
    }
}