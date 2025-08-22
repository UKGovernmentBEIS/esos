package uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.submit.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3ApplicationRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.mapper.ActionPlanP3Mapper;

@Service
@RequiredArgsConstructor
public class ActionPlanP3AddSubmittedRequestActionService {

    private final RequestService requestService;
    private static final ActionPlanP3Mapper ACTION_PLAN_P3_MAPPER = Mappers.getMapper(ActionPlanP3Mapper.class);

    public void addRequestAction(String requestId) {
        Request request = requestService.findRequestById(requestId);
        ActionPlanP3RequestPayload requestPayload = (ActionPlanP3RequestPayload) request.getPayload();

        ActionPlanP3ApplicationRequestActionPayload requestActionPayload =
                ACTION_PLAN_P3_MAPPER
                        .toActionPlanP3ApplicationRequestActionPayload(
                                requestPayload,
                                RequestActionPayloadType.ACTION_PLAN_P3_APPLICATION_SUBMITTED_PAYLOAD
                        );

        requestService.addActionToRequest(
                request,
                requestActionPayload,
                RequestActionType.ACTION_PLAN_P3_APPLICATION_SUBMITTED,
                requestPayload.getOperatorAssignee()
        );
    }

}
