package uk.gov.esos.api.reporting.progressupdate2.phase3.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.gov.esos.api.reporting.progressupdate.common.domain.EstimationMethodType;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3EnergyEfficiencyMeasure;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertTrue;

class ProgressUpdate2P3EnergyEfficiencyMeasureTest {

    private static Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void reductionEnergyConsumption2025To2026_valid_when_MeasureIsImplemented_is_true() {
        ProgressUpdate2P3EnergyEfficiencyMeasure measure = new ProgressUpdate2P3EnergyEfficiencyMeasure();
        measure.setMeasureIsImplemented(true);
        measure.setMeasureImplementedByTheDateInActionPlan(true);
        measure.setEstimationMethodType(EstimationMethodType.ENERGY_AUDIT);
        measure.setReductionEnergyConsumption2025To2026(1L);

        Set<ConstraintViolation<ProgressUpdate2P3EnergyEfficiencyMeasure>> violations = validator.validate(measure);
        assertTrue(violations.isEmpty());
    }

    @Test
    void reductionEnergyConsumption2025To2026_valid_when_reportReduction2025To2026_is_true() {
        ProgressUpdate2P3EnergyEfficiencyMeasure measure = new ProgressUpdate2P3EnergyEfficiencyMeasure();
        measure.setReportReduction2025To2026(true);
        measure.setReductionEnergyConsumption2025To2026(1L);
        measure.setEstimationMethodType(EstimationMethodType.ENERGY_AUDIT);

        Set<ConstraintViolation<ProgressUpdate2P3EnergyEfficiencyMeasure>> violations = validator.validate(measure);
        assertTrue(violations.isEmpty());
    }

    @Test
    void reductionEnergyConsumption2025To2026_valid_when_is_implementedIsFalse_And_reportReduction2025To2026IsFalse() {
        ProgressUpdate2P3EnergyEfficiencyMeasure measure = new ProgressUpdate2P3EnergyEfficiencyMeasure();
        measure.setReportReduction2025To2026(false);
        measure.setMeasureIsImplemented(null);
        measure.setReductionEnergyConsumption2025To2026(null);

        Set<ConstraintViolation<ProgressUpdate2P3EnergyEfficiencyMeasure>> violations = validator.validate(measure);
        assertTrue(violations.isEmpty());
    }

    @Test
    void reductionEnergyConsumption2025To2026_Invalid_whenIsimplementedIsFalse_And_reportReduction2025To2026IsFalse() {
        ProgressUpdate2P3EnergyEfficiencyMeasure measure = new ProgressUpdate2P3EnergyEfficiencyMeasure();
        measure.setReportReduction2025To2026(false);
        measure.setMeasureIsImplemented(null);
        measure.setReductionEnergyConsumption2025To2026(1L);

        Set<ConstraintViolation<ProgressUpdate2P3EnergyEfficiencyMeasure>> violations = validator.validate(measure);
        ConstraintViolation<ProgressUpdate2P3EnergyEfficiencyMeasure> violation = violations.iterator().next();
        Assertions.assertEquals("{pu2.reductionEnergyConsumption2025To2026}", violation.getMessage());
        Assertions.assertFalse(violations.isEmpty());
    }

    @Test
    void Valid_estimationMethodTypeMustBeNull() {
        ProgressUpdate2P3EnergyEfficiencyMeasure measure = new ProgressUpdate2P3EnergyEfficiencyMeasure();
        measure.setReportReduction2025To2026(false);
        measure.setMeasureIsImplemented(null);
        measure.setReductionEnergyConsumption2025To2026(null);
        measure.setEstimationMethodType(null);

        Set<ConstraintViolation<ProgressUpdate2P3EnergyEfficiencyMeasure>> violations = validator.validate(measure);

        Assertions.assertTrue(violations.isEmpty());
    }

    @Test
    void Valid_estimationMethodTypeMustNotBeNullWhenReportReductionIsTrue() {
        ProgressUpdate2P3EnergyEfficiencyMeasure measure = new ProgressUpdate2P3EnergyEfficiencyMeasure();
        measure.setReportReduction2025To2026(true);
        measure.setMeasureIsImplemented(null);
        measure.setReductionEnergyConsumption2025To2026(1L);
        measure.setEstimationMethodType(EstimationMethodType.ENERGY_AUDIT);

        Set<ConstraintViolation<ProgressUpdate2P3EnergyEfficiencyMeasure>> violations = validator.validate(measure);

        Assertions.assertTrue(violations.isEmpty());
    }

    @Test
    void Invalid_estimationMethodTypeMustBeNull() {
        ProgressUpdate2P3EnergyEfficiencyMeasure measure = new ProgressUpdate2P3EnergyEfficiencyMeasure();
        measure.setReportReduction2025To2026(null);
        measure.setMeasureIsImplemented(false);
        measure.setEstimationMethodType(EstimationMethodType.ENERGY_AUDIT);
        measure.setReductionEnergyConsumption2025To2026(null);

        Set<ConstraintViolation<ProgressUpdate2P3EnergyEfficiencyMeasure>> violations = validator.validate(measure);
        ConstraintViolation<ProgressUpdate2P3EnergyEfficiencyMeasure> violation = violations.iterator().next();
        Assertions.assertEquals("{pu2.estimationMethodType}", violation.getMessage());
        Assertions.assertFalse(violations.isEmpty());
    }

    @Test
    void measureImplementedByTheDateInActionPlan_Valid(){
        ProgressUpdate2P3EnergyEfficiencyMeasure pu2Measure = ProgressUpdate2P3EnergyEfficiencyMeasure.builder()
                .measureIsImplemented(true)
                .reductionEnergyConsumption2025To2026(1L)
                .measureImplementedByTheDateInActionPlan(true)
                .estimationMethodType(EstimationMethodType.ENERGY_AUDIT)
                .build();

        Set<ConstraintViolation<ProgressUpdate2P3EnergyEfficiencyMeasure>> violations = validator.validate(pu2Measure);
        assertTrue(violations.isEmpty());

    }

    @Test
    void measureImplementedByTheDateInActionPlan_In_Valid(){
        ProgressUpdate2P3EnergyEfficiencyMeasure measure = ProgressUpdate2P3EnergyEfficiencyMeasure.builder()
                .measureIsImplemented(null)
                .reportReduction2025To2026(true)
                .reductionEnergyConsumption2025To2026(1L)
                .measureImplementedByTheDateInActionPlan(true)
                .estimationMethodType(EstimationMethodType.ENERGY_AUDIT)
                .build();

        Set<ConstraintViolation<ProgressUpdate2P3EnergyEfficiencyMeasure>> violations = validator.validate(measure);
        ConstraintViolation<ProgressUpdate2P3EnergyEfficiencyMeasure> violation = violations.iterator().next();
        Assertions.assertEquals("{pu.measureImplementedByTheDateInActionPlan}", violation.getMessage());
        Assertions.assertFalse(violations.isEmpty());

    }



}