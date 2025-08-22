package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.submit.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.ProgressUpdate1SubmitParams;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.service.ProgressUpdate1Service;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.submit.domain.ProgressUpdate1P3ApplicationSubmitRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.submit.transform.ProgressUpdate1P3SubmitMapper;

@Service
@RequiredArgsConstructor
public class ProgressUpdate1P3SubmitService {

    private final ProgressUpdate1Service progressUpdate1Service;
    private static final ProgressUpdate1P3SubmitMapper PU1_P3_SUBMIT_MAPPER = Mappers.getMapper(ProgressUpdate1P3SubmitMapper.class);

    public void submitProgressUpdate1Action(RequestTask requestTask) {
        Request request = requestTask.getRequest();
        ProgressUpdate1P3RequestPayload requestPayload = (ProgressUpdate1P3RequestPayload) request.getPayload();
        ProgressUpdate1P3ApplicationSubmitRequestTaskPayload applicationSubmitRequestTaskPayload =
                (ProgressUpdate1P3ApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        // Update request payload
        requestPayload.setProgressUpdate1P3(applicationSubmitRequestTaskPayload.getProgressUpdate1P3());
        requestPayload.setProgressUpdate1P3SectionsCompleted(applicationSubmitRequestTaskPayload.getProgressUpdate1P3SectionsCompleted());
        requestPayload.setProgressUpdate1Attachments(applicationSubmitRequestTaskPayload.getProgressUpdate1P3Attachments());

        // Submit PU1
        submitProgressUpdate1(requestPayload, request.getAccountId());
    }

    private void submitProgressUpdate1(ProgressUpdate1P3RequestPayload requestPayload, Long accountId) {
        ProgressUpdate1SubmitParams apSubmitParams = ProgressUpdate1SubmitParams.builder()
                .accountId(accountId)
                .progressUpdate1Container(PU1_P3_SUBMIT_MAPPER.toProgressUpdate1P3Container(requestPayload, Phase.PHASE_3))
                .isDisaggregateUndertaking(requestPayload.getIsDisaggregateUndertaking())
                .build();

        progressUpdate1Service.submitProgressUpdate1(apSubmitParams);
    }
}
