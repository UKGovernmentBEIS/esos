package uk.gov.esos.api.account.organisation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountStatusUpdateServiceTest {


    @InjectMocks
    private OrganisationAccountStatusUpdateService accountStatusUpdateService;

    @Mock
    private OrganisationAccountQueryService accountQueryService;

    @Test
    void handleOrganisationAccountAccepted() {
        Long accountId = 1L;
        OrganisationAccount account = OrganisationAccount.builder()
            .id(accountId)
            .status(OrganisationAccountStatus.AWAITING_APPROVAL)
            .build();

        when(accountQueryService.getAccountById(accountId)).thenReturn(account);

        //invoke
        accountStatusUpdateService.handleOrganisationAccountAccepted(accountId);

        //verify
        assertEquals(OrganisationAccountStatus.LIVE, account.getStatus());
    }

    @Test
    void handleOrganisationAccountRejected() {
        Long accountId = 1L;
        OrganisationAccount account = OrganisationAccount.builder()
            .id(accountId)
            .status(OrganisationAccountStatus.AWAITING_APPROVAL)
            .build();

        when(accountQueryService.getAccountById(accountId)).thenReturn(account);

        //invoke
        accountStatusUpdateService.handleOrganisationAccountRejected(accountId);

        //verify
        assertEquals(OrganisationAccountStatus.DENIED, account.getStatus());
    }

    @Test
    void handleOrganisationAccountClosed() {
        Long accountId = 1L;
        OrganisationAccount account = OrganisationAccount.builder()
                .id(accountId)
                .status(OrganisationAccountStatus.LIVE)
                .build();

        when(accountQueryService.getAccountById(accountId)).thenReturn(account);

        //invoke
        accountStatusUpdateService.handleOrganisationAccountClosed(accountId);

        //verify
        assertEquals(OrganisationAccountStatus.CLOSED, account.getStatus());
    }
}