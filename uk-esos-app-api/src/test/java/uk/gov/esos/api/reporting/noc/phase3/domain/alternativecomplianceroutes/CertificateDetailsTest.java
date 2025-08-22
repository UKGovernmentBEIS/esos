package uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class CertificateDetailsTest {

	private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_when_all_certificate_details_are_null() {
        CertificateDetails certificateDetails = CertificateDetails.builder()
                .certificateNumber(null)
                .validFrom(null)
                .validUntil(null)
                .build();

        final Set<ConstraintViolation<CertificateDetails>> violations = validator.validate(certificateDetails);
        assertThat(violations).isEmpty();
    }

    @Test
    void validate_when_all_certificated_details_are_not_completed_invalid() {
        CertificateDetails certificateDetails = CertificateDetails.builder()
                .certificateNumber(null)
                .validFrom(LocalDate.of(2024, 4,22))
                .validUntil(LocalDate.now().plusDays(10))
                .build();

        final Set<ConstraintViolation<CertificateDetails>> violations = validator.validate(certificateDetails);
        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.alternativecomplianceroutes.certificate.details.completed}");
    }

    @Test
    void validate_when_validUntil_isAfter_validFrom_valid() {
    	CertificateDetails certificateDetails = CertificateDetails.builder()
    		.certificateNumber("test")
            .validFrom(LocalDate.of(2024, 4,22))
            .validUntil(LocalDate.now().plusDays(10))
            .build();

        final Set<ConstraintViolation<CertificateDetails>> violations = validator.validate(certificateDetails);
        
        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_when_validUntil_isBefore_validFrom_invalid() {
    	CertificateDetails certificateDetails = CertificateDetails.builder()
    			.certificateNumber("test")
                .validFrom(LocalDate.of(2024, 4,22))
                .validUntil(LocalDate.of(2024, 4,22).minusDays(10))
            .build();

        final Set<ConstraintViolation<CertificateDetails>> violations = validator.validate(certificateDetails);
        
        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
        	.containsExactly("{noc.alternativecomplianceroutes.certificate.date}");
    }

    @Test
    void validate_when_validUntil_isBefore_5_December_invalid() {
        CertificateDetails certificateDetails = CertificateDetails.builder()
                .certificateNumber("test")
                .validFrom(LocalDate.of(2023,4,26))
                .validUntil(LocalDate.of(2023, 11, 3))
                .build();

        final Set<ConstraintViolation<CertificateDetails>> violations = validator.validate(certificateDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.alternativecomplianceroutes.certificate.details.validUntil}");
    }

    @Test
    void validate_when_validFrom_isAfter_5_June_invalid() {
        CertificateDetails certificateDetails = CertificateDetails.builder()
                .certificateNumber("test")
                .validFrom(LocalDate.of(2024,7,20))
                .validUntil(LocalDate.of(2024, 11, 17))
                .build();

        final Set<ConstraintViolation<CertificateDetails>> violations = validator.validate(certificateDetails);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.alternativecomplianceroutes.certificate.details.validFrom}");
    }

    @Test
    void validate_when_validUntil_5_December_valid() {
        CertificateDetails certificateDetails = CertificateDetails.builder()
                .certificateNumber("test")
                .validFrom(LocalDate.of(2023,3,10))
                .validUntil(LocalDate.of(2023, 12, 5))
                .build();

        final Set<ConstraintViolation<CertificateDetails>> violations = validator.validate(certificateDetails);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_when_validFrom_5_June_valid() {
        CertificateDetails certificateDetails = CertificateDetails.builder()
                .certificateNumber("test")
                .validFrom(LocalDate.of(2024,6,5))
                .validUntil(LocalDate.of(2024, 12, 20))
                .build();

        final Set<ConstraintViolation<CertificateDetails>> violations = validator.validate(certificateDetails);

        assertThat(violations).isEmpty();
    }
}
