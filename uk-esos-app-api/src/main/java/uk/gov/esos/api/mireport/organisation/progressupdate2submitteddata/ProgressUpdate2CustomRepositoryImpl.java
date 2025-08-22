package uk.gov.esos.api.mireport.organisation.progressupdate2submitteddata;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQuery;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.account.organisation.domain.QOrganisationAccount;
import uk.gov.esos.api.mireport.common.progressupdate2submitteddata.ProgressUpdate2CustomRepository;
import uk.gov.esos.api.mireport.common.progressupdate2submitteddata.ProgressUpdate2SearchResults;
import uk.gov.esos.api.mireport.common.progressupdate2submitteddata.ProgressUpdate2SearchResultsInfo;
import uk.gov.esos.api.mireport.common.domain.dto.ReportingSearchCriteria;
import uk.gov.esos.api.reporting.actionplan.common.domain.QActionPlanEntity;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.QProgressUpdate1Entity;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.domain.QProgressUpdate2Entity;
import uk.gov.esos.api.workflow.request.core.domain.QRequest;

@Service
public class ProgressUpdate2CustomRepositoryImpl implements ProgressUpdate2CustomRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public ProgressUpdate2SearchResults findAll(EntityManager entityManager, ReportingSearchCriteria searchCriteria) {
        QProgressUpdate2Entity progressUpdate2Entity = QProgressUpdate2Entity.progressUpdate2Entity;
        QProgressUpdate1Entity progressUpdate1Entity = QProgressUpdate1Entity.progressUpdate1Entity;
        QActionPlanEntity actionPlanEntity = QActionPlanEntity.actionPlanEntity;
        QOrganisationAccount account = QOrganisationAccount.organisationAccount;
        QRequest requestAliasForPU2 = new QRequest("requestAliasForPU2");
        QRequest requestAliasForPU1 = new QRequest("requestAliasForPU1");
        QRequest requestAliasForAP = new QRequest("requestAliasForAP");

        JPAQuery<ProgressUpdate2SearchResultsInfo> query = new JPAQuery<>(entityManager);

        JPAQuery<ProgressUpdate2SearchResultsInfo> jpaQuery = query.select(
                        Projections.constructor(ProgressUpdate2SearchResultsInfo.class,
                                progressUpdate2Entity.id,
                                account.name,
                                account.registrationNumber,
                                requestAliasForPU2.submissionDate,
                                actionPlanEntity.id,
                                requestAliasForAP.submissionDate,
                                progressUpdate1Entity.id,
                                requestAliasForPU1.submissionDate,
                                account.location,
                                progressUpdate2Entity.progressUpdate2Container))
                .from(progressUpdate2Entity)
                .innerJoin(account).on(account.id.eq(progressUpdate2Entity.accountId))
                .leftJoin(actionPlanEntity).on(actionPlanEntity.accountId.eq(progressUpdate2Entity.accountId))
                .leftJoin(progressUpdate1Entity).on(progressUpdate1Entity.accountId.eq(progressUpdate2Entity.accountId))
                .innerJoin(requestAliasForPU2).on(requestAliasForPU2.id.eq(progressUpdate2Entity.id))
                .leftJoin(requestAliasForAP).on(requestAliasForAP.id.eq(actionPlanEntity.id))
                .leftJoin(requestAliasForPU1).on(requestAliasForPU1.id.eq(progressUpdate1Entity.id))
                .where(progressUpdate2Entity.phase.eq(searchCriteria.getPhase())
                        .and(account.accountType.eq(searchCriteria.getAccountType())))
                .orderBy(progressUpdate2Entity.id.asc());

        return ProgressUpdate2SearchResults.builder()
                .progressUpdate2SearchResultsInfos(jpaQuery.fetch()) // Fetch results
                .build();
    }
}
