package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.common.service;

import org.springframework.stereotype.Service;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestParams;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestIdGenerator;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3RequestMetadata;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3RequestMetadata;

import java.util.List;

@Service
public class ProgressUpdate2SubmitRequestIdGenerator implements RequestIdGenerator {

    @Override
    public String generate(RequestParams params) {
        Long accountId = params.getAccountId();
        ProgressUpdate2P3RequestMetadata metaData = (ProgressUpdate2P3RequestMetadata) params.getRequestMetadata();
        Phase phase = metaData.getPhase();

        return String.format("%s%06d-%s", getPrefix(), accountId, phase.getCode());
    }

    @Override
    public List<RequestType> getTypes() {
        return List.of(RequestType.PROGRESS_UPDATE_2_P3);
    }

    @Override
    public String getPrefix() {
        return "PU2";
    }
}
