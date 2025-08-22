package uk.gov.esos.api.reporting.actionplan.phase3.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class ActionPlanP3Test {

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
        ActionPlanEnergyEfficiencyMeasure energyEfficiencyMeasure = ActionPlanEnergyEfficiencyMeasure.builder()
                .haveEnergyEfficiencyMeasures(false)
                .build();

        Set<ResponsibleOfficerConfirmationType> confirmations = new HashSet<>();
        confirmations.add(ResponsibleOfficerConfirmationType.ESOS_ASSESSMENT_NOTIFICATION);

        ActionPlanP3 actionPlan = ActionPlanP3.builder()
                .energyEfficiencyMeasure(energyEfficiencyMeasure)
                .responsibleOfficerConfirmation(confirmations)
                .build();

        Set<ConstraintViolation<ActionPlanP3>> violations = validator.validate(actionPlan);
        assertThat(violations).isEmpty();  // No violations should occur
    }

    @Test
    void testInvalidWhenNoEnergyEfficiencyMeasuresButWrongConfirmation() {
        // Test case where haveEnergyEfficiencyMeasures is false, but the wrong confirmation is provided
        ActionPlanEnergyEfficiencyMeasure energyEfficiencyMeasure = ActionPlanEnergyEfficiencyMeasure.builder()
                .haveEnergyEfficiencyMeasures(false)
                .build();

        Set<ResponsibleOfficerConfirmationType> confirmations = new HashSet<>();
        confirmations.add(ResponsibleOfficerConfirmationType.ESTIMATION_METHOD_DESCRIPTION);

        ActionPlanP3 actionPlan = ActionPlanP3.builder()
                .energyEfficiencyMeasure(energyEfficiencyMeasure)
                .responsibleOfficerConfirmation(confirmations)
                .build();

        Set<ConstraintViolation<ActionPlanP3>> violations = validator.validate(actionPlan);
        assertThat(violations).isNotEmpty();  // Violations should occur
        assertThat(violations.iterator().next().getMessage()).isEqualTo("{ap.responsibleOfficerConfirmationType}");
    }

    @Test
    void testValidWhenEnergyEfficiencyMeasuresWithBothConfirmations() {
        // Test case where there are energy efficiency measures with OTHER_REASONABLE_ESTIMATION_METHOD, and both confirmations are selected
        List<EnergyEfficiencyMeasure> energyMeasures = new ArrayList<>();
        EnergyEfficiencyMeasure measure = EnergyEfficiencyMeasure.builder()
                .measureName("Measure A")
                .isEnergySavingsOpportunityReportedInAudit(true)
                .implementationDateForMeasure(LocalDate.now())
                .energySavingsEstimateCalculatedType(EnergySavingsEstimateCalculatedType.OTHER_REASONABLE_ESTIMATION_METHOD)
                .estimationMethodDescription("Description")
                .build();
        energyMeasures.add(measure);

        ActionPlanEnergyEfficiencyMeasure energyEfficiencyMeasure = ActionPlanEnergyEfficiencyMeasure.builder()
                .haveEnergyEfficiencyMeasures(true)
                .energyEfficiencyMeasures(energyMeasures)
                .build();

        Set<ResponsibleOfficerConfirmationType> confirmations = new HashSet<>();
        confirmations.add(ResponsibleOfficerConfirmationType.ESOS_ASSESSMENT_NOTIFICATION);
        confirmations.add(ResponsibleOfficerConfirmationType.ESTIMATION_METHOD_DESCRIPTION);

        ActionPlanP3 actionPlan = ActionPlanP3.builder()
                .energyEfficiencyMeasure(energyEfficiencyMeasure)
                .responsibleOfficerConfirmation(confirmations)
                .build();

        Set<ConstraintViolation<ActionPlanP3>> violations = validator.validate(actionPlan);
        assertThat(violations).isEmpty();  // No violations should occur
    }

    @Test
    void testInvalidWhenEnergyEfficiencyMeasuresWithOnlyOneConfirmation() {
        // Test case where there are energy efficiency measures with OTHER_REASONABLE_ESTIMATION_METHOD, but only one confirmation is provided
        List<EnergyEfficiencyMeasure> energyMeasures = new ArrayList<>();
        EnergyEfficiencyMeasure measure = EnergyEfficiencyMeasure.builder()
                .measureName("Measure A")
                .isEnergySavingsOpportunityReportedInAudit(true)
                .implementationDateForMeasure(LocalDate.now())
                .energySavingsEstimateCalculatedType(EnergySavingsEstimateCalculatedType.OTHER_REASONABLE_ESTIMATION_METHOD)
                .estimationMethodDescription("Description")
                .build();
        energyMeasures.add(measure);

        ActionPlanEnergyEfficiencyMeasure energyEfficiencyMeasure = ActionPlanEnergyEfficiencyMeasure.builder()
                .haveEnergyEfficiencyMeasures(true)
                .energyEfficiencyMeasures(energyMeasures)
                .build();

        Set<ResponsibleOfficerConfirmationType> confirmations = new HashSet<>();
        confirmations.add(ResponsibleOfficerConfirmationType.ESOS_ASSESSMENT_NOTIFICATION);

        ActionPlanP3 actionPlan = ActionPlanP3.builder()
                .energyEfficiencyMeasure(energyEfficiencyMeasure)
                .responsibleOfficerConfirmation(confirmations)
                .build();

        Set<ConstraintViolation<ActionPlanP3>> violations = validator.validate(actionPlan);
        assertThat(violations).isNotEmpty();  // Violations should occur because only one confirmation is provided
        assertThat(violations.iterator().next().getMessage()).isEqualTo("{ap.responsibleOfficerConfirmationType}");
    }


}