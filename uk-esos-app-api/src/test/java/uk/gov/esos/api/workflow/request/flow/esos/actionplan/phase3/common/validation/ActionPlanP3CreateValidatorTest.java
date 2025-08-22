package uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.validation;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestQueryService;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestCreateValidatorService;
import uk.gov.esos.api.workflowperiod.service.WorkFlowValidPeriodService;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ActionPlanP3CreateValidatorTest {

    @InjectMocks
    private ActionPlanP3CreateValidator validator;

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

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);

        when(requestCreateValidatorService
                .validate(accountId, Set.of(OrganisationAccountStatus.LIVE), Set.of()))
                .thenReturn(validationResult);

        when(workFlowValidPeriodService.isValidStartDate(RequestType.ACTION_PLAN_P3))
                .thenReturn(true);


        // Invoke
        RequestCreateValidationResult result = validator.validateAction(accountId);

        // Verify
        assertThat(result).isEqualTo(validationResult);
        verify(requestQueryService, times(1))
                .existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.IN_PROGRESS);
        verify(requestCreateValidatorService, times(1))
                .validate(accountId, Set.of(OrganisationAccountStatus.LIVE), Set.of());
    }

    @Test
    void validatePU1Canceled() {
        final long accountId = 1L;
        final RequestCreateValidationResult validationResult = RequestCreateValidationResult.builder().valid(true).build();

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.COMPLETED))
                .thenReturn(false);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.COMPLETED))
                .thenReturn(false);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);

        when(requestCreateValidatorService
                .validate(accountId, Set.of(OrganisationAccountStatus.LIVE), Set.of()))
                .thenReturn(validationResult);

        when(workFlowValidPeriodService.isValidStartDate(RequestType.ACTION_PLAN_P3))
                .thenReturn(true);


        // Invoke
        RequestCreateValidationResult result = validator.validateAction(accountId);

        Assertions.assertTrue(result.isValid());
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
        assertThat(validator.getType()).isEqualTo(RequestCreateActionType.ACTION_PLAN_P3);
    }

}