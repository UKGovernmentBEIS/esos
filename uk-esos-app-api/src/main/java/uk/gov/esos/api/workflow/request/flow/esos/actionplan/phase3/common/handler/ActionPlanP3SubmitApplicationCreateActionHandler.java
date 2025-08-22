package uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.workflow.request.StartProcessRequestService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestMetadataType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestCreateActionHandler;
import uk.gov.esos.api.workflow.request.flow.common.domain.RequestCreateActionEmptyPayload;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestParams;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3RequestMetadata;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3RequestPayload;

@Component
@RequiredArgsConstructor
public class ActionPlanP3SubmitApplicationCreateActionHandler implements RequestCreateActionHandler<RequestCreateActionEmptyPayload> {

    private final StartProcessRequestService startProcessRequestService;

    @Override
    public String process(Long accountId, RequestCreateActionType type, RequestCreateActionEmptyPayload payload, AppUser appUser) {
        RequestParams requestParams = RequestParams.builder()
                .type(RequestType.ACTION_PLAN_P3)
                .accountId(accountId)
                .requestPayload(ActionPlanP3RequestPayload.builder()
                        .payloadType(RequestPayloadType.ACTION_PLAN_P3_REQUEST_PAYLOAD)
                        .operatorAssignee(appUser.getUserId())
                        .build())
                .requestMetadata(ActionPlanP3RequestMetadata.builder()
                        .type(RequestMetadataType.ACTION_PLAN_P3)
                        .phase(Phase.PHASE_3)
                        .build())
                .build();

        final Request request = startProcessRequestService.startProcess(requestParams);

        return request.getId();
    }

    @Override
    public RequestCreateActionType getType() {
        return RequestCreateActionType.ACTION_PLAN_P3;
    }
}
