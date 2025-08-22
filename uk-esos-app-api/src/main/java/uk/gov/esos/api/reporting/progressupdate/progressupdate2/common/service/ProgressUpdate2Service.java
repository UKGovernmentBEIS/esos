package uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.domain.ProgressUpdate2Entity;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.domain.ProgressUpdate2SubmitParams;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.repository.ProgressUpdate2Repository;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.util.ProgressUpdate2IdentifierGenerator;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.validation.ProgressUpdate2ValidatorService;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3Container;

@Service
@RequiredArgsConstructor
public class ProgressUpdate2Service {

    private final ProgressUpdate2Repository progressUpdate2Repository;

    private final ProgressUpdate2ValidatorService validatorService ;


    @Transactional
    public void submitProgressUpdate2(ProgressUpdate2SubmitParams progressUpdate2SubmitParams) {
        ProgressUpdate2P3Container progressUpdate2Container = (ProgressUpdate2P3Container) progressUpdate2SubmitParams.getProgressUpdate2Container();
        Long accountId = progressUpdate2SubmitParams.getAccountId();
        Phase phase = progressUpdate2Container.getPhase();


        validatorService.validate(progressUpdate2Container, accountId, progressUpdate2SubmitParams.isDisaggregateUndertaking());

        ProgressUpdate2Entity entity = ProgressUpdate2Entity.builder()
                .id(ProgressUpdate2IdentifierGenerator.generate(accountId, phase))
                .progressUpdate2Container(progressUpdate2Container)
                .accountId(accountId)
                .phase(phase)
                .isDisaggregateUndertaking(progressUpdate2SubmitParams.isDisaggregateUndertaking())
                .build();

        progressUpdate2Repository.save(entity);
    }
}
