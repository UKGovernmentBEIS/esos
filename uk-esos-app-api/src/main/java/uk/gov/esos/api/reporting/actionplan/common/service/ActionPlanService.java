package uk.gov.esos.api.reporting.actionplan.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.reporting.actionplan.common.domain.ActionPlanContainer;
import uk.gov.esos.api.reporting.actionplan.common.domain.ActionPlanEntity;
import uk.gov.esos.api.reporting.actionplan.common.domain.ActionPlanSubmitParams;
import uk.gov.esos.api.reporting.actionplan.common.repository.ActionPlanRepository;
import uk.gov.esos.api.reporting.actionplan.common.util.ActionPlanIdentifierGenerator;
import uk.gov.esos.api.reporting.actionplan.common.validation.ActionPlanValidatorService;
import uk.gov.esos.api.reporting.common.domain.Phase;

@Service
@RequiredArgsConstructor
public class ActionPlanService {

    private final ActionPlanRepository actionPlanRepository;
    private final ActionPlanValidatorService actionPlanValidatorService ;

    @Transactional
    public void submitActionPlan(ActionPlanSubmitParams actionPlanSubmitParams) {
        ActionPlanContainer actionPlanContainer = actionPlanSubmitParams.getActionPlanContainer();
        Long accountId = actionPlanSubmitParams.getAccountId();
        Phase phase = actionPlanContainer.getPhase();

        actionPlanValidatorService .validate(actionPlanContainer);

        ActionPlanEntity actionPlanEntity = ActionPlanEntity.builder()
                .id(ActionPlanIdentifierGenerator.generate(accountId, phase))
                .actionPlanContainer(actionPlanContainer)
                .accountId(accountId)
                .phase(phase)
                .build();

        actionPlanRepository.save(actionPlanEntity);
    }
}
