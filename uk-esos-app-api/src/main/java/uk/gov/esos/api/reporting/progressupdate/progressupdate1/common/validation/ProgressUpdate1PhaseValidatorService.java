package uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.validation;

import jakarta.validation.constraints.NotNull;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.ProgressUpdate1Container;

public interface ProgressUpdate1PhaseValidatorService <T extends ProgressUpdate1Container> {

    void validate(@NotNull T pu1Container, Long accountId, boolean isDisaggregateUndertaking);

    Phase getPhase();
}

