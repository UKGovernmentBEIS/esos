package uk.gov.esos.api.reporting.noc.common.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NocSearchResultsInfo {

    private String id;

    private String organisationName;

    private String registrationNumber;

    private CompetentAuthorityEnum location;

    private NocContainer nocContainer;

    private OrganisationAccountStatus status;
}