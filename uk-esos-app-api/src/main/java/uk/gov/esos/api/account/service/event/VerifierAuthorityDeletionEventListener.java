package uk.gov.esos.api.account.service.event;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.account.service.AccountVbSiteContactService;
import uk.gov.esos.api.authorization.verifier.event.VerifierAuthorityDeletionEvent;

@RequiredArgsConstructor
@Component(value =  "accountVerifierAuthorityDeletionEventListener")
public class VerifierAuthorityDeletionEventListener {

    private final AccountVbSiteContactService accountVbSiteContactService;
    
    @Order(1)
    @EventListener(VerifierAuthorityDeletionEvent.class)
    public void onVerifierUserDeletedEvent(VerifierAuthorityDeletionEvent event) {
        accountVbSiteContactService.removeUserFromVbSiteContact(event.getUserId());
    }
}
