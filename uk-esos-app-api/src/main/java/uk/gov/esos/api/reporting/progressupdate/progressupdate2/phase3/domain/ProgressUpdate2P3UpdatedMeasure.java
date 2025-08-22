package uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.EnergyEfficiencyMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3EnergyEfficiencyMeasure;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(
        expression = "{(T(java.lang.Boolean).FALSE.equals(#progressUpdate1P3EnergyEfficiencyMeasure?.measureIsImplemented)) " +
                "== (#progressUpdate2P3EnergyEfficiencyMeasure.measureIsImplemented != null)}",
        message = "pu.measureIsImplemented"
)
public class ProgressUpdate2P3UpdatedMeasure {

    @NotNull
    private UUID uuId;

    @Valid
    private EnergyEfficiencyMeasure actionPlanEnergyEfficiencyMeasure;

    @Valid
    private ProgressUpdate1P3EnergyEfficiencyMeasure progressUpdate1P3EnergyEfficiencyMeasure;

    @Valid
    private ProgressUpdate2P3EnergyEfficiencyMeasure progressUpdate2P3EnergyEfficiencyMeasure;
}
