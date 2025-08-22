package uk.gov.esos.api.reporting.progressupdate2.common.service;

import jakarta.ws.rs.NotFoundException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.ProgressUpdate1Entity;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.repository.ProgressUpdate1Repository;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.service.ProgressUpdate1P3QueryService;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3Container;

import java.util.Optional;

import static org.junit.Assert.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate1P3QueryServiceTest {

    @Mock
    private ProgressUpdate1Repository progressUpdate1Repository;

    @InjectMocks
    private ProgressUpdate1P3QueryService progressUpdate1P3QueryService;

    private Long accountId;
    private ProgressUpdate1Entity progressUpdate1Entity;
    private ProgressUpdate1P3 progressUpdate1P3;

    @Test
    void shouldReturnProgressUpdate1P3_WhenAccountIdExists() {
        // Arrange
        Long accountId = 1L;
        ProgressUpdate1P3 expectedProgressUpdate1P3 = new ProgressUpdate1P3();
        ProgressUpdate1P3Container container = mock(ProgressUpdate1P3Container.class);
        when(container.getProgressUpdate1P3()).thenReturn(expectedProgressUpdate1P3);

        ProgressUpdate1Entity progressUpdate1Entity = mock(ProgressUpdate1Entity.class);
        when(progressUpdate1Entity.getProgressUpdate1Container()).thenReturn(container);
        when(progressUpdate1Repository.findByAccountId(accountId)).thenReturn(Optional.of(progressUpdate1Entity));

        ProgressUpdate1P3 result = progressUpdate1P3QueryService.getProgressUpdate1ByAccountId(accountId);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(expectedProgressUpdate1P3, result);
    }

    @Test
    void shouldThrowNotFoundException_WhenAccountIdDoesNotExist() {
        Long accountId = 1L;
        when(progressUpdate1Repository.findByAccountId(accountId)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(NotFoundException.class,
                () -> progressUpdate1P3QueryService.getProgressUpdate1ByAccountId(accountId));

        Assertions.assertEquals("PU1 not found for account ID: " + accountId, exception.getMessage());
    }


}