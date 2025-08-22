package uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.submit.transform;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanEnergyEfficiencyMeasure;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanP3;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanP3Container;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3RequestPayload;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ActionPlanP3SubmitMapperTest {

    private final ActionPlanP3SubmitMapper mapper = Mappers.getMapper(ActionPlanP3SubmitMapper.class);

    @Test
    void toApP3Container() {
        Phase phase = Phase.PHASE_3;
        ActionPlanP3 actionPlanP3 = ActionPlanP3.builder()
                .energyEfficiencyMeasure(ActionPlanEnergyEfficiencyMeasure.builder().haveEnergyEfficiencyMeasures(true).build())
                .build();

        ActionPlanP3RequestPayload requestPayload =
                ActionPlanP3RequestPayload.builder()
                        .actionPlan(actionPlanP3)
                        .build();

        ActionPlanP3Container expected = ActionPlanP3Container.builder().actionPlan(actionPlanP3).phase(phase).build();

        ActionPlanP3Container actual = mapper.toActionPlanP3Container(requestPayload, phase);

        assertEquals(expected, actual);
    }

}