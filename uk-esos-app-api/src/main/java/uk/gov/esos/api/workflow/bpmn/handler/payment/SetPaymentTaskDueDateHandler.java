package uk.gov.esos.api.workflow.bpmn.handler.payment;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;

import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestExpirationType;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestTaskTimeManagementService;

@Service
@RequiredArgsConstructor
public class SetPaymentTaskDueDateHandler implements JavaDelegate {

    private final RequestTaskTimeManagementService requestTaskTimeManagementService;

    @Override
    public void execute(DelegateExecution execution) {
        final String requestId = (String) execution.getVariable(BpmnProcessConstants.REQUEST_ID);
		final LocalDate expirationDate = ((Date) execution
				.getVariable(BpmnProcessConstants.PAYMENT_EXPIRATION_DATE)).toInstant()
				.atZone(ZoneId.systemDefault()).toLocalDate();
        
        requestTaskTimeManagementService.setDueDateToTasks(requestId, RequestExpirationType.PAYMENT, expirationDate);
    }
}
