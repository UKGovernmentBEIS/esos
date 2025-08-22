package uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class ReportingObligationTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_when_qualify_valid() {
        ReportingObligation reportingObligation = ReportingObligation.builder()
            .qualificationType(OrganisationQualificationType.QUALIFY)
            .reportingObligationDetails(ReportingObligationDetails.builder()
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
                .build())
            .build();

        final Set<ConstraintViolation<ReportingObligation>> violations = validator.validate(reportingObligation);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_when_no_qualify_valid() {
        ReportingObligation reportingObligation = ReportingObligation.builder()
            .qualificationType(OrganisationQualificationType.NOT_QUALIFY)
            .noQualificationReason("not qualified")
            .build();

        final Set<ConstraintViolation<ReportingObligation>> violations = validator.validate(reportingObligation);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_when_qualify_invalid() {
        ReportingObligation reportingObligation = ReportingObligation.builder()
            .qualificationType(OrganisationQualificationType.QUALIFY)
            .build();

        final Set<ConstraintViolation<ReportingObligation>> violations = validator.validate(reportingObligation);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly("{noc.reportingObligation.qualificationType.details}");
    }

    @Test
    void validate_when_no_qualify_invalid() {
        ReportingObligation reportingObligation = ReportingObligation.builder()
            .qualificationType(OrganisationQualificationType.NOT_QUALIFY)
            .build();

        final Set<ConstraintViolation<ReportingObligation>> violations = validator.validate(reportingObligation);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly("{noc.reportingObligation.qualificationType.noQualificationReason}");
    }

}