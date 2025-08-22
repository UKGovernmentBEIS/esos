package uk.gov.esos.api.reporting.progressupdate2.phase3.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.gov.esos.api.reporting.progressupdate.common.domain.EstimationMethodType;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3EnergyEfficiencyMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3EnergyEfficiencyMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3UpdatedMeasure;

import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ProgressUpdate2P3UpdatedMeasureTest {

    private static Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void measureIsImplemented_Valid(){
        ProgressUpdate1P3EnergyEfficiencyMeasure pu1Measure = ProgressUpdate1P3EnergyEfficiencyMeasure.builder().measureIsImplemented(false).build();

        ProgressUpdate2P3EnergyEfficiencyMeasure pu2Measure = ProgressUpdate2P3EnergyEfficiencyMeasure.builder()
                .measureImplementedByTheDateInActionPlan(true)
                .measureIsImplemented(true)
                .estimationMethodType(EstimationMethodType.ENERGY_AUDIT)
                .reductionEnergyConsumption2025To2026(1L)
                .build();

        ProgressUpdate2P3UpdatedMeasure measure = ProgressUpdate2P3UpdatedMeasure.builder()
                .uuId(UUID.randomUUID())
                .progressUpdate1P3EnergyEfficiencyMeasure(pu1Measure)
                .progressUpdate2P3EnergyEfficiencyMeasure(pu2Measure)
                .build();

        Set<ConstraintViolation<ProgressUpdate2P3UpdatedMeasure>> violations = validator.validate(measure);
        assertTrue(violations.isEmpty());

    }

    @Test
    void measureIsImplemented_inValid(){
        ProgressUpdate1P3EnergyEfficiencyMeasure pu1Measure = ProgressUpdate1P3EnergyEfficiencyMeasure.builder().measureIsImplemented(true).build();

        ProgressUpdate2P3EnergyEfficiencyMeasure pu2Measure = ProgressUpdate2P3EnergyEfficiencyMeasure.builder()
                .measureIsImplemented(false)
                .measureImplementedByTheDateInActionPlan(null)
//                .reductionEnergyConsumption2025To2026(1L)
                .build();

        ProgressUpdate2P3UpdatedMeasure measure = ProgressUpdate2P3UpdatedMeasure.builder()
                .uuId(UUID.randomUUID())
                .progressUpdate1P3EnergyEfficiencyMeasure(pu1Measure)
                .progressUpdate2P3EnergyEfficiencyMeasure(pu2Measure)
                .build();

        Set<ConstraintViolation<ProgressUpdate2P3UpdatedMeasure>> violations = validator.validate(measure);
        ConstraintViolation<ProgressUpdate2P3UpdatedMeasure> violation = violations.iterator().next();
        Assertions.assertEquals("{pu.measureIsImplemented}", violation.getMessage());
        assertFalse(violations.isEmpty());

    }

    @Test
    void measureIsImplemented_inValid_with_null_PU1_measure(){
        ProgressUpdate2P3EnergyEfficiencyMeasure pu2Measure = ProgressUpdate2P3EnergyEfficiencyMeasure.builder()
                .measureIsImplemented(false)
                .measureImplementedByTheDateInActionPlan(null)
                .build();

        ProgressUpdate2P3UpdatedMeasure measure = ProgressUpdate2P3UpdatedMeasure.builder()
                .uuId(UUID.randomUUID())
                .progressUpdate1P3EnergyEfficiencyMeasure(null)
                .progressUpdate2P3EnergyEfficiencyMeasure(pu2Measure)
                .build();

        Set<ConstraintViolation<ProgressUpdate2P3UpdatedMeasure>> violations = validator.validate(measure);
        ConstraintViolation<ProgressUpdate2P3UpdatedMeasure> violation = violations.iterator().next();
        Assertions.assertEquals("{pu.measureIsImplemented}", violation.getMessage());
        assertFalse(violations.isEmpty());

    }

}