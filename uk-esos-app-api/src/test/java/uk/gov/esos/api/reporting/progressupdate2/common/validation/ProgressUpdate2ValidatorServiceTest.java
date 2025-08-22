package uk.gov.esos.api.reporting.progressupdate2.common.validation;

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
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.domain.ProgressUpdate2Container;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.validation.ProgressUpdate2PhaseValidatorService;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.validation.ProgressUpdate2ValidatorService;

import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate2ValidatorServiceTest {

    @InjectMocks
    private ProgressUpdate2ValidatorService progressUpdate2ValidatorService;

    @Spy
    private ArrayList<ProgressUpdate2PhaseValidatorService> progressUpdate2PhaseValidatorServices;

    @Mock
    private ProgressUpdate2ValidatorServiceTest.TestPuPhaseValidatorService testPuPhaseValidatorService;

    @BeforeEach
    void setUp() {
        progressUpdate2PhaseValidatorServices.add(testPuPhaseValidatorService);
    }

    @Test
    void validate() {
        Phase phase = Phase.PHASE_3;
        ProgressUpdate2Container container = Mockito.mock(ProgressUpdate2Container.class);

        when(container.getPhase()).thenReturn(phase);
        when(testPuPhaseValidatorService.getPhase()).thenReturn(phase);

        progressUpdate2ValidatorService.validate(container, 1L, false);

        verify(testPuPhaseValidatorService, times(1)).getPhase();
        verify(testPuPhaseValidatorService, times(1)).validate(container, 1L, false);
    }

    @Test
    void validate_no_validator_found() {
        Phase phase = Phase.PHASE_3;
        ProgressUpdate2Container container = Mockito.mock(ProgressUpdate2Container.class);

        when(container.getPhase()).thenReturn(phase);
        when(testPuPhaseValidatorService.getPhase()).thenReturn(null);

        BusinessException be = assertThrows(BusinessException.class, () -> progressUpdate2ValidatorService.validate(container, 1L, false));

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.RESOURCE_NOT_FOUND);
        verify(testPuPhaseValidatorService, times(1)).getPhase();
        verify(testPuPhaseValidatorService, never()).validate(container, 1L, false);
    }


    private static class TestPuPhaseValidatorService implements ProgressUpdate2PhaseValidatorService<ProgressUpdate2Container> {


        @Override
        public void validate(ProgressUpdate2Container actionPlanContainer, Long accountId, boolean isDisaggregateUndertaking) {

        }

        @Override
        public Phase getPhase() {
            return null;
        }
    }

}