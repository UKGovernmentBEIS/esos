package uk.gov.esos.api.workflow.request.flow.esos.actionplan.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class ActionPlanCancelService {

    private final RequestService requestService;

    @Transactional
    public void addActionToRequest(Request request) {
        requestService.addActionToRequest(
                request,
                null,
                RequestActionType.ACTION_PLAN_APPLICATION_CANCELLED,
                request.getPayload().getOperatorAssignee()
        );
    }

}
