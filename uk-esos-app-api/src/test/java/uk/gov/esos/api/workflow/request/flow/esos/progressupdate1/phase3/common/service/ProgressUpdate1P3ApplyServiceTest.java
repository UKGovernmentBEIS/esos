package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3MeasuresUpdate;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3MeasuresUpdatePayload;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3Payload;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3ApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3SaveApplicationRequestTaskActionPayload;

import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static uk.gov.esos.api.reporting.progressupdate.common.domain.ProgressUpdateP3Confirmation.ESOS_ACTION_PLAN_COMPLIANCE;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate1P3ApplyServiceTest {

    @InjectMocks
    private ProgressUpdate1P3ApplyService service;

    @Test
    void applySaveAction_ShouldUpdateMeasuresAndSections_WhenValidPayloadProvided() {
        final Map<String, String> sectionsCompleted = Map.of("key", "completed");

        final ProgressUpdate1P3 pu1 = ProgressUpdate1P3.builder()
                .progressUpdate1P3MeasuresUpdate(new ProgressUpdate1P3MeasuresUpdate())
                .responsibleOfficerConfirmation(Set.of(ESOS_ACTION_PLAN_COMPLIANCE))
                .build();

        final ProgressUpdate1P3Payload pu1Payload = ProgressUpdate1P3Payload.builder()
                .progressUpdate1P3MeasuresUpdate(new ProgressUpdate1P3MeasuresUpdatePayload())
                .build();

        final ProgressUpdate1P3SaveApplicationRequestTaskActionPayload taskActionPayload =
                ProgressUpdate1P3SaveApplicationRequestTaskActionPayload.builder()
                        .payloadType(RequestTaskActionPayloadType.PROGRESS_UPDATE_1_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD)
                        .progressUpdate1P3(pu1Payload)
                        .progressUpdate1P3SectionsCompleted(sectionsCompleted)
                        .build();

        RequestTask requestTask = RequestTask.builder()
                .type(RequestTaskType.PROGRESS_UPDATE_1_P3_APPLICATION_SUBMIT)
                .payload(ProgressUpdate1P3ApplicationRequestTaskPayload.builder()
                        .progressUpdate1P3(pu1)
                        .isDisaggregateUndertaking(true)
                        .payloadType(RequestTaskPayloadType.PROGRESS_UPDATE_1_P3_APPLICATION_SUBMIT_PAYLOAD)
                        .build())
                .build();

        // Invoke
        service.applySaveAction(taskActionPayload, requestTask);

        // Verify
        assertThat(requestTask.getPayload()).isInstanceOf(ProgressUpdate1P3ApplicationRequestTaskPayload.class);
        assertThat(((ProgressUpdate1P3ApplicationRequestTaskPayload) requestTask.getPayload()).getProgressUpdate1P3SectionsCompleted())
                .isEqualTo(sectionsCompleted);
    }

}