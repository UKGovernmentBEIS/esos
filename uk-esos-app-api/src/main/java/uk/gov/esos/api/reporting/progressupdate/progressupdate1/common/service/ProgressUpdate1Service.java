package uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.ProgressUpdate1Entity;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.ProgressUpdate1SubmitParams;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.repository.ProgressUpdate1Repository;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.util.ProgressUpdate1IdentifierGenerator;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.validation.ProgressUpdate1ValidatorService;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3Container;

@Service
@RequiredArgsConstructor
public class ProgressUpdate1Service {

    private final ProgressUpdate1Repository progressUpdate1Repository;

    private final ProgressUpdate1ValidatorService validatorService ;


    @Transactional
    public void submitProgressUpdate1(ProgressUpdate1SubmitParams progressUpdate1SubmitParams) {
        ProgressUpdate1P3Container progressUpdate1Container = (ProgressUpdate1P3Container) progressUpdate1SubmitParams.getProgressUpdate1Container();
        Long accountId = progressUpdate1SubmitParams.getAccountId();
        Phase phase = progressUpdate1Container.getPhase();


        validatorService.validate(progressUpdate1Container, accountId, progressUpdate1SubmitParams.isDisaggregateUndertaking());

        ProgressUpdate1Entity entity = ProgressUpdate1Entity.builder()
                .id(ProgressUpdate1IdentifierGenerator.generate(accountId, phase))
                .progressUpdate1Container(progressUpdate1Container)
                .accountId(accountId)
                .phase(phase)
                .isDisaggregateUndertaking(progressUpdate1SubmitParams.isDisaggregateUndertaking())
                .build();

        progressUpdate1Repository.save(entity);
    }
}