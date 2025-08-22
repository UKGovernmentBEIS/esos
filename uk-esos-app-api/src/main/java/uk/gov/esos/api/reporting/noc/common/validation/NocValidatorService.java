package uk.gov.esos.api.reporting.noc.common.validation;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.noc.common.domain.NocContainer;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NocValidatorService {

    private final List<NocPhaseValidatorService<? extends NocContainer>> nocPhaseValidatorServices;

    @SuppressWarnings("unchecked")
    public void validate(NocContainer nocContainer) {
        Phase phase = nocContainer.getPhase();
        getValidatorService(phase).validate(nocContainer);
    }

    private NocPhaseValidatorService getValidatorService(Phase phase) {
        return nocPhaseValidatorServices.stream()
            .filter(nocPhaseValidatorService -> phase.equals(nocPhaseValidatorService.getPhase()))
            .findFirst()
            .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "No suitable validator found"));
    }
}
