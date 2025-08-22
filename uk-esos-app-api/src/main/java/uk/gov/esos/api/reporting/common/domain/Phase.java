package uk.gov.esos.api.reporting.common.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Phase {
    PHASE_3("P3");

    private final String code;
}
