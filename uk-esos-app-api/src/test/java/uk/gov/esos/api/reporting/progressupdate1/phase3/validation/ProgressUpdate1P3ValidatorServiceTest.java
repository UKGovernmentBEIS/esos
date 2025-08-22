package uk.gov.esos.api.reporting.progressupdate1.phase3.validation;


import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountQueryService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.reporting.progressupdate.common.domain.GroupChange;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3AddedMeasure;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3Container;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3MeasuresUpdate;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.validation.ProgressUpdate1P3ValidatorService;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflowperiod.service.WorkFlowValidPeriodService;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate1P3ValidatorServiceTest {

    @Mock
    private WorkFlowValidPeriodService workFlowValidPeriodService;

    @Mock
    private Validator validator;

    @Mock
    private OrganisationAccountQueryService queryService;

    @InjectMocks
    private ProgressUpdate1P3ValidatorService service;

    private Long accountId = 1L;

    @Test
    void testValidate_ValidSubmissionDateAndNoViolations() {

        OrganisationAccountDTO dto = OrganisationAccountDTO.builder().registrationNumber("1235").name("org").build();

        // Arrange
        ProgressUpdate1P3Container container = ProgressUpdate1P3Container.builder()
                        .progressUpdate1P3(ProgressUpdate1P3.builder().groupChange(GroupChange.builder().otherResponsibleUndertakingCrn("123").build()).build()).build();

        ProgressUpdate1P3AddedMeasure addedMeasure = ProgressUpdate1P3AddedMeasure.builder().measureName("name").build();

        ProgressUpdate1P3MeasuresUpdate measuresUpdate = ProgressUpdate1P3MeasuresUpdate.builder().progressUpdate1P3AddedMeasure(List.of(addedMeasure)).build();

        container.getProgressUpdate1P3().setProgressUpdate1P3MeasuresUpdate(measuresUpdate);
        container.getProgressUpdate1P3().getProgressUpdate1P3MeasuresUpdate().setProgressUpdate1P3AddedMeasure(List.of(addedMeasure));

        when(queryService.getOrganisationAccountDTOById(1L)).thenReturn(dto);

        when(workFlowValidPeriodService.isValidSubmitDate(RequestType.PROGRESS_UPDATE_1_P3)).thenReturn(true);

        when(validator.validate(container)).thenReturn(Collections.emptySet());  // No validation errors

        service.validate(container, accountId, true);

        verify(workFlowValidPeriodService, times(1)).isValidSubmitDate(RequestType.PROGRESS_UPDATE_1_P3);
        verify(validator, times(1)).validate(container);
    }

    @Test
    void testValidate_InvalidSubmissionDate() {
        ProgressUpdate1P3Container container = mock(ProgressUpdate1P3Container.class);

        when(workFlowValidPeriodService.isValidSubmitDate(RequestType.PROGRESS_UPDATE_1_P3)).thenReturn(false);  // Invalid submission date

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            service.validate(container, accountId, false);
        });

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.PROGRESS_UPDATE_INVALID_SUBMIT_DATE);
        verify(workFlowValidPeriodService, times(1)).isValidSubmitDate(RequestType.PROGRESS_UPDATE_1_P3);
        verify(validator, never()).validate(any());  // Validator should not be called if the submission date is invalid
    }

    @Test
    void testValidate_WithValidationErrors() {
        OrganisationAccountDTO dto = OrganisationAccountDTO.builder().registrationNumber("1235").name("org").build();

        ProgressUpdate1P3Container container = ProgressUpdate1P3Container.builder()
                .progressUpdate1P3(ProgressUpdate1P3.builder().groupChange(GroupChange.builder().otherResponsibleUndertakingCrn("123").build()).build()).build();

        when(workFlowValidPeriodService.isValidSubmitDate(RequestType.PROGRESS_UPDATE_1_P3)).thenReturn(true);

        Set<ConstraintViolation<ProgressUpdate1P3Container>> violations = new HashSet<>();
        ConstraintViolation<ProgressUpdate1P3Container> violation = mock(ConstraintViolation.class);
        violations.add(violation);

        when(validator.validate(container)).thenReturn(violations);  // Return validation errors

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            service.validate(container, accountId, false);
        });

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.INVALID_PROGRESS_UPDATE_1);
        verify(workFlowValidPeriodService, times(1)).isValidSubmitDate(RequestType.PROGRESS_UPDATE_1_P3);
        verify(validator, times(1)).validate(container);
    }

    @Test
    void testValidate_ValidGroupChangeCrn() {
        OrganisationAccountDTO dto = OrganisationAccountDTO.builder().registrationNumber("1235").name("org").build();

        // Arrange
        ProgressUpdate1P3Container container = ProgressUpdate1P3Container.builder()
                .progressUpdate1P3(ProgressUpdate1P3.builder().groupChange(GroupChange.builder().otherResponsibleUndertakingCrn("123").build()).build()).build();

        ProgressUpdate1P3AddedMeasure addedMeasure = ProgressUpdate1P3AddedMeasure.builder().measureName("name").build();

        ProgressUpdate1P3MeasuresUpdate measuresUpdate = ProgressUpdate1P3MeasuresUpdate.builder().progressUpdate1P3AddedMeasure(List.of(addedMeasure)).build();

        container.getProgressUpdate1P3().setProgressUpdate1P3MeasuresUpdate(measuresUpdate);
        container.getProgressUpdate1P3().getProgressUpdate1P3MeasuresUpdate().setProgressUpdate1P3AddedMeasure(List.of(addedMeasure));

        when(queryService.getOrganisationAccountDTOById(1L)).thenReturn(dto);

        when(workFlowValidPeriodService.isValidSubmitDate(RequestType.PROGRESS_UPDATE_1_P3)).thenReturn(true);

        when(validator.validate(container)).thenReturn(Collections.emptySet());  // No validation errors

        service.validate(container, accountId, true);

        verify(workFlowValidPeriodService, times(1)).isValidSubmitDate(RequestType.PROGRESS_UPDATE_1_P3);
        verify(validator, times(1)).validate(container);
    }

    @Test
    void testValidate_In_ValidGroupChangeCrn() {
        OrganisationAccountDTO dto = OrganisationAccountDTO.builder().registrationNumber("123").name("org").build();

        // Arrange
        ProgressUpdate1P3Container container = ProgressUpdate1P3Container.builder()
                .progressUpdate1P3(ProgressUpdate1P3.builder().groupChange(GroupChange.builder().otherResponsibleUndertakingCrn("123").build()).build()).build();

        ProgressUpdate1P3AddedMeasure addedMeasure = ProgressUpdate1P3AddedMeasure.builder().measureName("name").build();

        ProgressUpdate1P3MeasuresUpdate measuresUpdate = ProgressUpdate1P3MeasuresUpdate.builder().progressUpdate1P3AddedMeasure(List.of(addedMeasure)).build();

        container.getProgressUpdate1P3().setProgressUpdate1P3MeasuresUpdate(measuresUpdate);
        container.getProgressUpdate1P3().getProgressUpdate1P3MeasuresUpdate().setProgressUpdate1P3AddedMeasure(List.of(addedMeasure));

        when(queryService.getOrganisationAccountDTOById(1L)).thenReturn(dto);

        when(workFlowValidPeriodService.isValidSubmitDate(RequestType.PROGRESS_UPDATE_1_P3)).thenReturn(true);

        when(queryService.getOrganisationAccountDTOById(1L)).thenReturn(dto);


        BusinessException exception = assertThrows(BusinessException.class, () -> {
            service.validate(container, accountId, true);
        });

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.INVALID_PROGRESS_UPDATE_1);

        verify(workFlowValidPeriodService, times(1)).isValidSubmitDate(RequestType.PROGRESS_UPDATE_1_P3);

    }

    @Test
    void testValidate_ValidGroupChangeOrgName() {
        OrganisationAccountDTO dto = OrganisationAccountDTO.builder().registrationNumber("1235").name("org").build();

        // Arrange
        ProgressUpdate1P3Container container = ProgressUpdate1P3Container.builder()
                .progressUpdate1P3(ProgressUpdate1P3.builder().groupChange(GroupChange.builder().otherResponsibleUndertakingName("other name").build()).build()).build();

        ProgressUpdate1P3AddedMeasure addedMeasure = ProgressUpdate1P3AddedMeasure.builder().measureName("name").build();

        ProgressUpdate1P3MeasuresUpdate measuresUpdate = ProgressUpdate1P3MeasuresUpdate.builder().progressUpdate1P3AddedMeasure(List.of(addedMeasure)).build();

        container.getProgressUpdate1P3().setProgressUpdate1P3MeasuresUpdate(measuresUpdate);
        container.getProgressUpdate1P3().getProgressUpdate1P3MeasuresUpdate().setProgressUpdate1P3AddedMeasure(List.of(addedMeasure));

        when(queryService.getOrganisationAccountDTOById(1L)).thenReturn(dto);

        when(workFlowValidPeriodService.isValidSubmitDate(RequestType.PROGRESS_UPDATE_1_P3)).thenReturn(true);

        when(validator.validate(container)).thenReturn(Collections.emptySet());  // No validation errors

        service.validate(container, accountId, true);

        verify(workFlowValidPeriodService, times(1)).isValidSubmitDate(RequestType.PROGRESS_UPDATE_1_P3);
        verify(validator, times(1)).validate(container);
    }

    @Test
    void testValidate_In_ValidGroupChangeOrgName() {
        OrganisationAccountDTO dto = OrganisationAccountDTO.builder().registrationNumber("123").name("org").build();

        // Arrange
        ProgressUpdate1P3Container container = ProgressUpdate1P3Container.builder()
                .progressUpdate1P3(ProgressUpdate1P3.builder().groupChange(GroupChange.builder().otherResponsibleUndertakingName("org").build()).build()).build();

        when(workFlowValidPeriodService.isValidSubmitDate(RequestType.PROGRESS_UPDATE_1_P3)).thenReturn(true);

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            service.validate(container, accountId, false);
        });

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.INVALID_PROGRESS_UPDATE_1);

        verify(workFlowValidPeriodService, times(1)).isValidSubmitDate(RequestType.PROGRESS_UPDATE_1_P3);

    }

}