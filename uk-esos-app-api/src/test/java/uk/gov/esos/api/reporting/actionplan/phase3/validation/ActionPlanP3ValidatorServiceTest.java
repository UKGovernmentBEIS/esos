package uk.gov.esos.api.reporting.actionplan.phase3.validation;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanP3Container;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflowperiod.service.WorkFlowValidPeriodService;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ActionPlanP3ValidatorServiceTest {

    @Mock
    private WorkFlowValidPeriodService workFlowValidPeriodService;

    @Mock
    private Validator validator;

    @InjectMocks
    private ActionPlanP3ValidatorService actionPlanP3ValidatorService;

    @Test
    public void testValidate_ValidSubmissionDateAndNoViolations() {
        // Arrange
        ActionPlanP3Container actionPlanContainer = mock(ActionPlanP3Container.class);

        when(workFlowValidPeriodService.isValidSubmitDate(RequestType.ACTION_PLAN_P3)).thenReturn(true);

//        when(actionPlanContainer.getActionPlan()).thenReturn(actionPlanP3);
        when(validator.validate(actionPlanContainer)).thenReturn(Collections.emptySet());  // No validation errors

        actionPlanP3ValidatorService.validate(actionPlanContainer);

        verify(workFlowValidPeriodService, times(1)).isValidSubmitDate(RequestType.ACTION_PLAN_P3);
        verify(validator, times(1)).validate(actionPlanContainer);
    }


    @Test
    public void testValidate_InvalidSubmissionDate() {
        ActionPlanP3Container actionPlanContainer = mock(ActionPlanP3Container.class);

        when(workFlowValidPeriodService.isValidSubmitDate(RequestType.ACTION_PLAN_P3)).thenReturn(false);  // Invalid submission date

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            actionPlanP3ValidatorService.validate(actionPlanContainer);
        });

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.ACTION_PLAN_INVALID_SUBMIT_DATE);
        verify(workFlowValidPeriodService, times(1)).isValidSubmitDate(RequestType.ACTION_PLAN_P3);
        verify(validator, never()).validate(any());  // Validator should not be called if the submission date is invalid
    }

    @Test
    public void testValidate_WithValidationErrors() {
        ActionPlanP3Container actionPlanContainer = mock(ActionPlanP3Container.class);

        when(workFlowValidPeriodService.isValidSubmitDate(RequestType.ACTION_PLAN_P3)).thenReturn(true);  // Valid submission date

        Set<ConstraintViolation<ActionPlanP3Container>> violations = new HashSet<>();
        ConstraintViolation<ActionPlanP3Container> violation = mock(ConstraintViolation.class);
        violations.add(violation);

        when(validator.validate(actionPlanContainer)).thenReturn(violations);  // Return validation errors

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            actionPlanP3ValidatorService.validate(actionPlanContainer);
        });

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.INVALID_ACTION_PLAN);
        verify(workFlowValidPeriodService, times(1)).isValidSubmitDate(RequestType.ACTION_PLAN_P3);
        verify(validator, times(1)).validate(actionPlanContainer);
    }

}