package uk.gov.esos.api.reporting.progressupdate.common.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ProgressUpdateP3Confirmation {

    ESOS_ACTION_PLAN_COMPLIANCE("The progress update has been produced following notification of an ESOS action plan and includes the content required by regulation 34B of the ESOS regulations."),
    ESTIMATION_METHOD_DOCUMENTED("Where an estimate of the reduction in energy consumption is not based on an energy audit or estimate in the action plan, a description of the estimation method and reasons for using it are recorded in the evidence pack.");

    private final String description;
}
