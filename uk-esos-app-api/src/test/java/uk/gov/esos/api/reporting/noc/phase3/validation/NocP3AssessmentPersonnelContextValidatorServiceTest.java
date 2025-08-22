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
import uk.gov.esos.api.reporting.noc.phase3.domain.assessmentpersonnel.AssessmentPersonnel;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NocP3AssessmentPersonnelContextValidatorServiceTest {

    @InjectMocks
    private NocP3AssessmentPersonnelContextValidatorService contextValidator;

    @Mock
    private NocSectionConstraintValidatorService<AssessmentPersonnel> nocSectionConstraintValidatorService;

    @Test
    void validate() {
        final AssessmentPersonnel assessmentPersonnel = AssessmentPersonnel.builder().personnel(List.of()).build();
        final NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder().assessmentPersonnel(assessmentPersonnel).build())
                .build();

        when(nocSectionConstraintValidatorService.validate(assessmentPersonnel)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator
                .validate(nocContainer, ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(assessmentPersonnel);
    }

    @Test
    void validate_not_valid_for_category() {
        final AssessmentPersonnel assessmentPersonnel = AssessmentPersonnel.builder().personnel(List.of()).build();
        final NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder().assessmentPersonnel(assessmentPersonnel).build())
                .build();

        // Invoke
        NocValidationResult result = contextValidator
                .validate(nocContainer, ReportingObligationCategory.ZERO_ENERGY);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_SECTION.getMessage());
        assertThat(result.getNocViolations()).extracting(NocViolation::getSectionName)
                .containsOnly(AssessmentPersonnel.class.getName());

        verifyNoInteractions(nocSectionConstraintValidatorService);
    }

    @Test
    void getApplicableReportingObligationCategories() {
        assertThat(contextValidator.getApplicableReportingObligationCategories(null)).containsExactlyInAnyOrder(
                ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100,
                ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE,
                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS,
                ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR,
                ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100
        );
    }
}
