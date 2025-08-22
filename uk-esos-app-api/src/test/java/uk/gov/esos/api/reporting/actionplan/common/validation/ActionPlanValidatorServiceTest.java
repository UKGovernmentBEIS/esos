package uk.gov.esos.api.reporting.actionplan.common.validation;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.reporting.actionplan.common.domain.ActionPlanContainer;
import uk.gov.esos.api.reporting.common.domain.Phase;

import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ActionPlanValidatorServiceTest {

    @InjectMocks
    private ActionPlanValidatorService actionPlanValidatorService;

    @Spy
    private ArrayList<ActionPlanPhaseValidatorService> actionPlanPhaseValidatorServices;

    @Mock
    private ActionPlanValidatorServiceTest.TestApPhaseValidatorService testApPhaseValidatorService;

    @BeforeEach
    void setUp() {
        actionPlanPhaseValidatorServices.add(testApPhaseValidatorService);
    }

    @Test
    void validate() {
        Phase phase = Phase.PHASE_3;
        ActionPlanContainer actionPlanContainer = Mockito.mock(ActionPlanContainer.class);

        when(actionPlanContainer.getPhase()).thenReturn(phase);
        when(testApPhaseValidatorService.getPhase()).thenReturn(phase);

        actionPlanValidatorService.validate(actionPlanContainer);

        verify(testApPhaseValidatorService, times(1)).getPhase();
        verify(testApPhaseValidatorService, times(1)).validate(actionPlanContainer);
    }

    @Test
    void validate_no_validator_found() {
        Phase phase = Phase.PHASE_3;
        ActionPlanContainer nocContainer = Mockito.mock(ActionPlanContainer.class);

        when(nocContainer.getPhase()).thenReturn(phase);
        when(testApPhaseValidatorService.getPhase()).thenReturn(null);

        BusinessException be = assertThrows(BusinessException.class, () -> actionPlanValidatorService.validate(nocContainer));

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.RESOURCE_NOT_FOUND);
        verify(testApPhaseValidatorService, times(1)).getPhase();
        verify(testApPhaseValidatorService, never()).validate(nocContainer);
    }

    private static class TestApPhaseValidatorService implements ActionPlanPhaseValidatorService<ActionPlanContainer> {


        @Override
        public void validate(ActionPlanContainer actionPlanContainer) {

        }

        @Override
        public Phase getPhase() {
            return null;
        }
    }

}