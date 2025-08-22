package uk.gov.esos.api.reporting.noc.common.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQuery;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;

import uk.gov.esos.api.account.organisation.domain.QOrganisationAccount;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.reporting.noc.common.domain.NocSearchCriteria;
import uk.gov.esos.api.reporting.noc.common.domain.NocSearchResults;
import uk.gov.esos.api.reporting.noc.common.domain.NocSearchResultsInfo;
import uk.gov.esos.api.reporting.noc.common.domain.QNocEntity;

@Repository
public class NocQueryOrganisationCustomRepository implements NocQueryCustomRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public NocSearchResults findAll(NocSearchCriteria searchCriteria) {
        QNocEntity nocEntity = QNocEntity.nocEntity;
        QOrganisationAccount account = QOrganisationAccount.organisationAccount;

        JPAQuery<NocSearchResultsInfo> query = new JPAQuery<>(entityManager);
        JPAQuery<NocSearchResultsInfo> jpaQuery = query.select(
                        Projections.constructor(NocSearchResultsInfo.class,
                                nocEntity.id,
                                account.name,
                                account.registrationNumber,
                                account.location,
                                nocEntity.nocContainer,
                                account.status))
                .from(nocEntity)
                .innerJoin(account).on(account.id.eq(nocEntity.accountId))
                .where(nocEntity.phase.eq(searchCriteria.getPhase()).and(account.accountType.eq(searchCriteria.getAccountType())))
                .orderBy(nocEntity.id.asc())
                .offset(searchCriteria.getPaging().getPageNumber() * searchCriteria.getPaging().getPageSize())
                .limit(searchCriteria.getPaging().getPageSize());

        return NocSearchResults.builder()
                .nocSearchResultsInfos(jpaQuery.fetch())
                .total(jpaQuery.fetchCount())
                .build();
    }

    @Override
    public AccountType getAccountType() {
        return AccountType.ORGANISATION;
    }
}
