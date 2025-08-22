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
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3AddedMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3EnergyEfficiencyMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3UpdatedMeasure;
import uk.gov.esos.api.reporting.progressupdate.common.domain.ProgressUpdateP3Confirmation;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.MeasureImplType;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3MeasuresUpdate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static uk.gov.esos.api.reporting.progressupdate.common.domain.AddedMeasureEstimationMethodType.OTHER_METHOD;
import static uk.gov.esos.api.reporting.progressupdate.common.domain.MeasureSchemeType.CLIMATE_CHANGE_AGREEMENTS_CCA;
import static uk.gov.esos.api.reporting.progressupdate.common.domain.ProgressUpdateP3Confirmation.ESOS_ACTION_PLAN_COMPLIANCE;

class ProgressUpdate1P3Test {

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
        ProgressUpdate1P3MeasuresUpdate measure = ProgressUpdate1P3MeasuresUpdate.builder()
                .progressUpdate1P3Measures(new ArrayList<>())
                .build();

        Set<ProgressUpdateP3Confirmation> confirmations = new HashSet<>();
        confirmations.add(ESOS_ACTION_PLAN_COMPLIANCE);

        ProgressUpdate1P3 progressUpdate1P3 = ProgressUpdate1P3.builder()
                .progressUpdate1P3MeasuresUpdate(measure)
                .responsibleOfficerConfirmation(confirmations)
                .build();

        Set<ConstraintViolation<ProgressUpdate1P3>> violations = validator.validate(progressUpdate1P3);
        assertThat(violations).isEmpty();  // No violations should occur
    }

    @Test
    void testInvalidWhenNoEnergyEfficiencyMeasuresButWrongConfirmation() {

        ProgressUpdate1P3MeasuresUpdate measure = ProgressUpdate1P3MeasuresUpdate.builder()
                .progressUpdate1P3Measures(new ArrayList<>())
                .build();

        Set<ProgressUpdateP3Confirmation> confirmations = new HashSet<>();
        confirmations.add(ProgressUpdateP3Confirmation.ESTIMATION_METHOD_DOCUMENTED);

        ProgressUpdate1P3 progressUpdate1P3 = ProgressUpdate1P3.builder()
                .progressUpdate1P3MeasuresUpdate(measure)
                .responsibleOfficerConfirmation(confirmations)
                .build();

        Set<ConstraintViolation<ProgressUpdate1P3>> violations = validator.validate(progressUpdate1P3);

        assertThat(violations).isNotEmpty();  // Violations should occur
        assertThat(violations.iterator().next().getMessage()).isEqualTo("{pu.responsibleOfficerConfirmationType}");
    }

    @Test
    void testValidWhenEnergyEfficiencyMeasuresWithBothConfirmations() {
        List<ProgressUpdate1P3UpdatedMeasure> progressUpdate1P3UpdatedMeasures = new ArrayList<>();
        ProgressUpdate1P3UpdatedMeasure progressUpdate1P3UpdatedMeasure = new ProgressUpdate1P3UpdatedMeasure();
        progressUpdate1P3UpdatedMeasure.setMeasureImplType(MeasureImplType.MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN);
        progressUpdate1P3UpdatedMeasure.setProgressUpdate1P3EnergyEfficiencyMeasure(getProgressUpdate1P3EnergyEfficiencyMeasure());
        progressUpdate1P3UpdatedMeasure.setActionPlanEnergyEfficiencyMeasure(getActionPlanMeasure());
        progressUpdate1P3UpdatedMeasure.setUuId(UUID.randomUUID());
        progressUpdate1P3UpdatedMeasures.add(progressUpdate1P3UpdatedMeasure);
        ProgressUpdate1P3MeasuresUpdate progressUpdate1P3MeasuresUpdate = new ProgressUpdate1P3MeasuresUpdate();
        progressUpdate1P3MeasuresUpdate.setProgressUpdate1P3Measures(progressUpdate1P3UpdatedMeasures);

        Set<ProgressUpdateP3Confirmation> confirmations = new HashSet<>();
        confirmations.add(ESOS_ACTION_PLAN_COMPLIANCE);
        confirmations.add(ProgressUpdateP3Confirmation.ESTIMATION_METHOD_DOCUMENTED);

        ProgressUpdate1P3 progressUpdate1P3 = ProgressUpdate1P3.builder()
                .progressUpdate1P3MeasuresUpdate(progressUpdate1P3MeasuresUpdate)
                .responsibleOfficerConfirmation(confirmations)
                .build();
        Set<ConstraintViolation<ProgressUpdate1P3>> violations = validator.validate(progressUpdate1P3);
        assertThat(violations).isEmpty();  // No violations should occur
    }

    @Test
    void testResponsibleOfficerConfirmation_withEmptyMeasures() {
        // Create a ProgressUpdate1P3 with an empty measures list
        ProgressUpdate1P3MeasuresUpdate measuresUpdate = ProgressUpdate1P3MeasuresUpdate.builder()
                .progressUpdate1P3Measures(Collections.emptyList())
                .build();

        ProgressUpdate1P3 progressUpdate = ProgressUpdate1P3.builder()
                .progressUpdate1P3MeasuresUpdate(measuresUpdate)
                .responsibleOfficerConfirmation(Set.of(ESOS_ACTION_PLAN_COMPLIANCE))
                .build();

        // Since there are no measures, the responsibleOfficerConfirmation must only contain 'ESOS_ACTION_PLAN_COMPLIANCE'
        Assertions.assertTrue(progressUpdate.getResponsibleOfficerConfirmation().contains(ESOS_ACTION_PLAN_COMPLIANCE));
        Assertions.assertEquals(1, progressUpdate.getResponsibleOfficerConfirmation().size());
    }

    @Test
    void testInvalidWhenEnergyEfficiencyMeasuresWithOnlyOneConfirmation() {
        // Test case where there are energy efficiency measures with OTHER_REASONABLE_ESTIMATION_METHOD, but only one confirmation is provided

        List<ProgressUpdate1P3UpdatedMeasure> list = new ArrayList<>();
        ProgressUpdate1P3UpdatedMeasure progressUpdate1P3UpdatedMeasure = new ProgressUpdate1P3UpdatedMeasure();
        progressUpdate1P3UpdatedMeasure.setMeasureImplType(MeasureImplType.MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN);
        progressUpdate1P3UpdatedMeasure.setUuId(UUID.randomUUID());
        progressUpdate1P3UpdatedMeasure.setProgressUpdate1P3EnergyEfficiencyMeasure(getProgressUpdate1P3EnergyEfficiencyMeasure());
        progressUpdate1P3UpdatedMeasure.setActionPlanEnergyEfficiencyMeasure(getActionPlanMeasure());

        list.add(progressUpdate1P3UpdatedMeasure);

        ProgressUpdate1P3MeasuresUpdate progressUpdate1P3MeasuresUpdate = new ProgressUpdate1P3MeasuresUpdate();
        progressUpdate1P3MeasuresUpdate.setProgressUpdate1P3Measures(list);

        Set<ProgressUpdateP3Confirmation> confirmations = new HashSet<>();
        confirmations.add(ESOS_ACTION_PLAN_COMPLIANCE);

        ProgressUpdate1P3 progressUpdate1P3 = ProgressUpdate1P3.builder()
                .progressUpdate1P3MeasuresUpdate(progressUpdate1P3MeasuresUpdate)
                .responsibleOfficerConfirmation(confirmations)
                .build();


        Set<ConstraintViolation<ProgressUpdate1P3>> violations = validator.validate(progressUpdate1P3);
        assertThat(violations).isNotEmpty();  // Violations should occur because only one confirmation is provided
        assertThat(violations.iterator().next().getMessage()).isEqualTo("{pu.responsibleOfficerConfirmationType}");
    }

    private ProgressUpdate1P3EnergyEfficiencyMeasure getProgressUpdate1P3EnergyEfficiencyMeasure()  {
        return ProgressUpdate1P3EnergyEfficiencyMeasure.builder()
                .measureIsImplemented(true)
                .measureImplementedByTheDateInActionPlan(true)
                .estimationMethodType(EstimationMethodType.OTHER_METHOD)
                .providedContext("test")
                .estimationMethodDescription("test")
                .reductionEnergyConsumption2023To2024(1l)
                .reductionEnergyConsumption2024To2025(1l)
                .estimationMethodDescription("test")
                .build();
    }

    @Test
    void testValidWhenEnergyEfficiencyMeasuresWithBothConfirmationsWhenAddedMeasureHasOther() {
        ProgressUpdate1P3MeasuresUpdate progressUpdate1P3MeasuresUpdate = new ProgressUpdate1P3MeasuresUpdate();
        ProgressUpdate1P3AddedMeasure addedMeasure = ProgressUpdate1P3AddedMeasure.builder().measureName("name")
                .measureScheme(Set.of(CLIMATE_CHANGE_AGREEMENTS_CCA))
                .estimationMethodType(OTHER_METHOD)
                .reductionEnergyConsumption2024To2025(1L)
                .estimationMethodDescription("descr")
                .build();
        progressUpdate1P3MeasuresUpdate.setProgressUpdate1P3AddedMeasure(List.of(addedMeasure));

        Set<ProgressUpdateP3Confirmation> confirmations = new HashSet<>();
        confirmations.add(ESOS_ACTION_PLAN_COMPLIANCE);
        confirmations.add(ProgressUpdateP3Confirmation.ESTIMATION_METHOD_DOCUMENTED);

        ProgressUpdate1P3 progressUpdate1P3 = ProgressUpdate1P3.builder()
                .progressUpdate1P3MeasuresUpdate(progressUpdate1P3MeasuresUpdate)
                .responsibleOfficerConfirmation(confirmations)
                .build();

        Set<ConstraintViolation<ProgressUpdate1P3>> violations = validator.validate(progressUpdate1P3);
        assertThat(violations).isEmpty();  // No violations should occur
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