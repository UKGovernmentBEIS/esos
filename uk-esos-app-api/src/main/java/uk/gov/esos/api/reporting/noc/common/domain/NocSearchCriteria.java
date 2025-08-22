package uk.gov.esos.api.reporting.noc.common.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import uk.gov.esos.api.common.domain.dto.PagingRequest;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.reporting.common.domain.Phase;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NocSearchCriteria {

    private AccountType accountType;

    private Phase phase;

    private PagingRequest paging;
}
