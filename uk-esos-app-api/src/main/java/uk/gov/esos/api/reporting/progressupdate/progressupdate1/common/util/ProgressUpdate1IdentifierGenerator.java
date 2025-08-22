package uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.util;

import lombok.experimental.UtilityClass;
import uk.gov.esos.api.reporting.common.domain.Phase;

@UtilityClass
public class ProgressUpdate1IdentifierGenerator {

    public String generate(Long accountId, Phase phase) {
        return String.format("%s%06d-%s", "PU1", accountId, phase.getCode());
    }
}
