package uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.util;

import lombok.experimental.UtilityClass;
import uk.gov.esos.api.reporting.common.domain.Phase;

@UtilityClass
public class ProgressUpdate2IdentifierGenerator {

    public String generate(Long accountId, Phase phase) {
        return String.format("%s%06d-%s", "PU2", accountId, phase.getCode());
    }
}
