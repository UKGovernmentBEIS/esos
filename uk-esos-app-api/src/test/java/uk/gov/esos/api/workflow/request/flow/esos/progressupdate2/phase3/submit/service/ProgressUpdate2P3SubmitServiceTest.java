package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.submit.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.service.ProgressUpdate2Service;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.submit.domain.ProgressUpdate2P3ApplicationSubmitRequestTaskPayload;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate2P3SubmitServiceTest {

    @Mock
    private ProgressUpdate2Service progressUpdate2Service;

    @InjectMocks
    private ProgressUpdate2P3SubmitService progressUpdate2P3SubmitService;

    @Test
    public void testSubmitPU2P3() {
        // Arrange
        RequestTask requestTask = mock(RequestTask.class);
        Request request = mock(Request.class);
        ProgressUpdate2P3RequestPayload requestPayload = mock(ProgressUpdate2P3RequestPayload.class);
        ProgressUpdate2P3ApplicationSubmitRequestTaskPayload applicationSubmitRequestTaskPayload = mock(ProgressUpdate2P3ApplicationSubmitRequestTaskPayload.class);

        when(requestTask.getRequest()).thenReturn(request);
        when(request.getPayload()).thenReturn(requestPayload);
        when(requestTask.getPayload()).thenReturn(applicationSubmitRequestTaskPayload);

        // Mock values inside applicationSubmitRequestTaskPayload
        ProgressUpdate2P3 pu2 = mock(ProgressUpdate2P3.class);
        when(applicationSubmitRequestTaskPayload.getProgressUpdate2P3()).thenReturn(pu2);

        Map<String, String> sectionsCompleted = new HashMap<>();
        when(applicationSubmitRequestTaskPayload.getProgressUpdate2P3SectionsCompleted()).thenReturn(sectionsCompleted);

        // Mock the attachments
        Map<UUID, String> attachments = new HashMap<>();
        when(applicationSubmitRequestTaskPayload.getProgressUpdate2P3Attachments()).thenReturn(attachments);

        progressUpdate2P3SubmitService.submitProgressUpdate2Action(requestTask);

        // Assert
        verify(requestPayload).setProgressUpdate2P3(pu2);
        verify(requestPayload).setProgressUpdate2P3SectionsCompleted(sectionsCompleted);
        verify(requestPayload).setProgressUpdate2Attachments(attachments);

        verify(progressUpdate2Service, times(1)).submitProgressUpdate2(any());
    }

}