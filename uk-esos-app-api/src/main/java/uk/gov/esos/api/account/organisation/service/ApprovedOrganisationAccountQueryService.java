package uk.gov.esos.api.account.organisation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.account.domain.Account;
import uk.gov.esos.api.account.domain.dto.AccountContactInfoDTO;
import uk.gov.esos.api.account.domain.enumeration.AccountContactType;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.account.organisation.repository.OrganisationAccountRepository;
import uk.gov.esos.api.account.service.ApprovedAccountTypeQueryService;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApprovedOrganisationAccountQueryService implements ApprovedAccountTypeQueryService {

    private final OrganisationAccountRepository organisationAccountRepository;

    @Override
    public List<Long> getAllApprovedAccountIdsByCa(CompetentAuthorityEnum competentAuthority) {
        return organisationAccountRepository.findAccountIdsByCaAndStatusNotIn(competentAuthority, getStatusesConsideredNotApproved());
    }

    @Override
    public Page<AccountContactInfoDTO> getApprovedAccountsAndCaSiteContactsByCa(CompetentAuthorityEnum competentAuthority, Integer page, Integer pageSize) {
        return organisationAccountRepository.findAccountContactsByCaAndContactTypeAndStatusNotIn(
                PageRequest.of(page, pageSize),
                competentAuthority,
                AccountContactType.CA_SITE,
                getStatusesConsideredNotApproved()
        );
    }

    @Override
    public boolean isAccountApproved(Account account) {
        OrganisationAccountStatus accountStatus = ((OrganisationAccount) account).getStatus();
        return !getStatusesConsideredNotApproved().contains(accountStatus);
    }

    @Override
    public AccountType getAccountType() {
        return AccountType.ORGANISATION;
    }

    private List<OrganisationAccountStatus> getStatusesConsideredNotApproved() {
        return List.of(OrganisationAccountStatus.AWAITING_APPROVAL);
    }
}
