package uk.gov.esos.api.reporting.progressupdate1.phase3.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.EnergyEfficiencyMeasure;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.EnergySavingsEstimateCalculatedType;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.TotalEnergySavingsExpected;
import uk.gov.esos.api.reporting.progressupdate.common.domain.EstimationMethodType;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3EnergyEfficiencyMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3UpdatedMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.MeasureImplType;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static uk.gov.esos.api.reporting.progressupdate.common.domain.MeasureSchemeType.CLIMATE_CHANGE_AGREEMENTS_CCA;

class ProgressUpdate1P3UpdatedMeasureTest {

    private static Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void testMeasureIsImplementedNotNullForAfterSubmitActionPlan() {
        ProgressUpdate1P3EnergyEfficiencyMeasure energyEfficiencyMeasure = new ProgressUpdate1P3EnergyEfficiencyMeasure();
        energyEfficiencyMeasure.setMeasureIsImplemented(true);
        energyEfficiencyMeasure.setMeasureImplementedByTheDateInActionPlan(true);
        energyEfficiencyMeasure.setReductionEnergyConsumption2023To2024(1l);
        energyEfficiencyMeasure.setReductionEnergyConsumption2024To2025(1l);

        ProgressUpdate1P3UpdatedMeasure updatedMeasure = ProgressUpdate1P3UpdatedMeasure.builder()
                .uuId(UUID.randomUUID())
                .measureImplType(MeasureImplType.MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN)
                .progressUpdate1P3EnergyEfficiencyMeasure(energyEfficiencyMeasure)
                .actionPlanEnergyEfficiencyMeasure(getActionPlanMeasure())
                .build();

        Set<ConstraintViolation<ProgressUpdate1P3UpdatedMeasure>> violations = validator.validate(updatedMeasure);

        Assertions.assertEquals(0, violations.size());
    }

    @Test
    void testMeasureIsImplementedNullForBeforeSubmitActionPlan() {
        ProgressUpdate1P3EnergyEfficiencyMeasure energyEfficiencyMeasure = new ProgressUpdate1P3EnergyEfficiencyMeasure();
        energyEfficiencyMeasure.setMeasureIsImplemented(null);
        energyEfficiencyMeasure.setReportReduction2023To2024(false);
        energyEfficiencyMeasure.setReportReduction2024To2025(false);

        ProgressUpdate1P3UpdatedMeasure updatedMeasure = ProgressUpdate1P3UpdatedMeasure.builder()
                .uuId(UUID.randomUUID())
                .measureImplType(MeasureImplType.MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN)
                .progressUpdate1P3EnergyEfficiencyMeasure(energyEfficiencyMeasure)
                .actionPlanEnergyEfficiencyMeasure(getActionPlanMeasure())
                .build();

        Set<ConstraintViolation<ProgressUpdate1P3UpdatedMeasure>> violations = validator.validate(updatedMeasure);

        Assertions.assertEquals(0, violations.size());
    }

    @Test
    void testMeasureIsImplementedNotNullForInvalidMeasureImplType() {
        ProgressUpdate1P3EnergyEfficiencyMeasure energyEfficiencyMeasure = new ProgressUpdate1P3EnergyEfficiencyMeasure();
        energyEfficiencyMeasure.setMeasureIsImplemented(null);

        ProgressUpdate1P3UpdatedMeasure updatedMeasure = ProgressUpdate1P3UpdatedMeasure.builder()
                .uuId(UUID.randomUUID())
                .measureImplType(MeasureImplType.MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN)
                .progressUpdate1P3EnergyEfficiencyMeasure(energyEfficiencyMeasure)
                .actionPlanEnergyEfficiencyMeasure(getActionPlanMeasure())
                .build();

        Set<ConstraintViolation<ProgressUpdate1P3UpdatedMeasure>> violations = validator.validate(updatedMeasure);

        Assertions.assertEquals(1, violations.size());
        ConstraintViolation<ProgressUpdate1P3UpdatedMeasure> violation = violations.iterator().next();
        Assertions.assertEquals("{pu.measureIsImplemented}", violation.getMessage());
    }

    @Test
    void testMeasureImplementedByTheDateInActionPlanForImplementedMeasure() {
        ProgressUpdate1P3EnergyEfficiencyMeasure energyEfficiencyMeasure = new ProgressUpdate1P3EnergyEfficiencyMeasure();
        energyEfficiencyMeasure.setMeasureIsImplemented(true);
        energyEfficiencyMeasure.setMeasureImplementedByTheDateInActionPlan(true);
        energyEfficiencyMeasure.setReductionEnergyConsumption2024To2025(1l);
        energyEfficiencyMeasure.setReductionEnergyConsumption2023To2024(1l);

        ProgressUpdate1P3UpdatedMeasure updatedMeasure = ProgressUpdate1P3UpdatedMeasure.builder()
                .uuId(UUID.randomUUID())
                .measureImplType(MeasureImplType.MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN)
                .progressUpdate1P3EnergyEfficiencyMeasure(energyEfficiencyMeasure)
                .actionPlanEnergyEfficiencyMeasure(getActionPlanMeasure())
                .build();

        Set<ConstraintViolation<ProgressUpdate1P3UpdatedMeasure>> violations = validator.validate(updatedMeasure);

        Assertions.assertEquals(0, violations.size());
    }

    @Test
    void testMeasureImplementedByTheDateInActionPlanNullForUnimplementedMeasure() {
        ProgressUpdate1P3EnergyEfficiencyMeasure energyEfficiencyMeasure = new ProgressUpdate1P3EnergyEfficiencyMeasure();
        energyEfficiencyMeasure.setMeasureIsImplemented(false);
        energyEfficiencyMeasure.setMeasureImplementedByTheDateInActionPlan(null);

        ProgressUpdate1P3UpdatedMeasure updatedMeasure = ProgressUpdate1P3UpdatedMeasure.builder()
                .uuId(UUID.randomUUID())
                .measureImplType(MeasureImplType.MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN)
                .progressUpdate1P3EnergyEfficiencyMeasure(energyEfficiencyMeasure)
                .actionPlanEnergyEfficiencyMeasure(getActionPlanMeasure())
                .build();

        Set<ConstraintViolation<ProgressUpdate1P3UpdatedMeasure>> violations = validator.validate(updatedMeasure);

        Assertions.assertEquals(0, violations.size());
    }

    @Test
    void testMeasureImplementedByTheDateInActionPlanNullForImplementedMeasure() {
        ProgressUpdate1P3EnergyEfficiencyMeasure energyEfficiencyMeasure = new ProgressUpdate1P3EnergyEfficiencyMeasure();
        energyEfficiencyMeasure.setMeasureIsImplemented(true);
        energyEfficiencyMeasure.setMeasureImplementedByTheDateInActionPlan(null);
        energyEfficiencyMeasure.setReductionEnergyConsumption2024To2025(1l);
        energyEfficiencyMeasure.setReductionEnergyConsumption2023To2024(1l);

        ProgressUpdate1P3UpdatedMeasure updatedMeasure = ProgressUpdate1P3UpdatedMeasure.builder()
                .uuId(UUID.randomUUID())
                .measureImplType(MeasureImplType.MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN)
                .progressUpdate1P3EnergyEfficiencyMeasure(energyEfficiencyMeasure)
                .actionPlanEnergyEfficiencyMeasure(getActionPlanMeasure())
                .build();

        Set<ConstraintViolation<ProgressUpdate1P3UpdatedMeasure>> violations = validator.validate(updatedMeasure);

        Assertions.assertEquals(1, violations.size());
        ConstraintViolation<ProgressUpdate1P3UpdatedMeasure> violation = violations.iterator().next();
        Assertions.assertEquals("{pu.measureImplementedByTheDateInActionPlan}", violation.getMessage());
    }

    @Test
    void testReductionEnergyConsumption2024To2025NotNullForImplementedMeasure() {
        ProgressUpdate1P3EnergyEfficiencyMeasure energyEfficiencyMeasure = new ProgressUpdate1P3EnergyEfficiencyMeasure();
        energyEfficiencyMeasure.setMeasureIsImplemented(true);
        energyEfficiencyMeasure.setMeasureImplementedByTheDateInActionPlan(true);
        energyEfficiencyMeasure.setReductionEnergyConsumption2024To2025(1l);
        energyEfficiencyMeasure.setReductionEnergyConsumption2023To2024(1l);

        ProgressUpdate1P3UpdatedMeasure updatedMeasure = ProgressUpdate1P3UpdatedMeasure.builder()
                .uuId(UUID.randomUUID())
                .measureImplType(MeasureImplType.MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN)
                .progressUpdate1P3EnergyEfficiencyMeasure(energyEfficiencyMeasure)
                .actionPlanEnergyEfficiencyMeasure(getActionPlanMeasure())
                .build();

        Set<ConstraintViolation<ProgressUpdate1P3UpdatedMeasure>> violations = validator.validate(updatedMeasure);

        Assertions.assertEquals(0, violations.size());
    }

    @Test
    void testReductionEnergyConsumption2024To2025NullForImplementedMeasure() {
        ProgressUpdate1P3EnergyEfficiencyMeasure energyEfficiencyMeasure = new ProgressUpdate1P3EnergyEfficiencyMeasure();
        energyEfficiencyMeasure.setMeasureIsImplemented(true);
        energyEfficiencyMeasure.setMeasureImplementedByTheDateInActionPlan(true);
        energyEfficiencyMeasure.setReductionEnergyConsumption2024To2025(null);
        energyEfficiencyMeasure.setReductionEnergyConsumption2023To2024(1l);

        ProgressUpdate1P3UpdatedMeasure updatedMeasure = ProgressUpdate1P3UpdatedMeasure.builder()
                .uuId(UUID.randomUUID())
                .measureImplType(MeasureImplType.MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN)
                .progressUpdate1P3EnergyEfficiencyMeasure(energyEfficiencyMeasure)
                .actionPlanEnergyEfficiencyMeasure(getActionPlanMeasure())
                .build();

        Set<ConstraintViolation<ProgressUpdate1P3UpdatedMeasure>> violations = validator.validate(updatedMeasure);

        assertEquals(1, violations.size());
        ConstraintViolation<ProgressUpdate1P3UpdatedMeasure> violation = violations.iterator().next();
        assertEquals("{pu1.reductionEnergyConsumption2024To2025}", violation.getMessage());
    }

    @Test
    void testReportReduction2024To2025NotNullForBeforeSubmitActionPlan() {
        ProgressUpdate1P3EnergyEfficiencyMeasure energyEfficiencyMeasure = new ProgressUpdate1P3EnergyEfficiencyMeasure();
        energyEfficiencyMeasure.setReportReduction2024To2025(true);
        energyEfficiencyMeasure.setReductionEnergyConsumption2024To2025(1l);
        energyEfficiencyMeasure.setReportReduction2023To2024(false);


        ProgressUpdate1P3UpdatedMeasure updatedMeasure = ProgressUpdate1P3UpdatedMeasure.builder()
                .uuId(UUID.randomUUID())
                .measureImplType(MeasureImplType.MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN)
                .progressUpdate1P3EnergyEfficiencyMeasure(energyEfficiencyMeasure)
                .actionPlanEnergyEfficiencyMeasure(getActionPlanMeasure())
                .build();

        Set<ConstraintViolation<ProgressUpdate1P3UpdatedMeasure>> violations = validator.validate(updatedMeasure);

        assertEquals(0, violations.size());
    }

    @Test
    void testReportReduction2024To2025NullForBeforeSubmitActionPlan() {
        ProgressUpdate1P3EnergyEfficiencyMeasure energyEfficiencyMeasure = new ProgressUpdate1P3EnergyEfficiencyMeasure();
        energyEfficiencyMeasure.setReportReduction2024To2025(null);
        energyEfficiencyMeasure.setReportReduction2023To2024(false);

        ProgressUpdate1P3UpdatedMeasure updatedMeasure = ProgressUpdate1P3UpdatedMeasure.builder()
                .uuId(UUID.randomUUID())
                .measureImplType(MeasureImplType.MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN)
                .progressUpdate1P3EnergyEfficiencyMeasure(energyEfficiencyMeasure)
                .actionPlanEnergyEfficiencyMeasure(getActionPlanMeasure())
                .build();

        Set<ConstraintViolation<ProgressUpdate1P3UpdatedMeasure>> violations = validator.validate(updatedMeasure);

        assertEquals(1, violations.size());
        ConstraintViolation<ProgressUpdate1P3UpdatedMeasure> violation = violations.iterator().next();
        assertEquals("{pu1.reportReduction2024To2025}", violation.getMessage());
    }

    @Test
    void testReductionEnergyConsumptionAllowedWhenConditionsMet() {
        ProgressUpdate1P3EnergyEfficiencyMeasure measure = ProgressUpdate1P3EnergyEfficiencyMeasure.builder()
                .measureIsImplemented(true)
                .measureImplementedByTheDateInActionPlan(true)
                .reductionEnergyConsumption2023To2024(100L)
                .reductionEnergyConsumption2024To2025(10L)
                .build();

        ProgressUpdate1P3UpdatedMeasure updatedMeasure = ProgressUpdate1P3UpdatedMeasure.builder()
                .uuId(UUID.randomUUID())
                .measureImplType(MeasureImplType.MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN)
                .progressUpdate1P3EnergyEfficiencyMeasure(measure)
                .actionPlanEnergyEfficiencyMeasure(getActionPlanMeasure())
                .build();

        Set<ConstraintViolation<ProgressUpdate1P3UpdatedMeasure>> violations = validator.validate(updatedMeasure);

        // Validation should pass
        assertTrue(violations.isEmpty());
    }

    @Test
    void testReductionEnergyConsumptionNullWhenMeasureIsNotImplemented() {
        // Case where measureIsImplemented is false
        ProgressUpdate1P3EnergyEfficiencyMeasure measure = ProgressUpdate1P3EnergyEfficiencyMeasure.builder()
                .measureIsImplemented(false)
                .reductionEnergyConsumption2023To2024(100L)
                .build();

        ProgressUpdate1P3UpdatedMeasure updatedMeasure = ProgressUpdate1P3UpdatedMeasure.builder()
                .uuId(UUID.randomUUID())
                .measureImplType(MeasureImplType.MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN)
                .progressUpdate1P3EnergyEfficiencyMeasure(measure)
                .build();

        Set<ConstraintViolation<ProgressUpdate1P3UpdatedMeasure>> violations = validator.validate(updatedMeasure);

        // Validation should fail
        assertFalse(violations.isEmpty());
    }

    @Test
    void testReduction23to24beNullWhen_MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN(){
        ProgressUpdate1P3EnergyEfficiencyMeasure measure = ProgressUpdate1P3EnergyEfficiencyMeasure.builder()
                .measureIsImplemented(true)
                .measureImplementedByTheDateInActionPlan(true)
                .reductionEnergyConsumption2024To2025(10L)
                .reductionEnergyConsumption2023To2024(null)
                .estimationMethodType(EstimationMethodType.ENERGY_AUDIT)
                .providedContext("context")
                .build();

        ProgressUpdate1P3UpdatedMeasure updatedMeasure = ProgressUpdate1P3UpdatedMeasure.builder()
                .uuId(UUID.randomUUID())
                .measureImplType(MeasureImplType.MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN)
                .progressUpdate1P3EnergyEfficiencyMeasure(measure)
                .actionPlanEnergyEfficiencyMeasure(getActionPlanMeasure())
                .build();

        Set<ConstraintViolation<ProgressUpdate1P3UpdatedMeasure>> violations = validator.validate(updatedMeasure);

        // Validation should pass
        assertTrue(violations.isEmpty());

    }

    @Test
    void testReduction23to24notNullWhen_MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN(){
        ProgressUpdate1P3EnergyEfficiencyMeasure measure = ProgressUpdate1P3EnergyEfficiencyMeasure.builder()
                .measureIsImplemented(true)
                .measureImplementedByTheDateInActionPlan(true)
                .reductionEnergyConsumption2024To2025(10L)
                .reductionEnergyConsumption2023To2024(1L)
                .estimationMethodType(EstimationMethodType.ENERGY_AUDIT)
                .providedContext("context")
                .build();

        ProgressUpdate1P3UpdatedMeasure updatedMeasure = ProgressUpdate1P3UpdatedMeasure.builder()
                .uuId(UUID.randomUUID())
                .measureImplType(MeasureImplType.MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN)
                .progressUpdate1P3EnergyEfficiencyMeasure(measure)
                .actionPlanEnergyEfficiencyMeasure(getActionPlanMeasure())
                .build();

        Set<ConstraintViolation<ProgressUpdate1P3UpdatedMeasure>> violations = validator.validate(updatedMeasure);
        // Validation should pass
        assertTrue(violations.isEmpty());

    }

    @Test
    void testReduction23to24NullWhen_MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN(){
        ProgressUpdate1P3EnergyEfficiencyMeasure measure = ProgressUpdate1P3EnergyEfficiencyMeasure.builder()
                .measureIsImplemented(true)
                .measureImplementedByTheDateInActionPlan(true)
                .reductionEnergyConsumption2024To2025(10L)
                .reductionEnergyConsumption2023To2024(1L)
                .estimationMethodType(EstimationMethodType.ENERGY_AUDIT)
                .providedContext("context")
                .build();

        ProgressUpdate1P3UpdatedMeasure updatedMeasure = ProgressUpdate1P3UpdatedMeasure.builder()
                .uuId(UUID.randomUUID())
                .measureImplType(MeasureImplType.MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN)
                .progressUpdate1P3EnergyEfficiencyMeasure(measure)
                .actionPlanEnergyEfficiencyMeasure(getActionPlanMeasure())
                .build();

        Set<ConstraintViolation<ProgressUpdate1P3UpdatedMeasure>> violations = validator.validate(updatedMeasure);
        // Validation should pass
        assertTrue(violations.isEmpty());

    }

    private EnergyEfficiencyMeasure getActionPlanMeasure(){
        EnergyEfficiencyMeasure energyEfficiencyMeasure = new EnergyEfficiencyMeasure();
        energyEfficiencyMeasure.setMeasureName("name");
        energyEfficiencyMeasure.setMeasureScheme(Set.of(CLIMATE_CHANGE_AGREEMENTS_CCA));
        energyEfficiencyMeasure.setMeasureContext("test");
        energyEfficiencyMeasure.setTotalEnergySavingsExpected(new TotalEnergySavingsExpected());
        energyEfficiencyMeasure.setIsEnergySavingsOpportunityReportedInAudit(true);
        energyEfficiencyMeasure.setIsEnergySavingsOpportunityReportedInAudit(true);
        energyEfficiencyMeasure.setEnergySavingsEstimateCalculatedType(EnergySavingsEstimateCalculatedType.ENERGY_AUDIT);
        energyEfficiencyMeasure.setImplementationDateForMeasure(LocalDate.now());
        return energyEfficiencyMeasure;
    }



}