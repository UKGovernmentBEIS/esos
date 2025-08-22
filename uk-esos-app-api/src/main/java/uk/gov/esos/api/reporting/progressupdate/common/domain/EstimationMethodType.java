package uk.gov.esos.api.reporting.progressupdate.common.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EstimationMethodType {
    ENERGY_AUDIT("An energy audit"),
    ACTION_PLAN_ESTIMATE("An estimate in the action plan"),
    OTHER_METHOD("Some other reasonable estimation method"),
    NO_METHOD_USED("No estimation method used");

    private final String description;

}
