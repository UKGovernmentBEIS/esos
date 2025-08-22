package uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain;


import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.gov.esos.api.reporting.progressupdate.common.domain.AddedMeasureEstimationMethodType;
import uk.gov.esos.api.reporting.progressupdate.common.domain.EstimationMethodType;
import uk.gov.esos.api.reporting.progressupdate.common.domain.MeasureSchemeType;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3AddedMeasure;

import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ProgressUpdate2P3UpdatedAddedMeasureTest {

    private static Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void shouldFailValidationWhenEstimationMethodTypeIsActionPlanEstimate() {

        ProgressUpdate2P3EnergyEfficiencyMeasure energyEfficiencyMeasure = new ProgressUpdate2P3EnergyEfficiencyMeasure();
        energyEfficiencyMeasure.setEstimationMethodType(EstimationMethodType.ACTION_PLAN_ESTIMATE);

        ProgressUpdate2P3UpdatedAddedMeasure progressUpdate2P3UpdatedAddedMeasure = new ProgressUpdate2P3UpdatedAddedMeasure();
        progressUpdate2P3UpdatedAddedMeasure.setProgressUpdate2P3EnergyEfficiencyMeasure(energyEfficiencyMeasure);

        Set<ConstraintViolation<ProgressUpdate2P3UpdatedAddedMeasure>> violations = validator.validate(progressUpdate2P3UpdatedAddedMeasure);

        assertFalse(violations.isEmpty());

        assertTrue(
                violations.stream()
                        .anyMatch(v -> "{pu2.estimationMethodType.actionPlan}".equals(v.getMessage()))
        );
    }

    @Test
    void shouldPassValidationWhenEstimationMethodTypeIsNotActionPlanEstimate() {

        ProgressUpdate2P3EnergyEfficiencyMeasure energyEfficiencyMeasure = new ProgressUpdate2P3EnergyEfficiencyMeasure();
        energyEfficiencyMeasure.setEstimationMethodType(EstimationMethodType.ENERGY_AUDIT);
        energyEfficiencyMeasure.setReportReduction2025To2026(true);
        energyEfficiencyMeasure.setReductionEnergyConsumption2025To2026(1L);

        ProgressUpdate1P3AddedMeasure measure = ProgressUpdate1P3AddedMeasure.builder()
                .measureName("Energy Efficiency Upgrade")
                .measureScheme(Set.of(MeasureSchemeType.OTHER))
                .reductionEnergyConsumption2024To2025(100L)
                .estimationMethodType(AddedMeasureEstimationMethodType.OTHER_METHOD)
                .estimationMethodDescription("Description of other method")
                .build();

        ProgressUpdate2P3UpdatedAddedMeasure progressUpdate2P3UpdatedAddedMeasure = new ProgressUpdate2P3UpdatedAddedMeasure();
        progressUpdate2P3UpdatedAddedMeasure.setProgressUpdate2P3EnergyEfficiencyMeasure(energyEfficiencyMeasure);
        progressUpdate2P3UpdatedAddedMeasure.setUuId(UUID.randomUUID());
        progressUpdate2P3UpdatedAddedMeasure.setProgressUpdate1P3AddedMeasure(measure);

        Set<ConstraintViolation<ProgressUpdate2P3UpdatedAddedMeasure>> violations = validator.validate(progressUpdate2P3UpdatedAddedMeasure);

        assertTrue(violations.isEmpty());
    }

}