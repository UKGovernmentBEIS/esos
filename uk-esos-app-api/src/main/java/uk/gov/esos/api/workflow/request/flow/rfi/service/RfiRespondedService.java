package uk.gov.esos.api.workflow.request.flow.rfi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestMetadata;
import uk.gov.esos.api.workflow.request.core.domain.RequestMetadataRfiable;
import uk.gov.esos.api.workflow.request.core.domain.RequestPayload;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.rfi.domain.RequestPayloadRfiable;
import uk.gov.esos.api.workflow.request.flow.rfi.domain.RfiResponseSubmittedRequestActionPayload;

import java.time.LocalDateTime;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class RfiRespondedService {

    private final RequestService requestService;

    public void respond(final String requestId) {

        final Request request = requestService.findRequestById(requestId);
        
        final RequestPayload requestPayload = request.getPayload();
        final RequestPayloadRfiable requestRfiablePayload = (RequestPayloadRfiable) request.getPayload();

        final String operatorAssignee = requestPayload.getOperatorAssignee();

        // Set RFI response date for PDF document
        RequestMetadata requestMetadata = request.getMetadata();
        if(requestMetadata instanceof RequestMetadataRfiable) {
            ((RequestMetadataRfiable) requestMetadata).getRfiResponseDates().add(LocalDateTime.now());
        }

        // write timeline action
        final RfiResponseSubmittedRequestActionPayload timelinePayload =
            RfiResponseSubmittedRequestActionPayload
                .builder()
                .payloadType(RequestActionPayloadType.RFI_RESPONSE_SUBMITTED_PAYLOAD)
                .rfiResponsePayload(requestRfiablePayload.getRfiData().getRfiResponsePayload())
                .rfiQuestionPayload(requestRfiablePayload.getRfiData().getRfiQuestionPayload())
                .rfiAttachments(new HashMap<>(requestRfiablePayload.getRfiData().getRfiAttachments()))
                .build();

        requestService.addActionToRequest(request,
            timelinePayload,
            RequestActionType.RFI_RESPONSE_SUBMITTED,
            operatorAssignee);
    }
}
