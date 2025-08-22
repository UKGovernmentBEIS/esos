package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3MeasuresUpdate;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3MeasuresUpdatePayload;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3Payload;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3ApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3SaveApplicationRequestTaskActionPayload;

import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static uk.gov.esos.api.reporting.progressupdate.common.domain.ProgressUpdateP3Confirmation.ESOS_ACTION_PLAN_COMPLIANCE;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate2P3ApplyServiceTest {

    @InjectMocks
    private ProgressUpdate2P3ApplyService service;

    @Test
    void applySaveAction_ShouldUpdateMeasuresAndSections_WhenValidPayloadProvided() {
        final Map<String, String> sectionsCompleted = Map.of("key", "completed");

        final ProgressUpdate2P3 pu2 = ProgressUpdate2P3.builder()
                .progressUpdate2P3MeasuresUpdate(new ProgressUpdate2P3MeasuresUpdate())
                .responsibleOfficerConfirmation(Set.of(ESOS_ACTION_PLAN_COMPLIANCE))
                .build();

        final ProgressUpdate2P3Payload pu2Payload = ProgressUpdate2P3Payload.builder()
                .progressUpdate2P3MeasuresUpdate(new ProgressUpdate2P3MeasuresUpdatePayload())
                .build();

        final ProgressUpdate2P3SaveApplicationRequestTaskActionPayload taskActionPayload =
                ProgressUpdate2P3SaveApplicationRequestTaskActionPayload.builder()
                        .payloadType(RequestTaskActionPayloadType.PROGRESS_UPDATE_2_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD)
                        .progressUpdate2P3(pu2Payload)
                        .progressUpdate2P3SectionsCompleted(sectionsCompleted)
                        .build();

        RequestTask requestTask = RequestTask.builder()
                .type(RequestTaskType.PROGRESS_UPDATE_2_P3_APPLICATION_SUBMIT)
                .payload(ProgressUpdate2P3ApplicationRequestTaskPayload.builder()
                        .progressUpdate2P3(pu2)
                        .isDisaggregateUndertaking(true)
                        .payloadType(RequestTaskPayloadType.PROGRESS_UPDATE_2_P3_APPLICATION_SUBMIT_PAYLOAD)
                        .build())
                .build();

        // Invoke
        service.applySaveAction(taskActionPayload, requestTask);

        // Verify
        assertThat(requestTask.getPayload()).isInstanceOf(ProgressUpdate2P3ApplicationRequestTaskPayload.class);
        assertThat(((ProgressUpdate2P3ApplicationRequestTaskPayload) requestTask.getPayload()).getProgressUpdate2P3SectionsCompleted())
                .isEqualTo(sectionsCompleted);
    }

}