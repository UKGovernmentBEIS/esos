package uk.gov.esos.api.reporting.progressupdate1.phase3.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.gov.esos.api.reporting.progressupdate.common.domain.EstimationMethodType;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3EnergyEfficiencyMeasure;

import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ProgressUpdate1P3EnergyEfficiencyMeasureTest {

    private static Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void testEstimationMethodTypeOtherMethodWithDescription() {
        // Case where estimationMethodType is OTHER_METHOD and estimationMethodDescription is provided
        ProgressUpdate1P3EnergyEfficiencyMeasure measure = ProgressUpdate1P3EnergyEfficiencyMeasure.builder()
                .estimationMethodType(EstimationMethodType.OTHER_METHOD)
                .estimationMethodDescription("Some description of the method")
                .build();

        // Perform validation
        Set<ConstraintViolation<ProgressUpdate1P3EnergyEfficiencyMeasure>> violations = validator.validate(measure);

        // Should not have any validation violations
        assertTrue(violations.isEmpty(), "Validation failed with violations: " + violations);
    }

    @Test
    void testEstimationMethodTypeOtherMethodWithoutDescription() {
        // Case where estimationMethodType is OTHER_METHOD but estimationMethodDescription is null
        ProgressUpdate1P3EnergyEfficiencyMeasure measure = ProgressUpdate1P3EnergyEfficiencyMeasure.builder()
                .estimationMethodType(EstimationMethodType.OTHER_METHOD)
                .estimationMethodDescription(null)
                .build();

        // Perform validation
        Set<ConstraintViolation<ProgressUpdate1P3EnergyEfficiencyMeasure>> violations = validator.validate(measure);

        // Should have a validation violation because estimationMethodDescription cannot be null for 'OTHER_METHOD'
        assertFalse(violations.isEmpty(), "Expected validation error due to null estimationMethodDescription");
        assertEquals(1, violations.size());
        assertEquals("{pu.estimationMethodType.other}", violations.iterator().next().getMessage());
    }

    @Test
    void testEstimationMethodTypeNotOtherMethodWithDescription() {
        // Case where estimationMethodType is not OTHER_METHOD and estimationMethodDescription is provided
        ProgressUpdate1P3EnergyEfficiencyMeasure measure = ProgressUpdate1P3EnergyEfficiencyMeasure.builder()
                .estimationMethodType(EstimationMethodType.ENERGY_AUDIT)
                .estimationMethodDescription("Some description of the method")
                .build();

        // Perform validation
        Set<ConstraintViolation<ProgressUpdate1P3EnergyEfficiencyMeasure>> violations = validator.validate(measure);

        assertEquals(1, violations.size());
        assertEquals("{pu.estimationMethodType.other}", violations.iterator().next().getMessage());
    }

    @Test
    void testEstimationMethodTypeNotOtherMethodWithoutDescription() {
        // Case where estimationMethodType is not OTHER_METHOD and estimationMethodDescription is null
        ProgressUpdate1P3EnergyEfficiencyMeasure measure = ProgressUpdate1P3EnergyEfficiencyMeasure.builder()
                .estimationMethodType(EstimationMethodType.ACTION_PLAN_ESTIMATE)
                .estimationMethodDescription(null)
                .build();

        // Perform validation
        Set<ConstraintViolation<ProgressUpdate1P3EnergyEfficiencyMeasure>> violations = validator.validate(measure);

        // Should have no validation violation because estimationMethodDescription can be null when method is not OTHER_METHOD
        assertTrue(violations.isEmpty(), "Validation failed with violations: " + violations);
    }

}