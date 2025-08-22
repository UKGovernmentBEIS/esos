package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.submit.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestActionPayload;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3RequestPayload;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate1P3AddSubmittedRequestActionServiceTest {

    @InjectMocks
    private ProgressUpdate1P3AddSubmittedRequestActionService addSubmittedRequestActionService;

    @Mock
    private RequestService requestService;

    @Test
    void addRequestAction() {
        String requestId = "REQ_ID_1";
        String operatorAssignee = "operatorAssignee";
        Long accountId = 1L;
        ProgressUpdate1P3RequestPayload requestPayload = ProgressUpdate1P3RequestPayload.builder()
                .payloadType(RequestPayloadType.PROGRESS_UPDATE_1_P3_REQUEST_PAYLOAD)
                .progressUpdate1P3(ProgressUpdate1P3.builder().build())
                .isDisaggregateUndertaking(true)
                .operatorAssignee(operatorAssignee)
                .build();
        Request request = Request.builder()
                .id(requestId)
                .type(RequestType.PROGRESS_UPDATE_1_P3)
                .payload(requestPayload)
                .accountId(accountId)
                .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);

        addSubmittedRequestActionService.addRequestAction(requestId);

        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestService, times(1)).addActionToRequest(
                eq(request),
                any(RequestActionPayload.class),
                eq(RequestActionType.PROGRESS_UPDATE_1_P3_APPLICATION_SUBMITTED),
                eq(operatorAssignee));
    }

}