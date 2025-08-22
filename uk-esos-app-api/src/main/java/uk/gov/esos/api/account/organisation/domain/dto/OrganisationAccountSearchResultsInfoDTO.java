package uk.gov.esos.api.account.organisation.domain.dto;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;

@Getter
@EqualsAndHashCode
public class OrganisationAccountSearchResultsInfoDTO {

    private Long id;
    private String name;
    private String organisationId;
    private OrganisationAccountStatus status;

    public OrganisationAccountSearchResultsInfoDTO(Long id, String name, String organisationId, String status) {
        this.id = id;
        this.name = name;
        this.organisationId = organisationId;
        this.status = OrganisationAccountStatus.valueOf(status);
    }
}
