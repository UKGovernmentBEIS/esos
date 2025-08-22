package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.handler;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3MeasuresUpdate;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.service.InitializeRequestTaskHandler;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.service.ProgressUpdate1P3Service;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.submit.domain.ProgressUpdate1P3ApplicationSubmitRequestTaskPayload;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProgressUpdate1P3ApplicationSubmitInitializerRequestTaskHandler implements InitializeRequestTaskHandler {

    private final ProgressUpdate1P3Service progressUpdate1P3Service;

    @Override
    public RequestTaskPayload initializePayload(Request request) {

        ProgressUpdate1P3RequestPayload payload = (ProgressUpdate1P3RequestPayload) request.getPayload();

        if (ObjectUtils.isNotEmpty(payload.getProgressUpdate1P3())) {
            return ProgressUpdate1P3ApplicationSubmitRequestTaskPayload.builder()
                    .payloadType(RequestTaskPayloadType.PROGRESS_UPDATE_1_P3_APPLICATION_SUBMIT_PAYLOAD)
                    .progressUpdate1P3(payload.getProgressUpdate1P3())
                    .progressUpdate1P3SectionsCompleted(payload.getProgressUpdate1P3SectionsCompleted())
                    .progressUpdate1P3Attachments(payload.getProgressUpdate1Attachments())
                    .isDisaggregateUndertaking(payload.getIsDisaggregateUndertaking())
                    .build();
        }

        return ProgressUpdate1P3ApplicationSubmitRequestTaskPayload.builder()
                .isDisaggregateUndertaking(payload.getIsDisaggregateUndertaking())
                .progressUpdate1P3(Boolean.FALSE.equals(payload.getIsDisaggregateUndertaking())
                        ? ProgressUpdate1P3.builder()
                        .progressUpdate1P3MeasuresUpdate(ProgressUpdate1P3MeasuresUpdate.builder()
                                .progressUpdate1P3Measures(progressUpdate1P3Service.initializeProgressUpdateMeasures(request))
                                .build())
                        .build()
                        : ProgressUpdate1P3.builder()
                        .progressUpdate1P3MeasuresUpdate(ProgressUpdate1P3MeasuresUpdate.builder()
                                .build())
                        .build())
                .payloadType(RequestTaskPayloadType.PROGRESS_UPDATE_1_P3_APPLICATION_SUBMIT_PAYLOAD)
                .build();
    }


    @Override
    public Set<RequestTaskType> getRequestTaskTypes() {
        return Set.of(RequestTaskType.PROGRESS_UPDATE_1_P3_APPLICATION_SUBMIT);
    }
}
