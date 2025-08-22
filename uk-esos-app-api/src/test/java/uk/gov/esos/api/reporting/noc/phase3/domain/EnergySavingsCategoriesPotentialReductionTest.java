package uk.gov.esos.api.reporting.noc.phase3.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class EnergySavingsCategoriesPotentialReductionTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate() {
        EnergySavingsCategoriesPotentialReduction potentialReduction = EnergySavingsCategoriesPotentialReduction.builder()
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
                .build();

        final Set<ConstraintViolation<EnergySavingsCategoriesPotentialReduction>> violations = validator.validate(potentialReduction);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_some_values_null_valid() {
        EnergySavingsCategoriesPotentialReduction potentialReduction = EnergySavingsCategoriesPotentialReduction.builder()
                .energyManagementPractices(PotentialReductionPair.builder()
                        .energyConsumption(100L)
                        .energyCost(BigDecimal.valueOf(10.11))
                        .build())
                .behaviourChangeInterventions(PotentialReductionPair.builder()
                        .energyConsumption(100L)
                        .energyCost(BigDecimal.valueOf(10.11))
                        .build())
                .capitalInvestments(PotentialReductionPair.builder()
                        .energyConsumption(100L)
                        .energyCost(BigDecimal.valueOf(10.11))
                        .build())
                .otherMeasures(null)
                .energyConsumptionTotal(300L)
                .energyCostTotal(BigDecimal.valueOf(30.33))
                .build();

        final Set<ConstraintViolation<EnergySavingsCategoriesPotentialReduction>> violations = validator.validate(potentialReduction);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_all_values_null_valid() {
        EnergySavingsCategoriesPotentialReduction potentialReduction = EnergySavingsCategoriesPotentialReduction.builder()
                .build();

        final Set<ConstraintViolation<EnergySavingsCategoriesPotentialReduction>> violations = validator.validate(potentialReduction);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_all_values_null_not_valid() {
        EnergySavingsCategoriesPotentialReduction potentialReduction = EnergySavingsCategoriesPotentialReduction.builder()
                .energyConsumptionTotal(400L)
                .energyCostTotal(BigDecimal.valueOf(40.44))
                .build();

        final Set<ConstraintViolation<EnergySavingsCategoriesPotentialReduction>> violations = validator.validate(potentialReduction);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.energysavingscategories.sum}");
    }

    @Test
    void validate_sum_not_valid() {
        EnergySavingsCategoriesPotentialReduction potentialReduction = EnergySavingsCategoriesPotentialReduction.builder()
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
                .energyConsumptionTotal(500L)
                .energyCostTotal(BigDecimal.valueOf(70.77))
                .build();

        final Set<ConstraintViolation<EnergySavingsCategoriesPotentialReduction>> violations = validator.validate(potentialReduction);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.energysavingscategories.sum}");
    }
}
