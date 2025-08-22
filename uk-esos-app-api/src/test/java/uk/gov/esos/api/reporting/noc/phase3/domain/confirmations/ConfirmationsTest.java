package uk.gov.esos.api.reporting.noc.phase3.domain.confirmations;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.domain.dto.PhoneNumberDTO;
import uk.gov.esos.api.reporting.noc.phase3.domain.ContactPerson;

import java.time.LocalDate;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class ConfirmationsTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_valid() {
        Confirmations energySavingsAchieved = Confirmations.builder()
                .responsibilityAssessmentTypes(Set.of(ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME))
                .responsibleOfficerDetails(buildContactPerson("job title", "email@email.com"))
                .reviewAssessmentDate(LocalDate.now().minusDays(5))
                .secondResponsibleOfficerEnergyTypes(Set.of(ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED))
                .secondResponsibleOfficerDetails(buildContactPerson("job title", "email2@email.com"))
                .build();

        final Set<ConstraintViolation<Confirmations>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_review_assessment_date_valid() {
        Confirmations energySavingsAchieved = Confirmations.builder()
                .responsibilityAssessmentTypes(Set.of(ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME))
                .responsibleOfficerDetails(buildContactPerson("job title", "email@email.com"))
                .reviewAssessmentDate(LocalDate.of(2019, 12, 6))
                .secondResponsibleOfficerEnergyTypes(Set.of(ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED))
                .secondResponsibleOfficerDetails(buildContactPerson("job title", "email2@email.com"))
                .build();

        final Set<ConstraintViolation<Confirmations>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_review_assessment_date_invalid() {
        Confirmations energySavingsAchieved = Confirmations.builder()
                .responsibilityAssessmentTypes(Set.of(ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME))
                .responsibleOfficerDetails(buildContactPerson("job title", "email@email.com"))
                .reviewAssessmentDate(LocalDate.of(2019, 12, 5))
                .secondResponsibleOfficerEnergyTypes(Set.of(ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED))
                .secondResponsibleOfficerDetails(buildContactPerson("job title", "email2@email.com"))
                .build();

        final Set<ConstraintViolation<Confirmations>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).isNotEmpty();
    }

    @Test
    void validate_null_job_title_invalid() {
        Confirmations energySavingsAchieved = Confirmations.builder()
                .responsibilityAssessmentTypes(Set.of(ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME))
                .responsibleOfficerDetails(buildContactPerson("job title", "email@email.com"))
                .reviewAssessmentDate(LocalDate.now().minusDays(5))
                .secondResponsibleOfficerEnergyTypes(Set.of(ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED))
                .secondResponsibleOfficerDetails(buildContactPerson(null, "email2@email.com"))
                .build();

        final Set<ConstraintViolation<Confirmations>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.confirmations.secondResponsibleOfficerDetails.jobtitle}");
    }

    @Test
    void validate_null_secondResponsibleOfficerDetails_valid() {
        Confirmations energySavingsAchieved = Confirmations.builder()
                .responsibilityAssessmentTypes(Set.of(ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME))
                .responsibleOfficerDetails(buildContactPerson("job title", "email@email.com"))
                .reviewAssessmentDate(LocalDate.now().minusDays(5))
                .build();

        final Set<ConstraintViolation<Confirmations>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_empty_job_title_invalid() {
        Confirmations energySavingsAchieved = Confirmations.builder()
                .responsibilityAssessmentTypes(Set.of(ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME))
                .responsibleOfficerDetails(buildContactPerson("job title", "email@email.com"))
                .reviewAssessmentDate(LocalDate.now().minusDays(5))
                .secondResponsibleOfficerEnergyTypes(Set.of(ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED))
                .secondResponsibleOfficerDetails(buildContactPerson(" ", "email2@email.com"))
                .build();

        final Set<ConstraintViolation<Confirmations>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.confirmations.secondResponsibleOfficerDetails.jobtitle}");
    }

    @Test
    void validate_same_email_invalid() {
        Confirmations energySavingsAchieved = Confirmations.builder()
                .responsibilityAssessmentTypes(Set.of(ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME))
                .responsibleOfficerDetails(buildContactPerson("job title", "email@email.com"))
                .reviewAssessmentDate(LocalDate.now().minusDays(5))
                .secondResponsibleOfficerEnergyTypes(Set.of(ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED))
                .secondResponsibleOfficerDetails(buildContactPerson("job title", "email@email.com"))
                .build();

        final Set<ConstraintViolation<Confirmations>> violations = validator.validate(energySavingsAchieved);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.confirmations.secondResponsibleOfficerDetails.email}");
    }

    private ContactPerson buildContactPerson(String jobTitle, String email) {
        return ContactPerson.builder()
                .firstName("first name")
                .lastName("last name")
                .jobTitle(jobTitle)
                .phoneNumber(PhoneNumberDTO.builder()
                        .countryCode("30")
                        .number("2102323231")
                        .build())
                .mobileNumber(PhoneNumberDTO.builder()
                        .countryCode("30")
                        .number("2102323231")
                        .build())
                .email(email)
                .address(CountyAddressDTO.builder()
                        .line1("line1")
                        .county("country")
                        .city("city")
                        .postcode("postcode")
                        .build())
                .build();
    }

}
