package uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.submit.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanEnergyEfficiencyMeasure;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanP3;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ResponsibleOfficerConfirmationType;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.submit.domain.ActionPlanP3ApplicationSubmitRequestTaskPayload;

import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class ActionPlanP3ApplicationSubmitInitializerRequestTaskHandlerTest {

    @InjectMocks
    private ActionPlanP3ApplicationSubmitInitializerRequestTaskHandler handler;

    @Test
    void initializePayload() {
        final long accountId = 1L;
        final Request request = Request.builder()
                .accountId(accountId)
                .payload(ActionPlanP3RequestPayload.builder()
                        .payloadType(RequestPayloadType.ACTION_PLAN_P3_REQUEST_PAYLOAD)
                        .build())
                .build();

        final ActionPlanP3ApplicationSubmitRequestTaskPayload expected =
                ActionPlanP3ApplicationSubmitRequestTaskPayload.builder()
                        .payloadType(RequestTaskPayloadType.ACTION_PLAN_P3_APPLICATION_SUBMIT_PAYLOAD)
                        .build();
        // Invoke
        RequestTaskPayload actual = handler.initializePayload(request);

        // Verify
        assertThat(actual)
                .isInstanceOf(ActionPlanP3ApplicationSubmitRequestTaskPayload.class)
                .isEqualTo(expected);

    }

    @Test
    void initializePayload_from_request() {
        final Map<String, String> apSectionsCompleted = Map.of("key", "completed");
        final ActionPlanP3 actionPlanP3 = ActionPlanP3.builder().energyEfficiencyMeasure(ActionPlanEnergyEfficiencyMeasure.builder()
                        .haveEnergyEfficiencyMeasures(false).build())
                .responsibleOfficerConfirmation(Set.of(ResponsibleOfficerConfirmationType.ESTIMATION_METHOD_DESCRIPTION)).build();

        final Request request = Request.builder()
                .payload(ActionPlanP3RequestPayload.builder()
                        .payloadType(RequestPayloadType.ACTION_PLAN_P3_REQUEST_PAYLOAD)
                        .actionPlan(actionPlanP3)
                        .actionPlanSectionsCompleted(apSectionsCompleted)
                        .build())
                .build();

        final ActionPlanP3ApplicationSubmitRequestTaskPayload expected =
                ActionPlanP3ApplicationSubmitRequestTaskPayload.builder()
                        .payloadType(RequestTaskPayloadType.ACTION_PLAN_P3_APPLICATION_SUBMIT_PAYLOAD)
                        .actionPlanP3(actionPlanP3)
                        .actionPlanSectionsCompleted(apSectionsCompleted)
                        .build();

        // Invoke
        RequestTaskPayload actual = handler.initializePayload(request);

        // Verify
        assertThat(actual)
                .isInstanceOf(ActionPlanP3ApplicationSubmitRequestTaskPayload.class)
                .isEqualTo(expected);
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(handler.getRequestTaskTypes()).containsExactly(RequestTaskType.ACTION_PLAN_P3_APPLICATION_SUBMIT);
    }

}