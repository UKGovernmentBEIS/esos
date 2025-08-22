package uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.submit.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.reporting.actionplan.common.domain.ActionPlanSubmitParams;
import uk.gov.esos.api.reporting.actionplan.common.service.ActionPlanService;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.submit.domain.ActionPlanP3ApplicationSubmitRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.submit.transform.ActionPlanP3SubmitMapper;

@Service
@RequiredArgsConstructor
public class ActionPlanP3SubmitService {

    private final ActionPlanService actionPlanService;
    private static final ActionPlanP3SubmitMapper ACTION_PLAN_P3_SUBMIT_MAPPER = Mappers.getMapper(ActionPlanP3SubmitMapper.class);

    public void submitActionPlanAction(RequestTask requestTask) {
        Request request = requestTask.getRequest();
        ActionPlanP3RequestPayload requestPayload = (ActionPlanP3RequestPayload) request.getPayload();
        ActionPlanP3ApplicationSubmitRequestTaskPayload applicationSubmitRequestTaskPayload =
                (ActionPlanP3ApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        // Update request payload
        requestPayload.setActionPlan(applicationSubmitRequestTaskPayload.getActionPlanP3());
        requestPayload.setActionPlanSectionsCompleted(applicationSubmitRequestTaskPayload.getActionPlanSectionsCompleted());
        requestPayload.setActionPlanAttachments(applicationSubmitRequestTaskPayload.getActionPlanAttachments());

        // Submit AP
        submitActionPlan(requestPayload, request.getAccountId());
    }

    private void submitActionPlan(ActionPlanP3RequestPayload requestPayload, Long accountId) {
        ActionPlanSubmitParams apSubmitParams = ActionPlanSubmitParams.builder()
                .accountId(accountId)
                .actionPlanContainer(ACTION_PLAN_P3_SUBMIT_MAPPER.toActionPlanP3Container(requestPayload, Phase.PHASE_3))
                .build();

        actionPlanService.submitActionPlan(apSubmitParams);
    }
}
