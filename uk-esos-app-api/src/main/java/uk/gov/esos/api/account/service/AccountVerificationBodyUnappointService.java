package uk.gov.esos.api.account.service;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.account.domain.Account;
import uk.gov.esos.api.account.domain.event.AccountsVerificationBodyUnappointedEvent;
import uk.gov.esos.api.account.repository.AccountRepository;
import uk.gov.esos.api.common.domain.enumeration.EmissionTradingScheme;

import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class AccountVerificationBodyUnappointService {
    
    private final AccountRepository accountRepository;
    private final AccountVbSiteContactService accountVbSiteContactService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public void unappointAccountsAppointedToVerificationBodyForEmissionTradingSchemes(
            Long verificationBodyId, Set<EmissionTradingScheme> notAvailableAccreditationEmissionTradingSchemes) {
        if(notAvailableAccreditationEmissionTradingSchemes.isEmpty()) {
            return;
        }
        
        Set<Account> accountsToBeUnappointed = accountRepository.findAllByVerificationBodyAndEmissionTradingSchemeWithContactsIn(
                verificationBodyId, notAvailableAccreditationEmissionTradingSchemes);

        unappointAccounts(accountsToBeUnappointed);
    }

    @Transactional
    public void unappointAccountsAppointedToVerificationBody(Set<Long> verificationBodyIds) {
        Set<Account> accountsToBeUnappointed = accountRepository.findAllByVerificationWithContactsBodyIn(verificationBodyIds);
        unappointAccounts(accountsToBeUnappointed);
    }

    private void unappointAccounts(Set<Account> accountsToBeUnappointed) {
        if(accountsToBeUnappointed.isEmpty()) {
            return;
        }
        
        //clear verification body of accounts
        accountsToBeUnappointed.forEach(account -> {
            account.setVerificationBodyId(null);
        });
        
        accountVbSiteContactService.removeVbSiteContactFromAccounts(accountsToBeUnappointed);

        eventPublisher.publishEvent(AccountsVerificationBodyUnappointedEvent.builder()
            .accountIds(accountsToBeUnappointed.stream()
                .map(Account::getId)
                .collect(Collectors.toSet())
            )
            .build()
        );
    }
    
}
