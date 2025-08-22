package uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.submit.handler;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.service.InitializeRequestTaskHandler;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.submit.domain.ActionPlanP3ApplicationSubmitRequestTaskPayload;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class ActionPlanP3ApplicationSubmitInitializerRequestTaskHandler implements InitializeRequestTaskHandler {

    @Override
    public RequestTaskPayload initializePayload(Request request) {

        final ActionPlanP3RequestPayload requestPayload =
                (ActionPlanP3RequestPayload) request.getPayload();

        if(ObjectUtils.isEmpty(requestPayload.getActionPlan())) {
            return ActionPlanP3ApplicationSubmitRequestTaskPayload.builder()
                    .payloadType(RequestTaskPayloadType.ACTION_PLAN_P3_APPLICATION_SUBMIT_PAYLOAD).build();
        }

        return ActionPlanP3ApplicationSubmitRequestTaskPayload.builder()
                .payloadType(RequestTaskPayloadType.ACTION_PLAN_P3_APPLICATION_SUBMIT_PAYLOAD)
                .actionPlanP3(requestPayload.getActionPlan())
                .actionPlanSectionsCompleted(requestPayload.getActionPlanSectionsCompleted())
                .actionPlanAttachments(requestPayload.getActionPlanAttachments())
                .build();
    }

    @Override
    public Set<RequestTaskType> getRequestTaskTypes() {
        return Set.of(RequestTaskType.ACTION_PLAN_P3_APPLICATION_SUBMIT);
    }
}
