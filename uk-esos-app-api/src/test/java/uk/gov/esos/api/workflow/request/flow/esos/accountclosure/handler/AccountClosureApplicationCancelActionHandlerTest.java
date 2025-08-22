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
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.service.AccountClosureApplyService;

import java.util.List;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountClosureApplicationCancelActionHandlerTest {

    @InjectMocks
    private AccountClosureApplicationCancelActionHandler submitActionHandler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private WorkflowService workflowService;

    @Mock
    private AccountClosureApplyService applyService;

    @Test
    void process() {

        Long requestTaskId = 1L;
        String processTaskId = "processTaskId";
        String requestId = "id";
        Long accountId = 1L;

        RequestTask requestTask = RequestTask.builder()
                .request(Request.builder().id(requestId).accountId(accountId).build())
                .processTaskId(processTaskId)
                .build();

        AppUser user = AppUser.builder().build();

        RequestTaskActionEmptyPayload payload = RequestTaskActionEmptyPayload.builder()
                .payloadType(RequestTaskActionPayloadType.EMPTY_PAYLOAD)
                .build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        submitActionHandler.process(requestTaskId,
                RequestTaskActionType.ACCOUNT_CLOSURE_CANCEL_APPLICATION,
                user,
                payload);

        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(workflowService, times(1)).completeTask(processTaskId);
        verify(applyService, times(1)).cancelAccountClosure(requestTask.getRequest());

    }

    @Test
    void getTypes() {
        // Act
        List<RequestTaskActionType> actionTypes = submitActionHandler.getTypes();

        // Assert
        Assertions.assertEquals(List.of(RequestTaskActionType.ACCOUNT_CLOSURE_CANCEL_APPLICATION), actionTypes);
    }
}