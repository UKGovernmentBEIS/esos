package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.leadassessor.LeadAssessor;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NocP3LeadAssessorContextValidatorServiceTest {

	@InjectMocks
    private NocP3LeadAssessorContextValidatorService contextValidator;

    @Mock
    private NocSectionConstraintValidatorService<LeadAssessor> nocSectionConstraintValidatorService;

    @Test
    void validate() {
        final LeadAssessor leadAssessor = LeadAssessor.builder()
            .hasLeadAssessorConfirmation(Boolean.FALSE)
            .build();
        final NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder().leadAssessor(leadAssessor).build())
                .build();

        when(nocSectionConstraintValidatorService.validate(leadAssessor)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator
                .validate(nocContainer, ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(leadAssessor);
    }

    @Test
    void validate_not_valid_for_category() {
        final LeadAssessor leadAssessor = LeadAssessor.builder()
            .hasLeadAssessorConfirmation(Boolean.FALSE)
            .build();
        final NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder().leadAssessor(leadAssessor).build())
                .build();

        // Invoke
        NocValidationResult result = contextValidator
                .validate(nocContainer, ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_SECTION.getMessage());
        assertThat(result.getNocViolations()).extracting(NocViolation::getSectionName)
                .containsOnly(LeadAssessor.class.getName());

        verifyNoInteractions(nocSectionConstraintValidatorService);
    }

    @Test
    void validate_invalid_section_data() {
        final LeadAssessor leadAssessor = LeadAssessor.builder()
        		.hasLeadAssessorConfirmation(Boolean.FALSE)
                .build();
        final NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder().leadAssessor(leadAssessor).build())
                .build();
        final NocViolation nocViolation = new NocViolation(LeadAssessor.class.getName(), NocViolation.NocViolationMessage.INVALID_SECTION_DATA);

        when(nocSectionConstraintValidatorService.validate(leadAssessor)).thenReturn(Optional.of(nocViolation));

        // Invoke
        NocValidationResult result = contextValidator.validate(nocContainer, ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
            .containsOnly(NocViolation.NocViolationMessage.INVALID_SECTION_DATA.getMessage());
        assertThat(result.getNocViolations()).extracting(NocViolation::getSectionName)
            .containsOnly(LeadAssessor.class.getName());

        verify(nocSectionConstraintValidatorService, times(1)).validate(leadAssessor);
    }

    @Test
    void getApplicableReportingObligationCategories() {
        assertThat(contextValidator.getApplicableReportingObligationCategories(null)).containsExactlyInAnyOrder(
                ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100,
                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS,
                ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100
        );
    }
}
