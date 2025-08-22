package uk.gov.esos.api.account.organisation.repository;

import java.util.List;

import uk.gov.esos.api.account.domain.Account;
import uk.gov.esos.api.account.organisation.domain.ClassificationCode;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.account.service.AbstractAccountCustomRepositoryIT;
import uk.gov.esos.api.common.domain.ClassificationType;
import uk.gov.esos.api.common.domain.CountyAddress;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

public class AccountCustomRepositoryImplIT extends AbstractAccountCustomRepositoryIT {

    @Override
    public Account buildAccount(Long id, String accountName, CompetentAuthorityEnum ca, CompetentAuthorityEnum location) {
    	OrganisationAccount account = OrganisationAccount.builder()
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
			.location(location)
            .build();
    	
    	account.setClassificationCodes(List.of(ClassificationCode.builder()
        		.account(account)
        		.type(ClassificationType.SIC)
        		.code("sicCode")
        		.build()));
    	
    	return account;
    }
}
