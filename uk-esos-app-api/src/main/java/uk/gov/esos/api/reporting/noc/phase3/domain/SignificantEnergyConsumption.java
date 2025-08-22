package uk.gov.esos.api.reporting.noc.phase3.domain;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class SignificantEnergyConsumption extends EnergyConsumption {

    @Min(0)
    private Long significantEnergyConsumptionPct;
}
