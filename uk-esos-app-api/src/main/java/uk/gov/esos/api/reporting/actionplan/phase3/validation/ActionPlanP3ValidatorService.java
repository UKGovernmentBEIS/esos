package uk.gov.esos.api.reporting.actionplan.phase3.validation;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.reporting.actionplan.common.domain.ActionPlanViolation;
import uk.gov.esos.api.reporting.actionplan.common.validation.ActionPlanPhaseValidatorService;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.*;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflowperiod.service.WorkFlowValidPeriodService;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Validated
@Service
@RequiredArgsConstructor
public class ActionPlanP3ValidatorService implements ActionPlanPhaseValidatorService<ActionPlanP3Container> {

    private final WorkFlowValidPeriodService workFlowValidPeriodService;
    private final Validator validator;


    /**
     *  Validates if Action Plan can be submitted
     * @param actionPlanContainer
     */
    @Override
    public void validate(@NotNull ActionPlanP3Container actionPlanContainer) {

        List<ActionPlanViolation> actionPlanViolations = new ArrayList<>();
        //validate the submission date
        if(!workFlowValidPeriodService.isValidSubmitDate(RequestType.ACTION_PLAN_P3)){
            throw new BusinessException(ErrorCode.ACTION_PLAN_INVALID_SUBMIT_DATE);
        }

        Set<ConstraintViolation<ActionPlanP3Container>> apValidations = validator.validate(actionPlanContainer);
        if (!apValidations.isEmpty()) {
            actionPlanViolations.add(getActionPlanViolation(ActionPlanP3.class.getName(), apValidations));
        }

        if(ObjectUtils.isNotEmpty(actionPlanViolations)) {
            throw new BusinessException(ErrorCode.INVALID_ACTION_PLAN, actionPlanViolations);
        }
    }

    @Override
    public Phase getPhase() {
        return Phase.PHASE_3;
    }

    private ActionPlanViolation getActionPlanViolation(String section, Set<ConstraintViolation<ActionPlanP3Container>> constraintViolations){
        return new ActionPlanViolation(
                section,
                ActionPlanViolation.ActionPlanViolationMessage.INVALID_SECTION_DATA,
                constructViolationData(constraintViolations));
    }

    /**
     *  Gathers all the violations messages to a list of string
     * @param constraintViolations
     * @return List<String>
     */
    private List<String> constructViolationData(Set<ConstraintViolation<ActionPlanP3Container>> constraintViolations) {
        List<String> violationData = new ArrayList<>();

        constraintViolations.forEach(constraintViolation ->
                violationData.add(String.format("%s - %s",constraintViolation.getPropertyPath(), constraintViolation.getMessage()))
        );

        return violationData;
    }

}
