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
import uk.gov.esos.api.reporting.noc.phase3.domain.OptionalQuestion;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.firstcomplianceperiod.FirstCompliancePeriod;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NocP3FirstCompliancePeriodContextValidatorServiceTest {

	@InjectMocks
    private NocP3FirstCompliancePeriodContextValidatorService contextValidator;

    @Mock
    private NocSectionConstraintValidatorService<FirstCompliancePeriod> nocSectionConstraintValidatorService;

    @Test
    void validate() {
        final FirstCompliancePeriod firstCompliancePeriod = FirstCompliancePeriod.builder()
            .informationExists(OptionalQuestion.NO)
            .build();
        final NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder()
                        .firstCompliancePeriod(firstCompliancePeriod)
                        .build())
                .build();

        when(nocSectionConstraintValidatorService.validate(firstCompliancePeriod)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator
                .validate(nocContainer, ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(firstCompliancePeriod);
    }

    @Test
    void validate_not_valid_for_category() {
        final FirstCompliancePeriod firstCompliancePeriod = FirstCompliancePeriod.builder()
            .informationExists(OptionalQuestion.NO)
            .build();
        final NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder()
                		.firstCompliancePeriod(FirstCompliancePeriod.builder()
                                .informationExists(OptionalQuestion.NO)
                                .build())
                        .build())
                .build();

        // Invoke
        NocValidationResult result = contextValidator
                .validate(nocContainer, ReportingObligationCategory.NOT_QUALIFY);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_SECTION.getMessage());
        assertThat(result.getNocViolations()).extracting(NocViolation::getSectionName)
                .containsOnly(FirstCompliancePeriod.class.getName());

        verifyNoInteractions(nocSectionConstraintValidatorService);
    }

    @Test
    void validate_invalid_section_data() {
        final FirstCompliancePeriod firstCompliancePeriod = FirstCompliancePeriod.builder()
                .informationExists(OptionalQuestion.YES)
                .build();
        final NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder()
                        .firstCompliancePeriod(firstCompliancePeriod)
                        .build())
                .build();
        final NocViolation nocViolation = new NocViolation(FirstCompliancePeriod.class.getName(), NocViolation.NocViolationMessage.INVALID_SECTION_DATA);

        when(nocSectionConstraintValidatorService.validate(firstCompliancePeriod)).thenReturn(Optional.of(nocViolation));

        // Invoke
        NocValidationResult result = contextValidator.validate(nocContainer, ReportingObligationCategory.ZERO_ENERGY);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
            .containsOnly(NocViolation.NocViolationMessage.INVALID_SECTION_DATA.getMessage());
        assertThat(result.getNocViolations()).extracting(NocViolation::getSectionName)
            .containsOnly(FirstCompliancePeriod.class.getName());

        verify(nocSectionConstraintValidatorService, times(1)).validate(firstCompliancePeriod);
    }

    @Test
    void getApplicableReportingObligationCategories() {
        assertThat(contextValidator.getApplicableReportingObligationCategories(null))
        	.containsExactlyInAnyOrderElementsOf(ReportingObligationCategory.getQualifyCategories()
        );
    }
}
