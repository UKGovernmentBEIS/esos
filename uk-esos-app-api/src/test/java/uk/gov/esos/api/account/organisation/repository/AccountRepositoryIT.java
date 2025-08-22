package uk.gov.esos.api.account.organisation.repository;

import uk.gov.esos.api.account.domain.Account;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.account.repo.AbstractAccountRepositoryIT;
import uk.gov.esos.api.common.domain.CountyAddress;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.domain.enumeration.EmissionTradingScheme;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

public class AccountRepositoryIT extends AbstractAccountRepositoryIT {
    @Override
    public Account buildAccount(Long id, String accountName, CompetentAuthorityEnum ca, Long verificationBodyId, EmissionTradingScheme emissionTradingScheme, CompetentAuthorityEnum location) {
        return OrganisationAccount.builder()
            .id(id)
            .name(accountName)
            .status(OrganisationAccountStatus.LIVE)
            .accountType(AccountType.ORGANISATION)
            .competentAuthority(ca)
            .organisationId("ORG" + String.format("%06d", id))
            .address(CountyAddress.builder()
                .line1("line 1")
                .city("London")
                .county("Essex")
                .postcode("56908")
                .build())
            .verificationBodyId(verificationBodyId)
            .emissionTradingScheme(emissionTradingScheme)
            .location(location)
            .build();
    }

    @Override
    public AccountType getAccounTtype() {
        return AccountType.ORGANISATION;
    }
}
