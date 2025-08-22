package uk.gov.esos.api.reporting.noc.phase3.domain;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class EnergyConsumptionTest {

	private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_when_everything_valid() {
    	EnergyConsumption ec = buildEnergyConsumption();

        final Set<ConstraintViolation<EnergyConsumption>> violations = validator.validate(ec);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_when_null_values_exist_valid() {
        EnergyConsumption ec = buildEnergyConsumptionWithNullValues();

        final Set<ConstraintViolation<EnergyConsumption>> violations = validator.validate(ec);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_when_total_not_correct_invalid() {
    	EnergyConsumption ec = buildEnergyConsumption();
    	ec.setTotal(399L);

        final Set<ConstraintViolation<EnergyConsumption>> violations = validator.validate(ec);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly(
        		"{noc.energyconsumption.sum}");
    }

    @Test
    void validate_when_null_values_and_total_not_correct_invalid() {
        EnergyConsumption ec = buildEnergyConsumptionWithNullValues();
        ec.setTotal(199L);

        final Set<ConstraintViolation<EnergyConsumption>> violations = validator.validate(ec);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly(
                "{noc.energyconsumption.sum}");
    }

    @Test
    void validate_when_all_values_null_valid() {
        EnergyConsumption ec = EnergyConsumption.builder().build();

        final Set<ConstraintViolation<EnergyConsumption>> violations = validator.validate(ec);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_when_all_values_null_invalid() {
        EnergyConsumption ec = EnergyConsumption.builder().total(100L).build();

        final Set<ConstraintViolation<EnergyConsumption>> violations = validator.validate(ec);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly(
                "{noc.energyconsumption.sum}");
    }

    @Test
    void validate_when_max_digits_not_valid() {
        EnergyConsumption ec = EnergyConsumption.builder()
                .buildings(1000000000000000L)
                .total(1000000000000000L)
                .build();

        final Set<ConstraintViolation<EnergyConsumption>> violations = validator.validate(ec);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly(
                "numeric value out of bounds (<15 digits>.<0 digits> expected)");
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


    private EnergyConsumption buildEnergyConsumptionWithNullValues() {

        return EnergyConsumption.builder()
                .buildings(100L)
                .industrialProcesses(100L)
                .total(200L)
                .build();
    }
}
