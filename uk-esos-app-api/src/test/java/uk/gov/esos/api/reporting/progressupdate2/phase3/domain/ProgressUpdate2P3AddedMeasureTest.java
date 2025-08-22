package uk.gov.esos.api.reporting.progressupdate2.phase3.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.gov.esos.api.reporting.progressupdate.common.domain.AddedMeasureEstimationMethodType;
import uk.gov.esos.api.reporting.progressupdate.common.domain.MeasureSchemeType;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3AddedMeasure;

import java.util.Set;

class ProgressUpdate2P3AddedMeasureTest {

    private static Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void shouldPassValidationWhenEstimationMethodTypeOtherWithDescription() {
        ProgressUpdate2P3AddedMeasure measure = ProgressUpdate2P3AddedMeasure.builder()
                .measureName("Energy Efficiency Upgrade")
                .measureScheme(Set.of(MeasureSchemeType.OTHER))
                .reductionEnergyConsumption2025To2026(1L)
                .estimationMethodType(AddedMeasureEstimationMethodType.OTHER_METHOD)
                .estimationMethodDescription("Description of other method")
                .build();

        Set<ConstraintViolation<ProgressUpdate2P3AddedMeasure>> violations = validator.validate(measure);

        Assertions.assertEquals(0, violations.size());

    }

    @Test
    void shouldFailValidationWhenEstimationMethodTypeOtherWithoutDescription() {
        ProgressUpdate2P3AddedMeasure measure = ProgressUpdate2P3AddedMeasure.builder()
                .measureName("Energy Efficiency Upgrade")
                .measureScheme(Set.of(MeasureSchemeType.OTHER))
                .reductionEnergyConsumption2025To2026(100L)
                .estimationMethodType(AddedMeasureEstimationMethodType.OTHER_METHOD)
                .estimationMethodDescription(null)
                .build();

        Set<ConstraintViolation<ProgressUpdate2P3AddedMeasure>> violations = validator.validate(measure);

        ConstraintViolation<ProgressUpdate2P3AddedMeasure> violation = violations.iterator().next();
        Assertions.assertEquals("{pu.estimationMethodType.other}", violation.getMessage());

    }

    @Test
    void shouldFailValidationWhenEstimationMethodTypeNotOtherWithDescription() {
        ProgressUpdate2P3AddedMeasure measure = ProgressUpdate2P3AddedMeasure.builder()
                .measureName("Energy Efficiency Upgrade")
                .measureScheme(Set.of(MeasureSchemeType.OTHER))
                .reductionEnergyConsumption2025To2026(100L)
                .estimationMethodType(AddedMeasureEstimationMethodType.ENERGY_AUDIT)
                .estimationMethodDescription("Unexpected description")
                .build();

        Set<ConstraintViolation<ProgressUpdate2P3AddedMeasure>> violations = validator.validate(measure);

        ConstraintViolation<ProgressUpdate2P3AddedMeasure> violation = violations.iterator().next();
        Assertions.assertEquals("{pu.estimationMethodType.other}", violation.getMessage());
    }

    @Test
    void shouldPassValidationWhenMeasureSchemeContainsOtherWithName() {
        ProgressUpdate2P3AddedMeasure measure = ProgressUpdate2P3AddedMeasure.builder()
                .measureName("Energy Efficiency Upgrade")
                .measureScheme(Set.of(MeasureSchemeType.OTHER))
                .otherMeasureSchemeName("Custom Scheme")
                .reductionEnergyConsumption2025To2026(100L)
                .estimationMethodType(AddedMeasureEstimationMethodType.ENERGY_AUDIT)
                .build();

        Set<ConstraintViolation<ProgressUpdate2P3AddedMeasure>> violations = validator.validate(measure);

        Assertions.assertEquals(0, violations.size());

    }

    @Test
    void shouldFailValidationWhenMeasureSchemeDoesNotContainOtherWithName() {
        ProgressUpdate2P3AddedMeasure measure = ProgressUpdate2P3AddedMeasure.builder()
                .measureName("Energy Efficiency Upgrade")
                .measureScheme(Set.of(MeasureSchemeType.CARBON_REDUCTION_PLANS))
                .otherMeasureSchemeName("Custom Scheme")
                .reductionEnergyConsumption2025To2026(100L)
                .estimationMethodType(AddedMeasureEstimationMethodType.ENERGY_AUDIT)
                .build();

        Set<ConstraintViolation<ProgressUpdate2P3AddedMeasure>> violations = validator.validate(measure);

        ConstraintViolation<ProgressUpdate2P3AddedMeasure> violation = violations.iterator().next();
        Assertions.assertEquals("{ap.otherMeasureSchemeName.other}", violation.getMessage());

    }

    @Test
    void shouldPassValidationWhenMeasureSchemeDoesNotContainOtherWithoutName() {
        ProgressUpdate2P3AddedMeasure measure = ProgressUpdate2P3AddedMeasure.builder()
                .measureName("Energy Efficiency Upgrade")
                .measureScheme(Set.of(MeasureSchemeType.OTHER))
                .reductionEnergyConsumption2025To2026(100L)
                .estimationMethodType(AddedMeasureEstimationMethodType.ENERGY_AUDIT)
                .build();

        Set<ConstraintViolation<ProgressUpdate2P3AddedMeasure>> violations = validator.validate(measure);

        Assertions.assertEquals(0, violations.size());
    }

}