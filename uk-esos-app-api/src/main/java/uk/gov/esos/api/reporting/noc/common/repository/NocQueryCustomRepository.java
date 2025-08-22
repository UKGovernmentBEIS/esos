package uk.gov.esos.api.reporting.noc.common.repository;

import org.springframework.transaction.annotation.Transactional;

import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.reporting.noc.common.domain.NocSearchCriteria;
import uk.gov.esos.api.reporting.noc.common.domain.NocSearchResults;

public interface NocQueryCustomRepository {

    @Transactional(readOnly = true)
    NocSearchResults findAll(NocSearchCriteria searchCriteria);

    AccountType getAccountType();
}
