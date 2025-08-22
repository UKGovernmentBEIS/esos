package uk.gov.esos.api.reporting.actionplan.common.service;

import jakarta.ws.rs.NotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.actionplan.common.domain.ActionPlanEntity;
import uk.gov.esos.api.reporting.actionplan.common.repository.ActionPlanRepository;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanP3;
import uk.gov.esos.api.reporting.actionplan.phase3.domain.ActionPlanP3Container;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
class ActionPlanQueryServiceTest {

    @InjectMocks
    private ActionPlanQueryService actionPlanQueryService;

    @Mock
    private  ActionPlanRepository actionPlanRepository;


    @Test
    void testGetActionPlanP3ByAccountId_Success() {
        Long accountId = 1L;
        ActionPlanEntity actionPlanEntity = Mockito.mock(ActionPlanEntity.class);
        ActionPlanP3Container actionPlanP3Container = Mockito.mock(ActionPlanP3Container.class);
        ActionPlanP3 actionPlanP3 = Mockito.mock(ActionPlanP3.class);

        when(actionPlanRepository.findByAccountId(accountId)).thenReturn(Optional.of(actionPlanEntity));
        when(actionPlanEntity.getActionPlanContainer()).thenReturn(actionPlanP3Container);
        when(actionPlanP3Container.getActionPlan()).thenReturn(actionPlanP3);

        ActionPlanP3 result = actionPlanQueryService.getActionPlanP3ByAccountId(accountId);

        verify(actionPlanRepository, times(1)).findByAccountId(accountId);
        assertThat(actionPlanP3).isEqualTo(result);
    }

    @Test
    void testGetActionPlanP3ByAccountId_NotFound() {
        Long invalidAccountId = 999L;
        when(actionPlanRepository.findByAccountId(invalidAccountId)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(NotFoundException.class,
                () -> actionPlanQueryService.getActionPlanP3ByAccountId(invalidAccountId));

        assertEquals("Action plan not found for account ID: 999", exception.getMessage());
    }

}