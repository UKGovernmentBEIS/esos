package uk.gov.esos.api.reporting.actionplan.phase3.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.reporting.actionplan.common.domain.ActionPlanContainer;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ActionPlanP3Container extends ActionPlanContainer{

    @Valid
    @NotNull
    private ActionPlanP3 actionPlan;
}
