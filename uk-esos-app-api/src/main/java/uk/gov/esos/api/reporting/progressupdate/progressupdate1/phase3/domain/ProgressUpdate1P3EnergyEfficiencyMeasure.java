package uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
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
        expression = "{(#estimationMethodType eq 'OTHER_METHOD' && #estimationMethodDescription != null) || " +
                "(#estimationMethodType ne 'OTHER_METHOD' && #estimationMethodDescription == null)}",
        message = "pu.estimationMethodType.other"
)
public class ProgressUpdate1P3EnergyEfficiencyMeasure {

    private Boolean measureIsImplemented;

    private Boolean measureImplementedByTheDateInActionPlan;

    @Positive
    private Long reductionEnergyConsumption2024To2025;

    @PositiveOrZero
    private Long reductionEnergyConsumption2023To2024;

    private EstimationMethodType estimationMethodType;

    @Size(max = 10000)
    private String estimationMethodDescription;

    @Size(max = 10000)
    private String providedContext;

    private Boolean reportReduction2024To2025;

    private Boolean reportReduction2023To2024;

}
