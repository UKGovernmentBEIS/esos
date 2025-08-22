package uk.gov.esos.api.mireport.organisation.accountsregulatorsitecontacts;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.testcontainers.junit.jupiter.Testcontainers;
import uk.gov.esos.api.AbstractContainerBaseTest;
import uk.gov.esos.api.account.domain.enumeration.AccountContactType;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.authorization.core.domain.Authority;
import uk.gov.esos.api.authorization.core.domain.AuthorityStatus;
import uk.gov.esos.api.common.domain.CountyAddress;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.domain.enumeration.EmissionTradingScheme;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.mireport.common.accountsregulatorsitecontacts.AccountAssignedRegulatorSiteContact;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;


@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
@Import({ObjectMapper.class, OrganisationAccountAssignedRegulatorSiteContactsRepository.class})
class OrganisationAccountAssignedRegulatorSiteContactsRepositoryIT extends AbstractContainerBaseTest {

    @Autowired
    private OrganisationAccountAssignedRegulatorSiteContactsRepository accountAssignedRegulatorSiteContactsRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void findAccountAssignedRegulatorSiteContacts() {
        String userId1 = UUID.randomUUID().toString();
        String userId2 = UUID.randomUUID().toString();
        String userId3 = UUID.randomUUID().toString();

        Map<AccountContactType, String> contacts = Map.of(
                AccountContactType.PRIMARY, userId1,
                AccountContactType.CA_SITE, userId2);

        OrganisationAccount account1 = createAccount(1L, "accountName1", CompetentAuthorityEnum.ENGLAND, contacts, CompetentAuthorityEnum.WALES);
        Authority authority1 = createAuthority(userId2,"code1", AuthorityStatus.ACTIVE, CompetentAuthorityEnum.ENGLAND);

        OrganisationAccount account2 = createAccount(2L, "accountName2", CompetentAuthorityEnum.ENGLAND, new HashMap<>(), CompetentAuthorityEnum.WALES);
        createAuthority(userId3, "code2", AuthorityStatus.ACTIVE, CompetentAuthorityEnum.ENGLAND);

        List<AccountAssignedRegulatorSiteContact> assignedRegulatorSiteContacts =
                accountAssignedRegulatorSiteContactsRepository.findAccountAssignedRegulatorSiteContacts(entityManager);

        assertEquals(2, assignedRegulatorSiteContacts.size());
        makeAssertions(account1, assignedRegulatorSiteContacts.get(0));
        makeAssertions(account2,  assignedRegulatorSiteContacts.get(1));
        assertEquals(authority1.getStatus().name(), assignedRegulatorSiteContacts.get(0).getAuthorityStatus());
        assertNull(assignedRegulatorSiteContacts.get(1).getAuthorityStatus());
        assertEquals(contacts.get(AccountContactType.CA_SITE), assignedRegulatorSiteContacts.get(0).getUserId());
        assertNull(assignedRegulatorSiteContacts.get(1).getUserId());


    }

    private void makeAssertions(OrganisationAccount account, AccountAssignedRegulatorSiteContact accountAssignedRegulatorSiteContact) {

        assertEquals(account.getOrganisationId(), accountAssignedRegulatorSiteContact.getAccountId());
        assertEquals(account.getName(), accountAssignedRegulatorSiteContact.getAccountName());
        assertEquals(account.getAccountType().name(), accountAssignedRegulatorSiteContact.getAccountType());
        assertEquals(account.getStatus().name(), accountAssignedRegulatorSiteContact.getAccountStatus());
        assertNull(accountAssignedRegulatorSiteContact.getAssignedRegulatorName());
    }

    private OrganisationAccount createAccount(Long id, String name, CompetentAuthorityEnum competentAuthority,
                                              Map<AccountContactType, String> contacts, CompetentAuthorityEnum location) {

        OrganisationAccount account = OrganisationAccount.builder()
                .id(id)
                .name(name)
                .accountType(AccountType.ORGANISATION)
                .status(OrganisationAccountStatus.LIVE)
                .organisationId("ORG" + String.format("%06d", id))
                .address(CountyAddress.builder()
                        .city("city")
                        .line1("line1")
                        .county("counrty")
                        .postcode("code")
                        .build())
                .competentAuthority(competentAuthority)
                .emissionTradingScheme(EmissionTradingScheme.UK_ETS_INSTALLATIONS)
                .contacts(contacts)
                .emissionTradingScheme(EmissionTradingScheme.UK_ETS_INSTALLATIONS)
                .location(location)
                .build();

        entityManager.persist(account);
        return account;
    }

    private Authority createAuthority(String userId, String code, AuthorityStatus authorityStatus, CompetentAuthorityEnum competentAuthority) {
        Authority authority = Authority.builder()
                .userId(userId)
                .code(code)
                .status(authorityStatus)
                .createdBy("createdBy")
                .competentAuthority(competentAuthority)
                .build();
        entityManager.persist(authority);
        return authority;
    }
}
