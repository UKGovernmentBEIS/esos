package uk.gov.esos.api.reporting.actionplan.common.validation;

import jakarta.validation.constraints.NotNull;
import uk.gov.esos.api.reporting.actionplan.common.domain.ActionPlanContainer;
import uk.gov.esos.api.reporting.common.domain.Phase;

public interface ActionPlanPhaseValidatorService <T extends ActionPlanContainer> {

    void validate(@NotNull T actionPlanContainer);

    Phase getPhase();
}


