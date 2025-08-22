package uk.gov.esos.api.reporting.actionplan.phase3.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class ActionPlanEnergyEfficiencyMeasureTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidWhenHaveMeasuresFalseAndListIsEmpty() {
        ActionPlanEnergyEfficiencyMeasure measure = ActionPlanEnergyEfficiencyMeasure.builder()
                .haveEnergyEfficiencyMeasures(false)
                .energyEfficiencyMeasures(new ArrayList<>()) // Empty list
                .build();

        Set<ConstraintViolation<ActionPlanEnergyEfficiencyMeasure>> violations = validator.validate(measure);
        assertThat(violations).isEmpty(); // No violations should occur
    }

    @Test
    void testValidWhenHaveMeasuresFalseAndListIsNull() {
        ActionPlanEnergyEfficiencyMeasure measure = ActionPlanEnergyEfficiencyMeasure.builder()
                .haveEnergyEfficiencyMeasures(false)
                .energyEfficiencyMeasures(null) // List is null
                .build();

        Set<ConstraintViolation<ActionPlanEnergyEfficiencyMeasure>> violations = validator.validate(measure);
        assertThat(violations).isEmpty(); // No violations should occur
    }

    // Test when haveEnergyEfficiencyMeasures is true, the list must contain one or more items
    @Test
    void testValidWhenHaveMeasuresTrueAndListHasItems() {
        // Create a valid EnergyEfficiencyMeasure object
        List<EnergyEfficiencyMeasure> energyMeasures = new ArrayList<>();
        energyMeasures.add(EnergyEfficiencyMeasure.builder()
                .measureName("Measure A")
                .isEnergySavingsOpportunityReportedInAudit(true)  // Set valid value for @NotNull field
                .energySavingsEstimateCalculatedType(EnergySavingsEstimateCalculatedType.ENERGY_AUDIT)  // Set valid enum value for @NotNull field
                .implementationDateForMeasure(LocalDate.now())  // Set a valid date after Dec 2023
                .build());

        // Create ActionPlanEnergyEfficiencyMeasure with the valid energyMeasures list
        ActionPlanEnergyEfficiencyMeasure measure = ActionPlanEnergyEfficiencyMeasure.builder()
                .haveEnergyEfficiencyMeasures(true)
                .energyEfficiencyMeasures(energyMeasures) // List with one valid item
                .build();

        // Validate the measure object
        Set<ConstraintViolation<ActionPlanEnergyEfficiencyMeasure>> violations = validator.validate(measure);

        assertThat(violations).isEmpty();
    }

    @Test
    void testInvalidWhenHaveMeasuresTrueAndListIsEmpty() {
        ActionPlanEnergyEfficiencyMeasure measure = ActionPlanEnergyEfficiencyMeasure.builder()
                .haveEnergyEfficiencyMeasures(true)
                .energyEfficiencyMeasures(new ArrayList<>()) // Empty list
                .build();

        Set<ConstraintViolation<ActionPlanEnergyEfficiencyMeasure>> violations = validator.validate(measure);
        assertThat(violations).isNotEmpty(); // Violations should occur
        assertThat(violations.iterator().next().getMessage()).isEqualTo("{ap.haveEnergyEfficiencyMeasures}");
    }

    // Test when haveEnergyEfficiencyMeasures is true but the list is null (invalid case)
    @Test
    void testInvalidWhenHaveMeasuresTrueAndListIsNull() {
        ActionPlanEnergyEfficiencyMeasure measure = ActionPlanEnergyEfficiencyMeasure.builder()
                .haveEnergyEfficiencyMeasures(true)
                .energyEfficiencyMeasures(null) // List is null
                .build();

        Set<ConstraintViolation<ActionPlanEnergyEfficiencyMeasure>> violations = validator.validate(measure);
        assertThat(violations).isNotEmpty(); // Violations should occur
        assertThat(violations.iterator().next().getMessage()).isEqualTo("{ap.haveEnergyEfficiencyMeasures}");
    }

    @Test
    public void testValidWhenHaveEnergyEfficiencyMeasuresIsFalseAndNoHaveMeasureContextIsNotNull() {
        // Arrange
        ActionPlanEnergyEfficiencyMeasure measure = new ActionPlanEnergyEfficiencyMeasure();
        measure.setHaveEnergyEfficiencyMeasures(false);
        measure.setNoMeasureContext("Optional context");  // Optional value allowed

        // Act
        Set<ConstraintViolation<ActionPlanEnergyEfficiencyMeasure>> violations = validator.validate(measure);

        // Assert
        assertThat(violations).isEmpty();
    }

    @Test
    public void testValidWhenHaveEnergyEfficiencyMeasuresIsFalseAndNoHaveMeasureContextIsNull() {
        // Arrange
        ActionPlanEnergyEfficiencyMeasure measure = new ActionPlanEnergyEfficiencyMeasure();
        measure.setHaveEnergyEfficiencyMeasures(false);
        measure.setNoMeasureContext(null);  // Optional null value allowed

        // Act
        Set<ConstraintViolation<ActionPlanEnergyEfficiencyMeasure>> violations = validator.validate(measure);

        // Assert
        assertThat(violations).isEmpty();
    }

    @Test
    public void testValidWhenHaveEnergyEfficiencyMeasuresIsTrueAndNoHaveMeasureContextIsNull() {
        List<EnergyEfficiencyMeasure> energyMeasures = new ArrayList<>();
        energyMeasures.add(EnergyEfficiencyMeasure.builder()
                .measureName("Measure A")
                .isEnergySavingsOpportunityReportedInAudit(true)  // Set valid value for @NotNull field
                .energySavingsEstimateCalculatedType(EnergySavingsEstimateCalculatedType.ENERGY_AUDIT)  // Set valid enum value for @NotNull field
                .implementationDateForMeasure(LocalDate.now())  // Set a valid date after Dec 2023
                .build());

        // Create ActionPlanEnergyEfficiencyMeasure with the valid energyMeasures list
        ActionPlanEnergyEfficiencyMeasure measure = ActionPlanEnergyEfficiencyMeasure.builder()
                .haveEnergyEfficiencyMeasures(true)
                .energyEfficiencyMeasures(energyMeasures) // List with one valid item
                .noMeasureContext(null)
                .build();

        // Act
        Set<ConstraintViolation<ActionPlanEnergyEfficiencyMeasure>> violations = validator.validate(measure);

        // Assert
        assertThat(violations).isEmpty();
    }

    @Test
    public void testInvalidWhenHaveEnergyEfficiencyMeasuresIsTrueAndNoHaveMeasureContextIsNotNull() {

        List<EnergyEfficiencyMeasure> energyMeasures = new ArrayList<>();
        energyMeasures.add(EnergyEfficiencyMeasure.builder()
                .measureName("Measure A")
                .isEnergySavingsOpportunityReportedInAudit(true)  // Set valid value for @NotNull field
                .energySavingsEstimateCalculatedType(EnergySavingsEstimateCalculatedType.ENERGY_AUDIT)  // Set valid enum value for @NotNull field
                .implementationDateForMeasure(LocalDate.now())  // Set a valid date after Dec 2023
                .build());

        ActionPlanEnergyEfficiencyMeasure measure = ActionPlanEnergyEfficiencyMeasure.builder()
                .haveEnergyEfficiencyMeasures(true)
                .energyEfficiencyMeasures(energyMeasures) // List with one valid item
                .noMeasureContext("Invalid context")
                .build();

        // Act
        Set<ConstraintViolation<ActionPlanEnergyEfficiencyMeasure>> violations = validator.validate(measure);

        // Assert: Expecting a violation
        assertThat(violations).isNotEmpty();
        violations.forEach(violation ->
                assertThat(violation.getMessage()).isEqualTo("{ap.noHaveMeasureContext}")
        );
    }

}