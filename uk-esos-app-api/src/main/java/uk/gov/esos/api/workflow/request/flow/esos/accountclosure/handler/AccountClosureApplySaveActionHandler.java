package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureSaveApplicationRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.service.AccountClosureApplyService;

import java.util.List;

@RequiredArgsConstructor
@Component
public class AccountClosureApplySaveActionHandler implements RequestTaskActionHandler<AccountClosureSaveApplicationRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;
    private final AccountClosureApplyService accountClosureApplyService;

    @Override
    public void process(Long requestTaskId, RequestTaskActionType requestTaskActionType, AppUser appUser, AccountClosureSaveApplicationRequestTaskActionPayload payload) {
        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        accountClosureApplyService.applySaveAction(payload, requestTask);
    }

    @Override
    public List<RequestTaskActionType> getTypes() {
        return List.of(
                RequestTaskActionType.ACCOUNT_CLOSURE_SAVE_APPLICATION_SUBMIT
        );
    }
}
