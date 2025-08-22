package uk.gov.esos.api.reporting.actionplan.phase3.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
/*
When haveEnergyEfficiencyMeasures is false, the list energyEfficiencyMeasures must be empty or null.
When haveEnergyEfficiencyMeasures is true, the list energyEfficiencyMeasures must be populated with one or more items
 */
@SpELExpression(
        expression = "(T(java.lang.Boolean).FALSE.equals(#haveEnergyEfficiencyMeasures) && (#energyEfficiencyMeasures == null || #energyEfficiencyMeasures.size() == 0)) || (T(java.lang.Boolean).TRUE.equals(#haveEnergyEfficiencyMeasures) && #energyEfficiencyMeasures != null && #energyEfficiencyMeasures.size() > 0)",
        message = "ap.haveEnergyEfficiencyMeasures"
)
/*
If haveEnergyEfficiencyMeasures is false, noHaveMeasureContext is optional.
If haveEnergyEfficiencyMeasures is true, noHaveMeasureContext must be null.
 */
@SpELExpression(
        expression = "T(java.lang.Boolean).FALSE.equals(#haveEnergyEfficiencyMeasures) || (#haveEnergyEfficiencyMeasures == true && #noMeasureContext == null)",
        message = "ap.noHaveMeasureContext"
)
public class ActionPlanEnergyEfficiencyMeasure {

    @NotNull
    private Boolean haveEnergyEfficiencyMeasures;

    @Size(max = 10000)
    private String noMeasureContext;

    @Valid
    @Builder.Default
    @Size(max = 100, message = "The list of energy efficiency measures cannot exceed 100 items")
    private List<EnergyEfficiencyMeasure> energyEfficiencyMeasures = new ArrayList<>();

}
