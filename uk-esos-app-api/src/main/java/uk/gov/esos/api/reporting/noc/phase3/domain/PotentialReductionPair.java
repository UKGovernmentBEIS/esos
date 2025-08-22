package uk.gov.esos.api.reporting.noc.phase3.domain;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.PositiveOrZero;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PotentialReductionPair {

    @PositiveOrZero
    @Digits(integer = 15, fraction = 0)
    private Long energyConsumption;

    @Digits(integer = Integer.MAX_VALUE, fraction = 2)
    @PositiveOrZero
    private BigDecimal energyCost;
}
