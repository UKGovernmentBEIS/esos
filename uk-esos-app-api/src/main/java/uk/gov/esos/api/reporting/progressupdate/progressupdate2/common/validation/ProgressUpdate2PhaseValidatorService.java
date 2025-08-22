package uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.validation;

import jakarta.validation.constraints.NotNull;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.domain.ProgressUpdate2Container;

public interface ProgressUpdate2PhaseValidatorService <T extends ProgressUpdate2Container>{

    void validate(@NotNull T pu2Container, Long accountId, boolean isDisaggregateUndertaking);

    Phase getPhase();
}
