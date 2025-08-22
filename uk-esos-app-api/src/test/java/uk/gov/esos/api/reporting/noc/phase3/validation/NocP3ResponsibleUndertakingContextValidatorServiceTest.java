package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountValidationService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ResponsibleUndertaking;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ReviewOrganisationDetails;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NocP3ResponsibleUndertakingContextValidatorServiceTest {

    @InjectMocks
    private NocP3ResponsibleUndertakingContextValidatorService contextValidator;

    @Mock
    private NocSectionConstraintValidatorService<ResponsibleUndertaking> nocSectionConstraintValidatorService;

    @Mock
    private OrganisationAccountValidationService organisationAccountValidationService;

    @Test
    void validate_section_is_valid() {
        String registrationNumber = "registrationNumber";
        ResponsibleUndertaking responsibleUndertaking = ResponsibleUndertaking.builder()
            .organisationDetails(ReviewOrganisationDetails.builder().registrationNumber(registrationNumber).build())
            .build();
        NocP3 noc = NocP3.builder().responsibleUndertaking(responsibleUndertaking).build();
        NocP3Container nocContainer = NocP3Container.builder().noc(noc).build();
        ReportingObligationCategory reportingObligationCategory = ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100;

        when(nocSectionConstraintValidatorService.validate(responsibleUndertaking)).thenReturn(Optional.empty());

        NocValidationResult result = contextValidator.validate(nocContainer, reportingObligationCategory);

        // Verify
        assertTrue(result.isValid());

        verify(nocSectionConstraintValidatorService, times(1)).validate(responsibleUndertaking);
        verify(organisationAccountValidationService, times(1)).validateCompanyExistence(registrationNumber);
    }

    @Test
    void validate_section_invalid_registration_number_not_found() {
        String registrationNumber = "registrationNumber";
        ResponsibleUndertaking responsibleUndertaking = ResponsibleUndertaking.builder()
            .organisationDetails(ReviewOrganisationDetails.builder().registrationNumber(registrationNumber).build())
            .build();
        NocP3 noc = NocP3.builder().responsibleUndertaking(responsibleUndertaking).build();
        NocP3Container nocContainer = NocP3Container.builder().noc(noc).build();
        ReportingObligationCategory reportingObligationCategory = ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100;

        when(nocSectionConstraintValidatorService.validate(responsibleUndertaking)).thenReturn(Optional.empty());
        doThrow(new BusinessException(ErrorCode.RESOURCE_NOT_FOUND))
            .when(organisationAccountValidationService).validateCompanyExistence(registrationNumber);

        // Invoke
        NocValidationResult result = contextValidator.validate(nocContainer, reportingObligationCategory);

        // Verify
        assertFalse(result.isValid());
        List<NocViolation> resultViolations = result.getNocViolations();

        assertThat(resultViolations).extracting(NocViolation::getMessage)
            .containsOnly(NocViolation.NocViolationMessage.INVALID_REGISTRATION_NUMBER.getMessage());
        assertThat(resultViolations).extracting(NocViolation::getSectionName)
            .containsOnly(ResponsibleUndertaking.class.getName());

        verify(nocSectionConstraintValidatorService, times(1)).validate(responsibleUndertaking);
        verify(organisationAccountValidationService, times(1)).validateCompanyExistence(registrationNumber);
    }

    @Test
    void validate_section_invalid_registration_number_can_not_be_verified() {
        String registrationNumber = "registrationNumber";
        ResponsibleUndertaking responsibleUndertaking = ResponsibleUndertaking.builder()
            .organisationDetails(ReviewOrganisationDetails.builder().registrationNumber(registrationNumber).build())
            .build();
        NocP3 noc = NocP3.builder().responsibleUndertaking(responsibleUndertaking).build();
        NocP3Container nocContainer = NocP3Container.builder().noc(noc).build();
        ReportingObligationCategory reportingObligationCategory = ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100;

        when(nocSectionConstraintValidatorService.validate(responsibleUndertaking)).thenReturn(Optional.empty());
        doThrow(new BusinessException(ErrorCode.UNAVAILABLE_CH_API))
            .when(organisationAccountValidationService).validateCompanyExistence(registrationNumber);

        // Invoke
        BusinessException ex = assertThrows(BusinessException.class,
            () -> contextValidator.validate(nocContainer, reportingObligationCategory));

        // Verify
        assertEquals(ErrorCode.UNAVAILABLE_CH_API, ex.getErrorCode());

        verify(nocSectionConstraintValidatorService, times(1)).validate(responsibleUndertaking);
        verify(organisationAccountValidationService, times(1)).validateCompanyExistence(registrationNumber);
    }

    @Test
    void validate_section_should_not_exist() {
        NocP3 noc = NocP3.builder().build();
        NocP3Container nocContainer = NocP3Container.builder().noc(noc).build();
        ReportingObligationCategory reportingObligationCategory = ReportingObligationCategory.NOT_QUALIFY;

        NocValidationResult result = contextValidator.validate(nocContainer, reportingObligationCategory);

        // Verify
        assertTrue(result.isValid());
        verifyNoInteractions(nocSectionConstraintValidatorService, organisationAccountValidationService);
    }

    @Test
    void validate_section_should_not_exist_but_exists() {
        ResponsibleUndertaking responsibleUndertaking = ResponsibleUndertaking.builder().build();
        NocP3 noc = NocP3.builder().responsibleUndertaking(responsibleUndertaking).build();
        NocP3Container nocContainer = NocP3Container.builder().noc(noc).build();
        ReportingObligationCategory reportingObligationCategory = ReportingObligationCategory.NOT_QUALIFY;

        NocValidationResult result = contextValidator.validate(nocContainer, reportingObligationCategory);

        // Verify
        assertFalse(result.isValid());
        List<NocViolation> resultViolations = result.getNocViolations();

        assertThat(resultViolations).extracting(NocViolation::getMessage)
            .containsOnly(NocViolation.NocViolationMessage.INVALID_SECTION.getMessage());
        assertThat(resultViolations).extracting(NocViolation::getSectionName)
                .containsOnly(ResponsibleUndertaking.class.getName());

        verifyNoInteractions(nocSectionConstraintValidatorService, organisationAccountValidationService);
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