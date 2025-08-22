package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.submit.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3ApplicationRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.mapper.ProgressUpdate2P3Mapper;

@Service
@RequiredArgsConstructor
public class ProgressUpdate2P3AddSubmittedRequestActionService {

    private final RequestService requestService;
    private static final ProgressUpdate2P3Mapper PU2_P3_MAPPER = Mappers.getMapper(ProgressUpdate2P3Mapper.class);

    public void addRequestAction(String requestId) {
        Request request = requestService.findRequestById(requestId);
        ProgressUpdate2P3RequestPayload requestPayload = (ProgressUpdate2P3RequestPayload) request.getPayload();
        ProgressUpdate2P3ApplicationRequestActionPayload requestActionPayload =
                PU2_P3_MAPPER
                        .toProgressUpdate2P3ApplicationRequestActionPayload(
                                requestPayload,
                                RequestActionPayloadType.PROGRESS_UPDATE_2_P3_APPLICATION_SUBMITTED_PAYLOAD
                        );

        requestService.addActionToRequest(
                request,
                requestActionPayload,
                RequestActionType.PROGRESS_UPDATE_2_P3_APPLICATION_SUBMITTED,
                requestPayload.getOperatorAssignee()
        );
    }
}
