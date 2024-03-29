package uk.gov.esos.api.workflow.bpmn.handler.applicationreview;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestExpirationType;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestTaskTimeManagementService;

@Service
@RequiredArgsConstructor
public class PauseReviewExpirationTimerHandler implements JavaDelegate {

    private final RequestTaskTimeManagementService requestTaskTimeManagementService;

    @Override
    public void execute(DelegateExecution execution) {
		requestTaskTimeManagementService.pauseTasks((String) execution.getVariable(BpmnProcessConstants.REQUEST_ID),
				RequestExpirationType.APPLICATION_REVIEW);
    }
}
