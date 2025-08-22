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

class EnergyConsumptionPotentialReductionTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate() {
        EnergyConsumptionPotentialReduction potentialReduction = EnergyConsumptionPotentialReduction.builder()
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
                .build();

        final Set<ConstraintViolation<EnergyConsumptionPotentialReduction>> violations = validator.validate(potentialReduction);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_some_values_null_valid() {
        EnergyConsumptionPotentialReduction potentialReduction = EnergyConsumptionPotentialReduction.builder()
                .transport(PotentialReductionPair.builder()
                        .energyConsumption(100L)
                        .energyCost(BigDecimal.valueOf(10.11))
                        .build())
                .industrialProcesses(PotentialReductionPair.builder()
                        .energyConsumption(100L)
                        .energyCost(BigDecimal.valueOf(10.11))
                        .build())
                .otherProcesses(null)
                .energyConsumptionTotal(200L)
                .energyCostTotal(BigDecimal.valueOf(20.22))
                .build();

        final Set<ConstraintViolation<EnergyConsumptionPotentialReduction>> violations = validator.validate(potentialReduction);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_all_values_null_valid() {
        EnergyConsumptionPotentialReduction potentialReduction = EnergyConsumptionPotentialReduction.builder()
                .build();

        final Set<ConstraintViolation<EnergyConsumptionPotentialReduction>> violations = validator.validate(potentialReduction);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_all_values_null_not_valid() {
        EnergyConsumptionPotentialReduction potentialReduction = EnergyConsumptionPotentialReduction.builder()
                .energyConsumptionTotal(200L)
                .energyCostTotal(BigDecimal.valueOf(20.22))
                .build();

        final Set<ConstraintViolation<EnergyConsumptionPotentialReduction>> violations = validator.validate(potentialReduction);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.energyconsumption.sum}");
    }

    @Test
    void validate_sum_not_valid() {
        EnergyConsumptionPotentialReduction potentialReduction = EnergyConsumptionPotentialReduction.builder()
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
                .energyConsumptionTotal(100L)
                .energyCostTotal(BigDecimal.valueOf(40.44))
                .build();

        final Set<ConstraintViolation<EnergyConsumptionPotentialReduction>> violations = validator.validate(potentialReduction);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.energyconsumption.sum}");
    }
}
