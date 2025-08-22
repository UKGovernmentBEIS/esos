package uk.gov.esos.api.mireport.organisation.actionplansubmitteddata;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQuery;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.account.organisation.domain.QOrganisationAccount;
import uk.gov.esos.api.mireport.common.actionplansubmitteddata.ActionPlanCustomRepository;
import uk.gov.esos.api.mireport.common.domain.dto.ReportingSearchCriteria;
import uk.gov.esos.api.mireport.common.actionplansubmitteddata.ActionPlanSearchResults;
import uk.gov.esos.api.mireport.common.actionplansubmitteddata.ActionPlanSearchResultsInfo;
import uk.gov.esos.api.reporting.actionplan.common.domain.QActionPlanEntity;
import uk.gov.esos.api.reporting.noc.common.domain.QNocEntity;
import uk.gov.esos.api.workflow.request.core.domain.QRequest;

@Service
public class ActionPlanCustomRepositoryImpl implements ActionPlanCustomRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public ActionPlanSearchResults findAll(EntityManager entityManager, ReportingSearchCriteria searchCriteria) {
        QActionPlanEntity actionPlanEntity = QActionPlanEntity.actionPlanEntity;
        QOrganisationAccount account = QOrganisationAccount.organisationAccount;
        QRequest requestAliasForNoc = new QRequest("requestAliasForNoc");
        QRequest requestAliasForAP = new QRequest("requestAliasForAP");
        QNocEntity nocEntity = QNocEntity.nocEntity;

        JPAQuery<ActionPlanSearchResultsInfo> query = new JPAQuery<>(entityManager);

        JPAQuery<ActionPlanSearchResultsInfo> jpaQuery = query.select(
                        Projections.constructor(ActionPlanSearchResultsInfo.class,
                                actionPlanEntity.id,
                                nocEntity.id,
                                account.name,
                                account.registrationNumber,
                                requestAliasForNoc.submissionDate,
                                requestAliasForAP.submissionDate,
                                account.location,
                                actionPlanEntity.actionPlanContainer))
                .from(actionPlanEntity)
                .innerJoin(account).on(account.id.eq(actionPlanEntity.accountId))
                .leftJoin(nocEntity).on(nocEntity.accountId.eq(actionPlanEntity.accountId))
                .leftJoin(requestAliasForNoc).on(requestAliasForNoc.id.eq(nocEntity.id))
                .innerJoin(requestAliasForAP).on(requestAliasForAP.id.eq(actionPlanEntity.id))
                .where(actionPlanEntity.phase.eq(searchCriteria.getPhase())
                        .and(account.accountType.eq(searchCriteria.getAccountType())))
                .orderBy(actionPlanEntity.id.asc());

        return ActionPlanSearchResults.builder()
                .actionPlanSearchResultsInfos(jpaQuery.fetch()) // Fetch results
                .build();
    }
}
