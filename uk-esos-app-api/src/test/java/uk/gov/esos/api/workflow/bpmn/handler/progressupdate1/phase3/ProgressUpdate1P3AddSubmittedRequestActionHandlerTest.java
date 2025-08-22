package uk.gov.esos.api.workflow.bpmn.handler.progressupdate1.phase3;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.submit.service.ProgressUpdate1P3AddSubmittedRequestActionService;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressUpdate1P3AddSubmittedRequestActionHandlerTest {

    @InjectMocks
    private ProgressUpdate1P3AddSubmittedRequestActionHandler handler;

    @Mock
    private ProgressUpdate1P3AddSubmittedRequestActionService addSubmittedRequestActionService;

    @Mock
    private DelegateExecution delegateExecution;

    @Test
    void execute() throws Exception {
        String requestId = "REQ-1";

        when(delegateExecution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);

        handler.execute(delegateExecution);

        verify(delegateExecution, times(1)).getVariable(BpmnProcessConstants.REQUEST_ID);
        verify(addSubmittedRequestActionService, times(1)).addRequestAction(requestId);
    }

}