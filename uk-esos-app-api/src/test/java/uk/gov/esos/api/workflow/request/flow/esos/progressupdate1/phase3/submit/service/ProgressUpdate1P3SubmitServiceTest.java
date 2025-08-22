package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.submit.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.service.ProgressUpdate1Service;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.submit.domain.ProgressUpdate1P3ApplicationSubmitRequestTaskPayload;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate1P3SubmitServiceTest {

    @Mock
    private ProgressUpdate1Service progressUpdate1Service;

    @InjectMocks
    private ProgressUpdate1P3SubmitService progressUpdate1P3SubmitService;

    @Test
    public void testSubmitPU1P3() {
        // Arrange
        RequestTask requestTask = mock(RequestTask.class);
        Request request = mock(Request.class);
        ProgressUpdate1P3RequestPayload requestPayload = mock(ProgressUpdate1P3RequestPayload.class);
        ProgressUpdate1P3ApplicationSubmitRequestTaskPayload applicationSubmitRequestTaskPayload = mock(ProgressUpdate1P3ApplicationSubmitRequestTaskPayload.class);

        when(requestTask.getRequest()).thenReturn(request);
        when(request.getPayload()).thenReturn(requestPayload);
        when(requestTask.getPayload()).thenReturn(applicationSubmitRequestTaskPayload);

        // Mock values inside applicationSubmitRequestTaskPayload
        ProgressUpdate1P3 progressUpdate1P3 = mock(ProgressUpdate1P3.class);
        when(applicationSubmitRequestTaskPayload.getProgressUpdate1P3()).thenReturn(progressUpdate1P3);

        Map<String, String> sectionsCompleted = new HashMap<>();
        when(applicationSubmitRequestTaskPayload.getProgressUpdate1P3SectionsCompleted()).thenReturn(sectionsCompleted);

        // Mock the attachments
        Map<UUID, String> attachments = new HashMap<>();
        when(applicationSubmitRequestTaskPayload.getProgressUpdate1P3Attachments()).thenReturn(attachments);

        progressUpdate1P3SubmitService.submitProgressUpdate1Action(requestTask);

        // Assert
        verify(requestPayload).setProgressUpdate1P3(progressUpdate1P3);
        verify(requestPayload).setProgressUpdate1P3SectionsCompleted(sectionsCompleted);
        verify(requestPayload).setProgressUpdate1Attachments(attachments);

        verify(progressUpdate1Service, times(1)).submitProgressUpdate1(any());
    }

}