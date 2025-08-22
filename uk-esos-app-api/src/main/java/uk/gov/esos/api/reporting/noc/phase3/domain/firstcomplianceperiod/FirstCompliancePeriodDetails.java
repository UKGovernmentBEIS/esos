package uk.gov.esos.api.reporting.noc.phase3.domain.firstcomplianceperiod;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumption;
import uk.gov.esos.api.reporting.noc.phase3.domain.SignificantEnergyConsumption;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{(#significantEnergyConsumption?.total == null || ((#organisationalEnergyConsumptionBreakdown?.total == null) && (#organisationalEnergyConsumption == null)) || #significantEnergyConsumption?.significantEnergyConsumptionPct == null) " +
        "|| (T(java.lang.Math).floor(#significantEnergyConsumption.total * 100.0 / (#organisationalEnergyConsumption != null ? #organisationalEnergyConsumption : #organisationalEnergyConsumptionBreakdown?.total)) == #significantEnergyConsumption.significantEnergyConsumptionPct)} ",
        message = "noc.complianceperiod.significantEnergyConsumptionPct")
public class FirstCompliancePeriodDetails {

    @Min(0)
    @Digits(integer = 15, fraction = 0)
    private Long organisationalEnergyConsumption;

    @Valid
    private EnergyConsumption organisationalEnergyConsumptionBreakdown;

    @Valid
    private SignificantEnergyConsumption significantEnergyConsumption;

    @Size(max = 10000)
    private String explanation;

    @Valid
    private EnergyConsumption potentialReduction;
}
