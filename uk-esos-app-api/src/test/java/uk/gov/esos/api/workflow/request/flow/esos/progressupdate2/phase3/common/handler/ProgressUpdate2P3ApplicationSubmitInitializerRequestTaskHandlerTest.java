package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.handler;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3UpdatedAddedMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3UpdatedMeasure;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.service.ProgressUpdate2P3Service;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.submit.domain.ProgressUpdate2P3ApplicationSubmitRequestTaskPayload;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate2P3ApplicationSubmitInitializerRequestTaskHandlerTest {

    @Mock
    private ProgressUpdate2P3Service progressUpdate2P3Service;

    @InjectMocks
    private ProgressUpdate2P3ApplicationSubmitInitializerRequestTaskHandler handler;

    @Test
    void initializePayload() {
        // Arrange
        Request request = mock(Request.class);
        ProgressUpdate2P3RequestPayload requestPayload = mock(ProgressUpdate2P3RequestPayload.class);

        when(request.getPayload()).thenReturn(requestPayload);
        when(requestPayload.getIsDisaggregateUndertaking()).thenReturn(false);

        List<ProgressUpdate2P3UpdatedMeasure> measures = List.of(new ProgressUpdate2P3UpdatedMeasure());
        List<ProgressUpdate2P3UpdatedAddedMeasure> addedMeasures = List.of(new ProgressUpdate2P3UpdatedAddedMeasure());
        when(progressUpdate2P3Service.initializeProgressUpdateMeasures(request)).thenReturn(measures);
        when(progressUpdate2P3Service.initializeProgressUpdate1AddedMeasures(request)).thenReturn(addedMeasures);

        RequestTaskPayload result = handler.initializePayload(request);

        assertNotNull(result);
        assertInstanceOf(ProgressUpdate2P3ApplicationSubmitRequestTaskPayload.class, result);
        ProgressUpdate2P3ApplicationSubmitRequestTaskPayload payload = (ProgressUpdate2P3ApplicationSubmitRequestTaskPayload) result;

        assertFalse(payload.getIsDisaggregateUndertaking());
        assertNotNull(payload.getProgressUpdate2P3());
        assertNotNull(payload.getProgressUpdate2P3().getProgressUpdate2P3MeasuresUpdate());
        assertEquals(measures, payload.getProgressUpdate2P3().getProgressUpdate2P3MeasuresUpdate().getProgressUpdate2P3Measures());
        assertEquals(addedMeasures, payload.getProgressUpdate2P3().getProgressUpdate2P3MeasuresUpdate().getProgressUpdate2P3UpdatedAddedMeasures());
    }

    @Test
    void initializePayload_empty() {
        // Arrange
        Request request = mock(Request.class);
        ProgressUpdate2P3RequestPayload requestPayload = mock(ProgressUpdate2P3RequestPayload.class);

        when(request.getPayload()).thenReturn(requestPayload);
        when(requestPayload.getIsDisaggregateUndertaking()).thenReturn(true);

        // Act
        RequestTaskPayload result = handler.initializePayload(request);

        // Assert
        assertNotNull(result);
        assertInstanceOf(ProgressUpdate2P3ApplicationSubmitRequestTaskPayload.class, result);
        ProgressUpdate2P3ApplicationSubmitRequestTaskPayload payload = (ProgressUpdate2P3ApplicationSubmitRequestTaskPayload) result;

        assertTrue(payload.getIsDisaggregateUndertaking());
        assertNotNull(payload.getProgressUpdate2P3());
        assertNotNull(payload.getProgressUpdate2P3().getProgressUpdate2P3MeasuresUpdate());
        Assertions.assertTrue(payload.getProgressUpdate2P3().getProgressUpdate2P3MeasuresUpdate().getProgressUpdate2P3Measures().isEmpty());
        Assertions.assertTrue(payload.getProgressUpdate2P3().getProgressUpdate2P3MeasuresUpdate().getProgressUpdate2P3UpdatedAddedMeasures().isEmpty());
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(handler.getRequestTaskTypes()).containsExactly(RequestTaskType.PROGRESS_UPDATE_2_P3_APPLICATION_SUBMIT);
    }

}