package uk.gov.esos.api.reporting.progressupdate2.phase3.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.gov.esos.api.reporting.progressupdate.common.domain.EstimationMethodType;
import uk.gov.esos.api.reporting.progressupdate.common.domain.ProgressUpdateP3Confirmation;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3AddedMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3EnergyEfficiencyMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3AddedMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3EnergyEfficiencyMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3MeasuresUpdate;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3UpdatedAddedMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3UpdatedMeasure;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static uk.gov.esos.api.reporting.progressupdate.common.domain.AddedMeasureEstimationMethodType.ENERGY_AUDIT;
import static uk.gov.esos.api.reporting.progressupdate.common.domain.AddedMeasureEstimationMethodType.OTHER_METHOD;
import static uk.gov.esos.api.reporting.progressupdate.common.domain.MeasureSchemeType.CLIMATE_CHANGE_AGREEMENTS_CCA;
import static uk.gov.esos.api.reporting.progressupdate.common.domain.ProgressUpdateP3Confirmation.ESOS_ACTION_PLAN_COMPLIANCE;

class ProgressUpdate2P3Test {

    private static Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void testValidWhenNoEnergyEfficiencyMeasuresAndESOSAssessmentNotification() {
        // Test case where haveEnergyEfficiencyMeasures is false, and ESOS_ASSESSMENT_NOTIFICATION is selected
        ProgressUpdate2P3MeasuresUpdate measure = ProgressUpdate2P3MeasuresUpdate.builder()
                .progressUpdate2P3Measures(new ArrayList<>())
                .build();

        Set<ProgressUpdateP3Confirmation> confirmations = new HashSet<>();
        confirmations.add(ESOS_ACTION_PLAN_COMPLIANCE);

        ProgressUpdate2P3 progressUpdate2P3 = ProgressUpdate2P3.builder()
                .progressUpdate2P3MeasuresUpdate(measure)
                .responsibleOfficerConfirmation(confirmations)
                .build();

        Set<ConstraintViolation<ProgressUpdate2P3>> violations = validator.validate(progressUpdate2P3);
        assertThat(violations).isEmpty();  // No violations should occur
    }

    @Test
    void testInvalidWhenNoEnergyEfficiencyMeasuresButWrongConfirmation() {

        ProgressUpdate2P3MeasuresUpdate measure = ProgressUpdate2P3MeasuresUpdate.builder()
                .progressUpdate2P3Measures(new ArrayList<>())
                .build();

        Set<ProgressUpdateP3Confirmation> confirmations = new HashSet<>();
        confirmations.add(ProgressUpdateP3Confirmation.ESTIMATION_METHOD_DOCUMENTED);

        ProgressUpdate2P3 progressUpdate2P3 = ProgressUpdate2P3.builder()
                .progressUpdate2P3MeasuresUpdate(measure)
                .responsibleOfficerConfirmation(confirmations)
                .build();

        Set<ConstraintViolation<ProgressUpdate2P3>> violations = validator.validate(progressUpdate2P3);

        assertThat(violations).isNotEmpty();  // Violations should occur
        assertThat(violations.iterator().next().getMessage()).isEqualTo("{pu.responsibleOfficerConfirmationType}");
    }

    @Test
    void testValidWhenEnergyEfficiencyMeasuresWithBothConfirmations() {

        List<ProgressUpdate2P3UpdatedMeasure> progressUpdate2P3UpdatedMeasures = new ArrayList<>();
        ProgressUpdate2P3UpdatedMeasure progressUpdate2P3UpdatedMeasure = new ProgressUpdate2P3UpdatedMeasure();
        progressUpdate2P3UpdatedMeasure.setProgressUpdate2P3EnergyEfficiencyMeasure(getProgressUpdate2P3EnergyEfficiencyMeasure());
        progressUpdate2P3UpdatedMeasure.setUuId(UUID.randomUUID());
        progressUpdate2P3UpdatedMeasures.add(progressUpdate2P3UpdatedMeasure);
        ProgressUpdate2P3MeasuresUpdate progressUpdate2P3MeasuresUpdate = new ProgressUpdate2P3MeasuresUpdate();
        progressUpdate2P3MeasuresUpdate.setProgressUpdate2P3Measures(progressUpdate2P3UpdatedMeasures);

        Set<ProgressUpdateP3Confirmation> confirmations = new HashSet<>();
        confirmations.add(ESOS_ACTION_PLAN_COMPLIANCE);
        confirmations.add(ProgressUpdateP3Confirmation.ESTIMATION_METHOD_DOCUMENTED);

        ProgressUpdate2P3 progressUpdate2P3 = ProgressUpdate2P3.builder()
                .progressUpdate2P3MeasuresUpdate(progressUpdate2P3MeasuresUpdate)
                .responsibleOfficerConfirmation(confirmations)
                .build();
        Set<ConstraintViolation<ProgressUpdate2P3>> violations = validator.validate(progressUpdate2P3);
        assertThat(violations).isEmpty();
    }

    @Test
    void testResponsibleOfficerConfirmation_withEmptyMeasures() {
        // Create a ProgressUpdate1P3 with an empty measures list
        ProgressUpdate2P3MeasuresUpdate measuresUpdate = ProgressUpdate2P3MeasuresUpdate.builder()
                .progressUpdate2P3Measures(Collections.emptyList())
                .build();

        ProgressUpdate2P3 progressUpdate = ProgressUpdate2P3.builder()
                .progressUpdate2P3MeasuresUpdate(measuresUpdate)
                .responsibleOfficerConfirmation(Set.of(ESOS_ACTION_PLAN_COMPLIANCE))
                .build();

        // Since there are no measures, the responsibleOfficerConfirmation must only contain 'ESOS_ACTION_PLAN_COMPLIANCE'
        Assertions.assertTrue(progressUpdate.getResponsibleOfficerConfirmation().contains(ESOS_ACTION_PLAN_COMPLIANCE));
        Assertions.assertEquals(1, progressUpdate.getResponsibleOfficerConfirmation().size());
    }

    @Test
    void testInvalidWhenEnergyEfficiencyMeasuresWithOnlyOneConfirmation() {
        // Test case where there are energy efficiency measures with OTHER_REASONABLE_ESTIMATION_METHOD, but only one confirmation is provided

        List<ProgressUpdate2P3UpdatedMeasure> list = new ArrayList<>();
        ProgressUpdate2P3UpdatedMeasure progressUpdate2P3UpdatedMeasure = new ProgressUpdate2P3UpdatedMeasure();
        progressUpdate2P3UpdatedMeasure.setUuId(UUID.randomUUID());
        progressUpdate2P3UpdatedMeasure.setProgressUpdate2P3EnergyEfficiencyMeasure(getProgressUpdate2P3EnergyEfficiencyMeasure());

        list.add(progressUpdate2P3UpdatedMeasure);

        ProgressUpdate2P3MeasuresUpdate progressUpdate2P3MeasuresUpdate = new ProgressUpdate2P3MeasuresUpdate();
        progressUpdate2P3MeasuresUpdate.setProgressUpdate2P3Measures(list);

        Set<ProgressUpdateP3Confirmation> confirmations = new HashSet<>();
        confirmations.add(ESOS_ACTION_PLAN_COMPLIANCE);

        ProgressUpdate2P3 progressUpdate1P3 = ProgressUpdate2P3.builder()
                .progressUpdate2P3MeasuresUpdate(progressUpdate2P3MeasuresUpdate)
                .responsibleOfficerConfirmation(confirmations)
                .build();


        Set<ConstraintViolation<ProgressUpdate2P3>> violations = validator.validate(progressUpdate1P3);
        assertThat(violations).isNotEmpty();  // Violations should occur because only one confirmation is provided
        assertThat(violations.iterator().next().getMessage()).isEqualTo("{pu.responsibleOfficerConfirmationType}");
    }

    @Test
    void testValidWhenEnergyEfficiencyMeasuresWithBothConfirmations_for_updated_added_measures() {
        ProgressUpdate1P3AddedMeasure progressUpdate1P3AddedMeasure = new ProgressUpdate1P3AddedMeasure();
        progressUpdate1P3AddedMeasure.setMeasureContext("context");
        progressUpdate1P3AddedMeasure.setMeasureName("name");
        progressUpdate1P3AddedMeasure.setMeasureScheme(Set.of(CLIMATE_CHANGE_AGREEMENTS_CCA));
        progressUpdate1P3AddedMeasure.setReductionEnergyConsumption2024To2025(1l);
        progressUpdate1P3AddedMeasure.setEstimationMethodType(ENERGY_AUDIT);
        List<ProgressUpdate2P3UpdatedAddedMeasure> progressUpdate2P3UpdatedMeasures = new ArrayList<>();
        ProgressUpdate2P3UpdatedAddedMeasure addedMeasure = new ProgressUpdate2P3UpdatedAddedMeasure();
        addedMeasure.setProgressUpdate2P3EnergyEfficiencyMeasure(getProgressUpdate2P3EnergyEfficiencyMeasure());
        addedMeasure.setUuId(UUID.randomUUID());
        addedMeasure.setProgressUpdate1P3AddedMeasure(progressUpdate1P3AddedMeasure);
        progressUpdate2P3UpdatedMeasures.add(addedMeasure);

        ProgressUpdate2P3MeasuresUpdate progressUpdate2P3MeasuresUpdate = new ProgressUpdate2P3MeasuresUpdate();
        progressUpdate2P3MeasuresUpdate.setProgressUpdate2P3UpdatedAddedMeasures(progressUpdate2P3UpdatedMeasures);

        Set<ProgressUpdateP3Confirmation> confirmations = new HashSet<>();
        confirmations.add(ESOS_ACTION_PLAN_COMPLIANCE);
        confirmations.add(ProgressUpdateP3Confirmation.ESTIMATION_METHOD_DOCUMENTED);

        ProgressUpdate2P3 progressUpdate2P3 = ProgressUpdate2P3.builder()
                .progressUpdate2P3MeasuresUpdate(progressUpdate2P3MeasuresUpdate)
                .responsibleOfficerConfirmation(confirmations)
                .build();
        Set<ConstraintViolation<ProgressUpdate2P3>> violations = validator.validate(progressUpdate2P3);
        assertThat(violations).isEmpty();
    }

    @Test
    void testValidWhenAddedMeasuresHasEstimationMethodTypeOther() {
        ProgressUpdate2P3MeasuresUpdate progressUpdate2P3MeasuresUpdate = new ProgressUpdate2P3MeasuresUpdate();
        ProgressUpdate2P3AddedMeasure addedMeasure = ProgressUpdate2P3AddedMeasure.builder()
                .measureName("name")
                .reductionEnergyConsumption2025To2026(1L)
                .measureScheme(Set.of(CLIMATE_CHANGE_AGREEMENTS_CCA))
                .estimationMethodType(OTHER_METHOD)
                .estimationMethodDescription("descr")
                .reductionEnergyConsumption2025To2026(1L)
                .build();

        progressUpdate2P3MeasuresUpdate.setProgressUpdate2P3AddedMeasure(List.of(addedMeasure));
        Set<ProgressUpdateP3Confirmation> confirmations = new HashSet<>();
        confirmations.add(ESOS_ACTION_PLAN_COMPLIANCE);
        confirmations.add(ProgressUpdateP3Confirmation.ESTIMATION_METHOD_DOCUMENTED);

        ProgressUpdate2P3 progressUpdate2P3 = ProgressUpdate2P3.builder()
                .progressUpdate2P3MeasuresUpdate(progressUpdate2P3MeasuresUpdate)
                .responsibleOfficerConfirmation(confirmations)
                .build();
        Set<ConstraintViolation<ProgressUpdate2P3>> violations = validator.validate(progressUpdate2P3);
        assertThat(violations).isEmpty();
    }

    private ProgressUpdate2P3EnergyEfficiencyMeasure getProgressUpdate2P3EnergyEfficiencyMeasure() {
        return ProgressUpdate2P3EnergyEfficiencyMeasure.builder()
                .measureIsImplemented(null)
                .measureImplementedByTheDateInActionPlan(null)
                .reportReduction2025To2026(true)
                .reductionEnergyConsumption2025To2026(1L)
                .estimationMethodType(EstimationMethodType.OTHER_METHOD)
                .providedContext("test")
                .estimationMethodDescription("test")
                .build();
    }

    private ProgressUpdate1P3EnergyEfficiencyMeasure getProgressUpdate1P3EnergyEfficiencyMeasure() {
        return ProgressUpdate1P3EnergyEfficiencyMeasure.builder()
                .measureIsImplemented(true)
                .measureImplementedByTheDateInActionPlan(true)
                .estimationMethodType(EstimationMethodType.OTHER_METHOD)
                .providedContext("test")
                .estimationMethodDescription("test")
                .reductionEnergyConsumption2023To2024(1L)
                .reductionEnergyConsumption2024To2025(1L)
                .estimationMethodDescription("test")
                .build();
    }

}