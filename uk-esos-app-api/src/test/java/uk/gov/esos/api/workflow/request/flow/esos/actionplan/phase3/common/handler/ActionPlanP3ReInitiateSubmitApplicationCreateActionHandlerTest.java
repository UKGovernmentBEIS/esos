package uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.StartProcessRequestService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.common.domain.ReportRelatedRequestCreateActionPayload;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ActionPlanP3ReInitiateSubmitApplicationCreateActionHandlerTest {

    @InjectMocks
    private ActionPlanP3ReInitiateSubmitApplicationCreateActionHandler handler;

    @Mock
    private RequestService requestService;

    @Mock
    private StartProcessRequestService startProcessRequestService;

    @Test
    void process() {
        final String requestId = "AP00001-P3";
        final String userId = "userId";
        final AppUser appUser = AppUser.builder().userId(userId).build();
        final Long accountId = 1L;
        final ReportRelatedRequestCreateActionPayload createPayload = ReportRelatedRequestCreateActionPayload.builder()
                .payloadType(RequestCreateActionPayloadType.REPORT_RELATED_REQUEST_CREATE_ACTION_PAYLOAD)
                .requestId(requestId)
                .build();
        final RequestCreateActionType type = RequestCreateActionType.RE_INITIATE_ACTION_PLAN_P3;

        final Request request = Request.builder().id(requestId).build();

        when(requestService.findRequestById(requestId)).thenReturn(request);

        // Invoke
        String result = handler.process(accountId, type, createPayload, appUser);

        // Verify
        assertThat(result).isEqualTo(requestId);
        verify(startProcessRequestService, times(1)).reStartProcess(request);
        verify(requestService, times(1))
                .addActionToRequest(request, null, RequestActionType.ACTION_PLAN_P3_APPLICATION_RE_INITIATED, userId);
    }

    @Test
    void getType() {
        assertThat(handler.getType()).isEqualTo(RequestCreateActionType.RE_INITIATE_ACTION_PLAN_P3);
    }
}