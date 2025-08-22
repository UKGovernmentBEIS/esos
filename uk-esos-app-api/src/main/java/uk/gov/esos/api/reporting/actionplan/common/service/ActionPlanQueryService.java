package uk.gov.esos.api.reporting.actionplan.common.service;

import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.reporting.actionplan.common.domain.ActionPlanEntity;
import uk.gov.esos.api.reporting.actionplan.common.repository.ActionPlanRepository;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanP3;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanP3Container;

@Service
@RequiredArgsConstructor
public class ActionPlanQueryService {

    private final ActionPlanRepository actionPlanRepository;

    public ActionPlanP3 getActionPlanP3ByAccountId(Long accountId){
        ActionPlanEntity actionPlanEntity = actionPlanRepository.findByAccountId(accountId)
                .orElseThrow(() -> new NotFoundException("Action plan not found for account ID: " + accountId));
        return ((ActionPlanP3Container) actionPlanEntity.getActionPlanContainer()).getActionPlan();
    }

}
