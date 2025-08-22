package uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.validation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.ProgressUpdate1Container;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgressUpdate1ValidatorService {
    private final List<ProgressUpdate1PhaseValidatorService<? extends ProgressUpdate1Container>> pu1PhaseValidatorServices;

    @SuppressWarnings("unchecked")
    public void validate(ProgressUpdate1Container pu1Container, Long accountId, boolean isDisaggregateUndertaking) {
        Phase phase = pu1Container.getPhase();
        getValidatorService(phase).validate(pu1Container, accountId, isDisaggregateUndertaking);
    }

    private ProgressUpdate1PhaseValidatorService getValidatorService(Phase phase) {
        return pu1PhaseValidatorServices.stream()
                .filter(puPhaseValidatorService -> phase.equals(puPhaseValidatorService.getPhase()))
                .findFirst()
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "No suitable validator found"));
    }
}
