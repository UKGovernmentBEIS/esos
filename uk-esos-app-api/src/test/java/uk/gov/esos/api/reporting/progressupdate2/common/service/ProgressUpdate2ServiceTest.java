package uk.gov.esos.api.reporting.progressupdate2.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.domain.ProgressUpdate2Entity;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.domain.ProgressUpdate2SubmitParams;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.repository.ProgressUpdate2Repository;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.service.ProgressUpdate2Service;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.validation.ProgressUpdate2ValidatorService;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3Container;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate2ServiceTest {

    @InjectMocks
    private ProgressUpdate2Service service;

    @Mock
    private ProgressUpdate2Repository repository;

    @Mock
    private ProgressUpdate2ValidatorService validatorService;

    @Test
    void submitPu2Test() {
        Long accountId = 1L;
        Phase phase = Phase.PHASE_3;
        ProgressUpdate2P3Container puContainer = ProgressUpdate2P3Container.builder().phase(phase).build();
        ProgressUpdate2SubmitParams submitParams = ProgressUpdate2SubmitParams.builder()
                .accountId(accountId)
                .progressUpdate2Container(puContainer)
                .isDisaggregateUndertaking(true)
                .build();

        // Invoke
        service.submitProgressUpdate2(submitParams);

        // Verify
        ArgumentCaptor<ProgressUpdate2Entity> argumentCaptor = ArgumentCaptor.forClass(ProgressUpdate2Entity.class);
        verify(repository, times(1)).save(argumentCaptor.capture());
        ProgressUpdate2Entity savedEntity = argumentCaptor.getValue();

        assertNotNull(savedEntity);
        assertEquals("PU2000001-P3", savedEntity.getId());
        assertEquals(phase, savedEntity.getPhase());
        assertEquals(accountId, savedEntity.getAccountId());
        assertEquals(puContainer, savedEntity.getProgressUpdate2Container());

        verify(validatorService, times(1)).validate(puContainer, 1L,true);
    }

}