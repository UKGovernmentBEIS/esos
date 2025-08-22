package uk.gov.esos.api.reporting.noc.phase3.domain.energyconsumptiondetails;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class EnergyIntensityRatioTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_valid() {

        final EnergyIntensityRatio energyIntensityRatio = EnergyIntensityRatio.builder()
                .ratio(BigDecimal.valueOf(10.123456))
                .unit("Kwh")
                .build();

        Set<ConstraintViolation<EnergyIntensityRatio>> violations = validator.validate(energyIntensityRatio);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_exceeding_decimal_digits_invalid() {

        final EnergyIntensityRatio energyIntensityRatio = EnergyIntensityRatio.builder()
                .ratio(BigDecimal.valueOf(10.1234567))
                .unit("Kwh")
                .build();

        Set<ConstraintViolation<EnergyIntensityRatio>> violations = validator.validate(energyIntensityRatio);

        assertThat(violations).isNotEmpty();
    }
}
