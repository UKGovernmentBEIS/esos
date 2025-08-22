package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.ContactPerson;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.confirmations.Confirmations;
import uk.gov.esos.api.reporting.noc.phase3.domain.confirmations.NoEnergyResponsibilityAssessmentType;
import uk.gov.esos.api.reporting.noc.phase3.domain.confirmations.ResponsibilityAssessmentType;
import uk.gov.esos.api.reporting.noc.phase3.domain.leadassessor.LeadAssessor;
import uk.gov.esos.api.reporting.noc.phase3.domain.leadassessor.LeadAssessorType;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NocP3ConfirmationsContextValidatorServiceTest {

    @InjectMocks
    private NocP3ConfirmationsContextValidatorService contextValidator;

    @Mock
    private NocSectionConstraintValidatorService<Confirmations> nocSectionConstraintValidatorService;

    @Test
    void validate_ISO_50001_COVERING_ENERGY_USAGE_valid() {
        final Confirmations confirmations = Confirmations.builder()
            .responsibilityAssessmentTypes(Set.of(
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED
            ))
            .reviewAssessmentDate(LocalDate.of(2022, 1, 1))
            .responsibleOfficerDetails(ContactPerson.builder().firstName("FirstName").build())
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder().confirmations(confirmations).build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE;

        when(nocSectionConstraintValidatorService.validate(confirmations)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(confirmations);
    }

    @Test
    void validate_ISO_50001_COVERING_ENERGY_USAGE_not_valid() {
        final Confirmations confirmations = Confirmations.builder()
            .noEnergyResponsibilityAssessmentTypes(Set.of(
                NoEnergyResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME,
                NoEnergyResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME,
                NoEnergyResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED
            ))
            .secondResponsibleOfficerEnergyTypes(Set.of(

                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED
            ))
            .secondResponsibleOfficerDetails(ContactPerson.builder().firstName("FirstName").build())
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder().confirmations(confirmations).build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE;

        when(nocSectionConstraintValidatorService.validate(confirmations)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_RESPONSIBILITY_ASSESSMENT_TYPE_LIST.getMessage(),
                        NocViolation.NocViolationMessage.INVALID_NO_ENERGY_RESPONSIBILITY_ASSESSMENT_TYPE.getMessage(),
                        NocViolation.NocViolationMessage.INVALID_REVIEW_ASSESSMENT_DATE.getMessage(),
                        NocViolation.NocViolationMessage.INVALID_SECOND_RESPONSIBLE_OFFICER_DETAILS.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(confirmations);
    }

    @Test
    void validate_ZERO_ENERGY_valid() {
        final Confirmations confirmations = Confirmations.builder()
            .noEnergyResponsibilityAssessmentTypes(Set.of(
                NoEnergyResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME,
                NoEnergyResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME,
                NoEnergyResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON,
                NoEnergyResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED
            ))
            .responsibleOfficerDetails(ContactPerson.builder().firstName("FirstName").build())
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder().confirmations(confirmations).build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ZERO_ENERGY;

        when(nocSectionConstraintValidatorService.validate(confirmations)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(confirmations);
    }

    @Test
    void validate_ZERO_ENERGY_not_valid() {
        final Confirmations confirmations = Confirmations.builder()
            .responsibilityAssessmentTypes(Set.of(
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED
            ))
            .reviewAssessmentDate(LocalDate.of(2022, 1, 1))
            .secondResponsibleOfficerEnergyTypes(Set.of(
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED
            ))
            .secondResponsibleOfficerDetails(ContactPerson.builder().firstName("FirstName").build())
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder().confirmations(confirmations).build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ZERO_ENERGY;

        when(nocSectionConstraintValidatorService.validate(confirmations)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_NO_ENERGY_RESPONSIBILITY_ASSESSMENT_TYPE_LIST.getMessage(),
                        NocViolation.NocViolationMessage.INVALID_RESPONSIBILITY_ASSESSMENT_TYPE.getMessage(),
                        NocViolation.NocViolationMessage.INVALID_REVIEW_ASSESSMENT_DATE.getMessage(),
                        NocViolation.NocViolationMessage.INVALID_SECOND_RESPONSIBLE_OFFICER_DETAILS.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(confirmations);
    }

    @Test
    void validate_ZERO_ENERGY_not_valid_not_all_types_checked() {
        final Confirmations confirmations = Confirmations.builder()
            .noEnergyResponsibilityAssessmentTypes(Set.of(
                NoEnergyResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME,
                NoEnergyResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED
            ))
            .responsibleOfficerDetails(ContactPerson.builder().firstName("FirstName").build())
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder().confirmations(confirmations).build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ZERO_ENERGY;

        when(nocSectionConstraintValidatorService.validate(confirmations)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_NO_ENERGY_RESPONSIBILITY_ASSESSMENT_TYPE_LIST.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(confirmations);
    }

    @Test
    void validate_LESS_THAN_40000_KWH_PER_YEAR_valid() {
        final Confirmations confirmations = Confirmations.builder()
            .responsibilityAssessmentTypes(Set.of(
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED
            ))
            .reviewAssessmentDate(LocalDate.of(2022, 1, 1))
            .responsibleOfficerDetails(ContactPerson.builder().firstName("FirstName").build())
            .secondResponsibleOfficerEnergyTypes(Set.of(
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED
            ))
            .secondResponsibleOfficerDetails(ContactPerson.builder().firstName("FirstName").build())
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder().confirmations(confirmations).build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR;

        when(nocSectionConstraintValidatorService.validate(confirmations)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(confirmations);
    }

    @Test
    void validate_LESS_THAN_40000_KWH_PER_YEAR_not_valid() {
        final Confirmations confirmations = Confirmations.builder()
            .noEnergyResponsibilityAssessmentTypes(Set.of(
                NoEnergyResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME,
                NoEnergyResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME,
                NoEnergyResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON,
                NoEnergyResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED
            ))
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .confirmations(confirmations)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR;

        when(nocSectionConstraintValidatorService.validate(confirmations)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_RESPONSIBILITY_ASSESSMENT_TYPE_LIST.getMessage(),
                        NocViolation.NocViolationMessage.INVALID_NO_ENERGY_RESPONSIBILITY_ASSESSMENT_TYPE.getMessage(),
                        NocViolation.NocViolationMessage.INVALID_REVIEW_ASSESSMENT_DATE.getMessage(),
                        NocViolation.NocViolationMessage.INVALID_SECOND_RESPONSIBLE_OFFICER_DETAILS.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(confirmations);
    }

    @Test
    void validate_LESS_THAN_40000_KWH_PER_YEAR_valid_not_all_types_checked() {
        final Confirmations confirmations = Confirmations.builder()
            .responsibilityAssessmentTypes(Set.of(
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED
            ))
            .reviewAssessmentDate(LocalDate.of(2022, 1, 1))
            .responsibleOfficerDetails(ContactPerson.builder().firstName("FirstName").build())
            .secondResponsibleOfficerEnergyTypes(Set.of(
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED
            ))
            .secondResponsibleOfficerDetails(ContactPerson.builder().firstName("FirstName").build())
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .confirmations(confirmations)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR;

        when(nocSectionConstraintValidatorService.validate(confirmations)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_RESPONSIBILITY_ASSESSMENT_TYPE_LIST.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(confirmations);
    }

    @Test
    void validate_LESS_THAN_40000_KWH_PER_YEAR_valid_not_all_types_of_second_checked() {
        final Confirmations confirmations = Confirmations.builder()
            .responsibilityAssessmentTypes(Set.of(
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED
            ))
            .reviewAssessmentDate(LocalDate.of(2022, 1, 1))
            .responsibleOfficerDetails(ContactPerson.builder().firstName("FirstName").build())
            .secondResponsibleOfficerEnergyTypes(Set.of(
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED
            ))
            .secondResponsibleOfficerDetails(ContactPerson.builder().firstName("FirstName").build())
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .confirmations(confirmations)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR;

        when(nocSectionConstraintValidatorService.validate(confirmations)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_RESPONSIBILITY_ASSESSMENT_TYPE_LIST.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(confirmations);
    }

    @Test
    void validate_ESOS_ENERGY_ASSESSMENTS_95_TO_100_valid_for_internal() {
        final Confirmations confirmations = Confirmations.builder()
            .responsibilityAssessmentTypes(Set.of(
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED
            ))
            .reviewAssessmentDate(LocalDate.of(2022, 1, 1))
            .responsibleOfficerDetails(ContactPerson.builder().firstName("FirstName").build())
            .secondResponsibleOfficerEnergyTypes(Set.of(
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED
            ))
            .secondResponsibleOfficerDetails(ContactPerson.builder().firstName("FirstName").build())
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .leadAssessor(LeadAssessor.builder().leadAssessorType(LeadAssessorType.INTERNAL).build())
                        .confirmations(confirmations)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100;

        when(nocSectionConstraintValidatorService.validate(confirmations)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(confirmations);
    }

    @Test
    void validate_ESOS_ENERGY_ASSESSMENTS_95_TO_100_valid_for_external() {
        final Confirmations confirmations = Confirmations.builder()
            .responsibilityAssessmentTypes(Set.of(
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED
            ))
            .reviewAssessmentDate(LocalDate.of(2022, 1, 1))
            .responsibleOfficerDetails(ContactPerson.builder().firstName("FirstName").build())
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .leadAssessor(LeadAssessor.builder().leadAssessorType(LeadAssessorType.EXTERNAL).build())
                        .confirmations(confirmations)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100;

        when(nocSectionConstraintValidatorService.validate(confirmations)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(confirmations);
    }

    @Test
    void validate_ESOS_ENERGY_ASSESSMENTS_95_TO_100_not_valid() {
        final Confirmations confirmations = Confirmations.builder()
            .noEnergyResponsibilityAssessmentTypes(Set.of(
                NoEnergyResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME,
                NoEnergyResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME,
                NoEnergyResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON,
                NoEnergyResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED
            ))
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
                .noc(NocP3.builder()
                        .leadAssessor(LeadAssessor.builder().leadAssessorType(LeadAssessorType.INTERNAL).build())
                        .confirmations(confirmations)
                        .build())
                .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100;

        when(nocSectionConstraintValidatorService.validate(confirmations)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_RESPONSIBILITY_ASSESSMENT_TYPE_LIST.getMessage(),
                        NocViolation.NocViolationMessage.INVALID_NO_ENERGY_RESPONSIBILITY_ASSESSMENT_TYPE.getMessage(),
                        NocViolation.NocViolationMessage.INVALID_REVIEW_ASSESSMENT_DATE.getMessage(),
                        NocViolation.NocViolationMessage.INVALID_SECOND_RESPONSIBLE_OFFICER_DETAILS.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(confirmations);
    }

    @Test
    void validate_ESOS_ENERGY_ASSESSMENTS_95_TO_100_invalid_lead_accessor_data() {
        final Confirmations confirmations = Confirmations.builder()
            .responsibilityAssessmentTypes(Set.of(
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED
            ))
            .reviewAssessmentDate(LocalDate.of(2022, 1, 1))
            .responsibleOfficerDetails(ContactPerson.builder().firstName("FirstName").build())
            .secondResponsibleOfficerEnergyTypes(Set.of(
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON,
                ResponsibilityAssessmentType.SATISFIED_WITH_INFORMATION_PROVIDED
            ))
            .secondResponsibleOfficerDetails(ContactPerson.builder().firstName("FirstName").build())
            .build();
        final NocP3Container nocP3Container = NocP3Container.builder()
            .noc(NocP3.builder()
                .confirmations(confirmations)
                .build())
            .build();
        final ReportingObligationCategory category = ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100;

        when(nocSectionConstraintValidatorService.validate(confirmations)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator.validate(nocP3Container, category);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
            .containsOnly(NocViolation.NocViolationMessage.INVALID_DEPENDENT_SECTION_DATA.getMessage());

        verify(nocSectionConstraintValidatorService, times(1)).validate(confirmations);
    }

    @Test
    void getApplicableReportingObligationCategories() {
        assertThat(contextValidator.getApplicableReportingObligationCategories(null)).containsExactlyInAnyOrder(
                ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100,
                ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE,
                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS,
                ReportingObligationCategory.ZERO_ENERGY,
                ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR,
                ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100
        );
    }
}
