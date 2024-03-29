package uk.gov.esos.api.workflow.request.flow.rde.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.rde.domain.RdeForceDecisionRequestTaskPayload;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RdeUploadAttachmentService {

    private final RequestTaskService requestTaskService;

    @Transactional
    public void uploadAttachment(final Long requestTaskId, final String attachmentUuid, final String filename) {
        
        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final RdeForceDecisionRequestTaskPayload requestTaskPayload = (RdeForceDecisionRequestTaskPayload) requestTask.getPayload();

        requestTaskPayload.getRdeAttachments().put(UUID.fromString(attachmentUuid), filename);
    }
}
