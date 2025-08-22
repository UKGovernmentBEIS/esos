package uk.gov.esos.api.reporting.noc.common.validation;

import jakarta.validation.constraints.NotNull;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.noc.common.domain.NocContainer;

public interface NocPhaseValidatorService<T extends NocContainer> {

    void validate(@NotNull T nocContainer);

    Phase getPhase();
}
