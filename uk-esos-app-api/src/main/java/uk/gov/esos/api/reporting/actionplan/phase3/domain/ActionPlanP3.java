package uk.gov.esos.api.reporting.actionplan.phase3.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
/*
If there are no energy efficiency measures (haveEnergyEfficiencyMeasures == false), the responsibleOfficerConfirmation must be 'ESOS_ASSESSMENT_NOTIFICATION'.
If no measures have OTHER_REASONABLE_ESTIMATION_METHOD, the check for responsibleOfficerConfirmation remains standard, ensuring that ESOS_ASSESSMENT_NOTIFICATION is selected when required.
If at least one measure has OTHER_REASONABLE_ESTIMATION_METHOD, the validation ensures that both options are selected for responsibleOfficerConfirmation
 */
@SpELExpression(
        expression = "(T(java.lang.Boolean).FALSE.equals(#energyEfficiencyMeasure.haveEnergyEfficiencyMeasures) && " +
                "#responsibleOfficerConfirmation.contains('ESOS_ASSESSMENT_NOTIFICATION') && #responsibleOfficerConfirmation.size() == 1) || " +
                "(T(java.lang.Boolean).TRUE.equals(#energyEfficiencyMeasure.haveEnergyEfficiencyMeasures) && " +
                "#energyEfficiencyMeasure.energyEfficiencyMeasures != null && " +
                "#energyEfficiencyMeasure.energyEfficiencyMeasures.size() > 0 && " +
                "(#energyEfficiencyMeasure.energyEfficiencyMeasures.?[energySavingsEstimateCalculatedType == 'OTHER_REASONABLE_ESTIMATION_METHOD'].size() == 0 || " +
                "(#responsibleOfficerConfirmation.contains('ESOS_ASSESSMENT_NOTIFICATION') && " +
                "#responsibleOfficerConfirmation.contains('ESTIMATION_METHOD_DESCRIPTION'))))",
        message = "ap.responsibleOfficerConfirmationType"
)
public class ActionPlanP3 {

    @NotNull
    @Valid
    private ActionPlanEnergyEfficiencyMeasure energyEfficiencyMeasure;

    @Builder.Default
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Set<ResponsibleOfficerConfirmationType> responsibleOfficerConfirmation = new HashSet<>();

}
