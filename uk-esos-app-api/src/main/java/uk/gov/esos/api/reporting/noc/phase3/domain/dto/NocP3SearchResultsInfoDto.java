package uk.gov.esos.api.reporting.noc.phase3.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NocP3SearchResultsInfoDto {

    private String id;

    private String organisationName;

    private String registrationNumber;

    private CompetentAuthorityEnum location;

    private NocP3 noc;

    private OrganisationAccountStatus status;
}
