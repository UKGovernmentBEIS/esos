package uk.gov.esos.api.reporting.noc.common.repository;

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
import uk.gov.esos.api.common.domain.dto.PagingRequest;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.noc.common.domain.*;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
@Import({ObjectMapper.class, NocQueryOrganisationCustomRepository.class})
class NocQueryOrganisationCustomRepositoryIT extends AbstractContainerBaseTest {

    @Autowired
    private NocQueryCustomRepository repository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void findAll_phase3_page1() {
        final NocSearchCriteria searchCriteria = NocSearchCriteria.builder()
                .accountType(AccountType.ORGANISATION)
                .paging(PagingRequest.builder().pageNumber(0L).pageSize(1L).build())
                .phase(Phase.PHASE_3)
                .build();
        NocEntity noc1 = createNocEntity(1);
        createNocEntity(2);

        final NocSearchResults expected = NocSearchResults.builder()
                .nocSearchResultsInfos(List.of(
                        NocSearchResultsInfo.builder()
                                .id(noc1.getId())
                                .organisationName("Organisation name1")
                                .registrationNumber("RN707391")
                                .location(CompetentAuthorityEnum.ENGLAND)
                                .nocContainer(noc1.getNocContainer())
                                .status(OrganisationAccountStatus.LIVE)
                                .build()
                ))
                .total(2L)
                .build();

        // Invoke
        NocSearchResults actual = repository.findAll(searchCriteria);

        // Verify
        assertThat(actual).isEqualTo(expected);
    }

    @Test
    void findAll_phase3_page2() {
        final NocSearchCriteria searchCriteria = NocSearchCriteria.builder()
                .accountType(AccountType.ORGANISATION)
                .paging(PagingRequest.builder().pageNumber(1L).pageSize(1L).build())
                .phase(Phase.PHASE_3)
                .build();
        createNocEntity(1);
        NocEntity noc2 = createNocEntity(2);

        final NocSearchResults expected = NocSearchResults.builder()
                .nocSearchResultsInfos(List.of(
                        NocSearchResultsInfo.builder()
                                .id(noc2.getId())
                                .organisationName("Organisation name2")
                                .registrationNumber("RN707392")
                                .location(CompetentAuthorityEnum.ENGLAND)
                                .nocContainer(noc2.getNocContainer())
                                .status(OrganisationAccountStatus.LIVE)
                                .build()
                ))
                .total(2L)
                .build();

        // Invoke
        NocSearchResults actual = repository.findAll(searchCriteria);

        // Verify
        assertThat(actual).isEqualTo(expected);
    }

    private NocEntity createNocEntity(long accountId) {
        OrganisationAccount organisationAccount = OrganisationAccount.builder()
                .id(accountId)
                .name("Organisation name" + accountId)
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .accountType(AccountType.ORGANISATION)
                .registrationNumber("RN70739" + accountId)
                .status(OrganisationAccountStatus.LIVE)
                .address(CountyAddress.builder()
                        .line1("Line 1")
                        .city("City")
                        .county("County")
                        .postcode("postcode")
                        .build())
                .location(CompetentAuthorityEnum.ENGLAND)
                .organisationId("ORG00000" + accountId)

                .build();
        NocEntity entity = NocEntity.builder()
                .id("NOC000" + accountId)
                .accountId(accountId)
                .phase(Phase.PHASE_3)
                .build();

        entityManager.persist(organisationAccount);
        entityManager.persist(entity);

        return entity;
    }
}
