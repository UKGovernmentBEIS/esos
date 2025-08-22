package uk.gov.esos.api.reporting.noc.phase3.domain.secondcomplianceperiod;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumption;
import uk.gov.esos.api.reporting.noc.phase3.domain.firstcomplianceperiod.FirstCompliancePeriod;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class SecondCompliancePeriod extends FirstCompliancePeriod {


    @Valid
    private EnergyConsumption reductionAchieved;
}
