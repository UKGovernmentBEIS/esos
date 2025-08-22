package uk.gov.esos.api.workflow.request.flow.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.account.domain.enumeration.AccountStatus;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.account.service.AccountQueryService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestQueryService;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RequestCreateValidatorServiceTest {

    @InjectMocks
    private RequestCreateValidatorService validatorService;

    @Mock
    private AccountQueryService accountQueryService;

    @Mock
    private RequestQueryService requestQueryService;

    @Test
    void validate() {
        final Long accountId = 1L;
        final Set<AccountStatus> applicableAccountStatuses = Set.of(
                OrganisationAccountStatus.LIVE,
                OrganisationAccountStatus.AWAITING_APPROVAL
        );
        final Set<RequestType> mutuallyExclusiveRequests = Set.of(RequestType.ORGANISATION_ACCOUNT_OPENING);

        when(accountQueryService.getAccountStatus(accountId)).thenReturn(OrganisationAccountStatus.LIVE);
        when(requestQueryService.findInProgressRequestsByAccount(accountId)).thenReturn(
                List.of(Request.builder().type(RequestType.NOTIFICATION_OF_COMPLIANCE_P3).build())
        );

        // Invoke
        RequestCreateValidationResult result = validatorService
                .validate(accountId, applicableAccountStatuses, mutuallyExclusiveRequests);

        // Verify
        assertThat(result).isEqualTo(RequestCreateValidationResult.builder().valid(true).build());
        verify(accountQueryService, times(1)).getAccountStatus(accountId);
        verify(requestQueryService, times(1)).findInProgressRequestsByAccount(accountId);
    }

    @Test
    void validate_failed() {
        final Long accountId = 1L;
        final Set<AccountStatus> applicableAccountStatuses = Set.of(
        		OrganisationAccountStatus.LIVE,
        		OrganisationAccountStatus.AWAITING_APPROVAL
        );

        when(accountQueryService.getAccountStatus(accountId)).thenReturn(OrganisationAccountStatus.DENIED);

        // Invoke
        RequestCreateValidationResult result = validatorService
                .validate(accountId, applicableAccountStatuses, Set.of());

        // Verify
        assertThat(result).isEqualTo(RequestCreateValidationResult.builder().valid(false)
                .reportedAccountStatus(OrganisationAccountStatus.DENIED)
                .applicableAccountStatuses(Set.of(
                		OrganisationAccountStatus.LIVE,
                		OrganisationAccountStatus.AWAITING_APPROVAL
                )).build());

        verify(accountQueryService, times(1)).getAccountStatus(accountId);
        verify(requestQueryService, never()).findInProgressRequestsByAccount(anyLong());
    }

    @Test
    void validate_whenConflicts_thenFail() {
        final Long accountId = 1L;
        final Set<AccountStatus> applicableAccountStatuses = Set.of(
        		OrganisationAccountStatus.LIVE,
        		OrganisationAccountStatus.AWAITING_APPROVAL
        );
        final Set<RequestType> mutuallyExclusiveRequests = Set.of(RequestType.ORGANISATION_ACCOUNT_OPENING);

        when(accountQueryService.getAccountStatus(accountId)).thenReturn(OrganisationAccountStatus.LIVE);
        when(requestQueryService.findInProgressRequestsByAccount(accountId)).thenReturn(
                List.of(Request.builder().type(RequestType.ORGANISATION_ACCOUNT_OPENING).build())
        );

        // Invoke
        RequestCreateValidationResult result = validatorService
                .validate(accountId, applicableAccountStatuses, mutuallyExclusiveRequests);

        // Verify
        assertThat(result).isEqualTo(RequestCreateValidationResult.builder().valid(false)
                .reportedRequestTypes(Set.of(RequestType.ORGANISATION_ACCOUNT_OPENING)).build());

        verify(accountQueryService, times(1)).getAccountStatus(accountId);
        verify(requestQueryService, times(1)).findInProgressRequestsByAccount(accountId);
    }
}
