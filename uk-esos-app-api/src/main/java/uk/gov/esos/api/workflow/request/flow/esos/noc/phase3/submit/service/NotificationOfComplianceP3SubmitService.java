package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.noc.common.domain.NocSubmitParams;
import uk.gov.esos.api.reporting.noc.common.service.NocService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.domain.NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.transform.NotificationOfComplianceP3SubmitMapper;

@Service
@RequiredArgsConstructor
public class NotificationOfComplianceP3SubmitService {

    private final NocService nocService;
    private static final NotificationOfComplianceP3SubmitMapper NOTIFICATION_OF_COMPLIANCE_P3_SUBMIT_MAPPER = Mappers.getMapper(NotificationOfComplianceP3SubmitMapper.class);

    @Transactional
    public void submitNocAction(RequestTask requestTask) {
        Request request = requestTask.getRequest();
        NotificationOfComplianceP3RequestPayload requestPayload = (NotificationOfComplianceP3RequestPayload) request.getPayload();
        NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload applicationSubmitRequestTaskPayload =
                (NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        // Update request payload
        requestPayload.setNoc(applicationSubmitRequestTaskPayload.getNoc());
        requestPayload.setNocSectionsCompleted(applicationSubmitRequestTaskPayload.getNocSectionsCompleted());
        requestPayload.setNocAttachments(applicationSubmitRequestTaskPayload.getNocAttachments());
        requestPayload.setAccountOriginatedData(applicationSubmitRequestTaskPayload.getAccountOriginatedData());

        // Submit NOC
        submitNoc(requestPayload, request.getAccountId());
    }

    private void submitNoc(NotificationOfComplianceP3RequestPayload requestPayload, Long accountId) {
        NocSubmitParams nocSubmitParams = NocSubmitParams.builder()
                .accountId(accountId)
                .nocContainer(NOTIFICATION_OF_COMPLIANCE_P3_SUBMIT_MAPPER.toNocP3Container(requestPayload, Phase.PHASE_3))
                .build();

        nocService.submitNoc(nocSubmitParams);
    }
}
