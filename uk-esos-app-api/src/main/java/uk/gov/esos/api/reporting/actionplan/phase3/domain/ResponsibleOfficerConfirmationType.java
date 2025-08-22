package uk.gov.esos.api.reporting.actionplan.phase3.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ResponsibleOfficerConfirmationType {

    ESOS_ASSESSMENT_NOTIFICATION("The action plan has been produced following a notification of compliance for an ESOS assessment and includes the content required by regulation 34A of the ESOS regulations"),
    ESTIMATION_METHOD_DESCRIPTION("Where an estimate of the total energy savings reasonably expected to be achieved is not based on an ESOS assessment (energy audit or alternative compliance method), a description of the estimation method and reasons for using it are recorded in the evidence pack");

    private final String description;

}
