package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestQueryService;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestCreateValidatorService;
import uk.gov.esos.api.workflowperiod.service.WorkFlowValidPeriodService;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationOfComplianceP3CreateValidatorTest {

    @InjectMocks
    private NotificationOfComplianceP3CreateValidator validator;

    @Mock
    private RequestCreateValidatorService requestCreateValidatorService;

    @Mock
    private RequestQueryService requestQueryService;

    @Mock
    private WorkFlowValidPeriodService workFlowValidPeriodService;

    @Test
    void validateAction() {
        final long accountId = 1L;
        final RequestCreateValidationResult validationResult = RequestCreateValidationResult.builder().valid(true).build();

        when(requestQueryService.existsRequestByAccountAndType(accountId, RequestType.NOTIFICATION_OF_COMPLIANCE_P3))
                .thenReturn(false);
        when(requestCreateValidatorService
                .validate(accountId, Set.of(OrganisationAccountStatus.LIVE), Set.of()))
                .thenReturn(validationResult);

        when(workFlowValidPeriodService.isValidStartDate(RequestType.NOTIFICATION_OF_COMPLIANCE_P3)).thenReturn(true);


        // Invoke
        RequestCreateValidationResult result = validator.validateAction(accountId);

        // Verify
        assertThat(result).isEqualTo(validationResult);
        verify(requestQueryService, times(1))
                .existsRequestByAccountAndType(accountId, RequestType.NOTIFICATION_OF_COMPLIANCE_P3);
        verify(requestCreateValidatorService, times(1))
                .validate(accountId, Set.of(OrganisationAccountStatus.LIVE), Set.of());
    }

    @Test
    void validateAction_not_valid_when_request_exist() {
        final long accountId = 1L;
        final RequestCreateValidationResult validationResult = RequestCreateValidationResult.builder()
                .valid(false)
                .reportedRequestTypes(Set.of(RequestType.NOTIFICATION_OF_COMPLIANCE_P3))
                .build();

        when(requestQueryService.existsRequestByAccountAndType(accountId, RequestType.NOTIFICATION_OF_COMPLIANCE_P3))
                .thenReturn(true);

        // Invoke
        RequestCreateValidationResult result = validator.validateAction(accountId);

        // Verify
        assertThat(result).isEqualTo(validationResult);
        verify(requestQueryService, times(1))
                .existsRequestByAccountAndType(accountId, RequestType.NOTIFICATION_OF_COMPLIANCE_P3);
        verify(requestCreateValidatorService, never()).validate(anyLong(), anySet(), anySet());
    }

    @Test
    void validateAction_not_valid_when_invalid_start_date() {
        final long accountId = 1L;

        when(requestQueryService.existsRequestByAccountAndType(accountId, RequestType.NOTIFICATION_OF_COMPLIANCE_P3))
                .thenReturn(false);

        when(workFlowValidPeriodService.isValidStartDate(RequestType.NOTIFICATION_OF_COMPLIANCE_P3)).thenReturn(false);

        // Invoke
        RequestCreateValidationResult result = validator.validateAction(accountId);

        // Verify
        assertFalse(result.isValid());
        verify(requestQueryService, times(1))
                .existsRequestByAccountAndType(accountId, RequestType.NOTIFICATION_OF_COMPLIANCE_P3);
        verify(requestCreateValidatorService, never()).validate(anyLong(), anySet(), anySet());
    }

    @Test
    void getApplicableAccountStatuses() {
        assertThat(validator.getApplicableAccountStatuses()).containsExactly(OrganisationAccountStatus.LIVE);
    }

    @Test
    void getMutuallyExclusiveRequests() {
        assertThat(validator.getMutuallyExclusiveRequests()).isEmpty();
    }

    @Test
    void getType() {
        assertThat(validator.getType()).isEqualTo(RequestCreateActionType.NOTIFICATION_OF_COMPLIANCE_P3);
    }
}
