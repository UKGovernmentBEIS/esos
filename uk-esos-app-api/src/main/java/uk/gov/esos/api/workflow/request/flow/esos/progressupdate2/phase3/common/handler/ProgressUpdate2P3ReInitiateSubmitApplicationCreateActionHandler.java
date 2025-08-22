package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.StartProcessRequestService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestCreateActionHandler;
import uk.gov.esos.api.workflow.request.flow.common.domain.ReportRelatedRequestCreateActionPayload;

@Component
@RequiredArgsConstructor
public class ProgressUpdate2P3ReInitiateSubmitApplicationCreateActionHandler  implements RequestCreateActionHandler<ReportRelatedRequestCreateActionPayload> {

    private final RequestService requestService;
    private final StartProcessRequestService startProcessRequestService;

    @Override
    public String process(Long accountId, RequestCreateActionType type, ReportRelatedRequestCreateActionPayload payload, AppUser appUser) {
        Request request = requestService.findRequestById(payload.getRequestId());

        // Restart action plan
        startProcessRequestService.reStartProcess(request);

        // Add action
        requestService.addActionToRequest(
                request,
                null,
                RequestActionType.PROGRESS_UPDATE_2_P3_APPLICATION_RE_INITIATED,
                appUser.getUserId());

        return request.getId();
    }

    @Override
    public RequestCreateActionType getType() {
        return RequestCreateActionType.RE_INITIATE_PROGRESS_UPDATE_2_P3;
    }
}
