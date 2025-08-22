package uk.gov.esos.api.reporting.noc.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.noc.common.domain.NocContainer;
import uk.gov.esos.api.reporting.noc.common.domain.NocEntity;
import uk.gov.esos.api.reporting.noc.common.domain.NocSubmitParams;
import uk.gov.esos.api.reporting.noc.common.repository.NocRepository;
import uk.gov.esos.api.reporting.noc.common.util.NocIdentifierGenerator;
import uk.gov.esos.api.reporting.noc.common.validation.NocValidatorService;

@Service
@RequiredArgsConstructor
public class NocService {

    private final NocRepository nocRepository;
    private final NocValidatorService nocValidatorService;

    @Transactional
    public void submitNoc(NocSubmitParams nocSubmitParams) {
        NocContainer nocContainer = nocSubmitParams.getNocContainer();
        Long accountId = nocSubmitParams.getAccountId();
        Phase phase = nocContainer.getPhase();

        nocValidatorService.validate(nocContainer);

        NocEntity nocEntity = NocEntity.builder()
            .id(NocIdentifierGenerator.generate(accountId, phase))
            .nocContainer(nocContainer)
            .accountId(accountId)
            .phase(phase)
            .build();

        nocRepository.save(nocEntity);
    }
}
