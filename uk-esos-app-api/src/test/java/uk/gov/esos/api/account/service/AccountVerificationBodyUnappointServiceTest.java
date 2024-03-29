package uk.gov.esos.api.account.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import uk.gov.esos.api.account.domain.Account;
import uk.gov.esos.api.account.domain.event.AccountsVerificationBodyUnappointedEvent;
import uk.gov.esos.api.account.repository.AccountRepository;
import uk.gov.esos.api.common.domain.enumeration.EmissionTradingScheme;

import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountVerificationBodyUnappointServiceTest {

    @InjectMocks
    private AccountVerificationBodyUnappointService service;
    
    @Mock
    private AccountRepository accountRepository;
    
    @Mock
    private AccountVbSiteContactService accountVbSiteContactService;

    @Mock
    private ApplicationEventPublisher eventPublisher;
    
    @Test
    void unappointAccountsAppointedToVerificationBodyForEmissionTradingSchemes() {
        Long accountId = 1L;
        Long verificationBodyId = 1L; 
        Set<EmissionTradingScheme> notAvailableAccreditationEmissionTradingSchemes = Set.of(EmissionTradingScheme.UK_ETS_INSTALLATIONS, EmissionTradingScheme.CORSIA);
        Account account = Mockito.mock(Account.class);
        Set<Account> accountsToBeUnappointed = Set.of(account);

        when(account.getId()).thenReturn(accountId);
        when(accountRepository.findAllByVerificationBodyAndEmissionTradingSchemeWithContactsIn(verificationBodyId, notAvailableAccreditationEmissionTradingSchemes))
            .thenReturn(accountsToBeUnappointed);
        
        //invoke
        service.unappointAccountsAppointedToVerificationBodyForEmissionTradingSchemes(verificationBodyId, notAvailableAccreditationEmissionTradingSchemes);
        
        verify(accountRepository, times(1)).findAllByVerificationBodyAndEmissionTradingSchemeWithContactsIn(verificationBodyId, notAvailableAccreditationEmissionTradingSchemes);
        verify(accountVbSiteContactService, times(1)).removeVbSiteContactFromAccounts(accountsToBeUnappointed);
        verify(eventPublisher, times(1))
            .publishEvent(AccountsVerificationBodyUnappointedEvent.builder()
                .accountIds(Set.of(accountId))
                .build()
            );
        verify(account, times(1)).setVerificationBodyId(null);
    }
    
    @Test
    void unappointAccountsAppointedToVerificationBodyForEmissionTradingSchemes_empty_ref_num_list() {
        Long verificationBodyId = 1L; 
        Set<EmissionTradingScheme> notAvailableAccreditationEmissionTradingSchemes = Set.of();
        Account account = Mockito.mock(Account.class);

        //invoke
        service.unappointAccountsAppointedToVerificationBodyForEmissionTradingSchemes(verificationBodyId, notAvailableAccreditationEmissionTradingSchemes);
        
        verifyNoInteractions(accountRepository, accountVbSiteContactService);
        verify(account, never()).setVerificationBodyId(any());
    }

    @Test
    void unappointAccountsAppointedToVerificationBody() {
        Long accountId = 1L;
        Long verificationBodyId = 1L;
        Set<Long> verificationBodyIds = Set.of(verificationBodyId);
        Account account = Mockito.mock(Account.class);
        Set<Account> accountsToBeUnappointed = Set.of(account);

        when(account.getId()).thenReturn(accountId);
        when(accountRepository.findAllByVerificationWithContactsBodyIn(verificationBodyIds)).thenReturn(accountsToBeUnappointed);

        // Invoke
        service.unappointAccountsAppointedToVerificationBody(verificationBodyIds);

        // Assert
        verify(accountRepository, times(1)).findAllByVerificationWithContactsBodyIn(verificationBodyIds);
        verify(accountVbSiteContactService, times(1)).removeVbSiteContactFromAccounts(accountsToBeUnappointed);
        verify(eventPublisher, times(1))
            .publishEvent(AccountsVerificationBodyUnappointedEvent.builder()
                .accountIds(Set.of(accountId))
                .build()
            );
        verify(account, times(1)).setVerificationBodyId(null);
    }

    @Test
    void unappointAccountsAppointedToVerificationBody_no_accounts() {
        Long verificationBodyId = 1L;
        Set<Long> verificationBodyIds = Set.of(verificationBodyId);
        Set<Account> accountsToBeUnappointed = Set.of();

        // Mock
        when(accountRepository.findAllByVerificationWithContactsBodyIn(verificationBodyIds)).thenReturn(accountsToBeUnappointed);

        // Invoke
        service.unappointAccountsAppointedToVerificationBody(verificationBodyIds);

        // Assert
        verify(accountRepository, times(1)).findAllByVerificationWithContactsBodyIn(verificationBodyIds);
        verify(accountRepository, never()).save(Mockito.any(Account.class));
        verify(accountVbSiteContactService, never()).removeVbSiteContactFromAccounts(anySet());
    }
}
