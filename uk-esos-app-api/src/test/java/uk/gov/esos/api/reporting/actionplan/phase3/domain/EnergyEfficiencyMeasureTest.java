package uk.gov.esos.api.reporting.actionplan.phase3.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.gov.esos.api.reporting.progressupdate.common.domain.MeasureSchemeType;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;


class EnergyEfficiencyMeasureTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void testValidImplementationDateForMeasure_AfterDecember2023() {
        EnergyEfficiencyMeasure measure = EnergyEfficiencyMeasure.builder()
                .measureName("Measure A")
                .isEnergySavingsOpportunityReportedInAudit(true)
                .implementationDateForMeasure(LocalDate.now()) // January 2024
                .energySavingsEstimateCalculatedType(EnergySavingsEstimateCalculatedType.ENERGY_AUDIT)
                .build();

        Set<ConstraintViolation<EnergyEfficiencyMeasure>> violations = validate(measure);

        assertNoViolations(violations);
    }

    @Test
    public void testInvalidImplementationDateForMeasure_OnOrBeforeDecember1_2023() {
        // Invalid case: Date is on or before December 6, 2023
        EnergyEfficiencyMeasure measure = EnergyEfficiencyMeasure.builder()
                .measureName("Measure A")
                .isEnergySavingsOpportunityReportedInAudit(true)
                .energySavingsEstimateCalculatedType(EnergySavingsEstimateCalculatedType.ENERGY_AUDIT)
                .implementationDateForMeasure(LocalDate.of(2023, 11, 30))
                .build();

        Set<ConstraintViolation<EnergyEfficiencyMeasure>> violations = validator.validate(measure);

        // Assert that there are violations
        assertThat(violations).isNotEmpty();
        assertThat(violations.iterator().next().getMessage()).isEqualTo("{ap.implementation.date}");
    }

    @Test
    void testValidEstimationMethodDescription_WhenOtherReasonableEstimationMethod() {
        EnergyEfficiencyMeasure measure = EnergyEfficiencyMeasure.builder()
                .measureName("Measure A")
                .isEnergySavingsOpportunityReportedInAudit(true)
                .implementationDateForMeasure(LocalDate.now())
                .energySavingsEstimateCalculatedType(EnergySavingsEstimateCalculatedType.OTHER_REASONABLE_ESTIMATION_METHOD)
                .estimationMethodDescription("Detailed Method")
                .build();

        Set<ConstraintViolation<EnergyEfficiencyMeasure>> violations = validate(measure);

        assertNoViolations(violations);
    }

    @Test
    void testInvalidEstimationMethodDescription_WhenOtherReasonableEstimationMethodIsNull() {
        EnergyEfficiencyMeasure measure = EnergyEfficiencyMeasure.builder()
                .measureName("Measure A")
                .isEnergySavingsOpportunityReportedInAudit(true)
                .implementationDateForMeasure(LocalDate.now())
                .energySavingsEstimateCalculatedType(EnergySavingsEstimateCalculatedType.OTHER_REASONABLE_ESTIMATION_METHOD)
                .estimationMethodDescription(null)
                .build();

        Set<ConstraintViolation<EnergyEfficiencyMeasure>> violations = validate(measure);

        assertViolationMessage(violations, "{ap.energySavingsEstimateCalculatedType.other}");
    }

    @Test
    void testValidEstimationMethodDescription_ShouldBeNullForOtherTypes() {
        EnergyEfficiencyMeasure measure = EnergyEfficiencyMeasure.builder()
                .measureName("Measure A")
                .isEnergySavingsOpportunityReportedInAudit(true)
                .implementationDateForMeasure(LocalDate.now())
                .energySavingsEstimateCalculatedType(EnergySavingsEstimateCalculatedType.ENERGY_AUDIT)
                .estimationMethodDescription(null)
                .build();

        Set<ConstraintViolation<EnergyEfficiencyMeasure>> violations = validate(measure);

        assertNoViolations(violations);
    }

    @Test
    void testValidOtherMeasureSchemeName_WhenMeasureSchemeContainsOther() {
        Set<MeasureSchemeType> measureSchemes = new LinkedHashSet<>();
        measureSchemes.add(MeasureSchemeType.OTHER);

        EnergyEfficiencyMeasure measure = EnergyEfficiencyMeasure.builder()
                .measureName("Measure A")
                .isEnergySavingsOpportunityReportedInAudit(true)
                .implementationDateForMeasure(LocalDate.now())
                .measureScheme(measureSchemes)
                .otherMeasureSchemeName("Other Scheme")
                .energySavingsEstimateCalculatedType(EnergySavingsEstimateCalculatedType.ENERGY_AUDIT)
                .build();

        Set<ConstraintViolation<EnergyEfficiencyMeasure>> violations = validate(measure);

        assertNoViolations(violations);
    }

    @Test
    void testValidOtherMeasureSchemeName_WhenMeasureSchemeContainsOtherButNameIsNull() {
        Set<MeasureSchemeType> measureSchemes = new LinkedHashSet<>();
        measureSchemes.add(MeasureSchemeType.OTHER);

        EnergyEfficiencyMeasure measure = EnergyEfficiencyMeasure.builder()
                .measureName("Measure A")
                .isEnergySavingsOpportunityReportedInAudit(true)
                .implementationDateForMeasure(LocalDate.now())
                .measureScheme(measureSchemes)
                .otherMeasureSchemeName(null)
                .energySavingsEstimateCalculatedType(EnergySavingsEstimateCalculatedType.ENERGY_AUDIT)
                .build();

        Set<ConstraintViolation<EnergyEfficiencyMeasure>> violations = validate(measure);

        assertNoViolations(violations);
    }

    @Test
    void testValidOtherMeasureSchemeName_ShouldBeNullWhenOtherNotSelected() {
        Set<MeasureSchemeType> measureSchemes = new LinkedHashSet<>();
        measureSchemes.add(MeasureSchemeType.CARBON_REDUCTION_PLANS);

        EnergyEfficiencyMeasure measure = EnergyEfficiencyMeasure.builder()
                .measureName("Measure A")
                .isEnergySavingsOpportunityReportedInAudit(true)
                .implementationDateForMeasure(LocalDate.now())
                .measureScheme(measureSchemes)
                .otherMeasureSchemeName(null)
                .energySavingsEstimateCalculatedType(EnergySavingsEstimateCalculatedType.ENERGY_AUDIT)
                .build();

        Set<ConstraintViolation<EnergyEfficiencyMeasure>> violations = validate(measure);

        assertNoViolations(violations);
    }

    private Set<ConstraintViolation<EnergyEfficiencyMeasure>> validate(EnergyEfficiencyMeasure measure) {
        return validator.validate(measure);
    }

    private void assertNoViolations(Set<ConstraintViolation<EnergyEfficiencyMeasure>> violations) {
        assertThat(violations).isEmpty();
    }

    private void assertViolationMessage(Set<ConstraintViolation<EnergyEfficiencyMeasure>> violations, String message) {
        assertThat(violations).isNotEmpty();
        assertThat(violations.iterator().next().getMessage()).isEqualTo(message);
    }


}

