package uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3SaveApplicationRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.service.ActionPlanP3ApplyService;

import java.util.List;

@RequiredArgsConstructor
@Component
public class ActionPlanP3ApplySaveActionHandler implements RequestTaskActionHandler<ActionPlanP3SaveApplicationRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;
    private final ActionPlanP3ApplyService actionPlanP3ApplyService;

    @Override
    public void process(Long requestTaskId, RequestTaskActionType requestTaskActionType, AppUser appUser,
                        ActionPlanP3SaveApplicationRequestTaskActionPayload payload) {

        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        actionPlanP3ApplyService.applySaveAction(payload, requestTask);

    }

    @Override
    public List<RequestTaskActionType> getTypes() {
        return List.of(
                RequestTaskActionType.ACTION_PLAN_P3_SAVE_APPLICATION_SUBMIT
        );
    }
}
