package uk.gov.esos.api.account.organisation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.service.AccountContactUpdateService;
import uk.gov.esos.api.authorization.operator.service.OperatorAuthorityService;

import java.time.LocalDateTime;

@Validated
@Service
@RequiredArgsConstructor
public class OrganisationAccountActivationService {

    private final OrganisationAccountQueryService organisationAccountQueryService;
    private final OperatorAuthorityService operatorauthorityService;
    private final OrganisationAccountStatusUpdateService organisationAccountStatusUpdateService;
    private final AccountContactUpdateService accountContactUpdateService;
    private final OrganisationAccountValidationService organisationAccountValidationService;

    @Transactional
    public void activateAccount(Long accountId, String user) {
        OrganisationAccount account = organisationAccountQueryService.getAccountById(accountId);
        organisationAccountValidationService.validateActiveAccountRegistrationNumberExistenceForUpdate(account.getRegistrationNumber());

        account.setAcceptedDate(LocalDateTime.now());

        organisationAccountStatusUpdateService.handleOrganisationAccountAccepted(accountId);
        operatorauthorityService.createOperatorAdminAuthority(account.getId(), user);
        accountContactUpdateService.assignUserAsPrimaryContact(user, account);
    }
}
