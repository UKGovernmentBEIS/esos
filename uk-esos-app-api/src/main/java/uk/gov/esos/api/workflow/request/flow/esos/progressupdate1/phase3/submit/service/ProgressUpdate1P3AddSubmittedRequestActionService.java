package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.submit.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3ApplicationRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.mapper.ProgressUpdate1P3Mapper;

@Service
@RequiredArgsConstructor
public class ProgressUpdate1P3AddSubmittedRequestActionService {

    private final RequestService requestService;
    private static final ProgressUpdate1P3Mapper PU1_P3_MAPPER = Mappers.getMapper(ProgressUpdate1P3Mapper.class);

    public void addRequestAction(String requestId) {
        Request request = requestService.findRequestById(requestId);
        ProgressUpdate1P3RequestPayload requestPayload = (ProgressUpdate1P3RequestPayload) request.getPayload();

        ProgressUpdate1P3ApplicationRequestActionPayload requestActionPayload =
                PU1_P3_MAPPER
                        .toProgressUpdate1P3ApplicationRequestActionPayload(
                                requestPayload,
                                RequestActionPayloadType.PROGRESS_UPDATE_1_P3_APPLICATION_SUBMITTED_PAYLOAD
                        );

        requestService.addActionToRequest(
                request,
                requestActionPayload,
                RequestActionType.PROGRESS_UPDATE_1_P3_APPLICATION_SUBMITTED,
                requestPayload.getOperatorAssignee()
        );
    }
}
