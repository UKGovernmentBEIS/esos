package uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsopportunities;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumptionPotentialReduction;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergySavingsCategoriesPotentialReduction;
import uk.gov.esos.api.reporting.noc.phase3.domain.PotentialReductionPair;

import java.math.BigDecimal;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class EnergySavingsOpportunitiesTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_valid() {
        EnergySavingsOpportunities opportunities = EnergySavingsOpportunities.builder()
                .implementationEnergyConsumption(PotentialReductionPair.builder()
                        .energyConsumption(100L)
                        .energyCost(BigDecimal.valueOf(10.11))
                        .build())
                .energyConsumption(EnergyConsumptionPotentialReduction.builder()
                        .buildings(PotentialReductionPair.builder()
                                .energyConsumption(100L)
                                .energyCost(BigDecimal.valueOf(10.11))
                                .build())
                        .transport(PotentialReductionPair.builder()
                                .energyConsumption(100L)
                                .energyCost(BigDecimal.valueOf(10.11))
                                .build())
                        .industrialProcesses(PotentialReductionPair.builder()
                                .energyConsumption(100L)
                                .energyCost(BigDecimal.valueOf(10.11))
                                .build())
                        .otherProcesses(PotentialReductionPair.builder()
                                .energyConsumption(100L)
                                .energyCost(BigDecimal.valueOf(10.11))
                                .build())
                        .energyConsumptionTotal(400L)
                        .energyCostTotal(BigDecimal.valueOf(40.44))
                        .build())
                .energySavingsCategories(EnergySavingsCategoriesPotentialReduction.builder()
                        .energyManagementPractices(PotentialReductionPair.builder()
                                .energyConsumption(100L)
                                .energyCost(BigDecimal.valueOf(10.11))
                                .build())
                        .behaviourChangeInterventions(PotentialReductionPair.builder()
                                .energyConsumption(100L)
                                .energyCost(BigDecimal.valueOf(10.11))
                                .build())
                        .training(PotentialReductionPair.builder()
                                .energyConsumption(100L)
                                .energyCost(BigDecimal.valueOf(10.11))
                                .build())
                        .controlsImprovements(PotentialReductionPair.builder()
                                .energyConsumption(100L)
                                .energyCost(BigDecimal.valueOf(10.11))
                                .build())
                        .capitalInvestments(PotentialReductionPair.builder()
                                .energyConsumption(100L)
                                .energyCost(BigDecimal.valueOf(10.11))
                                .build())
                        .otherMeasures(PotentialReductionPair.builder()
                                .energyConsumption(100L)
                                .energyCost(BigDecimal.valueOf(10.11))
                                .build())
                        .energyConsumptionTotal(600L)
                        .energyCostTotal(BigDecimal.valueOf(60.66))
                        .build())
                .build();

        final Set<ConstraintViolation<EnergySavingsOpportunities>> violations = validator.validate(opportunities);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_null_values_valid() {
        EnergySavingsOpportunities opportunities = EnergySavingsOpportunities.builder()
                .implementationEnergyConsumption(null)
                .energyConsumption(null)
                .energySavingsCategories(null)
                .build();

        final Set<ConstraintViolation<EnergySavingsOpportunities>> violations = validator.validate(opportunities);

        assertThat(violations).isEmpty();
    }
}
