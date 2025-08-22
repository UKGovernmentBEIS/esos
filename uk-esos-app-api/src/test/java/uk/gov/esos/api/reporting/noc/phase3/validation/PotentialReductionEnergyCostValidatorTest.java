package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumptionPotentialReduction;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergySavingsCategoriesPotentialReduction;
import uk.gov.esos.api.reporting.noc.phase3.domain.PotentialReductionPair;

import java.math.BigDecimal;
import java.math.RoundingMode;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class PotentialReductionEnergyCostValidatorTest {

    @InjectMocks
    private PotentialReductionEnergyCostValidator validator;

    @Test
    void isEnergyConsumptionValid() {
        final EnergyConsumptionPotentialReduction potentialReduction =
                EnergyConsumptionPotentialReduction.builder()
                        .buildings(PotentialReductionPair.builder().energyCost(BigDecimal.valueOf(10.11)).build())
                        .transport(PotentialReductionPair.builder().energyCost(BigDecimal.valueOf(10.11)).build())
                        .industrialProcesses(PotentialReductionPair.builder().energyCost(BigDecimal.valueOf(10.11)).build())
                        .otherProcesses(PotentialReductionPair.builder().energyCost(BigDecimal.valueOf(10.11)).build())
                        .energyCostTotal(BigDecimal.valueOf(40.44))
                        .build();

        // Invoke
        boolean actual = validator.isEnergyConsumptionValid(potentialReduction);

        // Verify
        assertThat(actual).isTrue();
    }

    @Test
    void isEnergyConsumptionValid_empty_total_is_null_valid() {
        final EnergyConsumptionPotentialReduction potentialReduction =
                EnergyConsumptionPotentialReduction.builder()
                        .buildings(PotentialReductionPair.builder().build())
                        .transport(PotentialReductionPair.builder().build())
                        .industrialProcesses(PotentialReductionPair.builder().build())
                        .otherProcesses(PotentialReductionPair.builder().build())
                        .energyCostTotal(null)
                        .build();

        // Invoke
        boolean actual = validator.isEnergyConsumptionValid(potentialReduction);

        // Verify
        assertThat(actual).isTrue();
    }
    
    @Test
    void isEnergyConsumptionValid_all_zero_valid() {
        final EnergyConsumptionPotentialReduction potentialReduction =
                EnergyConsumptionPotentialReduction.builder()
                .buildings(PotentialReductionPair.builder().energyCost(BigDecimal.ZERO).build())
                .transport(PotentialReductionPair.builder().energyCost(BigDecimal.ZERO).build())
                .industrialProcesses(PotentialReductionPair.builder().energyCost(BigDecimal.ZERO).build())
                .otherProcesses(PotentialReductionPair.builder().energyCost(BigDecimal.ZERO).build())
                .energyCostTotal(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_DOWN))
                        .build();

        // Invoke
        boolean actual = validator.isEnergyConsumptionValid(potentialReduction);

        // Verify
        assertThat(actual).isTrue();
    }

    @Test
    void isEnergyConsumptionValid_no_values_total_is_null_valid() {
        final EnergyConsumptionPotentialReduction potentialReduction =
                EnergyConsumptionPotentialReduction.builder()
                        .energyCostTotal(null)
                        .build();

        // Invoke
        boolean actual = validator.isEnergyConsumptionValid(potentialReduction);

        // Verify
        assertThat(actual).isTrue();
    }
    
    @Test
    void isEnergyConsumptionValid_no_values_total_is_not_null_not_valid() {
        final EnergyConsumptionPotentialReduction potentialReduction =
                EnergyConsumptionPotentialReduction.builder()
                        .energyCostTotal(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_DOWN))
                        .build();

        // Invoke
        boolean actual = validator.isEnergyConsumptionValid(potentialReduction);

        // Verify
        assertThat(actual).isFalse();
    }

    @Test
    void isEnergyConsumptionValid_sum_not_valid() {
        final EnergyConsumptionPotentialReduction potentialReduction =
                EnergyConsumptionPotentialReduction.builder()
                        .industrialProcesses(PotentialReductionPair.builder().energyCost(BigDecimal.valueOf(10.11)).build())
                        .otherProcesses(PotentialReductionPair.builder().energyCost(BigDecimal.valueOf(10.11)).build())
                        .energyCostTotal(BigDecimal.valueOf(40.44))
                        .build();

        // Invoke
        boolean actual = validator.isEnergyConsumptionValid(potentialReduction);

        // Verify
        assertThat(actual).isFalse();
    }

    @Test
    void isEnergySavingsCategoriesValid() {
        final EnergySavingsCategoriesPotentialReduction potentialReduction =
                EnergySavingsCategoriesPotentialReduction.builder()
                        .energyManagementPractices(PotentialReductionPair.builder().energyCost(BigDecimal.valueOf(10.11)).build())
                        .behaviourChangeInterventions(PotentialReductionPair.builder().energyCost(BigDecimal.valueOf(10.11)).build())
                        .training(PotentialReductionPair.builder().energyCost(BigDecimal.valueOf(10.11)).build())
                        .controlsImprovements(PotentialReductionPair.builder().energyCost(BigDecimal.valueOf(10.11)).build())
                        .capitalInvestments(PotentialReductionPair.builder().energyCost(BigDecimal.valueOf(10.11)).build())
                        .otherMeasures(PotentialReductionPair.builder().energyCost(BigDecimal.valueOf(10.11)).build())
                        .energyCostTotal(BigDecimal.valueOf(60.66))
                        .build();

        // Invoke
        boolean actual = validator.isEnergySavingsCategoriesValid(potentialReduction);

        // Verify
        assertThat(actual).isTrue();
    }

    @Test
    void isEnergySavingsCategoriesValid_empty_total_is_null_valid() {
        final EnergySavingsCategoriesPotentialReduction potentialReduction =
                EnergySavingsCategoriesPotentialReduction.builder()
                        .energyManagementPractices(PotentialReductionPair.builder().build())
                        .behaviourChangeInterventions(PotentialReductionPair.builder().build())
                        .training(PotentialReductionPair.builder().build())
                        .controlsImprovements(PotentialReductionPair.builder().build())
                        .capitalInvestments(PotentialReductionPair.builder().build())
                        .otherMeasures(PotentialReductionPair.builder().build())
                        .energyCostTotal(null)
                        .build();

        // Invoke
        boolean actual = validator.isEnergySavingsCategoriesValid(potentialReduction);

        // Verify
        assertThat(actual).isTrue();
    }

    @Test
    void isEnergySavingsCategoriesValid_no_values_total_is_null_valid() {
        final EnergySavingsCategoriesPotentialReduction potentialReduction =
                EnergySavingsCategoriesPotentialReduction.builder()
                        .energyCostTotal(null)
                        .build();

        // Invoke
        boolean actual = validator.isEnergySavingsCategoriesValid(potentialReduction);

        // Verify
        assertThat(actual).isTrue();
    }
    
    @Test
    void isEnergySavingsCategoriesValid_no_values_total_is_not_null_not_valid() {
        final EnergySavingsCategoriesPotentialReduction potentialReduction =
                EnergySavingsCategoriesPotentialReduction.builder()
                        .energyCostTotal(BigDecimal.valueOf(70.77))
                        .build();

        // Invoke
        boolean actual = validator.isEnergySavingsCategoriesValid(potentialReduction);

        // Verify
        assertThat(actual).isFalse();
    }

    @Test
    void isEnergySavingsCategoriesValid_sum_not_valid() {
        final EnergySavingsCategoriesPotentialReduction potentialReduction =
                EnergySavingsCategoriesPotentialReduction.builder()
                        .energyManagementPractices(PotentialReductionPair.builder().energyCost(BigDecimal.valueOf(10.11)).build())
                        .behaviourChangeInterventions(PotentialReductionPair.builder().energyCost(BigDecimal.valueOf(10.11)).build())
                        .energyCostTotal(BigDecimal.valueOf(40.44))
                        .build();

        // Invoke
        boolean actual = validator.isEnergySavingsCategoriesValid(potentialReduction);

        // Verify
        assertThat(actual).isFalse();
    }
}
