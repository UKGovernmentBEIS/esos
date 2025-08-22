package uk.gov.esos.api.account.organisation.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.testcontainers.junit.jupiter.Testcontainers;
import uk.gov.esos.api.AbstractContainerBaseTest;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.common.domain.CountyAddress;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
@Import(ObjectMapper.class)
class OrganisationAccountRepositoryIT extends AbstractContainerBaseTest {

    @Autowired
    private OrganisationAccountRepository repository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void existsByRegistrationNumberAndStatus() {
        createAccount(1L, OrganisationAccountStatus.LIVE, CompetentAuthorityEnum.ENGLAND, "name1", "reg1", CompetentAuthorityEnum.ENGLAND);
        createAccount(2L, OrganisationAccountStatus.DENIED, CompetentAuthorityEnum.ENGLAND, "name2", "reg2", CompetentAuthorityEnum.WALES);

        flushAndClear();

        assertTrue(repository.existsByRegistrationNumberAndStatus("reg1", OrganisationAccountStatus.LIVE));
        assertFalse(repository.existsByRegistrationNumberAndStatus("reg1", OrganisationAccountStatus.DENIED));
        assertFalse(repository.existsByRegistrationNumberAndStatus("reg2", OrganisationAccountStatus.AWAITING_APPROVAL));
        assertTrue(repository.existsByRegistrationNumberAndStatus("reg2", OrganisationAccountStatus.DENIED));
    }

    @Test
    void findAllByRegistrationNumber() {
        OrganisationAccount account1 = createAccount(1L, OrganisationAccountStatus.LIVE, CompetentAuthorityEnum.ENGLAND, "name1", "reg1", CompetentAuthorityEnum.ENGLAND);
        OrganisationAccount account2 = createAccount(2L, OrganisationAccountStatus.DENIED, CompetentAuthorityEnum.ENGLAND, "name2", "reg1", CompetentAuthorityEnum.WALES);
        createAccount(3L, OrganisationAccountStatus.DENIED, CompetentAuthorityEnum.ENGLAND, "name3", "regxx", CompetentAuthorityEnum.WALES);

        flushAndClear();

        List<OrganisationAccount> result = repository.findAllByRegistrationNumber("reg1");

        assertThat(result).containsExactlyInAnyOrder(account1, account2);
    }

    private OrganisationAccount createAccount(Long id, OrganisationAccountStatus accountStatus, CompetentAuthorityEnum ca,
                                              String name, String registrationNumber, CompetentAuthorityEnum location) {
        OrganisationAccount account = OrganisationAccount.builder()
            .id(id)
            .name(name)
            .accountType(AccountType.ORGANISATION)
            .competentAuthority(ca)
            .status(accountStatus)
            .organisationId(String.format("%s%s", "ORG", String.format("%06d", id)))
            .registrationNumber(registrationNumber)
            .address(CountyAddress.builder()
                .line1("line1")
                .city("city")
                .county("county")
                .postcode("code")
                .build())
            .location(location)
            .build();

        entityManager.persist(account);
        return account;
    }

    private void flushAndClear() {
        entityManager.flush();
        entityManager.clear();
    }
}