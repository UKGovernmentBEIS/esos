package uk.gov.esos.api.account.organisation.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;
import uk.gov.esos.api.account.domain.dto.AccountSearchCriteria;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.dto.AccountSearchResults;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

import java.util.List;

@Repository
public class OrganisationAccountCustomRepositoryImpl implements OrganisationAccountCustomRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public AccountSearchResults findByAccountIds(List<Long> accountIds, AccountSearchCriteria searchCriteria) {
        return AccountSearchResults.builder()
                .accounts(constructQuery(accountIds, null, null, searchCriteria, false).getResultList())
                .total(((Number) constructQuery(accountIds, null, null, searchCriteria, true).getSingleResult()).longValue())
                .build();
    }

    @Override
    public AccountSearchResults findByCompAuth(CompetentAuthorityEnum compAuth, AccountSearchCriteria searchCriteria) {
        return AccountSearchResults.builder()
                .accounts(constructQuery(null, compAuth, null, searchCriteria, false).getResultList())
                .total(((Number) constructQuery(null, compAuth, null, searchCriteria, true).getSingleResult()).longValue())
                .build();
    }

    private Query constructQuery(List<Long> accountIds,
                                 CompetentAuthorityEnum compAuth,
                                 Long verificationBodyId,
                                 AccountSearchCriteria searchCriteria,
                                 boolean forCount) {

        StringBuilder sb = new StringBuilder();

        if (forCount) {
            sb.append("select count(*) from ( \n");
        }

        sb.append("select acc.id, acc.name, acc_org.organisation_id, acc_org.status \n")
                .append("from account acc \n")
                .append("join account_organisation acc_org on acc_org.id=acc.id \n")
                .append("where 1 = 1 \n")
        ;

        constructMainWhereClause(accountIds, compAuth, verificationBodyId, sb);

        if (StringUtils.hasText(searchCriteria.getTerm())) {
            sb.append("and (acc.name ilike :accName \n");
            sb.append("or acc_org.registration_number ilike :reg_num \n");
            sb.append("or acc_org.organisation_id ilike :org_id \n");
            sb.append(") \n");

            constructMainWhereClause(accountIds, compAuth, verificationBodyId, sb);
        }

        if (!forCount) {
            sb.append("order by organisation_id asc \n")
                    .append("limit :limit \n")
                    .append("offset :offset \n");
        } else {
            sb.append(") results");
        }

        Query query;
        if (forCount) {
            query = entityManager.createNativeQuery(sb.toString());
        } else {
            query = entityManager.createNativeQuery(sb.toString(), OrganisationAccount.ORGANISATION_ACCOUNT_SEARCH_RESULTS_INFO_DTO_RESULT_MAPPER);
        }

        populateMainWhereClauseParameters(accountIds, compAuth, verificationBodyId, query);

        if (StringUtils.hasText(searchCriteria.getTerm())) {
            query.setParameter("accName", "%" + searchCriteria.getTerm() + "%");
            query.setParameter("reg_num", "%" + searchCriteria.getTerm() + "%");
            query.setParameter("org_id", "%" + searchCriteria.getTerm() + "%");

            populateMainWhereClauseParameters(accountIds, compAuth, verificationBodyId, query);
        }

        if (!forCount) {
            query.setParameter("limit", searchCriteria.getPaging().getPageSize());
            query.setParameter("offset", searchCriteria.getPaging().getPageNumber() * searchCriteria.getPaging().getPageSize());
        }

        return query;
    }


    private void constructMainWhereClause(List<Long> accountIds, CompetentAuthorityEnum compAuth, Long verificationBodyId, StringBuilder sb) {

        if (ObjectUtils.isNotEmpty(accountIds)) {
            sb.append("and acc.id in :accountIds \n");
        }

        if (compAuth != null) {
            sb.append("and acc.competent_authority = :compAuth \n");
        }

        if (verificationBodyId != null) {
            sb.append("and acc.verification_body_id = :verificationBodyId \n");
        }
    }

    private void populateMainWhereClauseParameters(List<Long> accountIds, CompetentAuthorityEnum compAuth, Long verificationBodyId, Query query) {

        if (ObjectUtils.isNotEmpty(accountIds)) {
            query.setParameter("accountIds", accountIds);
        }

        if (compAuth != null) {
            query.setParameter("compAuth", compAuth.name());
        }

        if (verificationBodyId != null) {
            query.setParameter("verificationBodyId", verificationBodyId);
        }
    }
}
