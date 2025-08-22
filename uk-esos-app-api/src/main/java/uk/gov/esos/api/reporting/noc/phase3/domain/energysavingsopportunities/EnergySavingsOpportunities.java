package uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsopportunities;

import jakarta.validation.Valid;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumptionPotentialReduction;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergySavingsCategoriesPotentialReduction;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Section;
import uk.gov.esos.api.reporting.noc.phase3.domain.PotentialReductionPair;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnergySavingsOpportunities implements NocP3Section {

    @Valid
    private PotentialReductionPair implementationEnergyConsumption;

    @Valid
    private EnergyConsumptionPotentialReduction energyConsumption;

    @Valid
    private EnergySavingsCategoriesPotentialReduction energySavingsCategories;

}
