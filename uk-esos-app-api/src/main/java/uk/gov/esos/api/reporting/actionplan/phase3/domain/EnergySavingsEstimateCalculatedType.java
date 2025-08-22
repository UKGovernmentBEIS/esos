package uk.gov.esos.api.reporting.actionplan.phase3.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EnergySavingsEstimateCalculatedType {

    ENERGY_AUDIT("An energy audit"),

    ALTERNATIVE_COMPLIANCE_METHOD("An alternative compliance method"),

    OTHER_REASONABLE_ESTIMATION_METHOD("Some other reasonable estimation method")
    ;

    private final String description;
}


