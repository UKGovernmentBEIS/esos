package uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.EnergyEfficiencyMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.MeasureImplType;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(
        expression = "{(#measureImplType eq 'MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN' && " +
                "#progressUpdate1P3EnergyEfficiencyMeasure?.measureIsImplemented != null) || " +
                "(#measureImplType eq 'MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN' && " +
                "#progressUpdate1P3EnergyEfficiencyMeasure?.measureIsImplemented == null) || " +
                "(#measureImplType ne 'MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN' && " +
                "#measureImplType ne 'MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN')}",
        message = "pu.measureIsImplemented"
)
@SpELExpression(
        expression = "{(#measureImplType eq 'MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN' && " +
                "T(java.lang.Boolean).TRUE.equals(#progressUpdate1P3EnergyEfficiencyMeasure?.measureIsImplemented)) == (#progressUpdate1P3EnergyEfficiencyMeasure?.measureImplementedByTheDateInActionPlan != null)}",
        message = "pu.measureImplementedByTheDateInActionPlan"
)
@SpELExpression(
        expression = "{(((#measureImplType eq 'MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN' && " +
                "T(java.lang.Boolean).TRUE.equals(#progressUpdate1P3EnergyEfficiencyMeasure?.measureIsImplemented)))" +
                " ||" +
                " (#measureImplType eq 'MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN' &&" +
                " T(java.lang.Boolean).TRUE.equals(#progressUpdate1P3EnergyEfficiencyMeasure?.reportReduction2024To2025))) " +
                "==" +
                " (#progressUpdate1P3EnergyEfficiencyMeasure?.reductionEnergyConsumption2024To2025 != null)}",
        message = "pu1.reductionEnergyConsumption2024To2025"
)
@SpELExpression(
        expression = "{(#progressUpdate1P3EnergyEfficiencyMeasure == null || " +
                "T(java.lang.Boolean).TRUE.equals(#progressUpdate1P3EnergyEfficiencyMeasure.measureIsImplemented) || " +
                "#measureImplType ne 'MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN' || " +
                "#progressUpdate1P3EnergyEfficiencyMeasure?.reductionEnergyConsumption2023To2024 == null) " +
                "&& " +
                "(((#measureImplType eq 'MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN'" +
                " && T(java.lang.Boolean).TRUE.equals(#progressUpdate1P3EnergyEfficiencyMeasure?.reportReduction2023To2024))" +
                " == " +
                "(#progressUpdate1P3EnergyEfficiencyMeasure?.reductionEnergyConsumption2023To2024 != null))" +
                " || " +
                "(#measureImplType ne 'MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN'))}",
        message = "pu1.reductionEnergyConsumption2023To2024"
)
@SpELExpression(
        expression = "{(#measureImplType eq 'MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN' && #progressUpdate1P3EnergyEfficiencyMeasure != null) ==" +
                " (#progressUpdate1P3EnergyEfficiencyMeasure?.reportReduction2024To2025 != null)}" ,
        message = "pu1.reportReduction2024To2025"
)
@SpELExpression(
        expression = "{(#measureImplType eq 'MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN' && #progressUpdate1P3EnergyEfficiencyMeasure != null) ==" +
                " (#progressUpdate1P3EnergyEfficiencyMeasure?.reportReduction2023To2024 != null)}" ,
        message = "pu1.reportReduction2023To2024"
)
public class ProgressUpdate1P3UpdatedMeasure {

    @NotNull
    private UUID uuId;

    @NotNull
    private MeasureImplType measureImplType;

    @Valid
    @NotNull
    private EnergyEfficiencyMeasure actionPlanEnergyEfficiencyMeasure;

    @Valid
    @NotNull
    private ProgressUpdate1P3EnergyEfficiencyMeasure progressUpdate1P3EnergyEfficiencyMeasure;

}
