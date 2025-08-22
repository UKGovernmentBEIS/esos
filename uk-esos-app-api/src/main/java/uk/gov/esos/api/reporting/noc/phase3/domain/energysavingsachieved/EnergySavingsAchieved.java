package uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsachieved;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumption;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Section;
import uk.gov.esos.api.reporting.noc.phase3.domain.OptionalQuestion;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{(#energySavingCategoriesExist == null || #energySavingCategoriesExist eq 'NO' || #energySavingCategoriesExist eq 'SKIP_QUESTION') ? (#energySavingsCategories == null) : true}",
        message = "noc.energysavingsachieved.energySavingsCategories")
@SpELExpression(expression = "{(#energySavingsRecommendationsExist == null || #energySavingsRecommendationsExist eq 'NO' || #energySavingsRecommendationsExist eq 'SKIP_QUESTION') ? (#energySavingsRecommendations == null) : true}",
        message = "noc.energysavingsachieved.energySavingsRecommendations")
@SpELExpression(expression = "{(#energySavingsEstimation != null) == (#energySavingsEstimation?.buildings != null && #energySavingsEstimation?.transport != null " +
        "&& #energySavingsEstimation?.industrialProcesses != null &&  #energySavingsEstimation?.otherProcesses != null)} ",
        message = "noc.energysavingsachieved.energySavingsEstimation.exist")
public class EnergySavingsAchieved implements NocP3Section {

    @Valid
    private EnergyConsumption energySavingsEstimation;

    private OptionalQuestion energySavingCategoriesExist;

    @Valid
    private EnergySavingsCategories energySavingsCategories;

    @Min(0)
    @Digits(integer = 15, fraction = 0)
    private Long totalEnergySavingsEstimation;

    @NotNull
    private OptionalQuestion energySavingsRecommendationsExist;

    @Valid
    private EnergySavingsRecommendations energySavingsRecommendations;

    @Size(max = 10000)
    private String details;
}
