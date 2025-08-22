package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3SaveApplicationRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.service.ProgressUpdate1P3ApplyService;

import java.util.List;

@RequiredArgsConstructor
@Component
public class ProgressUpdate1P3ApplySaveActionHandler  implements RequestTaskActionHandler<ProgressUpdate1P3SaveApplicationRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;
    private final ProgressUpdate1P3ApplyService progressUpdate1P3ApplyService;

    @Override
    public void process(Long requestTaskId, RequestTaskActionType requestTaskActionType, AppUser appUser,
                        ProgressUpdate1P3SaveApplicationRequestTaskActionPayload payload) {

        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);

        progressUpdate1P3ApplyService.applySaveAction(payload, requestTask);

    }

    @Override
    public List<RequestTaskActionType> getTypes() {
        return List.of(
                RequestTaskActionType.PROGRESS_UPDATE_1_P3_SAVE_APPLICATION_SUBMIT
        );
    }
}
