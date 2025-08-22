package uk.gov.esos.api.reporting.noc.phase3.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class PotentialReductionPairTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_valid() {
        PotentialReductionPair pair = PotentialReductionPair.builder()
                .energyConsumption(50L)
                .energyCost(BigDecimal.valueOf(100))
                .build();

        final Set<ConstraintViolation<PotentialReductionPair>> violations = validator.validate(pair);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_with_zero_cost_valid() {
        PotentialReductionPair pair = PotentialReductionPair.builder()
                .energyConsumption(50L)
                .energyCost(BigDecimal.ZERO)
                .build();

        final Set<ConstraintViolation<PotentialReductionPair>> violations = validator.validate(pair);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_zeros_valid() {
        PotentialReductionPair pair = PotentialReductionPair.builder()
                .energyConsumption(0L)
                .energyCost(BigDecimal.ZERO)
                .build();

        final Set<ConstraintViolation<PotentialReductionPair>> violations = validator.validate(pair);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_zeros_fixed_valid() {
        PotentialReductionPair pair = PotentialReductionPair.builder()
                .energyConsumption(0L)
                .energyCost(BigDecimal.valueOf(0).setScale(2, RoundingMode.HALF_DOWN))
                .build();

        final Set<ConstraintViolation<PotentialReductionPair>> violations = validator.validate(pair);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_max_digits_not_valid() {
        PotentialReductionPair pair = PotentialReductionPair.builder()
                .energyConsumption(1000000000000000L)
                .energyCost(BigDecimal.ZERO)
                .build();

        final Set<ConstraintViolation<PotentialReductionPair>> violations = validator.validate(pair);

        assertThat(violations)
                .isNotEmpty()
                .extracting(ConstraintViolation::getMessage)
                .containsExactly("numeric value out of bounds (<15 digits>.<0 digits> expected)");
    }
    
    @Test
    void validate_null_valid() {
        PotentialReductionPair pair = PotentialReductionPair.builder()
                .energyConsumption(null)
                .energyCost(null)
                .build();

        final Set<ConstraintViolation<PotentialReductionPair>> violations = validator.validate(pair);

        assertThat(violations).isEmpty();
    }
}
