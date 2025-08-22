package uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumptionPotentialReduction;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergySavingsCategoriesPotentialReduction;
import uk.gov.esos.api.reporting.noc.phase3.domain.PotentialReductionPair;

class AlternativeComplianceRoutesTest {

	private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_when_totals_equal_valid() {
    	AlternativeComplianceRoutes altRoutes = AlternativeComplianceRoutes.builder()
            .energyConsumptionReduction(buildEnergyConsumption())
            .energyConsumptionReductionCategories(buildEnergySavingsCategories())
            .build();

        final Set<ConstraintViolation<AlternativeComplianceRoutes>> violations = validator.validate(altRoutes);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_when_energyConsumptionReductionCategories_is_null_valid() {
    	AlternativeComplianceRoutes altRoutes = AlternativeComplianceRoutes.builder()
            .energyConsumptionReduction(buildEnergyConsumption())
            .build();

        final Set<ConstraintViolation<AlternativeComplianceRoutes>> violations = validator.validate(altRoutes);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_when_only_totalEnergyConsumptionReduction_exists_valid() {
    	AlternativeComplianceRoutes altRoutes = AlternativeComplianceRoutes.builder()
				.totalEnergyConsumptionReduction(TotalEnergyConsumptionReduction.builder()
						.potentialReductionPair(PotentialReductionPair.builder()
								.energyConsumption(10000L)
								.energyCost(BigDecimal.valueOf(11.11))
								.build())
						.build())
            .build();

        final Set<ConstraintViolation<AlternativeComplianceRoutes>> violations = validator.validate(altRoutes);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_when_total_zero_valid() {
    	AlternativeComplianceRoutes altRoutes = AlternativeComplianceRoutes.builder()
            .energyConsumptionReduction(buildEnergyConsumptionZeroTotal())
            .energyConsumptionReductionCategories(buildEnergySavingsCategoriesZeroTotal())
            .build();

        final Set<ConstraintViolation<AlternativeComplianceRoutes>> violations = validator.validate(altRoutes);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_null_values_valid() {
    	AlternativeComplianceRoutes altRoutes = AlternativeComplianceRoutes.builder()
			.totalEnergyConsumptionReduction(TotalEnergyConsumptionReduction.builder()
						.build())
            .energyConsumptionReduction(null)
            .energyConsumptionReductionCategories(null)
            .build();

        final Set<ConstraintViolation<AlternativeComplianceRoutes>> violations = validator.validate(altRoutes);

        assertThat(violations).isEmpty();
    }
    
    private EnergySavingsCategoriesPotentialReduction buildEnergySavingsCategories() {
		return EnergySavingsCategoriesPotentialReduction.builder()
				.energyManagementPractices(PotentialReductionPair.builder()
						.energyConsumption(0L)
						.energyCost(BigDecimal.ZERO)
						.build())
				.behaviourChangeInterventions(PotentialReductionPair.builder()
						.energyConsumption(0L)
						.energyCost(BigDecimal.ZERO)
						.build())
				.training(PotentialReductionPair.builder()
						.energyConsumption(0L)
						.energyCost(BigDecimal.ZERO)
						.build())
				.controlsImprovements(PotentialReductionPair.builder()
						.energyConsumption(200L)
						.energyCost(BigDecimal.valueOf(11.11))
						.build())
				.capitalInvestments(PotentialReductionPair.builder()
						.energyConsumption(0L)
						.energyCost(BigDecimal.ZERO)
						.build())
				.otherMeasures(PotentialReductionPair.builder()
						.energyConsumption(200L)
						.energyCost(BigDecimal.valueOf(11.11))
						.build())
				.energyConsumptionTotal(400L)
				.energyCostTotal(BigDecimal.valueOf(22.22))
				.build();
	}

	private EnergyConsumptionPotentialReduction buildEnergyConsumption() {
		return EnergyConsumptionPotentialReduction.builder()
				.buildings(PotentialReductionPair.builder().energyConsumption(100L).energyCost(BigDecimal.valueOf(10.11)).build())
				.transport(PotentialReductionPair.builder().energyConsumption(100L).energyCost(BigDecimal.valueOf(10.11)).build())
				.industrialProcesses(PotentialReductionPair.builder().energyConsumption(100L).energyCost(BigDecimal.valueOf(10.11)).build())
				.otherProcesses(PotentialReductionPair.builder().energyConsumption(100L).energyCost(BigDecimal.valueOf(10.11)).build())
				.energyConsumptionTotal(400L)
				.energyCostTotal(BigDecimal.valueOf(40.44))
				.build();
	}
	
	private EnergySavingsCategoriesPotentialReduction buildEnergySavingsCategoriesZeroTotal() {
		return EnergySavingsCategoriesPotentialReduction.builder()
				.energyManagementPractices(PotentialReductionPair.builder()
						.energyConsumption(0L)
						.energyCost(BigDecimal.ZERO)
						.build())
				.behaviourChangeInterventions(PotentialReductionPair.builder()
						.energyConsumption(0L)
						.energyCost(BigDecimal.ZERO)
						.build())
				.training(PotentialReductionPair.builder()
						.energyConsumption(0L)
						.energyCost(BigDecimal.ZERO)
						.build())
				.controlsImprovements(PotentialReductionPair.builder()
						.energyConsumption(0L)
						.energyCost(BigDecimal.ZERO)
						.build())
				.capitalInvestments(PotentialReductionPair.builder()
						.energyConsumption(0L)
						.energyCost(BigDecimal.ZERO)
						.build())
				.otherMeasures(PotentialReductionPair.builder()
						.energyConsumption(0L)
						.energyCost(BigDecimal.ZERO)
						.build())
				.energyConsumptionTotal(0L)
				.energyCostTotal(BigDecimal.ZERO)
				.build();
	}

	private EnergyConsumptionPotentialReduction buildEnergyConsumptionZeroTotal() {
		return EnergyConsumptionPotentialReduction.builder()
				.buildings(PotentialReductionPair.builder().energyConsumption(0L).energyCost(BigDecimal.ZERO).build())
				.transport(PotentialReductionPair.builder().energyConsumption(0L).energyCost(BigDecimal.ZERO).build())
				.industrialProcesses(PotentialReductionPair.builder().energyConsumption(0L).energyCost(BigDecimal.ZERO).build())
				.otherProcesses(PotentialReductionPair.builder().energyConsumption(0L).energyCost(BigDecimal.ZERO).build())
				.energyConsumptionTotal(0L)
				.energyCostTotal(BigDecimal.ZERO)
				.build();
	}
}
