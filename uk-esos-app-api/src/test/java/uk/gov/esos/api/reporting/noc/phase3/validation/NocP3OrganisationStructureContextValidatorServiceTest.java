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
import uk.gov.esos.api.reporting.noc.phase3.domain.organisationstructure.OrganisationStructure;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NocP3OrganisationStructureContextValidatorServiceTest {

	@InjectMocks
    private NocP3OrganisationStructureContextValidatorService contextValidator;

    @Mock
    private NocSectionConstraintValidatorService<OrganisationStructure> nocSectionConstraintValidatorService;

    @Test
    void validate() {
        final OrganisationStructure organisationStructure = OrganisationStructure.builder()
            .isHighestParent(Boolean.FALSE)
            .build();
        final NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder().organisationStructure(organisationStructure).build())
                .build();

        when(nocSectionConstraintValidatorService.validate(organisationStructure)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator
                .validate(nocContainer, ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(organisationStructure);
    }

    @Test
    void validate_not_valid_for_category() {
        final OrganisationStructure organisationStructure = OrganisationStructure.builder()
            .isHighestParent(Boolean.TRUE)
            .build();
        final NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder().organisationStructure(organisationStructure).build())
                .build();

        // Invoke
        NocValidationResult result = contextValidator
                .validate(nocContainer, ReportingObligationCategory.NOT_QUALIFY);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_SECTION.getMessage());
        assertThat(result.getNocViolations()).extracting(NocViolation::getSectionName)
                .containsOnly(OrganisationStructure.class.getName());

        verifyNoInteractions(nocSectionConstraintValidatorService);
    }

    @Test
    void validate_invalid_section_data() {
        final OrganisationStructure organisationStructure = OrganisationStructure.builder()
        		.isHighestParent(Boolean.FALSE)
                .build();
        final NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder()
                        .organisationStructure(organisationStructure)
                        .build())
                .build();

        final NocViolation nocViolation = new NocViolation(OrganisationStructure.class.getName(), NocViolation.NocViolationMessage.INVALID_SECTION_DATA);

        when(nocSectionConstraintValidatorService.validate(organisationStructure)).thenReturn(Optional.of(nocViolation));

        // Invoke
        NocValidationResult result = contextValidator.validate(nocContainer, ReportingObligationCategory.ZERO_ENERGY);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
            .containsOnly(NocViolation.NocViolationMessage.INVALID_SECTION_DATA.getMessage());
        assertThat(result.getNocViolations()).extracting(NocViolation::getSectionName)
            .containsOnly(OrganisationStructure.class.getName());

        verify(nocSectionConstraintValidatorService, times(1)).validate(organisationStructure);
    }

    @Test
    void getApplicableReportingObligationCategories() {
        assertThat(contextValidator.getApplicableReportingObligationCategories(null))
        	.containsExactlyInAnyOrderElementsOf(ReportingObligationCategory.getQualifyCategories()
        );
    }
}
