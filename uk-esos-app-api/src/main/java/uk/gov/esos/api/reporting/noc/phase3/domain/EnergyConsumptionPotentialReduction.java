package uk.gov.esos.api.reporting.noc.phase3.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.PositiveOrZero;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{" +
		"(#buildings?.energyConsumption eq null && #transport?.energyConsumption eq null && #industrialProcesses?.energyConsumption eq null && #otherProcesses?.energyConsumption eq null && #energyConsumptionTotal eq null) ||" + 
		"T(java.util.stream.LongStream).of(" +
        "(#buildings?.energyConsumption eq null ? 0 : #buildings.energyConsumption), " +
        "(#transport?.energyConsumption eq null ? 0 : #transport.energyConsumption), " +
        "(#industrialProcesses?.energyConsumption eq null ? 0 : #industrialProcesses.energyConsumption), " +
        "(#otherProcesses?.energyConsumption eq null ? 0 : #otherProcesses.energyConsumption)).sum() == #energyConsumptionTotal}",
        message = "noc.energyconsumption.sum")
public class EnergyConsumptionPotentialReduction {

    @Valid
    private PotentialReductionPair buildings;

    @Valid
    private PotentialReductionPair transport;

    @Valid
    private PotentialReductionPair industrialProcesses;

    @Valid
    private PotentialReductionPair otherProcesses;

    @PositiveOrZero
    private Long energyConsumptionTotal;

    @Digits(integer = Integer.MAX_VALUE, fraction = 2)
    @PositiveOrZero
    private BigDecimal energyCostTotal;
}
