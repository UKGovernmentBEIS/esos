package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.submit.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.WorkflowService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.submit.service.ProgressUpdate2P3SubmitService;

import java.util.Map;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate2P3ApplicationSubmitActionHandlerTest {

    @InjectMocks
    private ProgressUpdate2P3ApplicationSubmitActionHandler submitActionHandler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private ProgressUpdate2P3SubmitService submitService;

    @Mock
    private WorkflowService workflowService;

    @Test
    void process() {
        Long requestTaskId = 1L;
        String processTaskId = "processTaskId";
        String requestId = "id";
        RequestTask requestTask = RequestTask.builder()
                .request(Request.builder().id(requestId).build())
                .processTaskId(processTaskId)
                .build();
        AppUser user = AppUser.builder().build();
        RequestTaskActionEmptyPayload payload = RequestTaskActionEmptyPayload.builder()
                .payloadType(RequestTaskActionPayloadType.EMPTY_PAYLOAD)
                .build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        // Invoke
        submitActionHandler.process(requestTaskId,
                RequestTaskActionType.PROGRESS_UPDATE_2_P3_SUBMIT_APPLICATION,
                user,
                payload);

        // Verify
        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(submitService, times(1)).submitProgressUpdate2Action(requestTask);
        verify(workflowService, times(1)).completeTask(processTaskId,
                Map.of(BpmnProcessConstants.REQUEST_ID, requestId,
                        BpmnProcessConstants.PROGRESS_UPDATE_2_OUTCOME, "SUBMIT"));
    }

}