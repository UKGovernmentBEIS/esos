package uk.gov.esos.api.reporting.progressupdate1.common.validation;

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
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.ProgressUpdate1Container;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.validation.ProgressUpdate1PhaseValidatorService;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.validation.ProgressUpdate1ValidatorService;

import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate1ValidatorServiceTest {

    @InjectMocks
    private ProgressUpdate1ValidatorService actionPlanValidatorService;

    @Spy
    private ArrayList<ProgressUpdate1PhaseValidatorService> progressUpdate1PhaseValidatorServices;

    @Mock
    private ProgressUpdate1ValidatorServiceTest.TestPuPhaseValidatorService testPuPhaseValidatorService;

    @BeforeEach
    void setUp() {
        progressUpdate1PhaseValidatorServices.add(testPuPhaseValidatorService);
    }

    @Test
    void validate() {
        Phase phase = Phase.PHASE_3;
        ProgressUpdate1Container container = Mockito.mock(ProgressUpdate1Container.class);

        when(container.getPhase()).thenReturn(phase);
        when(testPuPhaseValidatorService.getPhase()).thenReturn(phase);

        actionPlanValidatorService.validate(container, 1L, false);

        verify(testPuPhaseValidatorService, times(1)).getPhase();
        verify(testPuPhaseValidatorService, times(1)).validate(container, 1L, false);
    }

    @Test
    void validate_no_validator_found() {
        Phase phase = Phase.PHASE_3;
        ProgressUpdate1Container container = Mockito.mock(ProgressUpdate1Container.class);

        when(container.getPhase()).thenReturn(phase);
        when(testPuPhaseValidatorService.getPhase()).thenReturn(null);

        BusinessException be = assertThrows(BusinessException.class, () -> actionPlanValidatorService.validate(container, 1L, false));

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.RESOURCE_NOT_FOUND);
        verify(testPuPhaseValidatorService, times(1)).getPhase();
        verify(testPuPhaseValidatorService, never()).validate(container, 1L, false);
    }


    private static class TestPuPhaseValidatorService implements ProgressUpdate1PhaseValidatorService<ProgressUpdate1Container> {


        @Override
        public void validate(ProgressUpdate1Container actionPlanContainer, Long accountId, boolean isDisaggregateUndertaking) {

        }

        @Override
        public Phase getPhase() {
            return null;
        }
    }

}