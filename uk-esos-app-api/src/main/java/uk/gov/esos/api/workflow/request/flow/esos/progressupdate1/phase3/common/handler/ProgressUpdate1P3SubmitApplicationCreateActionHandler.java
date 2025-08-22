package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.workflow.request.StartProcessRequestService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestMetadataType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestCreateActionHandler;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1RequestCreateActionPayload;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestParams;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3RequestMetadata;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3RequestPayload;

@Component
@RequiredArgsConstructor
public class ProgressUpdate1P3SubmitApplicationCreateActionHandler implements RequestCreateActionHandler<ProgressUpdate1RequestCreateActionPayload> {

    private final StartProcessRequestService startProcessRequestService;

    @Override
    public String process(Long accountId, RequestCreateActionType type, ProgressUpdate1RequestCreateActionPayload payload, AppUser appUser) {
        RequestParams requestParams = RequestParams.builder()
                .type(RequestType.PROGRESS_UPDATE_1_P3)
                .accountId(accountId)
                .requestPayload(ProgressUpdate1P3RequestPayload.builder()
                        .payloadType(RequestPayloadType.PROGRESS_UPDATE_1_P3_REQUEST_PAYLOAD)
                        .operatorAssignee(appUser.getUserId())
                        .isDisaggregateUndertaking(payload.getIsDisaggregateUndertaking())
                        .build())
                .requestMetadata(ProgressUpdate1P3RequestMetadata.builder()
                        .type(RequestMetadataType.PROGRESS_UPDATE_1_P3)
                        .phase(Phase.PHASE_3)
                        .build())
                .build();

        final Request request = startProcessRequestService.startProcess(requestParams);

        return request.getId();
    }

    @Override
    public RequestCreateActionType getType() {
        return RequestCreateActionType.PROGRESS_UPDATE_1_P3;
    }
}
