package uk.gov.esos.api.workflow.request.flow.esos.noc.common.service;

import org.springframework.stereotype.Service;

import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestParams;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestIdGenerator;
import uk.gov.esos.api.workflow.request.flow.esos.noc.common.domain.NotificationOfComplianceRequestMetadata;

import java.util.List;

@Service
public class NotificationOfComplianceSubmitRequestIdGenerator implements RequestIdGenerator {

    @Override
    public String generate(RequestParams params) {
        Long accountId = params.getAccountId();
        NotificationOfComplianceRequestMetadata metaData = (NotificationOfComplianceRequestMetadata) params.getRequestMetadata();
        Phase phase = metaData.getPhase();

        return String.format("%s%06d-%s", getPrefix(), accountId, phase.getCode());
    }

    @Override
    public List<RequestType> getTypes() {
        return List.of(RequestType.NOTIFICATION_OF_COMPLIANCE_P3);
    }

    @Override
    public String getPrefix() {
        return "NOC";
    }
}
