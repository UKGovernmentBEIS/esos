package uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanEnergyEfficiencyMeasure;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanP3;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3ApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3SaveApplicationRequestTaskActionPayload;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class ActionPlanP3ApplyServiceTest {

    @InjectMocks
    private ActionPlanP3ApplyService service;

    @Test
    void applySaveAction() {
        final Map<String, String> sectionsCompleted = Map.of("key", "completed");
        final ActionPlanP3 ap = ActionPlanP3.builder()
                .energyEfficiencyMeasure(new ActionPlanEnergyEfficiencyMeasure())
                .build();
        final ActionPlanP3SaveApplicationRequestTaskActionPayload taskActionPayload =
                ActionPlanP3SaveApplicationRequestTaskActionPayload.builder()
                        .payloadType(RequestTaskActionPayloadType.ACTION_PLAN_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD)
                        .actionPlanP3(ap)
                        .actionPlanSectionsCompleted(sectionsCompleted)
                        .build();
        RequestTask requestTask = RequestTask.builder()
                .type(RequestTaskType.ACTION_PLAN_P3_APPLICATION_SUBMIT)
                .payload(ActionPlanP3ApplicationRequestTaskPayload.builder()
                        .payloadType(RequestTaskPayloadType.ACTION_PLAN_P3_APPLICATION_SUBMIT_PAYLOAD)
                        .build())
                .build();

        // Invoke
        service.applySaveAction(taskActionPayload, requestTask);

        // Verify
        assertThat(requestTask.getPayload()).isInstanceOf(ActionPlanP3ApplicationRequestTaskPayload.class);
        assertThat(((ActionPlanP3ApplicationRequestTaskPayload) requestTask.getPayload()).getActionPlanSectionsCompleted())
                .isEqualTo(sectionsCompleted);
        assertThat(((ActionPlanP3ApplicationRequestTaskPayload) requestTask.getPayload()).getActionPlanP3())
                .isEqualTo(ap);
    }

}