package uk.gov.esos.api.workflow.request.flow.esos.actionplan.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureRequestPayload;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ActionPlanCancelServiceTest {

    @InjectMocks
    private ActionPlanCancelService service;

    @Mock
    private RequestService requestService;

    @Test
    void addActionToRequest() {

        String requestId = "REQ_ID_1";
        Long accountId = 1L;
        AccountClosureRequestPayload requestPayload = AccountClosureRequestPayload.builder()
                .payloadType(RequestPayloadType.ACTION_PLAN_P3_REQUEST_PAYLOAD)
                .build();
        Request request = Request.builder()
                .id(requestId)
                .type(RequestType.ACTION_PLAN_P3)
                .payload(requestPayload)
                .accountId(accountId)
                .status(RequestStatus.CANCELLED)
                .build();

        service.addActionToRequest(request);

        assertEquals(RequestStatus.CANCELLED, request.getStatus(), "Request status should be CANCELLED");

        verify(requestService, times(1)).addActionToRequest(
                eq(request),
                eq(null),
                eq(RequestActionType.ACTION_PLAN_APPLICATION_CANCELLED),
                eq(request.getPayload().getRegulatorAssignee()));
    }

}