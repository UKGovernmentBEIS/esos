package uk.gov.esos.api.workflow.bpmn.handler.noc.phase3;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;

@Service
public class NotificationOfComplianceP3SendDocumentHandler implements JavaDelegate {

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        //TODO: implement if needed
    }
}
