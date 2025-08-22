package uk.gov.esos.api.reporting.noc.common.util;

import lombok.experimental.UtilityClass;
import uk.gov.esos.api.reporting.common.domain.Phase;

@UtilityClass
public class NocIdentifierGenerator {

    public String generate(Long accountId, Phase phase) {
        return String.format("%s%06d-%s", "NOC", accountId, phase.getCode());
    }
}
