package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class ProgressUpdate2CancelService {

    private final RequestService requestService;

    @Transactional
    public void addActionToRequest(Request request) {
        requestService.addActionToRequest(
                request,
                null,
                RequestActionType.PROGRESS_UPDATE_2_APPLICATION_CANCELLED,
                request.getPayload().getOperatorAssignee()
        );
    }
}
