package uk.gov.esos.api.reporting.noc.phase3.domain.secondcomplianceperiod;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumption;
import uk.gov.esos.api.reporting.noc.phase3.domain.OptionalQuestion;
import uk.gov.esos.api.reporting.noc.phase3.domain.SignificantEnergyConsumption;
import uk.gov.esos.api.reporting.noc.phase3.domain.firstcomplianceperiod.FirstCompliancePeriodDetails;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class SecondCompliancePeriodTest {

	private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_when_no_informationExists_valid() {
    	SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
            .informationExists(OptionalQuestion.NO)
            .build();

        final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_when_informationExists_valid() {
    	SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
            .informationExists(OptionalQuestion.YES)
            .firstCompliancePeriodDetails(FirstCompliancePeriodDetails.builder()
				.organisationalEnergyConsumption(400L)
	            .organisationalEnergyConsumptionBreakdown(buildEnergyConsumption())
	            .significantEnergyConsumption(buildSignificantEnergyConsumption())
	            .explanation("explanation")
	            .potentialReduction(buildEnergyConsumption())
	            .build())
            .reductionAchieved(buildEnergyConsumption())
            .build();

        final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_when_informationExists_nothing_else_exists_valid() {
    	SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
            .informationExists(OptionalQuestion.YES)
            .firstCompliancePeriodDetails(FirstCompliancePeriodDetails.builder()
	            .organisationalEnergyConsumptionBreakdown(buildEnergyConsumption())
	            .explanation("explanation")
	            .build())
            .build();

        final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_when_no_informationExists_anything_else_exists_invalid() {
    	SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
            .informationExists(OptionalQuestion.NO)
            .firstCompliancePeriodDetails(FirstCompliancePeriodDetails.builder()
	            .organisationalEnergyConsumptionBreakdown(buildEnergyConsumption())
	            .explanation("explanation")
	            .build())
            .reductionAchieved(buildEnergyConsumption())
            .build();

        final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactlyInAnyOrder(
        	    "{noc.complianceperiod.energyconsumption.details}");
    }
    
    @Test
    void validate_when_no_significantEnergyConsumptionExists_valid() {
    	SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
            .informationExists(OptionalQuestion.YES)
            .firstCompliancePeriodDetails(FirstCompliancePeriodDetails.builder()
	            .organisationalEnergyConsumptionBreakdown(buildEnergyConsumption())
	            .explanation("explanation")
	            .build())
            .reductionAchieved(buildEnergyConsumption())
            .build();

        final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_when_potentialReductionExists_valid() {
    	SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
            .informationExists(OptionalQuestion.YES)
            .firstCompliancePeriodDetails(FirstCompliancePeriodDetails.builder()
				.organisationalEnergyConsumption(100L)
	            .organisationalEnergyConsumptionBreakdown(buildEnergyConsumption())
	            .explanation("explanation")
	            .potentialReduction(buildEnergyConsumption())
	            .build())
            .build();

        final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_when_no_reductionAchievedExists_valid() {
    	SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
            .informationExists(OptionalQuestion.YES)
            .firstCompliancePeriodDetails(FirstCompliancePeriodDetails.builder()
	            .organisationalEnergyConsumptionBreakdown(buildEnergyConsumption())
	            .explanation("explanation")
	            .potentialReduction(buildEnergyConsumption())
	            .build())
            .reductionAchieved(buildEnergyConsumption())
            .build();

        final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

        assertThat(violations).isEmpty();

    }
    
    @Test
    void validate_when_significantEnergyConsumptionPct_not_correct_invalid() {
    	SignificantEnergyConsumption sec = buildSignificantEnergyConsumption();
    	sec.setSignificantEnergyConsumptionPct(95L);
    	SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
            .informationExists(OptionalQuestion.YES)
            .firstCompliancePeriodDetails(FirstCompliancePeriodDetails.builder()
	            .organisationalEnergyConsumptionBreakdown(buildEnergyConsumption())
	            .significantEnergyConsumption(sec)
	            .explanation("explanation")
	            .potentialReduction(buildEnergyConsumption())
	            .build())
            .reductionAchieved(null)
            .build();

        final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly(
        		"{noc.complianceperiod.significantEnergyConsumptionPct}");
    }

	@Test
	void validate_when_organisational_energy_consumption_breakdown_is_null_valid() {
		SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
				.informationExists(OptionalQuestion.YES)
				.firstCompliancePeriodDetails(FirstCompliancePeriodDetails.builder()
						.organisationalEnergyConsumption(400L)
						.significantEnergyConsumption(buildSignificantEnergyConsumption())
						.explanation("explanation")
						.potentialReduction(buildEnergyConsumption())
						.build())
				.reductionAchieved(buildEnergyConsumption())
				.build();

		final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

		assertThat(violations).isEmpty();
	}

	@Test
	void validate_when_all_numeric_values_null_valid() {
		SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
				.informationExists(OptionalQuestion.YES)
				.firstCompliancePeriodDetails(FirstCompliancePeriodDetails.builder()
						.explanation("explanation")
						.build())
				.build();

		final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

		assertThat(violations).isEmpty();
	}

	@Test
	void validate_when_informationExists_with_null_values_valid() {
		SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
				.informationExists(OptionalQuestion.YES)
				.firstCompliancePeriodDetails(FirstCompliancePeriodDetails.builder()
						.organisationalEnergyConsumptionBreakdown(EnergyConsumption.builder()
								.buildings(100L)
								.transport(100L)
								.total(200L)
								.build())
						.significantEnergyConsumption(SignificantEnergyConsumption.builder()
								.industrialProcesses(60L)
								.otherProcesses(120L)
								.total(180L)
								.significantEnergyConsumptionPct(90L)
								.build())
						.explanation("explanation")
						.potentialReduction(EnergyConsumption.builder()
								.transport(150L)
								.industrialProcesses(200L)
								.total(350L)
								.build())
						.build())
				.reductionAchieved(EnergyConsumption.builder().build())
				.build();

		final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

		assertThat(violations).isEmpty();
	}

	@Test
	void validate_when_organisational_energy_consumption_breakdown_is_null_and_percentage_invalid() {
		SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
				.informationExists(OptionalQuestion.YES)
				.firstCompliancePeriodDetails(FirstCompliancePeriodDetails.builder()
						.organisationalEnergyConsumption(200L)
						.significantEnergyConsumption(buildSignificantEnergyConsumption())
						.explanation("explanation")
						.potentialReduction(buildEnergyConsumption())
						.build())
				.reductionAchieved(buildEnergyConsumption())
				.build();

		final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

		assertThat(violations).isNotEmpty();
		assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly(
				"{noc.complianceperiod.significantEnergyConsumptionPct}");
	}

	@Test
	void validate_when_significant_energy_consumption_percentage_greater_than_100_valid() {
		SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
				.informationExists(OptionalQuestion.YES)
				.firstCompliancePeriodDetails(FirstCompliancePeriodDetails.builder()
						.organisationalEnergyConsumption(400L)
						.significantEnergyConsumption(SignificantEnergyConsumption.builder()
								.buildings(200L)
								.transport(200L)
								.industrialProcesses(200L)
								.otherProcesses(200L)
								.total(800L)
								.significantEnergyConsumptionPct(200L)
								.build())
						.explanation("explanation")
						.potentialReduction(buildEnergyConsumption())
						.build())
				.reductionAchieved(buildEnergyConsumption())
				.build();

		final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

		assertThat(violations).isEmpty();
	}

	@Test
	void validate_when_max_digits_not_valid() {
		SecondCompliancePeriod compliancePeriod = SecondCompliancePeriod.builder()
				.informationExists(OptionalQuestion.YES)
				.firstCompliancePeriodDetails(FirstCompliancePeriodDetails.builder()
						.organisationalEnergyConsumption(1000000000000000L)
						.build())
				.build();

		final Set<ConstraintViolation<SecondCompliancePeriod>> violations = validator.validate(compliancePeriod);

		assertThat(violations)
				.isNotEmpty()
				.extracting(ConstraintViolation::getMessage)
				.containsExactly("numeric value out of bounds (<15 digits>.<0 digits> expected)");
	}

	private SignificantEnergyConsumption buildSignificantEnergyConsumption() {
		return SignificantEnergyConsumption.builder()
				.buildings(100L)
				.transport(100L)
				.industrialProcesses(100L)
				.otherProcesses(95L)
				.total(395L)
				.significantEnergyConsumptionPct(98L)
				.build();
	}

	private EnergyConsumption buildEnergyConsumption() {
		return EnergyConsumption.builder()
				.buildings(100L)
				.transport(100L)
				.industrialProcesses(100L)
				.otherProcesses(100L)
				.total(400L)
				.build();
	}
}
