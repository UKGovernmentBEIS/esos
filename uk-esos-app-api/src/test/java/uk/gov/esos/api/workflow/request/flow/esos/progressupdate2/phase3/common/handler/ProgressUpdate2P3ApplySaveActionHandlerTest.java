package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3SaveApplicationRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.service.ProgressUpdate2P3ApplyService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate2P3ApplySaveActionHandlerTest {

    @InjectMocks
    private ProgressUpdate2P3ApplySaveActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private ProgressUpdate2P3ApplyService progressUpdate1P3ApplyService;

    @Test
    void process() {
        final long requestTaskId = 1L;
        final AppUser appUser = AppUser.builder().userId("userId").build();
        final ProgressUpdate2P3SaveApplicationRequestTaskActionPayload taskActionPayload =
                ProgressUpdate2P3SaveApplicationRequestTaskActionPayload.builder()
                        .payloadType(RequestTaskActionPayloadType.PROGRESS_UPDATE_2_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD)
                        .build();
        final RequestTask requestTask = RequestTask.builder().id(requestTaskId).build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        // Invoke
        handler.process(requestTaskId, RequestTaskActionType.PROGRESS_UPDATE_2_P3_SAVE_APPLICATION_SUBMIT, appUser, taskActionPayload);

        // Verify
        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(progressUpdate1P3ApplyService, times(1)).applySaveAction(taskActionPayload, requestTask);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsExactly(RequestTaskActionType.PROGRESS_UPDATE_2_P3_SAVE_APPLICATION_SUBMIT);
    }

}