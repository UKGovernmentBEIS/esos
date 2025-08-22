package uk.gov.esos.api.reporting.noc.phase3.domain.confirmations;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ResponsibilityAssessmentType {

    SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME("the organisation is within scope of the scheme"),
    SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME("the organisation is compliant with the scheme"),
    SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON("the relevant sections of the ESOS report have been shared with all undertakings in the corporate group, unless there is a declared reason why this is prohibited by law"),
    SATISFIED_WITH_INFORMATION_PROVIDED("the information provided in this notification of compliance is correct");

    private final String description;
}
