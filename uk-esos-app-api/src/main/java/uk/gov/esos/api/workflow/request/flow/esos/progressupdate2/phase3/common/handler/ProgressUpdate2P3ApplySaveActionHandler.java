package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3SaveApplicationRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.service.ProgressUpdate2P3ApplyService;

import java.util.List;

@RequiredArgsConstructor
@Component
public class ProgressUpdate2P3ApplySaveActionHandler  implements RequestTaskActionHandler<ProgressUpdate2P3SaveApplicationRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;
    private final ProgressUpdate2P3ApplyService progressUpdate2P3ApplyService;

    @Override
    public void process(Long requestTaskId, RequestTaskActionType requestTaskActionType, AppUser appUser,
                        ProgressUpdate2P3SaveApplicationRequestTaskActionPayload payload) {

        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);

        progressUpdate2P3ApplyService.applySaveAction(payload, requestTask);

    }

    @Override
    public List<RequestTaskActionType> getTypes() {
        return List.of(
                RequestTaskActionType.PROGRESS_UPDATE_2_P3_SAVE_APPLICATION_SUBMIT
        );
    }
}
