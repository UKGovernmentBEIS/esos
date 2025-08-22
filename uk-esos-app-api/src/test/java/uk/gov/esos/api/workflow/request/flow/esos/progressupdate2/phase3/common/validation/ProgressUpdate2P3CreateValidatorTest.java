package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.validation;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestQueryService;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestCreateValidatorService;
import uk.gov.esos.api.workflowperiod.service.WorkFlowValidPeriodService;

import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate2P3CreateValidatorTest {

    @InjectMocks
    private ProgressUpdate2P3CreateValidator validator;

    @Mock
    private RequestCreateValidatorService requestCreateValidatorService;

    @Mock
    private RequestQueryService requestQueryService;

    @Mock
    private WorkFlowValidPeriodService workFlowValidPeriodService;

    private final long accountId = 1L;


    @BeforeEach
    void setup(){
        final RequestCreateValidationResult validationResult = RequestCreateValidationResult.builder().valid(true).build();
        when(requestCreateValidatorService
                .validate(accountId, Set.of(OrganisationAccountStatus.LIVE), Set.of()))
                .thenReturn(validationResult);
    }

    @Test
    void valid() {

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_2_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_2_P3, RequestStatus.COMPLETED))
                .thenReturn(false);
        when(workFlowValidPeriodService.isValidStartDate(RequestType.PROGRESS_UPDATE_2_P3))
                .thenReturn(true);

        //shouldBlockProgressUpdate1P3() return false
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.COMPLETED))
                .thenReturn(false);

        when(requestQueryService.existsRequestByAccountAndType(accountId, RequestType.PROGRESS_UPDATE_1_P3))
                .thenReturn(true);

        when(requestQueryService.existsRequestByAccountAndType(accountId, RequestType.ACTION_PLAN_P3))
                .thenReturn(true);

        RequestCreateValidationResult result = validator.validateAction(accountId);

        Assertions.assertTrue(result.isValid());
    }

    @Test
    void invalidWhenProgressUpdate2P3AlreadyExists() {

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_2_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(true);

        RequestCreateValidationResult result = validator.validateAction(accountId);

        Assertions.assertFalse(result.isValid());
        Assertions.assertEquals(Set.of(RequestType.PROGRESS_UPDATE_2_P3), result.getReportedRequestTypes());

        verify(requestQueryService, times(1))
                .existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_2_P3, RequestStatus.IN_PROGRESS);
        verify(requestCreateValidatorService, times(1))
                .validate(accountId, Set.of(OrganisationAccountStatus.LIVE), Set.of());
    }

    @Test
    void invalidWhenProgressUpdate1P3IsInProgress() {
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_2_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_2_P3, RequestStatus.COMPLETED))
                .thenReturn(false);
        when(workFlowValidPeriodService.isValidStartDate(RequestType.PROGRESS_UPDATE_2_P3))
                .thenReturn(true);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(true);

        RequestCreateValidationResult result = validator.validateAction(accountId);

        Assertions.assertFalse(result.isValid());
        Assertions.assertEquals(Set.of(RequestType.PROGRESS_UPDATE_1_P3), result.getReportedRequestTypes());
    }

    @Test
    void validWhenProgressUpdate1P3IsCancelled() {
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_2_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_2_P3, RequestStatus.COMPLETED))
                .thenReturn(false);
        when(workFlowValidPeriodService.isValidStartDate(RequestType.PROGRESS_UPDATE_2_P3))
                .thenReturn(true);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.COMPLETED))
                .thenReturn(false);

        when(requestQueryService.existsRequestByAccountAndType(accountId, RequestType.PROGRESS_UPDATE_1_P3))
                .thenReturn(true);
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.CANCELLED))
                .thenReturn(true);

        RequestCreateValidationResult result = validator.validateAction(accountId);

        Assertions.assertTrue(result.isValid());
        Assertions.assertEquals(Set.of(RequestType.PROGRESS_UPDATE_1_P3), result.getReportedRequestTypes());
    }

    @Test
    void validWhenActionPlanP3IsCancelled() {

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_2_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_2_P3, RequestStatus.COMPLETED))
                .thenReturn(false);
        when(workFlowValidPeriodService.isValidStartDate(RequestType.PROGRESS_UPDATE_2_P3))
                .thenReturn(true);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.COMPLETED))
                .thenReturn(false);


        when(requestQueryService.existsRequestByAccountAndType(accountId, RequestType.PROGRESS_UPDATE_1_P3))
                .thenReturn(true);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.CANCELLED))
                .thenReturn(false);

        when(requestQueryService.existsRequestByAccountAndType(accountId, RequestType.ACTION_PLAN_P3))
                .thenReturn(true);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.CANCELLED))
                .thenReturn(true);

        RequestCreateValidationResult result = validator.validateAction(accountId);

        Assertions.assertTrue(result.isValid());
        Assertions.assertEquals(Set.of(RequestType.ACTION_PLAN_P3), result.getReportedRequestTypes());
    }

    @Test
    void shouldReturnInvalidWhenStartDateIsNotValid() {
        when(workFlowValidPeriodService.isValidStartDate(RequestType.PROGRESS_UPDATE_2_P3))
                .thenReturn(false);

        RequestCreateValidationResult result = validator.validateAction(accountId);

        Assertions.assertFalse(result.isValid());
    }

    @Test
    void validWhenActionPlanP3NotExist() {
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_2_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_2_P3, RequestStatus.COMPLETED))
                .thenReturn(false);
        when(workFlowValidPeriodService.isValidStartDate(RequestType.PROGRESS_UPDATE_2_P3))
                .thenReturn(true);

        //shouldBlockProgressUpdate1P3() return false
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);

        when(requestQueryService.existsRequestByAccountAndType(accountId, RequestType.PROGRESS_UPDATE_1_P3))
                .thenReturn(true);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.CANCELLED))
                .thenReturn(false);

        when(requestQueryService.existsRequestByAccountAndType(accountId, RequestType.ACTION_PLAN_P3))
                .thenReturn(true);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.CANCELLED))
                .thenReturn(true);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.COMPLETED))
                .thenReturn(true);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.COMPLETED))
                .thenReturn(true);

        RequestCreateValidationResult result = validator.validateAction(accountId);

        Assertions.assertTrue(result.isValid());
        Assertions.assertEquals(Set.of(RequestType.ACTION_PLAN_P3), result.getReportedRequestTypes());
    }

    @Test
    void apInProgressNoPu1() {
        when(workFlowValidPeriodService.isValidStartDate(RequestType.PROGRESS_UPDATE_2_P3))
                .thenReturn(true);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_2_P3, RequestStatus.COMPLETED))
                .thenReturn(false);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_2_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);

        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(true);

        RequestCreateValidationResult result = validator.validateAction(accountId);

        Assertions.assertFalse(result.isValid());
    }

    @Test
    void ValidWhenAPNotStartedOrCanceledAndPu1Completed(){
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_2_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_2_P3, RequestStatus.COMPLETED))
                .thenReturn(false);
        when(workFlowValidPeriodService.isValidStartDate(RequestType.PROGRESS_UPDATE_2_P3))
                .thenReturn(true);

        //shouldBlockProgressUpdate1P3() return false
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.PROGRESS_UPDATE_1_P3, RequestStatus.IN_PROGRESS))
                .thenReturn(false);
        when(requestQueryService.existsRequestByAccountAndTypeAndStatus(accountId, RequestType.ACTION_PLAN_P3, RequestStatus.COMPLETED))
                .thenReturn(false);

        when(requestQueryService.existsRequestByAccountAndType(accountId, RequestType.PROGRESS_UPDATE_1_P3))
                .thenReturn(true);

        when(requestQueryService.existsRequestByAccountAndType(accountId, RequestType.ACTION_PLAN_P3))
                .thenReturn(true);

        RequestCreateValidationResult result = validator.validateAction(accountId);

        Assertions.assertTrue(result.isValid());
    }


}