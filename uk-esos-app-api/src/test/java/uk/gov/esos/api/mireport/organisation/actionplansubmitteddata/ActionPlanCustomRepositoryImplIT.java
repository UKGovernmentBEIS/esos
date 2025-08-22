package uk.gov.esos.api.mireport.organisation.actionplansubmitteddata;

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
import uk.gov.esos.api.mireport.common.actionplansubmitteddata.ActionPlanCustomRepository;
import uk.gov.esos.api.mireport.common.domain.dto.ReportingSearchCriteria;
import uk.gov.esos.api.mireport.common.actionplansubmitteddata.ActionPlanSearchResults;
import uk.gov.esos.api.mireport.common.actionplansubmitteddata.ActionPlanSearchResultsInfo;
import uk.gov.esos.api.reporting.actionplan.common.domain.ActionPlanEntity;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.noc.common.domain.NocEntity;
import uk.gov.esos.api.workflow.request.core.domain.Request;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus.COMPLETED;
import static uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType.ORGANISATION_ACCOUNT_OPENING;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
@Import({ObjectMapper.class, ActionPlanCustomRepositoryImpl.class})
class ActionPlanCustomRepositoryImplIT extends AbstractContainerBaseTest {

    @Autowired
    private ActionPlanCustomRepository repository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void findAll_phase3() {

        final ReportingSearchCriteria searchCriteria = ReportingSearchCriteria.builder()
                .accountType(AccountType.ORGANISATION)
                .phase(Phase.PHASE_3)
                .build();
        ActionPlanEntity actionPlanEntity = createActionPlanRelatedReportData(1);

        final ActionPlanSearchResults expected = ActionPlanSearchResults.builder()
                .actionPlanSearchResultsInfos(List.of(
                        ActionPlanSearchResultsInfo.builder()
                                .actionPlanId(actionPlanEntity.getId())
                                .nocId("NOC000" + 1)
                                .organisationName("Organisation name1")
                                .registrationNumber("RN707391")
                                .actionPlanSubmitDate(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS))
                                .nocSubmitDate(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS))
                                .location(CompetentAuthorityEnum.ENGLAND)
                                .actionPlanContainer(actionPlanEntity.getActionPlanContainer())
                                .build()
                ))
                .build();

        // Invoke
        ActionPlanSearchResults actual = repository.findAll(entityManager, searchCriteria);

        // Verify
        assertThat(actual).isEqualTo(expected);

    }

    private ActionPlanEntity createActionPlanRelatedReportData(long accountId) {
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

        ActionPlanEntity actionPlanEntity = ActionPlanEntity.builder()
                .id("AP000" + accountId)
                .accountId(accountId)
                .phase(Phase.PHASE_3)
                .build();

        NocEntity nocEntity = NocEntity.builder()
                .id("NOC000" + accountId)
                .accountId(accountId)
                .phase(Phase.PHASE_3)
                .build();

        Request apRequest = Request.builder()
                .id("AP000" + accountId)
                .type(ORGANISATION_ACCOUNT_OPENING)
                .status(COMPLETED)
                .creationDate(LocalDateTime.now())
                .submissionDate(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS))
                .build();

        Request nocRequest = Request.builder()
                .id("NOC000" + accountId)
                .type(ORGANISATION_ACCOUNT_OPENING)
                .status(COMPLETED)
                .creationDate(LocalDateTime.now())
                .submissionDate(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS))
                .build();

        entityManager.persist(organisationAccount);

        entityManager.persist(actionPlanEntity);

        entityManager.persist(nocEntity);

        entityManager.persist(apRequest);

        entityManager.persist(nocRequest);

        return actionPlanEntity;
    }

}