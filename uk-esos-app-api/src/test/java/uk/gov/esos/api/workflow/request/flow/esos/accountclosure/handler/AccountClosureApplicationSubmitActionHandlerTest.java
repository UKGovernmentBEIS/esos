package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.handler;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.WorkflowService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestQueryService;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.service.AccountClosureEmailService;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.service.AccountClosureSubmitService;

import java.util.List;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountClosureApplicationSubmitActionHandlerTest {

    @InjectMocks
    private AccountClosureApplicationSubmitActionHandler submitActionHandler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private WorkflowService workflowService;

    @Mock
    private AccountClosureSubmitService accountClosureSubmitService;

    @Mock
    private RequestQueryService requestQueryService;

    @Mock
    private AccountClosureEmailService accountClosureEmailService;

    @Mock
    private RequestService requestService;

    @Test
    void process() {

        Long requestTaskId = 1L;
        String processTaskId = "processTaskId";
        String requestId = "id";
        Long accountId = 1L;
        String processInstanceId = "processInstanceId";
        String reason = "Workflow terminated by the system because the account was closed";

        RequestTask requestTask = RequestTask.builder()
                .request(Request.builder().id(requestId).accountId(accountId).build())
                .processTaskId(processTaskId)
                .build();
        AppUser user = AppUser.builder().build();
        RequestTaskActionEmptyPayload payload = RequestTaskActionEmptyPayload.builder()
                .payloadType(RequestTaskActionPayloadType.EMPTY_PAYLOAD)
                .build();

        Request activeRequest = Request.builder().accountId(accountId).type(RequestType.ACTION_PLAN_P3).processInstanceId(processInstanceId).build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        when(requestQueryService.findInProgressRequestsByAccount(accountId)).thenReturn(List.of(activeRequest));

        submitActionHandler.process(requestTaskId,
                RequestTaskActionType.ACCOUNT_CLOSURE_SUBMIT_APPLICATION,
                user,
                payload);

        Assertions.assertEquals(activeRequest.getStatus(), RequestStatus.TERMINATED);

        verify(workflowService, times(1)).deleteProcessInstance(processInstanceId, reason);

        verify(requestQueryService, times(1)).findInProgressRequestsByAccount(accountId);

        verify(requestTaskService, times(1)).findTaskById(requestTaskId);

        verify(workflowService, times(1)).completeTask(processTaskId);

        verify(accountClosureSubmitService, times(1)).handleAccountClosureAction(requestTask.getRequest().getAccountId(), requestTask);

        verify(workflowService, times(1)).completeTask(requestTask.getProcessTaskId());

        verify(accountClosureEmailService, times(1)).sendEmail(requestTask);

    }

    @Test
    void getTypes_shouldReturnCorrectActionTypes() {
        // Act
        List<RequestTaskActionType> actionTypes = submitActionHandler.getTypes();

        // Assert
        Assertions.assertEquals(List.of(RequestTaskActionType.ACCOUNT_CLOSURE_SUBMIT_APPLICATION), actionTypes);
    }

}