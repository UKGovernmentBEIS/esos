package uk.gov.esos.api.reporting.actionplan.common.util;

import lombok.experimental.UtilityClass;
import uk.gov.esos.api.reporting.common.domain.Phase;

@UtilityClass
public class ActionPlanIdentifierGenerator {

    public String generate(Long accountId, Phase phase) {
        return String.format("%s%06d-%s", "AP", accountId, phase.getCode());
    }
}
