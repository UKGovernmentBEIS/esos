package uk.gov.esos.api.reporting.noc.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.noc.common.domain.NocEntity;
import uk.gov.esos.api.reporting.noc.common.domain.NocSubmitParams;
import uk.gov.esos.api.reporting.noc.common.repository.NocRepository;
import uk.gov.esos.api.reporting.noc.common.validation.NocValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class NocServiceTest {

    @InjectMocks
    private NocService nocService;

    @Mock
    private NocRepository nocRepository;

    @Mock
    private NocValidatorService nocValidatorService;

    @Test
    void submitNoc() {
        Long accountId = 1L;
        Phase phase = Phase.PHASE_3;
        NocP3Container nocContainer = NocP3Container.builder().phase(phase).build();
        NocSubmitParams nocSubmitParams = NocSubmitParams.builder()
            .accountId(accountId)
            .nocContainer(nocContainer)
            .build();

        // Invoke
        nocService.submitNoc(nocSubmitParams);

        // Verify
        ArgumentCaptor<NocEntity> nocEntityArgumentCaptor = ArgumentCaptor.forClass(NocEntity.class);
        verify(nocRepository, times(1)).save(nocEntityArgumentCaptor.capture());
        NocEntity savedEntity = nocEntityArgumentCaptor.getValue();

        assertNotNull(savedEntity);
        assertEquals("NOC000001-P3", savedEntity.getId());
        assertEquals(phase, savedEntity.getPhase());
        assertEquals(accountId, savedEntity.getAccountId());
        assertEquals(nocContainer, savedEntity.getNocContainer());

        verify(nocValidatorService, times(1)).validate(nocContainer);
    }
}