package uk.gov.esos.api.reporting.actionplan.common.validation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.reporting.actionplan.common.domain.ActionPlanContainer;
import uk.gov.esos.api.reporting.common.domain.Phase;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActionPlanValidatorService {

    private final List<ActionPlanPhaseValidatorService<? extends ActionPlanContainer>> actionPlanPhaseValidatorServices;

    @SuppressWarnings("unchecked")
    public void validate(ActionPlanContainer actionPlanContainer ) {
        Phase phase = actionPlanContainer .getPhase();
        getValidatorService(phase).validate(actionPlanContainer );
    }

    private ActionPlanPhaseValidatorService getValidatorService(Phase phase) {
        return actionPlanPhaseValidatorServices.stream()
                .filter(apPhaseValidatorService -> phase.equals(apPhaseValidatorService.getPhase()))
                .findFirst()
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "No suitable validator found"));
    }
}
