package uk.gov.esos.api.reporting.actionplan.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.actionplan.common.domain.ActionPlanEntity;
import uk.gov.esos.api.reporting.actionplan.common.domain.ActionPlanSubmitParams;
import uk.gov.esos.api.reporting.actionplan.common.repository.ActionPlanRepository;
import uk.gov.esos.api.reporting.actionplan.common.validation.ActionPlanValidatorService;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanP3Container;
import uk.gov.esos.api.reporting.common.domain.Phase;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ActionPlanServiceTest {

    @InjectMocks
    private ActionPlanService actionPlanService;

    @Mock
    private ActionPlanRepository repository;

    @Mock
    private ActionPlanValidatorService validatorService;

    @Test
    void submitActionPlanTest() {
        Long accountId = 1L;
        Phase phase = Phase.PHASE_3;
        ActionPlanP3Container apContainer = ActionPlanP3Container.builder().phase(phase).build();
        ActionPlanSubmitParams actionPlanSubmitParams = ActionPlanSubmitParams.builder()
                .accountId(accountId)
                .actionPlanContainer(apContainer)
                .build();

        // Invoke
        actionPlanService.submitActionPlan(actionPlanSubmitParams);

        // Verify
        ArgumentCaptor<ActionPlanEntity> actionPlanEntityArgumentCaptor = ArgumentCaptor.forClass(ActionPlanEntity.class);
        verify(repository, times(1)).save(actionPlanEntityArgumentCaptor.capture());
        ActionPlanEntity savedEntity = actionPlanEntityArgumentCaptor.getValue();

        assertNotNull(savedEntity);
        assertEquals("AP000001-P3", savedEntity.getId());
        assertEquals(phase, savedEntity.getPhase());
        assertEquals(accountId, savedEntity.getAccountId());
        assertEquals(apContainer, savedEntity.getActionPlanContainer());

        verify(validatorService, times(1)).validate(apContainer);
    }

}