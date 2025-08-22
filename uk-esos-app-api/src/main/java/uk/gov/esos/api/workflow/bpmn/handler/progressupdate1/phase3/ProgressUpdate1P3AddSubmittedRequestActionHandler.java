package uk.gov.esos.api.workflow.bpmn.handler.progressupdate1.phase3;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.submit.service.ProgressUpdate1P3AddSubmittedRequestActionService;

@Service
@RequiredArgsConstructor
public class ProgressUpdate1P3AddSubmittedRequestActionHandler implements JavaDelegate {

    private final ProgressUpdate1P3AddSubmittedRequestActionService addSubmittedRequestActionService;


    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        String requestId = (String) delegateExecution.getVariable(BpmnProcessConstants.REQUEST_ID);
        addSubmittedRequestActionService.addRequestAction(requestId);
    }


}
