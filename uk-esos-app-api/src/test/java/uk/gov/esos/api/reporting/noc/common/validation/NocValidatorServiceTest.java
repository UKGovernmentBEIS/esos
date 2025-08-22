package uk.gov.esos.api.reporting.noc.common.validation;

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
import uk.gov.esos.api.reporting.noc.common.domain.NocContainer;

import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NocValidatorServiceTest {

    @InjectMocks
    private NocValidatorService nocValidatorService;

    @Spy
    private ArrayList<NocPhaseValidatorService> nocPhaseValidatorServices;

    @Mock
    private NocValidatorServiceTest.TestNocPhaseValidatorService testNocPhaseValidatorService;

    @BeforeEach
    void setUp() {
        nocPhaseValidatorServices.add(testNocPhaseValidatorService);
    }

    @Test
    void validate() {
        Phase phase = Phase.PHASE_3;
        NocContainer nocContainer = Mockito.mock(NocContainer.class);

        when(nocContainer.getPhase()).thenReturn(phase);
        when(testNocPhaseValidatorService.getPhase()).thenReturn(phase);

        nocValidatorService.validate(nocContainer);

        verify(testNocPhaseValidatorService, times(1)).getPhase();
        verify(testNocPhaseValidatorService, times(1)).validate(nocContainer);
    }

    @Test
    void validate_no_validator_found() {
        Phase phase = Phase.PHASE_3;
        NocContainer nocContainer = Mockito.mock(NocContainer.class);

        when(nocContainer.getPhase()).thenReturn(phase);
        when(testNocPhaseValidatorService.getPhase()).thenReturn(null);

        BusinessException be = assertThrows(BusinessException.class, () -> nocValidatorService.validate(nocContainer));

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.RESOURCE_NOT_FOUND);
        verify(testNocPhaseValidatorService, times(1)).getPhase();
        verify(testNocPhaseValidatorService, never()).validate(nocContainer);
    }

    private static class TestNocPhaseValidatorService implements NocPhaseValidatorService<NocContainer> {

        @Override
        public void validate(NocContainer nocContainer) {
        }

        @Override
        public Phase getPhase() {
            return null;
        }
    }
}