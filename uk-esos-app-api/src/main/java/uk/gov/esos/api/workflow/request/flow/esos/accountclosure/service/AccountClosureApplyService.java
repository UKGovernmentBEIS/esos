package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureSaveApplicationRequestTaskActionPayload;

@Service
@RequiredArgsConstructor
public class AccountClosureApplyService {

    private final RequestService requestService;


    @Transactional
    public void applySaveAction(AccountClosureSaveApplicationRequestTaskActionPayload taskActionPayload, RequestTask requestTask) {
        AccountClosureApplicationRequestTaskPayload taskPayload =
                (AccountClosureApplicationRequestTaskPayload) requestTask.getPayload();

        taskPayload.setAccountClosure(taskActionPayload.getAccountClosure());
    }

    @Transactional
    public void cancelAccountClosure(Request request) {

        request.setStatus(RequestStatus.CANCELLED);

        requestService.addActionToRequest(
                request,
                null,
                RequestActionType.ACCOUNT_CLOSURE_APPLICATION_CANCELLED,
                request.getPayload().getRegulatorAssignee()
        );
    }
}
