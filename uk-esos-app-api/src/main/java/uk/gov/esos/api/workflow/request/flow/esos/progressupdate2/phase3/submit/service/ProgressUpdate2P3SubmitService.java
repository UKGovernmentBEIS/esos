package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.submit.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.domain.ProgressUpdate2SubmitParams;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.service.ProgressUpdate2Service;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.submit.domain.ProgressUpdate2P3ApplicationSubmitRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.submit.trasnform.ProgressUpdate2P3SubmitMapper;

@Service
@RequiredArgsConstructor
public class ProgressUpdate2P3SubmitService {

    private final ProgressUpdate2Service progressUpdate2Service;
    private static final ProgressUpdate2P3SubmitMapper PU2_P3_SUBMIT_MAPPER = Mappers.getMapper(ProgressUpdate2P3SubmitMapper.class);

    @Transactional
    public void submitProgressUpdate2Action(RequestTask requestTask) {
        Request request = requestTask.getRequest();
        ProgressUpdate2P3RequestPayload requestPayload = (ProgressUpdate2P3RequestPayload) request.getPayload();
        ProgressUpdate2P3ApplicationSubmitRequestTaskPayload applicationSubmitRequestTaskPayload =
                (ProgressUpdate2P3ApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        requestPayload.setProgressUpdate2P3(applicationSubmitRequestTaskPayload.getProgressUpdate2P3());
        requestPayload.setProgressUpdate2P3SectionsCompleted(applicationSubmitRequestTaskPayload.getProgressUpdate2P3SectionsCompleted());
        requestPayload.setProgressUpdate2Attachments(applicationSubmitRequestTaskPayload.getProgressUpdate2P3Attachments());

        submitProgressUpdate2(requestPayload, request.getAccountId());
    }

    private void submitProgressUpdate2(ProgressUpdate2P3RequestPayload requestPayload, Long accountId) {
        ProgressUpdate2SubmitParams apSubmitParams = ProgressUpdate2SubmitParams.builder()
                .accountId(accountId)
                .progressUpdate2Container(PU2_P3_SUBMIT_MAPPER.toProgressUpdate2P3Container(requestPayload, Phase.PHASE_3))
                .isDisaggregateUndertaking(requestPayload.getIsDisaggregateUndertaking())
                .build();

        progressUpdate2Service.submitProgressUpdate2(apSubmitParams);
    }
}
