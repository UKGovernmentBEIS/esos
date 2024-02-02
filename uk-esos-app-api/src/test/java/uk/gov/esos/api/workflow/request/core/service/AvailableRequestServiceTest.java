package uk.gov.esos.api.workflow.request.core.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.service.AccountQueryService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.services.resource.AccountRequestAuthorizationResourceService;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.validation.EnabledWorkflowValidator;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestCreateByAccountValidator;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AvailableRequestServiceTest {

    private AvailableRequestService availableRequestService;

    @Mock
    private AccountRequestAuthorizationResourceService accountRequestAuthorizationResourceService;

    @Mock
    private AvailableRequestServiceTest.TestRequestCreateValidatorA requestCreateValidatorA;

    @Mock
    private AvailableRequestServiceTest.TestRequestCreateValidatorB requestCreateValidatorB;

    @Mock
    private EnabledWorkflowValidator enabledWorkflowValidator;

    @Mock
    private AccountQueryService accountQueryService;

    @BeforeEach
    public void setUp() {
        ArrayList<RequestCreateByAccountValidator> requestCreateByAccountValidators = new ArrayList<>();
        requestCreateByAccountValidators.add(requestCreateValidatorA);
        requestCreateByAccountValidators.add(requestCreateValidatorB);

        availableRequestService = new AvailableRequestService(accountRequestAuthorizationResourceService,
            requestCreateByAccountValidators, enabledWorkflowValidator, accountQueryService);
    }

    @Test
    void getAvailableAccountWorkflows() {
        final AppUser user = AppUser.builder().userId("user").build();
        final long accountId = 1L;
        final AccountType accountType = AccountType.ORGANISATION;
        final RequestCreateValidationResult result = RequestCreateValidationResult.builder().valid(true).build();
        final HashSet<String> actionTypes = new HashSet<>();
        actionTypes.add(RequestCreateActionType.NOTIFICATION_OF_COMPLIANCE_P3.name());
        actionTypes.add(RequestCreateActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION.name());

        when(accountQueryService.getAccountType(accountId)).thenReturn(accountType);
        when(enabledWorkflowValidator.isWorkflowEnabled(any(RequestType.class))).thenReturn(true);
        when(accountRequestAuthorizationResourceService.findRequestCreateActionsByAccountId(user, accountId))
                .thenReturn(actionTypes);
        when(requestCreateValidatorA.getType()).thenReturn(RequestCreateActionType.NOTIFICATION_OF_COMPLIANCE_P3);
        when(requestCreateValidatorA.validateAction(accountId)).thenReturn(result);

        // Invoke
        final Map<RequestCreateActionType, RequestCreateValidationResult> availableWorkflows =
                availableRequestService.getAvailableAccountWorkflows(accountId, user);

        // Verify
        verify(accountQueryService, times(1)).getAccountType(accountId);
        verify(enabledWorkflowValidator, times(2)).isWorkflowEnabled(any());
        verify(accountRequestAuthorizationResourceService, times(1))
                .findRequestCreateActionsByAccountId(user, accountId);
        verify(requestCreateValidatorA, times(1)).validateAction(accountId);

        assertThat(availableWorkflows).containsExactly(Map.entry(RequestCreateActionType.NOTIFICATION_OF_COMPLIANCE_P3, result));
    }

    @Test
    void getAvailableAccountWorkflows_exclude_disallowed_workflows() {
        final AppUser user = AppUser.builder().userId("user").build();
        final long accountId = 1L;
        final AccountType accountType = AccountType.ORGANISATION;
        final HashSet<String> actionTypes = new HashSet<>();
        actionTypes.add(RequestCreateActionType.NOTIFICATION_OF_COMPLIANCE_P3.name());
        actionTypes.add(RequestCreateActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION.name());

        when(accountQueryService.getAccountType(accountId)).thenReturn(accountType);
        when(enabledWorkflowValidator.isWorkflowEnabled(RequestType.NOTIFICATION_OF_COMPLIANCE_P3)).thenReturn(false);
        when(enabledWorkflowValidator.isWorkflowEnabled(RequestType.ORGANISATION_ACCOUNT_OPENING)).thenReturn(true);
        when(accountRequestAuthorizationResourceService.findRequestCreateActionsByAccountId(user, accountId))
                .thenReturn(actionTypes);

        // Invoke
        final Map<RequestCreateActionType, RequestCreateValidationResult> availableWorkflows =
                availableRequestService.getAvailableAccountWorkflows(accountId, user);

        // Verify
        verify(accountQueryService, times(1)).getAccountType(accountId);
        verify(enabledWorkflowValidator, times(2)).isWorkflowEnabled(any());
        verify(accountRequestAuthorizationResourceService, times(1))
                .findRequestCreateActionsByAccountId(user, accountId);
        verify(requestCreateValidatorA, never()).validateAction(anyLong());

        assertThat(availableWorkflows).isEmpty();
    }

    private static class TestRequestCreateValidatorA implements RequestCreateByAccountValidator {

        @Override
        public RequestCreateValidationResult validateAction(Long accountId) {
            return null;
        }

        @Override
        public RequestCreateActionType getType() {
            return null;
        }
    }

    private static class TestRequestCreateValidatorB implements RequestCreateByAccountValidator {

        @Override
        public RequestCreateValidationResult validateAction(Long accountId) {
            return null;
        }

        @Override
        public RequestCreateActionType getType() {
            return null;
        }
    }
}
