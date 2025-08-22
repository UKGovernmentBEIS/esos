package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanEnergyEfficiencyMeasure;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanP3;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosure;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureRequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureSaveApplicationRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3ApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3SaveApplicationRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.service.ActionPlanP3ApplyService;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AccountClosureApplyServiceTest {

    @InjectMocks
    private AccountClosureApplyService service;

    @Mock
    private RequestService requestService;

    @Test
    void applySaveAction() {
        final AccountClosure accountClosure = AccountClosure.builder().reason("A reason").build();

        final AccountClosureSaveApplicationRequestTaskActionPayload taskActionPayload =
                AccountClosureSaveApplicationRequestTaskActionPayload.builder()
                        .payloadType(RequestTaskActionPayloadType.ACCOUNT_CLOSURE_SAVE_APPLICATION_SUBMIT_PAYLOAD)
                        .accountClosure(accountClosure)
                        .build();
        RequestTask requestTask = RequestTask.builder()
                .type(RequestTaskType.ACCOUNT_CLOSURE_SUBMIT)
                .payload(AccountClosureApplicationRequestTaskPayload.builder()
                        .payloadType(RequestTaskPayloadType.ACCOUNT_CLOSURE_APPLICATION_SUBMIT_PAYLOAD)
                        .build())
                .build();

        // Invoke
        service.applySaveAction(taskActionPayload, requestTask);

        // Verify
        assertThat(requestTask.getPayload()).isInstanceOf(AccountClosureApplicationRequestTaskPayload.class);
        assertThat(((AccountClosureApplicationRequestTaskPayload) requestTask.getPayload()).getAccountClosure())
                .isEqualTo(accountClosure);
    }

    @Test
    void cancelAccountClosure() {

        String requestId = "REQ_ID_1";
        Long accountId = 1L;
        AccountClosureRequestPayload requestPayload = AccountClosureRequestPayload.builder()
                .payloadType(RequestPayloadType.ACCOUNT_CLOSURE_REQUEST_PAYLOAD)
                .build();
        Request request = Request.builder()
                .id(requestId)
                .type(RequestType.ACCOUNT_CLOSURE)
                .payload(requestPayload)
                .accountId(accountId)
                .build();

        service.cancelAccountClosure(request);

        assertEquals(RequestStatus.CANCELLED, request.getStatus(), "Request status should be CANCELLED");

        verify(requestService, times(1)).addActionToRequest(
                eq(request),
                eq(null),
                eq(RequestActionType.ACCOUNT_CLOSURE_APPLICATION_CANCELLED),
                eq(request.getPayload().getRegulatorAssignee()));
    }
}