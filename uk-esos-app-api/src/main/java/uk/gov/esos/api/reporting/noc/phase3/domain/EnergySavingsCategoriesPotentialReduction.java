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
		"(#energyManagementPractices?.energyConsumption eq null && #behaviourChangeInterventions?.energyConsumption eq null && #training?.energyConsumption eq null && " +
		"#controlsImprovements?.energyConsumption eq null && #capitalInvestments?.energyConsumption eq null && #otherMeasures?.energyConsumption eq null && #energyConsumptionTotal eq null) ||" +
		"T(java.util.stream.LongStream).of(" +
        "(#energyManagementPractices?.energyConsumption eq null ? 0 : #energyManagementPractices.energyConsumption), " +
        "(#behaviourChangeInterventions?.energyConsumption eq null ? 0 : #behaviourChangeInterventions.energyConsumption), " +
        "(#training?.energyConsumption eq null ? 0 : #training.energyConsumption), " +
        "(#controlsImprovements?.energyConsumption eq null ? 0 : #controlsImprovements.energyConsumption), " +
        "(#capitalInvestments?.energyConsumption eq null ? 0 : #capitalInvestments.energyConsumption), " +
        "(#otherMeasures?.energyConsumption eq null ? 0 : #otherMeasures.energyConsumption)).sum() == #energyConsumptionTotal}",
        message = "noc.energysavingscategories.sum")
public class EnergySavingsCategoriesPotentialReduction {

    @Valid
    private PotentialReductionPair energyManagementPractices;

    @Valid
    private PotentialReductionPair behaviourChangeInterventions;

    @Valid
    private PotentialReductionPair training;

    @Valid
    private PotentialReductionPair controlsImprovements;

    @Valid
    private PotentialReductionPair capitalInvestments;

    @Valid
    private PotentialReductionPair otherMeasures;

    @PositiveOrZero
    private Long energyConsumptionTotal;

    @Digits(integer = Integer.MAX_VALUE, fraction = 2)
    @PositiveOrZero
    private BigDecimal energyCostTotal;
}
