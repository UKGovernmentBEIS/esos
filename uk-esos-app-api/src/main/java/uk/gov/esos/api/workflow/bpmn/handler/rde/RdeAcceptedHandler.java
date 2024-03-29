package uk.gov.esos.api.workflow.bpmn.handler.rde;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.rde.service.RdeRespondedService;

@Service
@RequiredArgsConstructor
public class RdeAcceptedHandler implements JavaDelegate {

    private final RdeRespondedService service;

    @Override
    public void execute(DelegateExecution execution) {
        service.respond((String) execution.getVariable(BpmnProcessConstants.REQUEST_ID));
    }
}
