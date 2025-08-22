package uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum OrganisationQualificationReasonType {
    TURNOVER_MORE_THAN_44M("The turnover is over £44m"),
    STAFF_MEMBERS_MORE_THAN_250("We have over 250 staff members"),
    TURNOVER_MORE_THAN_44M_AND_STAFF_MEMBERS_MORE_THAN_250("The turnover is over £44m and the organisation has over 250 staff members"),
    CONDITIONS_NOT_MET("The organisation does not meet any of these conditions")
    ;

    private final String description;
}
