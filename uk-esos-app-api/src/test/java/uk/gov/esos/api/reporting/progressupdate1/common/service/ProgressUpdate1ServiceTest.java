package uk.gov.esos.api.reporting.progressupdate1.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.ProgressUpdate1Entity;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.ProgressUpdate1SubmitParams;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.repository.ProgressUpdate1Repository;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.service.ProgressUpdate1Service;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.validation.ProgressUpdate1ValidatorService;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3Container;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate1ServiceTest {

    @InjectMocks
    private ProgressUpdate1Service service;

    @Mock
    private ProgressUpdate1Repository repository;

    @Mock
    private ProgressUpdate1ValidatorService validatorService;

    @Test
    void submitActionPlanTest() {
        Long accountId = 1L;
        Phase phase = Phase.PHASE_3;
        ProgressUpdate1P3Container puContainer = ProgressUpdate1P3Container.builder().phase(phase).build();
        ProgressUpdate1SubmitParams submitParams = ProgressUpdate1SubmitParams.builder()
                .accountId(accountId)
                .progressUpdate1Container(puContainer)
                .isDisaggregateUndertaking(true)
                .build();

        // Invoke
        service.submitProgressUpdate1(submitParams);

        // Verify
        ArgumentCaptor<ProgressUpdate1Entity> argumentCaptor = ArgumentCaptor.forClass(ProgressUpdate1Entity.class);
        verify(repository, times(1)).save(argumentCaptor.capture());
        ProgressUpdate1Entity savedEntity = argumentCaptor.getValue();

        assertNotNull(savedEntity);
        assertEquals("PU1000001-P3", savedEntity.getId());
        assertEquals(phase, savedEntity.getPhase());
        assertEquals(accountId, savedEntity.getAccountId());
        assertEquals(puContainer, savedEntity.getProgressUpdate1Container());

        verify(validatorService, times(1)).validate(puContainer, 1L,true);
    }

}