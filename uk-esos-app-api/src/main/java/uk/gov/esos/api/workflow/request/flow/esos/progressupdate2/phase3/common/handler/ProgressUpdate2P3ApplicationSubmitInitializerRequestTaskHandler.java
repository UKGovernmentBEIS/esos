package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.handler;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3MeasuresUpdate;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.service.InitializeRequestTaskHandler;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.service.ProgressUpdate2P3Service;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.submit.domain.ProgressUpdate2P3ApplicationSubmitRequestTaskPayload;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProgressUpdate2P3ApplicationSubmitInitializerRequestTaskHandler implements InitializeRequestTaskHandler {

    private final ProgressUpdate2P3Service progressUpdate2P3Service;

    @Override
    public RequestTaskPayload initializePayload(Request request) {

        ProgressUpdate2P3RequestPayload payload = (ProgressUpdate2P3RequestPayload) request.getPayload();

        if (ObjectUtils.isNotEmpty(payload.getProgressUpdate2P3())) {
            return ProgressUpdate2P3ApplicationSubmitRequestTaskPayload.builder()
                    .payloadType(RequestTaskPayloadType.PROGRESS_UPDATE_2_P3_APPLICATION_SUBMIT_PAYLOAD)
                    .progressUpdate2P3(payload.getProgressUpdate2P3())
                    .progressUpdate2P3SectionsCompleted(payload.getProgressUpdate2P3SectionsCompleted())
                    .progressUpdate2P3Attachments(payload.getProgressUpdate2Attachments())
                    .isDisaggregateUndertaking(payload.getIsDisaggregateUndertaking())
                    .build();
        }

        return ProgressUpdate2P3ApplicationSubmitRequestTaskPayload.builder()
                .isDisaggregateUndertaking(payload.getIsDisaggregateUndertaking())
                .progressUpdate2P3(Boolean.FALSE.equals(payload.getIsDisaggregateUndertaking()) ? ProgressUpdate2P3.builder()
                        .progressUpdate2P3MeasuresUpdate(ProgressUpdate2P3MeasuresUpdate.builder()
                                .progressUpdate2P3Measures(progressUpdate2P3Service.initializeProgressUpdateMeasures(request))
                                .progressUpdate2P3UpdatedAddedMeasures(progressUpdate2P3Service.initializeProgressUpdate1AddedMeasures(request))
                                .build())
                        .build()
                        : ProgressUpdate2P3.builder()
                        .progressUpdate2P3MeasuresUpdate(ProgressUpdate2P3MeasuresUpdate.builder()
                                .build())
                        .build())
                .payloadType(RequestTaskPayloadType.PROGRESS_UPDATE_2_P3_APPLICATION_SUBMIT_PAYLOAD)
                .build();
    }


    @Override
    public Set<RequestTaskType> getRequestTaskTypes() {
        return Set.of(RequestTaskType.PROGRESS_UPDATE_2_P3_APPLICATION_SUBMIT);
    }


}
