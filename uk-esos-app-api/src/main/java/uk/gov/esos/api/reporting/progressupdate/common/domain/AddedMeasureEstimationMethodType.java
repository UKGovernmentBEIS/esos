package uk.gov.esos.api.reporting.progressupdate.common.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AddedMeasureEstimationMethodType {

    ENERGY_AUDIT("An energy audit"),
    OTHER_METHOD("Some other reasonable estimation method"),
    NO_METHOD_USED("No estimation method used");

    private final String description;


}
