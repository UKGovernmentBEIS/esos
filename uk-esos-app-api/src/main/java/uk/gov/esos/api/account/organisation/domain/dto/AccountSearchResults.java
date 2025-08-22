package uk.gov.esos.api.account.organisation.domain.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AccountSearchResults {

    private List<OrganisationAccountSearchResultsInfoDTO> accounts;
    private Long total;
}
