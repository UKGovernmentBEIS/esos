package uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsachieved;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{((#energyManagementPractices != null) ||  (#energyManagementPractices != null) || (#behaviourChangeInterventions != null) || " +
        "(#training != null) || (#controlsImprovements != null) || (#capitalInvestments != null) || (#otherMeasures != null)) ? " +
        "(T(java.util.stream.LongStream).of((#energyManagementPractices eq null ? 0 : #energyManagementPractices), " +
        "(#behaviourChangeInterventions eq null ? 0 : #behaviourChangeInterventions), " +
        "(#training eq null ? 0 : #training), " +
        "(#controlsImprovements eq null ? 0 : #controlsImprovements), " +
        "(#capitalInvestments eq null ? 0 : #capitalInvestments), " +
        "(#otherMeasures eq null ? 0 : #otherMeasures)).sum() == #total) : #total == null}",
        message = "noc.energysavingscategories.sum")
public class EnergySavingsCategories {

    @Min(0)
    @Digits(integer = 15, fraction = 0)
    private Long energyManagementPractices;

    @Min(0)
    @Digits(integer = 15, fraction = 0)
    private Long behaviourChangeInterventions;

    @Min(0)
    @Digits(integer = 15, fraction = 0)
    private Long training;

    @Min(0)
    @Digits(integer = 15, fraction = 0)
    private Long controlsImprovements;

    @Min(0)
    @Digits(integer = 15, fraction = 0)
    private Long capitalInvestments;

    @Min(0)
    @Digits(integer = 15, fraction = 0)
    private Long otherMeasures;

    @PositiveOrZero
    private Long total;
}
