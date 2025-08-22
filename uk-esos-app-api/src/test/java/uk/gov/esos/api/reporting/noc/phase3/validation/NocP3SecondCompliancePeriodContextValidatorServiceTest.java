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
import uk.gov.esos.api.reporting.noc.phase3.domain.secondcomplianceperiod.SecondCompliancePeriod;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NocP3SecondCompliancePeriodContextValidatorServiceTest {

	@InjectMocks
    private NocP3SecondCompliancePeriodContextValidatorService contextValidator;

    @Mock
    private NocSectionConstraintValidatorService<SecondCompliancePeriod> nocSectionConstraintValidatorService;

    @Test
    void validate() {
        final SecondCompliancePeriod secondCompliancePeriod = SecondCompliancePeriod.builder().informationExists(OptionalQuestion.NO).build();
        final NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder().secondCompliancePeriod(secondCompliancePeriod).build())
                .build();

        when(nocSectionConstraintValidatorService.validate(secondCompliancePeriod)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator
                .validate(nocContainer, ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(secondCompliancePeriod);
    }

    @Test
    void validate_not_valid_for_category() {
        final SecondCompliancePeriod secondCompliancePeriod = SecondCompliancePeriod.builder().informationExists(OptionalQuestion.NO).build();
        final NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder().secondCompliancePeriod(secondCompliancePeriod).build())
                .build();

        // Invoke
        NocValidationResult result = contextValidator
                .validate(nocContainer, ReportingObligationCategory.NOT_QUALIFY);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_SECTION.getMessage());
        assertThat(result.getNocViolations()).extracting(NocViolation::getSectionName)
                .containsOnly(SecondCompliancePeriod.class.getName());

        verifyNoInteractions(nocSectionConstraintValidatorService);
    }

    @Test
    void validate_invalid_section_data() {
        final SecondCompliancePeriod secondCompliancePeriod = SecondCompliancePeriod.builder().informationExists(OptionalQuestion.NO).build();
        final NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder().secondCompliancePeriod(secondCompliancePeriod).build())
                .build();
        final NocViolation nocViolation = new NocViolation(SecondCompliancePeriod.class.getName(), NocViolation.NocViolationMessage.INVALID_SECTION_DATA);

        when(nocSectionConstraintValidatorService.validate(secondCompliancePeriod)).thenReturn(Optional.of(nocViolation));

        // Invoke
        NocValidationResult result = contextValidator.validate(nocContainer, ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
            .containsOnly(NocViolation.NocViolationMessage.INVALID_SECTION_DATA.getMessage());
        assertThat(result.getNocViolations()).extracting(NocViolation::getSectionName)
            .containsOnly(SecondCompliancePeriod.class.getName());

        verify(nocSectionConstraintValidatorService, times(1)).validate(secondCompliancePeriod);
    }

    @Test
    void getApplicableReportingObligationCategories() {
        assertThat(contextValidator.getApplicableReportingObligationCategories(null))
        	.containsExactlyInAnyOrderElementsOf(ReportingObligationCategory.getQualifyCategories()
        );
    }
}
