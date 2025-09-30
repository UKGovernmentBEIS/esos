package gov.uk.esos.keycloak.user.api.service;

import gov.uk.esos.keycloak.user.api.model.DatabaseLockDTO;
import gov.uk.esos.keycloak.user.api.repository.DatabaseLockRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DatabaseLockServiceTest {

    @InjectMocks
    private DatabaseLockService service;

    @Mock
    private DatabaseLockRepository databaseLockRepository;

    @Mock
    private UserSessionService userSessionService;

    @Test
    void lock_successful() {
        when(databaseLockRepository.isDataBaseLockedForMigration()).thenReturn(false);

        DatabaseLockDTO response = service.lock();

        assertNotNull(response);
        assertTrue(response.isSuccess());

        verify(databaseLockRepository).obtainLock();
        verify(databaseLockRepository).isDataBaseLockedForMigration();
        verify(databaseLockRepository).writeLockForMigration();
        verify(userSessionService).getAuthenticatedUser();
        verifyNoMoreInteractions(databaseLockRepository, userSessionService);
    }

    @Test
    void lock_unsuccessful() {
        when(databaseLockRepository.isDataBaseLockedForMigration()).thenReturn(true);

        DatabaseLockDTO response = service.lock();

        assertNotNull(response);
        assertFalse(response.isSuccess());

        verify(databaseLockRepository).obtainLock();
        verify(databaseLockRepository).isDataBaseLockedForMigration();
        verify(userSessionService).getAuthenticatedUser();
        verifyNoMoreInteractions(databaseLockRepository, userSessionService);
    }

    @Test
    void unlock() {
        service.unlock();

        verify(databaseLockRepository).obtainLock();
        verify(databaseLockRepository).unlock();
        verify(userSessionService).getAuthenticatedUser();
        verifyNoMoreInteractions(databaseLockRepository, userSessionService);
    }
}
