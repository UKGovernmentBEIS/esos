package uk.gov.esos.api.mireport.organisation.progressupdate1submitteddata;

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
import uk.gov.esos.api.mireport.common.progressupdate1submitteddata.ProgressUpdate1CustomRepository;
import uk.gov.esos.api.mireport.common.progressupdate1submitteddata.ProgressUpdate1SearchResults;
import uk.gov.esos.api.mireport.common.progressupdate1submitteddata.ProgressUpdate1SearchResultsInfo;
import uk.gov.esos.api.mireport.common.domain.dto.ReportingSearchCriteria;
import uk.gov.esos.api.reporting.actionplan.common.domain.ActionPlanEntity;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.ProgressUpdate1Entity;
import uk.gov.esos.api.workflow.request.core.domain.Request;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus.COMPLETED;
import static uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType.ACTION_PLAN_P3;
import static uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType.PROGRESS_UPDATE_1_P3;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
@Import({ObjectMapper.class, ProgressUpdate1CustomRepositoryImpl.class})
class ProgressUpdate1CustomRepositoryImplIT extends AbstractContainerBaseTest {

    @Autowired
    private ProgressUpdate1CustomRepository repository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void findAll_phase3() {

        final ReportingSearchCriteria searchCriteria = ReportingSearchCriteria.builder()
                .accountType(AccountType.ORGANISATION)
                .phase(Phase.PHASE_3)
                .build();
        ProgressUpdate1Entity entity = createPU1RelatedReportData(1);

        final ProgressUpdate1SearchResults expected = ProgressUpdate1SearchResults.builder()
                .progressUpdate1SearchResultsInfos(List.of(
                        ProgressUpdate1SearchResultsInfo.builder()
                                .pu1Id("PU10001")
                                .actionPlanId("AP000" + 1)
                                .organisationName("Organisation name1")
                                .registrationNumber("RN707391")
                                .actionPlanSubmitDate(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS))
                                .pu1SubmitDate(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS))
                                .location(CompetentAuthorityEnum.ENGLAND)
                                .progressUpdate1Container(entity.getProgressUpdate1Container())
                                .build()
                ))
                .build();

        // Invoke
        ProgressUpdate1SearchResults actual = repository.findAll(entityManager, searchCriteria);

        // Verify
        assertThat(actual).isEqualTo(expected);

    }

    private ProgressUpdate1Entity createPU1RelatedReportData(long accountId) {
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

        ProgressUpdate1Entity progressUpdate1Entity = ProgressUpdate1Entity.builder()
                .id("PU1000" + accountId)
                .accountId(accountId)
                .phase(Phase.PHASE_3)
                .build();

        Request apRequest = Request.builder()
                .id("AP000" + accountId)
                .type(ACTION_PLAN_P3)
                .status(COMPLETED)
                .creationDate(LocalDateTime.now())
                .submissionDate(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS))
                .build();

        Request pu1Request = Request.builder()
                .id("PU1000" + accountId)
                .type(PROGRESS_UPDATE_1_P3)
                .status(COMPLETED)
                .creationDate(LocalDateTime.now())
                .submissionDate(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS))
                .build();

        entityManager.persist(organisationAccount);

        entityManager.persist(actionPlanEntity);

        entityManager.persist(progressUpdate1Entity);

        entityManager.persist(pu1Request);

        entityManager.persist(apRequest);

        return progressUpdate1Entity;
    }

}