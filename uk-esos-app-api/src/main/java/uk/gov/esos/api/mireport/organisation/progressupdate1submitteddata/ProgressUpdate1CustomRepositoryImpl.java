package uk.gov.esos.api.mireport.organisation.progressupdate1submitteddata;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQuery;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.account.organisation.domain.QOrganisationAccount;
import uk.gov.esos.api.mireport.common.progressupdate1submitteddata.ProgressUpdate1CustomRepository;
import uk.gov.esos.api.mireport.common.progressupdate1submitteddata.ProgressUpdate1SearchResults;
import uk.gov.esos.api.mireport.common.progressupdate1submitteddata.ProgressUpdate1SearchResultsInfo;
import uk.gov.esos.api.mireport.common.domain.dto.ReportingSearchCriteria;
import uk.gov.esos.api.reporting.actionplan.common.domain.QActionPlanEntity;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.QProgressUpdate1Entity;
import uk.gov.esos.api.workflow.request.core.domain.QRequest;

@Service
public class ProgressUpdate1CustomRepositoryImpl implements ProgressUpdate1CustomRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public ProgressUpdate1SearchResults findAll(EntityManager entityManager, ReportingSearchCriteria searchCriteria) {
        QProgressUpdate1Entity progressUpdate1Entity = QProgressUpdate1Entity.progressUpdate1Entity;
        QActionPlanEntity actionPlanEntity = QActionPlanEntity.actionPlanEntity;
        QOrganisationAccount account = QOrganisationAccount.organisationAccount;
        QRequest requestAliasForPU1 = new QRequest("requestAliasForPU1");
        QRequest requestAliasForAP = new QRequest("requestAliasForAP");

        JPAQuery<ProgressUpdate1SearchResultsInfo> query = new JPAQuery<>(entityManager);

        JPAQuery<ProgressUpdate1SearchResultsInfo> jpaQuery = query.select(
                        Projections.constructor(ProgressUpdate1SearchResultsInfo.class,
                                progressUpdate1Entity.id,
                                account.name,
                                account.registrationNumber,
                                requestAliasForPU1.submissionDate,
                                actionPlanEntity.id,
                                requestAliasForAP.submissionDate,
                                account.location,
                                progressUpdate1Entity.progressUpdate1Container))
                .from(progressUpdate1Entity)
                .innerJoin(account).on(account.id.eq(progressUpdate1Entity.accountId))
                .leftJoin(actionPlanEntity).on(actionPlanEntity.accountId.eq(progressUpdate1Entity.accountId))
                .innerJoin(requestAliasForPU1).on(requestAliasForPU1.id.eq(progressUpdate1Entity.id))
                .leftJoin(requestAliasForAP).on(requestAliasForAP.id.eq(actionPlanEntity.id))
                .where(progressUpdate1Entity.phase.eq(searchCriteria.getPhase())
                        .and(account.accountType.eq(searchCriteria.getAccountType())))
                .orderBy(progressUpdate1Entity.id.asc());

        return ProgressUpdate1SearchResults.builder()
                .progressUpdate1SearchResultsInfos(jpaQuery.fetch()) // Fetch results
                .build();
    }
}
