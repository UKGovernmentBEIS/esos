package uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.validation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.domain.ProgressUpdate2Container;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgressUpdate2ValidatorService {

    private final List<ProgressUpdate2PhaseValidatorService<? extends ProgressUpdate2Container>> pu2PhaseValidatorServices;

    @SuppressWarnings("unchecked")
    public void validate(ProgressUpdate2Container pu2Container, Long accountId, boolean isDisaggregateUndertaking) {
        Phase phase = pu2Container.getPhase();
        getValidatorService(phase).validate(pu2Container, accountId, isDisaggregateUndertaking);
    }

    private ProgressUpdate2PhaseValidatorService getValidatorService(Phase phase) {
        return pu2PhaseValidatorServices.stream()
                .filter(puPhaseValidatorService -> phase.equals(puPhaseValidatorService.getPhase()))
                .findFirst()
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "No suitable validator found"));
    }
}
