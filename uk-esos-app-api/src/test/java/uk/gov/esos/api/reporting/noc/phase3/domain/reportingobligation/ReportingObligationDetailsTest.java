package uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class ReportingObligationDetailsTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_when_responsible_valid() {
        ReportingObligationDetails reportingObligationDetails = ReportingObligationDetails.builder()
            .qualificationReasonType(OrganisationQualificationReasonType.STAFF_MEMBERS_MORE_THAN_250)
            .energyResponsibilityType(OrganisationEnergyResponsibilityType.RESPONSIBLE)
            .complianceRouteDistribution(ComplianceRouteDistribution.builder()
                .iso50001Pct(10)
                .greenDealAssessmentPct(20)
                .displayEnergyCertificatePct(20)
                .energyAuditsPct(50)
                .energyNotAuditedPct(0)
                .totalPct(100)
                .build())
            .build();

        final Set<ConstraintViolation<ReportingObligationDetails>> violations = validator.validate(reportingObligationDetails);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_when_responsible_invalid() {
        ReportingObligationDetails reportingObligationDetails = ReportingObligationDetails.builder()
            .qualificationReasonType(OrganisationQualificationReasonType.STAFF_MEMBERS_MORE_THAN_250)
            .energyResponsibilityType(OrganisationEnergyResponsibilityType.RESPONSIBLE)
            .build();

        final Set<ConstraintViolation<ReportingObligationDetails>> violations = validator.validate(reportingObligationDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly("{noc.reportingObligationDetails.energyResponsibilityType.complianceRouteDistribution}");
    }

    @Test
    void validate_when_not_responsible_valid() {
        ReportingObligationDetails reportingObligationDetails = ReportingObligationDetails.builder()
            .qualificationReasonType(OrganisationQualificationReasonType.STAFF_MEMBERS_MORE_THAN_250)
            .energyResponsibilityType(OrganisationEnergyResponsibilityType.NOT_RESPONSIBLE)
            .build();

        final Set<ConstraintViolation<ReportingObligationDetails>> violations = validator.validate(reportingObligationDetails);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_when_not_responsible_invalid() {
        ReportingObligationDetails reportingObligationDetails = ReportingObligationDetails.builder()
            .qualificationReasonType(OrganisationQualificationReasonType.STAFF_MEMBERS_MORE_THAN_250)
            .energyResponsibilityType(OrganisationEnergyResponsibilityType.NOT_RESPONSIBLE)
            .complianceRouteDistribution(ComplianceRouteDistribution.builder()
                .iso50001Pct(10)
                .greenDealAssessmentPct(20)
                .displayEnergyCertificatePct(20)
                .energyAuditsPct(45)
                .energyNotAuditedPct(5)
                .totalPct(100)
                .build())
            .build();

        final Set<ConstraintViolation<ReportingObligationDetails>> violations = validator.validate(reportingObligationDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly("{noc.reportingObligationDetails.energyResponsibilityType.complianceRouteDistribution}");
    }

}