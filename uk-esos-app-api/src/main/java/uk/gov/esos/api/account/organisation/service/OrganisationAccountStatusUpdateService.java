package uk.gov.esos.api.account.organisation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;

@Service
@RequiredArgsConstructor
public class OrganisationAccountStatusUpdateService {

    private final OrganisationAccountQueryService organisationAccountQueryService;

    @Transactional
    @uk.gov.esos.api.account.service.validator.AccountStatus(expression = "{#status == 'AWAITING_APPROVAL'}")
    public void handleOrganisationAccountAccepted(Long accountId) {
        updateAccountStatus(accountId, OrganisationAccountStatus.LIVE);
    }

    @Transactional
    @uk.gov.esos.api.account.service.validator.AccountStatus(expression = "{#status == 'AWAITING_APPROVAL'}")
    public void handleOrganisationAccountRejected(Long accountId) {
        updateAccountStatus(accountId, OrganisationAccountStatus.DENIED);
    }

    @Transactional
    @uk.gov.esos.api.account.service.validator.AccountStatus(expression = "{#status == 'LIVE'}")
    public void handleOrganisationAccountClosed(Long accountId) {
        updateAccountStatus(accountId, OrganisationAccountStatus.CLOSED);
    }

    private void updateAccountStatus(Long accountId, OrganisationAccountStatus newStatus) {
        OrganisationAccount account = organisationAccountQueryService.getAccountById(accountId);
        account.setStatus(newStatus);
    }
}
