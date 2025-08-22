package uk.gov.esos.api.account.organisation.domain;

import uk.gov.esos.api.account.domain.enumeration.AccountStatus;

public enum OrganisationAccountStatus implements AccountStatus {

    AWAITING_APPROVAL,
    LIVE,
    DENIED,
    CLOSED
    ;

    @Override
    public String getName() {
        return this.name();
    }
}
