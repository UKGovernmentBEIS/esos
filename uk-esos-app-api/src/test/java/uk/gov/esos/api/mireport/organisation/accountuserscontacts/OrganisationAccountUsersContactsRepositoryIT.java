package uk.gov.esos.api.mireport.organisation.accountuserscontacts;

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
import uk.gov.esos.api.authorization.core.domain.Role;
import uk.gov.esos.api.common.domain.CountyAddress;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.domain.enumeration.EmissionTradingScheme;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.mireport.common.accountuserscontacts.AccountUserContact;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest(properties = { "spring.jpa.properties.jakarta.persistence.validation.mode=none",
        "spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect"
})
@Import({ObjectMapper.class, OrganisationAccountUsersContactsRepository.class})
class OrganisationAccountUsersContactsRepositoryIT extends AbstractContainerBaseTest {
    @Autowired
    private OrganisationAccountUsersContactsRepository repo;

    @Autowired
    private EntityManager entityManager;

    @Test
    void findAccountUserContacts() {
        Long accountId = 1L;
        String userId = "user1";
        Map<AccountContactType, String> contacts = Map.of(AccountContactType.PRIMARY, userId, AccountContactType.FINANCIAL, userId);
        OrganisationAccount account = createAccount(accountId, CompetentAuthorityEnum.ENGLAND, contacts);
        Authority authority = createAuthority(userId);
        Role role = createRole();
        flushAndClear();
        AccountUserContact accountUserContactExpected = AccountUserContact
                .builder()
                .userId(userId)
                .registrationNumber(account.getRegistrationNumber())
                .accountId(account.getOrganisationId())
                .accountName(account.getName())
                .accountStatus(account.getStatus().name())
                .primaryContact(true)
                .secondaryContact(false)
                .authorityStatus(authority.getStatus().name())
                .role(role.getName())
                .accountLocation(CompetentAuthorityEnum.ENGLAND.name())
                .build();

        //invoke
        List<AccountUserContact> result = repo.findAccountUserContacts(entityManager);

        //verify
        assertEquals(1, result.size());
        assertEquals(accountUserContactExpected, result.get(0));
    }

    private Role createRole() {
        Role role = Role.builder()
                .code("code")
                .name("roleName")
                .type(RoleType.OPERATOR)
                .build();
        entityManager.persist(role);
        return role;
    }

    private Authority createAuthority(String userId) {
        Authority authority = Authority.builder()
                .accountId(1L)
                .userId(userId)
                .code("code")
                .status(AuthorityStatus.ACTIVE)
                .createdBy("createdBy")
                .build();
        entityManager.persist(authority);
        return authority;
    }

    private OrganisationAccount createAccount(Long id, CompetentAuthorityEnum ca, Map<AccountContactType, String> contacts) {
        OrganisationAccount account = OrganisationAccount.builder()
                .id(id)
                .accountType(AccountType.ORGANISATION)
                .competentAuthority(ca)
                .organisationId("ORG" + String.format("%06d", id))
                .status(OrganisationAccountStatus.LIVE)
                .address(CountyAddress.builder()
                        .city("city")
                        .line1("line1")
                        .county("counrty")
                        .postcode("code")
                        .build())
                .name("accountName")
                .contacts(contacts)
                .registrationNumber(String.format("%08d", id))
                .emissionTradingScheme(EmissionTradingScheme.UK_ETS_INSTALLATIONS)
                .location(ca)
                .build();
        entityManager.persist(account);
        return account;
    }

    private void flushAndClear() {
        entityManager.flush();
        entityManager.clear();
    }
}