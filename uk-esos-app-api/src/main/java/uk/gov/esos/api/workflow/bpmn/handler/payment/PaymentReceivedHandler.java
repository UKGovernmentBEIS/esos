package uk.gov.esos.api.workflow.bpmn.handler.payment;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.payment.service.PaymentCompleteRequestActionService;

@Component
@RequiredArgsConstructor
public class PaymentReceivedHandler implements JavaDelegate {

    private final PaymentCompleteRequestActionService paymentCompleteRequestActionService;

    @Override
    public void execute(DelegateExecution execution) {
        paymentCompleteRequestActionService.markAsReceived((String) execution.getVariable(BpmnProcessConstants.REQUEST_ID));
    }
}
