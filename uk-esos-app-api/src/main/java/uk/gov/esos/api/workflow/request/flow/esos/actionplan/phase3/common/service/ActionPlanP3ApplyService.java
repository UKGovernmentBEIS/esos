package uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3ApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3SaveApplicationRequestTaskActionPayload;

@Service
public class ActionPlanP3ApplyService {

    @Transactional
    public void applySaveAction(ActionPlanP3SaveApplicationRequestTaskActionPayload taskActionPayload, RequestTask requestTask) {
        ActionPlanP3ApplicationRequestTaskPayload taskPayload =
                (ActionPlanP3ApplicationRequestTaskPayload) requestTask.getPayload();

        taskPayload.setActionPlanP3(taskActionPayload.getActionPlanP3());
        taskPayload.setActionPlanSectionsCompleted(taskActionPayload.getActionPlanSectionsCompleted());
    }
}
