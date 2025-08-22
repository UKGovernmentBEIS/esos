package uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;
import uk.gov.esos.api.reporting.progressupdate.common.domain.EstimationMethodType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(
        expression = "{((T(java.lang.Boolean).TRUE.equals(#measureIsImplemented) || T(java.lang.Boolean).TRUE.equals(#reportReduction2025To2026))" +
                " == (#reductionEnergyConsumption2025To2026 != null))}",
        message = "pu2.reductionEnergyConsumption2025To2026"
)
@SpELExpression(
        expression = "{(#estimationMethodType eq 'OTHER_METHOD' && #estimationMethodDescription != null) || " +
                "(#estimationMethodType ne 'OTHER_METHOD' && #estimationMethodDescription == null)}",
        message = "pu.estimationMethodType.other"
)
@SpELExpression(
        expression = "{((T(java.lang.Boolean).TRUE.equals(#measureIsImplemented) || T(java.lang.Boolean).TRUE.equals(#reportReduction2025To2026))" +
                " == (#estimationMethodType != null))}",
        message = "pu2.estimationMethodType"
)
@SpELExpression(
        expression = "{(#measureIsImplemented == null) == (#reportReduction2025To2026 != null)}",
        message = "pu2.reportReduction2025To2026"
)
@SpELExpression(
        expression = "{((T(java.lang.Boolean).TRUE.equals(#measureIsImplemented))" +
                " == (#measureImplementedByTheDateInActionPlan != null))}" ,
        message = "pu.measureImplementedByTheDateInActionPlan"
)
public class ProgressUpdate2P3EnergyEfficiencyMeasure {

    private Boolean measureIsImplemented;

    private Boolean measureImplementedByTheDateInActionPlan;

    private Boolean reportReduction2025To2026;

    @Positive
    private Long reductionEnergyConsumption2025To2026;

    private EstimationMethodType estimationMethodType;

    @Size(max = 10000)
    private String estimationMethodDescription;

    @Size(max = 10000)
    private String providedContext;
}
