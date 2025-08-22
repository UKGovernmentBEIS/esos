package uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3AddedMeasure;

import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@SpELExpression(
        expression = "{(#progressUpdate2P3EnergyEfficiencyMeasure.estimationMethodType != 'ACTION_PLAN_ESTIMATE')}",
        message = "pu2.estimationMethodType.actionPlan"
)
public class ProgressUpdate2P3UpdatedAddedMeasure {

    @NotNull
    private UUID uuId;

    @Valid
    @NotNull
    private ProgressUpdate1P3AddedMeasure progressUpdate1P3AddedMeasure;

    @Valid
    @NotNull
    private ProgressUpdate2P3EnergyEfficiencyMeasure progressUpdate2P3EnergyEfficiencyMeasure;

}
