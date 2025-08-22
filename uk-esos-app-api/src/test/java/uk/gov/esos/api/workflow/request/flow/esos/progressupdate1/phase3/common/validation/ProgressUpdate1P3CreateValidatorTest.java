package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.validation;

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
class ProgressUpdate1P3CreateValidatorTest {

    @InjectMocks
    private ProgressUpdate1P3CreateValidator validator;

    @Mock
    private RequestCreateValidatorService requestCreateValidatorService;

    @Mock
    private RequestQueryService requestQueryService;

    @Mock
    private WorkFlowValidPeriodService workFlowValidPeriodService;

    @Test
    void validateAction_valid() {
        final long accountId = 1L;
        final RequestCreateValidationResult validationResult = RequestCreateValidationResult.builder().valid(true).build();

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.COMPLETED))
                .thenReturn(false);

        when(requestCreateValidatorService
                .validate(accountId, Set.of(OrganisationAccountStatus.LIVE), Set.of()))
                .thenReturn(validationResult);

        when(workFlowValidPeriodService.isValidStartDate(RequestType.PROGRESS_UPDATE_1_P3))
                .thenReturn(true);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);

        when(requestQueryService.existsRequestByAccountAndType(accountId, RequestType.ACTION_PLAN_P3))
                .thenReturn(true);


        // Invoke
        RequestCreateValidationResult result = validator.validateAction(accountId);

        // Verify
        assertThat(result).isEqualTo(validationResult);
        verify(requestQueryService, times(1))
                .existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.IN_PROGRESS);
        verify(requestCreateValidatorService, times(1))
                .validate(accountId, Set.of(OrganisationAccountStatus.LIVE), Set.of());
    }

    @Test
    void validateAction_invalid_when_action_plan_in_progress() {
        final long accountId = 1L;

        final RequestCreateValidationResult validationResult = RequestCreateValidationResult.builder().valid(true).build();

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.COMPLETED))
                .thenReturn(false);

        when(requestCreateValidatorService
                .validate(accountId, Set.of(OrganisationAccountStatus.LIVE), Set.of()))
                .thenReturn(validationResult);

        when(workFlowValidPeriodService.isValidStartDate(RequestType.PROGRESS_UPDATE_1_P3))
                .thenReturn(true);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(true);

        final RequestCreateValidationResult expected = RequestCreateValidationResult.builder()
                .valid(false)
                .reportedRequestTypes(Set.of(RequestType.ACTION_PLAN_P3))
                .build();

        // Invoke
        RequestCreateValidationResult actual = validator.validateAction(accountId);

        // Verify
        assertThat(actual).isEqualTo(expected);
        verify(requestQueryService, times(1))
                .existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.IN_PROGRESS);
        verify(requestCreateValidatorService, times(1))
                .validate(accountId, Set.of(OrganisationAccountStatus.LIVE), Set.of());
    }

    @Test
    void validateAction_valid_when_action_plan_not_exist() {
        final long accountId = 1L;

        final RequestCreateValidationResult validationResult = RequestCreateValidationResult.builder().valid(true).build();

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.COMPLETED))
                .thenReturn(false);

        when(requestCreateValidatorService
                .validate(accountId, Set.of(OrganisationAccountStatus.LIVE), Set.of()))
                .thenReturn(validationResult);

        when(workFlowValidPeriodService.isValidStartDate(RequestType.PROGRESS_UPDATE_1_P3))
                .thenReturn(true);

        when(requestQueryService.existsRequestByAccountAndType(accountId, RequestType.ACTION_PLAN_P3))
                .thenReturn(false);

        final RequestCreateValidationResult expected = RequestCreateValidationResult.builder()
                .valid(true)
                .reportedRequestTypes(Set.of(RequestType.ACTION_PLAN_P3))
                .build();

        // Invoke
        RequestCreateValidationResult actual = validator.validateAction(accountId);

        // Verify
        assertThat(actual).isEqualTo(expected);
        verify(requestQueryService, times(1))
                .existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.IN_PROGRESS);
        verify(requestCreateValidatorService, times(1))
                .validate(accountId, Set.of(OrganisationAccountStatus.LIVE), Set.of());
    }

    @Test
    void validateAction_valid_when_action_plan_is_canceled() {
        final long accountId = 1L;

        final RequestCreateValidationResult validationResult = RequestCreateValidationResult.builder().valid(true).build();

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.COMPLETED))
                .thenReturn(false);

        when(requestCreateValidatorService
                .validate(accountId, Set.of(OrganisationAccountStatus.LIVE), Set.of()))
                .thenReturn(validationResult);

        when(workFlowValidPeriodService.isValidStartDate(RequestType.PROGRESS_UPDATE_1_P3))
                .thenReturn(true);

        when(requestQueryService.existsRequestByAccountAndType(accountId, RequestType.ACTION_PLAN_P3))
                .thenReturn(true);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_2_P3, RequestStatus.COMPLETED))
                .thenReturn(false);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_2_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.CANCELLED))
                .thenReturn(true);

        final RequestCreateValidationResult expected = RequestCreateValidationResult.builder()
                .valid(true)
                .reportedRequestTypes(Set.of(RequestType.ACTION_PLAN_P3))
                .build();

        // Invoke
        RequestCreateValidationResult actual = validator.validateAction(accountId);

        // Verify
        assertThat(actual).isEqualTo(expected);

        verify(requestCreateValidatorService, times(1))
                .validate(accountId, Set.of(OrganisationAccountStatus.LIVE), Set.of());
    }

    @Test
    void inValidWhenPU2InProgress(){

        final long accountId = 1L;

        final RequestCreateValidationResult validationResult = RequestCreateValidationResult.builder().valid(true).build();

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.COMPLETED))
                .thenReturn(false);

        when(requestCreateValidatorService
                .validate(accountId, Set.of(OrganisationAccountStatus.LIVE), Set.of()))
                .thenReturn(validationResult);

        when(workFlowValidPeriodService.isValidStartDate(RequestType.PROGRESS_UPDATE_1_P3))
                .thenReturn(true);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_2_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(true);

        final RequestCreateValidationResult expected = RequestCreateValidationResult.builder()
                .valid(false)
                .reportedRequestTypes(Set.of(RequestType.PROGRESS_UPDATE_2_P3))
                .build();

        // Invoke
        RequestCreateValidationResult actual = validator.validateAction(accountId);

        // Verify
        assertThat(actual).isEqualTo(expected);

        verify(requestCreateValidatorService, times(1))
                .validate(accountId, Set.of(OrganisationAccountStatus.LIVE), Set.of());

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
        assertThat(validator.getType()).isEqualTo(RequestCreateActionType.PROGRESS_UPDATE_1_P3);
    }


}