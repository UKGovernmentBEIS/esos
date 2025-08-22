package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.WorkflowService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestQueryService;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.esos.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.service.AccountClosureEmailService;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.service.AccountClosureSubmitService;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AccountClosureApplicationSubmitActionHandler implements RequestTaskActionHandler<RequestTaskActionEmptyPayload> {

    private final RequestTaskService requestTaskService;
    private final WorkflowService workflowService;
    private final AccountClosureSubmitService accountClosureSubmitService;
    private final RequestQueryService requestQueryService;
    private final AccountClosureEmailService accountClosureEmailService;
    private final RequestService requestService;

    private static final String ACCOUNT_CLOSED = "Workflow terminated by the system because the account was closed";

    @Override
    public void process(Long requestTaskId, RequestTaskActionType requestTaskActionType, AppUser appUser, RequestTaskActionEmptyPayload payload) {
        RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        Long accountId = requestTask.getRequest().getAccountId();

        accountClosureSubmitService.handleAccountClosureAction(accountId, requestTask);

        requestTask.getRequest().setSubmissionDate(LocalDateTime.now());

        // Complete task
        workflowService.completeTask(requestTask.getProcessTaskId());

        handleRelatedOpenWorkFlows(accountId);

        accountClosureEmailService.sendEmail(requestTask);
    }

    @Override
    public List<RequestTaskActionType> getTypes() {
        return List.of(RequestTaskActionType.ACCOUNT_CLOSURE_SUBMIT_APPLICATION);
    }

    private void handleRelatedOpenWorkFlows(Long accountId){
        List<Request> activeRequests = requestQueryService.findInProgressRequestsByAccount(accountId);

        activeRequests
                .forEach(request -> {
                    request.setStatus(RequestStatus.TERMINATED);
                    workflowService.deleteProcessInstance(request.getProcessInstanceId(), ACCOUNT_CLOSED);
                    requestService.addActionToRequest(
                            request,
                            null,
                            RequestActionType.REQUEST_TERMINATED,
                            null
                    );
                });
    }

}
