package uk.gov.esos.api.mireport.common.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.reporting.common.domain.Phase;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportingSearchCriteria {

    private AccountType accountType;

    private Phase phase;

}
